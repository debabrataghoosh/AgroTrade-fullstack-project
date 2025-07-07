import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Message from '@/lib/models/Message';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = request.nextUrl;
  const sellerEmailRaw = searchParams.get('sellerEmail');
  if (!sellerEmailRaw) return NextResponse.json([]);
  const sellerEmail = decodeURIComponent(sellerEmailRaw);
  const seller = await User.findOne({ email: sellerEmail });
  if (!seller) return NextResponse.json([]);

  // Find all messages where this user is the seller (as sender or receiver)
  const messages = await Message.find({
    $or: [
      { receiver: seller._id },
      { sender: seller._id }
    ]
  })
    .populate('product')
    .populate('sender')
    .populate('receiver');

  // Group by product and buyer
  const chatMap = new Map();
  for (const msg of messages) {
    const productId = msg.product._id.toString();
    // The buyer is the user who is NOT the seller
    const buyerUser = msg.sender._id.equals(seller._id) ? msg.receiver : msg.sender;
    const buyerEmail = buyerUser.email;
    const roomId = `${productId}--${buyerEmail}--${sellerEmail}`;
    const key = `${productId}--${buyerEmail}`;
    if (!chatMap.has(key) || new Date(msg.createdAt) > new Date(chatMap.get(key).createdAt)) {
      chatMap.set(key, {
        roomId,
        productTitle: msg.product.title,
        productImage: msg.product.image || null,
        buyerEmail,
        lastMessage: msg.content,
        createdAt: msg.createdAt,
      });
    }
  }
  // Return sorted by latest message
  const chats = Array.from(chatMap.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return NextResponse.json(chats);
} 