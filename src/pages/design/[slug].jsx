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
import ConceptSection from "../common/ConceptSection";

export default function Index() {
    const router = useRouter();
    const id = router?.query?.slug;
    const [record, setRecord] = useState("")

    const [classic, setClassic] = useState([]);
    const [modern, setModern] = useState([]);
    const [contemporary, setContemporary] = useState([]);
    const [common, setCommon] = useState([]);

    // Fetch Project Based on Selected
    const fetchProjectData = async () => {
        if (!id) return;
        try {
            const main = new Listing();
            const response = await main.GetAllConceptType(id);
            console.log("response", response)
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

                const common = data.filter(item => item.concept === "common");
                setCommon(common);
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

            {/* Services Grid */}
            <section className="py-4 md:py-8">
                <div className="container mx-auto px-4 max-w-[1430px]">
                    <ConceptSection title="" data={common} />
                    <ConceptSection title="NEO CLASSIC" data={classic} />
                    <ConceptSection title="MODERN" data={modern} />
                    <ConceptSection title="CONTEMPORARY" data={contemporary} />
                </div>
            </section>
        </Layout>
    );
}
