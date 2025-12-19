import React, { useEffect, useState } from 'react'
import AdminLayout from '../common/AdminLayout'
import Listing from '@/pages/api/Listing';
import { MdInfoOutline } from "react-icons/md";
import OrderDetail from './OrderDetail';

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
    
      useEffect(() => {
        fetchData();
      }, []);

    //   console.log("data", data);

  return (
    <AdminLayout page="Order management">
      <div className="min-h-screen p-5 lg:p-[30px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-extrabold uppercase text-[#171717]">
            Orders List
          </h2>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm mt-2">
            <table className="min-w-full divide-y divide-gray-200 whitespace-nowrap">
              <thead className="bg-gray-100">
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
                        <span className="px-3 py-1 text-[13px] font-semibold rounded-full bg-yellow-100 text-yellow-700">
                          Pending
                        </span>
                      </td>

                      {/* Details */}
                      <td className="px-6 py-4">
                        <OrderDetail data={order?.product}/>
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