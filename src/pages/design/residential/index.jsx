import Image from "next/image";
import Link from "next/link";
import Listing from "@/pages/api/Listing";
import { useEffect, useState } from "react";
import Layout from "@/pages/common/Layout";
import Banner from "@/components/Banner";
import ProductListBanner from "../../../Assets/Images/desgin004.jpeg";
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

    console.log("data" ,data)
    return (
        <Layout>
            <div
                className=" ">
                <Banner Slider1={ProductListBanner}
                    title={"Residential Design Tailored for Comfort, Coherence, and Daily Living"}
                    content={"From compact apartments to villas, we deliver interiors that function with character. Our process includes precise layout planning, 3D visualizations, and on-site supervision for complete spatial control."} />
                <div className="container mx-auto px-4 max-w-[1430px]">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
                        {data?.Residentialservices?.map((item, index) => (
                            <Link
                                href={`/design/residential/${item.slug}`}
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
                                    {/* <Link
                                        href={`/booking`}
                                        className="
    opacity-100 translate-y-0 
    md:opacity-0 md:translate-y-4 
    md:group-hover:opacity-100 md:group-hover:translate-y-0 
    transition-all duration-300
    px-4 py-[6px]
    font-[700]
    cursor-pointer
    Creato uppercase
    md:px-[30px] md:py-[10px]
    text-[13px]
    bg-transparent text-white border border-white
  "
                                    >
                                        Book Now
                                    </Link> */}
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
