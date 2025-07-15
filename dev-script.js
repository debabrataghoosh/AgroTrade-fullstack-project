const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting development servers...\n');

// Start Socket.IO server
const socketServer = spawn('node', ['socket-server.js'], {
  stdio: 'inherit',
  shell: true
});

console.log('📡 Socket.IO server starting on port 3001...');

// Start Next.js development server
const nextServer = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

console.log('🌐 Next.js server starting on port 3000...\n');

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  socketServer.kill('SIGINT');
  nextServer.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down servers...');
  socketServer.kill('SIGTERM');
  nextServer.kill('SIGTERM');
  process.exit(0);
});

// DEMO PRODUCT SEEDER (run: node dev-script.js seed-products)
if (process.argv[2] === 'seed-products') {
  require('dotenv').config({ path: '.env.local' });
  const mongoose = require('mongoose');
  const Product = require('./src/lib/models/Product').default || require('./src/lib/models/Product');
  const User = require('./src/lib/models/User').default || require('./src/lib/models/User');

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('Missing MONGODB_URI in .env.local');
    process.exit(1);
  }

  async function seed() {
    await mongoose.connect(MONGODB_URI);
    let seller = await User.findOne({ email: 'demo-seller@agrotrade.com' });
    if (!seller) {
      seller = await User.create({
        name: 'Demo Seller',
        email: 'demo-seller@agrotrade.com',
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
} 