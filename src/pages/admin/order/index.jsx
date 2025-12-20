import React, { useEffect, useState } from 'react'
import AdminLayout from '../common/AdminLayout'
import Listing from '@/pages/api/Listing';
import { MdInfoOutline } from "react-icons/md";
import OrderDetail from './OrderDetail';
import toast from 'react-hot-toast';

export default function Index() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const main = new Listing();
      const response = await main.adminGetOrders();
      if (response.data?.data) {
        setData(response.data.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.log("Error:", error);
      setData([]);
    }
  };

  const handleStatusChange = async (id, value) => {
    try {
      const main = new Listing();
      const response = await main.updateOrderStatus(id, { status: value });
      if (response.data?.status) {
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log("Error:", error);
      toast.error(error?.response?.data?.message || "An unknown error occured");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //   console.log("data", data);

  return (
    <AdminLayout page="Order management">
      <div className="px-4 py-2 lg:px-4 lg:py-2.5">
        <div className="bg-white rounded-[20px] mb-[10px] p-2">
          {/* Header */}

          <div className="px-4 py-3 flex flex-wrap justify-between items-center border-b border-black/10">

            <h2 className="Creato text-[16px] lg:text-[18px] font-normal leading-[120%] tracking-[-0.03em] text-[#1E1E1E]">
              Orders List
            </h2>

          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm mt-4">
            <table className="min-w-full divide-y divide-gray-200 whitespace-nowrap">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase text-center">
                    Customer Name
                  </th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase text-center">
                    Price
                  </th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase text-center">
                    Mobile
                  </th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase text-center">
                    Address
                  </th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase text-center">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase text-center">
                    Details
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {data && data?.length > 0 ? (
                  data?.map((order) => (
                    <tr
                      key={order?._id}
                      className="transition hover:bg-gray-50"
                    >
                      {/* Customer Name */}
                      <td className="px-6 py-4 text-center text-[15px] font-medium text-gray-800 capitalize">
                        {order?.name}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-center text-[15px] text-gray-700 font-semibold">
                        ₹{order?.amount}
                      </td>

                      {/* Mobile */}
                      <td className="px-6 py-4 text-center text-[14px] text-gray-700">
                        {order?.mobile}
                      </td>

                      {/* Address */}
                      <td className="px-6 py-4 text-left text-[14px] text-gray-600 max-w-[280px] truncate">
                        {order?.address}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center">
                        <select
                          value={order?.status || "pending"}
                          onChange={(e) => handleStatusChange(order?._id, e.target.value)}
                          className={`
                            px-3 py-1 text-[13px] font-semibold rounded-full border outline-none cursor-pointer
                            ${order?.status === "pending" && "bg-yellow-100 text-yellow-700 border-yellow-200"}
                            ${order?.status === "confirmed" && "bg-blue-100 text-blue-700 border-blue-200"}
                            ${order?.status === "shipped" && "bg-purple-100 text-purple-700 border-purple-200"}
                            ${order?.status === "delivered" && "bg-green-100 text-green-700 border-green-200"}
                            ${order?.status === "cancelled" && "bg-red-100 text-red-700 border-red-200"}
                          `}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      {/* Details */}
                      <td className="px-6 py-4">
                        <OrderDetail data={order?.product} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500 text-[15px]"
                    >
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
  )
}