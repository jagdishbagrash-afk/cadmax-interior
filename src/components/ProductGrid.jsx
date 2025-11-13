import React from "react";

/**
 * ProductGrid
 * Props:
 *  - products: [{ id, title, price, image }]
 */
export default function ProductGrid({ products = [] }) {
    console.log("Products in ProductGrid:", products);
    return (
        <div className="container mx-auto px-4 max-w-[1430px]">
            <section className="bg-gray-50 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[24px] font-bold tracking-wide text-[#171717] uppercase cartera">OUR BEST SELLER</h2>
                    <button
                        type="button"
                        className="w-[168px] h-[37px] border border-[#17171733] px-[50px] py-[14px] rounded-sm text-sm hover:bg-gray-100 flex items-center justify-center gap-[10px] opacity-100"
                    >
                        VIEW ALL
                    </button>

                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products &&  products?.map((p, idx) => (
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
                                <h3 className="text-[14px] uppercase  text-[#262A33] mb-2 font-medium cartera">
                                    {p.title}
                                </h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-[16px] font-[800] text-[#171717] cartera">{p.price}</span>
                                    {/* You can place rating / wishlist icon here */}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}
