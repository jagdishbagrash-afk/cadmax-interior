import React, { useEffect, useState } from "react";
import Listing from "../api/Listing";
import Link from "next/link";

const DesignConcept = () => {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const main = new Listing();
            const response = await main.ServicesSubCategoryList();

            if (response.data?.data) {
                setData(response.data.data);
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    console.log("data", data)
    return (
        <section className="bg-white py-4 md:py-8 ">
            <div className="container mx-auto px-4 max-w-[1430px]">
                <h2 className="text-[#171717] font-[900] text-[18px] md:text-[24px] leading-[100%] tracking-[-0.02em] mb-4 md:mb-6 uppercase Creato">
                    3D DESIGN CONCEPT
                </h2>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* First tall image */}
                    <Link       href={`/concept/${data[0]?.slug}`} className="sm:row-span-2 relative overflow-hidden">
                        <img
                            src={data[0]?.Image}
                            alt={data[0]?.name}
                            className="w-full h-full md:h-[605px] object-cover transform hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <h3
                                className="text-white font-[900] text-[18px] leading-[100%] tracking-[-0.02em] text-center uppercase Creato"
                            >
                                {data[0]?.name}
                            </h3>

                        </div>
                    </Link>

                    {/* Remaining 4 images */}
                    {data?.slice(1)?.map((item) => (
                        <Link
                        href={`/concept/${item?.slug}`}
                            key={item._id}
                            className="relative overflow-hidden group h-48 sm:h-56 lg:h-[300px]"
                        >
                            <img
                                src={item.Image}
                                alt={item.name}
                                className="w-full h-full lg:h-[300px] object-cover transform group-hover:scale-105 transition duration-500"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <h3
                                    className="text-white font-[900] text-[18px] leading-[100%] tracking-[-0.02em] text-center uppercase Creato"

                                >
                                    {item.name}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DesignConcept;
