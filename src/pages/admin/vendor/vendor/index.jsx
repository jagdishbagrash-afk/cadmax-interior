"use client";
import { useEffect, useState } from "react";
import moment from "moment";
import AddVendor from "./AddVendor";
import Listing from "@/pages/api/Listing";
import AdminLayout from "../../common/AdminLayout";
import BlockUnblock from "../../common/BlockUnblock";
import Link from "next/link";

export default function Index() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const main = new Listing();
      const response = await main.vendorList();
      if (response.data?.data) {
        setData(response.data.data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Multi-field Search Filter
  const filteredData = data.filter((item) => {
    const query = search.toLowerCase();

    return (
      item?.name?.toLowerCase().includes(query) ||
      item?.phone?.toString().includes(query) ||
      item?.experience?.toLowerCase().includes(query) ||
      item?.sepectailze?.toLowerCase().includes(query) ||
      item?.VendorCategory?.name?.toLowerCase().includes(query)
    );
  });

  return (
    <AdminLayout page={"Vendor List"}>
      <div className="px-4 py-2 lg:px-4 lg:py-2.5">
        <div className="bg-white rounded-[20px] mb-[10px] p-2">

          {/* Header */}
          <div className="px-4 py-3 flex flex-wrap justify-between items-center gap-3 border-b border-black/10">

            <h2 className="Creato text-[16px] lg:text-[18px] font-normal text-[#1E1E1E]">
              Vendor Listing
            </h2>

            <div className="flex flex-wrap gap-3 items-center">

              {/* 🔍 Search Input */}
              <input
                type="text"
                placeholder="Search name, phone, category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-[260px] px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <Link
                href="/admin/vendor/category"
                className="cursor-pointer flex items-center justify-center
                w-[200px] h-[42px] rounded-lg border border-gray-200 shadow-sm
                bg-white hover:bg-gray-50 transition-all duration-200"
              >
                Vendor Category List
              </Link>

              <AddVendor fetchDatas={fetchData} />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm mt-4">
            <table className="min-w-full divide-y divide-gray-200 whitespace-nowrap">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 text-center">
                    Image
                  </th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 text-center">
                    Name / Phone
                  </th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 text-center">
                    Experience
                  </th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 text-center">
                    Project
                  </th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 text-center">
                    Category
                  </th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 text-center">
                    Created Date
                  </th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item?._id} className="hover:bg-gray-50">

                      {/* Image */}
                      <td className="px-6 py-4 text-center">
                        <img
                          src={item?.Image}
                          className="w-[100px] h-[100px] object-cover rounded-md shadow-sm mx-auto"
                          alt={item?.name}
                        />
                      </td>

                      {/* Name */}
                      <td className="px-6 py-4 text-center text-[15px] text-gray-800">
                        {item?.name} / {item?.phone}
                      </td>

                      {/* Experience */}
                      <td className="px-6 py-4 text-center">
                        {item?.experience}
                      </td>

                      {/* Specialization */}
                      <td className="px-6 py-4 text-center text-nowrap">
                        {item?.specialization}
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-center">
                        {item?.VendorCategory?.name || "-"}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-center text-gray-600">
                        {moment(item?.createdAt).format("DD-MM-YYYY")}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <AddVendor
                            item={item}
                            isEdit={true}
                            fetchDatas={fetchData}
                          />

                          <BlockUnblock
                            Id={item._id}
                            fetchData={fetchData}
                            step={8}
                            status={item?.deletedAt ? true : false}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No Vendors Found
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