"use client";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import Listing from "../api/Listing";
import c1 from "../../Assets/Images/c1.jpg";

const MegaMenu = ({ textColor, active }) => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const main = new Listing();
      const res = await main.categoryStatus();
      if (res.data?.data) setCategories(res.data.data);
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories?.map((item) => (
              <Link
                key={item._id}
                href={`/product/list/${item.name}`}
                onClick={() => setOpen(false)}
              >
                <div className="h-[220px] overflow-hidden rounded-lg">
                  <img
                    src={item.Image || c1.src}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-center mt-2 text-black">
                  {item.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
};

export default MegaMenu;