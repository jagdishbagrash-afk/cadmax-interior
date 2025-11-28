import React from "react";
import AdminLayout from "../common/AdminLayout";
import AddProduct from "./AddProduct";

export default function index() {
  return (
    <AdminLayout page={"Product List"}>
      <div className="min-h-screen p-5 lg:p-[30px]">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[20px] font-extrabold uppercase text-[#171717]">
                  Product List
                </h2>
                <AddProduct />
              </div>
       </div>
    </AdminLayout>
  );
}