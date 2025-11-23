"use client";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import c1 from "../../Assets/Images/c1.jpg";
import c2 from "../../Assets/Images/c2.jpg";
import c3 from "../../Assets/Images/c3.jpg";
import c4 from "../../Assets/Images/c4.jpg";
import c5 from "../../Assets/Images/c5.jpg";

const MegaMenu = () => {
  const categories = [
    { id: 1, title: "FURNITURE", image: c4.src },
    { id: 2, title: "SOFA & SEATING", image: c3.src },
    { id: 3, title: "LAMPS & LIGHTNING", image: c5.src },
    { id: 4, title: "UPHOLSTERY", image: c1.src },
    { id: 5, title: "HOME DECOR", image: c2.src },
  ];

  return (
    <li className="relative">
      {/* ONLY PRODUCT IS THE HOVER TRIGGER */}
      <div className="group inline-block">
        <Link
          href="/product"
          className="text-black text-sm font-medium flex items-center gap-1"
        >
          PRODUCT <IoIosArrowDown size={14} />
        </Link>

        {/* DROPDOWN SHOULD NOT BE PART OF HOVER AREA */}
        {/* DROPDOWN POSITION EXACTLY FROM YOUR CODE */}
        <div
          className="
    absolute bg-white shadow-2xl w-screen
    ml-[calc(-50vw_+_165%)]

    /* animation initial state */
    opacity-0 -translate-y-5
    transition-all duration-300 ease-out

    /* show only when PRODUCT is hovered */
    group-hover:opacity-100 group-hover:translate-y-0

    /* do NOT let hover on dropdown keep it open */
    pointer-events-none group-hover:pointer-events-auto

    z-50
  "
        >
          <div
            className="
      rounded-xl p-10 mt-6 w-screen
      flex justify-center text-center
    "
          >
            <div className="mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="w-full h-[280px] md:h-[300px] lg:h-[320px] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                    />
                  </div>

                  <h3 className="mt-3 text-sm font-medium text-[#262A33] uppercase">
                    {item.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default MegaMenu;