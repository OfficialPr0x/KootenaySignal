import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabase } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig || !WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error('[stripe-webhook] Invalid signature:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = getSupabase();

  try {
    switch (event.type) {
      // ── New subscription started via checkout ──────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== 'subscription') break;

        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        // Fetch full subscription object for period dates
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        await supabase.from('subscriptions').upsert({
          stripe_subscription_id: subscriptionId,
          stripe_customer_id: customerId,
          stripe_price_id: subscription.items.data[0]?.price?.id ?? null,
          plan_name: session.metadata?.plan_name ?? '',
          plan_slug: session.metadata?.plan_slug ?? '',
          customer_email: session.customer_details?.email ?? null,
          customer_name: session.customer_details?.name ?? null,
          status: subscription.status,
          current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
          current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
          amount: subscription.items.data[0]?.price?.unit_amount ?? null,
          currency: subscription.currency,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'stripe_subscription_id' });
        break;
      }

      // ── Subscription updated (upgrade, downgrade, pause) ──────────────
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        await supabase.from('subscriptions').update({
          stripe_price_id: subscription.items.data[0]?.price?.id ?? null,
          plan_slug: subscription.metadata?.plan_slug ?? null,
          plan_name: subscription.metadata?.plan_name ?? null,
          status: subscription.status,
          current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
          current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
          amount: subscription.items.data[0]?.price?.unit_amount ?? null,
          updated_at: new Date().toISOString(),
        }).eq('stripe_subscription_id', subscription.id);
        break;
      }

      // ── Subscription cancelled ─────────────────────────────────────────
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await supabase.from('subscriptions').update({
          status: 'canceled',
          cancel_at_period_end: false,
          updated_at: new Date().toISOString(),
        }).eq('stripe_subscription_id', subscription.id);
        break;
      }

      // ── Monthly renewal paid ───────────────────────────────────────────
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = (invoice as any).subscription as string | null;
        if (!subId) break;

        const subscription = await stripe.subscriptions.retrieve(subId);

        await supabase.from('subscriptions').update({
          status: 'active',
          current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
          current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }).eq('stripe_subscription_id', subId);
        break;
      }

      // ── Payment failed ─────────────────────────────────────────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = (invoice as any).subscription as string | null;
        if (!subId) break;

        await supabase.from('subscriptions').update({
          status: 'past_due',
          updated_at: new Date().toISOString(),
        }).eq('stripe_subscription_id', subId);
        break;
      }

      default:
        // Unhandled event — not an error
        break;
    }
  } catch (err) {
    console.error('[stripe-webhook] Handler error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
