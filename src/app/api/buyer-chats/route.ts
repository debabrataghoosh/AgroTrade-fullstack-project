import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Message from '@/lib/models/Message';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = request.nextUrl;
  const buyerEmailRaw = searchParams.get('buyerEmail');
  if (!buyerEmailRaw) return NextResponse.json([]);
  const buyerEmail = decodeURIComponent(buyerEmailRaw);
  const buyer = await User.findOne({ email: buyerEmail });
  if (!buyer) return NextResponse.json([]);

  // Find all messages where this user is the buyer
  const messages = await Message.find({ sender: buyer._id })
    .populate('product')
    .populate('receiver');

  // Group by product and seller
  const chatMap = new Map();
  for (const msg of messages) {
    const productId = msg.product._id.toString();
    const sellerEmail = msg.receiver.email;
    const roomId = `${productId}--${buyerEmail}--${sellerEmail}`;
    const key = `${productId}--${sellerEmail}`;
    if (!chatMap.has(key) || new Date(msg.createdAt) > new Date(chatMap.get(key).createdAt)) {
      chatMap.set(key, {
        roomId,
        productTitle: msg.product.title,
        productImage: msg.product.image || null,
        sellerEmail,
        lastMessage: msg.content,
        createdAt: msg.createdAt,
      });
    }
  }
  // Return sorted by latest message
  const chats = Array.from(chatMap.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return NextResponse.json(chats);
} 