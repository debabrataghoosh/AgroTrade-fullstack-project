import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const { product, customerEmail, quantity = 1 } = await req.json();

    console.log('Received checkout request:', { product, customerEmail, quantity });

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

    // Validate quantity
    const orderQuantity = parseInt(quantity) || 1;
    if (orderQuantity < 1 || orderQuantity > 100) {
      console.error('Invalid quantity:', orderQuantity);
      return NextResponse.json({ 
        error: "Invalid quantity. Must be between 1 and 100." 
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

    // Calculate total price
    const totalPrice = price * orderQuantity;

    // Check minimum amount for Stripe (50 cents = $0.50)
    // Approximate conversion: ₹1 ≈ $0.012 (as of 2024)
    // So ₹50 ≈ $0.60, which is above the $0.50 minimum
    const minimumAmountINR = 50; // ₹50 minimum
    if (totalPrice < minimumAmountINR) {
      console.error('Amount too low for Stripe:', { totalPrice, minimumAmountINR });
      return NextResponse.json({ 
        error: `Minimum order amount is ₹${minimumAmountINR}. Your order total is ₹${totalPrice}. Please increase the quantity or choose a different product.`,
        code: "AMOUNT_TOO_LOW",
        minimumAmount: minimumAmountINR,
        currentAmount: totalPrice
      }, { status: 400 });
    }

    // Validate and clean image URL
    let validImageUrl = null;
    if (product.image && product.image.trim()) {
      try {
        // If it's already a full URL, validate it
        if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
          const url = new URL(product.image);
          validImageUrl = product.image;
        } else if (product.image.startsWith('/')) {
          // If it's a relative path, make it absolute
          validImageUrl = `${req.nextUrl.origin}${product.image}`;
        } else {
          // If it's just a filename or path, try to construct a valid URL
          console.warn('Potentially invalid image URL format:', product.image);
        }
      } catch (error) {
        console.warn('Invalid image URL:', product.image, error);
      }
    }

    console.log('Creating Stripe session for:', {
      productTitle: product.title,
      price: price,
      quantity: orderQuantity,
      totalPrice: totalPrice,
      stripeLineItemQuantity: orderQuantity,
      stripeUnitAmount: Math.round(price * 100),
      customerEmail: customerEmail,
      productImage: product.image,
      validImageUrl: validImageUrl
    });

            const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "inr",
                product_data: {
                  name: product.title,
                  ...(validImageUrl && { images: [validImageUrl] }),
                },
                unit_amount: Math.round(price * 100), // Ensure price is in paise and rounded
              },
              quantity: orderQuantity, // Use the actual order quantity - Fixed quantity issue
            },
          ],
          mode: "payment",
          customer_email: customerEmail,
          shipping_address_collection: { allowed_countries: ["IN"] },
          success_url: `${req.nextUrl.origin}/order-success?session_id={CHECKOUT_SESSION_ID}&productId=${product._id || product.id}&title=${encodeURIComponent(product.title)}&image=${encodeURIComponent(product.image || '')}&price=${price}&quantity=${orderQuantity}&unit=${encodeURIComponent(product.unit || 'kg')}&category=${encodeURIComponent(product.category || '')}&seller=${encodeURIComponent(product.sellerEmail || '')}`,
          cancel_url: `${req.nextUrl.origin}/checkout?canceled=true`,
          metadata: {
            productId: product._id || product.id || '',
            productTitle: product.title,
            productPrice: price.toString(),
            productQuantity: orderQuantity.toString(),
            productUnit: product.unit || 'kg',
            productCategory: product.category || '',
            productImage: product.image || '',
            sellerEmail: product.sellerEmail || '',
          },
        });

    console.log('Stripe session created successfully:', session.id);
    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id,
      totalPrice: totalPrice
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    
    // Handle specific Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ 
        error: `Payment error: ${error.message}`,
        code: "STRIPE_ERROR"
      }, { status: 400 });
    }

    // Handle other errors
    return NextResponse.json({ 
      error: "Failed to create checkout session. Please try again." 
    }, { status: 500 });
  }
} 