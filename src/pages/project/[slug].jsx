"use client";

import Layout from "../common/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Listing from "../api/Listing";
import { MdArrowCircleLeft, MdArrowCircleRight, MdClose } from "react-icons/md";

export default function ProjectDetailPage() {
    const router = useRouter();
    const { slug } = router.query;

    const [project, setProject] = useState(null);
    console.log("project", project)
    const [loading, setLoading] = useState(true);

    const fetchData = async (slug) => {
        try {
            const main = new Listing();
            const response = await main.ProjectSlug(slug);
            console.log("response", response)
            if (response?.data?.data) {
                setProject(response.data.data);
            }
        } catch (error) {
            console.log("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (slug) fetchData(slug);
    }, [slug]);

    const [SelectedImage, setSelectedImage] = useState("")
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openModal = (index) => {
        setCurrentIndex(index);
        setIsOpen(true);
    };

    const closeModal = () => setIsOpen(false);

    const prevImage = () =>
        setCurrentIndex((prev) =>
            prev === 0 ? project.multiple_images.length - 1 : prev - 1
        );

    const nextImage = () =>
        setCurrentIndex((prev) =>
            prev === project.multiple_images.length - 1 ? 0 : prev + 1
        );
    return (
        <Layout>
            {/* ✅ LOADING STATE */}
            {loading ? (
                <div className="w-full h-[60vh] flex items-center justify-center">
                    <p className="text-gray-500 text-lg">Loading...</p>
                </div>
            ) : (
                <>
                    {/* ✅ HERO SECTION */}
                    <div className="relative w-full h-[260px] sm:h-[320px] md:h-[420px] lg:h-[520px] overflow-hidden md:mt-[-80px]">
                        <img
                            src={project?.Image || project?.multiple_images?.[0] || "/fallback.jpg"}
                            alt={project?.title}
                            className="object-cover w-full h-full"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/40"></div>

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                            <div className="space-y-3 max-w-[90%] sm:max-w-[700px]">
                                <h1
                                    className="
                  font-extrabold
                  text-[22px]
                  sm:text-[32px]
                  md:text-[42px]
                  lg:text-[52px]
                  text-white
                  uppercase
                  leading-tight
                  tracking-tight
                  drop-shadow-xl
                "
                                >
                                    {project?.title}
                                </h1>

                                <div className="w-16 h-[3px] bg-red-600 mx-auto"></div>
                                {/* Designed By */}
                                {/* {project?.designed && (
                                    <p className="text-white/80 text-sm sm:text-base tracking-wide">
                                        Designed by {project?.designed}
                                    </p>
                                )} */}
                            </div>
                        </div>
                    </div>

                    {/* ✅ CONTENT SECTION */}
                    <div className="w-[92%] max-w-[1200px] mx-auto py-10 sm:py-14">

                        {/* Brief */}
                        {project?.brief && (
                            <div className="mb-8">
                                <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                                    Project Brief
                                </h2>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                    {project?.brief}
                                </p>
                            </div>
                        )}

                        {/* Solution */}
                        {project?.solution && (
                            <div className="mb-8">
                                <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                                    Solution
                                </h2>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                    {project?.solution}
                                </p>
                            </div>
                        )}

                        {/* Extra Content */}
                        {project?.content && (
                            <div>
                                <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                                    Details
                                </h2>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                    {project?.content}
                                </p>
                            </div>
                        )}

                        {project?.multiple_images?.length > 1 && (

                            <div>
                                <h2 className="text-xl font-semibold mb-4">
                                    Project Gallery
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 mb-3">
                                    {project?.multiple_images?.map((img, i) => (
                                        <div
                                            key={i}
                                            className="w-full h-[250px] md:h-[300px] overflow-hidden rounded-xl"
                                        >
                                            <img
                                                src={img}
                                                alt={`vendor-${i}`}
                                                onClick={() => openModal(i)}
                                                className="w-full h-full object-cover hover:scale-105 transition duration-300 cursor-pointer"
                                            />
                                        </div>
                                    ))}
                                </div>



                            </div>
                        )}

                    </div>
                </>
            )}

            {isOpen && (
                <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4">

                    {/* Close */}
                    <button
                        onClick={closeModal}
                        className="absolute top-5 right-5 text-white text-4xl"
                    >
                        <MdClose />
                    </button>

                    {/* Prev */}
                    <button
                        onClick={prevImage}
                        className="absolute left-5 text-white text-5xl top-1/2 -translate-y-1/2"
                    >
                        <MdArrowCircleLeft />
                    </button>

                    {/* Image */}
                    <img
                        src={project?.multiple_images[currentIndex]}
                        className="max-w-full max-h-[90vh] object-contain rounded-lg"
                    />

                    {/* Next */}
                    <button
                        onClick={nextImage}
                        className="absolute right-5 text-white text-5xl top-1/2 -translate-y-1/2"
                    >
                        <MdArrowCircleRight />
                    </button>

                </div>
            )}
        </Layout>
    );
}