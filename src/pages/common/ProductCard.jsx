import React from "react";

export default function ProductCard({item}) {
  return (
    <div key={item?.id} className="group cursor-pointer">
      <div className="w-full h-[280px] md:h-[300px] lg:h-80 overflow-hidden">
        <img
          src={item?.image}
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
        {item?.price}
      </p>
    </div>
  );
}
