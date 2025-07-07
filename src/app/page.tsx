"use client";
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import ProductCard from './components/ProductCard';
import Categories from './components/Categories';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const slides = [
  {
    headline: 'Fresh Vegetables for Every Kitchen',
    sub: 'Farm to Table',
    cta: 'Shop Vegetables',
    ctaLink: '/products?category=vegetables',
    img: '/assets/arrangement-vegetables-dark-background.jpg',
    bg: 'bg-green-100',
  },
  {
    headline: 'Spices & Flavors from Across India',
    sub: 'Aromatic Selection',
    cta: 'Explore Spices',
    ctaLink: '/products?category=spices',
    img: '/assets/wooden-spoons-with-variety-spices-close-up.jpg',
    bg: 'bg-green-200',
  },
  {
    headline: 'Exotic Fruits, Bursting with Freshness',
    sub: 'Seasonal Picks',
    cta: 'Browse Fruits',
    ctaLink: '/products?category=fruits',
    img: '/assets/close-up-kiwi-mango-pear-orange-apricot-fruits.jpg',
    bg: 'bg-green-300',
  },
  {
    headline: "Berries & More – Nature's Sweetest Treats",
    sub: 'Handpicked Berries',
    cta: 'See Berries',
    ctaLink: '/products?category=fruits',
    img: '/assets/strawberry-berry-levitating-white-background.jpg',
    bg: 'bg-green-50',
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Local Farmer",
    content: "AgroTrade has transformed how I sell my produce. The platform is easy to use and connects me directly with buyers.",
    rating: 5,
    image: "/assets/farmer.png"
  },
  {
    name: "Rajesh Kumar",
    role: "Restaurant Owner",
    content: "Fresh, quality ingredients delivered right to my kitchen. AgroTrade has become my go-to source for organic produce.",
    rating: 5,
    image: "/assets/farmer.png"
  },
  {
    name: "Meera Patel",
    role: "Home Chef",
    content: "I love the variety and freshness of products available. The customer service is exceptional and delivery is always on time.",
    rating: 5,
    image: "/assets/farmer.png"
  },
  {
    name: "Amit Singh",
    role: "Organic Store Owner",
    content: "As a retailer, AgroTrade helps me source the best quality products directly from farmers. Highly recommended!",
    rating: 5,
    image: "/assets/farmer.png"
  }
];

const features = [
  {
    icon: "🌾",
    title: "Direct from Farmers",
    description: "Connect directly with local farmers for the freshest produce"
  },
  {
    icon: "🚚",
    title: "Fast Delivery",
    description: "Quick and reliable delivery to your doorstep"
  },
  {
    icon: "🌱",
    title: "Organic Options",
    description: "Wide selection of organic and natural products"
  },
  {
    icon: "💰",
    title: "Best Prices",
    description: "Competitive prices with no middleman markup"
  }
];

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

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [filter, setFilter] = useState<{ category: string; subcategory?: string } | null>(null);
  const [loadingFiltered, setLoadingFiltered] = useState(false);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [loadingNewArrivals, setLoadingNewArrivals] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const newArrivalsRef = useRef<HTMLDivElement>(null);
  const popularRef = useRef<HTMLDivElement>(null);

  // Auto-advance logic
  useEffect(() => {
    if (paused) return;
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000); // 3 seconds between slides
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current, paused]);

  // Fetch products for Popular Products section
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoadingProducts(false);
      });
  }, []);

  // Handle category selection from Categories component
  const handleCategorySelect = (category: string, subcategory?: string) => {
    setFilter({ category, subcategory });
  };

  // Fetch filtered products when filter changes
  useEffect(() => {
    if (!filter) return;
    setLoadingFiltered(true);
    let url = '/api/products?';
    if (filter.category) url += `category=${encodeURIComponent(filter.category)}`;
    if (filter.subcategory) url += `&subcategory=${encodeURIComponent(filter.subcategory)}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setFilteredProducts(data);
        setLoadingFiltered(false);
      });
  }, [filter]);

  // Fetch new arrivals
  useEffect(() => {
    fetch('/api/products?sort=new')
      .then(res => res.json())
      .then(data => {
        setNewArrivals(data.slice(0, 8));
        setLoadingNewArrivals(false);
      });
  }, []);

  useEffect(() => {
    function handleCategorySelect(e: CustomEvent<any>) {
      setFilter(e.detail);
    }
    window.addEventListener("category-select", handleCategorySelect as EventListener);
    return () => window.removeEventListener("category-select", handleCategorySelect as EventListener);
  }, []);

  const goTo = (idx: number) => {
    if (idx === current) return;
    setCurrent(idx);
  };
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const next = () => setCurrent((prev) => (prev + 1) % slides.length);

  const scrollRow = (ref: React.RefObject<HTMLDivElement>, dir: 'left' | 'right') => {
    if (ref.current) {
      const amount = 220; // Adjust based on card width
      ref.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  // Redirect /dashboard/orders to /orders
  useEffect(() => {
    if (pathname === '/dashboard/orders') {
      router.replace('/orders');
    }
  }, [pathname, router]);

  return (
    <main className="min-h-screen bg-green-50">
      {/* Hero Section with Swiper */}
      <section className="section-padding" data-aos="fade-up">
        <div className="container-responsive">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            effect="fade"
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{
              clickable: true,
              el: '.swiper-pagination',
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="hero-swiper rounded-3xl overflow-hidden shadow-2xl"
            onSlideChange={(swiper) => setCurrent(swiper.realIndex)}
          >
            {slides.map((slide, idx) => (
              <SwiperSlide key={idx}>
                <motion.div
                  initial={{ opacity: 0, x: -80 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className={`relative min-h-[300px] md:min-h-[400px] lg:min-h-[500px] ${slide.bg} flex items-center transition-all duration-500`}
                >
                  <div className="container-responsive">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-center lg:text-left"
                      >
                        <motion.div 
                          className="text-green-700 font-semibold mb-4 text-lg md:text-xl"
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                        >
                          {slide.sub}
                        </motion.div>
                        <motion.h1 
                          className="heading-1 text-green-900 mb-6 leading-tight"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.7, delay: 0.4 }}
                        >
                          {slide.headline}
                        </motion.h1>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.5 }}
                        >
                          <Link href={slide.ctaLink} className="btn-primary text-xl md:text-2xl px-8 py-4 rounded-full shadow-lg">
                            {slide.cta}
                          </Link>
                        </motion.div>
                      </motion.div>
                      <motion.div 
                        className={`flex items-center justify-center h-full w-full${slide.headline === 'Become a Seller on AgroTrade' ? ' lg:ml-16' : ' lg:ml-4'}`}
                        initial={{ opacity: 0, x: 60, scale: 0.92 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                      >
                        <img 
                          src={slide.img} 
                          alt="slide" 
                          className="h-full max-h-[320px] md:max-h-[380px] lg:max-h-[440px] w-auto object-contain rounded-2xl shadow-xl transition-all duration-500" 
                        />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
            {/* Modernized Swiper navigation buttons */}
            <div className="swiper-button-prev !bg-white/60 !backdrop-blur !w-12 !h-12 !rounded-full !shadow-lg !border !border-green-100 flex items-center justify-center transition-all duration-200">
              <svg width="22" height="22" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </div>
            <div className="swiper-button-next !bg-white/60 !backdrop-blur !w-12 !h-12 !rounded-full !shadow-lg !border !border-green-100 flex items-center justify-center transition-all duration-200">
              <svg width="22" height="22" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </div>
            <div className="swiper-pagination !bottom-4"></div>
          </Swiper>
        </div>
      </section>

      {/* Filtered Products Section (from Categories) */}
      {filter && (
        <section className="section-padding" data-aos="fade-up">
          <div className="container-responsive">
            <div className="flex items-center justify-between mb-8">
              <h2 className="heading-2 text-green-800">{filter.subcategory || filter.category}</h2>
              <button
                className="text-green-700 font-semibold hover:underline text-lg transition-colors"
                onClick={() => setFilter(null)}
              >
                Clear
              </button>
            </div>
            {loadingFiltered ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found for this category.</p>
              </div>
            ) : (
              <Swiper
                modules={[Navigation, Pagination]}
                slidesPerView="auto"
                navigation={true}
                spaceBetween={12}
                className="filtered-products-swiper"
              >
                {filteredProducts.map((product, idx) => (
                  <SwiperSlide key={product._id} style={{ width: 220, flexShrink: 0 }}>
                    <ProductCard {...product} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </section>
      )}

      {/* New Arrivals Section */}
      <section className="py-12 bg-green-50" data-aos="fade-up">
        <div className="container-responsive">
          <div className="flex items-center justify-between mb-8">
            <h2 className="heading-2 text-green-800">New Arrivals</h2>
            <Link href="/products?sort=new" className="text-green-700 font-semibold hover:underline text-lg transition-colors">
              See All
            </Link>
          </div>
          
          {loadingNewArrivals ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination]}
              slidesPerView="auto"
              navigation={true}
              spaceBetween={12}
              className="new-arrivals-swiper"
            >
              {newArrivals.map((product, idx) => (
                <SwiperSlide key={product._id} style={{ width: 220, flexShrink: 0 }}>
                  <ProductCard {...product} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          
          <div className="flex justify-center mt-8">
            <div className="new-arrivals-pagination"></div>
          </div>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="bg-green-50" data-aos="fade-up">
        <div className="container-responsive">
          <div className="flex items-center justify-between mb-8">
            <h2 className="heading-2 text-green-800">Popular Products</h2>
            <Link href="/products" className="text-green-700 font-semibold hover:underline text-lg transition-colors">
              See All
            </Link>
          </div>
          
          {loadingProducts ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination]}
              slidesPerView="auto"
              navigation={true}
              spaceBetween={12}
              className="popular-swiper"
            >
              {products.slice(0, 8).map((product, idx) => (
                <SwiperSlide key={product._id} style={{ width: 220, flexShrink: 0 }}>
                  <ProductCard {...product} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          
          <div className="flex justify-center mt-8">
            <div className="popular-pagination"></div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-green-50  pt-6 pb-12" style={{marginTop: 0}} data-aos="fade-up">
        <div className="container-responsive">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-2 text-green-800 mb-4">Featured Categories</h2>
            <p className="body-text text-gray-600 max-w-2xl mx-auto">
              Explore our curated selection of premium agricultural products
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[{title: "Unmatched Freshness",description: "Experience the best of local vegetables, handpicked for you.",image: "/assets/arrangement-vegetables-dark-background.jpg",link: "/products?category=vegetables",cta: "Shop Vegetables"},{title: "Aromatic Spices",description: "Bring home the flavors of India with our curated spice collection.",image: "/assets/wooden-spoons-with-variety-spices-close-up.jpg",link: "/products?category=spices",cta: "Shop Spices"},{title: "Seasonal Fruits",description: "Taste the sweetness of nature with our fresh, seasonal fruits.",image: "/assets/close-up-kiwi-mango-pear-orange-apricot-fruits.jpg",link: "/products?category=fruits",cta: "Shop Fruits"}].map((featured, idx) => (
              <motion.div
                key={idx}
                className="card p-6 flex flex-col items-start justify-end min-h-[340px] relative overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-center h-full w-full">
                  <Image 
                    src={featured.image} 
                    alt={featured.title} 
                    fill 
                    className="object-cover absolute inset-0 opacity-60 group-hover:opacity-70 transition-opacity duration-300 transform" 
                  />
                </div>
                <div className="relative z-10">
                  <h3 className="heading-3 text-green-900 mb-2">{featured.title}</h3>
                  <p className="body-text text-green-800 mb-4">{featured.description}</p>
                  <Link href={featured.link} className="btn-primary">
                    {featured.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-green-600 py-24" data-aos="fade-up">
        <div className="container-responsive">
          <motion.div 
            className="text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-2 mb-4">Ready to Start Your Agricultural Journey?</h2>
            <p className="body-text mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of farmers and buyers who trust AgroTrade for their agricultural commerce needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/products" className="btn-secondary bg-white text-green-700 hover:bg-green-50">
                  Browse Products
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/seller" className="btn-primary bg-white text-green-600 hover:bg-green-50">
                  Become a Seller
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
