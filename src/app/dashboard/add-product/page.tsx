"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const categories = [
  { label: "Cereal Grains", sub: ["Rice", "Wheat", "Maize (Corn)", "Barley", "Millets (Bajra, Jowar, Ragi)"] },
  { label: "Pulses", sub: ["Chickpeas (Chana)", "Pigeon Peas (Toor/Arhar Dal)", "Lentils (Masoor Dal)", "Urad Dal (Black Gram)", "Moong Dal (Green Gram)"] },
  { label: "Oilseeds", sub: ["Mustard", "Groundnut (Peanut)", "Soybean", "Sesame (Til)", "Sunflower Seeds"] },
  { label: "Vegetables", sub: ["Tomato", "Potato", "Onion", "Brinjal", "Cauliflower, Cabbage, Carrot", "Green Chilli"] },
  { label: "Fruits", sub: ["Mango", "Banana", "Apple", "Guava", "Pomegranate", "Papaya"] },
  { label: "Spices & Herbs", sub: ["Turmeric", "Coriander", "Cumin", "Chilli", "Ginger, Garlic", "Fenugreek (Methi)"] },
  { label: "Plantation & Commercial", sub: ["Tea", "Coffee", "Coconut", "Rubber", "Sugarcane", "Cotton"] },
  { label: "Organic / Specialty", sub: ["Organic Rice / Wheat", "Black Rice / Red Rice", "Quinoa", "Buckwheat", "Medicinal Plants (e.g., Aloe Vera, Ashwagandha)"] },
  { label: "Sell Byproduct", sub: ["Crop residues", "Animal feed", "Compost / Fertilizer"] },
];

const tagOptions = ["Organic", "Fresh", "Bulk", "Export", "Local", "Premium", "Wholesale", "Retail"];

export default function AddProductPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    category: "",
    subcategory: "",
    price: "",
    description: "",
    tags: [] as string[],
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isSignedIn) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">You must be logged in to add products.</div>;
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setForm(f => ({ ...f, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setForm(f => ({ ...f, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    // Robust validation
    const trimmedTitle = form.title.trim();
    const trimmedDescription = form.description.trim();
    const priceNumber = Number(form.price);
    // Validate subcategory matches category
    const catObj = categories.find(cat => cat.label === form.category);
    if (!catObj || !catObj.sub.includes(form.subcategory)) {
      setError("Please select a valid subcategory for the chosen category.");
      setLoading(false);
      return;
    }
    if (!trimmedTitle || !form.category || !form.subcategory || !form.image || !form.price || isNaN(priceNumber) || priceNumber <= 0 || !form.quantity || isNaN(Number(form.quantity)) || Number(form.quantity) <= 0 || !form.unit.trim()) {
      setError("Please fill in all required fields with valid values and upload an image.\n- Product Name, Category, Sub Category, Price (> 0), Quantity (> 0), Unit, and Image are required.");
      setLoading(false);
      console.log("Form state on error:", form);
      return;
    }
    // For demo, just simulate upload
    setTimeout(() => {
      setSuccess("Product added!");
      setLoading(false);
      setTimeout(() => router.push("/dashboard/products"), 1000);
    }, 1200);
    // In real app, send form data to API
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl mx-auto">
      {/* Image upload */}
      <div className="flex-1 bg-white rounded-lg shadow p-6 mb-6 md:mb-0">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-64 cursor-pointer hover:border-blue-400 transition"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="h-40 object-contain mb-2" />
          ) : (
            <>
              <svg className="w-16 h-16 text-gray-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h10a4 4 0 004-4M7 15V7a4 4 0 018 0v8" /></svg>
              <span className="text-gray-500">Drop your files here, or <span className="text-blue-600 underline">Browse</span></span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>
        {imagePreview && (
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <img src={imagePreview} alt="Preview" className="h-10 w-10 object-cover rounded" />
              <span className="text-gray-700 text-sm">{(form.image as File)?.name || "Image"}</span>
            </div>
            <button className="text-red-500 text-xs self-end" onClick={() => { setForm(f => ({ ...f, image: "" })); setImagePreview(null); }}>Remove</button>
          </div>
        )}
      </div>
      {/* Product form */}
      <form className="flex-1 bg-white rounded-lg shadow p-6 flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Product Name</label>
          <input className="border p-2 rounded w-full" type="text" placeholder="Product Name" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-1">Category</label>
            <select
              className="border p-2 rounded w-full"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value, subcategory: "" }))}
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.label} value={cat.label}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-1">Sub Category</label>
            <select
              className="border p-2 rounded w-full"
              value={form.subcategory}
              onChange={e => setForm(f => ({ ...f, subcategory: e.target.value }))}
              required
              disabled={!form.category}
            >
              <option value="">Select Sub Category</option>
              {categories.find(cat => cat.label === form.category)?.sub.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Price</label>
          <input className="border p-2 rounded w-full" type="number" placeholder="Price" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea className="border p-2 rounded w-full" placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tagOptions.map(tag => (
              <button
                type="button"
                key={tag}
                className={`px-3 py-1 rounded-full border text-sm ${form.tags.includes(tag) ? "bg-blue-100 text-blue-700 border-blue-400" : "bg-gray-100 text-gray-700 border-gray-300"}`}
                onClick={() => setForm(f => f.tags.includes(tag) ? { ...f, tags: f.tags.filter(t => t !== tag) } : { ...f, tags: [...f.tags, tag] })}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 mt-2" type="submit" disabled={loading}>{loading ? "Publishing..." : "Publish Product"}</button>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
      </form>
    </div>
  );
} 