import React, { useEffect, useState } from "react";
import AdminLayout from "../common/AdminLayout";
import { MdAdd, MdEdit } from "react-icons/md";
import Link from "next/link";
import Listing from "@/pages/api/Listing";
import moment from "moment";
import BlockUnblock from "../common/BlockUnblock";

export default function index() {
  const [data, setData] = useState([]);

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

  return (
    <AdminLayout page={"Project List"}>
      <div className="min-h-screen p-5 lg:p-[30px]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-extrabold uppercase text-[#171717]">
            Project List
          </h2>
          <Link
            href="/admin/project/add"
            className="bg-blue-500 text-white px-4 py-2 rounded-md flex gap-2 items-center hover:bg-blue-600"
          >
            <MdAdd size={18} /> Project
          </Link>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.length > 0 ? (
            data?.map((item) => (
              <div
                key={item?._id}
                className={`bg-white shadow-lg border rounded-xl p-4 transition hover:shadow-xl relative ${
                  item?.deletedAt ? "opacity-50" : ""
                }`}
              >
                {/* Image */}
                <img
                  src={item?.Image}
                  alt="Project"
                  className="w-full h-48 object-cover rounded-md"
                />

                {/* Content */}
                <div className="mt-4">
                  <h3 className="text-[18px] font-semibold text-gray-800">
                    {item?.title}
                  </h3>

                  <p className="text-gray-700 text-[15px] mt-2">
                    <span className="font-semibold">Designed By:</span> {item?.designed}
                  </p>

                  <p className="text-gray-700 text-[15px] mt-2">
                    <span className="font-semibold">Brief:</span> {item?.brief}
                  </p>

                  <p className="text-gray-700 text-[15px] mt-2">
                    <span className="font-semibold">Solution:</span> {item?.solution}
                  </p>

                  <p className="text-gray-700 text-[15px] mt-2">
                    <span className="font-semibold">Content:</span> {item?.content}
                  </p>

                  <p className="text-[13px] text-gray-500 mt-3">
                    Created: {moment(item?.createdAt).format("DD-MM-YYYY")}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mt-4">
                  <Link
                    href={`/admin/project/add?id=${item?._id}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <MdEdit size={22} />
                  </Link>

                  <BlockUnblock
                    Id={item._id}
                    fetchData={fetchData}
                    step={5}
                    status={item?.deletedAt ? true : false}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No Project Found
            </p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
