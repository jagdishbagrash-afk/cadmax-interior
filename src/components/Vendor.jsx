import React from "react";
import Link from "next/link";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function Vendor({
  vendors = [],
  title = "OUR PROFESSIONALS",
  link = "/vendors",
}) {
  const VendorList = Array.isArray(vendors) ? vendors.slice(0, 8) : [];

  return (
    <section className="bg-white py-6 md:py-10">
      <div className="container mx-auto px-4 max-w-[1430px]">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#171717] font-[900] text-[18px] md:text-[24px] uppercase Creato">
            {title}
          </h2>
          <Link
            href={link}
            className="px-4 py-[6px] md:px-[30px] md:py-[10px] text-[13px] font-[700] uppercase Creato border border-[#17171733]"
          >
            View All
          </Link>
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Autoplay]}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          speed={800}
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
        >
          {VendorList.map((item, idx) => {
            const category = item?.VendorCategory?.name;

            return (
              <SwiperSlide key={item?._id || idx}>
                <Link
                  href={`/vendor/${item?.VendorCategory?.slug}/${item?.slug}`}
                  className="group block rounded-2xl overflow-hidden shadow hover:shadow-xl transition bg-white"
                >

                  {/* Image */}
                  <div className="relative w-full h-full md:h-[300px] lg:h-80 overflow-hidden bg-gray-100">

                    <img
                      src={item?.Image || "/no-image.png"}
                      alt={item?.name}
                      className="absolute inset-0 max-w-full md:max-w-[375px] h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                    />

                    <img
                      src={item?.multiple_images?.[0] || item?.Image || "/no-image.png"}
                      alt={item?.name}
                      className="absolute inset-0 max-w-full md:max-w-[375px] h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    />

                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition" />

                    <div className="absolute uppercase top-3 left-3 bg-white text-black text-xs px-3 py-1 rounded-full font-semibold">
                      {category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2">
                    <h3 className="mt-3 text-sm font-medium text-[#171717] uppercase Creato">
                      {item?.name}
                    </h3>

                    <p className="mt-1 text-base text-[#171717] font-extrabold Creato">
                      {item?.experience} Experience
                    </p>
                  </div>

                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>

      </div>
    </section>
  );
}