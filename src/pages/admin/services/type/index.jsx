"use client";
import { useEffect, useState } from "react";
import moment from "moment";
import TypeAdd from "./TypeAdd";
import Listing from "@/pages/api/Listing";
import dataimage from "../../../../Assets/Images/c1.jpg"
import AdminLayout from "../../common/AdminLayout";
import BlockUnblock from "../../common/BlockUnblock";

export default function Index() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const main = new Listing();
      const response = await main.servciestypeList();
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
  console.log("data", data)

  return (
    <AdminLayout page={"Servcies Type"}>
      <div className="px-4 py-2 lg:px-4 lg:py-2.5">
        <div className="bg-white rounded-[20px] mb-[10px] p-2">
          {/* Header */}
          <div className="px-4 py-3 flex flex-wrap justify-between items-center border-b border-black/10">

            <h2 className="Creato text-[16px] lg:text-[18px] font-normal leading-[120%] tracking-[-0.03em] text-[#1E1E1E]">
              Services Type List
            </h2>
            <TypeAdd fetchDatas={fetchData} />


          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm mt-4">
            <table className="min-w-full divide-y divide-gray-200 whitespace-nowrap">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase tracking-wider text-center">
                    Image
                  </th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase tracking-wider text-center">
                    Name
                  </th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase tracking-wider text-center">
                    Services type                   </th>

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
                      key={item?._id}
                      className={`transition hover:bg-gray-50 ${item?.deleted_at ? "opacity-50" : ""
                        }`}
                    >
                      {/* Image */}
                      <td className="px-6 py-4 text-center">
                        <img
                          src={item.Image ? item.Image : dataimage?.src || dataimage?.src}
                          className="w-[100px] h-[100px] object-cover text-center  rounded-md  shadow-sm"
                          alt="SubCategory"
                        />
                      </td>
                      <td className="px-6 py-4 text-center text-[15px] text-gray-800">
                        {item.title}
                      </td>
                      {/* Name */}
                      <td className="px-6 py-4 text-center text-[15px] text-gray-800">
                        {item.TypeServices}
                      </td>



                      {/* Created Date */}
                      <td className="px-6 py-4 text-center text-[14px] text-gray-600">
                        {moment(item.createdAt).format("DD-MM-YYYY")}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-3">
                          <TypeAdd
                            item={item}
                            isEdit={true}
                            fetchDatas={fetchData}
                          />
                          <BlockUnblock
                            Id={item._id}
                            fetchData={fetchData}
                            step={9}
                            status={item?.status === true ? false : true}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500 text-[15px]"
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
