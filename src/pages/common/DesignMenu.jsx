"use client";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect, useState } from "react";

const DesignMenu = () => {

    const [categories, setCategories] = useState([
        {
            _id: 1,
            name: "Residential",
            Image: "/residential.jpg",
            slug: "residential"
        },
        {
            _id: 2,
            name: "Commercial",
        Image: "/commercial.jpeg",
            slug: "commercial"

        }
    ]);



    return (
        <li className="">
            {/* ONLY PRODUCT IS THE HOVER TRIGGER */}
            <div className="group inline-block ">
                <Link
                    href="/design"
                    className="text-black text-sm font-medium flex items-center gap-1 uppercase"
                >
                    design <IoIosArrowDown size={14} />
                </Link>
                {/* <div
          className="text-black text-sm font-medium flex items-center gap-1"
        >
          Vendor <IoIosArrowDown size={14} />
        </div> */}

                <div
                    className="
    absolute bg-white shadow-2xl w-full left-0
    /* animation initial state */
    opacity-0 -translate-y-5
    transition-all duration-300 ease-out
    group-hover:opacity-100 group-hover:translate-y-0
    pointer-events-none group-hover:pointer-events-auto
    z-50
  "
                >
                    <div className="rounded-xl p-10 mt-6 flex justify-center text-center"
                    >
                        <div className="mx-auto grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            {categories?.map((item) => (
                                <Link href={`/design/${item?.slug}`} key={item._id} className="group cursor-pointer">
                                    <div className="w-full h-[280px] md:h-[300px] lg:h-[320px] overflow-hidden">
                                        <img
                                            src={item.Image ? item.Image : c1?.src || c1?.src}
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

export default DesignMenu;