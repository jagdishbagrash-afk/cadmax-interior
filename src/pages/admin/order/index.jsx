"use client";

import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../common/AdminLayout";
import Listing from "@/pages/api/Listing";
import OrderDetail from "./OrderDetail";
import toast from "react-hot-toast";
import moment from "moment";

export default function Index() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [statusMap, setStatusMap] = useState({});

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ Fetch Orders
  const fetchData = async () => {
    try {
      const main = new Listing();
      const response = await main.adminGetOrders();

      if (response?.data?.data) {
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

  // ✅ Status Change
  const handleChange = (id, value) => {
    setStatusMap((prev) => ({
      ...prev,
      [id]: value,
    }));

    handleStatusChange(id, value);
  };

  const handleStatusChange = async (id, value) => {
    try {
      const main = new Listing();

      const response = await main.updateOrderStatus(id, {
        status: value,
      });

      if (response?.data?.status) {
        toast.success(response?.data?.message);
        fetchData();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log("Error:", error);
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  // 🔍 SEARCH
  useEffect(() => {
    const result = data.filter((order) => {
      const query = search.toLowerCase();

      return (
        order?.name?.toLowerCase()?.includes(query) ||
        order?.mobile?.toLowerCase()?.includes(query) ||
        order?.address?.toLowerCase()?.includes(query) ||
        order?.status?.toLowerCase()?.includes(query) ||
        order?.orderId?.toLowerCase()?.includes(query)
      );
    });

    setFilteredData(result);
    setCurrentPage(1);
  }, [search, data]);

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ PAGINATION LOGIC
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

  return (
    <AdminLayout page="Order management">
      <div className="px-4 py-3">

        <div className="bg-white rounded-[24px] shadow-sm border border-gray-200 overflow-hidden">

          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 border-b">

            <div>
              <h2 className="text-[22px] font-bold text-black">
                Orders List
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Manage all customer orders
              </p>
            </div>

            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search order..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                w-full lg:w-[320px]
                h-[46px]
                border border-gray-300
                rounded-xl
                px-4
                text-sm
                outline-none
                focus:ring-2 focus:ring-black/10
                focus:border-black
              "
            />

          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">

            <table className="min-w-full">

              {/* TABLE HEAD */}
              <thead className="bg-[#FAFAFA] border-b border-gray-200">

                <tr>

                  {[
                    "#",
                    "Order ID",
                    "Customer",
                    "Price",
                    "Mobile",
                    "Address",
                    "Date",
                    "Status",
                    "Details",
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
                  paginatedData.map((order, index) => {

                    const currentStatus =
                      statusMap[order._id] ||
                      order.status ||
                      "pending";

                    return (
                      <tr
                        key={order._id}
                        className="
                          border-b border-gray-100
                          hover:bg-gray-50
                          transition-all
                        "
                      >

                        {/* SERIAL */}
                        <td className="px-5 py-4 text-center font-semibold text-gray-700">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>

                        {/* ORDER ID */}
                        <td className="px-5 py-4 text-center">
                          <span className="font-semibold text-black">
                            {order?.orderId || "N/A"}
                          </span>
                        </td>

                        {/* CUSTOMER */}
                        <td className="px-5 py-4 text-center">
                          <div className="font-semibold text-black">
                            {order?.name || "N/A"}
                          </div>
                        </td>

                        {/* PRICE */}
                        <td className="px-5 py-4 text-center">
                          <span className="font-bold text-green-600">
                            ₹{order?.amount || 0}
                          </span>
                        </td>

                        {/* MOBILE */}
                        <td className="px-5 py-4 text-center">
                          {order?.mobile || "N/A"}
                        </td>

                        {/* ADDRESS */}
                        <td className="px-5 py-4 max-w-[220px]">
                          <p className="line-clamp-2 text-sm text-gray-700">
                            {order?.address || "N/A"}
                          </p>
                        </td>

                        {/* DATE */}
                        <td className="px-5 py-4 text-center whitespace-nowrap">
                          {order?.createdAt
                            ? moment(order.createdAt).format(
                                "DD MMM YYYY"
                              )
                            : "N/A"}
                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-4 text-center">

                          <select
                            value={currentStatus}
                            onChange={(e) =>
                              handleChange(
                                order._id,
                                e.target.value
                              )
                            }
                            className={`
                              px-3 py-2
                              rounded-full
                              text-xs
                              font-semibold
                              border
                              outline-none
                              uppercase
                              cursor-pointer
                              transition-all

                              ${
                                currentStatus === "pending"
                                  ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                  : ""
                              }

                              ${
                                currentStatus === "confirmed"
                                  ? "bg-blue-100 text-blue-700 border-blue-200"
                                  : ""
                              }

                              ${
                                currentStatus === "shipped"
                                  ? "bg-purple-100 text-purple-700 border-purple-200"
                                  : ""
                              }

                              ${
                                currentStatus === "delivered"
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : ""
                              }

                              ${
                                currentStatus === "cancelled"
                                  ? "bg-red-100 text-red-700 border-red-200"
                                  : ""
                              }
                            `}
                          >
                            <option value="pending">
                              Pending
                            </option>

                            <option value="confirmed">
                              Confirmed
                            </option>

                            <option value="shipped">
                              Shipped
                            </option>

                            <option value="delivered">
                              Delivered
                            </option>

                            <option value="cancelled">
                              Cancelled
                            </option>
                          </select>

                        </td>

                        {/* DETAILS */}
                        <td className="px-5 py-4 text-center">
                          <OrderDetail
                            data={order?.product}
                          />
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>

                    <td
                      colSpan={9}
                      className="
                        text-center
                        py-14
                        text-gray-500
                        text-[15px]
                      "
                    >
                      No Orders Found
                    </td>

                  </tr>
                )}

              </tbody>

            </table>

          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (

            <div className="flex items-center justify-between px-5 py-4 border-t bg-white">

              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredData.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold">
                  {filteredData.length}
                </span>{" "}
                orders
              </p>

              <div className="flex items-center gap-2">

                {/* PREV */}
                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => prev - 1)
                  }
                  className="
                    px-4 py-2 rounded-lg border
                    text-sm font-medium
                    disabled:opacity-50
                    hover:bg-gray-100
                  "
                >
                  Prev
                </button>

                {/* PAGE NUMBERS */}
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      setCurrentPage(index + 1)
                    }
                    className={`
                      w-10 h-10 rounded-lg text-sm font-semibold
                      transition-all

                      ${
                        currentPage === index + 1
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
                    px-4 py-2 rounded-lg border
                    text-sm font-medium
                    disabled:opacity-50
                    hover:bg-gray-100
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