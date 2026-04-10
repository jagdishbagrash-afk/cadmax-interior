"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../common/AdminLayout";
import Listing from "@/pages/api/Listing";

export default function Index() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");

    const fetchData = async () => {
        try {
            const main = new Listing();
            const response = await main.GetBooking();
            if (response.data?.data) {
                setData(response.data.data);
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ✅ Multi-field Search
    const filteredData = data.filter((item) => {
        const query = search.toLowerCase();

        return (
            item?.name?.toLowerCase().includes(query) ||
            item?.email?.toLowerCase().includes(query) ||
            item?.phone_number?.toString().includes(query) ||
            item?.city?.toLowerCase().includes(query) ||
            item?.project_type?.toLowerCase().includes(query) ||
            item?.servcies_model?.toLowerCase().includes(query)
        );
    });

    return (
        <AdminLayout page={"Booking List"}>
            <div className="px-4 py-2 lg:px-4 lg:py-2.5">
                <div className="bg-white rounded-[20px] mb-[10px] p-2">

                    {/* Header */}
                    <div className="px-4 py-3 flex flex-wrap justify-between items-center gap-3 border-b border-black/10">
                        <h2 className="Creato text-[16px] lg:text-[18px] text-[#1E1E1E]">
                            Booking Listing
                        </h2>

                        {/* 🔍 Search */}
                        <input
                            type="text"
                            placeholder="Search name, email, city..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full md:w-[280px] px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-xl border border-gray-200 mt-4">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600">Project Type</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600">Service Model</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600">Area</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600">Budget</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600">Name / Email</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600">Phone</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600">City</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600">Rate</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600">Subtotal</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600">Taxes</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600">Total</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-100">
                                {filteredData.length > 0 ? (
                                    filteredData.map((item) => (
                                        <tr key={item._id} className="hover:bg-gray-50">

                                            <td className="px-4 py-3 text-center">{item.project_type}</td>
                                            <td className="px-4 py-3 text-center">{item.servcies_model}</td>
                                            <td className="px-4 py-3 text-center">{item.area}</td>
                                            <td className="px-4 py-3 text-center">{item.budget_range}</td>

                                            <td className="px-4 py-3 text-center">
                                                {item.name} <br /> {item.email}
                                            </td>

                                            <td className="px-4 py-3 text-center">{item.phone_number}</td>
                                            <td className="px-4 py-3 text-center">{item.city}</td>

                                            <td className="px-4 py-3 text-center">₹{item.rate}</td>
                                            <td className="px-4 py-3 text-center">₹{item.subtotal}</td>
                                            <td className="px-4 py-3 text-center">₹{item.taxes}</td>

                                            <td className="px-4 py-3 text-center font-semibold text-green-600">
                                                ₹{item.total_amount}
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={11} className="px-6 py-10 text-center text-gray-500">
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