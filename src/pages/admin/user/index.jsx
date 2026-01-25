"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../common/AdminLayout";
import Listing from "@/pages/api/Listing";
import Image from "next/image";
import BlockUnblock from "../common/BlockUnblock";

export default function Index() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const main = new Listing();
            const response = await main.GetUser();
            if (response?.data?.data) {
                setData(response.data.data);
            }
        } catch (error) {
            console.log("Error:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <AdminLayout page={"User Listing"}>

            {/* CARD */}
            <div className="px-4 py-2 lg:px-4 lg:py-2.5">
                <div className="bg-white rounded-[20px] mb-[10px] p-2">
                    <div className="px-4 py-3 flex flex-wrap justify-between items-center border-b border-black/10">
                        <h2 className="uppercase Creato text-[16px] lg:text-[18px] font-normal leading-[120%] tracking-[-0.03em] text-[#1E1E1E]">
                            user  Listing
                        </h2>
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
                                {!loading && data.length > 0 && data.map((item, index) => (
                                    <tr key={item._id} className="hover:bg-gray-50 transition">

                                        {/* SR */}
                                        <td className="px-4 py-3 text-[14px] font-semibold text-black ">
                                            {index + 1}
                                        </td>

                                        {/* PROFILE */}
                                        <td className="px-4 py-3 text-[14px] font-semibold text-black ">
                                            <img
                                                src={item.profileImage || "/avatar.png"}
                                                alt="profile"
                                                width={38}
                                                height={38}
                                                className="rounded-full object-cover border"
                                            />
                                        </td>

                                        {/* NAME */}
                                        <td className="px-4 py-3 text-[14px] font-semibold text-black ">
                                            {item.name}
                                        </td>

                                        {/* PHONE */}
                                        <td className="px-4 py-3 text-[14px] font-semibold text-black ">
                                            {item.phone}<br/>
                                               {item.email || "--"}
                                        </td>

                                        {/* GENDER */}
                                        <td className="uppercase px-4 py-3 text-[14px] font-semibold text-black ">
                                            {item.gender || "N/A"}
                                        </td>


                                        {/* STATUS */}
                                        <td className="px-4 py-3 text-[14px] font-semibold text-black ">
                                            <span className={`uppercase px-3 py-1 rounded-full text-xs font-semibold
                                           ${item.status === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-600"}`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>

                                        {/* DATE */}

                                        <td className="px-4 py-3 text-[14px] font-semibold text-black ">

                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </td>

                                        <td>
                                            <BlockUnblock
                                                Id={item._id}
                                                fetchData={fetchData}
                                                step={6}
                                                status={item?.deleted_at ? true : false}
                                            />
                                        </td>

                                    </tr>
                                ))}

                                {/* EMPTY */}
                                {!loading && data.length === 0 && (
                                    <tr>
                                        <td colSpan="9" className="text-center py-12 text-gray-500">
                                            No users found.
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
