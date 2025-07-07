import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Message from '@/lib/models/Message';
import User from '@/lib/models/User';

// Helper to parse roomId (format: productId-buyerEmail-sellerEmail)
function parseRoomId(roomId) {
  const [product, buyer, seller] = roomId.split('--');
  return { product, buyer, seller };
}

export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = request.nextUrl;
  const roomId = searchParams.get('roomId');
  if (!roomId) return NextResponse.json([]);
  
  const { product, buyer, seller } = parseRoomId(roomId);
  // DECODE the emails
  const buyerEmail = decodeURIComponent(buyer);
  const sellerEmail = decodeURIComponent(seller);
  const buyerUser = await User.findOne({ email: buyerEmail });
  const sellerUser = await User.findOne({ email: sellerEmail });
  if (!buyerUser || !sellerUser) return NextResponse.json([]);

  // Find all messages for this room
  const messages = await Message.find({
    product: product,
    $or: [
      { sender: buyerUser._id, receiver: sellerUser._id },
      { sender: sellerUser._id, receiver: buyerUser._id }
    ]
  })
    .sort({ createdAt: 1 })
    .populate('sender')
    .populate('receiver');

  return NextResponse.json(messages);
}

export async function POST(request: NextRequest) {
  await dbConnect();
  const body = await request.json();
  const { roomId, sender, content, createdAt, buyer, seller } = body;
  // DECODE the emails
  const buyerEmail = decodeURIComponent(buyer);
  const sellerEmail = decodeURIComponent(seller);

  // Find sender and receiver users
  let senderUser = await User.findOne({ email: sender });
  // Determine receiver email
  let receiverEmail;
  if (sender === buyerEmail) {
    receiverEmail = sellerEmail;
  } else {
    receiverEmail = buyerEmail;
  }
  let receiverUser = await User.findOne({ email: receiverEmail });

  // Auto-create sender if not found
  if (!senderUser) {
    senderUser = await User.create({
      email: sender,
      name: sender.split('@')[0],
      role: sender === buyerEmail ? 'buyer' : 'seller',
    });
  }
  // Auto-create receiver if not found
  if (!receiverUser) {
    receiverUser = await User.create({
      email: receiverEmail,
      name: receiverEmail.split('@')[0],
      role: receiverEmail === buyerEmail ? 'buyer' : 'seller',
    });
  }

  // Save message
  const message = await Message.create({
    product: roomId.split('--')[0],
    sender: senderUser._id,
    receiver: receiverUser._id,
    content,
    createdAt: createdAt ? new Date(createdAt) : new Date()
  });

  return NextResponse.json(message);
} 