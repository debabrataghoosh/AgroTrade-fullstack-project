"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useUser } from '@clerk/nextjs';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  quantity: number;
  unit: string;
  image: string;
  sellerEmail: string;
}

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

function getCartFromStorage() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  } catch {
    return [];
  }
}
function getAddressesFromStorage() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('addresses') || '[]');
  } catch {
    return [];
  }
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payLoading, setPayLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  // Get productId from query params
  const productId = searchParams.get("productId");

  // Cart state
  const [cart, setCart] = useState<any[]>([]);

  // Load cart and addresses from localStorage on mount
  useEffect(() => {
    // If productId, title, price, etc. are in query, treat as single-product checkout
    const title = searchParams.get('title');
    const image = searchParams.get('image');
    const price = searchParams.get('price');
    const quantity = searchParams.get('quantity') || 1;
    const unit = searchParams.get('unit');
    const category = searchParams.get('category');
    const seller = searchParams.get('seller');
    if (title && price) {
      setCart([
        {
          id: productId,
          title,
          image,
          price: parseFloat(price),
          quantity: parseInt(quantity),
          unit,
          category,
          seller,
        },
      ]);
    } else {
      setCart(getCartFromStorage());
    }
    const savedAddresses = getAddressesFromStorage();
    setAddresses(savedAddresses);
    if (savedAddresses.length > 0) setSelectedAddress(savedAddresses[0]);
  }, [searchParams, productId]);

  // Save addresses to localStorage when changed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('addresses', JSON.stringify(addresses));
    }
  }, [addresses]);

  useEffect(() => {
    if (!productId) return;
    fetch(`/api/products/${productId}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(data => {
        if (!data || Object.keys(data).length === 0) {
          setError('Product not found.');
        } else {
          setProduct(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Product not found.');
        setLoading(false);
      });
  }, [productId]);

  const handlePlaceOrder = async () => {
    setOrderLoading(true);
    try {
      const orderData = {
        userEmail: user?.primaryEmailAddress?.emailAddress || 'guest@example.com',
        items: cart,
        address: selectedAddress,
        status: 'Placed',
      };
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      setOrderLoading(false);
      setOrderSuccess(true);
      setTimeout(() => {
        router.push('/orders');
      }, 2000);
    } catch (e) {
      setOrderLoading(false);
      alert('Failed to place order.');
    }
  };

  const [promo, setPromo] = useState('');

  const handleQty = (idx: number, dir: 'inc' | 'dec') => {
    setCart(cart => cart.map((item, i) =>
      i === idx ? { ...item, quantity: Math.max(1, item.quantity + (dir === 'inc' ? 1 : -1)) } : item
    ));
  };
  const handleRemove = (idx: number) => {
    setCart(cart => cart.filter((_, i) => i !== idx));
  };

  // Totals
  const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const itemsTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const tax = Math.round(itemsTotal * 0.02);
  const total = itemsTotal + shipping + tax;

  // Address modal handlers
  const handleSelectAddress = (addr: any) => {
    setSelectedAddress(addr);
    setShowAddAddress(false);
  };
  const handleAddAddress = (e: any) => {
    e.preventDefault();
    if (!newAddress.name || !newAddress.address || !newAddress.city || !newAddress.state || !newAddress.pincode) return;
    const addr = { ...newAddress };
    setAddresses(prev => [...prev, addr]);
    setSelectedAddress(addr);
    setNewAddress({ name: '', phone: '', address: '', city: '', state: '', pincode: '' });
    setShowAddAddress(false);
  };

  if (!productId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No product selected</h2>
          <Link href="/products" className="text-green-700 underline">Go to Products</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">{error}</h2>
          <Link href="/products" className="text-green-700 underline">Go to Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-green-50 flex flex-col items-center py-10">
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Cart Table */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-green-100 p-8">
          <h1 className="text-2xl font-bold mb-2 text-green-900 flex items-center gap-2">
            <span>Your</span> <span className="text-green-600">Cart</span>
          </h1>
          <div className="flex justify-between items-center mb-6">
            <div className="text-green-700 font-semibold text-base">Product Details</div>
            <div className="flex-1 flex justify-between ml-8">
              <div className="w-24 text-right text-green-700 font-semibold">Price</div>
              <div className="w-32 text-center text-green-700 font-semibold">Quantity</div>
              <div className="w-24 text-right text-green-700 font-semibold">Subtotal</div>
            </div>
            <div className="w-4" />
          </div>
          <div className="divide-y divide-green-50">
            {cart.map((item, idx) => (
              <div key={item.id} className="flex items-center py-6">
                <div className="flex items-center gap-4 w-64">
                  <img src={item.image} alt={item.title} className="w-16 h-16 rounded bg-green-50 object-contain border border-green-100" />
                  <div>
                    <div className="font-semibold text-green-900">{item.title}</div>
                    <button onClick={() => handleRemove(idx)} className="text-green-600 text-xs mt-1 hover:underline">Remove</button>
                  </div>
                </div>
                <div className="flex-1 flex justify-between ml-8 items-center">
                  <div className="w-24 text-right text-green-800 font-medium">₹{item.price.toLocaleString()}</div>
                  <div className="w-32 flex items-center justify-center gap-2">
                    <button onClick={() => handleQty(idx, 'dec')} className="p-1 rounded border text-green-600 border-green-200 hover:bg-green-50"><FaChevronLeft size={14} /></button>
                    <span className="px-3 text-green-900 font-semibold">{item.quantity}</span>
                    <button onClick={() => handleQty(idx, 'inc')} className="p-1 rounded border text-green-600 border-green-200 hover:bg-green-50"><FaChevronRight size={14} /></button>
                  </div>
                  <div className="w-24 text-right text-green-900 font-semibold">₹{(item.price * item.quantity).toLocaleString()}</div>
                </div>
                <div className="w-4" />
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/products" className="text-green-700 font-medium flex items-center gap-1 hover:underline">
              <FaChevronLeft size={16} /> Continue Shopping
            </Link>
          </div>
        </div>
        {/* Order Summary */}
        <div className="w-full md:w-96 bg-green-50 rounded-2xl shadow-lg border border-green-100 p-8 h-fit">
          <h2 className="text-xl font-bold mb-6 text-green-900">Order Summary</h2>
          <div className="mb-4">
            <div className="text-xs text-green-700 font-semibold mb-1">SELECT ADDRESS</div>
            <div className="bg-white border border-green-100 rounded px-3 py-2 text-sm flex items-center justify-between cursor-pointer" onClick={() => setShowAddAddress(true)}>
              <span className="text-green-900">{selectedAddress ? `${selectedAddress.name}, ${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.pincode}` : 'Add new address'}</span>
              <span className="text-green-300 ml-2">&gt;</span>
            </div>
          </div>
          {/* Address Modal */}
          {showAddAddress && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-bold mb-4 text-green-800">Select Address</h3>
                <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                  {addresses.map((addr, i) => (
                    <div key={i} className={`p-3 rounded border cursor-pointer ${selectedAddress === addr ? 'border-green-600 bg-green-50' : 'border-green-100 hover:bg-green-50'}`} onClick={() => handleSelectAddress(addr)}>
                      <div className="font-semibold text-green-900">{addr.name}</div>
                      <div className="text-green-800 text-sm">{addr.address}, {addr.city}, {addr.state}, {addr.pincode}</div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleAddAddress} className="space-y-2">
                  <div className="font-semibold text-green-700">Add New Address</div>
                  <input className="w-full border border-green-200 rounded px-3 py-2 text-sm" placeholder="Name" value={newAddress.name} onChange={e => setNewAddress(a => ({ ...a, name: e.target.value }))} />
                  <input className="w-full border border-green-200 rounded px-3 py-2 text-sm" placeholder="Address" value={newAddress.address} onChange={e => setNewAddress(a => ({ ...a, address: e.target.value }))} />
                  <input className="w-full border border-green-200 rounded px-3 py-2 text-sm" placeholder="City" value={newAddress.city} onChange={e => setNewAddress(a => ({ ...a, city: e.target.value }))} />
                  <input className="w-full border border-green-200 rounded px-3 py-2 text-sm" placeholder="State" value={newAddress.state} onChange={e => setNewAddress(a => ({ ...a, state: e.target.value }))} />
                  <input className="w-full border border-green-200 rounded px-3 py-2 text-sm" placeholder="ZIP Code" value={newAddress.pincode} onChange={e => setNewAddress(a => ({ ...a, pincode: e.target.value }))} />
                  <div className="flex gap-2 mt-2">
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-semibold text-sm hover:bg-green-700 transition">Add Address</button>
                    <button type="button" className="bg-gray-200 text-green-900 px-4 py-2 rounded font-semibold text-sm hover:bg-gray-300 transition" onClick={() => setShowAddAddress(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <div className="mb-4">
            <div className="text-xs text-green-700 font-semibold mb-1">PROMO CODE</div>
            <div className="flex gap-2">
              <input type="text" value={promo} onChange={e => setPromo(e.target.value)} placeholder="Enter promo code" className="flex-1 px-3 py-2 rounded border border-green-100 text-sm text-green-900 bg-green-50 focus:bg-white focus:border-green-400" />
              <button className="bg-green-600 text-white px-5 py-2 rounded font-semibold text-sm hover:bg-green-700 transition">Apply</button>
            </div>
          </div>
          <div className="border-t border-green-100 pt-4 mt-4 text-sm text-green-900 space-y-2">
            <div className="flex justify-between"><span>ITEMS {itemsCount}</span><span>₹{itemsTotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Shipping Fee</span><span>{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString()}`}</span></div>
            <div className="flex justify-between"><span>Tax (2%)</span><span>₹{tax.toLocaleString()}</span></div>
          </div>
          <div className="flex justify-between items-center mt-6 text-lg font-bold text-green-900">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
          <button
            className="w-full mt-6 bg-green-600 text-white py-3 rounded-full font-bold text-base hover:bg-green-700 transition btn-primary disabled:opacity-60"
            onClick={handlePlaceOrder}
            disabled={orderLoading || orderSuccess}
          >
            {orderLoading ? 'Placing order...' : orderSuccess ? 'Order Placed!' : 'Place Order'}
          </button>
          {orderSuccess && (
            <div className="text-green-700 text-center mt-4 font-semibold">Order placed successfully! Redirecting to home...</div>
          )}
        </div>
      </div>
    </div>
  );
} 