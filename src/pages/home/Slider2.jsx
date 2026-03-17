"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import Listing from "../api/Listing";

export default function Slider2() {
  const [data, setData] = useState([]);
  const swiperRef = useRef(null);

  const fetchData = async () => {
    try {
      const main = new Listing();
      const response = await main.CommonProject();

      if (response.data?.data) {
        setData(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNext = () => swiperRef.current?.slideNext();
  const handlePrev = () => swiperRef.current?.slidePrev();

  return (
    <div className="w-full bg-white py-10">

      <div className="relative w-[92%] mx-auto">

        {/* LEFT ARROW */}
        <button
          onClick={handlePrev}
          className="
          absolute 
          left-[-10px] md:left-[-20px] lg:left-[-30px]
          top-1/2 -translate-y-1/2 
          z-50 
          bg-black text-white shadow-lg 
          w-8 h-8 md:w-10 md:h-10 
          flex items-center justify-center rounded-full
          "
        >
          <FaArrowLeft />
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={handleNext}
          className="
          absolute 
          right-[-10px] md:right-[-20px] lg:right-[-30px]
          top-1/2 -translate-y-1/2 
          z-50 
          bg-black text-white shadow-lg 
          w-8 h-8 md:w-10 md:h-10 
          flex items-center justify-center rounded-full
          "
        >
          <FaArrowRight />
        </button>

        {/* SWIPER */}
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          loop={true}
          centeredSlides={true}
          slidesPerView={1.2}
          spaceBetween={10}
          breakpoints={{
            640: {
              slidesPerView: 1.3,
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 1.5,
              spaceBetween: 0,
            },
          }}
          className="overflow-visible"
        >

          {data?.map((item, i) => (
            <SwiperSlide key={i}>

              {({ isActive }) => (

                <div
                  className={`relative transition-all duration-500  overflow-hidden h-[420px] md:h-[500px]
                  ${isActive
                      ? "scale-[1.05] md:scale-[1.1] z-[100] "
                      : "scale-[0.9] z-10 "
                    }`}
                >

                  {/* IMAGE */}
                  <img
                    src={item?.Image}
                    alt="project"
                    className="w-full h-full object-cover"
                  />

                  {/* WHITE OVERLAY */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-white/60"></div>
                  )}

                </div>

              )}

            </SwiperSlide>
          ))}

        </Swiper>

      </div>

    </div>
  );
}