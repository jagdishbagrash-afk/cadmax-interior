import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Button from "../common/Button";
import Slider1 from "../../Assets/Images/Slider1.png";

export default function Slider() {
  console.log("slider1", Slider1);

  const slides = [
    {
      front: Slider1?.src,
    },
    {
      front: Slider1?.src,
    },
    {
      front: Slider1?.src,
    },
    {
      front: Slider1?.src,
    },
  ];

  return (
    <div className="relative h-[425px] md:h-[560px] lg:h-[860px] md:mt-[-150px]">
      <Swiper
        slidesPerView={1}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop={true}
        breakpoints={{
          300: { slidesPerView: 1 },
          480: { slidesPerView: 1 },
          768: { slidesPerView: 1 },
          1024: { slidesPerView: 1 },
        }}
        modules={[Autoplay]}
        className="w-full h-full"
      >
        {slides?.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <img
                src={slide.front}
                alt="Slide"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/50"></div>

              {/* Overlay content centered */}
              <div className="absolute inset-0 flex flex-col items-center justify-center w-full m-auto px-[15px] text-center">
                <h1
                  className="
                      font-[900]
                      text-[18px] 
                      lg:text-[20px]
                      text-white 
                      uppercase 
                      Creato
                      leading-[100%]
                      tracking-[-0.02em]
                      max-w-[650px]
                    "
                >
                  Elevate Every Room with Built-to-Last Furniture and
                  End-to-End Interior Design
                </h1>

                <div className="flex flex-wrap justify-center gap-[10px] md:gap-[15px] mt-[10px] md:mt-[20px]">
                  <Button
                    title={"Shop product"}
                    classes={"bg-white text-[#171717] "}
                  />
                  <Button
                    title={"Request concept"}
                    classes={"bg-transparent text-white border border-white"}
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}