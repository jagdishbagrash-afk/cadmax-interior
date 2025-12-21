"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/pages/common/Layout";
import ProductGrid from "./ProductGrid";
import { useRouter } from "next/router";
import ProductListBanner from "../../../Assets/Images/ProductListBanner.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import Listing from "@/pages/api/Listing";

export default function Index() {
  const router = useRouter();
  const id = router?.query?.slug;
  const [categories, setCategories] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const fetchData = async (id) => {
    try {
      const main = new Listing();
      const response = await main.SubcategoryList(id);
      if (response.data?.data) {
        const list = response.data.data;
        setCategories(list);
        if (list.length > 0) {
          setSelectedId(list[0]._id);
        }
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    if (id) fetchData(id);
  }, [id]);
  
  return (
    <Layout>
      <div className="w-full bg-black py-3">
        <Swiper
          spaceBetween={14}
          loop={true}
          speed={1000}
          autoplay={{ delay: 1800, disableOnInteraction: false }}
          modules={[Autoplay]}
          grabCursor={true}
          breakpoints={{
            320: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
          }}
        >
          {categories?.map((item) => (
            <SwiperSlide key={item._id}>
              <div
                onClick={() => setSelectedId(item._id)}
                className={`
            relative h-[120px] md:h-[140px] lg:h-[150px]
            rounded-md overflow-hidden cursor-pointer
            transition-all duration-300
          `}
              >

                {/* Image */}
                <img
                  src={item.Image || ProductListBanner?.src}
                  alt={item.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {/* Overlay */}
                <div
                  className={`absolute inset-0 transition-all duration-300
              ${selectedId === item._id
                      ? "bg-black/20"
                      : "bg-black/55 hover:bg-black/30"
                    }
            `}
                ></div>

                {/* Text */}
                <div className="absolute inset-0 flex items-center justify-center px-2">
                  <h1
                    className={`text-white text-[11px] md:text-[12px] lg:text-[13px]
              font-bold uppercase tracking-wide leading-tight text-center
              ${selectedId === item._id
                        ? "text-yellow-300 scale-105"
                        : "text-gray-200"
                      }
            `}
                  >
                    {item.name}
                  </h1>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <ProductGrid selectedId={selectedId} />

    </Layout>
  );
}
