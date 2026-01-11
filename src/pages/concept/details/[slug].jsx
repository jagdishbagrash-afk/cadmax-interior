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


    useEffect(() => {
        if (user && project?._id && project?.ServicesType?._id) {
            setData({
                User: user?._id || "692dcfbd4816433146e11abd",
                TypeServices: project.ServicesType._id,
                Services: project._id,
                concept: project.concept || ""
            });
        }
    }, [user, project]);

    const handleSubmit = async (e) => {
        if (e?.preventDefault) e.preventDefault();

        if (loading) return;
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
                toast.error(res?.data?.message || "Something went wrong");
            }

            setData({
                User: "",
                concept: "",
                TypeServices: "",
                Services: ""
            });
        } catch (error) {
            toast.error("Verification failed");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (
            router.query.autoSubmit === "true" &&
            data.TypeServices &&
            data.Services &&
            data.User
        ) {
            handleSubmit();

            router.replace(
                `/concept/details/${id}`,
                undefined,
                { shallow: true }
            );
        }
    }, [router.query.autoSubmit, data]);


    console.log("proe", project)
    const [selectedImage, setSelectedImage] = useState("");

    useEffect(() => {
        if (project?.Image) {
            setSelectedImage(project.Image);
        }
    }, [project]);


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
            <div className="w-full min-h-screen bg-white p-4 md:p-10 font-sans">
                {/* Main Container */}
                <div className=" ">

                    {/* Top Section: Image and Brief */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

                        {/* Selected Photo Container */}
                        <div className="relative group overflow-hidden bg-gray-200 aspect-square lg:aspect-auto">

                            {selectedImage ? (
                                <img
                                    src={selectedImage}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <img
                                    src={project.Image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            )}

                        </div>

                        {/* Right Side Content */}
                        <div className="p-4 lg:p-8 flex flex-col justify-between bg-white">
                            <div>
                                <h3 className="font-[900] text-xl md:text-4xl text-gray-900 mb-6 uppercase tracking-tight leading-tight">
                                    {project.title}
                                </h3>
                                <div className="w-20 h-1 bg-black mb-6"></div>
                                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                    {project.content}
                                </p>

                                {/* Thumbnail Component */}
                                <div className="mb-8">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                                        {project?.multiple_images?.map((img, index) => (
                                            <div
                                                key={index}
                                                onClick={() => setSelectedImage(img)}
                                                className={`
      overflow-hidden rounded-lg cursor-pointer group
      border-2 ${selectedImage === img ? "border-black" : "border-transparent"}
    `}
                                            >
                                                <img
                                                    src={img}
                                                    alt={project?.title || "Project Image"}
                                                    className="w-full h-40 object-cover group-hover:scale-110 transition duration-300"
                                                />
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();

                                        if (!user) {
                                            toast.error("Please login first");
                                            router.push(
                                                `/login?redirect=/concept/details/${id}&autoSubmit=true`
                                            );
                                        } else {
                                            handleSubmit(e);
                                        }
                                    }}
                                    className="w-full sm:w-auto px-10 py-4 font-bold uppercase tracking-widest text-sm bg-black text-white hover:bg-gray-800 cursor-pointer"
                                >
                                    Craft for You
                                </button>


                            </div>

                        </div>
                    </div>

                    {/* Bottom Section: Technical Details */}
                    <div className="bg-gray-50 border-t border-gray-100 p-8 lg:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                            {/* Material Details */}
                            <div className="space-y-2">
                                <p className="font-black text-xs uppercase tracking-widest text-gray-400">Material Details</p>
                                <p className="text-gray-800 font-medium text-lg leading-snug">
                                    {project.material_details || "Premium Finish, LED Lights, Italian Marble"}
                                </p>
                            </div>

                            {/* Timeline */}
                            <div className="space-y-2 border-l-0 md:border-l md:pl-8 border-gray-200">
                                <p className="font-black text-xs uppercase tracking-widest text-gray-400">Timeline</p>
                                <p className="text-gray-800 font-medium text-lg">
                                    {project?.timeline || "25 Days"}
                                </p>
                            </div>

                            {/* Design Cost */}
                            <div className="space-y-2 border-l-0 md:border-l md:pl-8 border-gray-200">
                                <p className="font-black text-xs uppercase tracking-widest text-gray-400">Design Cost</p>
                                <p className="text-black font-bold text-2xl">
                                    {project?.cost || "₹ 1,20,000"}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
