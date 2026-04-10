"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "../common/AdminLayout";
import { MdAdd, MdEdit } from "react-icons/md";
import Link from "next/link";
import Listing from "@/pages/api/Listing";
import BlockUnblock from "../common/BlockUnblock";

export default function Index() {
  const [data, setData] = useState([]);
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
      <div className="min-h-screen p-5 lg:p-[30px]">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">

          <h2 className="text-[20px] font-extrabold uppercase text-[#171717]">
            Project List
          </h2>

          <div className="flex flex-wrap gap-3 items-center">

            {/* 🔍 Search */}
            <input
              type="text"
              placeholder="Search project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-[250px] px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <Link
              href="/admin/project/add"
              className="bg-blue-500 text-white px-4 py-2 rounded-md flex gap-2 items-center hover:bg-blue-600"
            >
              <MdAdd size={18} /> Project
            </Link>
          </div>
        </div>

        {/* Cards */}
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center shadow-lg border rounded-xl my-10 md:my-16 lg:my-20"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={item.Image}
                  alt={item.title}
                  className="w-full h-[520px] object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                />

                {/* Overlay */}
                <div className="absolute top-3 right-3 flex gap-3 bg-white/90 p-2 rounded-lg shadow-md">

                  <Link
                    href={`/admin/project/add?id=${item?._id}`}
                    className="w-[42px] h-[42px] flex items-center justify-center rounded-lg border bg-white hover:bg-gray-100"
                  >
                    <MdEdit size={20} />
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
              <div>
                <h2 className="font-[900] uppercase text-[24px] mb-3 flex items-center gap-3">
                  {item.title}

                  <Link
                    href={`/admin/project/add?id=${item?._id}`}
                    className="w-[42px] h-[42px] flex items-center justify-center rounded-lg border bg-white hover:bg-gray-100"
                  >
                    <MdEdit size={20} />
                  </Link>
                </h2>

                <p className="text-[14px] md:text-[16px] uppercase text-[#4D5466] mb-6">
                  {item.designed}
                </p>

                {/* Brief */}
                <div className="mb-5">
                  <h3 className="font-bold text-[16px] md:text-[18px] mb-1">
                    Client Brief
                  </h3>
                  <p className="text-[14px] md:text-[16px] text-[#4D5466]">
                    {item?.brief}
                  </p>
                </div>

                {/* Solution */}
                <div>
                  <h3 className="font-bold text-[16px] md:text-[18px] mb-1">
                    Design Solution
                  </h3>
                  <p className="text-[14px] md:text-[16px] text-[#4D5466]">
                    {item?.solution}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-500 text-lg">
            No Projects Found
          </div>
        )}
      </div>
    </AdminLayout>
  );
}