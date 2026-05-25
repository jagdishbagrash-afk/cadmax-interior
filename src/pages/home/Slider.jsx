import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import Button from "../common/Button";
import Listing from "../api/Listing";

export default function Slider() {
  const [banner, setBanner] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data
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

  // Loading State
  if (loading) {
    return (
      <div className="w-full h-[320px] sm:h-[400px] md:h-[560px] lg:h-[860px] bg-gray-200 animate-pulse flex items-center justify-center">
        <p className="text-gray-500">Loading slider...</p>
      </div>
    );
  }

  // No Data
  if (!banner.length) {
    return null;
  }

  return (
    <div className="relative h-[320px] sm:h-[400px] md:h-[560px] lg:h-[860px] md:mt-[-150px] overflow-hidden">
      <Swiper
        key={banner.length}
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
                className="
                  w-full h-full
                  object-contain sm:object-cover
                  object-center
                  bg-black
                "
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40"></div>

              {/* Optional Content */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-center text-white px-4">
                  {slide?.title && (
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4">
                      {slide.title}
                    </h2>
                  )}

                  {slide?.description && (
                    <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-6">
                      {slide.description}
                    </p>
                  )}

                  {slide?.buttonText && (
                    <Button>
                      {slide.buttonText}
                    </Button>
                  )}
                </div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}