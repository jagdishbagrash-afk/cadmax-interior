import React from "react";
import Link from "next/link";

export default function Vendor({ vendors = [], title = "OUR PROFESSIONALS", link = "/vendors" }) {

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
                        className="px-4 py-[6px] md:px-[30px] md:py-[10px] text-[13px] font-[700] cursor-pointer uppercase Creato bg-transparent text-black border border-[#17171733]"
                    >
                        View All
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {vendors?.map((item, idx) => {
                        const image = item?.multiple_images?.[0] || item?.Image;
                        const category = item?.VendorCategory?.name;

                        return (
                            <Link
                                key={item?._id || idx}
                                href={`/vendor/${item?.VendorCategory?.slug}/${item?.slug}`}
                                className="group block rounded-2xl overflow-hidden shadow hover:shadow-xl transition bg-white"
                            >

                                {/* Image */}
                                <div className="relative w-full h-[280px] md:h-[300px] lg:h-80 overflow-hidden bg-gray-100 group cursor-pointer">
                                    {/* Default image */}
                                    <img
                                        src={item?.Image || "/no-image.png"}
                                        alt={item?.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                                    />

                                    {/* Hover image */}
                                    <img
                                        src={item?.multiple_images?.[0] || item?.Image || "/no-image.png"}
                                        alt={item?.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition" />

                                    {/* Category Badge */}
                                    <div className="absolute uppercase top-3 left-3 bg-white text-black text-xs px-3 py-1 rounded-full font-semibold">
                                        {category}
                                    </div>

                                </div>

                                {/* Bottom Content */}
                                <div className="p-4 space-y-2">
                                    <h3 className="mt-3 text-sm font-medium text-[#fffff] uppercase Creato">
                                        {item?.name}
                                    </h3>
                                    {/* Experience */}
                                    <p className="mt-1 text-base text-[#171717] font-extrabold  Creato">
                                        {item?.experience} Experience
                                    </p>


                                </div>

                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}