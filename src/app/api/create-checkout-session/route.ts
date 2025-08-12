import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: NextRequest) {
  try {
    const { product, customerEmail } = await req.json();

    // Validate required fields
    if (!product || !product.title || !product.price) {
      console.error('Missing product information:', { product });
      return NextResponse.json({ 
        error: "Invalid product information" 
      }, { status: 400 });
    }

    if (!customerEmail) {
      console.error('Missing customer email');
      return NextResponse.json({ 
        error: "Customer email is required" 
      }, { status: 400 });
    }

    // Validate Stripe key
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Stripe secret key not configured');
      return NextResponse.json({ 
        error: "Payment configuration error" 
      }, { status: 500 });
    }

    // Validate price
    const price = parseFloat(product.price);
    if (isNaN(price) || price <= 0) {
      console.error('Invalid price:', product.price);
      return NextResponse.json({ 
        error: "Invalid product price" 
      }, { status: 400 });
    }

    console.log('Creating Stripe session for:', {
      productTitle: product.title,
      price: price,
      customerEmail: customerEmail
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: product.title,
              images: product.image ? [product.image] : [],
            },
            unit_amount: Math.round(price * 100), // Ensure price is in paise and rounded
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

    console.log('Stripe session created successfully:', session.id);
    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    
    // Handle specific Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ 
        error: `Payment error: ${error.message}` 
      }, { status: 400 });
    }

    // Handle other errors
    return NextResponse.json({ 
      error: "Failed to create checkout session. Please try again." 
    }, { status: 500 });
  }
} 