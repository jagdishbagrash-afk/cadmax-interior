import React, { useEffect, useState } from "react";
import AdminLayout from "../common/AdminLayout";
import { MdAdd } from "react-icons/md";
import Link from "next/link";
import Listing from "@/pages/api/Listing";
import moment from "moment";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaUndo } from 'react-icons/fa'; 
import BlockUnblock from "../common/BlockUnblock";
import { formatMultiPrice } from "@/components/ValueDataHook";

export default function index() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const main = new Listing();
      const response = await main.getAllproducts();
      if (response.data?.data) {
        setData(response.data.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.log("Error:", error);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log("data", data);

  return (
    <AdminLayout page={"Product List"}>
      <div className="min-h-screen p-5 lg:p-[30px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-extrabold uppercase text-[#171717]">
            Product List
          </h2>
          <Link
            href="/admin/product/add"
            className="bg-blue-500 text-white px-4 py-2 rounded-md flex gap-2 items-center hover:bg-blue-600"
          >
            <MdAdd size={18} /> Add Product
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm mt-2">
            <table className="min-w-full divide-y divide-gray-200 whitespace-nowrap">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase text-center">
                    Image
                  </th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase text-center">
                    Title
                  </th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase text-center">
                    Category
                  </th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase text-center">
                    SubCategory
                  </th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase text-center">
                    Price
                  </th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase text-center">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase text-center">
                    Created Date
                  </th>
                  <th className="px-6 py-4 text-[14px] font-semibold text-gray-600 uppercase text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {data?.length > 0 ? (
                  data?.map((item) => (
                    <tr key={item?._id} className={`transition hover:bg-gray-50
                      ${item?.deletedAt ? "opacity-50" : ""}
                    `}>
                      {/* Image */}
                      <td className="px-6 py-4 text-center">
                        <img
                          src={item?.variants[0]?.images[0]}
                          className="w-20 h-20 object-cover rounded-md shadow-sm mx-auto"
                          alt="Product"
                        />
                      </td>

                      {/* Title */}
                      <td className="px-6 py-4 text-center text-[15px] text-gray-800 font-medium capitalize">
                        {item?.title}
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-center text-[15px] text-gray-800 capitalize">
                        {item?.category?.name}
                      </td>

                      {/* SubCategory */}
                      <td className="px-6 py-4 text-center text-[15px] text-gray-800 capitalize">
                        {item?.subcategory?.name}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-center text-[15px] text-gray-600">
                        {formatMultiPrice(item?.amount, "INR")}
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4 text-left text-[14px] text-gray-800">
                        {item?.variants?.map((v) => (
                          <div key={v.color} className="capitalize">
                            {v.color}: {v.stock}
                          </div>
                        ))}

                        <div className="mt-1 pt-1 border-t text-[13px] font-medium">
                          Total:{" "}
                          {item?.variants?.reduce(
                            (sum, v) => sum + (Number(v.stock) || 0),
                            0
                          )}
                        </div>
                      </td>
                      {/* Created Date */}
                      <td className="px-6 py-4 text-center text-[14px] text-gray-600">
                        {moment(item?.createdAt).format("DD-MM-YYYY")}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-3">
                          {/* Edit */}
                          <Link
                            className="text-blue-500 hover:text-blue-700 cursor-pointer"
                            href={`/admin/product/edit?id=${item?._id}`}
                          >
                            <MdEdit size={22}/>
                          </Link>
                          <BlockUnblock
                            Id={item._id}
                            fetchData={fetchData}
                            step={4}
                            status={item?.deletedAt ? true : false}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-8 text-center text-gray-500 text-[15px]"
                    >
                      No Products Found
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