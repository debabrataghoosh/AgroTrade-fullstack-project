"use client";
import "./globals.css";
import { ClerkProvider, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import Loader from "@/app/components/Loader";
import ProgressBar from "@/app/components/ProgressBar";
import { usePathname, useRouter } from "next/navigation";
import SellCropsButton from "@/app/components/SellCropsButton";
import Link from "next/link";
import CustomUserButton from "@/app/components/CustomUserButton";
import Footer from "@/app/components/Footer";
import Categories from "@/app/components/Categories";
import { motion, AnimatePresence } from "framer-motion";
import { Inter } from 'next/font/google';
import { UserButton } from '@clerk/nextjs';
import { SocketProvider } from "@/app/components/SocketProvider";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Dropdown state for categories
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeAllSub, setActiveAllSub] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState("");

  // Initialize AOS
  useEffect(() => {
    const initAOS = async () => {
      const AOS = (await import('aos')).default;
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100,
      });
    };
    initAOS();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 700); // Simulate loading
    return () => clearTimeout(timeout);
  }, [pathname]);

  // Category data
  const categories = [
    {
      key: "all",
      icon: "/assets/all-menu.png",
      label: "All",
      sub: [
        "Cereal Grains",
        "Pulses",
        "Oilseeds",
        "Vegetables",
        "Fruits",
        "Spices & Herbs",
        "Plantation & Commercial",
        "Organic / Specialty",
        "Sell Byproduct"
      ]
    },
    {
      key: "cereal",
      icon: "/assets/Cereal.png",
      label: "Cereal Grains",
      sub: ["Rice", "Wheat", "Maize (Corn)", "Barley", "Millets (Bajra, Jowar, Ragi)"]
    },
    {
      key: "pulses",
      icon: "/assets/Pulses.png",
      label: "Pulses",
      sub: ["Chickpeas (Chana)", "Pigeon Peas (Toor/Arhar Dal)", "Lentils (Masoor Dal)", "Urad Dal (Black Gram)", "Moong Dal (Green Gram)"]
    },
    {
      key: "oilseeds",
      icon: "/assets/seeds.png",
      label: "Oilseeds",
      sub: ["Mustard", "Groundnut (Peanut)", "Soybean", "Sesame (Til)", "Sunflower Seeds"]
    },
    {
      key: "vegetables",
      icon: "/assets/vegetables.png",
      label: "Vegetables",
      sub: ["Tomato", "Potato", "Onion", "Brinjal", "Cauliflower, Cabbage, Carrot", "Green Chilli"]
    },
    {
      key: "fruits",
      icon: "/assets/Fruits.png",
      label: "Fruits",
      sub: ["Mango", "Banana", "Apple", "Guava", "Pomegranate", "Papaya"]
    },
    {
      key: "spices",
      icon: "/assets/chilli.png",
      label: "Spices & Herbs",
      sub: ["Turmeric", "Coriander", "Cumin", "Chilli", "Ginger, Garlic", "Fenugreek (Methi)"]
    },
    {
      key: "plantation",
      icon: "/assets/tea.png",
      label: "Plantation & Commercial",
      sub: ["Tea", "Coffee", "Coconut", "Rubber", "Sugarcane", "Cotton"]
    },
    {
      key: "organic",
      icon: "/assets/organic.png",
      label: "Organic / Specialty",
      sub: ["Organic Rice / Wheat", "Black Rice / Red Rice", "Quinoa", "Buckwheat", "Medicinal Plants (e.g., Aloe Vera, Ashwagandha)"]
    },
    {
      key: "byproduct",
      icon: "/assets/byproduct.png",
      label: "Byproducts",
      sub: ["Crop residues", "Animal feed", "Compost / Fertilizer"]
    }
  ];

  // Map for subcategories of each main category (for All mega menu)
  const allSubMap: Record<string, string[]> = {
    "Cereal Grains": ["Rice", "Wheat", "Maize (Corn)", "Barley", "Millets (Bajra, Jowar, Ragi)"],
    "Pulses": ["Chickpeas (Chana)", "Pigeon Peas (Toor/Arhar Dal)", "Lentils (Masoor Dal)", "Urad Dal (Black Gram)", "Moong Dal (Green Gram)"],
    "Oilseeds": ["Mustard", "Groundnut (Peanut)", "Soybean", "Sesame (Til)", "Sunflower Seeds"],
    "Vegetables": ["Tomato", "Potato", "Onion", "Brinjal", "Cauliflower, Cabbage, Carrot", "Green Chilli"],
    "Fruits": ["Mango", "Banana", "Apple", "Guava", "Pomegranate", "Papaya"],
    "Spices & Herbs": ["Turmeric", "Coriander", "Cumin", "Chilli", "Ginger, Garlic", "Fenugreek (Methi)"],
    "Plantation & Commercial": ["Tea", "Coffee", "Coconut", "Rubber", "Sugarcane", "Cotton"],
    "Organic / Specialty": ["Organic Rice / Wheat", "Black Rice / Red Rice", "Quinoa", "Buckwheat", "Medicinal Plants (e.g., Aloe Vera, Ashwagandha)"],
    "Sell Byproduct": ["Crop residues", "Animal feed", "Compost / Fertilizer"]
  };

  return (
    <ClerkProvider>
      <SocketProvider>
        <html lang="en">
          <body className={inter.className}>
            <ProgressBar loading={loading} />
            {loading && <Loader />}
            {pathname && !pathname.startsWith("/seller") && pathname !== "/becomeseller" && pathname !== "/checkout" && (
              <>
                <motion.header 
                  className="w-full bg-green-600 shadow-lg sticky top-0 z-50"
                  initial={{ y: -100 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Desktop Header */}
                  <div className="hidden lg:flex items-center justify-between px-6 py-3">
                    {/* Logo */}
                    <motion.div 
                      className="text-xl font-bold flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link href="/" className="flex items-center gap-2 group">
                        <img src="/assets/agro-tradelogo.png" alt="AgroTrade Logo" className="h-12 w-auto" style={{maxHeight:'48px'}} />
                      </Link>
                    </motion.div>
                    
                    {/* Location, Search, Language */}
                    <div className="flex items-center gap-6 flex-1 justify-between mx-8">
                      {/* Location Selector */}
                      <div className="relative">
                        <select className="bg-white text-green-700 font-semibold rounded-full px-4 py-2 shadow border border-green-200 focus:outline-none appearance-none pr-8 transition-all hover:shadow-md">
                          <option value="india">India</option>
                          <option value="kolkata">Kolkata</option>
                          <option value="delhi">Delhi</option>
                          <option value="mumbai">Mumbai</option>
                          <option value="bangalore">Bangalore</option>
                        </select>
                        <span className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                      </div>
                      
                      {/* Search Bar */}
                      <div className="flex flex-[2] min-w-0 bg-white rounded-full overflow-hidden shadow border border-gray-200">
                        <input
                          type="text"
                          placeholder="Basmati rice"
                          className="flex-1 px-4 py-2 focus:outline-none text-gray-800 bg-white min-w-0 rounded-full"
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === "Enter" && search.trim()) {
                              router.push(`/products?search=${encodeURIComponent(search.trim())}`);
                            }
                          }}
                        />
                        <motion.button
                          className="bg-green-500 hover:bg-green-700 px-4 flex items-center justify-center transition-colors rounded-full"
                          onClick={() => {
                            if (search.trim()) {
                              router.push(`/products?search=${encodeURIComponent(search.trim())}`);
                            }
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        </motion.button>
                      </div>
                    </div>
                    
                    <nav className="flex gap-4 items-center">
                      {/* Language Selector */}
                      <motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                        <select className="flex items-center gap-2 px-4 py-2 text-lg font-semibold bg-green-600 text-white rounded-full shadow-[0_8px_32px_0_rgba(16,133,56,0.45)] border-none focus:outline-none appearance-none pr-8 transition-all hover:bg-green-700">
                          <option value="en">English</option>
                          <option value="hi">Hindi</option>
                          <option value="bn">Bengali</option>
                          <option value="ta">Tamil</option>
                          <option value="te">Telugu</option>
                        </select>
                        <span className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                      </motion.div>
                      
                      {/* Become a Seller Button */}
                      <SellCropsButton className="btn-primary" />
                      <SignedIn>
                        <CustomUserButton />
                      </SignedIn>
                      <SignedOut>
                        <SignInButton />
                      </SignedOut>
                    </nav>
                  </div>

                  {/* Mobile Header */}
                  <div className="lg:hidden flex items-center justify-between px-4 py-3">
                    {/* Logo */}
                    <motion.div 
                      className="text-lg font-bold flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link href="/" className="flex items-center gap-2">
                        <img src="/assets/agro-tradelogo.png" alt="AgroTrade Logo" className="h-10 w-auto" />
                      </Link>
                    </motion.div>

                    {/* Mobile Menu Button */}
                    <motion.button
                      className="text-white p-2"
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        {isMobileMenuOpen ? (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                      </svg>
                    </motion.button>
                  </div>

                  {/* Mobile Menu */}
                  <AnimatePresence>
                    {isMobileMenuOpen && (
                      <motion.div
                        className="lg:hidden bg-green-700 border-t border-green-500"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-4 py-4 space-y-4">
                          {/* Search Bar */}
                          <div className="flex bg-white rounded-full overflow-hidden shadow">
                            <input
                              type="text"
                              placeholder="Search products..."
                              className="flex-1 px-4 py-2 focus:outline-none text-gray-800"
                              value={search}
                              onChange={e => setSearch(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === "Enter" && search.trim()) {
                                  router.push(`/products?search=${encodeURIComponent(search.trim())}`);
                                  setIsMobileMenuOpen(false);
                                }
                              }}
                            />
                            <button
                              className="bg-green-500 px-4 py-2"
                              onClick={() => {
                                if (search.trim()) {
                                  router.push(`/products?search=${encodeURIComponent(search.trim())}`);
                                  setIsMobileMenuOpen(false);
                                }
                              }}
                            >
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                            </button>
                          </div>

                          {/* Location Selector */}
                          <div className="relative">
                            <select className="w-full bg-white text-green-700 font-semibold rounded-full px-4 py-2 shadow border border-green-200 focus:outline-none appearance-none pr-8">
                              <option value="india">India</option>
                              <option value="kolkata">Kolkata</option>
                              <option value="delhi">Delhi</option>
                              <option value="mumbai">Mumbai</option>
                              <option value="bangalore">Bangalore</option>
                            </select>
                            <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                            </span>
                          </div>

                          {/* Language Selector */}
                          <div className="relative">
                            <select className="w-full bg-white text-green-700 font-semibold rounded-full px-4 py-2 shadow border border-green-200 focus:outline-none appearance-none pr-8">
                              <option value="en">English</option>
                              <option value="hi">Hindi</option>
                              <option value="bn">Bengali</option>
                              <option value="ta">Tamil</option>
                              <option value="te">Telugu</option>
                            </select>
                            <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-3">
                            <SellCropsButton className="w-full btn-primary" />
                            <SignedIn>
                              <CustomUserButton />
                            </SignedIn>
                            <SignedOut>
                              <SignInButton />
                            </SignedOut>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.header>

                {/* Category menu below header */}
                {!((
                  (pathname.startsWith("/products") && typeof window !== 'undefined' && window.location.search.includes('search=')) ||
                  (/^\/products\/[^/]+$/.test(pathname)) ||
                  (pathname.startsWith("/chat")) ||
                  (pathname === "/checkout")
                )
              ) && pathname !== "/becomeseller" && (
                  pathname === "/" ? (
                    <Categories categories={categories} onCategorySelect={(category, subcategory) => {
                      window.dispatchEvent(new CustomEvent("category-select", { detail: { category, subcategory } }));
                    }} />
                  ) : (
                    <Categories categories={categories} />
                  )
                )}
              </>
            )}
            
            {/* Move Login button to left bottom corner */}
            {pathname && pathname.startsWith("/seller") && (
              <SignedOut>
                <div className="fixed bottom-6 left-6 z-50">
                  <SignInButton>
                    <button className="btn-primary">Login</button>
                  </SignInButton>
                </div>
              </SignedOut>
            )}
            
            <div className="bg-white min-h-screen flex flex-col">
              {children}
              <Footer />
            </div>
          </body>
        </html>
      </SocketProvider>
    </ClerkProvider>
  );
}
