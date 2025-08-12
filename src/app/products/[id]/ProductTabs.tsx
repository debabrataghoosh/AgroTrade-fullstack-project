"use client";
import { useState } from "react";

interface Product {
  _id: string;
  title: string;
  image: string;
  price: number;
  description?: string;
  seller?: { name: string; email: string; role: string };
}

interface Review {
  avatar: string;
  user: string;
  rating: number;
  text: string;
  likes: number;
  dislikes: number;
}

export default function ProductTabs({
  product,
  reviews,
  avgRating,
  totalReviews,
  starCounts,
}: {
  product: Product;
  reviews: Review[];
  avgRating: number;
  totalReviews: number;
  starCounts: number[];
}) {
  const [tab, setTab] = useState('details');

  return (
    <div className="w-full max-w-5xl mt-8">
      <div className="flex border-b mb-4">
        <button className={`px-6 py-2 font-semibold ${tab === 'details' ? 'border-b-2 border-green-600 text-green-700' : 'text-gray-600'}`} onClick={() => setTab('details')}>Details</button>
        <button className={`px-6 py-2 font-semibold ${tab === 'reviews' ? 'border-b-2 border-green-600 text-green-700' : 'text-gray-600'}`} onClick={() => setTab('reviews')}>Reviews</button>
        <button className={`px-6 py-2 font-semibold ${tab === 'discussion' ? 'border-b-2 border-green-600 text-green-700' : 'text-gray-600'}`} onClick={() => setTab('discussion')}>Discussion</button>
      </div>
      {/* Tab content */}
      {tab === 'details' && (
        <div className="bg-white rounded-lg p-6 shadow text-gray-700">
          <h2 className="text-xl font-bold mb-2">Product Details</h2>
          <div>{product.description}</div>
        </div>
      )}
      {tab === 'reviews' && (
        <div className="bg-white rounded-lg p-6 shadow">
          {/* Review summary */}
          <div className="flex flex-col md:flex-row gap-8 mb-6">
            <div className="flex-1 flex flex-col items-center md:items-start">
              <span className="text-4xl font-bold text-yellow-500">★ {avgRating}</span>
              <span className="text-gray-600">({totalReviews} reviews)</span>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              {[5,4,3,2,1].map((star, _i) => ( // Changed i to _i
                <div key={star} className="flex items-center gap-2">
                  <span className="w-6 text-gray-700">{star}★</span>
                  <div className="flex-1 bg-gray-200 rounded h-2 overflow-hidden">
                    <div className="bg-yellow-400 h-2 rounded" style={{ width: `${(starCounts[5-star]*100/starCounts.reduce((a,b)=>a+b,0)).toFixed(1)}%` }} />
                  </div>
                  <span className="w-8 text-gray-600">{starCounts[5-star]}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Review list */}
          <div className="divide-y">
            {reviews.map((r: Review, i: number) => (
              <div key={i} className="flex gap-4 py-4">
                <img src={r.avatar} alt={r.user} className="w-12 h-12 rounded-full border" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-green-800">{r.user}</span>
                    <span className="text-yellow-500">{'★'.repeat(r.rating)}</span>
                  </div>
                  <div className="text-gray-700 mb-2">{r.text}</div>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>Reply</span>
                    <span>👍 {r.likes}</span>
                    <span>👎 {r.dislikes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === 'discussion' && (
        <div className="bg-white rounded-lg p-6 shadow text-gray-700">Discussion coming soon.</div>
      )}
    </div>
  );
}