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
      <div className="px-4 py-2 lg:px-4 lg:py-2.5">
        <div className="bg-white rounded-[20px] mb-[10px] p-2">
          {/* Header */}

       


   <div className="px-4 py-3 flex flex-wrap justify-between items-center border-b border-black/10">

            <h2 className="Creato text-[16px] lg:text-[18px] font-normal leading-[120%] tracking-[-0.03em] text-[#1E1E1E]">
                Main Category  Listing
            </h2>

                       <AddSuperCategory fetchData={fetchData} />


          </div>
          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase tracking-wider text-center">
                    Image
                  </th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase tracking-wider text-center">
                    Name
                  </th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase tracking-wider text-center">
                    Created Date
                  </th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase tracking-wider text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {data.length > 0 ? (
                  data.map((item) => (
                    <tr
                      key={item._id}
                      className={`transition hover:bg-gray-50 ${item?.deleted_at ? "opacity-60 pointer-events-none" : ""
                        }`}
                    >
                      <td className="px-6 py-4 text-center">
                        <img
                          src={item.Image}
                          className="w-14 h-14 rounded-lg border object-cover shadow-sm"
                          alt="SuperCategory"
                        />
                      </td>

                      <td className="px-6 py-4 text-center text-[15px] text-gray-800 font-medium">
                        {item.name}
                      </td>

                      <td className="px-6 py-4 text-center text-[14px] text-gray-600">
                        {moment(item.createdAt).format("DD-MM-YYYY")}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-2">
                          <AddSuperCategory isEdit={true} item={item} fetchData={fetchData} />
                          <BlockUnblock
                            Id={item._id}
                            fetchData={fetchData}
                            step={1}
                            status={item?.status}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-gray-500 text-[15px]"
                    >
                      No Categories Found
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
