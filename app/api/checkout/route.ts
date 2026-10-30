import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST() {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('ERROR: STRIPE_SECRET_KEY is missing in .env.local');
      return NextResponse.json(
        { error: 'Stripe secret key missing' },
        { status: 500 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'BLANK. Player Pass',
              description: 'Become an official player.',
            },
            unit_amount: 100, // 1.00 USD
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}?success=true`,
      cancel_url: `${appUrl}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error?.message || error);
    return NextResponse.json(
      { error: error?.message || 'Internal Error' },
      { status: 500 }
    );
  }
}
