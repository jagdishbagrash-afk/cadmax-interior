"use client";
import { useEffect, useState } from "react";
import moment from "moment";
import TypeAdd from "./TypeAdd";
import Listing from "@/pages/api/Listing";
import dataimage from "../../../../Assets/Images/c1.jpg"
import AdminLayout from "../../common/AdminLayout";
import BlockUnblock from "../../common/BlockUnblock";
import Link from "next/link";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export default function Index() {
  const [data, setData] = useState([]);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

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

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <AdminLayout page={"Concept Type"}>
      <div className="px-4 py-2 lg:px-4 lg:py-2.5">
        <div className="bg-white rounded-[20px] mb-[10px] p-2">
          {/* Header */}
          <div className="px-4 py-3 flex flex-wrap justify-between items-center border-b border-black/10">

            <h2 className="Creato text-[16px] lg:text-[18px] font-normal leading-[120%] tracking-[-0.03em] text-[#1E1E1E]">
              Concept Type List
            </h2>
            <Link href="/admin/services/services" className="Creato text-[16px] lg:text-[18px] font-normal leading-[120%] tracking-[-0.03em] text-[#ffffff] bg-black rounded-full p-2">
              Concept Listing
            </Link>
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
                {paginatedData.length > 0 ? (
                  paginatedData.map((item) => (
                    <tr
                      key={item?._id}
                      className={`transition hover:bg-gray-50 ${item?.deletedAt ? "opacity-50" : ""
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

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t flex-wrap gap-3">
              <p className="text-sm text-gray-500">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, data.length)} of{" "}
                {data.length} entries
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-lg border flex items-center justify-center disabled:opacity-50 hover:bg-gray-100"
                >
                  <MdChevronLeft size={20} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, totalPages))
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                        currentPage === page
                          ? "bg-black text-white"
                          : "border hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-lg border flex items-center justify-center disabled:opacity-50 hover:bg-gray-100"
                >
                  <MdChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </AdminLayout>
  );
}