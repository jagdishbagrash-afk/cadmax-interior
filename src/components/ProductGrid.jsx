"use client";

import React from "react";
import ProductCard from "@/pages/common/ProductCard";
import Link from "next/link";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function ProductGrid({
  products = [],
  title = "OUR BEST SELLER",
  link = "/best-seller",
}) {
  const productList = Array.isArray(products)
    ? products.slice(0, 8)
    : [];


  return (
    <section className="bg-[#ffffff] py-4 md:py-8">
      <div className="container mx-auto px-4 max-w-[1430px]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3 md:mb-6">
          <h2 className="text-[#171717] font-[900] text-[18px] md:text-[24px] uppercase Creato">
            {title}
          </h2>

          <Link
            href={link}
            className="px-4 py-[6px] md:px-[30px] md:py-[10px] text-[13px] font-[700] uppercase Creato border border-[#17171733]"
          >
            View All
          </Link>
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Autoplay]}
          loop={productList.length > 8} // important fix
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          speed={800}
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
        >
          {productList.map((item, idx) => {
            const product = item?.product ?? item;
            return (
              <SwiperSlide key={product?._id || idx}>
                <div className="h-full">
                  <ProductCard item={product} />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}