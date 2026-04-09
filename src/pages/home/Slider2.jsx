"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import { useEffect, useRef, useState } from "react";
import Listing from "../api/Listing";
import Link from "next/link";

export default function Slider2() {
  const [data, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ready, setReady] = useState(false);

  const swiperRef = useRef(null);

  // 🔥 Fetch Data
  const fetchData = async () => {
    try {
      const main = new Listing();
      const response = await main.getAllProject();

      if (response?.data?.data) {
        setData(response.data.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.log("Error:", error);
      setData([]);
    } finally {
      setReady(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeIndex >= data.length) {
      setActiveIndex(0);
    }
  }, [data]);

  // 🔴 Loading state
  if (!ready) {
    return (
      <div className="w-full py-16 bg-black text-white text-center">
        Loading projects...
      </div>
    );
  }

  if (!data.length) return null;

  return (
    <div className="relative w-full py-16 overflow-hidden">

      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          backgroundImage: `url(${data[activeIndex]?.Image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-[92%] max-w-[1200px] mx-auto">

     <div className="container mx-auto px-4 max-w-[1430px]">

          {/* Heading */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 md:mb-12">
            <h2 className="text-[#ffffff] font-[900] text-[20px] md:text-[26px] uppercase tracking-tight text-center md:text-left">
              VERIFIED RESULTS, PHOTOGRAPHED AFTER COMPLETION
            </h2>

            <p className="text-[#ffffff] text-sm md:text-base md:max-w-[55%] text-center md:text-left">
              Our work speaks through delivered spaces, not renders. Browse our
              collection of completed residential and commercial interiors built
              exactly as planned.
            </p>
          </div>
        </div>

        <Swiper
          key={data.length}
          modules={[EffectCoverflow, Autoplay]}
          effect="coverflow"
          centeredSlides={true}
          slidesPerView={1.2}
          spaceBetween={20}
          loop={data.length > 2} 
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          breakpoints={{
            640: { slidesPerView: 1.5 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 2.5 },
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 120,
            modifier: 2,
            slideShadows: false,
          }}
          className="pb-10"
        >
          {data.map((item, index) => (
            <SwiperSlide key={index}>
              {({ isActive }) => (
                <Link
                  href={`/project/${item?.slug}`}
                  className={`transition-all duration-500 block ${
                    isActive ? "scale-100" : "scale-90 opacity-70"
                  }`}
                >
                  <div className="bg-white p-3 sm:p-4 rounded-xl shadow-2xl">

                    {/* Image */}
                    <div className="overflow-hidden rounded-md">
                      <img
                        src={item?.Image}
                        alt={item?.title}
                        className="w-full h-[200px] sm:h-[260px] md:h-[300px] object-cover"
                      />
                    </div>

                    {/* Title */}
                    <div className="pt-3 text-center">
                      <p className="text-xs sm:text-sm font-semibold text-gray-800 uppercase">
                        {item?.title}
                      </p>
                    </div>

                  </div>
                </Link>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </div>
  );
}