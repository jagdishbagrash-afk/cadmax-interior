"use client";

import { useEffect, useState } from "react";
import moment from "moment";
import AdminLayout from "../../common/AdminLayout";
import Listing from "@/pages/api/Listing";
import dataimage from "../../../../Assets/Images/c1.jpg"
import toast from "react-hot-toast";
import BlockUnblock from "../../common/BlockUnblock";
import AddSubSubCategory from "./AddSubSubCategory";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export default function Index() {
  const [data, setData] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const fetchData = async () => {
    try {
      const main = new Listing();
      const response = await main.subsubcategoryList();
      console.log("response", response)

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

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Frontend API call
  const handleDeleteproductsubsubcategory = async (id) => {
    try {
      const main = new Listing();
      const response = await main.deleteproductsubsubcategory(id); // You need to create this method
      if (response.data?.status) {
        toast.success(response.data.message);
        // Refresh the list after successful deletion
        fetchData();
      } else {
        toast.error(response.data?.message || "Failed to delete subcategory");
      }
    } catch (error) {
      console.log("Error:", error);
      toast.error(error?.response?.data?.message || "Cannot delete - Subcategory is being used in products");
    }
  };
  return (
    <AdminLayout page={"Sub Sub category List"}>

      <div className="px-4 py-2 lg:px-4 lg:py-2.5">
        <div className="bg-white rounded-[20px] mb-[10px] p-2">
          <div className="px-4 py-3 flex flex-wrap justify-between items-center border-b border-black/10">

            <h2 className="Creato text-[16px] lg:text-[18px] font-normal leading-[120%] tracking-[-0.03em] text-[#1E1E1E]">
              Sub Sub Category Listing
            </h2>


            <div className="flex flex-wrap gap-2 items-center">
              <input
                type="text"
                placeholder="Search Sub Sub Category ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <AddSubSubCategory fetchDatas={fetchData} />


            </div>

          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm mt-4">
            <table className="min-w-full divide-y divide-gray-200 whitespace-nowrap">

              {/* Header */}
              <thead className="bg-gray-50">
                <tr>
                  {/* <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase tracking-wider text-center">
                    Main Category
                  </th> */}

                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase tracking-wider text-center">
                    Image
                  </th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase tracking-wider text-center">
                    Category
                  </th>

                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase tracking-wider text-center">
                    Sub Category
                  </th>

                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase tracking-wider text-center">
                    Sub Sub Category
                  </th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase tracking-wider text-center">
                    Created Date
                  </th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase tracking-wider text-center">
                    Action
                  </th>

                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase tracking-wider text-center">
                    Delete
                  </th>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedData.length > 0 ? (
                  paginatedData?.map((item) => (
                    <tr
                      key={item._id}
                      className={`transition
    ${item?.status === false
                          ? "bg-gray-100 text-gray-400 opacity-70"
                          : "hover:bg-gray-50"
                        }
  `}
                    >
                      <td className="px-6 py-4 text-center">
                        <img
                          src={item.Image ? item.Image : dataimage?.src || dataimage?.src}
                          className="w-[100px] h-[100px] object-cover text-center  rounded-md  shadow-sm"
                          alt="SubCategory"
                        />
                      </td>
                      {/* Category */}
                      <td className="px-6 py-4 text-center text-[15px] text-gray-800">
                        {item?.category?.name || "-"}
                      </td>

                      <td className="px-6 py-4 text-center text-[15px] text-gray-800">
                        {item?.subcategory?.name || "-"}
                      </td>

                      <td className="px-6 py-4 text-center text-[15px] text-gray-800">
                        {item?.name || "-"}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-center text-[14px] text-gray-600">
                        {moment(item.createdAt).format("DD-MM-YYYY")}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-3">
                          <AddSubSubCategory
                            isEdit={true}
                            item={item}
                            fetchDatas={fetchData}
                          />
                          <BlockUnblock
                            Id={item._id}
                            fetchData={fetchData}
                            step={33}
                            status={item?.status === true ? false : true}
                          />
                        </div>
                      </td>
                      {item?.status === false && (
                        <td className="px-6 py-4">
                          <div className="flex justify-center items-center gap-3">

                            <button
                              onClick={() => handleDeleteproductsubsubcategory(item._id)}
                              disabled={deletingId === item._id}
                              className="cursor-pointer m-auto flex items-center justify-center
                    w-[100px] h-[42px] rounded-lg 
                    px-2 py-2
                    border border-gray-200 shadow-sm  text-white  hover:text-black
                    bg-red-500 hover:bg-gray-50 transition-all duration-200"
                            >
                              {deletingId === item._id ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      )}

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500 text-[15px]"
                    >
                      No SubCategories Found
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
                {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
                {filteredData.length} entries
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
                          ? "bg-blue-600 text-white"
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