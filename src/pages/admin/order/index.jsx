"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "../common/AdminLayout";
import Listing from "@/pages/api/Listing";
import OrderDetail from "./OrderDetail";
import toast from "react-hot-toast";

export default function Index() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [statusMap, setStatusMap] = useState({});

  // ✅ Fetch Orders
  const fetchData = async () => {
    try {
      const main = new Listing();
      const response = await main.adminGetOrders();

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

  // ✅ Status Change (Instant UI + API)
  const handleChange = (id, value) => {
    setStatusMap((prev) => ({ ...prev, [id]: value }));
    handleStatusChange(id, value);
  };

  const handleStatusChange = async (id, value) => {
    try {
      const main = new Listing();
      const response = await main.updateOrderStatus(id, { status: value });

      if (response.data?.status) {
        toast.success(response?.data?.message);
        fetchData();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log("Error:", error);
      toast.error(error?.response?.data?.message || "Error");
    }
  };

  // 🔍 Search
  useEffect(() => {
    const result = data.filter((order) =>
      order?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order?.mobile?.toLowerCase().includes(search.toLowerCase()) ||
      order?.address?.toLowerCase().includes(search.toLowerCase()) ||
      order?.status?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(result);
  }, [search, data]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AdminLayout page="Order management">
      <div className="px-4 py-2">
        <div className="bg-white rounded-[20px] p-2">

          {/* Header */}
          <div className="px-4 py-3 flex justify-between items-center border-b">
            <h2 className="text-[18px] font-medium">Orders List</h2>

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-4 py-2 rounded-lg text-sm"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-center">
                    Order Id
                  </th>

                  <th className="px-6 py-4 text-center">Customer</th>
                  <th className="px-6 py-4 text-center">Price</th>
                  <th className="px-6 py-4 text-center">Mobile</th>
                  <th className="px-6 py-4 text-center">Address</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Details</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((order) => {
                  // ✅ FIX: Har row ka alag status
                  const currentStatus =
                    statusMap[order._id] || order.status || "pending";

                  return (
                    <tr key={order._id} className="hover:bg-gray-50">

                      <td className="px-6 py-4 text-center">
                        {order.orderId}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {order.name}
                      </td>

                      <td className="px-6 py-4 text-center">
                        ₹{order.amount}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {order.mobile}
                      </td>

                      <td className="px-6 py-4 text-left truncate max-w-[200px]">
                        {order.address}
                      </td>

                      {/* ✅ STATUS */}
                      <td className="px-6 py-4 text-center">
                        <select
                          value={currentStatus}
                          onChange={(e) =>
                            handleChange(order._id, e.target.value)
                          }
                          className={`
                            px-3 py-1 text-xs font-semibold rounded-full border uppercase
                            ${currentStatus === "pending" && "bg-yellow-100 text-yellow-700"}
                            ${currentStatus === "confirmed" && "bg-blue-100 text-blue-700"}
                            ${currentStatus === "shipped" && "bg-purple-100 text-purple-700"}
                            ${currentStatus === "delivered" && "bg-green-100 text-green-700"}
                            ${currentStatus === "cancelled" && "bg-red-100 text-red-700"}
                          `}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <OrderDetail data={order.product} />
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}