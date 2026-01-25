import Link from "next/link";
import React from "react";

export default function ProductCard({ item }) {
  const image = item?.variants?.find(v => v.images?.length)?.images;

  return (
    <Link href={`/product/details/${item?.slug}`}>

      <div className="relative w-full h-[280px] md:h-[300px] lg:h-80 overflow-hidden bg-gray-100 group cursor-pointer">

        {/* Default image */}
        <img
          src={image?.[0] || "/no-image.png"}
          alt={item?.title}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
        />

        {/* Hover image */}
        <img
          src={image?.[1] || image?.[0] || "/no-image.png"}
          alt={item?.title}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        />

      </div>

      <h3 className="mt-3 text-sm font-medium text-[#262A33] uppercase Creato">
        {item?.title}
      </h3>

      <p className="mt-1 text-base text-[#171717] font-extrabold uppercase Creato">
        ₹{item?.amount}
      </p>
    </Link>
  );
}