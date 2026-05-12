import React, { useEffect, useState } from "react";
import Listing from "../api/Listing";
import Link from "next/link";

// SWIPER
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// SWIPER CSS
import "swiper/css";

const CategoryCard = ({ title, image, slug }) => (
    <Link
        href={`/product/list/${slug}`}
        className="group block w-full"
    >
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300">

            {/* IMAGE */}
            <div className="w-full h-[220px] md:h-[300px] overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
            </div>

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition duration-300" />

            {/* TEXT */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl py-3 px-4">
                    <h3 className="text-black text-center text-[15px] md:text-[18px] font-bold uppercase tracking-wide">
                        {title}
                    </h3>
                </div>
            </div>

        </div>
    </Link>
);

const FeaturedCategories = () => {
    const [categories, setCategories] = useState([]);

    const fetchData = async () => {
        try {
            const main = new Listing();

            const response = await main.categoryStatus();

            if (response.data?.data) {
                setCategories(response.data.data);
            }

        } catch (error) {
            console.log("Error:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <section className="bg-[#F6F6F6] py-6 md:py-10">

            <div className="container mx-auto px-4 max-w-[1430px]">

                {/* HEADING */}
                <div className="flex items-center justify-between mb-6">

                    <h2 className="text-[#171717] font-[900] text-[18px] md:text-[24px] uppercase Creato">
                        Featured Categories
                    </h2>

                </div>

                {/* SWIPER */}
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={24}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    loop={categories.length > 3}
                    breakpoints={{
                        0: {
                            slidesPerView: 1,
                        },
                        640: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 3,
                        },
                    }}
                >
                    {categories &&
                        categories.map((category) => (
                            <SwiperSlide key={category._id}>
                                <CategoryCard
                                    title={category.name}
                                    image={category.Image}
                                    slug={category.slug}
                                />
                            </SwiperSlide>
                        ))}
                </Swiper>

            </div>
        </section>
    );
};

export default FeaturedCategories;