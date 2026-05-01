import React, { useEffect, useState } from 'react';
import Listing from '../api/Listing';
import Link from 'next/link';
const CategoryCard = ({ title, image  ,slug}) => (
    <Link
        href={`/product/list/${slug}`}
        className="flex-shrink-0 w-[180px] sm:w-[220px] text-center p-1"
    >
        <div className="w-[180px] h-[250px] sm:w-[240px] sm:h-[ ] rounded-full overflow-hidden relative mx-auto">
            <img
                src={image}
                alt={title}
                className="w-full h-full object-cover object-center"
            />
            <div className="
                    absolute inset-0 
                    flex items-center justify-center 
                    text-white text-[18px] sm:text-[22px] 
                    font-[900] uppercase
                    bg-black/40
                ">
                {title}
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
console.log("response" , response)
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
        <section className="bg-[#F6F6F6] py-4 md:py-8 ">
            <div className="container mx-auto px-4 max-w-[1430px]">
                <h2 className="text-[#171717] font-[900] text-[18px] md:text-[24px] leading-[100%] tracking-[-0.02em] mb-4 md:mb-6 uppercase Creato">

                    FEATURED CATEGORIES
                </h2>
                <div className="flex space-x-8 sm:space-x-12 overflow-x-auto pb-4 scrollbar-hide md:scrollbar-default -mx-4 sm:mx-0 px-4 sm:px-0">
                    {categories && categories.map((category, index) => (
                        <CategoryCard
                            key={category.id}
                            title={category.name}
                            image={category.Image}
                            slug={category.slug}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;