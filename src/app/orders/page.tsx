"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

interface OrderItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  unit: string;
  category: string;
  seller: string;
}

interface Order {
  _id: string;
  userEmail: string;
  items: OrderItem[];
  address: any;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  Placed: "bg-blue-100 text-blue-800",
  Confirmed: "bg-yellow-100 text-yellow-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function OrdersPage() {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders?userEmail=${encodeURIComponent(user?.emailAddresses[0]?.emailAddress || "")}`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Filter orders by search
  const filteredOrders = orders.filter((order) => {
    if (!search.trim()) return true;
    const searchLower = search.toLowerCase();
    return (
      order._id.toLowerCase().includes(searchLower) ||
      order.items.some((item) => item.title.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-100 py-8 px-2">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-green-900 mb-6">My Orders</h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Search your orders (product, order ID)"
            className="w-full md:w-96 px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-green-900 bg-white shadow"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="text-center text-green-700 py-16 text-lg">Loading your orders...</div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">Try searching by product name or order ID.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow flex flex-col md:flex-row md:items-center p-6 gap-6 border border-green-100">
                {/* Product image and info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <img
                    src={order.items[0]?.image || "/assets/file.svg"}
                    alt={order.items[0]?.title || "Product"}
                    className="w-20 h-20 object-contain rounded-lg border border-green-100 bg-green-50"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-green-900 text-lg truncate">{order.items[0]?.title}</div>
                    <div className="text-gray-500 text-sm truncate">Order ID: {order._id}</div>
                    <div className="text-gray-500 text-sm">{order.items[0]?.quantity} {order.items[0]?.unit} × ₹{order.items[0]?.price}</div>
                  </div>
                </div>
                {/* Status and actions */}
                <div className="flex flex-col items-end gap-2 min-w-[160px]">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
                    {order.status}
                  </span>
                  <span className="text-gray-500 text-xs">{formatDate(order.createdAt)}</span>
                  {order.status === "Delivered" && (
                    <button className="mt-2 px-4 py-1 bg-green-100 text-green-800 rounded font-semibold text-xs border border-green-200 hover:bg-green-200 transition">Rate & Review Product</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 