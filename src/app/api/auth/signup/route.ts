import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { hash } from 'bcryptjs';

export async function POST(req: NextRequest) {
  await dbConnect();
  const { name, email, password, role } = await req.json();
  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
  }
  const hashed = await hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role });
  return NextResponse.json({ message: 'User registered', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
} 