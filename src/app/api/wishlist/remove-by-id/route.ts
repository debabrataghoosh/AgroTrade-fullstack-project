import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Wishlist } from '@/lib/models';
import { getAuth } from '@clerk/nextjs/server';

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { userId } = await getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const userEmail = searchParams.get('userEmail');
    const itemId = searchParams.get('itemId');

    if (!userEmail || !itemId) {
      return NextResponse.json({ error: 'User email and item ID required' }, { status: 400 });
    }

    // Remove the wishlist item by its _id
    const result = await Wishlist.deleteOne({ 
      _id: itemId,
      userEmail: userEmail 
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Wishlist item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Wishlist remove-by-id DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
