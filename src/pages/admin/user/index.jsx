"use client";
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../common/AdminLayout";
import Listing from "@/pages/api/Listing";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import BlockUnblock from "../common/BlockUnblock";

export default function Index() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // PAGINATION
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const fetchData = async () => {
        try {
            const main = new Listing();
            const response = await main.GetUser();
            if (response?.data?.data) {
                setData(response.data.data);
                setFilteredData(response.data.data); // initial
            }
        } catch (error) {
            console.log("Error:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 🔍 SEARCH FILTER
    useEffect(() => {
        const result = data.filter((item) =>
            item.name?.toLowerCase().includes(search.toLowerCase()) ||
            item.phone?.toString().includes(search) ||   // ✅ FIX
            item.email?.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredData(result);
        setCurrentPage(1);
    }, [search, data]);

    // PAGINATION LOGIC
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <AdminLayout page={"User Listing"}>

            <div className="px-4 py-2 lg:px-4 lg:py-2.5">
                <div className="bg-white rounded-[20px] mb-[10px] p-2">

                    {/* HEADER + SEARCH */}
                    <div className="px-4 py-3 flex flex-wrap justify-between items-center border-b border-black/10 gap-3">
                        <h2 className="uppercase text-[16px] lg:text-[18px] font-normal text-[#1E1E1E]">
                            User Listing
                        </h2>

                        {/* 🔍 SEARCH INPUT */}
                        <input
                            type="text"
                            placeholder="Search name, phone, email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full md:w-[250px] focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* TABLE */}
                    <div className="overflow-x-auto rounded-xl border border-gray-200 mt-4">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0 z-10 text-center">
                                <tr>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600 uppercase">#</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600 uppercase">Profile</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600 uppercase">Name</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600 uppercase">Phone & Email</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600 uppercase">Gender</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600 uppercase">Status</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600 uppercase">Created</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600 uppercase">Action</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-100 text-center">

                                {/* LOADING */}
                                {loading && (
                                    <tr>
                                        <td colSpan="9" className="text-center py-10 text-gray-500">
                                            Loading users...
                                        </td>
                                    </tr>
                                )}

                                {/* DATA */}
                                {!loading && paginatedData.length > 0 && paginatedData.map((item, index) => (
                                    <tr key={item._id} className="hover:bg-gray-50 transition">

                                        <td className="px-4 py-3 font-semibold">{startIndex + index + 1}</td>

                                        <td className="px-4 py-3">
                                            <img
                                                src={item.profileImage || "/avatar.jpg"}
                                                alt="profile"
                                                className="w-10 h-10 rounded-full object-cover border mx-auto"
                                            />
                                        </td>

                                        <td className="px-4 py-3 font-semibold">{item.name}</td>

                                        <td className="px-4 py-3 font-semibold">
                                            {item.phone}<br />
                                            {item.email || "--"}
                                        </td>

                                        <td className="px-4 py-3 uppercase">
                                            {item.gender || "N/A"}
                                        </td>

                                        <td className="px-4 py-3">
                                            <span className={`uppercase px-3 py-1 rounded-full text-xs font-semibold
                                                ${item.status === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-600"}`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </td>

                                        <td>
                                            <div className="flex justify-center items-center gap-4">

                                                <Link href={`/admin/user/${item?._id}`} className="hover:text-blue-600">
                                                    <FaHome size={20} />
                                                </Link>

                                                <BlockUnblock
                                                    Id={item._id}
                                                    fetchData={fetchData}
                                                    step={6}
                                                    status={item?.deleted_at ? true : false}
                                                />
                                            </div>
                                        </td>

                                    </tr>
                                ))}

                                {/* EMPTY */}
                                {!loading && filteredData.length === 0 && (
                                    <tr>
                                        <td colSpan="9" className="text-center py-12 text-gray-500">
                                            No users found.
                                        </td>
                                    </tr>
                                )}

                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 mt-0">
                            <p className="text-sm text-gray-500">
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} users
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 rounded-lg border flex items-center justify-center disabled:opacity-50 hover:bg-gray-100"
                                >
                                    <MdChevronLeft size={20} />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, totalPages))
                                    .map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                                                currentPage === page
                                                    ? "bg-blue-600 text-white"
                                                    : "border hover:bg-gray-100"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-10 h-10 rounded-lg border flex items-center justify-center disabled:opacity-50 hover:bg-gray-100"
                                >
                                    <MdChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AdminLayout>
    );
}