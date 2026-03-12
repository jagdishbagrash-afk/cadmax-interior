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
import Link from "next/link";

export default function About() {
    const router = useRouter();

    const slides = [
        {
            front: Slider1?.src,
            title: "Residential Interior Design & Complete Full-Home Spatial Development",
            button: "Explore Residential",
            link: "/design"
        },
        {
            front: Slider2?.src,
            title: "Commercial Interior Planning, Brand-Aligned Layouts & Functional Space Execution",
            button: "Explore Commercial",
            link: "/design"
        },
        {
            front: Frame18?.src,
            title: "Completed Interior Projects with Verified On-Site Finishing & Delivered Outcomes",
            button: "View Projects",
            link: "/project"
        },

    ];
    return (
        <section className="bg-white py-4 md:py-8 ">
            {slides && slides?.map((item, index) => (
                <div
                    key={index}
                    className={`flex flex-wrap sticky top-20`}
                >
                    <div className="relative w-full">
                        {/* Image */}
                        <img
                            src={item?.front}
                            alt="img"
                            className="w-full h-[500px] lg:h-[675px] object-cover "
                        />

                        <div className="absolute inset-0 bg-black/40 "></div>

                        <div className="absolute top-8 left-8 right-8 md:top-12 md:left-12 md:right-0 z-10 text-white md:max-w-1/2 ">
                            <h3 className="Creato !text-left text-[18px] md:text-[24px] font-[900] uppercase leading-[26px] md:leading-[35px] tracking-[-0.035em] mb-4 ">
                                {item?.title}
                            </h3>

                            <Link href={item?.link} className="
           px-4 
        py-[6px]
        font-[700] 
        cursor-pointer 
        Creato 
        uppercase 
        md:px-[30px] 
        md:py-[10px] 
        text-[13px]
        bg-transparent text-white border border-white
          ">
                                {item?.button}
                            </Link>

                        </div>
                    </div>
                </div>


            ))}
        </section>
    );
}