"use client";

import Image from "next/image";
import Link from "next/link";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

export default function CommercialDesign({ Commercialservices }) {
  return (
    <div className="bg-[#F6F6F6] py-4 md:py-8">
      <div className="container mx-auto px-4 max-w-[1430px]">

        {/* Heading */}
        <div className="max-w-5xl mx-auto mb-10 md:mb-16 flex flex-col items-center justify-between">
          <h2 className="text-[#171717] font-[900] text-[18px] md:text-[20px] lg:text-[24px] text-center uppercase Creato">
            Commercial Spaces Engineered for Flow, Brand Presence & Performance
          </h2>
        </div>

        {/* 🔥 Swiper */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false, // swipe ke baad bhi autoplay chalu rahega
          }}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
        >
          {Commercialservices?.map((item, index) => (
            <SwiperSlide key={index}>
              <Link href={`/design/commercial/${item?.slug}`} className="block">
                <div className="relative h-[300px] overflow-hidden uppercase group rounded-xl">
                  <Image
                    src={item?.Image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/45 flex items-center justify-center text-center p-4">
                    <h3 className="text-white text-[16px] lg:text-[18px]">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </div>
  );
}