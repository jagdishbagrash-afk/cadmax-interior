"use client";
import { useEffect, useState } from "react";
import moment from "moment";
import Listing from "@/pages/api/Listing";
import dataimage from "../../../../Assets/Images/c1.jpg"
import AdminLayout from "../../common/AdminLayout";
import BlockUnblock from "../../common/BlockUnblock";
import Link from "next/link";
import { MdEdit } from "react-icons/md";

export default function Index() {
  const [data, setData] = useState([]);

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

  return (
    <AdminLayout page={"Concept "}>
      <div className="px-4 py-2 lg:px-4 lg:py-2.5">
        <div className="bg-white rounded-[20px] mb-[10px] p-2">
          {/* Header */}
          <div className="px-4 py-3 flex flex-wrap justify-between items-center border-b border-black/10">

            <h2 className="Creato text-[16px] lg:text-[18px] font-normal leading-[120%] tracking-[-0.03em] text-[#1E1E1E]">
              Concept  List
            </h2>
            <div className="flex flex-wrap gap-3 ">
              <Link
                href="/admin/services/type"
                className="cursor-pointer m-auto flex items-center justify-center
                                  w-[200px] h-[42px] rounded-lg border border-gray-200 shadow-sm
                                  bg-white hover:bg-gray-50 transition-all duration-200"
              >
                Concept Category  List
              </Link>

              <Link
                href="/admin/services/services/add"
                className="cursor-pointer m-auto flex items-center justify-center
                                  w-[200px] h-[42px] rounded-lg border border-gray-200 shadow-sm
                                  bg-white hover:bg-gray-50 transition-all duration-200"
              >
                Servcies Add
              </Link>
              {/* <ServicesAdd fetchDatas={fetchData} /> */}

            </div>


          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm mt-4">
            <table className="min-w-full divide-y divide-gray-200 ">
              <thead className="bg-gray-50">
                <tr>
                  <th className="font-normal text-sm lg:text-base px-3 lg:px-4 py-2 lg:py-3 border-t border-[rgba(204,40,40,0.2)] capitalize">
                    Image
                  </th>
                  <th className="font-normal text-sm lg:text-base px-3 lg:px-4 py-2 lg:py-3 border-t border-[rgba(204,40,40,0.2)] capitalize">
                    Name
                  </th>
                  <th className="font-normal text-sm lg:text-base px-3 lg:px-4 py-2 lg:py-3 border-t border-[rgba(204,40,40,0.2)] capitalize">
                    Concept                   </th>
                  <th className="font-normal text-sm lg:text-base px-3 lg:px-4 py-2 lg:py-3 border-t border-[rgba(204,40,40,0.2)] capitalize">
                    Content
                  </th>
                  <th className="font-normal text-sm lg:text-base px-3 lg:px-4 py-2 lg:py-3 border-t border-[rgba(204,40,40,0.2)] capitalize">
                    Services type                   </th>

                  <th className="font-normal text-sm lg:text-base px-3 lg:px-4 py-2 lg:py-3 border-t border-[rgba(204,40,40,0.2)] capitalize">
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
                      <td className="px-3 lg:px-4 py-2 lg:py-3 text-black text-sm lg:text-base font-medium font-inter  ">
                        <img
                          src={item.Image ? item.Image : dataimage?.src || dataimage?.src}
                          className="w-full h-full object-cover text-center rounded-md shadow-sm"
                          alt="SubCategory"
                        />
                      </td>

                      {/* Title */}
                      <td className="px-3 lg:px-4 py-2 lg:py-3 text-black text-sm lg:text-base font-medium font-inter  ">
                        {item.title}
                      </td>
                      <td className="px-3 lg:px-4 py-2 uppercase lg:py-3 text-black text-sm lg:text-base font-medium font-inter  ">
                        {item.concept?.replaceAll("_", " ")}
                      </td>
                      {/* Content (Wrapped Text) */}
                      <td className="px-3 lg:px-4 py-2 lg:py-3 text-black text-sm lg:text-base font-medium font-inter  ">
                        {item.content}
                      </td>

                      {/* Service Type */}
                      <td className="px-3 lg:px-4 py-2 lg:py-3 text-black text-sm lg:text-base font-medium font-inter  ">
                        {item?.ServicesType?.TypeServices} - {item?.ServicesType?.title}
                      </td>


                      {/* Action */}
                      <td className="px-3 lg:px-4 py-2 lg:py-3 text-black text-sm lg:text-base font-medium font-inter  ">
                        <div className="flex justify-center items-center gap-3">
                          {/* <ServicesAdd
                            item={item}
                            isEdit={true}
                            fetchDatas={fetchData}
                          /> */}

                          <Link
                href={`/admin/services/services/add?id=${item?.slug}`}
                className="cursor-pointer m-auto flex items-center justify-center
                                  w-[50px] h-[42px] rounded-lg border border-gray-200 shadow-sm
                                  bg-white hover:bg-gray-50 transition-all duration-200"
              >
                <MdEdit/>
              </Link>
                          <BlockUnblock
                            Id={item._id}
                            fetchData={fetchData}
                            step={10}
                            status={item?.status === true ? false : true}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
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
