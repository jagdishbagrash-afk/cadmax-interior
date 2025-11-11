import React from "react";

const DesignConcept = () => {
    const items = [
        {
            id: 1,
            title: "LIVING ROOM",
            image:
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=60",
            span: "row-span-2",
        },
        {
            id: 2,
            title: "BEDROOM",
            image:
                "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1200&q=60",
        },
        {
            id: 3,
            title: "OFFICE",
            image:
                "https://images.unsplash.com/photo-1507209696998-3c532be9b2b9?auto=format&fit=crop&w=1200&q=60",
        },
        {
            id: 4,
            title: "KITCHEN",
            image:
                "https://images.unsplash.com/photo-1588854337221-4fd3c1d0d6e8?auto=format&fit=crop&w=1200&q=60",
        },
        {
            id: 5,
            title: "CAFE",
            image:
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=60",
        },
    ];

    return (
        <section className="bg-white py-8">
            <div className="container mx-auto px-4 max-w-[1430px]">
                <h2 className="text-sm font-bold tracking-wide text-gray-900 mb-6">
                    3D DESIGN CONCEPT
                </h2>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* First tall image */}
                    <div className="sm:row-span-2 relative overflow-hidden">
                        <img
                            src={items[0].image}
                            alt={items[0].title}
                            className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <h3 className="text-white font-semibold text-sm tracking-wide">
                                {items[0].title}
                            </h3>
                        </div>
                    </div>

                    {/* Remaining 4 images */}
                    {items.slice(1).map((item) => (
                        <div
                            key={item.id}
                            className="relative overflow-hidden group h-48 sm:h-56 lg:h-[220px]"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <h3 className="text-white font-semibold text-sm tracking-wide">
                                    {item.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DesignConcept;
