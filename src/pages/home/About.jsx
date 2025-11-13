import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useRouter } from "next/router";
import Slider1 from "../../Assets/Images/Frame11.jpg"
import Slider2 from "../../Assets/Images/swiper.jpg"
import Frame18 from "../../Assets/Images/Frame18.jpg"

import Button from "../common/Button";

export default function About() {
    const router = useRouter();

    const slides = [
        {
            front: Slider1?.src,
            title: "Residential Interior Design & Complete Full-Home Spatial Development",
            button: "Explore Residential"
        },
        {
            front: Slider2?.src,
            title: "Commercial Interior Planning, Brand-Aligned Layouts & Functional Space Execution",
            button: "Explore Commercial"
        },
        {
            front: Frame18?.src,
            title: "Completed Interior Projects with Verified On-Site Finishing & Delivered Outcomes",
            button: "View Projects"
        },

    ];
    return (
        <>
            <section className="bg-white py-4 md:py-8 ">
                {slides && slides?.map((item, index) => (
                    <div
                        key={index}
                        className={`flex flex-wrap lg:py-20 sticky top-20 -mx-4`}
                    >
                        <div className="relative w-full px-4">
                            {/* Image */}
                            <img
                                src={item?.front}
                                alt="img"
                                className="w-full h-[500px] lg:h-[675px] object-cover "
                            />

                            {/* Overlay (optional for dark effect) */}
                            <div className="absolute inset-0 bg-black/40 "></div>

                            {/* Text + Button on top of Image */}
                            <div className="absolute top-8 left-8 md:top-12 md:left-12 z-10 text-white">
                                <h3 className="font-[Oswald] text-[18px] md:text-[24px] font-[900] uppercase leading-[26px] md:leading-[35px] tracking-[-0.035em] mb-4 max-w-[650px] mx-auto">
                                    {item?.title}
                                </h3>

                                <Button
                                    title={item?.button}
                                    classes={"bg-transparent text-white border border-white"}
                                />
                            </div>
                        </div>
                    </div>


                ))}
            </section>
        </>
    );
}