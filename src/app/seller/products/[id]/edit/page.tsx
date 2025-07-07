"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

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

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [form, setForm] = useState({
    title: "",
    category: "",
    subcategory: "",
    price: "",
    quantity: "",
    unit: "",
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products?id=${id}`)
      .then(res => res.json())
      .then(product => {
        setForm({
          title: product.title || "",
          category: product.category || "",
          subcategory: product.subcategory || "",
          price: product.price?.toString() || "",
          quantity: product.quantity?.toString() || "",
          unit: product.unit || "",
          description: product.description || "",
          image: product.image || "",
        });
        setLoading(false);
      });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    // Validate subcategory matches category
    const catObj = categories.find(cat => cat.label === form.category);
    if (!catObj || !catObj.sub.includes(form.subcategory)) {
      setError("Please select a valid subcategory for the chosen category.");
      setSaving(false);
      return;
    }
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          ...form,
          price: Number(form.price),
          quantity: Number(form.quantity),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update product");
      setSuccess("Product updated!");
      setTimeout(() => router.push("/seller/products"), 1000);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form className="bg-white rounded-lg shadow p-6 flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Current Image</label>
          {form.image ? (
            <img src={form.image} alt="Product" className="h-40 object-contain rounded mb-2 border" />
          ) : (
            <div className="h-40 flex items-center justify-center bg-gray-100 rounded text-gray-400">No Image</div>
          )}
        </div>
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
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-1">Price</label>
            <input className="border p-2 rounded w-full" type="number" placeholder="Price" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-1">Quantity</label>
            <input className="border p-2 rounded w-full" type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} required />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-1">Unit</label>
            <select
              className="border p-2 rounded w-full"
              value={form.unit}
              onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
              required
            >
              <option value="">Select Unit</option>
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="piece">piece</option>
              <option value="dozen">dozen</option>
              <option value="litre">litre</option>
              <option value="ml">ml</option>
              <option value="pack">pack</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea className="border p-2 rounded w-full" placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>
        <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 mt-2" type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
      </form>
    </div>
  );
} 