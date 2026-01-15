"use client";
import { useEffect, useState } from "react";
import Listing from "@/pages/api/Listing";
import AdminLayout from "../../common/AdminLayout";
import Link from "next/link";

export default function Index() {
    const [data, setData] = useState([]);
    console.log("data" ,data)
    const fetchData = async () => {
        try {
            const main = new Listing();
            const response = await main.GetServicesContact();
            console.log("response", response)
            if (response.data?.data) {
                setData(response.data.data?.contactget);
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <AdminLayout page={"Craft for you"}>
            <div className="px-4 py-2 lg:px-4 lg:py-2.5">
                <div className="bg-white rounded-[20px] mb-[10px] p-2">
                    <div className="px-4 py-3 flex flex-wrap justify-between items-center border-b border-black/10">
                        <h2 className="Creato uppercase text-[16px] lg:text-[18px] font-normal leading-[120%] tracking-[-0.03em] text-[#1E1E1E]">
                            Craft for you
                        </h2>

                        <Link href="/admin/services/services" className="Creato text-[16px] lg:text-[18px] font-normal leading-[120%] tracking-[-0.03em] text-[#ffffff] bg-black rounded-full p-2">
                          Concept Listing
                        </Link>
                    </div>
                    {/* Table */}
                    <div className="overflow-x-auto rounded-xl border border-gray-200 mt-4">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600 uppercase">Name</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600 uppercase">Phone</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600 uppercase">Email</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600 uppercase">Concept</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600 uppercase">Service Type </th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600 uppercase">Service Model</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {data.length > 0 ? (
                                    data.map((item) => (
                                        <tr key={item._id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-center">{item.User.name}</td>
                                            <td className="px-4 py-3 text-center">{item.User.phone}</td>
                                            <td className="px-4 py-3 text-center">{item.User.email}</td>
                                            <td className="px-4 py-3 text-center">{item.concept}</td>
                                            <td className="px-4 py-3 text-center">{item.ServicesType.title}</td>
                                            <td className="px-4 py-3 text-center">{item.Services.title}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={14} className="px-6 py-10 text-center text-gray-500 text-[15px]">
                                            No Booking Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
