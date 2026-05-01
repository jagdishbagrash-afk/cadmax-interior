"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "../common/AdminLayout";
import { MdAdd, MdEdit } from "react-icons/md";
import Link from "next/link";
import Listing from "@/pages/api/Listing";
import BlockUnblock from "../common/BlockUnblock";

export default function Index() {
  const [data, setData] = useState([]);
  console.log("data",data)
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const main = new Listing();
      const response = await main.getAllProject();
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

  // ✅ Search Filter
  const filteredData = data.filter((item) => {
    const query = search.toLowerCase();

    return (
      item?.title?.toLowerCase().includes(query) ||
      item?.designed?.toLowerCase().includes(query) ||
      item?.brief?.toLowerCase().includes(query) ||
      item?.solution?.toLowerCase().includes(query)
    );
  });

  return (
    <AdminLayout page={"Project List"}>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">
            Project List
          </h2>

          <div className="flex flex-wrap gap-3 items-center">

            {/* Search */}
            <input
              type="text"
              placeholder="Search project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-[260px] px-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {/* Add Button */}
            <Link
              href="/admin/project/add"
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-blue-700 transition"
            >
              <MdAdd size={18} /> Add Project
            </Link>
          </div>
        </div>

        {/* Cards */}
        {filteredData.length > 0 ? (
          <div className="space-y-10">
            {filteredData.map((item, index) => (
              <div
                key={index}
                className="grid md:grid-cols-2 gap-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
              >
                {/* Image */}
                <div className="relative group">
                  <img
                    src={item.Image || item?.multiple_images?.[0]}
                    alt={item.title}
                    className="w-full h-[260px] md:h-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  {/* Floating Actions */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <Link
                      href={`/admin/project/add?id=${item?._id}`}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100"
                    >
                      <MdEdit size={18} />
                    </Link>

                    <BlockUnblock
                      Id={item._id}
                      fetchData={fetchData}
                      step={5}
                      status={item?.deletedAt ? true : false}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 md:p-7 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                      {item.title}
                    </h2>

                    <Link
                      href={`/admin/project/add?id=${item?._id}`}
                      className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border bg-white"
                    >
                      <MdEdit size={18} />
                    </Link>
                  </div>

                  <p className="text-sm text-gray-500 mb-4">
                    {item.designed}
                  </p>

                  {/* Brief */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Client Brief
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item?.brief}
                    </p>
                  </div>

                  {/* Solution */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Design Solution
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item?.solution}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400 text-lg">
            No Projects Found
          </div>
        )}
      </div>
    </AdminLayout>
  );
}