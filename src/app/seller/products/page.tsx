"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function SellerProductsPage() {
  const { user, isLoaded } = useUser();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isLoaded) return;
    fetch("/api/products?showAll=true")
      .then(res => res.json())
      .then(data => {
        if (user) {
          const email = user.primaryEmailAddress?.emailAddress;
          setProducts(data.filter((p: any) => p.seller?.email === email));
        }
        setLoading(false);
      });
  }, [isLoaded, user]);

  const handleToggleLive = async (id: string, live: boolean) => {
    const res = await fetch("/api/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, live }),
    });
    if (res.ok) {
      setProducts(products => products.map(p => p._id === id ? { ...p, live } : p));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setProducts(products => products.filter(p => p._id !== id));
    }
  };

  const filteredProducts = products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-row items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-green-800">My Products</h1>
        <input
          type="text"
          placeholder="Search your products..."
          className="border border-green-200 rounded-full px-4 py-2 w-64 max-w-xs focus:outline-none focus:ring-2 focus:ring-green-400 text-lg shadow text-black"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="text-green-700 text-lg">Loading...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-gray-500 text-xl mt-16">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProducts.map(product => (
            <div key={product._id} className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-6 flex flex-col md:flex-row md:items-center gap-6 border border-green-100">
              <div className="flex-1 flex flex-col gap-2">
                <div className="font-semibold text-xl text-green-900 mb-1">{product.title}</div>
                <div className="text-green-700 font-bold text-lg">₹{product.price} / {product.quantity} {product.unit}</div>
                <div className="text-sm text-gray-600">{product.category}</div>
                <div className="text-xs text-gray-500 mb-2">Added: {new Date(product.createdAt).toLocaleDateString()}</div>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span className={product.live ? "text-green-700 font-semibold" : "text-gray-400 font-semibold"}>{product.live ? "Live" : "Hidden"}</span>
                    <label className="relative inline-block w-12 h-6 align-middle select-none">
                      <input
                        type="checkbox"
                        checked={!!product.live}
                        onChange={e => handleToggleLive(product._id, e.target.checked)}
                        className="sr-only peer"
                      />
                      <span className="block w-12 h-6 rounded-full bg-gray-300 peer-checked:bg-green-500 transition-all duration-300"></span>
                      <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 peer-checked:translate-x-6"></span>
                    </label>
                  </label>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-full font-semibold shadow transition text-sm"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                  <a
                    href={`/seller/products/${product._id}/edit`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full font-semibold shadow transition text-sm ml-2"
                  >
                    Edit
                  </a>
                </div>
              </div>
              {product.image && (
                <img src={product.image} alt={product.title} className="h-24 w-24 object-contain rounded-xl border shadow" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 