import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { dbConnect } from '@/lib/mongodb';
import Order from '@/lib/models/Order';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// GET method for testing webhook endpoint
export async function GET() {
  return NextResponse.json({ 
    message: 'Stripe webhook endpoint is working',
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature');

  console.log('Webhook received:', { 
    hasBody: !!body, 
    bodyLength: body.length, 
    hasSignature: !!sig,
    endpointSecret: !!endpointSecret 
  });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
    console.log('Webhook event verified:', event.type);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  try {
    await dbConnect();
    console.log('Database connected for webhook processing');

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Payment successful for session:', {
          sessionId: session.id,
          customerEmail: session.customer_email,
          metadata: session.metadata,
          customerDetails: session.customer_details,
          amountTotal: session.amount_total,
          currency: session.currency
        });
        
        // Create order in database
        if (session.customer_email && session.metadata) {
          // Get shipping address from session or use defaults
          let shippingAddress = {
            name: 'Customer',
            phone: 'Not provided',
            address: 'Address will be collected later',
            city: 'City will be collected later',
            state: 'State will be collected later',
            pincode: 'Pincode will be collected later',
          };

          // Try to get address from customer details if available
          if (session.customer_details) {
            shippingAddress = {
              name: session.customer_details.name || 'Customer',
              phone: session.customer_details.phone || 'Not provided',
              address: session.customer_details.address?.line1 || 'Address will be collected later',
              city: session.customer_details.address?.city || 'City will be collected later',
              state: session.customer_details.address?.state || 'State will be collected later',
              pincode: session.customer_details.address?.postal_code || 'Pincode will be collected later',
            };
          }

          const orderData = {
            userEmail: session.customer_email,
            items: [
              {
                productId: session.metadata.productId || '',
                title: session.metadata.productTitle || 'Product',
                image: session.metadata.productImage || '',
                price: parseFloat(session.metadata.productPrice || '0'),
                quantity: parseInt(session.metadata.productQuantity || '1'),
                unit: session.metadata.productUnit || 'kg',
                category: session.metadata.productCategory || '',
                seller: session.metadata.sellerEmail || '',
              }
            ],
            address: shippingAddress,
            status: 'Placed',
            stripeSessionId: session.id,
            paymentMethod: 'online',
            paymentStatus: 'paid',
            totalAmount: session.amount_total ? session.amount_total / 100 : 0, // Convert from paise to rupees
          };

          console.log('Creating order with data:', orderData);

          const order = await Order.create(orderData);
          console.log('Order created successfully:', {
            orderId: order._id,
            userEmail: order.userEmail,
            status: order.status
          });

          // Also log the order items for verification
          console.log('Order items created:', order.items);
        } else {
          console.error('Missing required data for order creation:', {
            hasCustomerEmail: !!session.customer_email,
            hasMetadata: !!session.metadata,
            metadata: session.metadata
          });
        }
        break;

      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object.id);
        break;

      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
