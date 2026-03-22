"use client";

import Layout from "../common/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Listing from "../api/Listing";

export default function ProjectDetailPage() {
    const router = useRouter();
    const { slug } = router.query;

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async (slug) => {
        try {
            const main = new Listing();
            const response = await main.ProjectSlug(slug);

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
                            src={project?.Image || "/fallback.jpg"}
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
                                {project?.designed && (
                                    <p className="text-white/80 text-sm sm:text-base tracking-wide">
                                        Designed by {project?.designed}
                                    </p>
                                )}
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

                    </div>
                </>
            )}
        </Layout>
    );
}