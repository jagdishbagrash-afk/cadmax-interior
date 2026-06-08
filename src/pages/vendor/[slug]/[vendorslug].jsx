"use client";

import DynamicCTA from "@/components/DynamicCTA";
import Listing from "@/pages/api/Listing";
import Layout from "@/pages/common/Layout";
import MultipleImages from "@/pages/design/details/MultipleImages";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MdArrowCircleLeft, MdArrowCircleRight, MdClose } from "react-icons/md";
export default function VendorDetailPage() {
    const router = useRouter();
    const { vendorslug, slug } = router.query;

    const [vendor, setVendor] = useState(null);

    const [loading, setLoading] = useState(true);

    const fetchData = async (vendorslug) => {
        try {
            const main = new Listing();
            const response = await main.VendorSlug(vendorslug);
            if (response?.data?.data) {
                setVendor(response.data.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (vendorslug) fetchData(vendorslug);
    }, [vendorslug]);

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
            prev === 0 ? vendor.multiple_images.length - 1 : prev - 1
        );

    const nextImage = () =>
        setCurrentIndex((prev) =>
            prev === vendor.multiple_images.length - 1 ? 0 : prev + 1
        );

    return (
        <Layout>
            {loading ? (
                <div className="h-[60vh] flex items-center justify-center text-gray-500">
                    Loading Vendor...
                </div>
            ) : (
                <div className="bg-[#fafafa]">

                    {/* 🔥 TOP BANNER */}
                    <div className="h-[200px] md:h-[280px] w-full relative">
                        <img
                            src={vendor?.VendorCategory?.Image}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                    </div>

                    {/* 🔥 MAIN LAYOUT */}
                    <div className="max-w-[1200px] mx-auto px-4 md:px-6 -mt-20 relative z-10 grid md:grid-cols-[320px_1fr] gap-8">

                        {/* ================= LEFT SIDE (STICKY PROFILE) ================= */}
                        <div className="bg-white rounded-2xl shadow-lg p-2 md:p-6 h-fit md:sticky top-24">

                            {/* PROFILE */}
                            <div className="flex flex-col items-center text-center">
                                <img
                                    src={vendor?.Image}
                                    className="w-[110px] h-[110px] rounded-full object-cover border-4 border-white shadow-md"
                                />

                                <h2 className="mt-4 text-lg font-semibold capitalize ">
                                    {vendor?.name}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    {vendor?.VendorCategory?.name}
                                </p>
                            </div>

                            {/* TAGS */}
                            <div className="mt-5 flex flex-wrap gap-2 justify-center">
                                <span className="px-3 py-1 bg-gray-100 text-sm rounded-full">
                                    Experience  :    {vendor?.experience}
                                </span>
                                {/* <span className="px-3 py-1 bg-gray-100 text-sm rounded-full">
                                    {vendor?.specialization}
                                </span> */}
                            </div>

                            {/* CTA */}
                            <div className="mt-6 flex justify-center items-center text-center cursor-pointer">
                                <DynamicCTA
                                    cta={{
                                        text: "Hire Now",
                                        redirect: "/login",
                                        redirectAfterLogin: `/vendor/${slug}/${vendorslug}`,
                                        autoSubmit: true,
                                        type: "vendors",
                                    }}
                                    record={vendor}
                                />
                            </div>
                        </div>

                        {/* ================= RIGHT SIDE CONTENT ================= */}
                        <div className="space-y-10 p-2 md:p-6">

                            {/* 🔥 TITLE */}
                            <div>
                                <h1 className="text-2xl md:text-4xl capitalize  text-[#000000] md:text-[#ffffff] font-bold leading-tight">
                                    {vendor?.name}
                                </h1>
                                <p className="text-[#000000] md:text-[#ffffff]  mt-2">
                                    Professional {vendor?.specialization} services
                                </p>
                            </div>

                            {/* 🔥 STATS */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white p-2 md:p-6 rounded-xl shadow-sm">
                                    <p className="text-gray-400 text-sm">Experience</p>
                                    <p className="font-semibold text-lg">
                                        {vendor?.experience}
                                    </p>
                                </div>

                                <div className="bg-white p-5 rounded-xl shadow-sm">
                                    <p className="text-gray-400 text-sm"> Project Completed</p>
                                    <p className="font-semibold text-lg">
                                        {vendor?.specialization}
                                    </p>
                                </div>

                                <div className="bg-white p-5 rounded-xl shadow-sm">
                                    <p className="text-gray-400 text-sm">Category</p>
                                    <p className="font-semibold text-lg">
                                        {vendor?.VendorCategory?.name}
                                    </p>
                                </div>
                            </div>

                            {/* 🔥 DESCRIPTION */}
                            {vendor?.content && (
                                <div className="bg-white p-2 md:p-6 rounded-xl shadow-sm">
                                    <h2 className="text-xl font-semibold mb-3">
                                        About Vendor
                                    </h2>

                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                        {vendor?.content}
                                    </p>
                                </div>
                            )}

                            {/* 🔥 GALLERY (MASONRY STYLE FEEL) */}
                            <div>
                                <h2 className="text-xl font-semibold mb-4">
                                    Work Showcase
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 mb-3">
                                    {vendor?.multiple_images?.map((img, i) => (
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

                        </div>
                    </div>

                    {/* 🔥 MOBILE STICKY CTA */}
                    {/* <div className="fixed bottom-0 left-0 z-[999999] w-full bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] md:hidden">
                        <DynamicCTA
                            cta={{
                                text: "Hire This Vendor",
                                redirect: "/login",
                                redirectAfterLogin: `/design/details/${slug}/${vendorslug}`,
                                autoSubmit: true,
                                type: "vendors",
                            }}
                            record={vendor}
                        />
                    </div> */}



                </div>
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
                        src={vendor?.multiple_images[currentIndex]}
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