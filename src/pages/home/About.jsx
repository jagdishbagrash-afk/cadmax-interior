import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useRouter } from "next/router";
import Slider1 from "../../Assets/Images/Slider1.png"
import Button from "../common/Button";

export default function About() {
    const router = useRouter();
    useEffect(() => {
        if (typeof window === 'undefined') return; // SSR guard
        setIsMobile(window.innerWidth <= 1023);
    }, []);


    const slides = [
        {
            front: Slider1?.src,
            title: "Residential Interior Design & Complete Full-Home Spatial Development",
            button: "Explore Residential"
        },
        {
            front: Slider1?.src,
            title: "Commercial Interior Planning, Brand-Aligned Layouts & Functional Space Execution",
            button: "Explore Commercial"
        },
        {
            front: Slider1?.src,
            title: "Completed Interior Projects with Verified On-Site Finishing & Delivered Outcomes",
            button: "View Projects"
        },

    ];
    const [isMobile, setIsMobile] = useState();
    const settings = {
        dots: true,
        navigation: true,
        infinite: true,
        nav: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 2000,
    };

    useEffect(() => {

        if (typeof window === 'undefined') return; // SSR guard

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 767);
        };

        window.addEventListener("resize", handleResize);

        // Cleanup listener on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [])

    return (
        <>
            <section className="bg-white py-8">

                <div className="">
                    {isMobile ?
                        <Swiper
                            modules={[Autoplay, Pagination]}
                            autoplay={{ delay: 2000 }}
                            pagination={{ clickable: true }}
                            loop={true}
                            speed={500}
                            slidesPerView={1}
                        >
                            {slides &&
                                slides.map((item, index) => (
                                    <SwiperSlide
                                        key={index + 11}
                                        className="lg:max-w-[380px] mx-auto min-h-[454px] lg:pl-[30px] xl:pl-0 lg:min-h-[665px] xl:min-h-[723px] flex flex-col justify-center items-center md:items-start text-center md:!text-left"
                                    >
                                        {/* Mobile Image */}
                                        <div className="text-center bg-[#12171D] w-full rounded-[20px] !pb-0 lg:!hidden mb-[20px]">
                                            <img
                                                src={item?.img_src}
                                                alt="img"
                                                className="w-full mx-auto h-[250px] md:h-auto object-cover rounded-[10px] md:rounded-[30px]" />
                                        </div>

                                        {/* Title */}
                                        <h3 className="font-[Oswald] text-[16px] md:text-[24px] font-[600] uppercase leading-[24px] md:leading-[35px] tracking-[-0.035em] text-[#ffffff] mt-[10px] md:mt-[25px] md-[10px] md:mb-[15px]">
                                            {item?.title}
                                        </h3>

                                        {/* Paragraph */}
                                        <p className="font-[Poppins] opacity-80 text-[14px] md:text-[16px] font-[400] leading-[20px] md:leading-[24px] text-[#FFFFFF] tracking-[-0.035em] mb-[7px] md:mb-[30px]">
                                            {item?.paragraph}
                                        </p>

                                        {/* Learn More Button */}
                                        {item?.link && (
                                            <button
                                                onClick={() => router.visit(route(item?.link))}
                                                className="cursor-pointer flex gap-2 items-center uppercase text-[#00a77e] mx-auto font-[Oswald] text-[14px] md:text-[16px] md:text-[18px] font-[600] uppercase leading-[26.58px]"
                                            >
                                                Learn More
                                                <div dangerouslySetInnerHTML={{ __html: thinArrow }} />
                                            </button>
                                        )}
                                    </SwiperSlide>
                                ))}
                        </Swiper>
                        :
                        <>
                            {slides && slides?.map((item, index) => (
                                <div
                                    key={index}
                                    className={`flex flex-wrap lg:py-20 sticky top-20 -mx-4 ${index % 2 === 0 ? "flex-row" : "lg:flex-row-reverse"
                                        }`}
                                >
                                    <div className="relative w-full px-4">
                                        {/* Image */}
                                        <img
                                            src={item?.front}
                                            alt="img"
                                            className="w-full h-[500px] lg:h-[675px] object-cover rounded-md"
                                        />

                                        {/* Overlay (optional for dark effect) */}
                                        <div className="absolute inset-0 bg-black/40 rounded-md"></div>

                                        {/* Text + Button on top of Image */}
                                        <div className="absolute top-8 left-8 md:top-12 md:left-12 z-10 text-white">
                                            <h3 className="font-[Oswald] text-[18px] md:text-[28px] font-[700] uppercase leading-[26px] md:leading-[35px] tracking-[-0.035em] mb-4 max-w-[700px] mx-auto">
                                                {item?.title}
                                            </h3>

                                            <Button
                                                title={item?.button}
                                                classes={"bg-transparent text-white border border-white"}
                                            />
                                        </div>
                                    </div>
                                </div>


                            ))
                            }
                        </>
                    }
                </div>
            </section>
        </>
    );
}