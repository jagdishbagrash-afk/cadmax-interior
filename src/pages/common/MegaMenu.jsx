"use client";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import c1 from "../../Assets/Images/c1.jpg";
import c2 from "../../Assets/Images/c2.jpg";
import c3 from "../../Assets/Images/c3.jpg";
import c4 from "../../Assets/Images/c4.jpg";
import c5 from "../../Assets/Images/c5.jpg";
import Listing from "../api/Listing";
import { useEffect, useState } from "react";

const MegaMenu = () => {

  const [categories, setCategories] = useState([]);

  const fetchData = async () => {
    try {
      const main = new Listing();
      const response = await main.categoryStatus();

      if (response.data?.data) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

// console.log("categories" ,categories)
  return (
    <li className=" ">
      {/* ONLY PRODUCT IS THE HOVER TRIGGER */}
      <div className="group inline-block ">
        <Link
          href="/product"
          className="text-black text-sm font-medium flex items-center gap-1"
        >
          PRODUCT <IoIosArrowDown size={14} />
        </Link>

      
        <div
          className="
    absolute bg-white shadow-2xl w-full left-[0px]
    ml-[calc(-50vw_+_163%)]
    opacity-0 -translate-y-5
    transition-all duration-300 ease-out
    group-hover:opacity-100 group-hover:translate-y-0
    pointer-events-none group-hover:pointer-events-auto
    z-50
  "
        >
          <div
            className="
      rounded-xl p-10 mt-6 w-full
      flex justify-center text-center
    "
          >
            <div className="mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories?.map((item) => (
                <Link href={`/product/list/${item?.name?.replaceAll(" ", "-")}`} key={item._id} className="group cursor-pointer">
                  <div className="w-full h-[280px] md:h-[300px] lg:h-[320px] overflow-hidden">
                    <img
                      src={item.Image  ? item.Image : c1?.src  || c1?.src }
                      alt={item.name}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                    />
                  </div>

                  <h3 className="mt-3 text-sm font-medium text-[#262A33] uppercase">
                    {item.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default MegaMenu;