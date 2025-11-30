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
      console.log("selectedId:", selectedId);

  
  return (
    <Layout>
      <div className="w-full overflow-hidden bg-black">
        <Swiper
          spaceBetween={20}
          loop={true}
          speed={1200}
          autoplay={{ delay: 1000, disableOnInteraction: false }}
          modules={[Autoplay]}
          grabCursor={true}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {categories.map((item) => (
            <SwiperSlide key={item._id}>
              <div
                onClick={() => setSelectedId(item._id)} 
                className={`relative h-[280px] md:h-[320px] lg:h-[500px] cursor-pointer overflow-hidden
                  ${selectedId === item._id ? "ring-1 ring-blue-600" : ""}
                `}
              >
                <img
                  src={item.Image || ProductListBanner?.src}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/40"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                  <h1 className="text-white text-[18px] md:text-[20px] font-[900] uppercase leading-[110%] tracking-[-0.02em] Creato max-w-[300px]">
                    {item.name}
                  </h1>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <ProductGrid categoryId={selectedId} id={id} />

    </Layout>
  );
}
