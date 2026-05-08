"use client";
import React, { useEffect, useState, useMemo } from "react";
import Listing from "../api/Listing";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

const DesignConcept = () => {
    const [data, setData] = useState([]);
    console.log("data", data)

    const fetchData = async () => {
        try {
            const main = new Listing();
            const response = await main.ServicesSubCategoryList();

            if (response?.data?.data) {
                setData(response.data.data);
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ✅ Proper grouping (fix for last 4 slug issue)
    const groupedData = useMemo(() => {
        const groups = [];
        for (let i = 1; i < data.length; i += 4) {
            groups.push(data.slice(i, i + 4));
        }
        return groups;
    }, [data]);

    console.log("groupedData", groupedData)
    return (
        <section className="bg-white py-4 md:py-8">
            <div className="container mx-auto px-4 max-w-[1430px]">
                <h2 className="text-[#171717] font-[900] text-[18px] md:text-[24px] leading-[100%] tracking-[-0.02em] mb-4 md:mb-6 uppercase Creato">
                    3D DESIGN CONCEPT
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                    {/* ✅ First Big Card */}
                    {data[0] && (
                        <Link
                            href={`/design/${data[0]?.TypeServices?.toLowerCase() || ""}/${data[0]?.slug || ""}`}
                            className="sm:row-span-2 relative overflow-hidden"
                        >
                            <img
                                src={data[0]?.Image || "/fallback.jpg"}
                                alt={data[0]?.name || "design"}
                                className="w-full h-full md:h-[630px] object-cover transform hover:scale-105 transition duration-500"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <h3 className="text-white font-[900] text-[18px] leading-[100%] tracking-[-0.02em] text-center uppercase Creato">
                                    {data[0]?.name}
                                </h3>
                            </div>
                        </Link>
                    )}

                    {/* ✅ Slider Section */}
                    <div className="lg:col-span-2">
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={12}
                            autoplay={{ delay: 2500, disableOnInteraction: false }}
                            loop={groupedData.length > 1}
                            modules={[Autoplay]}
                        >
                            {groupedData.map((group, idx) => (
                                <SwiperSlide key={idx}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-3 h-[620px]">
                                        {group.map((item) => (
                                            <Link
                                                key={item?._id}
                                                href={`/design/${item?.TypeServices?.toLowerCase() || ""}/${item?.slug || ""}`}
                                                className="relative overflow-hidden group"
                                            >
                                                <img
                                                    src={item?.Image || "/fallback.jpg"}
                                                    alt={item?.name || "design"}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                                                />

                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center">
                                                    <h3 className="text-white font-[900] uppercase text-[14px] md:text-[16px] Creato">
                                                        {item?.title}
                                                    </h3>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default DesignConcept;