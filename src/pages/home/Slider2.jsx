"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Result from "../../Assets/Images/Result.png";
import ligithing from "../../Assets/Images/ligithing.jpg";


const images = [Result?.src, ligithing?.src, Result?.src];

export default function Slider2() {
  return (
    <>
      <div className="w-full bg-white py-4 md:py-8 ">
        <div className="container mx-auto px-4 max-w-[1430px]">

          <div className="max-w-9xl mx-auto mb-10 md:mb-16 flex flex-col md:flex-row items-center justify-between gap-5">
            <h2 className="text-[#171717] font-[900] text-[24px] tracking-[-0.02em] uppercase Creato text-center">
              VERIFIED RESULTS, PHOTOGRAPHED AFTER COMPLETION
            </h2>

            <p className="text-[#4D5466] font-[500] text-sm md:text-base leading-relaxed md:max-w-[55%] text-center md:text-left">
              Our work speaks through delivered spaces, not renders. Browse our
              collection of completed residential and commercial interiors built
              exactly as planned.
            </p>
          </div>


       
        </div>
           <div className="w-full bg-white py-4 px-4  flex justify-center">
            <div className="relative w-[94%] md:w-[88%] overflow-visible">
              {/* Custom arrow buttons */}
              <div className="swiper-button-prev custom-nav-btn left-6"></div>
              <div className="swiper-button-next custom-nav-btn right-6"></div>

              <Swiper
                modules={[Navigation]}
                navigation
                loop
                slidesPerView={1.3}
                centeredSlides={true}
                spaceBetween={-150}
                className="overflow-visible"
              >
                {images?.map((src, i) => (
                  <SwiperSlide key={i}>
                    {({ isActive }) => (
                      <div
                        className={`transition-all duration-500 rounded-xl overflow-hidden ${isActive
                          ? "scale-[1.08] shadow-2xl -mt-8 z-30"
                          : "scale-[0.92] opacity-90 z-10"
                          }`}
                      >
                        <img src={src} className="w-full h-[450px] object-cover" />
                      </div>
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>

            </div>
          </div>
      </div>

    </>
  );
}
