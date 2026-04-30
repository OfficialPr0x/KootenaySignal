import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://kootenaysignal.com';

const PLANS: Record<string, {
  name: string;
  description: string;
  amount: number; // cents CAD
}> = {
  'automation': {
    name: 'Automation Management',
    description: 'Ongoing automation and workflow management. New automations, monitoring, optimization — your systems always running.',
    amount: 49700,
  },
  'seo-retainer': {
    name: 'SEO Retainer',
    description: 'Ongoing search visibility management. Backlinking, content strategy, ranking monitoring, technical SEO — fully managed monthly.',
    amount: 99700,
  },
  'ads-management': {
    name: 'Ads Management',
    description: 'Fully managed Google and Meta advertising. Campaign build, optimization, reporting, and scaling — all done for you.',
    amount: 100000,
  },
  'signal-core': {
    name: 'SignalCore™',
    description: 'Foundation retainer for regional search dominance. Google Business management, local citations, core SEO — all handled monthly.',
    amount: 150000,
  },
  'search-vault': {
    name: 'SearchVault™',
    description: 'Advanced search visibility retainer. Everything in SignalCore plus content strategy, backlink campaigns, and competitive analysis.',
    amount: 250000,
  },
  'search-sync': {
    name: 'SearchSync™',
    description: 'Full multi-platform sync retainer. Consistent presence across all search platforms, directories, review sites, and social.',
    amount: 300000,
  },
};

const schema = z.object({
  plan: z.enum(['automation', 'seo-retainer', 'ads-management', 'signal-core', 'search-vault', 'search-sync']),
  email: z.string().email().max(200).optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  const { plan, email } = parsed.data;
  const planData = PLANS[plan];

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      ...(email ? { customer_email: email } : {}),
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: planData.name,
              description: planData.description,
            },
            unit_amount: planData.amount,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${BASE_URL}/?subscribed=true`,
      cancel_url: `${BASE_URL}/#retainers`,
      metadata: {
        plan_slug: plan,
        plan_name: planData.name,
        source: 'retainers-section',
      },
      subscription_data: {
        metadata: {
          plan_slug: plan,
          plan_name: planData.name,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[/api/subscribe]', err);
    return NextResponse.json({ error: 'Unable to create checkout session. Please try again.' }, { status: 500 });
  }
}
