import React from "react";

/**
 * ProductGrid
 * Props:
 *  - products: [{ id, title, price, image }]
 */
export default function ProductGrid({ products = [] }) {
    return (
        <div className="container mx-auto px-4 max-w-[1430px]">
            <section className="bg-gray-50 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-bold tracking-wide text-gray-800">OUR BEST SELLER</h2>
                    <button
                        type="button"
                        className="text-sm border border-gray-300 px-3 py-1 rounded-sm hover:bg-gray-100"
                    >
                        VIEW ALL
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((p, idx) => (
                        <article
                            key={p.id ?? idx}
                            className="bg-white shadow-sm overflow-hidden border border-transparent hover:border-gray-200 transition rounded-sm"
                        >
                            {/* Image container with fixed aspect */}
                            <div className="w-full h-[260px] md:h-64 overflow-hidden bg-gray-100">
                                <img
                                    src={p.image}
                                    alt={p.title}
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>

                            <div className="p-4">
                                <h3 className="text-xs uppercase tracking-tight text-gray-600 mb-2 leading-tight">
                                    {p.title}
                                </h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-gray-900">{p.price}</span>
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
