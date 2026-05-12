"use client";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import Listing from "../api/Listing";
import c1 from "../../Assets/Images/c1.jpg";
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
        className={`absolute top-full left-0 right-0   bg-white/50 shadow-xl z-50 transition-all duration-300 ${open
          ? "opacity-100 translate-y-0 visible"
          : "opacity-0 -translate-y-5 invisible"
          }`}
      >
        <div className="container max-w-[1430px] mx-auto p-8">
          <Swiper
            modules={[Autoplay]}
            key={categories.length}
            loop={categories.length > 3}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="w-full"
          >
            {categories?.map((item) => (
              <SwiperSlide key={item._id}>
                <Link
                  href={`/product/list/${item.slug}`}
                  onClick={() => setOpen(false)}
                  className="block"
                >
                  {/* IMAGE */}
                  <div className="h-[220px] overflow-hidden rounded-2xl shadow-lg">
                    <img
                      src={item.Image || c1.src}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    />
                  </div>

                  {/* TITLE */}
                  <div className="mt-3 bg-white/70 backdrop-blur-md rounded-xl py-3 px-4 shadow-sm">
                    <p className="text-center font-semibold text-black text-sm md:text-base uppercase tracking-wide">
                      {item.name}
                    </p>
                  </div>
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