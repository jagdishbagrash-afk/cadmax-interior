"use client";
import { useEffect, useState } from "react";
import moment from "moment";
import Listing from "@/pages/api/Listing";
import dataimage from "../../../../Assets/Images/c1.jpg";
import AdminLayout from "../../common/AdminLayout";
import BlockUnblock from "../../common/BlockUnblock";
import Link from "next/link";
import { MdEdit } from "react-icons/md";

export default function Index() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const main = new Listing();
      const response = await main.ServciesList();
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

  // ✅ Multi-field Search
  const filteredData = data.filter((item) => {
    const query = search.toLowerCase();

    return (
      item?.title?.toLowerCase().includes(query) ||
      item?.concept?.toLowerCase().includes(query) ||
      item?.content?.toLowerCase().includes(query) ||
      item?.ServicesType?.TypeServices?.toLowerCase().includes(query) ||
      item?.ServicesType?.title?.toLowerCase().includes(query)
    );
  });

  return (
    <AdminLayout page={"Concept"}>
      <div className="px-4 py-2 lg:px-4 lg:py-2.5">
        <div className="bg-white rounded-[20px] mb-[10px] p-2">

          {/* Header */}
          <div className="px-4 py-3 flex flex-wrap justify-between items-center gap-3 border-b border-black/10">

            <h2 className="Creato text-[16px] lg:text-[18px] font-normal text-[#1E1E1E]">
              Concept List
            </h2>

            <div className="flex flex-wrap gap-3 items-center">

              {/* 🔍 Search Input */}
              <input
                type="text"
                placeholder="Search title, concept, services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-[260px] px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <Link
                href="/admin/services/type"
                className="flex items-center justify-center w-[200px] h-[42px] rounded-lg border border-gray-200 shadow-sm bg-white hover:bg-gray-50"
              >
                Concept Category List
              </Link>

              <Link
                href="/admin/services/category"
                className="flex items-center justify-center w-[200px] h-[42px] rounded-lg border border-gray-200 shadow-sm bg-white hover:bg-gray-50"
              >
                Sub Category List
              </Link>

              <Link
                href="/admin/services/contact"
                className="flex items-center justify-center w-[200px] h-[42px] rounded-lg border border-gray-200 shadow-sm bg-white hover:bg-gray-50"
              >
                Craft for you
              </Link>

              <Link
                href="/admin/services/services/add"
                className="flex items-center justify-center w-[200px] h-[42px] rounded-lg border border-gray-200 shadow-sm bg-white hover:bg-gray-50"
              >
                Services Add
              </Link>
            </div>
          </div>

          {/* Table */}
          <div className="mt-5 overflow-x-auto rounded-xl border border-gray-200 shadow-md">
            <table className="min-w-[900px] w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                    Image & Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                    Concept & Services
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                    Content
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 uppercase">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr
                      key={item?._id}
                      className={`border-t hover:bg-gray-50 transition ${
                        item?.deleted_at ? "opacity-50" : ""
                      }`}
                    >
                      {/* Image + Name */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              item?.Image
                                ? item?.Image
                                : dataimage?.src || "/no-image.png"
                            }
                            className="w-20 h-20 object-cover rounded-lg border"
                            alt="Category"
                          />
                          <span className="font-medium text-gray-800">
                            {item?.title}
                          </span>
                        </div>
                      </td>

                      {/* Concept */}
                      <td className="px-4 py-3 text-gray-700 font-medium uppercase">
                        {item?.concept?.replaceAll("_", " ")} /{" "}
                        {item?.ServicesType?.TypeServices} -{" "}
                        {item?.ServicesType?.title}
                      </td>

                      {/* Content */}
                      <td className="px-4 py-3 text-gray-600 text-sm max-w-[300px]">
                        <p className="line-clamp-3 leading-relaxed">
                          {item?.content}
                        </p>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3">
                        <div className="flex justify-center items-center gap-3">
                          <Link
                            href={`/admin/services/services/add?id=${item?.slug}`}
                            className="w-10 h-10 flex items-center justify-center rounded-lg border bg-white hover:bg-gray-100"
                          >
                            <MdEdit size={20} />
                          </Link>

                          <BlockUnblock
                            Id={item?._id}
                            fetchData={fetchData}
                            step={10}
                            status={item?.status ? false : true}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">
                      No Data Found
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