"use client";

import Banner from "@/components/Banner";
import { useRole } from "@/context/RoleContext";
import Listing from "@/pages/api/Listing";
import Button from "@/pages/common/Button";
import Layout from "@/pages/common/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FcPrevious } from "react-icons/fc";
import { FcNext } from "react-icons/fc";

import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import MultipleImages from "./MultipleImages";

export default function DesignLayout() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const router = useRouter();
    const id = router?.query?.slug;
    const { user } = useRole();
    console.log("user", user)

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


    const [loading, setLoading] = useState(false)

    const [data, setData] = useState({
        TypeServices: "",
        User: "",
        Services: "",
        concept: "",
    });

    useEffect(() => {
        setData({
            User: user?._id || "692dcfbd4816433146e11abd" || "",
            TypeServices: project.ServicesType?._id || "",
            Services: project._id || "",
            concept: project?.concept || ""
        })
    }, [
        project
    ])
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const main = new Listing();
            const res = await main.AddServicesContact({
                TypeServices: data.TypeServices,
                Services: data.Services,
                concept: data.concept,
                User: data.User,
            });

            if (res?.data?.status) {
                toast.success(res?.data?.message);
            } else {
                toast.error(res?.data?.message || "Invalid OTP");
            }
            setLoading(false);
            setData({
                User: "",
                concept: "",
                TypeServices: "",
                Services: ""
            })
        } catch (error) {
            toast.error("Verification failed");
            setLoading(false);

        }
    };

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
                        <MultipleImages  project={project}/>


                        <div className="flex flex-wrap justify-center mt-3 sm:mt-5">
                            <button
                                disabled={loading}
                                onClick={handleSubmit}
                                className={`
        px-4 
        py-[6px]
        font-[700] 
        cursor-pointer 
        Creato 
        uppercase 
        md:px-[30px] 
        md:py-[10px] 
        text-[13px]
       bg-white text-[#171717] border-2 border-[#171717] shadow-md
      `}
                            >
                                {loading ? "Loading.." : " craft for you"}

                            </button>

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
