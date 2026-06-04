"use client";
import { useEffect, useState } from "react";
import Listing from "@/pages/api/Listing";
import AdminLayout from "./common/AdminLayout";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import moment from "moment";

export default function Index() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch Data
  const fetchData = async () => {
    try {
      const main = new Listing();
      const response = await main.Leadget();
      if (response?.data?.data) {
        setData(response.data.data);
        setFilteredData(response.data.data);
      } else {
        setData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.log("Error:", error);
      setData([]);
      setFilteredData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Search
  useEffect(() => {
    const result = data.filter((item) => {
      const searchValue = search.toLowerCase();

      return (
        item?.name?.toLowerCase()?.includes(searchValue) ||
        item?.phone?.toString()?.includes(searchValue) ||
        item?.pageurl?.toLowerCase()?.includes(searchValue) ||
        item?.source?.toLowerCase()?.includes(searchValue) ||
        item?.type?.toLowerCase()?.includes(searchValue) ||
        item?.services?.toLowerCase()?.includes(searchValue) ||
        item?.category?.toLowerCase()?.includes(searchValue)
      );
    });

    setFilteredData(result);
    setCurrentPage(1);
  }, [search, data]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Status Update
  const handleStatusChange = async (id, status) => {
    try {
      const main = new Listing();

      const response = await main.LeadStatusUpdate(id, {
        status,
      });

      if (response?.data?.status) {
        toast.success("Status Updated");

        const updated = data.map((item) =>
          item._id === id ? { ...item, status } : item
        );

        setData(updated);
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // Delete Lead
  const handleDelete = async (id) => {
    try {
      const main = new Listing();

      const response = await main.LeadDelete(id);

      if (response?.data?.status) {
        toast.success("Lead Deleted");

        const updated = data.filter((item) => item._id !== id);

        setData(updated);
      }
    } catch (error) {
      toast.error("Failed to delete lead");
    }
  };

  // Status Color Classes
  const getStatusClasses = (status) => {
    switch (status) {

      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      case "contacted":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "completed":
        return "bg-green-100 text-green-700 border-green-200";

      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };


  return (
    <AdminLayout page={"Lead List"}>
      <div className="px-3 py-3 lg:px-5">

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>
              <h2 className="text-xl font-semibold text-[#171717]">
                Lead Listing
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Total Leads : {filteredData?.length}
              </p>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search name, phone, source..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full lg:w-[320px]
                border border-gray-200
                px-4 py-3 rounded-xl
                text-sm outline-none
                focus:ring-2 focus:ring-black/10
              "
            />

          </div>

          {/* Table */}
          <div className="overflow-x-auto">

            <table className="min-w-[1400px] w-full">

              {/* Head */}
              <thead className="bg-[#FAFAFA] border-b border-gray-100">

                <tr>
                  {[
                    "Name",
                    "Phone",
                    "Email",
                    "Page URL",
                    "Source",
                    "Type",
                    "Services",
                    "Category",
                    "Created Date",
                    "Status",
                    "Message",
                    "Action",
                  ].map((head) => (
                    <th
                      key={head}
                      className="
          px-4 py-4 text-center
          text-xs font-bold uppercase
          text-[#6B7280]
          whitespace-nowrap
        "
                    >
                      {head}
                    </th>
                  ))}
                </tr>

              </thead>

              {/* Body */}
              <tbody>

                {paginatedData?.length > 0 ? (
                  paginatedData.map((item) => {

                    const name =
                      item?.assignedTo?.name || item?.name || "N/A";

                    const phone =
                      item?.assignedTo?.phone || item?.phone || "N/A";

                    const email =
                      item?.assignedTo?.email || item?.email || "N/A";

                    return (
                      <tr
                        key={item?._id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                      >

                        {/* NAME */}
                        <td className="px-4 py-4 text-center font-medium whitespace-nowrap">
                          {name}
                        </td>

                        {/* PHONE */}
                        <td className="px-4 py-4 text-center whitespace-nowrap">
                          {phone}
                        </td>

                        {/* EMAIL */}
                        <td className="px-4 py-4 text-center whitespace-nowrap">
                          {email}
                        </td>

                        {/* PAGE URL */}
                        <td className="px-4 py-4 text-center whitespace-nowrap">
                          {item?.pageurl ? (
                            <a
                              href={item?.pageurl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              Open Link
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </td>

                        {/* SOURCE */}
                        <td className="px-4 py-4 text-center capitalize whitespace-nowrap">
                          {item?.source || "N/A"}
                        </td>

                        {/* TYPE */}
                        <td className="px-4 py-4 text-center capitalize whitespace-nowrap">
                          {item?.type || "Lead"}
                        </td>

                        {/* SERVICES */}
                        <td className="px-4 py-4 text-center capitalize whitespace-nowrap">
                          {item?.services || "N/A"}
                        </td>

                        {/* CATEGORY */}
                        <td className="px-4 py-4 text-center capitalize whitespace-nowrap">
                          {item?.category || "N/A"}
                        </td>

                        {/* CREATED DATE */}
                        <td className="px-4 py-4 text-center whitespace-nowrap">
                          {item?.createdAt
                            ? moment(item?.createdAt).format(
                              "DD MMM YYYY, hh:mm A"
                            )
                            : "N/A"}
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-4 text-center">

                          <select
                            value={item?.status || "pending"}
                            onChange={(e) =>
                              handleStatusChange(
                                item?._id,
                                e.target.value
                              )
                            }
                            className={`
                px-3 py-2 rounded-xl text-sm font-medium
                border outline-none capitalize
                transition-all duration-200
                ${getStatusClasses(item?.status)}
              `}
                          >
                            <option value="pending">
                              Pending
                            </option>

                            <option value="contacted">
                              Contacted
                            </option>

                            <option value="completed">
                              Completed
                            </option>

                            <option value="rejected">
                              Rejected
                            </option>
                          </select>

                        </td>

                        {/* MESSAGE */}
                        <td className="px-4 py-4 text-center max-w-[250px]">
                          <p className="line-clamp-2 break-words">
                            {item?.message || "N/A"}
                          </p>
                        </td>

                        {/* ACTION */}
                        <td className="px-4 py-4 text-center">

                          <button
                            onClick={() =>
                              handleDelete(item?._id)
                            }
                            className="
                w-10 h-10 rounded-xl
                bg-red-50 text-red-500
                hover:bg-red-100
                flex items-center justify-center
                mx-auto transition
              "
                          >
                            <MdDelete size={18} />
                          </button>

                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={12}
                      className="text-center py-14 text-gray-500"
                    >
                      No Leads Found
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

          {/* Pagination */}
          {totalPages > 1 && (

            <div className="p-4 flex items-center justify-center gap-2 border-t border-gray-100 flex-wrap">

              {/* Prev */}
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((prev) => prev - 1)
                }
                className="
                  px-4 py-2 rounded-xl border
                  disabled:opacity-40
                "
              >
                Prev
              </button>

              {/* Page Numbers */}
              {[...Array(totalPages)]?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`
                    w-10 h-10 rounded-xl border text-sm
                    ${currentPage === index + 1
                      ? "bg-black text-white"
                      : "bg-white"
                    }
                  `}
                >
                  {index + 1}
                </button>
              ))}

              {/* Next */}
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => prev + 1)
                }
                className="
                  px-4 py-2 rounded-xl border
                  disabled:opacity-40
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