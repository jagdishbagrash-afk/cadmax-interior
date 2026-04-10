"use client";
import { useEffect, useState } from "react";
import Listing from "@/pages/api/Listing";
import AdminLayout from "./common/AdminLayout";

export default function Index() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    const fetchData = async () => {
        try {
            const main = new Listing();
            const response = await main.Leadget();

            if (response.data?.data) {
                setData(response.data.data);
                setFilteredData(response.data.data);
            } else {
                setData([]);
                setFilteredData([]);
            }
        } catch (error) {
            console.log("Error:", error);
            setData([]);
            setFilteredData([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 🔍 Search Logic
    useEffect(() => {
        const result = data.filter((item) =>
            item?.name?.toLowerCase().includes(search.toLowerCase()) ||
            item?.phone?.toLowerCase().includes(search.toLowerCase()) ||
            item?.pageurl?.toLowerCase().includes(search.toLowerCase()) ||
            item?.source?.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredData(result);
    }, [search, data]);

    return (
        <AdminLayout page={"Lead List"}>
            <div className="px-4 py-2 lg:px-4 lg:py-2.5">
                <div className="bg-white rounded-[20px] mb-[10px] p-2">

                    {/* Header */}
                    <div className="px-4 py-3 flex flex-wrap justify-between items-center border-b border-black/10">
                        <h2 className="text-[16px] lg:text-[18px] font-medium text-[#1E1E1E]">
                            Lead Listing
                        </h2>

                        {/* 🔍 Search Input */}
                        <input
                            type="text"
                            placeholder="Search name, phone, source..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-xl border border-gray-200 mt-4">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">Name</th>
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">Phone</th>
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">Page Url</th>
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">Source</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-100">
                                {filteredData.length > 0 ? (
                                    filteredData.map((item) => (
                                        <tr key={item._id} className="hover:bg-gray-50">

                                            <td className="px-4 py-3 text-center">
                                                {item.name}
                                            </td>

                                            <td className="px-4 py-3 text-center">
                                                {item.phone}
                                            </td>

                                            <td className="px-4 py-3 text-center max-w-[250px] truncate">
                                                {item.pageurl}
                                            </td>

                                            <td className="px-4 py-3 text-center">
                                                {item.source}
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-gray-500 text-sm">
                                            No Leads Found
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