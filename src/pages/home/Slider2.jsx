"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
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

  return (
    <div className="w-full bg-white py-6 md:py-12">
      <div className="container mx-auto px-4 max-w-[1430px]">

        {/* Heading */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 md:mb-12">
          <h2 className="text-[#171717] font-[900] text-[20px] md:text-[26px] uppercase tracking-tight text-center md:text-left">
            VERIFIED RESULTS, PHOTOGRAPHED AFTER COMPLETION
          </h2>

          <p className="text-[#4D5466] text-sm md:text-base md:max-w-[55%] text-center md:text-left">
            Our work speaks through delivered spaces, not renders. Browse our
            collection of completed residential and commercial interiors built
            exactly as planned.
          </p>
        </div>
      </div>

      {/* Slider Section */}
      <div className="container mx-auto px-4 max-w-[1430px]">

        <div className="w-full flex justify-center relative overflow-hidden">
          <div className="w-[95%] md:w-[88%] relative">

            {/* Buttons */}
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="absolute left-0 md:-left-6 cursor-pointer  top-1/2 -translate-y-1/2 z-50 bg-white shadow-lg p-3 rounded-full"
            >
              <FaArrowLeft />
            </button>

            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="absolute cursor-pointer right-0 md:-right-6 top-1/2 -translate-y-1/2 z-50 bg-white shadow-lg p-3 rounded-full"
            >
              <FaArrowRight />
            </button>

            <Swiper
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              loop={true}
              centeredSlides={true}
              slidesPerView="auto"
              spaceBetween={30}
            >
              {data && data?.map((item, i) => (
                <SwiperSlide key={i} className="!w-auto flex justify-center">
                  {({ isActive }) => (
                    <div
                      className={`
                        transition-all duration-500 rounded-xl overflow-hidden ${isActive
                          ? "w-full md:w-[700px]"
                          : "w-full md:w-[300px] "
                        }`}
                    >
                      <img
                        src={item?.Image}
                        alt=""
                        className={`w-full object-cover ${isActive
                          ? "h-[260px] sm:h-[360px] md:h-[520px]"
                          : "h-[240px] sm:h-[340px] md:h-[500px] bg-white/80"
                          }`}
                      />
                      {!isActive && (
                        <div className="absolute inset-0 bg-white/50"></div>
                      )}
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}