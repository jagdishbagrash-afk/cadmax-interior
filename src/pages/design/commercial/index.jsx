import Image from "next/image";
import Link from "next/link";
import Listing from "@/pages/api/Listing";
import { useEffect, useState } from "react";
import Layout from "@/pages/common/Layout";
import Banner from "@/components/Banner";
import ProductListBanner from "../../../Assets/Images/desgin006.jpeg";
import Slider2 from "@/pages/home/Slider2";


export default function ResidentialDesign() {

    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const main = new Listing();
            const response = await main.ServciesType();
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
    return (
        <Layout>
            <div
                className=" ">
                <Banner Slider1={ProductListBanner}
                    title={"  Commercial Spaces Engineered for Flow, Brand Presence & Performance"}
                    content={" Every commercial project is designed to optimize spatial efficiency, brand impact, and customer experience. Whether it’s a café, salon, or corporate office, layouts are driven by logic and modern aesthetics."} />
                <div className="container mx-auto px-4 max-w-[1430px]">
                    {/* Heading */}
                    {/* <div className="max-w-4xl mx-auto mb-10 md:mb-16 flex flex-col items-center justify-between">

                    <h2 className="text-[#171717] font-[900] text-[18px] md:text-[20px] lg:text-[24px] leading-[100%] 
                     tracking-[-0.02em] text-center uppercase Creato  ">
                        Residential Design Tailored for Comfort, Coherence, and Daily Living
                    </h2>
                    <p className="text-[#4D5466] font-[500] text-sm md:text-base leading-relaxed mt-3  text-center  ">
                        From compact apartments to villas, we deliver interiors that function
                        with character. Our process includes precise layout planning, 3D
                        visualizations, and on-site supervision for complete spatial control.
                    </p>
                </div> */}

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5 ">
                        {data?.Commercialservices?.map((item, index) => (
                            <Link
                                href={`/design/commercial/${item.slug}`}
                                key={index}
                                className="relative overflow-hidden group block"
                            >
                                {/* Image */}
                                <Image
                                    src={item?.Image}
                                    alt={item.title}
                                    width={500}
                                    height={350}
                                    className="w-full h-[325px] object-cover transition-transform duration-500 group-hover:scale-105"
                                />

                                {/* Dark Overlay */}
                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-4 transition-all duration-300">

                                    {/* Title */}
                                    <h3 className="text-white Creato text-[16px] lg:text-[18px] font-normal leading-[120%] tracking-[-0.03em] mb-3">
                                        {item.title}
                                    </h3>

                                    {/* Book Now Button (Hidden by default) */}
                                    <Link
                                        href={`/booking`}
                                        className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300   px-4 
        py-[6px]
        font-[700] 
        cursor-pointer 
        Creato 
        uppercase 
        md:px-[30px] 
        md:py-[10px] 
        text-[13px] bg-transparent text-white border border-white"
                                    >
                                        Book Now
                                    </Link>
                                </div>
                            </Link>

                        ))}
                    </div>
                </div>
                <div className="mt-4">
                    <Slider2 />
                </div>
            </div>
        </Layout>
    );
}
