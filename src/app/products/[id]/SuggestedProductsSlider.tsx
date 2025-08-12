"use client";
import ProductCard from '../../components/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Add custom styles for the swiper
const swiperStyles = `
  .suggested-products-swiper {
    width: 100%;
    height: 100%;
  }
  .suggested-products-swiper .swiper-slide {
    width: 240px !important;
    margin-right: 16px;
  }
  .suggested-products-swiper .swiper-button-next,
  .suggested-products-swiper .swiper-button-prev {
    color: #16a34a;
    background: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  .suggested-products-swiper .swiper-button-next:after,
  .suggested-products-swiper .swiper-button-prev:after {
    font-size: 16px;
  }
`;

interface Product {
  _id: string;
  title: string;
  image: string;
  price: number;
  seller?: { name: string; email: string; role: string };
}

export default function SuggestedProductsSlider({ suggested }: { suggested: Product[] }) {
  if (!suggested || suggested.length === 0) {
    return (
      <div className="w-full max-w-6xl mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-green-800">You Might Like This Product</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p>No similar products found at the moment.</p>
          <p className="text-sm mt-2">Check back later for more products in this category!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mt-8">
      <style dangerouslySetInnerHTML={{ __html: swiperStyles }} />
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-green-800">You Might Like This Product</h2>
      </div>
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView="auto"
        navigation={true}
        spaceBetween={16}
        className="suggested-products-swiper"
      >
        {suggested.map((prod: Product) => (
          <SwiperSlide key={prod._id} style={{ width: 240, flexShrink: 0 }}>
            <ProductCard {...prod} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}