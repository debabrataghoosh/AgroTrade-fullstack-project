import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Message } from '@/lib/models';
import { User } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
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
      .populate({ path: 'product', populate: { path: 'seller' } })
      .populate('sender')
      .populate('receiver');

  // Group by product and buyer, but only if the seller is the actual seller of the product
  const chatMap = new Map();
  for (const msg of messages) {
    // Skip messages with missing data
    if (!msg.product || !msg.sender || !msg.receiver) {
      console.warn('Skipping message with missing product, sender, or receiver:', msg._id);
      continue;
    }

    const productId = msg.product._id.toString();
    // Only include if the product's seller email matches the sellerEmail
    if (msg.product.seller && msg.product.seller.email === sellerEmail) {
      // The buyer is the user who is NOT the seller
      const buyerUser = msg.sender._id.equals(seller._id) ? msg.receiver : msg.sender;
      const buyerEmail = buyerUser.email;
      const roomId = `${productId}--${buyerEmail}--${sellerEmail}`;
      const key = `${productId}--${buyerEmail}`;
      const msgDate = new Date(msg.createdAt || Date.now());
      const existingDate = chatMap.has(key) ? new Date(chatMap.get(key).createdAt || Date.now()) : new Date(0);
      
      if (!chatMap.has(key) || msgDate > existingDate) {
        chatMap.set(key, {
          roomId,
          productTitle: msg.product.title || 'Unknown Product',
          productImage: msg.product.image || null,
          buyerEmail,
          lastMessage: msg.content,
          createdAt: msg.createdAt || new Date(),
        });
      }
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
    console.error('Error in seller-chats API:', error);
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }
} 