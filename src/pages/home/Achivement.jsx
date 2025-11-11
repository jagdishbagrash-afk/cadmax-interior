import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules"; // Import Navigation for Swiper arrows
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation"; // Import Swiper navigation CSS

const Achivement = () => {
  const cities = [
    { img: "https://cadmaxpro-buket.s3.ap-south-1.amazonaws.com/assets/about/image18.png" },
    { img: "https://cadmaxpro-buket.s3.ap-south-1.amazonaws.com/assets/about/image19.png" },
    { img: "https://cadmaxpro-buket.s3.ap-south-1.amazonaws.com/assets/about/image17.png" },
    { img: "https://cadmaxpro-buket.s3.ap-south-1.amazonaws.com/assets/about/image18.png" },
    { img: "https://cadmaxpro-buket.s3.ap-south-1.amazonaws.com/assets/about/image19.png" },
    { img: "https://cadmaxpro-buket.s3.ap-south-1.amazonaws.com/assets/about/image17.png" },
  ];



  return (
    <div className="py-12 md:py-20 px-4 md:px-8 lg:px-16 bg-white overflow-hidden">
      {/* Title and Description Section */}
      <div className="max-w-6xl mx-auto mb-10 md:mb-16 flex flex-col md:flex-row items-start md:items-end justify-between">
        <h2 className="text-xl md:text-3xl lg:text-4xl font-bold uppercase text-gray-900 mb-4 md:mb-0 md:w-1/3">
          VERIFIED RESULTS, PHOTOGRAPHED AFTER COMPLETION
        </h2>
        <p className="text-gray-700 text-sm md:text-base leading-relaxed md:w-2/3 md:pl-8">
          Our work speaks through delivered spaces, not renders. Browse our
          collection of completed residential and commercial interiors built
          exactly as planned.
        </p>
      </div>

      <div className="relative">
          <Swiper
            spaceBetween={20}
            slidesPerView={3}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            loop={true}
            navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }}
            modules={[Autoplay, Navigation]}
            className="w-full"
          >
            {cities &&
              cities?.map((city, idx) => (
                <SwiperSlide key={idx}>
                  <div className="flex justify-center">
                    <img
                      src={city.img}
                      alt={`Achievement ${idx + 1}`}
                      className="w-full h-[430px] md:h-[480px] xl:h-[520px] object-cover rounded-xl shadow-lg"
                    />
                  </div>
                </SwiperSlide>
              ))}
            {/* Swiper Navigation Arrows (for mobile if desired, positioned relative to Swiper) */}
            <div className="swiper-button-prev !left-4 !w-12 !h-12 !bg-black !rounded-full after:!text-white after:!text-2xl"></div>
            <div className="swiper-button-next !right-4 !w-12 !h-12 !bg-black !rounded-full after:!text-white after:!text-2xl"></div>
          </Swiper>
      </div>
    </div>
  );
};

export default Achivement;