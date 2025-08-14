import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Order from '@/lib/models/Order';

interface OrderItem {
  productId?: string;
  title?: string;
  image?: string;
  price?: number;
  quantity?: number;
  unit?: string;
  category?: string;
  seller: string;
}

export async function POST(req: NextRequest) {
  try {
    console.log('Orders API POST called');
    
    // Connect to database
    await dbConnect();
    console.log('Database connected for order creation');
    
    // Parse request data
    const data = await req.json();
    console.log('Order data received:', {
      userEmail: data.userEmail,
      itemsCount: data.items?.length,
      paymentMethod: data.paymentMethod,
      totalAmount: data.totalAmount
    });
    
    // Validate required fields
    if (!data.userEmail) {
      console.error('Missing userEmail in order data');
      return NextResponse.json({ 
        error: 'User email is required' 
      }, { status: 400 });
    }
    
    if (!data.items || data.items.length === 0) {
      console.error('Missing items in order data');
      return NextResponse.json({ 
        error: 'Order must contain at least one item' 
      }, { status: 400 });
    }
    
    // Set default values for COD orders
    if (data.paymentMethod === 'cod') {
      data.paymentStatus = 'pending';
      data.status = 'Placed';
    }
    
    // Create the order
    const order = await Order.create(data);
    console.log('Order created successfully:', {
      orderId: order._id,
      userEmail: order.userEmail,
      status: order.status,
      paymentMethod: order.paymentMethod
    });
    
    return NextResponse.json(order, { status: 201 });
    
  } catch (error: any) {
    console.error('Error creating order:', error);
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      return NextResponse.json({ 
        error: 'Invalid order data',
        details: error.message 
      }, { status: 400 });
    }
    
    if (error.name === 'MongoError' && error.code === 11000) {
      return NextResponse.json({ 
        error: 'Order already exists' 
      }, { status: 409 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create order. Please try again.' 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();
  const userEmail = req.nextUrl.searchParams.get('userEmail');
  const sellerEmail = req.nextUrl.searchParams.get('sellerEmail');
  
  console.log('Orders API called with:', { userEmail, sellerEmail });
  
  if (!userEmail && !sellerEmail) {
    console.log('No email provided, returning empty array');
    return NextResponse.json([], { status: 200 });
  }
  
  let query = {};
  if (userEmail) {
    query = { userEmail };
    console.log('Querying by userEmail:', userEmail);
  } else if (sellerEmail) {
    query = { 'items.seller': sellerEmail };
    console.log('Querying by sellerEmail:', sellerEmail);
  }
  
  const orders = await Order.find(query).sort({ createdAt: -1 });
  console.log('Found orders:', orders.length);
  console.log('Sample order items:', orders.slice(0, 2).map(o => o.items.map((i: OrderItem) => ({ 
    title: i.title, 
    image: i.image,
    price: i.price,
    quantity: i.quantity,
    unit: i.unit,
    seller: i.seller 
  }))));
  
  return NextResponse.json(orders);
}