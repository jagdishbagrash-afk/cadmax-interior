import React from "react";
import Button from "../pages/common/Button";

export default function ProductGrid({ products = [] }) {
    console.log("Products in ProductGrid:", products);
    return (
        <section className="bg-[#fffff] py-4 md:py-8 ">
            <div className="container mx-auto px-4 max-w-[1430px]">
                <div className="flex items-center justify-between mb-3 md:mb-6">
                    <h2 className="text-[#171717] font-[900] text-[18px] md:text-[24px] leading-[100%] tracking-[-0.02em] uppercase Creato">OUR BEST SELLER</h2>
                    <Button
                        title={"VIEW ALL"}
                        classes={"bg-transparent text-black border border-[#17171733]"}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products && products?.map((p, idx) => (
                        <article
                            key={p.id ?? idx}
                            className="overflow-hidden "
                        >
                            {/* Image container with fixed aspect */}
                            <div className="w-full h-[400px] md:h-[450px] overflow-hidden bg-gray-100">
                                <img
                                    src={p.image}
                                    alt={p.title}
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>
                            <div className="pt-2 ">
                                <h3
                                    className="text-[14px] uppercase text-[#262A33] mb-2 font-medium Creato  tracking-[0.05em]"
                                >
                                    {p.title}
                                </h3>

                                <div className="flex items-center justify-between">
                                    <p
                                        className="text-[16px] font-extrabold  tracking-[0em] uppercase text-[#171717] Creato"
                                    >
                                        {p.price}
                                    </p>

                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
