"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../common/AdminLayout";
import Listing from "@/pages/api/Listing";

export default function Index() {
    const [data, setData] = useState([]);
    console.log("data" ,data)
    const fetchData = async () => {
        try {
            const main = new Listing();
            const response = await main.GetPayment();
            if (response.data) {
                setData(response.data.Payment);
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <AdminLayout page={"Payment List"}>
            <div className="px-4 py-2 lg:px-4 lg:py-2.5">
                <div className="bg-white rounded-[20px] mb-[10px] p-2">
                    <div className="px-4 py-3 flex flex-wrap justify-between items-center border-b border-black/10">
                        <h2 className="Creato text-[16px] lg:text-[18px] font-normal leading-[120%] tracking-[-0.03em] text-[#1E1E1E]">
                            Payment  Listing
                        </h2>
                    </div>
                    {/* Table */}
                    <div className="overflow-x-auto rounded-xl border border-gray-200 mt-4">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600 uppercase">Order ID</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600 uppercase">Name / Email</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600 uppercase">Phone</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600 uppercase">Products</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600 uppercase">Amount</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600 uppercase">Status</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600 uppercase">Payment ID</th>
                                    <th className="px-4 py-3 text-[14px] font-semibold text-gray-600 uppercase">Date</th>
                                </tr>
                            </thead>


                            <tbody className="bg-white divide-y divide-gray-100">
                                {data.length > 0 ? (
                                    data.map((item) => (
                                        <tr key={item._id} className="hover:bg-gray-50">

                                            {/* Order ID */}
                                            <td className="px-4 py-3 text-center">
                                                {item.OrderID?.orderId}
                                            </td>

                                            {/* Customer Name + Email */}
                                            <td className="px-4 py-3 text-center">
                                                {item.user_id?.name} <br />
                                                {item.user_id?.email}
                                            </td>

                                            {/* Phone */}
                                            <td className="px-4 py-3 text-center">
                                                {item.user_id?.phone}
                                            </td>

                                            {/* Product Details */}
                                            <td className="px-4 py-3 text-center">
                                                {item.OrderID?.product?.map((p, i) => (
                                                    <div key={i}>
                                                        {p.variant} × {p.quantity} (₹{p.price})
                                                    </div>
                                                ))}
                                            </td>

                                            {/* Amount */}
                                            <td className="px-4 py-3 text-center font-semibold">
                                                ₹{item.amount}
                                            </td>

                                            {/* Payment Status */}
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-1 rounded-full text-white text-xs 
            ${item.status === "success" ? "bg-green-500" : "bg-red-500"}`}>
                                                    {item.status}
                                                </span>
                                            </td>

                                            {/* Payment ID */}
                                            <td className="px-4 py-3 text-center">
                                                {item.payment_id}
                                            </td>

                                            {/* Date */}
                                            <td className="px-4 py-3 text-center">
                                                {new Date(item.payment_date).toLocaleString()}
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                                            No Payment Found
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
