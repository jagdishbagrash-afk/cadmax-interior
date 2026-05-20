import Link from "next/link";
import React from "react";

export default function ProductCard({ item }) {

  const image =
    item?.variants?.find((v) => v.images?.length)?.images;

  return (
    <Link
      href={`/product/details/${item?.slug}`}
      className="group block"
    >

      {/* CARD */}
      <div className="bg-white overflow-hidden transition-all duration-300">

        {/* IMAGE */}
        <div className="relative w-full h-[280px] sm:h-[320px] md:h-[360px] lg:h-[450px] overflow-hidden bg-[#F8F8F8]">

          {/* Default Image */}
          <img
            src={image?.[0] || "/no-image.png"}
            alt={item?.title}
            className="
              absolute inset-0
              w-full h-full object-cover
              transition-opacity duration-500
              group-hover:opacity-0
            "
          />

          {/* Hover Image */}
          <img
            src={
              image?.[1] ||
              image?.[0] ||
              "/no-image.png"
            }
            alt={item?.title}
            className="
              absolute inset-0
              w-full h-full object-cover
              opacity-0
              transition-opacity duration-500
              group-hover:opacity-100
            "
          />

        </div>

        {/* TEXT AREA */}
      <div className="bg-white pt-4 pb-2 relative z-10">

          {/* TITLE */}
          <h3
            className="
              text-[13px] sm:text-sm
              font-medium
              text-[#262A33]
              uppercase
              tracking-wide
              line-clamp-2
            "
          >
            {item?.title}
          </h3>

          {/* PRICE */}
          <p
            className="
              mt-2
              text-[18px] sm:text-[20px]
              font-black
              text-black
              uppercase
            "
          >
            ₹{item?.amount}
          </p>

        </div>

      </div>

    </Link>
  );
}