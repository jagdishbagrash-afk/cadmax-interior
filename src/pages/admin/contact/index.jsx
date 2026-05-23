"use client";

import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import {
  FiSearch,
} from "react-icons/fi";

import {
  MdOutlineMail,
  MdPhone,
} from "react-icons/md";

import {
  FaUserCircle,
} from "react-icons/fa";

import AdminLayout from "../common/AdminLayout";
import Listing from "@/pages/api/Listing";

export default function Index() {

  const [data, setData] = useState([]);

  // SEARCH
  const [search, setSearch] = useState("");

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  /* FETCH DATA */
  const fetchData = async () => {
    try {

      const main = new Listing();

      const response = await main.GetContact();

      if (response?.data?.data?.contactget) {

        // LATEST FIRST
        const sortedData =
          response.data.data.contactget.sort(
            (a, b) =>
              new Date(b.created_at) -
              new Date(a.created_at)
          );

        setData(sortedData);

      } else {
        setData([]);
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

    return data.filter((item) => {

      const query = search.toLowerCase();

      return (
        item?.name
          ?.toLowerCase()
          ?.includes(query) ||

        item?.email
          ?.toLowerCase()
          ?.includes(query)
      );
    });

  }, [data, search]);

  /* PAGINATION */
  const totalPages = Math.ceil(
    filteredData.length / itemsPerPage
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* PAGE CHANGE */
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  /* SEARCH RESET PAGE */
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (

    <AdminLayout page={"Contact List"}>

      <div className="px-4 py-4 lg:px-6">

        <div
          className="
            bg-white rounded-[24px]
            shadow-sm border border-gray-100
            overflow-hidden
          "
        >

          {/* HEADER */}
          <div
            className="
              px-6 py-5
              flex flex-col md:flex-row
              md:items-center
              md:justify-between
              gap-4
              border-b border-gray-100
            "
          >

            <div>

              <h2
                className="
                  text-[22px]
                  font-bold
                  text-[#111827]
                "
              >
                Contact Listing
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Total Contacts :
                {" "}
                {filteredData?.length}
              </p>

            </div>

            {/* SEARCH */}
            <div className="relative w-full md:w-[320px]">

              <FiSearch
                size={20}
                className="
                  absolute left-4 top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="
                  w-full h-[48px]
                  pl-11 pr-4
                  rounded-xl
                  border border-gray-200
                  bg-[#FAFAFA]
                  outline-none
                  focus:border-black
                  transition-all duration-200
                "
              />

            </div>

          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">

            <table className="min-w-full">

              {/* TABLE HEAD */}
              <thead
                className="
                  bg-[#FAFAFA]
                  border-b border-gray-100
                "
              >

                <tr>

                  {[
                    "User",
                    "Phone",
                    "Email",
                    "Service",
                    "Message",
                    "Date",
                  ].map((head) => (

                    <th
                      key={head}
                      className="
                        px-6 py-4
                        text-center
                        text-xs font-bold
                        uppercase tracking-wider
                        text-[#6B7280]
                        whitespace-nowrap
                      "
                    >
                      {head}
                    </th>

                  ))}

                </tr>

              </thead>

              {/* TABLE BODY */}
              <tbody>

                {paginatedData?.length > 0 ? (

                  paginatedData.map((item) => (

                    <tr
                      key={item?._id}
                      className="
                        border-b border-gray-100
                        hover:bg-gray-50
                        transition-all duration-200
                      "
                    >

                      {/* USER */}
                      <td className="px-6 py-5">

                        <div
                          className="
                            flex items-center
                            gap-3
                            min-w-[220px]
                          "
                        >

                          <div
                            className="
                              w-12 h-12
                              rounded-full
                              bg-gray-100
                              flex items-center justify-center
                              flex-shrink-0
                            "
                          >

                            <FaUserCircle
                              size={28}
                              className="text-gray-500"
                            />

                          </div>

                          <div>

                            <h4
                              className="
                                text-[15px]
                                font-semibold
                                text-[#111827]
                              "
                            >
                              {item?.name || "N/A"}
                            </h4>

                            <p className="text-sm text-gray-500">
                              Contact User
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* PHONE */}
                      <td
                        className="
                          px-6 py-5
                          text-center
                          whitespace-nowrap
                        "
                      >

                        <div
                          className="
                            flex items-center
                            justify-center
                            gap-2
                          "
                        >

                          <MdPhone
                            size={18}
                            className="text-green-500"
                          />

                          <span className="text-gray-700">
                            {item?.phone_number || "N/A"}
                          </span>

                        </div>

                      </td>

                      {/* EMAIL */}
                      <td
                        className="
                          px-6 py-5
                          text-center
                          whitespace-nowrap
                        "
                      >

                        <div
                          className="
                            flex items-center
                            justify-center
                            gap-2
                          "
                        >

                          <MdOutlineMail
                            size={18}
                            className="text-blue-500"
                          />

                          <span className="text-gray-700">
                            {item?.email || "N/A"}
                          </span>

                        </div>

                      </td>

                      {/* SERVICE */}
                      <td className="px-6 py-5 text-center">

                        <span
                          className="
                            inline-flex
                            px-4 py-2
                            rounded-full
                            bg-black
                            text-white
                            text-sm
                            capitalize
                          "
                        >
                          {item?.services || "N/A"}
                        </span>

                      </td>

                      {/* MESSAGE */}
                      <td
                        className="
                          px-6 py-5
                          text-center
                          max-w-[300px]
                        "
                      >

                        <p
                          className="
                            text-gray-600
                            line-clamp-2
                          "
                        >
                          {item?.message || "N/A"}
                        </p>

                      </td>

                      {/* DATE */}
                      <td
                        className="
                          px-6 py-5
                          text-center
                          whitespace-nowrap
                        "
                      >

                        <div>

                          <p className="font-medium text-gray-700">
                            {moment(
                              item?.created_at
                            ).format("DD MMM YYYY")}
                          </p>

                          <p className="text-sm text-gray-400 mt-1">
                            {moment(
                              item?.created_at
                            ).format("hh:mm A")}
                          </p>

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan={6}
                      className="
                        text-center
                        py-16
                        text-gray-500
                        text-[16px]
                      "
                    >
                      No Contact Found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (

            <div
              className="
                flex items-center
                justify-center
                gap-2
                px-6 py-5
                border-t border-gray-100
                bg-[#FAFAFA]
              "
            >

              {/* PREV */}
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  handlePageChange(currentPage - 1)
                }
                className="
                  px-4 py-2
                  rounded-xl
                  border border-gray-200
                  bg-white
                  disabled:opacity-50
                  hover:bg-black hover:text-white
                  transition-all duration-200
                "
              >
                Prev
              </button>

              {/* PAGE NUMBERS */}
              {[...Array(totalPages)].map((_, index) => {

                const page = index + 1;

                return (

                  <button
                    key={page}
                    onClick={() =>
                      handlePageChange(page)
                    }
                    className={`
                      w-10 h-10 rounded-xl
                      text-sm font-semibold
                      transition-all duration-200
                      ${
                        currentPage === page
                          ? "bg-black text-white"
                          : "bg-white border border-gray-200 hover:bg-gray-100"
                      }
                    `}
                  >
                    {page}
                  </button>

                );
              })}

              {/* NEXT */}
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  handlePageChange(currentPage + 1)
                }
                className="
                  px-4 py-2
                  rounded-xl
                  border border-gray-200
                  bg-white
                  disabled:opacity-50
                  hover:bg-black hover:text-white
                  transition-all duration-200
                "
              >
                Next
              </button>

            </div>

          )}

        </div>

      </div>

    </AdminLayout>
  );
}