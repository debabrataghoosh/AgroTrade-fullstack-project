import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});

export async function POST(req: NextRequest) {
  const { product, customerEmail } = await req.json();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "upi"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: product.title,
              images: product.image ? [product.image] : [],
            },
            unit_amount: product.price * 100, // price in paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: customerEmail,
      shipping_address_collection: { allowed_countries: ["IN"] },
      success_url: `${req.nextUrl.origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/checkout?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "Stripe session error" }, { status: 500 });
  }
} 