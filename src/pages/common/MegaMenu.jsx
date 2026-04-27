"use client";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import Listing from "../api/Listing";
import c1 from "../../Assets/Images/c1.jpg";
// ✅ Swiper imports
// ✅ Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const MegaMenu = ({ textColor, active }) => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const main = new Listing();
      const res = await main.categoryStatus();

      if (res.data?.data) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  fetchData();
}, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <li
      ref={menuRef}
      onMouseEnter={() => window.innerWidth > 768 && setOpen(true)}
      onMouseLeave={() => window.innerWidth > 768 && setOpen(false)}
    >

      <div className="flex items-center gap-1">
        <Link
          href="/product"
          className={`uppercase ${textColor}`}
        >
          PRODUCT
        </Link>

        <IoIosArrowDown
          onClick={(e) => {
            e.preventDefault();
            setOpen(!open);
          }}
          className="cursor-pointer"
        />
      </div>

      {/* DROPDOWN */}
      <div
        className={`absolute top-full left-0 right-0   bg-white shadow-xl z-50 transition-all duration-300 ${open
          ? "opacity-100 translate-y-0 visible"
          : "opacity-0 -translate-y-5 invisible"
          }`}
      >
        <div className="max-w-[1230px] mx-auto p-8">
          {/* ✅ Swiper instead of grid */}
            <Swiper
            modules={[Autoplay]}
                 key={categories.length} // 🔥 force re-init
        slidesPerView={1}
        loop={categories.length > 1}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
            spaceBetween={24} // ✅ spacing between cards
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
          >
            {categories?.map((item) => (
              <SwiperSlide key={item._id}>
                <Link
                  href={`/product/list/${item.slug}`}
                  onClick={() => setOpen(false)}
                >
                  <div className="h-[180px] md:h-[220px] overflow-hidden rounded-lg">
                    <img
                      src={item.Image || c1.src}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  </div>

                  <p className="text-center mt-2 text-black text-sm md:text-base">
                    {item.name}
                  </p>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </li>
  );
};

export default MegaMenu;