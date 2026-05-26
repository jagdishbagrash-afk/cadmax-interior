import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import Button from "../common/Button";
import Listing from "../api/Listing";

export default function Slider() {
  const [banner, setBanner] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="w-full h-[220px] sm:h-[400px] lg:h-screen bg-gray-200 animate-pulse flex items-center justify-center">
        <p className="text-gray-500">Loading slider...</p>
      </div>
    );
  }

  // No Data
  if (!banner.length) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden md:mt-[-120px]">
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
        className="w-full"
      >
        {banner.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="
                relative
                w-full
                h-[220px]
                sm:h-[350px]
                md:h-[500px]
                lg:h-screen
                overflow-hidden
              "
            >
              {/* Image */}
              <img
                src={slide?.Image}
                alt={`Slide ${index}`}
                className="
                  w-full
                  h-full
                  object-cover
                  object-center
                "
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 md:bg-black/40"></div>

              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
                <div className="text-center text-white max-w-4xl">
                  
                  {slide?.title && (
                    <h2
                      className="
                        text-xl
                        sm:text-3xl
                        md:text-5xl
                        lg:text-6xl
                        font-bold
                        mb-3
                        md:mb-5
                        leading-tight
                      "
                    >
                      {slide.title}
                    </h2>
                  )}

                  {slide?.description && (
                    <p
                      className="
                        text-xs
                        sm:text-sm
                        md:text-lg
                        lg:text-xl
                        max-w-2xl
                        mx-auto
                        mb-4
                        md:mb-6
                        leading-relaxed
                      "
                    >
                      {slide.description}
                    </p>
                  )}

                  {slide?.buttonText && (
                    <div className="flex justify-center">
                      <Button>
                        {slide.buttonText}
                      </Button>
                    </div>
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