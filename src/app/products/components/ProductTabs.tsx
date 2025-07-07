"use client";
import React, { useState } from "react";

export default function ProductTabs({ product, reviews, avgRating, totalReviews, starCounts }) {
  const [selectedTab, setSelectedTab] = useState("details");

  return (
    <>
      <div className="grid grid-cols-2 gap-0 border-b border-gray-200 mb-6">
        <button
          className={`w-full px-6 py-2 font-semibold text-lg rounded-t-lg border-b-4 transition-all duration-200 ${selectedTab === 'details' ? 'border-green-500 text-green-700 bg-white' : 'border-transparent text-gray-500 bg-gray-50 hover:bg-white'}`}
          onClick={() => setSelectedTab('details')}
        >
          Details
        </button>
        <button
          className={`w-full px-6 py-2 font-semibold text-lg rounded-t-lg border-b-4 transition-all duration-200 ${selectedTab === 'reviews' ? 'border-green-500 text-green-700 bg-white' : 'border-transparent text-gray-500 bg-gray-50 hover:bg-white'}`}
          onClick={() => setSelectedTab('reviews')}
        >
          Reviews
        </button>
      </div>
      {selectedTab === "details" && (
        <div className="bg-white rounded-2xl shadow p-6 text-gray-700 text-base leading-relaxed">
          <div className="mb-2"><span className="font-bold">Description:</span> {product.description || "No description provided."}</div>
          <div><span className="font-bold">Category:</span> {product.category}</div>
        </div>
      )}
      {selectedTab === "reviews" && (
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl text-yellow-500 font-bold">★ {avgRating}</span>
            <span className="text-gray-600">({totalReviews} reviews)</span>
          </div>
          {/* Star breakdown */}
          <div className="mb-4">
            {[5,4,3,2,1].map((star, i) => (
              <div key={star} className="flex items-center gap-2 text-sm mb-1">
                <span className="w-6 text-right">{star}★</span>
                <div className="flex-1 bg-gray-100 rounded h-2 mx-2">
                  <div className="bg-yellow-400 h-2 rounded" style={{width: `${(starCounts[i]/totalReviews)*100}%`}}></div>
                </div>
                <span className="w-8 text-gray-500">{starCounts[i]}</span>
              </div>
            ))}
          </div>
          {/* Review list */}
          <div className="space-y-4">
            {reviews.map((r, i) => (
              <div key={i} className="flex items-start gap-4">
                <img src={r.avatar} alt={r.user} className="w-10 h-10 rounded-full border" />
                <div>
                  <div className="font-bold text-green-800 flex items-center gap-1">{r.user} <span className="text-yellow-500">{'★'.repeat(r.rating)}</span></div>
                  <div className="text-gray-700">{r.text}</div>
                  <div className="text-xs text-gray-400 mt-1 flex gap-2">
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
    </>
  );
} 