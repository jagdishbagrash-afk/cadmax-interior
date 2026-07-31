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
import Link from "next/link";
import ConceptSection from "@/pages/common/ConceptSection";
import NoData from "@/pages/common/NoData";
/* ---------------- Reusable Section ---------------- */
// const ConceptSection = ({ title, data }) => {
//   if (!data?.length) return null;

//   return (
//     <>
//       <h2 className="text-[#171717] font-[900] text-[18px] md:text-[20px] lg:text-[24px]
//         tracking-[-0.02em] uppercase Creato mb-5 mt-5">
//         {title}
//       </h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {data && data?.map((p) => (
//           <Link
//             key={p._id}
//             href={`/design/details/${p.slug}`}
//             className="overflow-hidden group"
//           >
//             <div className="relative w-full h-[400px] md:h-[480px] bg-gray-100 overflow-hidden">

//               <img
//                 src={p.Image || ProductListBanner?.src}
//                 alt={p?.title}
//                 className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
//               />

//               {/* Hover image */}
//               <img
//                 src={
//                   Array.isArray(p?.multiple_images) && p.multiple_images.length > 0
//                     ? p.multiple_images[0]
//                     : p?.Image || ProductListBanner?.src
//                 }


//                 alt={p?.title}
//                 className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
//               />
//             </div>

//             <div className="pt-2">
//               <h3 className="text-[14px] uppercase text-[#262A33] mb-2 font-medium tracking-[0.05em]">
//                 {p.title}
//               </h3>

//               <p className="text-[#4D5466] font-[500] text-sm md:text-base leading-relaxed
//                 line-clamp-3">
//                 {p.content}
//               </p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </>
//   );
// };

/* ---------------- Main Page ---------------- */
export default function Index() {
  const router = useRouter();
  const slug = router?.query?.slug;

  const [categories, setCategories] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [seoData, setSeoData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [classic, setClassic] = useState([]);
  const [modern, setModern] = useState([]);
  const [common, setCommon] = useState([]);

  const [contemporary, setContemporary] = useState([]);

  /* -------- Fetch Categories -------- */
  const fetchCategories = async (slug) => {
    try {
      const main = new Listing();
      const res = await main.ServciesType(slug);
      const list = res?.data?.data?.residentialServices || [];
      setCategories(list);

      if (list.length) {
        const match = list.find(
          (i) => i._id === slug || i.slug === slug
        );
        setSelectedId(match?._id || list[0]._id);
       if (list.length) {
  const match = list.find(
    (item) => item.slug === slug || item._id === slug
  ) || list[0];

  setSelectedId(match._id);
  setSelectedCategory(match);
}
      }
    } catch (err) {
      console.log("Category Error:", err);
    }
  };

  useEffect(() => {
    if (slug) fetchCategories(slug);
  }, [slug]);

  /* -------- Fetch Projects -------- */
  const fetchProjects = async () => {
    if (!selectedId) return;

    try {
      const main = new Listing();
      const res = await main.GetAllServicesType(selectedId);
      const data = res?.data?.data || [];
      setCommon(data.filter(i => i.concept === "common"));
      setClassic(data.filter(i => i.concept === "neo_classic"));
      setModern(data.filter(i => i.concept === "modern"));
      setContemporary(data.filter(i => i.concept === "contemporary"));
    } catch (err) {
      console.log("Project Error:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedId]);

  return (
  <Layout
  seo={{
    title:
      selectedCategory?.meta_title ||
      `${selectedCategory?.title} | CADMAX Atelier`,

    description:
      selectedCategory?.meta_description ||
      `Explore ${selectedCategory?.title} at CADMAX Atelier.`,

    keywords: selectedCategory?.meta_keywords || "",

    canonical: `https://cadmaxatelier.com/design/residential/${selectedCategory?.slug}`,

    url: `https://cadmaxatelier.com/design/residential/${selectedCategory?.slug}`,
  }}
>
      {/* -------- Category Slider -------- */}
      <div className="w-full bg-black py-3">
        <Swiper
          spaceBetween={14}
          loop
          speed={1000}
          autoplay={{ delay: 1800, disableOnInteraction: false }}
          modules={[Autoplay]}
          grabCursor
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
          }}
        >
          {categories && categories?.map((item) => (
            <SwiperSlide key={item._id}>
              <div
                onClick={() => {
                  setSelectedId(item._id);
                    setSelectedCategory(item);

                  router.push(`/design/residential/${item.slug}`, undefined, { shallow: true });
                }}
                className="relative h-[120px] md:h-[140px] lg:h-[150px]
                rounded-md overflow-hidden cursor-pointer"
              >
                <img
                  src={item.Image || ProductListBanner?.src}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />

                <div className={`absolute inset-0
                  ${selectedId === item._id ? "bg-black/20" : "bg-black/55 hover:bg-black/30"}`} />

                <div className="absolute inset-0 flex items-center justify-center">
                  <h1 className={`text-white text-[11px] md:text-[13px] font-bold uppercase
                    ${selectedId === item._id ? "text-yellow-300" : "text-gray-200"}`}>
                    {item.title}
                  </h1>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* -------- Sections -------- */}
      <section className="py-4 md:py-8">
        <div className="container mx-auto px-4 max-w-[1430px]">
          <ConceptSection data={common} />
          <ConceptSection title="NEO CLASSIC" data={classic} />
          <ConceptSection title="MODERN" data={modern} />
          <ConceptSection title="CONTEMPORARY" data={contemporary} />
        </div>

        {selectedId &&
          !common?.length &&
          !classic?.length &&
          !modern?.length &&
          !contemporary?.length && (
            <NoData
              heading="No Design Found"
              content="We couldn’t find any designs for this category. Please try another category or check back later."
            />
          )}
      </section>
    </Layout>
  );
}
