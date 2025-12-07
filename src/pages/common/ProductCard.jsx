import Link from "next/link";
import React from "react";

export default function ProductCard({ item }) {

  // ✅ get first available image safely
  const image =
    item?.variants?.find(v => v.images?.length)?.images[0];

  return (
    <Link href={`/product/details/${item?.slug}`}>
      <div key={item?._id} className="group cursor-pointer">

        <div className="w-full h-[280px] md:h-[300px] lg:h-80 overflow-hidden bg-gray-100">
          <img
            src={image || "/no-image.png"}   // fallback if no image
            alt={item?.title}
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
          />
        </div>
        {/* Product title */}
        <h3 className="mt-3 text-sm font-medium text-[#262A33] uppercase Creato">
          {item?.title}
        </h3>
        {/* Price */}
        <p className="mt-1 text-base text-[#171717] font-extrabold uppercase Creato">
          ₹{item?.amount}
        </p>
      </div>
    </Link>
  );
}

