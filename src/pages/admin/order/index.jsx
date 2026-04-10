"use client";
import React, { useEffect, useState } from 'react';
import AdminLayout from '../common/AdminLayout';
import Listing from '@/pages/api/Listing';
import OrderDetail from './OrderDetail';
import toast from 'react-hot-toast';

export default function Index() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

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

  const handleStatusChange = async (id, value) => {
    try {
      const main = new Listing();
      const response = await main.updateOrderStatus(id, { status: value });

      if (response.data?.status) {
        toast.success(response?.data?.message);
        fetchData(); // refresh after update
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log("Error:", error);
      toast.error(error?.response?.data?.message || "An unknown error occured");
    }
  };

  // 🔍 Search Logic
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
      <div className="px-4 py-2 lg:px-4 lg:py-2.5">
        <div className="bg-white rounded-[20px] mb-[10px] p-2">

          {/* Header */}
          <div className="px-4 py-3 flex flex-wrap justify-between items-center border-b border-black/10">
            <h2 className="text-[16px] lg:text-[18px] font-medium text-[#1E1E1E]">
              Orders List
            </h2>

            {/* 🔍 Search Input */}
            <input
              type="text"
              placeholder="Search by name, mobile, status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm mt-4">
            <table className="min-w-full divide-y divide-gray-200 whitespace-nowrap">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Customer</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Price</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Mobile</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Address</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Details</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {filteredData.length > 0 ? (
                  filteredData.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">

                      <td className="px-6 py-4 text-center font-medium capitalize">
                        {order.name}
                      </td>

                      <td className="px-6 py-4 text-center font-semibold text-gray-700">
                        ₹{order.amount}
                      </td>

                      <td className="px-6 py-4 text-center text-gray-700">
                        {order.mobile}
                      </td>

                      <td className="px-6 py-4 text-left text-gray-600 max-w-[250px] truncate">
                        {order.address}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <select
                          value={order.status || "pending"}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className={`
                            px-3 py-1 text-xs font-semibold rounded-full border cursor-pointer
                            ${order.status === "pending" && "bg-yellow-100 text-yellow-700"}
                            ${order.status === "confirmed" && "bg-blue-100 text-blue-700"}
                            ${order.status === "shipped" && "bg-purple-100 text-purple-700"}
                            ${order.status === "delivered" && "bg-green-100 text-green-700"}
                            ${order.status === "cancelled" && "bg-red-100 text-red-700"}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No Orders Found
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