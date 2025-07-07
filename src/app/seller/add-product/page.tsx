"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

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

export default function AddProductPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
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
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </motion.div>
    </div>
  );
  
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-red-600 text-lg font-semibold mb-4">You must be logged in to add products.</div>
          <button 
            onClick={() => router.push('/sign-in')}
            className="btn-primary"
          >
            Sign In
          </button>
        </motion.div>
      </div>
    );
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageUploading(true);
      setError("");
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setForm(f => ({ ...f, image: data.url }));
      } catch (err: any) {
        setError(err.message || "Image upload failed");
        setForm(f => ({ ...f, image: "" }));
        setImagePreview(null);
      } finally {
        setImageUploading(false);
      }
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageUploading(true);
      setError("");
      const formData = new FormData();
      formData.append("file", file);
      fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Upload failed");
          setForm(f => ({ ...f, image: data.url }));
        })
        .catch((err) => {
          setError(err.message || "Image upload failed");
          setForm(f => ({ ...f, image: "" }));
          setImagePreview(null);
        })
        .finally(() => {
          setImageUploading(false);
        });
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
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmedTitle,
          description: trimmedDescription,
          price: priceNumber,
          quantity: Number(form.quantity),
          unit: form.unit.trim(),
          image: form.image, // Now always a URL
          category: form.category,
          subcategory: form.subcategory,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add product");
      setSuccess("Product added successfully!");
      setTimeout(() => router.push("/seller/products"), 1000);
    } catch (err: any) {
      setError((err.message || "Something went wrong") + "\nForm state: " + JSON.stringify(form));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
      <div className="container-responsive">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="heading-1 text-green-800 mb-4">Add New Product</h1>
          <p className="body-text text-gray-600 max-w-2xl mx-auto">
            Showcase your agricultural products to buyers across the platform
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Image upload */}
          <motion.div 
            className="flex-1 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center border border-green-200"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="heading-3 text-green-800 mb-6">Product Image</h2>
            <motion.div
              className="border-2 border-dashed border-green-300 rounded-2xl flex flex-col items-center justify-center h-64 w-full max-w-xs cursor-pointer hover:border-green-500 transition-all duration-300 bg-green-50/60"
              onClick={() => !imageUploading && fileInputRef.current?.click()}
              onDrop={imageUploading ? undefined : handleDrop}
              onDragOver={e => e.preventDefault()}
              onKeyDown={e => e.preventDefault()}
              style={{ opacity: imageUploading ? 0.5 : 1, pointerEvents: imageUploading ? 'none' : 'auto' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {imageUploading ? (
                <motion.div 
                  className="flex flex-col items-center justify-center h-full w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                  <span className="text-green-600 font-medium">Uploading...</span>
                </motion.div>
              ) : imagePreview ? (
                <motion.img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="h-40 object-contain mb-4 rounded-xl shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <svg className="w-20 h-20 text-green-300 mb-4 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h10a4 4 0 004-4M7 15V7a4 4 0 018 0v8" />
                  </svg>
                  <span className="text-green-700 font-medium text-lg">Drop or <span className="text-green-600 underline">Browse</span></span>
                  <p className="text-green-600 text-sm mt-2">PNG, JPG up to 10MB</p>
                </motion.div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
                tabIndex={-1}
                disabled={imageUploading}
              />
            </motion.div>
            
            {imagePreview && (
              <motion.div 
                className="mt-6 flex flex-col gap-3 items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-lg shadow" />
                <motion.button 
                  className="text-red-500 text-sm hover:underline font-medium"
                  onClick={() => { setForm(f => ({ ...f, image: "" })); setImagePreview(null); }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Remove Image
                </motion.button>
              </motion.div>
            )}
            
            {error && error.toLowerCase().includes('image') && (
              <motion.div 
                className="text-red-600 text-sm mt-4 p-3 bg-red-50 rounded-lg border border-red-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.div>
            )}
          </motion.div>

          {/* Product form */}
          <motion.form 
            className="flex-1 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 flex flex-col gap-6 border border-green-200"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="heading-3 text-green-800 mb-2">Product Details</h2>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <input 
                className="peer border-b-2 border-green-200 focus:border-green-500 outline-none bg-transparent w-full py-3 px-1 text-lg placeholder-transparent transition-colors duration-200" 
                type="text" 
                placeholder="Product Name" 
                value={form.title} 
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} 
                required 
                disabled={loading} 
                id="product-name" 
              />
              <label htmlFor="product-name" className="absolute left-1 top-3 text-gray-500 text-base transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-xs peer-focus:text-green-700 bg-white/80 px-1">
                Product Name *
              </label>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div 
                className="flex-1 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <select
                  className="peer border-b-2 border-green-200 focus:border-green-500 outline-none bg-transparent w-full py-3 px-1 text-lg text-black transition-colors duration-200"
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value, subcategory: "" }))}
                  required
                  disabled={loading}
                  id="category"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.label} value={cat.label}>{cat.label}</option>
                  ))}
                </select>
                <label htmlFor="category" className="absolute left-1 -top-5 text-xs text-green-700 bg-white/80 px-1">
                  Category *
                </label>
              </motion.div>
              
              <motion.div 
                className="flex-1 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <select
                  className="peer border-b-2 border-green-200 focus:border-green-500 outline-none bg-transparent w-full py-3 px-1 text-lg text-black transition-colors duration-200"
                  value={form.subcategory}
                  onChange={e => setForm(f => ({ ...f, subcategory: e.target.value }))}
                  required
                  disabled={!form.category || loading}
                  id="subcategory"
                >
                  <option value="">Select Sub Category</option>
                  {categories.find(cat => cat.label === form.category)?.sub.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
                <label htmlFor="subcategory" className="absolute left-1 -top-5 text-xs text-green-700 bg-white/80 px-1">
                  Sub Category *
                </label>
              </motion.div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div 
                className="flex-1 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
              >
                <input 
                  className="peer border-b-2 border-green-200 focus:border-green-500 outline-none bg-transparent w-full py-3 px-1 text-lg placeholder-transparent transition-colors duration-200" 
                  type="number" 
                  placeholder="Price" 
                  value={form.price} 
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))} 
                  required 
                  disabled={loading} 
                  id="price" 
                />
                <label htmlFor="price" className="absolute left-1 top-3 text-gray-500 text-base transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-xs peer-focus:text-green-700 bg-white/80 px-1">
                  Price (₹) *
                </label>
              </motion.div>
              
              <motion.div 
                className="flex-1 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.9 }}
              >
                <input 
                  className="peer border-b-2 border-green-200 focus:border-green-500 outline-none bg-transparent w-full py-3 px-1 text-lg placeholder-transparent transition-colors duration-200" 
                  type="number" 
                  placeholder="Quantity" 
                  value={form.quantity} 
                  onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} 
                  required 
                  disabled={loading} 
                  id="quantity" 
                />
                <label htmlFor="quantity" className="absolute left-1 top-3 text-gray-500 text-base transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-xs peer-focus:text-green-700 bg-white/80 px-1">
                  Quantity *
                </label>
              </motion.div>
              
              <motion.div 
                className="flex-1 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1.0 }}
              >
                <select
                  className="peer border-b-2 border-green-200 focus:border-green-500 outline-none bg-transparent w-full py-3 px-1 text-lg text-black transition-colors duration-200"
                  value={form.unit}
                  onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                  required
                  disabled={loading}
                  id="unit"
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
                <label htmlFor="unit" className="absolute left-1 -top-5 text-xs text-green-700 bg-white/80 px-1">
                  Unit *
                </label>
              </motion.div>
            </div>

            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.1 }}
            >
              <textarea 
                className="peer border-b-2 border-green-200 focus:border-green-500 outline-none bg-transparent w-full py-3 px-1 text-lg placeholder-transparent min-h-[80px] transition-colors duration-200 resize-none" 
                placeholder="Description" 
                value={form.description} 
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                disabled={loading} 
                id="description" 
              />
              <label htmlFor="description" className="absolute left-1 top-3 text-gray-500 text-base transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-xs peer-focus:text-green-700 bg-white/80 px-1">
                Description (Optional)
              </label>
            </motion.div>

            <motion.button 
              className="btn-primary text-lg py-4 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit" 
              disabled={loading || imageUploading || !form.image}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 1.2 }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Publishing...
                </div>
              ) : (
                "Publish Product"
              )}
            </motion.button>

            <AnimatePresence>
              {error && (
                <motion.div 
                  className="text-red-600 text-sm p-4 bg-red-50 rounded-lg border border-red-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div 
                  className="text-green-600 text-sm p-4 bg-green-50 rounded-lg border border-green-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {success}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        </div>
      </div>
    </div>
  );
} 