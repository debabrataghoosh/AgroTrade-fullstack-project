"use client";
import ProductCard from '../../components/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function SuggestedProductsSlider({ suggested }: { suggested: any[] }) {
  return (
    <div className="w-full max-w-6xl mt-8">
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
        {suggested.map((prod: any) => (
          <SwiperSlide key={prod._id} style={{ width: 240, flexShrink: 0 }}>
            <ProductCard {...prod} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
} 