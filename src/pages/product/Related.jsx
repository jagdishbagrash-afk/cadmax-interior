import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import ProductCard from "../common/ProductCard";
import Listing from "../api/Listing";

export default function Related({ selectedId }) {
  const [Project, setProject] = useState([]);

  const fetchProjectData = async () => {
    try {
      const main = new Listing();
      const response = await main.getAllProductSubCategroy(selectedId);

      if (response?.data?.status) {
        setProject(response?.data?.data?.data);
      } else {
        setProject([]);
      }
    } catch (error) {
      console.log("Error:", error);
      setProject([]);
    }
  };

  useEffect(() => {
    if (selectedId) {
      fetchProjectData();
    }
  }, [selectedId]);

  return (
    <div className="mt-8 py-8">
      {/* Heading */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h2 className="text-[#171717] text-2xl font-black Creato uppercase">
          Related Items
        </h2>

        <p className="text-base lg:text-lg text-[#4D5466] font-medium max-w-2xl Creato">
          Similar items in the furniture side of the items, these following
          items also has wide range of categories
        </p>
      </div>

      {/* Swiper */}
      <div className="mt-6">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
        >
          {Project &&
            Project?.map((item, index) => (
              <SwiperSlide key={index}>
                <ProductCard item={item} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
}