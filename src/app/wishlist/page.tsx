"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import ProductCard from "../components/ProductCard";
import Link from "next/link";

interface WishlistItem {
  _id: string;
  productId: {
    _id: string;
    title: string;
    image?: string;
    price: number;
    quantity?: number;
    unit?: string;
    category?: string;
    seller?: { name?: string };
  };
  addedAt: string;
}

export default function WishlistPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      fetchWishlist();
    }
  }, [isLoaded, isSignedIn, user, router]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch(`/api/wishlist?userEmail=${encodeURIComponent(user!.primaryEmailAddress!.emailAddress!)}`);
      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await fetch(`/api/wishlist?userEmail=${encodeURIComponent(user!.primaryEmailAddress!.emailAddress!)}&productId=${productId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Remove from local state
        setWishlistItems(prev => prev.filter(item => item.productId._id !== productId));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isSignedIn) {
    return null; // Will redirect to sign-in
  }

  return (
    <main className="min-h-screen flex flex-col items-center py-8 bg-gradient-to-b from-green-50 via-white to-green-100">
      <div className="w-full max-w-6xl px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-green-800 tracking-tight">My Wishlist</h1>
          <Link 
            href="/products" 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold transition-colors"
          >
            Browse Products
          </Link>
        </div>

        {loading ? (
          <div className="text-green-700 text-lg text-center">Loading your wishlist...</div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 text-xl mb-4">Your wishlist is empty</div>
            <p className="text-gray-400 mb-8">Start adding products you love to your wishlist!</p>
            <Link 
              href="/products" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-colors"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <>
            <div className="text-gray-600 mb-6">
              {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {wishlistItems.map((item) => (
                <div key={item._id} className="relative">
                  <ProductCard 
                    {...item.productId} 
                    showActions={true}
                  />
                  <button
                    onClick={() => removeFromWishlist(item.productId._id)}
                    className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow z-20 transition-colors"
                    title="Remove from wishlist"
                  >
                    <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
} 