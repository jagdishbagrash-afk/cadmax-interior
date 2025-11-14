"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Result from "../../Assets/Images/Result.png";

const images = [Result?.src, Result?.src, Result?.src];

export default function Slider2() {
  return (
    <>
      <div className="w-full bg-white py-4 md:py-8 mt-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start">
            {/* Left Title */}
            <h2 className="text-[18px] md:text-[24px] Creato font-black text-[#171717] leading-snug">
              VERIFIED RESULTS, PHOTOGRAPHED AFTER COMPLETION
            </h2>

            {/* Right Description */}
            <p className="text-[14px] md:text-[18px] Creato text-[#4D5466] font-medium leading-relaxed max-w-[600px]">
              Our work speaks through delivered spaces, not renders. Browse our
              collection of completed residential and commercial interiors built
              exactly as planned.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full bg-white py-10 flex justify-center">
        <div className="relative w-[94%] md:w-[88%] overflow-visible">
          {/* Custom arrow buttons */}
          <div className="swiper-button-prev custom-nav-btn left-6"></div>
          <div className="swiper-button-next custom-nav-btn right-6"></div>

          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            slidesPerView={1.3}
            centeredSlides={true}
            spaceBetween={-150} /* Creates the exact overlap */
            loop={true}
            className="overflow-visible"
          >
            {images && images?.map((src, i) => (
              <SwiperSlide key={i}>
                {({ isActive }) => (
                  <div
                    className={`transition-all duration-500 rounded-xl overflow-hidden
                  ${
                    isActive
                      ? "scale-[1.08] shadow-2xl -mt-8 z-30"
                      : "scale-[0.92] opacity-90 z-10"
                  }`}
                  >
                    <img
                      src={src}
                      className="w-full h-[450px] object-cover"
                      alt=""
                    />
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
}
