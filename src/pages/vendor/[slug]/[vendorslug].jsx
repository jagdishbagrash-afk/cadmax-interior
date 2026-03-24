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
                <>
                    {/* 🔥 HERO */}
                    <div className="relative h-[280px] md:h-[420px] w-full">
                        <img
                            src={vendor?.Image}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50" />

                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                            <h1 className="text-2xl md:text-5xl font-bold uppercase">
                                {vendor?.name}
                            </h1>

                            <p className="mt-2 text-sm md:text-lg">
                                {vendor?.specialization}
                            </p>
                        </div>
                    </div>

                    {/* 🔥 CONTENT */}
                    <div className="max-w-[1100px] mx-auto px-4 py-10 space-y-10">

                        {/* INFO */}
                        <div className="grid grid-cols-2  gap-4">

                            <div className="p-4 border rounded-xl">
                                <p className="text-gray-500 text-sm">Experience</p>
                                <p className="font-semibold">
                                    {vendor?.experience}
                                </p>
                            </div>

                            <div className="p-4 border rounded-xl">
                                <p className="text-gray-500 text-sm">Specialization</p>
                                <p className="font-semibold">
                                    {vendor?.specialization}
                                </p>
                            </div>

                            {/* <div className="p-4 border rounded-xl col-span-2 md:col-span-1">
                                <p className="text-gray-500 text-sm">Phone</p>
                                <p className="font-semibold">
                                    {vendor?.phone}
                                </p>
                            </div> */}

                        </div>

                        {/* 🔥 DESCRIPTION */}
                        {vendor?.content && (
                            <div>
                                <h2 className="text-xl font-semibold mb-3">
                                    About Vendor
                                </h2>

                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                    {vendor?.content}
                                </p>
                            </div>
                        )}



                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Work Gallery
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                                {vendor?.multiple_images?.map((img, i) => (
                                    <div key={i} className="overflow-hidden ">
                                        <img
                                            src={img}
                                            className="w-full h-full object-cover  transition"
                                        />
                                    </div>
                                ))}



                            </div>
                        </div>
                        <div className="flex gap-4 flex-col sm:flex-row justify-center items-center text-center">

                            <DynamicCTA
                                cta={{
                                    text: "Enquiry Now",
                                    redirect: "/login",
                                    redirectAfterLogin: `/design/details/${slug}/${vendorslug}`,
                                    autoSubmit: true,
                                    type : "vendors"
                                }}
                                record={vendor}
                            />


                        </div>
                    </div>
                </>
            )}
        </Layout>
    );
}