import React from "react";
import AdminLayout from "../common/AdminLayout";
// import AddProduct from "./AddProduct";
import { MdAdd } from "react-icons/md";
import Link from "next/link";

export default function index() {
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
                  className="bg-yellow-400/20 hover:bg-yellow-400/40 px-4 py-2 rounded flex gap-2"
                >
                <MdAdd/> Product
                </Link>
              </div>
       </div>
    </AdminLayout>
  );
}