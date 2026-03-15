"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../common/AdminLayout";
import Listing from "@/pages/api/Listing";
import Image from "next/image";
import BlockUnblock from "../common/BlockUnblock";
import Link from "next/link";
import { IoMdEye } from "react-icons/io";
import { useRouter } from "next/router";

export default function Index() {

    const router = useRouter();
    const { slug } = router.query;   // 👈 slug destructure

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    console.log("data", data)

    const fetchData = async (id) => {
        try {
            const main = new Listing();
            const response = await main.AddressUser(id);

            if (response?.data?.data) {
                setData(response.data.data);
            }
        } catch (error) {
            console.log("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        if (router.isReady && slug) {   // 👈 important check
            fetchData(slug);
        }

    }, [router.isReady, slug]);

    return (
        <AdminLayout page={"USER Address Listing"}>

            <div className="px-4 py-2 lg:px-4 lg:py-2.5">
                <div className="bg-white rounded-[20px] mb-[10px] p-2">

                    <div className="px-4 py-3 flex justify-between  items-center border-b border-black/10">
                        <h2 className="uppercase text-[18px] text-[#1E1E1E]">
                          USER  Address Listing
                        </h2>
                    <Link href={"/admin/user"} className="uppercase text-[18px] text-[#1E1E1E]">
                    Back
                    </Link>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-gray-200 mt-4">

                        <table className="min-w-full divide-y divide-gray-200">

                            <thead className="bg-gray-50 text-center">
                                <tr>

                                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">#</th>
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">Address</th>
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">state</th>
                                
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">city</th>

                                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">pincode</th>

                                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">isDefault</th>

                                    <th className="px-4 py-3 text-sm font-semibold text-gray-600">Type</th>

                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-100 text-center">

                                {loading && (
                                    <tr>
                                        <td colSpan="9" className="py-10 text-gray-500">
                                            Loading Address...
                                        </td>
                                    </tr>
                                )}

                                {!loading && data.length > 0 && data.map((item, index) => {

                                    const user = item.userId || {};

                                    return (

                                        <tr key={item._id} className="hover:bg-gray-50">

                                            {/* SR */}
                                            <td className="px-4 py-3 font-semibold">
                                                {index + 1}
                                            </td>

                                            {/* PROFILE */}
                                            <td className="px-4 py-3">
                                              {item.street_address}
                                            </td>

                                            {/* NAME */}
                                            <td className="px-4 py-3 font-semibold">
                                               {item.state} 
                                            </td>

                                            {/* PHONE EMAIL */}
                                            <td className="px-4 py-3 text-sm">
                                               {item.city}
                                            </td>

                                            {/* ADDRESS */}
                                            <td className="px-4 py-3 text-sm">
                                              {item.pincode}
                                            </td>

                                                 <td className="px-4 py-3 text-sm font-medium">
                                                {item.isDefault === true  ? "True" : "False"}
                                            </td>

                                            {/* TYPE */}
                                            <td className="px-4 py-3 text-sm font-medium">
                                                {item.addressType}
                                            </td>

                                            {/* STATUS */}
                                       

                                  
                                       

                                        </tr>

                                    )

                                })}

                                {!loading && data.length === 0 && (
                                    <tr>
                                        <td colSpan="9" className="py-10 text-gray-500">
                                            No Address Found
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
