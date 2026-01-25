import React from "react";
import Button from "../pages/common/Button";
import ProductCard from "@/pages/common/ProductCard";
import Link from "next/link";

export default function ProductGrid({ products = [], title, link }) {
    return (
        <section className="bg-[#fffff] py-4 md:py-8">
            <div className="container mx-auto px-4 max-w-[1430px]">
                <div className="flex items-center justify-between mb-3 md:mb-6">
                    <h2 className="text-[#171717] font-[900] text-[18px] md:text-[24px] uppercase Creato">
                        {title || "OUR BEST SELLER"}
                    </h2>
                    <Link href={link} className="     px-4 
        py-[6px]
        font-[700] 
        cursor-pointer 
        Creato 
        uppercase 
        md:px-[30px] 
        md:py-[10px] 
        text-[13px]  bg-transparent text-black border border-[#17171733]">
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.isArray(products) &&
                        products.slice(0, 4).map((item, idx) => {
                            const product = item?.product ? item?.product : item;
                            return (
                                <ProductCard
                                    key={product?._id || idx}
                                    item={product}
                                />
                            );
                        })}

                </div>

            </div>
        </section>
    );
}
