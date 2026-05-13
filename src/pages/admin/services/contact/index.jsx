"use client";
import { useEffect, useState } from "react";
import Listing from "@/pages/api/Listing";
import AdminLayout from "../../common/AdminLayout";
import Link from "next/link";

export default function Index() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const main = new Listing();
      const response = await main.GetServicesContact();
      if (response?.data?.data?.contactget) {
        setData(response.data.data.contactget);
      } else {
        setData([]);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AdminLayout page={"Craft for you"}>
      <div className="px-4 py-2 lg:px-4 lg:py-2.5">
        <div className="bg-white rounded-[20px] mb-[10px] p-2 shadow-sm">
          
          {/* Header */}
          <div className="px-4 py-3 flex flex-wrap justify-between items-center border-b border-black/10">
            <h2 className="Creato uppercase text-[16px] lg:text-[18px] font-medium text-[#1E1E1E]">
              Craft for you
            </h2>

            <Link
              href="/admin/services/services"
              className="Creato text-[14px] lg:text-[16px] text-white bg-black rounded-full px-4 py-2 hover:bg-gray-800 transition"
            >
              Concept Listing
            </Link>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              
              {/* Table Head */}
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">
                    Name
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">
                    Email
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">
                    Concept
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">
                    Service Type
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">
                    Service Model
                  </th>
                  {/* <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">
                    Timeline
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">
                    Cost
                  </th> */}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="bg-white divide-y divide-gray-100">
                {data?.length > 0 ? (
                  data.map((item) => {
                    const user = item?.User || {};
                    const serviceType = item?.ServicesType || {};
                    const service = item?.Services || {};

                    return (
                      <tr key={item._id} className="hover:bg-gray-50 transition">
                        
                        {/* Name */}
                        <td className="px-4 py-3 text-center">
                          {user?.name || item?.assignedTo?.name  || "N/A"}
                        </td>

                        {/* Phone */}
                        <td className="px-4 py-3 text-center">
                          {user?.phone || item?.assignedTo?.phone  || "N/A"}
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3 text-center">
                          {user?.email || item?.assignedTo?.email || "N/A"}
                        </td>

                        {/* Concept */}
                        <td className="px-4 py-3 text-center capitalize">
                          {item?.concept || "N/A"}
                        </td>

                        {/* Service Type */}
                        <td className="px-4 py-3 text-center">
                          {serviceType?.title || "N/A"}
                        </td>

                        {/* Service Model */}
                        <td className="px-4 py-3 text-center">
                          {service?.title || "N/A"}
                        </td>

                        {/* Timeline */}
                        {/* <td className="px-4 py-3 text-center">
                          {service?.timeline || "N/A"}
                        </td> */}

                        {/* Cost */}
                        {/* <td className="px-4 py-3 text-center">
                          {service?.cost || "N/A"}
                        </td> */}

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-10 text-center text-gray-500 text-[15px]"
                    >
                      No Booking Found
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