"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import moment from "moment";
import AdminLayout from "../common/AdminLayout";
import AddSuperCategory from "./AddSuperCategory";
import Listing from "@/pages/api/Listing";
import BlockUnblock from "../common/BlockUnblock";

export default function Index() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const main = new Listing();
      const response = await main.SupercategoryList();

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
  return (
    <AdminLayout page={"Main Category List"}>
      <div className="min-h-screen p-5 lg:p-[30px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-extrabold uppercase text-[#171717]">
            Main Category List
          </h2>
          <AddSuperCategory fetchData={fetchData} />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="font-normal text-sm lg:text-base px-3 lg:px-4 py-2 lg:py-3 border-t border-[rgba(204,40,40,0.2)] capitalize">Image</th>
                <th className="font-normal text-sm lg:text-base px-3 lg:px-4 py-2 lg:py-3 border-t border-[rgba(204,40,40,0.2)] capitalize">Name</th>
                <th className="font-normal text-sm lg:text-base px-3 lg:px-4 py-2 lg:py-3 border-t border-[rgba(204,40,40,0.2)] capitalize">Created Date</th>
                <th className="font-normal text-sm lg:text-base px-3 lg:px-4 py-2 lg:py-3 border-t border-[rgba(204,40,40,0.2)] capitalize">Action</th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={item._id} className="hover:bg-[rgba(204,40,40,0.1)] border-t border-[rgba(204,40,40,0.2)]">
                    <td className="px-3 lg:px-4 py-2 lg:py-3 text-black text-sm lg:text-base font-medium font-inter whitespace-nowrap">
                      <img
                        src={item.Image}
                        className="w-14 h-14 object-cover rounded-md border"
                        alt="SuperCategory"
                      />
                    </td>

                    <td className="px-3 lg:px-4 py-2 lg:py-3 text-black text-sm lg:text-base font-medium font-inter whitespace-nowrap">
                      {item.name}</td>

                    <td className="px-3 lg:px-4 py-2 lg:py-3 text-black text-sm lg:text-base font-medium font-inter whitespace-nowrap">
                      {moment(item.createdAt).format("DD-MM-YYYY")}
                    </td>

                    <td className="px-3 lg:px-4 py-2 lg:py-3 text-black text-sm lg:text-base font-medium font-inter whitespace-nowrap">
                      <div className="flex justify-center items-center text-center gap-3" >

                        <AddSuperCategory isEdit={true} item={item}  fetchData={fetchData}/>
                        <BlockUnblock Id={item._id} fetchData={fetchData} step={1} status={item?.status}/>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center p-4">
                    No SuperCategories Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </AdminLayout>
  );
}
