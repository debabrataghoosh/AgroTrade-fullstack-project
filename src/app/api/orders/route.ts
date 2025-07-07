import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Order from '@/lib/models/Order';

export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  const order = await Order.create(data);
  return NextResponse.json(order, { status: 201 });
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
  console.log('Sample order items:', orders.slice(0, 2).map(o => o.items.map(i => ({ title: i.title, seller: i.seller }))));
  
  return NextResponse.json(orders);
} 