import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Message } from '@/lib/models';
import { User } from '@/lib/models';
import { Product } from '@/lib/models';

// Helper to parse roomId (format: productId-buyerEmail-sellerEmail)
function parseRoomId(roomId: string) {
  const [product, buyer, seller] = roomId.split('--');
  return { product, buyer, seller };
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = request.nextUrl;
    const roomId = searchParams.get('roomId');
    
    if (!roomId) {
      console.log('No roomId provided');
      return NextResponse.json([]);
    }
    
    const { product, buyer, seller } = parseRoomId(roomId);
    
    // Validate that all required parts exist
    if (!product || !buyer || !seller) {
      console.log('Invalid roomId format:', roomId);
      return NextResponse.json([]);
    }
    
    // DECODE the emails
    const buyerEmail = decodeURIComponent(buyer);
    const sellerEmail = decodeURIComponent(seller);
    
    // Find users with error handling
    const buyerUser = await User.findOne({ email: buyerEmail });
    const sellerUser = await User.findOne({ email: sellerEmail });
    
    if (!buyerUser || !sellerUser) {
      console.log('Users not found:', { buyerEmail, sellerEmail });
      return NextResponse.json([]);
    }

    // Verify product exists
    const productDoc = await Product.findById(product);
    if (!productDoc) {
      console.log('Product not found:', product);
      return NextResponse.json([]);
    }

    // Find all messages for this room with proper population
    const messages = await Message.find({
      product: product,
      $or: [
        { sender: buyerUser._id, receiver: sellerUser._id },
        { sender: sellerUser._id, receiver: buyerUser._id }
      ]
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'email name')
      .populate('receiver', 'email name')
      .populate('product', 'title image price');

    console.log(`Found ${messages.length} messages for room: ${roomId}`);
    return NextResponse.json(messages);
    
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { roomId, sender, content, createdAt, buyer, seller } = body;
    
    if (!roomId || !sender || !content) {
      return NextResponse.json({ 
        error: 'Missing required fields: roomId, sender, content' 
      }, { status: 400 });
    }
    
    // DECODE the emails
    const buyerEmail = decodeURIComponent(buyer);
    const sellerEmail = decodeURIComponent(seller);

    // Find sender and receiver users
    let senderUser = await User.findOne({ email: sender });
    let receiverEmail;
    
    if (sender === buyerEmail) {
      receiverEmail = sellerEmail;
    } else {
      receiverEmail = buyerEmail;
    }
    
    let receiverUser = await User.findOne({ email: receiverEmail });

    // Auto-create sender if not found
    if (!senderUser) {
      console.log('Creating new sender user:', sender);
      senderUser = await User.create({
        email: sender,
        name: sender.split('@')[0],
        role: sender === buyerEmail ? 'buyer' : 'seller',
      });
    }
    
    // Auto-create receiver if not found
    if (!receiverUser) {
      console.log('Creating new receiver user:', receiverEmail);
      receiverUser = await User.create({
        email: receiverEmail,
        name: receiverEmail.split('@')[0],
        role: receiverEmail === buyerEmail ? 'buyer' : 'seller',
      });
    }

    // Verify product exists before creating message
    const productId = roomId.split('--')[0];
    const productDoc = await Product.findById(productId);
    
    if (!productDoc) {
      console.error('Product not found for message:', productId);
      return NextResponse.json({ 
        error: 'Product not found' 
      }, { status: 404 });
    }

    // Save message
    const message = await Message.create({
      product: productId,
      sender: senderUser._id,
      receiver: receiverUser._id,
      content,
      createdAt: createdAt ? new Date(createdAt) : new Date()
    });

    console.log('Message created successfully:', {
      messageId: message._id,
      product: productId,
      sender: senderUser.email,
      receiver: receiverUser.email
    });

    return NextResponse.json(message);
    
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ 
      error: 'Failed to create message' 
    }, { status: 500 });
  }
} 