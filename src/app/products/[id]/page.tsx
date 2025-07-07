import { dbConnect } from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import User from '@/lib/models/User';
import Image from 'next/image';
import ProductTabs from '../components/ProductTabs';
import Link from 'next/link';
import ChatButton from './ChatButton';
import { FaUser, FaTag, FaRegCommentDots, FaRegHeart, FaShareAlt, FaCheckCircle } from 'react-icons/fa';
import ProductCard from '../../components/ProductCard';
import { Suspense } from 'react';
import SuggestedProductsSlider from './SuggestedProductsSlider';

// Server component: receives params
export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();
  const productDoc = await Product.findById(id).populate('seller', 'name email');
  if (!productDoc) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Product not found</div>;
  }
  const product = JSON.parse(JSON.stringify(productDoc));

  // Fetch suggested products (same category, exclude current)
  const suggestedDocs = await Product.find({ category: product.category, _id: { $ne: product._id } }).limit(6).populate('seller', 'name');
  const suggested = JSON.parse(JSON.stringify(suggestedDocs));

  // Mock reviews
  const reviews = [
    { user: 'James Gouse', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', rating: 5, text: 'A simple product but makes the user seem neat and beautiful.', likes: 6, dislikes: 0 },
    { user: 'Guy Hawkins', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', rating: 5, text: 'Nice quality, looks like the picture and fitting is just right.', likes: 2, dislikes: 0 },
    { user: 'Brooklyn Simmons', avatar: 'https://randomuser.me/api/portraits/men/45.jpg', rating: 5, text: 'Like the material. It is so comfortable. Bought two pcs.', likes: 1, dislikes: 0 },
    { user: 'Courtney Henry', avatar: 'https://randomuser.me/api/portraits/women/65.jpg', rating: 5, text: 'Wear this to office for working and like the design very much.', likes: 0, dislikes: 0 },
  ];
  const avgRating = 4.9;
  const totalReviews = 225;
  const starCounts = [184, 63, 29, 7, 2]; // 5,4,3,2,1 stars

  return (
    <main className="min-h-screen flex flex-col items-center py-8 px-2 bg-gradient-to-br from-green-50 via-green-100 to-green-50">
      {/* Breadcrumb */}
      <nav className="w-full max-w-6xl mb-6 px-2">
        <ol className="flex items-center gap-2 text-gray-500 text-base font-medium">
          <li>
            <Link href="/" className="hover:underline">Home</Link>
          </li>
          <li>
            <span className="mx-1">&gt;</span>
          </li>
          <li>
            <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:underline">{product.category}</Link>
          </li>
          <li>
            <span className="mx-1">&gt;</span>
          </li>
          <li className="text-black font-extrabold">{product.title}</li>
        </ol>
      </nav>
      {/* Main Card */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row gap-10 items-stretch relative z-10">
        {/* Image gallery */}
        <div className="flex-1 flex flex-col items-center justify-center min-w-[320px]">
          <div className="w-full flex items-center justify-center min-h-[340px] relative">
            {/* Main product image */}
            {product.image ? (
              <img src={product.image} alt={product.title} className="h-96 w-96 object-contain rounded-xl shadow-xl bg-white transform translate-x-2" />
            ) : (
              <div className="h-96 w-96 flex items-center justify-center text-gray-400">No Image</div>
            )}
          </div>
        </div>
        {/* Product info */}
        <div className="flex-1 flex flex-col gap-4 justify-center min-w-[320px]">
          <div className="flex items-center justify-between mb-2 gap-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-green-800 tracking-tight leading-tight drop-shadow">{product.title}</h1>
            <div className="flex flex-col items-end gap-6">
              <button className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-red-500 hover:bg-red-100 transition"><FaRegHeart size={28} /></button>
              <button className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-green-600 hover:bg-green-100 transition"><FaShareAlt size={28} /></button>
            </div>
          </div>
          <div className="text-gray-700 mb-1 flex items-center gap-3">
            <FaTag className="text-green-400" />
            <span>Category:</span> <span className="font-semibold text-black">{product.category}</span>
          </div>
          <div className="text-gray-700 mb-1 flex items-center gap-3">
            <FaUser className="text-green-400" />
            <span>Seller:</span> <span className="font-semibold text-black">{product.seller?.name || 'Unknown'}</span>
          </div>
          {/* Price and discount */}
          <div className="flex items-end gap-4 mb-2">
            <span className="text-3xl md:text-4xl font-extrabold text-green-600">₹{product.price}</span>
            <span className="text-lg font-medium text-green-800">/ {product.quantity || 'N/A'} {product.unit || ''}</span>
            <span className="text-base font-semibold text-gray-400 line-through">₹{(product.price * 1.2).toFixed(0)}</span>
            <span className="text-green-500 font-bold text-base">20% OFF</span>
          </div>
          {/* Organic/Normal selector for crops */}
          {['Fruits', 'Vegetables', 'Cereal Grains', 'Pulses', 'Oilseeds', 'Spices & Herbs', 'Plantation & Commercial', 'Organic / Specialty'].includes(product.category) && (
            <div className="flex items-center gap-4 mb-2">
              <span className="text-gray-600 font-medium">Type:</span>
              <span className="px-4 py-2 rounded-full border-2 border-green-400 text-green-700 font-semibold bg-green-50">Organic</span>
              <span className="px-4 py-2 rounded-full border-2 border-gray-300 text-gray-700 font-semibold bg-gray-50">Normal</span>
            </div>
          )}
          {/* Stock/sold info (mocked) */}
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
            <FaCheckCircle className="text-green-500" />
            <span>5k+ Sold</span>
            <span className="ml-2">4.9 <span className="text-yellow-500">★</span> ({totalReviews} reviews)</span>
          </div>
          {/* Main action button: Buy this Item and Chat with Seller */}
          <div className="flex flex-col gap-4 mt-2 mb-2">
            <Link
              href={`/checkout?productId=${product._id}` +
                `&title=${encodeURIComponent(product.title)}` +
                (product.image ? `&image=${encodeURIComponent(product.image)}` : '') +
                `&price=${product.price}` +
                (product.quantity ? `&quantity=${product.quantity}` : '') +
                (product.unit ? `&unit=${encodeURIComponent(product.unit)}` : '') +
                (product.category ? `&category=${encodeURIComponent(product.category)}` : '') +
                (product.seller?.email ? `&seller=${encodeURIComponent(product.seller.email)}` : '')
              }
              className="flex-1 bg-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-green-700 transition-all duration-200 text-center flex items-center justify-center"
            >
              Buy this Item
            </Link>
            <ChatButton productId={product._id} sellerEmail={product.seller?.email} className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-800 border-2 border-green-300 px-8 py-4 rounded-2xl font-bold text-lg shadow hover:bg-green-200 transition-all duration-200" icon />
          </div>
        </div>
      </div>
      {/* Tabs and reviews */}
      <div className="w-full max-w-6xl mt-10">
        <ProductTabs product={product} reviews={reviews} avgRating={avgRating} totalReviews={totalReviews} starCounts={starCounts} />
      </div>
      {/* Suggestions */}
      <div className="w-full max-w-6xl mt-14">
        <SuggestedProductsSlider suggested={suggested} />
      </div>
    </main>
  );
} 