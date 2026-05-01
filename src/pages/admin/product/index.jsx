"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "../common/AdminLayout";
import { MdAdd, MdEdit } from "react-icons/md";
import Link from "next/link";
import Listing from "@/pages/api/Listing";
import moment from "moment";
import BlockUnblock from "../common/BlockUnblock";
import { formatMultiPrice } from "@/components/ValueDataHook";

export default function Index() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const main = new Listing();
      const response = await main.getAllproducts();
      setData(response.data?.data || []);
    } catch (error) {
      console.log("Error:", error);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout page={"Product List"}>
      <div className="p-5">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <h2 className="text-xl font-bold text-gray-800">
            Product List
          </h2>

          <div className="flex flex-wrap gap-2 items-center">

            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
            />

            <Link
              href="/admin/category"
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm"
            >
              Category
            </Link>

            <Link
              href="/admin/subcategory"
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm"
            >
              Subcategory
            </Link>

            <Link
              href="/admin/product/add"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-1 text-sm"
            >
              <MdAdd /> Add
            </Link>

          </div>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-2xl shadow-md border Z-[0]">

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">

              {/* HEAD */}
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr className="text-center">
                  <th className="px-6 py-3">Image</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">SubCategory</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Action</th>
                  <th className="px-6 py-3">Delete</th>

                </tr>
              </thead>

              {/* BODY */}
              <tbody className="divide-y">

                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr
                      key={item._id}
                      className={`hover:bg-gray-50 transition
                      ${item?.deletedAt ? "opacity-50" : ""}`}
                    >

                      {/* IMAGE */}
                      <td className="px-6 py-4 text-center">
                        <img
                          src={item?.variants?.[0]?.images?.[0] || "/no-image.png"}
                          className="w-16 h-16 object-cover rounded-lg border mx-auto"
                          alt="product"
                        />
                      </td>

                      {/* TITLE */}
                      <td className="px-6 py-4 text-center font-medium text-gray-800 capitalize">
                        {item.title}
                      </td>

                      {/* CATEGORY */}
                      <td className="px-6 py-4 text-center capitalize">
                        {item?.category?.name || "-"}
                      </td>

                      {/* SUBCATEGORY */}
                      <td className="px-6 py-4 text-center capitalize">
                        {item?.subcategory?.name || "-"}
                      </td>

                      {/* PRICE */}
                      <td className="px-6 py-4 text-center font-semibold text-gray-700">
                        {formatMultiPrice(item?.amount, "INR")}
                      </td>

                      {/* STOCK */}
                      <td className="px-6 py-4 text-left">
                        {item?.variants?.map((v) => (
                          <div key={v.color} className="flex justify-between text-xs">
                            <span className="capitalize">{v.color}</span>
                            <span className="font-semibold">{v.stock}</span>
                          </div>
                        ))}

                        <div className="mt-1 border-t pt-1 text-xs font-bold text-gray-700">
                          Total:{" "}
                          {item?.variants?.reduce(
                            (sum, v) => sum + (Number(v.stock) || 0),
                            0
                          )}
                        </div>
                      </td>

                      {/* DATE */}
                      <td className="px-6 py-4 text-center text-gray-500">
                        {moment(item.createdAt).format("DD MMM YYYY")}
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">

                          <Link
                            href={`/admin/product/edit?id=${item._id}`}
                            className="cursor-pointer m-auto flex items-center justify-center
                    w-[42px] h-[42px] rounded-lg 
                    border border-gray-200 shadow-sm 
                    bg-white hover:bg-gray-50 transition-all duration-200"
                          >
                            <MdEdit size={20} />
                          </Link>

                         

                        </div>
                      </td>

                   <td className="px-6 py-4 text-center text-gray-500">

                         <BlockUnblock
                            Id={item._id}
                            fetchData={fetchData}
                            step={4}
                            status={item?.deletedAt ? true : false}
                          />
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-gray-400">
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