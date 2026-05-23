"use client";

import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import AddVendor from "./AddVendor";
import Listing from "@/pages/api/Listing";
import AdminLayout from "../../common/AdminLayout";
import BlockUnblock from "../../common/BlockUnblock";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";

export default function Index() {

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  /* FETCH DATA */
  const fetchData = async () => {
    try {

      const main = new Listing();

      const response = await main.vendorList();

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

  /* SEARCH FILTER */
  const filteredData = useMemo(() => {

    const query = search.toLowerCase();

    return data.filter((item) => {

      return (
        item?.name?.toLowerCase().includes(query) ||
        item?.phone?.toString().includes(query) ||
        item?.experience?.toLowerCase().includes(query) ||
        item?.specialization?.toLowerCase().includes(query) ||
        item?.VendorCategory?.name?.toLowerCase().includes(query)
      );
    });

  }, [data, search]);

  /* PAGINATION */
  const totalPages = Math.ceil(
    filteredData.length / itemsPerPage
  );

  const paginatedData = useMemo(() => {

    const startIndex =
      (currentPage - 1) * itemsPerPage;

    const endIndex = startIndex + itemsPerPage;

    return filteredData.slice(startIndex, endIndex);

  }, [filteredData, currentPage]);

  // RESET PAGE ON SEARCH
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <AdminLayout page={"Vendor List"}>

      <div className="px-4 py-3 lg:px-5">

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

          {/* HEADER */}
          <div className="p-5 border-b border-gray-100">

            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">

              {/* TITLE */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Vendor Listing
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Manage all vendors and categories
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col md:flex-row gap-3">

                {/* SEARCH */}
                <div className="relative">

                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]" />

                  <input
                    type="text"
                    placeholder="Search vendor..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    className="w-full md:w-[300px] h-[46px] pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-black outline-none transition-all"
                  />
                </div>

                {/* CATEGORY */}
                <Link
                  href="/admin/vendor/category"
                  className="h-[46px] px-5 rounded-xl border border-gray-200 bg-white hover:bg-black hover:text-white flex items-center justify-center text-sm font-medium transition-all duration-300"
                >
                  Vendor Category
                </Link>

                {/* ADD */}
                <AddVendor fetchDatas={fetchData} />
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">

            <table className="min-w-full">

              {/* TABLE HEAD */}
              <thead className="bg-gray-50 border-b border-gray-100">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Vendor
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Experience
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Specialization
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Created
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Action
                  </th>

                </tr>

              </thead>

              {/* TABLE BODY */}
              <tbody className="divide-y divide-gray-100">

                {paginatedData.length > 0 ? (

                  paginatedData.map((item) => (

                    <tr
                      key={item?._id}
                      className="hover:bg-gray-50/70 transition-all duration-200"
                    >

                      {/* VENDOR */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4 min-w-[250px]">

                          {/* IMAGE */}
                          <img
                            src={item?.Image}
                            alt={item?.name}
                            className="w-[70px] h-[70px] rounded-2xl object-cover border border-gray-200 shadow-sm"
                          />

                          {/* INFO */}
                          <div>

                            <h3 className="text-[15px] font-semibold text-gray-900">
                              {item?.name}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                              {item?.phone}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              {item?.email}
                            </p>

                          </div>
                        </div>
                      </td>

                      {/* EXPERIENCE */}
                      <td className="px-6 py-5 text-center">

                        <div className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                          {item?.experience || "N/A"}
                        </div>

                      </td>

                      {/* SPECIALIZATION */}
                      <td className="px-6 py-5 text-center">

                        <p className="text-sm text-gray-700 font-medium max-w-[220px] mx-auto line-clamp-2">
                          {item?.specialization || "-"}
                        </p>

                      </td>

                      {/* CATEGORY */}
                      <td className="px-6 py-5 text-center">

                        <span className="inline-flex px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                          {item?.VendorCategory?.name || "-"}
                        </span>

                      </td>

                      {/* DATE */}
                      <td className="px-6 py-5 text-center text-sm text-gray-600 whitespace-nowrap">

                        {moment(item?.createdAt).format(
                          "DD MMM YYYY"
                        )}

                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-5 text-center">

                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold
                          ${
                            item?.deletedAt
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {item?.deletedAt
                            ? "Blocked"
                            : "Active"}
                        </span>

                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-5">

                        <div className="flex justify-center items-center gap-3">

                          <AddVendor
                            item={item}
                            isEdit={true}
                            fetchDatas={fetchData}
                          />

                          <BlockUnblock
                            Id={item?._id}
                            fetchData={fetchData}
                            step={8}
                            status={
                              item?.deletedAt
                                ? true
                                : false
                            }
                          />

                        </div>

                      </td>

                    </tr>
                  ))

                ) : (

                  <tr>

                    <td
                      colSpan={7}
                      className="px-6 py-16 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                          <FiSearch className="text-2xl text-gray-400" />
                        </div>

                        <h3 className="text-lg font-semibold text-gray-700">
                          No Vendors Found
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          Try changing your search keyword
                        </p>

                      </div>

                    </td>

                  </tr>
                )}

              </tbody>

            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (

            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t border-gray-100 bg-gray-50">

              {/* INFO */}
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-black">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>
                {" "}to{" "}
                <span className="font-semibold text-black">
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredData.length
                  )}
                </span>
                {" "}of{" "}
                <span className="font-semibold text-black">
                  {filteredData.length}
                </span>
                {" "}vendors
              </p>

              {/* BUTTONS */}
              <div className="flex items-center gap-2 flex-wrap">

                {/* PREV */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.max(prev - 1, 1)
                    )
                  }
                  disabled={currentPage === 1}
                  className={`h-[40px] px-4 rounded-xl border text-sm font-medium transition-all
                  ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-black hover:text-white"
                  }`}
                >
                  Previous
                </button>

                {/* PAGE */}
                {[...Array(totalPages)]?.map((_, index) => {

                  const page = index + 1;

                  return (
                    <button
                      key={page}
                      onClick={() =>
                        setCurrentPage(page)
                      }
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-all
                      ${
                        currentPage === page
                          ? "bg-black text-white"
                          : "bg-white border hover:bg-black hover:text-white"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                {/* NEXT */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages)
                    )
                  }
                  disabled={
                    currentPage === totalPages
                  }
                  className={`h-[40px] px-4 rounded-xl border text-sm font-medium transition-all
                  ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-black hover:text-white"
                  }`}
                >
                  Next
                </button>

              </div>
            </div>
          )}

        </div>
      </div>
    </AdminLayout>
  );
}