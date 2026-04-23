import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import Listing from "../api/Listing";
import Layout from "../common/Layout";
import ProductListBanner from "../../Assets/Images/vendor.png";
import Banner from "@/components/Banner";

export default function Index() {


    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const main = new Listing();
            const response = await main.vendorcategoryList();
            if (response.data?.data) {
                setData(response.data.data);
            } else {
                setData([]);
            }
        } catch (error) {
            console.log("Error:", error);
            setData([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Layout>
            <Banner Slider1={ProductListBanner}
                title={"Book a vendor"}
                button={"  Book a vendor"} />
            <div className="bg-[#FFFFFF] py-4 md:py-8 ">
                <div className="container mx-auto px-4 max-w-[1430px]">
                    {/* Heading */}

                    {/* <div className="max-w-7xl mx-auto mb-10 md:mb-16 flex flex-col md:flex-row items-center justify-between gap-5">
                    <h2 className="text-[#171717] font-[900] text-[18px] md:text-[24px] tracking-[-0.02em] uppercase Creato">
                        Book a vendor
                    </h2>

                    <p className="text-[#4D5466] font-[500] text-[16px] md:text-[18px] leading-[100%] tracking-[-0.02em] md:max-w-[55%] text-center md:text-left Creato">
                        Every Cadmax project includes detailed 3D renders that depict scale, lighting, and material texture — eliminating uncertainty and enabling clients to make informed decisions before execution begins.
                    </p>
                </div> */}

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {data && data?.map((p, idx) => (
                            <Link href={`/vendor/${p.slug}`} key={p.id ?? idx} className="overflow-hidden cursor-pointer">
                                {/* IMAGE + OFFER */}
                                <div className="relative w-full h-[290px] md:h-[340px] overflow-hidden ">
                                    <img
                                        src={p.Image}
                                        alt={p.title}
                                        className="w-full h-full object-contain  "
                                    />
                                </div>
                                {/* TITLE + PRICE */}
                                <div className="pt-2">
                                    <h3 className="text-[14px] uppercase text-[#262A33] mb-2 font-medium Creato tracking-[0.05em]">
                                        {p.name}
                                    </h3>

                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
