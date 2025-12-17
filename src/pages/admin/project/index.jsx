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
        <div className="flex items-center justify-between mb-1">
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

        {data && data?.map((item, index) => (
          <div
            key={index}
            className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center shadow-lg border rounded-xl   my-10 md:my-16 lg:my-20 `}
          >
            <div className="relative">
              <img
                src={item.Image}
                alt={item.title}
                className="w-full h-[520px] object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
              />

              {/* Overlay Icons */}
              <div className="absolute top-3 right-3 flex gap-3 bg-white/90 p-2 rounded-lg shadow-md">
                {item?.deletedAt && (
                  <Link href={`/admin/project/add?id=${item?._id}`} className="cursor-pointer m-auto flex items-center justify-center
                    w-[42px] h-[42px] rounded-lg 
                    border border-gray-200 shadow-sm 
                    bg-white hover:bg-gray-50 transition-all duration-200 ">
                    <MdEdit
                      size={20}
                      className=" cursor-pointer"
                    />
                  </Link>
                )}

                <BlockUnblock
                  Id={item._id}
                  fetchData={fetchData}
                  step={5}
                  status={item?.deletedAt ? true : false}
                />
              </div>
            </div>

            {/* Content */}
            <div >
              <h2 className="Creato font-[900] uppercase text-[24px] leading-[1] tracking-[-0.02em] mb-3">
                {item.title}
              </h2>

              <p className="Creato font-medium text-[14px] sm:text-[15px] md:text-[16px] leading-[1] tracking-[-0.02em] uppercase text-left text-[#4D5466] mb-6">
                {item.designed}
              </p>
              <div className="space-y-5">
                <div className="space-y-2">

                  <h3 className="Creato font-bold text-[16px] sm:text-[17px] md:text-[18px] leading-[1] tracking-[-0.02em] text-[#171717]">
                    Client Brief
                  </h3>

                  <p className="Creato font-medium text-[14px] sm:text-[15px] md:text-[16px] leading-[1.4] tracking-[-0.02em] text-[#4D5466]">
                    {item?.brief}
                  </p>
                </div>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <h3 className="Creato font-bold text-[16px] sm:text-[17px] md:text-[18px] leading-[1] tracking-[-0.02em] text-[#171717]">
                    Design Solution
                  </h3>
                  <p className="Creato font-medium text-[14px] sm:text-[15px] md:text-[16px] leading-[1.4] tracking-[-0.02em] text-[#4D5466]">
                    {item?.solution}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
