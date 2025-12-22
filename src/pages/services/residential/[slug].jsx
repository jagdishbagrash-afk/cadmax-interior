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

export default function Index() {
  const router = useRouter();
  const id = router?.query?.slug;

  const [categories, setCategories] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [project, setProject] = useState([]);

  // Fetch categories
  const fetchData = async (id) => {
    try {
      const main = new Listing();
      const response = await main.ServciesType(id);

      if (response.data?.data) {
        const list = response.data.data?.Residentialservices || [];
        setCategories(list);

        if (list.length > 0) {
          const matched = list.find(
            (item) => item._id === id || item.slug === id
          );

          if (matched) {
            setSelectedId(matched._id);
          } else {
            setSelectedId(list[0]._id);
          }
        }
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    if (id) fetchData(id);
  }, [id]);

  // Fetch Project Based on Selected
  const fetchProjectData = async () => {
    if (!selectedId) return;

    try {
      const main = new Listing();
      const response = await main.GetAllServicesType(selectedId);
      const data = response?.data?.data;

      if (data) setProject(data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [selectedId]);

  return (
    <Layout>
      {/* Swiper Category Slider */}
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
                onClick={() => {
                  setSelectedId(item._id);

                  // 🔥 URL SLUG CHANGE HERE
                  router.push(
                    `/services/residential/${item?.slug}`,
                    undefined,
                    { shallow: true }
                  );
                }}
                className="relative h-[120px] md:h-[140px] lg:h-[150px] rounded-md overflow-hidden cursor-pointer transition-all duration-300"
              >
                <img
                  src={item.Image || ProductListBanner?.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                <div
                  className={`absolute inset-0 transition-all duration-300
                    ${
                      selectedId === item._id
                        ? "bg-black/20"
                        : "bg-black/55 hover:bg-black/30"
                    }`}
                />

                <div className="absolute inset-0 flex items-center justify-center px-2">
                  <h1
                    className={`text-white text-[11px] md:text-[12px] lg:text-[13px]
                    font-bold uppercase tracking-wide leading-tight text-center
                    ${
                      selectedId === item._id
                        ? "text-yellow-300 scale-105"
                        : "text-gray-200"
                    }`}
                  >
                    {item.title}
                  </h1>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Services Grid */}
      <section className="py-4 md:py-8">
        <div className="container mx-auto px-4 max-w-[1430px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {project?.map((p, idx) => (
              <article key={p.id ?? idx} className="overflow-hidden">
                <div className="relative w-full h-[400px] md:h-[480px] overflow-hidden bg-gray-100">
                  <img
                    src={p.Image}
                    alt={p.title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="pt-2">
                  <h3 className="text-[14px] uppercase text-[#262A33] mb-2 font-medium tracking-[0.05em]">
                    {p.title}
                  </h3>

                  <p className="text-[16px] font-extrabold text-[#171717]">
                    {p.content}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
