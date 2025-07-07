"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaHeart, FaStar } from 'react-icons/fa';
import { useUser } from '@clerk/nextjs';

interface ProductCardProps {
  _id: string;
  title: string;
  image?: string;
  price: number;
  quantity?: number;
  unit?: string;
  category?: string;
  seller?: { name?: string };
  showActions?: boolean;
}

function getRandomBadge() {
  return Math.random() < 0.5 ? 'Organic' : '';
}

const ProductCard: React.FC<ProductCardProps> = ({ _id, title, image, price, quantity, unit, category, seller, showActions = true }) => {
  const { user, isSignedIn } = useUser();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [badge, setBadge] = useState('');

  // Check if product is in wishlist on component mount
  useEffect(() => {
    if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      checkWishlistStatus();
    }
    setBadge(getRandomBadge());
  }, [isSignedIn, user, _id]);

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch(`/api/wishlist?userEmail=${encodeURIComponent(user!.primaryEmailAddress!.emailAddress!)}&productId=${_id}`);
      if (response.ok) {
        const data = await response.json();
        setIsInWishlist(data.inWishlist);
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const toggleWishlist = async () => {
    if (!isSignedIn) {
      // Redirect to sign in or show a toast notification
      return;
    }

    setIsLoading(true);
    try {
      const userEmail = user!.primaryEmailAddress!.emailAddress!;
      
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(`/api/wishlist?userEmail=${encodeURIComponent(userEmail)}&productId=${_id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setIsInWishlist(false);
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userEmail,
            productId: _id,
          }),
        });
        if (response.ok) {
          setIsInWishlist(true);
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card p-0 flex flex-col items-stretch border border-gray-200 relative w-[220px] min-h-[320px] sm:min-h-[340px] group bg-white rounded-2xl">
      {/* Heart icon */}
      <button
        className={`absolute top-3 right-3 rounded-full p-2 shadow-lg z-10 cursor-pointer transition-all ${
          isInWishlist 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : 'bg-white text-red-400 hover:text-red-500 border border-red-200 hover:border-red-300'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        onClick={toggleWishlist}
        disabled={isLoading}
      >
        <FaHeart size={16} />
      </button>

      {/* Image area */}
      <div className="w-full h-40 sm:h-44 flex items-center justify-center bg-white rounded-t-2xl relative overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={title} 
            className="h-32 sm:h-36 object-contain transition-transform duration-300 group-hover:scale-110 transform translate-x-1" 
          />
        ) : (
          <div className="h-32 sm:h-36 w-full flex items-center justify-center text-gray-300 text-base">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Badge */}
        {badge && (
          <span 
            className="absolute left-3 top-3 px-3 py-1 rounded-full bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-xs font-semibold border border-green-200"
          >
            {badge === 'Organic' ? 'Best Seller' : badge}
          </span>
        )}
      </div>

      {/* Product info */}
      <div className="flex-1 flex flex-col px-4 pb-4 pt-3">
        <h3 
          className="font-semibold text-sm sm:text-base text-gray-900 mb-2 line-clamp-2 leading-tight"
        >
          {title}
        </h3>

        {/* Category and Rating Row */}
        {category && (
          <div 
            className="flex items-center justify-between mb-2"
          >
            <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full">
              {category}
            </span>
            <span className="flex items-center gap-1 ml-2 text-yellow-500 text-xs font-semibold">
              4.5 <FaStar className="inline-block mb-0.5" size={12} />
            </span>
          </div>
        )}

        <div 
          className="text-xs text-gray-500 mb-3"
        >
          by {seller?.name || 'Unknown'}
        </div>

        {/* Footer: Price + Buy button */}
        <div className="flex flex-col gap-2 mt-auto">
          <span 
            className="text-gray-400 text-xs font-medium"
          >
            Price
          </span>
          <div
            className="flex items-baseline gap-1"
          >
            <span className="text-green-600 font-extrabold text-lg sm:text-xl">
              ₹{price.toLocaleString()}
            </span>
            {quantity && unit && (
              <span className="text-xs text-gray-500 font-normal">
                / {quantity} {unit}
              </span>
            )}
          </div>
          
          {showActions && (
            <div>
              <Link 
                href={`/products/${_id}`} 
                className="block w-full text-center py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold text-sm transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Buy Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);