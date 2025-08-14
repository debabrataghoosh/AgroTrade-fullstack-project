import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Wishlist } from '@/lib/models';
import { Product } from '@/lib/models';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { userId } = await getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const userEmail = searchParams.get('userEmail');
    const productId = searchParams.get('productId');

    if (!userEmail) {
      return NextResponse.json({ error: 'User email required' }, { status: 400 });
    }

    // If productId is provided, check if specific product is in wishlist
    if (productId) {
      const wishlistItem = await Wishlist.findOne({ userEmail, productId });
      return NextResponse.json({ inWishlist: !!wishlistItem });
    }

    // Get all wishlist items for user
    const wishlistItems = await Wishlist.find({ userEmail })
      .populate('productId')
      .sort({ addedAt: -1 });

    console.log('Found wishlist items:', wishlistItems.length);

    // Add the original productId to each item for easier deletion
    const itemsWithOriginalId = wishlistItems.map(item => {
      try {
        const itemObj = item.toObject();
        // Handle cases where productId might be null or undefined
        const originalProductId = itemObj.productId?._id || itemObj.productId || null;
        
        console.log('Processing item:', {
          itemId: itemObj._id,
          productId: itemObj.productId,
          originalProductId
        });
        
        return {
          ...itemObj,
          originalProductId
        };
      } catch (itemError) {
        console.error('Error processing wishlist item:', itemError, item);
        // Return a safe fallback for corrupted items
        return {
          _id: item._id,
          userEmail: item.userEmail,
          addedAt: item.addedAt,
          productId: null,
          originalProductId: null
        };
      }
    });

    return NextResponse.json(itemsWithOriginalId);
  } catch (error) {
    console.error('Wishlist GET error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { userId } = await getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userEmail, productId } = await request.json();

    if (!userEmail || !productId) {
      return NextResponse.json({ error: 'User email and product ID required' }, { status: 400 });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Add to wishlist (will fail if already exists due to unique index)
    const wishlistItem = await Wishlist.create({
      userEmail,
      productId
    });

    return NextResponse.json(wishlistItem, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json({ error: 'Product already in wishlist' }, { status: 409 });
    }
    console.error('Wishlist POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { userId } = await getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const userEmail = searchParams.get('userEmail');
    const productId = searchParams.get('productId');

    if (!userEmail || !productId) {
      return NextResponse.json({ error: 'User email and product ID required' }, { status: 400 });
    }

    const result = await Wishlist.deleteOne({ userEmail, productId });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Wishlist item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Wishlist DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 