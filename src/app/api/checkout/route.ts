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

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'cad',
      receipt_email: email,
      description: `Website Build — ${businessName}`,
      metadata: {
        name,
        businessName,
        email,
        phone,
        businessType,
        notes: notes ?? '',
        addOns: (addOns ?? []).join(', '),
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
