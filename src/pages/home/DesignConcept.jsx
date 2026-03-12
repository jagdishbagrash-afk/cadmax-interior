import React, { useEffect, useState } from "react";
import Listing from "../api/Listing";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

const DesignConcept = () => {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const main = new Listing();
            const response = await main.ServicesSubCategoryList();

            if (response.data?.data) {
                setData(response.data.data);
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <section className="bg-white py-4 md:py-8 ">
            <div className="container mx-auto px-4 max-w-[1430px]">
                <h2 className="text-[#171717] font-[900] text-[18px] md:text-[24px] leading-[100%] tracking-[-0.02em] mb-4 md:mb-6 uppercase Creato">
                    3D DESIGN CONCEPT
                </h2>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* First tall image */}
                    <Link href={`/design/${data[0]?.slug}`} className="sm:row-span-2 relative overflow-hidden">
                        <img
                            src={data[0]?.Image}
                            alt={data[0]?.name}
                            className="w-full h-full md:h-[630px] object-cover transform hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <h3
                                className="text-white font-[900] text-[18px] leading-[100%] tracking-[-0.02em] text-center uppercase Creato"
                            >
                                {data[0]?.name}
                            </h3>

                        </div>
                    </Link>

                    {/* Remaining 4 images */}
                    <div className="lg:col-span-2">
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={12}
                            autoplay={{ delay: 2500, disableOnInteraction: false }}
                            loop
                            modules={[Autoplay]}
                        >
                            {data
                                ?.slice(1)
                                .reduce((acc, _, i, arr) => {
                                    if (i % 4 === 0) acc.push(arr.slice(i, i + 4));
                                    return acc;
                                }, [])
                                .map((group, idx) => (
                                    <SwiperSlide key={idx}>
                                        <div className="grid grid-cols-2 grid-rows-2 gap-3 h-[620px]">
                                            {group.map((item) => (
                                                <Link
                                                    key={item?._id}
                                                    href={`/design/${item?.slug}`}
                                                    className="relative overflow-hidden group"
                                                >
                                                    <img
                                                        src={item?.Image}
                                                        alt={item?.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                                                    />

                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                        <h3 className="text-white font-[900] uppercase text-[16px] Creato">
                                                            {item?.name}
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
