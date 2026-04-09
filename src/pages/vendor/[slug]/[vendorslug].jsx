"use client";

import DynamicCTA from "@/components/DynamicCTA";
import Listing from "@/pages/api/Listing";
import Layout from "@/pages/common/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
export default function VendorDetailPage() {
    const router = useRouter();
    const { vendorslug, slug } = router.query;

    const [vendor, setVendor] = useState(null);

    console.log("vendor", vendor)
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
                        <div className="bg-white rounded-2xl shadow-lg p-6 h-fit md:sticky top-24">

                            {/* PROFILE */}
                            <div className="flex flex-col items-center text-center">
                                <img
                                    src={vendor?.Image}
                                    className="w-[110px] h-[110px] rounded-full object-cover border-4 border-white shadow-md"
                                />

                                <h2 className="mt-4 text-lg font-semibold ">
                                    {vendor?.name}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    {vendor?.VendorCategory?.name}
                                </p>
                            </div>

                            {/* TAGS */}
                            <div className="mt-5 flex flex-wrap gap-2 justify-center">
                                <span className="px-3 py-1 bg-gray-100 text-sm rounded-full">
                                    {vendor?.experience}
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-sm rounded-full">
                                    {vendor?.specialization}
                                </span>
                            </div>

                            {/* CTA */}
                            <div className="mt-6">
                                <DynamicCTA
                                    cta={{
                                        text: "Hire Now",
                                        redirect: "/login",
                                        redirectAfterLogin: `/design/details/${slug}/${vendorslug}`,
                                        autoSubmit: true,
                                        type: "vendors",
                                    }}
                                    record={vendor}
                                />
                            </div>
                        </div>

                        {/* ================= RIGHT SIDE CONTENT ================= */}
                        <div className="space-y-10">

                            {/* 🔥 TITLE */}
                            <div>
                                <h1 className="text-2xl md:text-4xl text-[#ffffff] font-bold leading-tight">
                                    {vendor?.name}
                                </h1>
                                <p className="text-[#ffffff] mt-2">
                                    Professional {vendor?.specialization} services
                                </p>
                            </div>

                            {/* 🔥 STATS */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="bg-white p-5 rounded-xl shadow-sm">
                                    <p className="text-gray-400 text-sm">Experience</p>
                                    <p className="font-semibold text-lg">
                                        {vendor?.experience}
                                    </p>
                                </div>

                                <div className="bg-white p-5 rounded-xl shadow-sm">
                                    <p className="text-gray-400 text-sm">Specialization</p>
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
                                <div className="bg-white p-6 rounded-xl shadow-sm">
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

                                <div className="columns-2 md:columns-3 gap-4 space-y-4">
                                    {vendor?.multiple_images?.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img}
                                            className="w-full rounded-xl hover:scale-[1.03] transition duration-300 cursor-pointer"
                                        />
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* 🔥 MOBILE STICKY CTA */}
                    <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] md:hidden">
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
                    </div>

                </div>
            )}
        </Layout>
    );
}