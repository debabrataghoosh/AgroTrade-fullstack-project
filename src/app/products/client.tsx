
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from '../components/ProductCard';
import { useRouter, useSearchParams } from "next/navigation";
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

interface Product {
  _id: string;
  title: string;
  image: string;
  price: number;
  seller?: { name: string; email: string; role: string };
  createdAt?: string;
}

type SortOption = 'newest' | 'price-low' | 'price-high' | 'name-asc' | 'name-desc';

export default function ProductsClientPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const searchParams = useSearchParams();
  const search = searchParams?.get('search') || '';
  const category = searchParams?.get('category') || '';

  useEffect(() => {
    let url = "/api/products";
    const params = new URLSearchParams();
    
    if (search) {
      params.append('search', search);
    }
    if (category) {
      params.append('category', category);
    }
    if (sortBy) {
      params.append('sort', sortBy);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, [search, category, sortBy]);

  return (
    <main className="min-h-screen flex flex-col items-center py-8 bg-gradient-to-b from-green-50 via-white to-green-100">
      {(category || search) && (
        <nav className="w-full max-w-6xl mb-2 px-2">
          <ol className="flex items-center gap-2 text-gray-500 text-lg font-medium">
            <li>
              <Link href="/" className="hover:underline">Home</Link>
            </li>
            {(category || search) && <li><span className="mx-1">&gt;</span></li>}
            {category && (
              <li>
                {search ? (
                  <Link href={`/products?category=${encodeURIComponent(category)}`} className="hover:underline">{category}</Link>
                ) : (
                  <span className="text-black font-bold">{category}</span>
                )}
              </li>
            )}
            {category && search && <li><span className="mx-1">&gt;</span></li>}
            {search && (
              <li className="text-black font-extrabold">{search}</li>
            )}
          </ol>
        </nav>
      )}
      <div className="w-full max-w-6xl px-2 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-green-800 tracking-tight">
            {category && search ? `${category} > ${search}` : category ? category : search ? search : 'Browse Products'}
          </h1>
          
          {/* Sorting Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="text-gray-600 font-medium">Sort by:</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSortBy('newest')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'newest' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
                }`}
              >
                <FaSort className="inline mr-1" />
                Newest
              </button>
              <button
                onClick={() => setSortBy('price-low')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'price-low' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
                }`}
              >
                <FaSortUp className="inline mr-1" />
                Price: Low to High
              </button>
              <button
                onClick={() => setSortBy('price-high')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'price-high' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
                }`}
              >
                <FaSortDown className="inline mr-1" />
                Price: High to Low
              </button>
              <button
                onClick={() => setSortBy('name-asc')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'name-asc' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
                }`}
              >
                <FaSortUp className="inline mr-1" />
                Name: A-Z
              </button>
              <button
                onClick={() => setSortBy('name-desc')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'name-desc' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
                }`}
              >
                <FaSortDown className="inline mr-1" />
                Name: Z-A
              </button>
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="text-green-700 text-lg">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-gray-500 text-xl mt-16">No products found. Try a different search!</div>
      ) : (
        <>
          <div className="w-full max-w-6xl px-2 mb-4">
            <p className="text-gray-600 text-sm">
              Showing {products.length} product{products.length !== 1 ? 's' : ''}
              {category && ` in ${category}`}
              {search && ` matching "${search}"`}
            </p>
          </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 w-full max-w-6xl px-2">
            {products.map(product => (
              <ProductCard key={product._id} {...product} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
