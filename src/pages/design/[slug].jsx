"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/pages/common/Layout";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import Listing from "@/pages/api/Listing";
import Link from "next/link";

export default function Index() {
    const router = useRouter();
    const id = router?.query?.slug;
    const [record, setRecord] = useState("")

    const [classic, setClassic] = useState([]);
    const [modern, setModern] = useState([]);
    const [contemporary, setContemporary] = useState([]);

    // Fetch Project Based on Selected
    const fetchProjectData = async () => {
        if (!id) return;
        try {
            const main = new Listing();
            const response = await main.GetAllConceptType(id);
            setRecord(response.data.data.record)
            const data = response?.data?.data?.services;

            if (data && Array.isArray(data)) {

                // neo_classic
                const classicData = data.filter(item => item.concept === "neo_classic");
                setClassic(classicData);

                // modern
                const modernData = data.filter(item => item.concept === "modern");
                setModern(modernData);

                // contemporary
                const contemporaryData = data.filter(item => item.concept === "contemporary");
                setContemporary(contemporaryData);
            }

        } catch (error) {
            console.log("Error:", error);
        }
    };

    useEffect(() => {
        fetchProjectData();
    }, [id]);


    return (
        <Layout>
            <div className="relative w-full h-[300px] sm:h-[360px] md:h-[420px] lg:h-[480px] overflow-hidden md:mt-[-80px]">

                <img
                    src={record?.Image}
                    alt="Slide"
                    className="object-cover w-full h-full"
                />

                <div className="absolute inset-0 bg-black/25"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 text-center">

                    <h1
                        className="
            font-[900]
            text-[18px]
            sm:text-[20px]
            lg:text-[24px]
            text-white
            uppercase
            Creato
            leading-[110%]
            tracking-[-0.02em]
            max-w-[90%]
            sm:max-w-[550px]
            mx-auto
          "
                    >
                        {`${record?.name}`}
                    </h1>

                </div>
            </div>

            <section className="py-4 md:py-8">
                <div className="container mx-auto px-4 max-w-[1430px]">
                    {classic?.length > 0 && (
                        <>
                            <h2 className="text-[#171717] font-[900] text-[18px] md:text-[20px] lg:text-[24px] leading-[100%] 
                       tracking-[-0.02em] text-left uppercase Creato mb-5  ">NEO CLASSIC</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {classic?.map((p, idx) => (
                                    <Link href={`/design/details/${p.slug}`} key={p.id ?? idx} className="overflow-hidden">
                                        <div className="relative w-full h-[400px] md:h-[480px] overflow-hidden bg-gray-100">
                                            <img
                                                src={p.Image}
                                                alt={p.title}
                                                className="
                        w-full h-full object-cover object-center
                                  transition-transform duration-700 ease-in-out
                                  group-hover:rotate-45 group-hover:scale-120

                            "
                                            />
                                        </div>

                                        <div className="pt-2">
                                            <h3 className="text-[14px] uppercase text-[#262A33] mb-2 font-medium tracking-[0.05em]">
                                                {p.title}
                                            </h3>

                                            <p className="text-[#4D5466] font-[500] text-sm md:text-base leading-relaxed mt-3 line-clamp-3  ">
                                                {p.content}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}

                    {modern.length > 0 && (
                        <>
                            <h2 className="text-[#171717] font-[900] text-[18px] md:text-[20px] lg:text-[24px] leading-[100%] 
                       tracking-[-0.02em] text-left uppercase Creato  mb-5 mt-5 ">MODERN</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {modern?.map((p, idx) => (
                                    <Link href={`/design/details/${p.slug}`} key={p.id ?? idx} className="overflow-hidden">
                                        <div className="relative w-full h-[400px] md:h-[480px] overflow-hidden bg-gray-100">
                                            <img
                                                src={p.Image}
                                                alt={p.title}
                                                className="w-full h-full object-cover object-center
            transition-transform duration-700 ease-in-out
            group-hover:rotate-45 group-hover:scale-90
"
                                            />
                                        </div>

                                        <div className="pt-2">
                                            <h3 className="text-[14px] uppercase text-[#262A33] mb-2 font-medium tracking-[0.05em]">
                                                {p.title}
                                            </h3>

                                            <p className="text-[#4D5466] font-[500] text-sm md:text-base leading-relaxed mt-3  line-clamp-3  ">
                                                {p.content}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}

                    {contemporary.length > 0 && (
                        <>
                            <h2 className="text-[#171717] font-[900] text-[18px] md:text-[20px] lg:text-[24px] leading-[100%] 
                       tracking-[-0.02em] text-left uppercase Creato mb-5 mt-5 ">CONTEMPORARY</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {contemporary?.map((p, idx) => (
                                    <Link
                                        href={`/design/details/${p.slug}`}
                                        key={p.id ?? idx}
                                        className="group overflow-hidden"
                                    >
                                        <div className="relative w-full h-[400px] md:h-[480px] overflow-hidden bg-gray-100">
                                            <img
                                                src={p.Image}
                                                alt={p.title}
                                                className="
            w-full h-full object-cover object-center
            transition-transform duration-700 ease-in-out
            group-hover:rotate-45 group-hover:scale-180
          "
                                            />
                                        </div>

                                        <div className="pt-2">
                                            <h3 className="text-[14px] uppercase text-[#262A33] mb-2 font-medium tracking-[0.05em]">
                                                {p.title}
                                            </h3>

                                            <p className="text-[#4D5466] font-[500] text-sm md:text-base leading-relaxed mt-3 line-clamp-3">
                                                {p.content}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                        </>
                    )}

                </div>
            </section>
        </Layout>
    );
}
