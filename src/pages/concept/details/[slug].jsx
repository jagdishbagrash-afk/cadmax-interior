"use client";

import Banner from "@/components/Banner";
import Listing from "@/pages/api/Listing";
import Button from "@/pages/common/Button";
import Layout from "@/pages/common/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DesignLayout() {
    const router = useRouter();
    const id = router?.query?.slug;

    const [project, setProject] = useState([]);

    // Fetch categories
    const fetchData = async (id) => {
        try {
            const main = new Listing();
            const response = await main.ServciesDetails(id);
            if (response.data?.data) {
                const list = response.data.data || [];
                setProject(list);

            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    useEffect(() => {
        if (id) fetchData(id);
    }, [id]);

    console.log("project", project)
    return (
        <Layout>
            <div className="relative w-full h-[300px] sm:h-[360px] md:h-[420px] lg:h-[480px] overflow-hidden md:mt-[-80px]">

                <img
                    src={project?.ServicesType?.Image}
                    alt="Slide"
                    className="object-cover w-full h-full"
                />

                <div className="absolute inset-0 bg-black/25"></div>

                {/* Overlay Content */}
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
                        {`${project?.ServicesType?.TypeServices} - ${project?.ServicesType?.title}`}
                    </h1>

                </div>
            </div>
            <div className="w-full min-h-screen bg-white p-6">

                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Selected Photo */}
                    <div className=" flex justify-center items-center">
                        <img
                            src={project.Image}
                            alt={project.title}
                            className="w-full h-full object-cover transition-all duration-300"
                        />

                    </div>

                    <div>
                        {/* Design Brief */}
                        <div className=" p-4">
                            <h3 className="   font-[900]
            text-[18px]
            sm:text-[20px]
            lg:text-[24px]
            text-black mb-4
            uppercase
            Creato
            leading-[110%]
            tracking-[-0.02em]">{project.title}</h3>
                            <p className=" font-[400]
            text-[15px]
            sm:text-[16px]
            lg:text-[18px]
            text-black mb-4
            ">
                                {project.content}
                            </p>
                        </div>

                        {/* Design Photos Row */}
                        <div className="grid grid-cols-3 gap-4 mt-6 flex-wrap">

                            {project?.multiple_images?.map((box) => (
                                <img
                                    src={box}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-all duration-300"
                                />
                            ))}
                        </div>

                        <div className="flex flex-wrap justify-center mt-3 sm:mt-5">
                            <Button
                                title={"craft for you"}
                                classes="bg-white text-[#171717] border-2 border-[#171717] shadow-md"
                            />
                        </div>
                    </div>
                </div>



                {/* Bottom Section */}
                <div className=" mt-6 p-5">

                    <p className=" font-[900]
            text-[18px]
            sm:text-[20px]
            lg:text-[24px]
            text-black mb-4
            uppercase
            Creato
            leading-[110%]
            tracking-[-0.02em]">Material Details :</p>
                    <p className="font-[400]
            text-[15px]
            sm:text-[16px]
            lg:text-[18px]
            text-black mb-4 mb-3">{project.
                            material_details
                        }</p>

                    <p className=" font-[900]
            text-[18px]
            sm:text-[20px]
            lg:text-[24px]
            text-black mb-4
            uppercase
            Creato
            leading-[110%]
            tracking-[-0.02em]">Timeline :</p>
                    <p className="font-[400]
            text-[15px]
            sm:text-[16px]
            lg:text-[18px]
            text-black mb-4 mb-3">{project?.timeline}</p>

                    <p className=" font-[900]
            text-[18px]
            sm:text-[20px]
            lg:text-[24px]
            text-black mb-4
            uppercase
            Creato
            leading-[110%]
            tracking-[-0.02em]">Design Cost :</p>
                    <p className="font-[400]
            text-[15px]
            sm:text-[16px]
            lg:text-[18px]
            text-black mb-4">{project?.cost}</p>
                </div>
            </div>
        </Layout>
    );
}
