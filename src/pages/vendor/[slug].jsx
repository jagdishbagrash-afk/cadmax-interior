import Layout from "../common/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Listing from "../api/Listing";
export default function Index() {
    const router = useRouter();
    const slug = router.query.slug;
    const [ProductDetail, setProductDetails] = useState([])
    const fetchData = async (slug) => {
        try {
            const main = new Listing();
            const response = await main.VendorCategoryList(slug);
            if (response.data?.data) {
                setProductDetails(response.data?.data);
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };
    useEffect(() => {
        if (slug) fetchData(slug);
    }, [slug]);

    return (
        <Layout>
            <div className="relative w-full h-[300px] sm:h-[360px] md:h-[420px] lg:h-[480px] overflow-hidden md:mt-[-80px]">

                <img
                    src={ProductDetail?.category?.Image}
                    alt="Slide"
                    className="object-cover w-full h-full"
                />

                <div className="absolute inset-0 bg-black/25"></div>

                {/* Overlay Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                    <div className="space-y-2">
                        {/* SUBTITLE (Optional, adds professional touch) */}
                        <span className="text-white/80 text-[10px] sm:text-[12px] uppercase tracking-[0.3em] font-medium">
                            Verified Professionals
                        </span>

                        <h1 className="
                font-[900]
                text-[24px] 
                sm:text-[36px] 
                lg:text-[48px] 
                text-white 
                uppercase 
                leading-tight 
                tracking-tighter
                drop-shadow-lg
            ">
                            {ProductDetail?.category?.name}
                        </h1>

                        {/* DECORATIVE LINE */}
                        <div className="w-16 h-1 bg-red-600 mx-auto mt-2"></div>
                    </div>
                </div>
            </div>
            <div className="bg-[#FFFFFF] py-4 md:py-8 ">
                <div className="container mx-auto px-4 max-w-[1430px]">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {ProductDetail?.vendors?.map((p, idx) => (
                            <div
                                key={p._id ?? idx}
                                className="flex flex-col sm:flex-row bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="w-full sm:w-1/2 p-4 flex flex-col items-center bg-gray-50 border-r border-gray-100 text-center">
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden border-2 border-white shadow-sm bg-gray-200">
                                        <img
                                            src={p.Image}
                                            alt={p.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="mt-3 text-center font-bold text-gray-800 uppercase text-sm tracking-wider">
                                        {p.name}
                                    </h3>
                                </div>

                                <div className="w-full sm:w-1/2 p-5 flex flex-col items-center justify-center text-center">
                                    <div className="space-y-3 flex flex-col items-center w-full">
                                        <div className="flex items-center justify-center w-full">
                                            <span className="text-[11px] font-bold text-gray-400 uppercase w-24 text-right mr-3">Experience:</span>
                                            <span className="text-sm text-gray-700 font-semibold w-24 text-left">{p.experience} Years</span>
                                        </div>

                                        <div className="flex items-center justify-center w-full">
                                            <span className="text-[11px] font-bold text-gray-400 uppercase w-24 text-right mr-3">Specialities:</span>
                                            <span className="text-sm text-gray-700 w-24 text-left truncate">{p.sepectailze || "General"}</span>
                                        </div>

                                        {/* STATUS BADGE CENTERED */}
                                        <div className="pt-1">
                                            <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${p.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                                                {p.isAvailable ? "Available" : "Busy"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ACTION BUTTONS CENTERED */}
                                    {/* <div className="flex flex-row gap-3 mt-6 w-full justify-center">
                                        <button className="px-4 py-2 border border-red-500 text-red-500 text-[11px] font-bold uppercase rounded hover:bg-red-50 transition-colors whitespace-nowrap">
                                            Work Photos
                                        </button>
                                        <button className="px-6 py-2 border border-red-500 text-red-500 text-[11px] font-bold uppercase rounded hover:bg-red-50 transition-colors whitespace-nowrap">
                                            Book
                                        </button>
                                    </div> */}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

        </Layout>
    );
}