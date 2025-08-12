import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Message } from '@/lib/models';
import { User } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = request.nextUrl;
    const buyerEmailRaw = searchParams.get('buyerEmail');
    if (!buyerEmailRaw) return NextResponse.json([]);
    const buyerEmail = decodeURIComponent(buyerEmailRaw);
    const buyer = await User.findOne({ email: buyerEmail });
    if (!buyer) return NextResponse.json([]);

    // Find all messages where this user is the buyer (as sender or receiver)
    const messages = await Message.find({
      $or: [
        { sender: buyer._id },
        { receiver: buyer._id }
      ]
    })
      .populate('product')
      .populate('sender')
      .populate('receiver');

  // Group by product and seller
  const chatMap = new Map();
  for (const msg of messages) {
    // Skip messages with missing product or receiver data
    if (!msg.product || !msg.receiver) {
      console.warn('Skipping message with missing product or receiver:', msg._id);
      continue;
    }

    const productId = msg.product._id.toString();
    const sellerEmail = msg.receiver.email;
    const roomId = `${productId}--${buyerEmail}--${sellerEmail}`;
    const key = `${productId}--${sellerEmail}`;
    const msgDate = new Date(msg.createdAt || Date.now());
    const existingDate = chatMap.has(key) ? new Date(chatMap.get(key).createdAt || Date.now()) : new Date(0);
    
    if (!chatMap.has(key) || msgDate > existingDate) {
      chatMap.set(key, {
        roomId,
        productTitle: msg.product.title || 'Unknown Product',
        productImage: msg.product.image || null,
        sellerEmail,
        lastMessage: msg.content,
        createdAt: msg.createdAt || new Date(),
      });
    }
  }
    // Return sorted by latest message
    const chats = Array.from(chatMap.values()).sort((a, b) => {
      const dateA = new Date(a.createdAt || Date.now());
      const dateB = new Date(b.createdAt || Date.now());
      return dateB.getTime() - dateA.getTime();
    });
    return NextResponse.json(chats);
  } catch (error) {
    console.error('Error in buyer-chats API:', error);
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }
} 