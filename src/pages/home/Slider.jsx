import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import Button from "../common/Button";
import Listing from "../api/Listing";

export default function Slider() {
  const [banner, setBanner] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch Data
  const fetchDatas = async () => {
    try {
      const main = new Listing();
      const response = await main.GetHomeList();

      if (response?.data?.data) {
        setBanner(response.data.data);
      } else {
        setBanner([]);
      }
    } catch (error) {
      console.log("Error:", error);
      setBanner([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatas();
  }, []);

  // 🔴 Loading State
  if (loading) {
    return (
      <div className="w-full h-[425px] md:h-[560px] lg:h-[860px] bg-gray-200 animate-pulse flex items-center justify-center">
        <p className="text-gray-500">Loading slider...</p>
      </div>
    );
  }

  // 🔴 No Data
  if (!banner.length) {
    return null;
  }

  return (
    <div className="relative h-[425px] md:h-[560px] lg:h-[860px] md:mt-[-150px]">
      <Swiper
        key={banner.length} // 🔥 force re-init
        slidesPerView={1}
        loop={banner.length > 1}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        modules={[Autoplay]}
        className="w-full h-full"
      >
        {banner.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">

              {/* Image */}
              <img
                src={slide?.Image}
                alt={`Slide ${index}`}
                className="object-cover w-full h-full"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50"></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                
                <h1 className="text-white font-extrabold text-[18px] md:text-[28px] lg:text-[42px] uppercase leading-tight max-w-[800px]">
                  {slide?.title || "Elevate Every Room with Premium Interiors"}
                </h1>

                <p className="text-white mt-3 md:mt-4 text-sm md:text-base max-w-[600px]">
                  {slide?.description ||
                    "Built-to-last furniture and complete interior solutions tailored for your lifestyle."}
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap justify-center gap-3 mt-5">
                  <Button
                    title="Shop Product"
                    classes="bg-white text-black px-5 py-2 rounded-md"
                  />
                  <Button
                    title="Request Concept"
                    classes="border border-white text-white px-5 py-2 rounded-md"
                  />
                </div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}