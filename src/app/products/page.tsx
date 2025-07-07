"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from '../components/ProductCard';
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    let url = "/api/products";
    if (search) {
      url += `?search=${encodeURIComponent(search)}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, [search]);

  return (
    <main className="min-h-screen flex flex-col items-center py-8 bg-gradient-to-b from-green-50 via-white to-green-100">
      {(category || search) && (
        <nav className="w-full max-w-6xl mb-2 px-2">
          <ol className="flex items-center gap-2 text-gray-500 text-lg font-medium">
            <li>
              <a href="/" className="hover:underline">Home</a>
            </li>
            {(category || search) && <li><span className="mx-1">&gt;</span></li>}
            {category && (
              <li>
                {search ? (
                  <a href={`/products?category=${encodeURIComponent(category)}`} className="hover:underline">{category}</a>
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
      <h1 className="text-3xl font-bold mb-8 text-green-800 tracking-tight">
        {category && search ? `${category} > ${search}` : category ? category : search ? search : 'Browse Products'}
      </h1>
      {loading ? (
        <div className="text-green-700 text-lg">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-gray-500 text-xl mt-16">No products found. Try a different search!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 w-full max-w-6xl px-2">
          {products.map(product => (
            <ProductCard key={product._id} {...product} />
          ))}
        </div>
      )}
    </main>
  );
} 