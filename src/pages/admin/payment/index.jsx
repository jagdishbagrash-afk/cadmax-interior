"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../common/AdminLayout";
import Listing from "@/pages/api/Listing";
import moment from "moment";

export default function Index() {

    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");

    // PAGINATION
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    /* FETCH DATA */
    const fetchData = async () => {
        try {
            const main = new Listing();

            const response = await main.GetPayment();

            if (response?.data?.Payment) {
                setData(response.data.Payment);
            } else {
                setData([]);
            }

        } catch (error) {
            console.log("Error:", error);
            setData([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    /* SEARCH FILTER */
    const filteredData = useMemo(() => {

        return data.filter((item) => {

            const query = search.toLowerCase();

            return (
                item?.user_id?.name
                    ?.toLowerCase()
                    ?.includes(query) ||

                item?.user_id?.email
                    ?.toLowerCase()
                    ?.includes(query) ||

                item?.user_id?.phone
                    ?.toString()
                    ?.includes(query) ||

                item?.OrderID?.orderId
                    ?.toLowerCase()
                    ?.includes(query) ||

                item?.payment_id
                    ?.toLowerCase()
                    ?.includes(query)
            );
        });

    }, [search, data]);

    /* PAGINATION */
    const totalPages = Math.ceil(
        filteredData.length / itemsPerPage
    );

    const paginatedData = useMemo(() => {

        const startIndex =
            (currentPage - 1) * itemsPerPage;

        return filteredData.slice(
            startIndex,
            startIndex + itemsPerPage
        );

    }, [filteredData, currentPage]);

    /* RESET PAGE ON SEARCH */
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    return (

        <AdminLayout page={"Payment List"}>

            <div className="px-4 py-3">

                <div
                    className="
                        bg-white
                        rounded-[24px]
                        border border-gray-200
                        shadow-sm
                        overflow-hidden
                    "
                >

                    {/* HEADER */}
                    <div
                        className="
                            px-5 py-5
                            border-b border-gray-200
                            flex flex-col lg:flex-row
                            lg:items-center
                            lg:justify-between
                            gap-4
                        "
                    >

                        <div>

                            <h2
                                className="
                                    text-[24px]
                                    font-bold
                                    text-black
                                "
                            >
                                Payment Listing
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Manage all payment transactions
                            </p>

                        </div>

                        {/* SEARCH */}
                        <input
                            type="text"
                            placeholder="Search name, email, order ID..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="
                                w-full lg:w-[320px]
                                h-[46px]
                                px-4
                                border border-gray-300
                                rounded-xl
                                text-sm
                                outline-none
                                focus:border-black
                                focus:ring-2
                                focus:ring-black/10
                            "
                        />

                    </div>

                    {/* TABLE */}
                    <div className="overflow-x-auto">

                        <table className="min-w-full">

                            {/* TABLE HEAD */}
                            <thead
                                className="
                                    bg-[#FAFAFA]
                                    border-b border-gray-200
                                "
                            >

                                <tr>

                                    {[
                                        "#",
                                        "Order ID",
                                        "Customer",
                                        "Phone",
                                        "Products",
                                        "Amount",
                                        "Status",
                                        "Payment ID",
                                        "Date",
                                    ].map((head) => (

                                        <th
                                            key={head}
                                            className="
                                                px-5 py-4
                                                text-center
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-wide
                                                text-gray-600
                                                whitespace-nowrap
                                            "
                                        >
                                            {head}
                                        </th>

                                    ))}

                                </tr>

                            </thead>

                            {/* TABLE BODY */}
                            <tbody>

                                {paginatedData?.length > 0 ? (

                                    paginatedData.map((item, index) => (

                                        <tr
                                            key={item?._id}
                                            className="
                                                border-b border-gray-100
                                                hover:bg-gray-50
                                                transition-all
                                            "
                                        >

                                            {/* SERIAL */}
                                            <td className="px-5 py-4 text-center font-semibold">
                                                {(currentPage - 1) * itemsPerPage + index + 1}
                                            </td>

                                            {/* ORDER ID */}
                                            <td className="px-5 py-4 text-center">

                                                <span
                                                    className="
                                                        font-semibold
                                                        text-black
                                                    "
                                                >
                                                    {item?.OrderID?.orderId || "N/A"}
                                                </span>

                                            </td>

                                            {/* CUSTOMER */}
                                            <td className="px-5 py-4 text-center">

                                                <div className="font-semibold text-black">
                                                    {item?.user_id?.name || "N/A"}
                                                </div>

                                                <div className="text-sm text-gray-500 mt-1">
                                                    {item?.user_id?.email || "N/A"}
                                                </div>

                                            </td>

                                            {/* PHONE */}
                                            <td className="px-5 py-4 text-center">

                                                {item?.user_id?.phone || "N/A"}

                                            </td>

                                            {/* PRODUCTS */}
                                            <td className="px-5 py-4 min-w-[260px]">

                                                <div className="space-y-2">

                                                    {item?.OrderID?.product?.length > 0 ? (

                                                        item?.OrderID?.product?.map((p, i) => (

                                                            <div
                                                                key={i}
                                                                className="
                                                                    bg-gray-50
                                                                    rounded-xl
                                                                    px-3 py-2
                                                                    text-sm
                                                                    border
                                                                "
                                                            >

                                                                <div className="font-medium">
                                                                    {p?.variant || "Variant"}
                                                                </div>

                                                                <div className="text-gray-500 mt-1">
                                                                    Qty: {p?.quantity} × ₹{p?.price}
                                                                </div>

                                                            </div>

                                                        ))

                                                    ) : (

                                                        <span className="text-gray-400">
                                                            No Products
                                                        </span>

                                                    )}

                                                </div>

                                            </td>

                                            {/* AMOUNT */}
                                            <td className="px-5 py-4 text-center">

                                                <span
                                                    className="
                                                        text-[15px]
                                                        font-bold
                                                        text-green-600
                                                    "
                                                >
                                                    ₹{item?.amount || 0}
                                                </span>

                                            </td>

                                            {/* STATUS */}
                                            <td className="px-5 py-4 text-center">

                                                <span
                                                    className={`
                                                        inline-flex
                                                        items-center
                                                        justify-center
                                                        px-4 py-2
                                                        rounded-full
                                                        text-xs
                                                        font-semibold
                                                        uppercase

                                                        ${item?.status === "success"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-600"
                                                        }
                                                    `}
                                                >
                                                    {item?.status}
                                                </span>

                                            </td>

                                            {/* PAYMENT ID */}
                                            <td className="px-5 py-4 text-center">

                                                <div
                                                    className="
                                                        text-sm
                                                        font-medium
                                                        text-gray-700
                                                        break-all
                                                    "
                                                >
                                                    {item?.payment_id || "N/A"}
                                                </div>

                                            </td>

                                            {/* DATE */}
                                            <td
                                                className="
                                                    px-5 py-4
                                                    text-center
                                                    whitespace-nowrap
                                                "
                                            >

                                                {item?.payment_date
                                                    ? moment(item.payment_date).format(
                                                        "DD MMM YYYY, hh:mm A"
                                                    )
                                                    : "N/A"}

                                            </td>

                                        </tr>

                                    ))

                                ) : (

                                    <tr>

                                        <td
                                            colSpan={9}
                                            className="
                                                text-center
                                                py-16
                                                text-gray-500
                                            "
                                        >
                                            No Payment Found
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                    {/* PAGINATION */}
                    {totalPages > 1 && (

                        <div
                            className="
                                flex flex-col md:flex-row
                                items-center
                                justify-between
                                gap-4
                                px-5 py-4
                                border-t border-gray-200
                            "
                        >

                            {/* INFO */}
                            <p className="text-sm text-gray-500">

                                Showing{" "}

                                <span className="font-semibold">
                                    {(currentPage - 1) * itemsPerPage + 1}
                                </span>

                                {" "}to{" "}

                                <span className="font-semibold">
                                    {Math.min(
                                        currentPage * itemsPerPage,
                                        filteredData.length
                                    )}
                                </span>

                                {" "}of{" "}

                                <span className="font-semibold">
                                    {filteredData.length}
                                </span>

                                {" "}payments

                            </p>

                            {/* BUTTONS */}
                            <div className="flex items-center gap-2">

                                {/* PREV */}
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() =>
                                        setCurrentPage((prev) => prev - 1)
                                    }
                                    className="
                                        px-4 py-2
                                        rounded-lg
                                        border
                                        text-sm
                                        font-medium
                                        hover:bg-gray-100
                                        disabled:opacity-50
                                    "
                                >
                                    Prev
                                </button>

                                {/* PAGE */}
                                {[...Array(totalPages)].map((_, index) => (

                                    <button
                                        key={index}
                                        onClick={() =>
                                            setCurrentPage(index + 1)
                                        }
                                        className={`
                                            w-10 h-10
                                            rounded-lg
                                            text-sm
                                            font-semibold
                                            transition-all

                                            ${currentPage === index + 1
                                                ? "bg-black text-white"
                                                : "border hover:bg-gray-100"
                                            }
                                        `}
                                    >
                                        {index + 1}
                                    </button>

                                ))}

                                {/* NEXT */}
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() =>
                                        setCurrentPage((prev) => prev + 1)
                                    }
                                    className="
                                        px-4 py-2
                                        rounded-lg
                                        border
                                        text-sm
                                        font-medium
                                        hover:bg-gray-100
                                        disabled:opacity-50
                                    "
                                >
                                    Next
                                </button>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </AdminLayout>
    );
}