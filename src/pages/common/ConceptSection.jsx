"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const ConceptSection = ({ title, data }) => {
  if (!data?.length) return null;

  return (
    <>
      <h2 className="text-[#171717] font-[900] text-[18px] md:text-[20px] lg:text-[24px]
        tracking-[-0.02em] uppercase Creato mb-5 mt-5">
        {title}
      </h2>

      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        autoplay={{
          delay: 1000,
          disableOnInteraction: false,
        }}
        loop={true}
        breakpoints={{
          0: {
            slidesPerView: 1, // mobile
          },
          640: {
            slidesPerView: 2, // tablet
          },
          1024: {
            slidesPerView: 3, // desktop
          },
        }}
      >
        {data && data?.map((p) => (
          <SwiperSlide key={p._id} className="w-full">
            <Link
              href={`/design/details/${p.slug}`}
              className="overflow-hidden group block w-full"
            >
              <div className="relative w-full h-[300px] md:h-[400px] lg:h-[420px] bg-gray-100 overflow-hidden rounded-lg">

                {/* Default image */}
                <img
                  src={p.Image || ProductListBanner?.src}
                  alt={p?.title}
                  className="absolute inset-0 !w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                />

                {/* Hover image */}
                <img
                  src={
                    Array.isArray(p?.multiple_images) && p.multiple_images.length > 0
                      ? p.multiple_images[0]
                      : p?.Image || ProductListBanner?.src
                  }
                  alt={p?.title}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                />
              </div>

              <div className="pt-3">
                <h3 className="text-[14px] uppercase text-[#262A33] mb-2 font-medium tracking-[0.05em]">
                  {p.title}
                </h3>

                <p className="text-[#4D5466] font-[500] text-sm md:text-base leading-relaxed md:line-clamp-2">
                  {p.content}
                </p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default ConceptSection;