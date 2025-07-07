"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useUser, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const testimonials = [
  {
    name: 'Ravi Kumar',
    quote: 'Joining AgroTrade helped me reach more buyers and grow my farm business online!',
    image: '/assets/farmer-walking-through-foggy-field-sunrise.jpg',
  },
  {
    name: 'Priya Singh',
    quote: 'The platform is easy to use and payments are always on time. Highly recommended for all farmers!',
    image: '/assets/view-woman-working-agricultural-sector-celebrate-labour-day-women.jpg',
  },
  {
    name: 'Amit Patel',
    quote: 'The dashboard is simple and payments are always on time. AgroTrade is a game changer!',
    image: '/assets/person-working-coffee-harvest.jpg',
  },
  {
    name: 'Sunita Devi',
    quote: 'I love how easy it is to manage my products and orders. Highly recommended!',
    image: '/assets/woman-gardening-summer-sun.jpg',
  },
];

const features = [
  {
    icon: '/assets/agriculture-healthy-food.jpg',
    title: 'Wider Reach',
    desc: 'Connect with thousands of buyers across India instantly.'
  },
  {
    icon: '/assets/person-working-coffee-harvest.jpg',
    title: 'Easy Management',
    desc: 'Simple dashboard to manage your products, orders, and inventory.'
  },
  {
    icon: '/assets/woman-gardening-summer-sun.jpg',
    title: 'Secure Payments',
    desc: 'Fast, secure, and reliable payment system for your peace of mind.'
  },
];

export default function BecomeSellerPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  const handleCTA = () => {
    if (!isLoaded) return;
    const role = user?.publicMetadata?.role;
    if (!role) {
      router.push('/');
    } else if (role === 'buyer') {
      router.push('/');
    } else if (role === 'seller') {
      router.push('/seller');
    } else {
      router.push('/');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col items-center">
      {/* Hero Section with background and overlay */}
      <section className="relative w-full min-h-[350px] md:min-h-[420px] flex items-center justify-center overflow-hidden">
        <Image
          src="/assets/agriculture-healthy-food.jpg"
          alt="Field background"
          fill
          className="object-cover object-center z-0 transform translate-x-4"
          priority
        />
        <div className="absolute inset-0 bg-green-900/60 z-10" />
        <motion.div
          className="relative z-20 max-w-2xl mx-auto text-center py-20 px-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow mb-4 font-poppins">Become a Seller on AgroTrade</h1>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of farmers and agricultural businesses who are already selling their products on our platform. Start your journey to reach more customers and grow your business.
          </p>
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCTA}
            className="mt-4 bg-green-600 text-white px-8 py-4 rounded-full shadow-lg hover:bg-green-700 transition text-xl font-bold"
          >
            Start Selling
          </motion.button>
        </motion.div>
      </section>

      {/* Features Section with AOS animation */}
      <section className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 px-4">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-center flex flex-col items-center"
            data-aos="fade-up"
            data-aos-delay={i * 120}
          >
            <div className="w-20 h-20 rounded-xl overflow-hidden mb-3 border-4 border-green-100 shadow">
              <Image src={f.icon} alt={f.title} width={80} height={80} className="object-cover w-full h-full transform translate-x-1" />
            </div>
            <h3 className="text-xl font-semibold text-green-700 font-poppins">{f.title}</h3>
            <p className="text-gray-600 mt-2">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Testimonials Section with Swiper carousel */}
      <section className="bg-green-100 py-10 w-full mt-16">
        <h2 className="text-2xl font-bold text-center text-green-800 mb-6 font-poppins" data-aos="fade-up">What Our Sellers Say</h2>
        <Swiper
          spaceBetween={24}
          slidesPerView={1}
          loop
          autoplay={{ delay: 4000 }}
          breakpoints={{ 768: { slidesPerView: 2 } }}
          className="max-w-4xl mx-auto px-4"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <motion.div
                className="bg-white rounded-xl shadow p-5 flex flex-col items-center mx-2"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
              >
                <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-green-200">
                  <Image src={t.image} alt={t.name} width={64} height={64} className="object-cover w-full h-full transform translate-x-1" />
                </div>
                <p className="text-gray-700 italic">“{t.quote}”</p>
                <div className="mt-4 text-green-800 font-semibold">{t.name}</div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Final CTA Section with animation */}
      <motion.section
        className="bg-green-600 py-12 text-white text-center w-full mt-10 px-4"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h3 className="text-2xl font-semibold font-poppins">Ready to Grow?</h3>
        <p className="mt-2 mb-6 text-lg">Sign up and start selling your crops to a nationwide audience.</p>
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleCTA}
          className="bg-white text-green-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition text-xl shadow-lg"
        >
          Join as Seller
        </motion.button>
      </motion.section>
    </main>
  );
} 