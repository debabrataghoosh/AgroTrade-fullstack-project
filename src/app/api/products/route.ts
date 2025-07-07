import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import User from '@/lib/models/User';
import { getAuth } from '@clerk/nextjs/server';
import { users } from '@clerk/clerk-sdk-node';

interface ProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  quantity: number;
  unit: string;
  image: string;
  sellerEmail: string;
}

export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = request.nextUrl;
  const filter: any = {};
  const id = searchParams.get('id');
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort');
  const showAll = searchParams.get('showAll');
  if (id) {
    const product = await Product.findById(id).populate('seller', 'name email role');
    return NextResponse.json(product);
  }
  if (category) filter.category = category;
  if (subcategory) filter.subcategory = subcategory;
  if (!showAll) {
    filter.live = true;
  }
  let query = Product.find(filter);
  if (search) {
    query = query.where('title', new RegExp(search, 'i'));
  }
  if (sort === 'new') {
    query = query.sort({ createdAt: -1 });
  }
  const products = await query.populate('seller', 'name email role');
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'You must be logged in to add products' }, { status: 403 });
    }
    let email = null;
    let user = null;
    try {
      user = await users.getUser(userId);
      email = user.emailAddresses[0]?.emailAddress;
    } catch (e) {
      console.error('Clerk fetch error:', e, 'userId:', userId, 'CLERK_SECRET_KEY:', process.env.CLERK_SECRET_KEY ? 'set' : 'not set');
      return NextResponse.json({ error: 'Could not fetch user from Clerk', details: String(e) }, { status: 500 });
    }
    if (!email) {
      return NextResponse.json({ error: 'No email found for user' }, { status: 400 });
    }
    const { title, description, price, image, category, subcategory, quantity, unit } = await req.json();
    // Allowed categories and subcategories
    const allowedCategories = [
      { label: "Cereal Grains", sub: ["Rice", "Wheat", "Maize (Corn)", "Barley", "Millets (Bajra, Jowar, Ragi)"] },
      { label: "Pulses", sub: ["Chickpeas (Chana)", "Pigeon Peas (Toor/Arhar Dal)", "Lentils (Masoor Dal)", "Urad Dal (Black Gram)", "Moong Dal (Green Gram)"] },
      { label: "Oilseeds", sub: ["Mustard", "Groundnut (Peanut)", "Soybean", "Sesame (Til)", "Sunflower Seeds"] },
      { label: "Vegetables", sub: ["Tomato", "Potato", "Onion", "Brinjal", "Cauliflower, Cabbage, Carrot", "Green Chilli"] },
      { label: "Fruits", sub: ["Mango", "Banana", "Apple", "Guava", "Pomegranate", "Papaya"] },
      { label: "Spices & Herbs", sub: ["Turmeric", "Coriander", "Cumin", "Chilli", "Ginger, Garlic", "Fenugreek (Methi)"] },
      { label: "Plantation & Commercial", sub: ["Tea", "Coffee", "Coconut", "Rubber", "Sugarcane", "Cotton"] },
      { label: "Organic / Specialty", sub: ["Organic Rice / Wheat", "Black Rice / Red Rice", "Quinoa", "Buckwheat", "Medicinal Plants (e.g., Aloe Vera, Ashwagandha)"] },
      { label: "Sell Byproduct", sub: ["Crop residues", "Animal feed", "Compost / Fertilizer"] },
    ];
    const catObj = allowedCategories.find(c => c.label === category);
    if (!catObj) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }
    if (!catObj.sub.includes(subcategory)) {
      return NextResponse.json({ error: 'Invalid subcategory for selected category' }, { status: 400 });
    }
    if (!title || !price) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    let seller = await User.findOne({ email });
    if (!seller) {
      // Auto-create user in DB if not found
      seller = await User.create({
        email,
        name: user.firstName || user.username || email,
        role: "seller",
        // Add more fields from Clerk if needed
      });
    }
    const product = await Product.create({
      title,
      description,
      price,
      quantity,
      unit,
      image,
      category,
      subcategory,
      seller: seller._id,
    });
    return NextResponse.json({ message: 'Product added', product });
  } catch (err) {
    console.error('API /api/products error:', err);
    return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id, ...updateData }: { id: string; [key: string]: unknown } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(updatedProduct);
  } catch (error: unknown) {
    console.error('API /api/products PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('API /api/products DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 });
  }
} 