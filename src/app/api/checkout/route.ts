import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';

// Requires: STRIPE_SECRET_KEY in .env.local
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const schema = z.object({
  name:         z.string().min(1).max(200),
  businessName: z.string().min(1).max(200),
  email:        z.string().email().max(200),
  phone:        z.string().min(1).max(50),
  businessType: z.string().min(1).max(100),
  notes:        z.string().max(1000).optional(),
  addOns:       z.array(z.string().max(50)).max(10).optional(),
});

const ADDON_PRICES: Record<string, number> = {
  seo: 9700,
  'missed-call': 14700,
  'ai-quote': 9700,
  gmb: 9700,
};

const ADDON_LABELS: Record<string, string> = {
  seo: 'Google Ranking Boost ($97)',
  'missed-call': 'Missed Call Text-Back ($147)',
  'ai-quote': 'AI Quote Assistant ($97)',
  gmb: 'Google Profile Optimization ($97)',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parse = schema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json(
        { error: 'Invalid request data.' },
        { status: 400 },
      );
    }

    const { name, businessName, email, phone, businessType, notes, addOns } = parse.data;

    const addOnTotal = (addOns ?? []).reduce((sum, id) => sum + (ADDON_PRICES[id] ?? 0), 0);
    const amount = 15000 + addOnTotal;
    const amountDollars = (amount / 100).toFixed(2);

    const addonLines = (addOns ?? []).map(id => ADDON_LABELS[id] ?? id);
    const lineItems = ['Custom Website – 5 Pages, 7-Day Delivery ($150.00)', ...addonLines];
    const description = `${businessName} | ${lineItems.join(' + ')} | Total: $${amountDollars} CAD`;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'cad',
      receipt_email: email,
      description,
      metadata: {
        name,
        businessName,
        email,
        phone,
        businessType,
        notes: notes ?? '',
        // Individual line items for easy filtering/reporting in Stripe
        item_website: '$150.00',
        ...(addOns ?? []).reduce<Record<string, string>>((acc, id) => {
          if (ADDON_PRICES[id]) acc[`item_${id}`] = `$${(ADDON_PRICES[id] / 100).toFixed(2)}`;
          return acc;
        }, {}),
        total_cad: `$${amountDollars}`,
        source: 'website-150-funnel',
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('[/api/checkout]', err);
    return NextResponse.json(
      { error: 'Unable to process payment. Please try again.' },
      { status: 500 },
    );
  }
}
