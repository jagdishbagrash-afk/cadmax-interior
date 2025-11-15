import React from "react";
import Button from "../pages/common/Button";

export default function ProductGrid({ products = [], title }) {
    return (
        <section className="bg-[#fffff] py-4 md:py-8 ">
            <div className="container mx-auto px-4 max-w-[1430px]">
                <div className="flex items-center justify-between mb-3 md:mb-6">
                    <h2 className="text-[#171717] font-[900] text-[18px] md:text-[24px] leading-[100%] tracking-[-0.02em] uppercase Creato">{title || "OUR BEST SELLER"}</h2>
                    <Button
                        title={"VIEW ALL"}
                        classes={"bg-transparent text-black border border-[#17171733]"}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products?.map((p, idx) => (
                        <article key={p.id ?? idx} className="overflow-hidden">

                            {/* IMAGE + OFFER */}
                            <div className="relative w-full h-[400px] md:h-[480px] overflow-hidden bg-gray-100">
                                {/* OFFER BADGE */}
                                {p?.offer && (
                                    <div className="absolute top-4 left-0 flex items-center z-20 max-w-[250px]">
                                        {/* MAIN GREEN BOX */}
                                        <div className="bg-[#5BDF40] text-[#171717] px-3 py-1 text-[14px] md:text-[18px] font-[900] Creato uppercase">
                                            {p?.offer}
                                        </div>
                                        {/* TRIANGLE POINTER */}
                                        <div className="  w-0 h-0 border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent border-l-[16px] border-l-[#5BDF40]">
                                        </div>
                                    </div>
                                )}


                                <img
                                    src={p.image}
                                    alt={p.title}
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>

                            {/* TITLE + PRICE */}
                            <div className="pt-2">
                                <h3 className="text-[14px] uppercase text-[#262A33] mb-2 font-medium Creato tracking-[0.05em]">
                                    {p.title}
                                </h3>

                                <div className="flex items-center justify-between">
                                    <p className="text-[16px] font-extrabold uppercase text-[#171717] Creato">
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
