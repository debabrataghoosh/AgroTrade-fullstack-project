import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Product } from '@/lib/models';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Add timeout protection
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database query timeout')), 30000); // 30 second timeout
    });

    const dbPromise = dbConnect();
    
    // Race between timeout and database connection
    await Promise.race([dbPromise, timeoutPromise]);
    
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    // Add query timeout
    const product = await Promise.race([
      Product.findById(id).exec(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Product query timeout')), 10000)
      )
    ]);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Product API error:', error);
    
    if (error instanceof Error && error.message.includes('timeout')) {
      return NextResponse.json({ error: 'Request timeout - please try again' }, { status: 408 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 