import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { users } from '@clerk/clerk-sdk-node';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role } = await req.json();
    
    // Validate role
    const allowedRoles = ['farmer', 'buyer', 'seller'];
    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Update user's public metadata in Clerk
    await users.updateUser(userId, {
      publicMetadata: { role }
    });

    return NextResponse.json({ message: 'Role updated successfully', role });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
  }
} 