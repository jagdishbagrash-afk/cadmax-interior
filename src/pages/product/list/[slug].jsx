"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/pages/common/Layout";
import { useRouter } from "next/router";
import ProductListBanner from "../../../Assets/Images/ProductListBanner.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import Listing from "@/pages/api/Listing";
import ProductGrid from "./ProductGrid";

export default function Index() {
  const router = useRouter();
  const { slug } = router.query;

  const [categories, setCategories] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async (categorySlug) => {
    try {
      setLoading(true);

      const main = new Listing();
      const response = await main.SubcategoryList(categorySlug);

      const list = response?.data?.data || [];
      setCategories(list);
      if (list.length > 0) {
        setSelectedId(list[0]._id);
      } else {
        setSelectedId("");
      }
    } catch (error) {
      console.log("Error:", error);
      setCategories([]);
      setSelectedId("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    if (!slug) return;

    fetchData(slug);
  }, [router.isReady, slug]);

  return (
    <Layout>
      {/* CATEGORY SLIDER */}
      {categories.length > 0 && (
        <div className="w-full bg-black py-3">
          <Swiper
            spaceBetween={14}
            loop={categories.length > 3}
            speed={1000}
            autoplay={{
              delay: 1800,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
            grabCursor={true}
            breakpoints={{
              320: { slidesPerView: 2 },
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
            }}
          >
            {categories.map((item) => (
              <SwiperSlide key={item._id}>
                <div
                  onClick={() => setSelectedId(item._id)}
                  className="
                    relative h-[120px]
                    md:h-[140px]
                    lg:h-[150px]
                    rounded-md
                    overflow-hidden
                    cursor-pointer
                    transition-all
                    duration-300
                  "
                >
                  <img
                    src={
                      item?.Image ||
                      ProductListBanner?.src
                    }
                    alt={item?.name}
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />

                  <div
                    className={`absolute inset-0 transition-all duration-300
                      ${
                        selectedId === item._id
                          ? "bg-black/20"
                          : "bg-black/55 hover:bg-black/30"
                      }
                    `}
                  />

                  <div className="absolute inset-0 flex items-center justify-center px-2">
                    <h1
                      className={`text-[11px] md:text-[12px] lg:text-[13px]
                        font-bold uppercase tracking-wide leading-tight text-center
                        ${
                          selectedId === item._id
                            ? "text-yellow-300 scale-105"
                            : "text-white"
                        }
                      `}
                    >
                      {item?.name}
                    </h1>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* PRODUCTS */}
      {loading ? (
        <div className="py-20 text-center">
          Loading Products...
        </div>
      ) : selectedId ? (
        <ProductGrid selectedId={selectedId} />
      ) : (
        <div className="py-20 text-center">
          No Products Found
        </div>
      )}
    </Layout>
    
  );
}