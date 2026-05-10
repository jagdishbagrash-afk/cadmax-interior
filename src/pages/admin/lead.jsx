"use client";
import { useEffect, useState } from "react";
import Listing from "@/pages/api/Listing";
import AdminLayout from "./common/AdminLayout";

export default function Index() {
  const [data, setData] = useState([]);
  console.log("|data" ,data)
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // 📡 Fetch Data
  const fetchData = async () => {
    try {
      const main = new Listing();
      const response = await main.Leadget();

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

  useEffect(() => {
    fetchData();
  }, []);

  // 🔍 Search Logic (Safe)
  useEffect(() => {
    const result = data.filter((item) => {
      const searchValue = search.toLowerCase();

      return (
        item?.name?.toLowerCase()?.includes(searchValue) ||
        item?.phone?.toString()?.includes(searchValue) ||
        item?.pageurl?.toLowerCase()?.includes(searchValue) ||
        item?.source?.toLowerCase()?.includes(searchValue) ||
        item?.type?.toLowerCase()?.includes(searchValue) ||
        item?.services?.toLowerCase()?.includes(searchValue) ||
        item?.category?.toLowerCase()?.includes(searchValue)
      );
    });

    setFilteredData(result);
  }, [search, data]);

  return (
    <AdminLayout page={"Lead List"}>
      <div className="px-4 py-2 lg:px-4 lg:py-2.5">
        <div className="bg-white rounded-[20px] mb-[10px] p-2 shadow-sm">

          {/* Header */}
          <div className="px-4 py-3 flex flex-wrap justify-between items-center border-b border-black/10 gap-3">
            <h2 className="text-[16px] lg:text-[18px] font-medium text-[#1E1E1E]">
              Lead Listing
            </h2>

            {/* 🔍 Search */}
            <input
              type="text"
              placeholder="Search name, phone, source..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-[250px]"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 mt-4">
            <table className="min-w-full divide-y divide-gray-200">

              {/* Table Head */}
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">Name</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">Phone</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">Email</th>
                
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">Page URL</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">Source</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">Type</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">Services</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">Category</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">Message</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredData?.length > 0 ? (
                  filteredData.map((item) => {
                    // 🧠 Normalize Data

                    const name = item?.assignedTo?.name  || item?.name || "N/A";
                    const phone =  item?.assignedTo?.phone || item?.phone || "N/A";
                    const email =  item?.assignedTo?.email || item?.email || "N/A";

                    const pageurl = item?.pageurl || "N/A";
                    const source = item?.source || "N/A";
                    const type = item?.type || "Lead";
                    const services = item?.services || "N/A";
                    const category = item?.category || "N/A";
                    const message = item?.message || "N/A";

                    return (
                      <tr key={item._id} className="hover:bg-gray-50 transition">

                        {/* Name */}
                        <td className="px-4 py-3 text-center">{name}</td>

                        {/* Phone */}
                        <td className="px-4 py-3 text-center">{phone}</td>
                        <td className="px-4 py-3 text-center">{email}</td>


                        {/* Page URL */}
                        <td className="px-4 py-3 text-center max-w-[200px] truncate">
                          {pageurl !== "N/A" ? (
                            <a
                              href={pageurl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              Open Link
                            </a>
                          ) : "N/A"}
                        </td>

                        {/* Source */}
                        <td className="px-4 py-3 text-center">{source}</td>

                        {/* Type */}
                        <td className="px-4 py-3 text-center capitalize">{type}</td>

                        {/* Services */}
                        <td className="px-4 py-3 text-center capitalize">{services}</td>

                        {/* Category */}
                        <td className="px-4 py-3 text-center capitalize">{category}</td>

                        {/* Message */}
                        <td className="px-4 py-3 text-center max-w-[250px] truncate">
                          {message}
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                      No Leads Found
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