"use client";
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { FaRegHeart, FaHeart, FaShareAlt } from 'react-icons/fa';

interface ProductActionsProps {
  productId: string;
  productTitle: string;
  productImage?: string;
}

export default function ProductActions({ productId, productTitle, productImage }: ProductActionsProps) {
  const { user, isSignedIn } = useUser();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if product is in wishlist on mount
  useEffect(() => {
    if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      checkWishlistStatus();
    }
  }, [isSignedIn, user, productId]);

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch(
        `/api/wishlist?userEmail=${encodeURIComponent(user!.primaryEmailAddress!.emailAddress)}&productId=${productId}`
      );
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
      // Redirect to sign in or show sign in modal
      alert('Please sign in to add items to your wishlist');
      return;
    }

    setIsLoading(true);
    try {
      const userEmail = user!.primaryEmailAddress!.emailAddress;
      
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(
          `/api/wishlist?userEmail=${encodeURIComponent(userEmail)}&productId=${productId}`,
          { method: 'DELETE' }
        );
        if (response.ok) {
          setIsInWishlist(false);
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userEmail, productId })
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

  const handleShare = async () => {
    if (navigator.share) {
      // Use native sharing if available
      try {
        await navigator.share({
          title: productTitle,
          text: `Check out this product: ${productTitle}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Product link copied to clipboard!');
      } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Product link copied to clipboard!');
      }
    }
  };

  return (
    <div className="flex flex-col items-end gap-6">
      <button
        onClick={toggleWishlist}
        disabled={isLoading}
        className={`w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition ${
          isInWishlist 
            ? 'text-red-500 hover:bg-red-100' 
            : 'text-red-400 hover:bg-red-100'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {isInWishlist ? <FaHeart size={28} /> : <FaRegHeart size={28} />}
      </button>
      <button
        onClick={handleShare}
        className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-green-600 hover:bg-green-100 transition"
        title="Share product"
      >
        <FaShareAlt size={28} />
      </button>
    </div>
  );
}
