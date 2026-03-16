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

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  return (
    <div className="w-full bg-white py-10">

      <div className="relative w-[92%] mx-auto overflow-visible">

        {/* Buttons */}

<button
  onClick={handlePrev}
  className="absolute left-40 cursor-pointer top-1/2 translate-y-1/2 z-50 bg-black text-white  shadow-lg w-10 h-10 flex items-center justify-center rounded-full"
>
  <FaArrowLeft />
</button>

<button
  onClick={handleNext}
  className="absolute cursor-pointer right-40 top-1/2 translate-y-1/2 z-50 bg-black text-white  shadow-lg w-10 h-10 flex items-center justify-center rounded-full"
>
  <FaArrowRight />
</button>
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          loop={true}
          slidesPerView={1.5}
          spaceBetween={-0}
          centeredSlides={true}
          className="overflow-visible"
        >

          {data?.map((item, i) => (
            <SwiperSlide key={i}>
              {({ isActive }) => (
            <div
  className={`relative transition-all duration-500 overflow-hidden 
  ${isActive
    ? "scale-[1.1] z-40 h-[500px]"
    : "scale-[0.90] z-10  h-[480px]"
  }`}
>

  <img
    src={item?.Image}
    alt="project"
    className="w-full h-full object-cover"
  />

  {/* White Overlay for inactive images */}
  {!isActive && (
    <div className="absolute inset-0 bg-white/80"></div>
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