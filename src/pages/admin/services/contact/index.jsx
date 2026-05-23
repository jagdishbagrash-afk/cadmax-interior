"use client";

import { useEffect, useMemo, useState } from "react";
import Listing from "@/pages/api/Listing";
import AdminLayout from "../../common/AdminLayout";
import Link from "next/link";
import moment from "moment";

export default function Index() {

  const [data, setData] = useState([]);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 15;

  /* FETCH DATA */
  const fetchData = async () => {
    try {
      const main = new Listing();

      const response = await main.GetServicesContact();

      if (response?.data?.data?.contactget) {
        setData(response.data.data.contactget);
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

  /* PAGINATION LOGIC */
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = useMemo(() => {

    const startIndex = (currentPage - 1) * itemsPerPage;

    const endIndex = startIndex + itemsPerPage;

    return data.slice(startIndex, endIndex);

  }, [data, currentPage]);

  return (
    <AdminLayout page={"Craft for you"}>

      <div className="px-4 py-2 lg:px-4 lg:py-2.5">

        <div className="bg-white rounded-[20px] mb-[10px] p-2 shadow-sm">

          {/* HEADER */}
          <div className="px-4 py-3 flex flex-wrap justify-between items-center border-b border-black/10">

            <h2 className="Creato uppercase text-[16px] lg:text-[18px] font-medium text-[#1E1E1E]">
              Craft for you
            </h2>

            <Link
              href="/admin/services/services"
              className="Creato text-[14px] lg:text-[16px] text-white bg-black rounded-full px-4 py-2 hover:bg-gray-800 transition"
            >
              Concept Listing
            </Link>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 mt-4">

            <table className="min-w-full divide-y divide-gray-200">

              {/* TABLE HEAD */}
              <thead className="bg-gray-50 sticky top-0 z-10">

                <tr>

                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">
                    Name
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">
                    Phone
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">
                    Email
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">
                    Concept
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">
                    Service Type
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">
                    Service Model
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">
                    Cost
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">
                    Timeline
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase text-center">
                    Created Date
                  </th>

                </tr>

              </thead>

              {/* TABLE BODY */}
              <tbody className="bg-white divide-y divide-gray-100">

                {paginatedData?.length > 0 ? (

                  paginatedData.map((item) => {

                    const user = item?.User || {};

                    const serviceType = item?.ServicesType || {};

                    const service = item?.Services || {};

                    return (

                      <tr
                        key={item?._id}
                        className="hover:bg-gray-50 transition"
                      >

                        {/* NAME */}
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          {user?.name ||
                            item?.assignedTo?.name ||
                            "N/A"}
                        </td>

                        {/* PHONE */}
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          {user?.phone ||
                            item?.assignedTo?.phone ||
                            "N/A"}
                        </td>

                        {/* EMAIL */}
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          {user?.email ||
                            item?.assignedTo?.email ||
                            "N/A"}
                        </td>

                        {/* CONCEPT */}
                        <td className="px-4 py-3 text-center capitalize whitespace-nowrap">
                          {item?.concept || "N/A"}
                        </td>

                        {/* SERVICE TYPE */}
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          {serviceType?.title || "N/A"}
                        </td>

                        {/* SERVICE MODEL */}
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          {service?.title || "N/A"}
                        </td>

                        {/* COST */}
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          {service?.cost || "N/A"}
                        </td>

                        {/* TIMELINE */}
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          {service?.timeline || "N/A"}
                        </td>

                        {/* CREATED DATE */}
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          {item?.createdAt
                            ? moment(item.createdAt).format(
                                "DD MMM YYYY, hh:mm A"
                              )
                            : "N/A"}
                        </td>

                      </tr>
                    );
                  })

                ) : (

                  <tr>

                    <td
                      colSpan={9}
                      className="px-6 py-10 text-center text-gray-500 text-[15px]"
                    >
                      No Booking Found
                    </td>

                  </tr>
                )}

              </tbody>

            </table>

          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (

            <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">

              {/* PREVIOUS */}
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.max(prev - 1, 1)
                  )
                }
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition
                ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-black hover:text-white"
                }`}
              >
                Previous
              </button>

              {/* PAGE NUMBERS */}
              {[...Array(totalPages)]?.map((_, index) => {

                const page = index + 1;

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition
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
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition
                ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-black hover:text-white"
                }`}
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