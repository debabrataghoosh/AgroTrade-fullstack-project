require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in .env.local');
  process.exit(1);
}

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  role: String,
});
const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  quantity: Number,
  unit: String,
  live: { type: Boolean, default: true },
  image: String,
  category: String,
  subcategory: String,
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  let seller = await User.findOne({ email: 'agrotrade804@gmail.com' });
  if (!seller) {
    seller = await User.create({
      name: 'Demo Seller',
      email: 'agrotrade804@gmail.com',
      role: 'seller',
    });
  }
  const demoProducts = [
    {
      title: 'Fresh Basmati Rice',
      description: 'Premium quality basmati rice from Punjab.',
      price: 60,
      quantity: 100,
      unit: 'kg',
      image: '/assets/Cereal.png',
      category: 'Cereal Grains',
      subcategory: 'Rice',
      seller: seller._id,
    },
    {
      title: 'Organic Moong Dal',
      description: 'Green gram pulses, organically grown.',
      price: 90,
      quantity: 50,
      unit: 'kg',
      image: '/assets/Pulses.png',
      category: 'Pulses',
      subcategory: 'Moong Dal (Green Gram)',
      seller: seller._id,
    },
    {
      title: 'Fresh Tomatoes',
      description: 'Farm fresh tomatoes, juicy and ripe.',
      price: 30,
      quantity: 200,
      unit: 'kg',
      image: '/assets/vegetables.png',
      category: 'Vegetables',
      subcategory: 'Tomato',
      seller: seller._id,
    },
    {
      title: 'Alphonso Mangoes',
      description: 'Sweet and delicious Alphonso mangoes.',
      price: 150,
      quantity: 40,
      unit: 'dozen',
      image: '/assets/Fruits.png',
      category: 'Fruits',
      subcategory: 'Mango',
      seller: seller._id,
    },
    {
      title: 'Groundnut Oilseeds',
      description: 'High-quality groundnut seeds for oil extraction.',
      price: 80,
      quantity: 70,
      unit: 'kg',
      image: '/assets/byproduct.png',
      category: 'Oilseeds',
      subcategory: 'Groundnut (Peanut)',
      seller: seller._id,
    },
  ];
  await Product.deleteMany({ seller: seller._id });
  await Product.insertMany(demoProducts);
  console.log('Demo products seeded successfully!');
  process.exit(0);
}

seed(); 