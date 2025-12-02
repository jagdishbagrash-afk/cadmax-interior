"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "../common/AdminLayout";
import Listing from "@/pages/api/Listing";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

export default function Add() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState({
    title: "",
    content: "",
    scope: "",
    area: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  // const fetchServicesData = async () => {
  //   try {
  //     const main = new Listing();
  //     const response = await main.getServicesbyId(id);

  //     const data = response?.data?.data;
  //     if (data) {
  //       setForm({
  //         title: data.title || "",
  //         description: data.description || "",
  //         stock: data.stock ?? "",
  //         amount: data.amount ?? "",
  //         category: data.category?._id || "",
  //         subcategory: data.subcategory?._id || "",
  //         dimensions: data.dimensions || "",
  //         material: data.material || "",
  //         Services: data.Services || "",
  //         terms: data.terms || "",
  //       });
  //     setImagePreview(data.image || "");
  //     setImage(null);
  //     }
  //   } catch (error) {
  //     console.log("Error:", error);
  //   }
  // };


  // useEffect(() => {
  //   if(id){
  //     fetchServicesData();
  //   }
  // }, [id]);

  // console.log("id", id);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("content", form.content);
      fd.append("area", form.area);
      fd.append("scope", form.scope);
      fd.append("category", form.category); // must be _id
      fd.append("subcategory", form.subcategory);
      fd.append("dimensions", form.dimensions);
      fd.append("material", form.material);
      fd.append("Services", form.Services);
      fd.append("terms", form.terms);
      if (image instanceof File) {
        fd.append("image", image);
      }
      const main = new Listing();
      const res = await main.ServicesAdd(fd);
      if(res?.data?.status){
        toast.success(res?.data?.message);
        setForm({
          title: "",
          description: "",
          stock: "",
          amount: "",
          category: "",
          subcategory: "",
          dimensions: "",
          material: "",
          Services: "",
          terms: "",
        });
        setImage(null);
        router.push("/admin/Services");
      } else {
        toast.error(data.message || "Failed to add Services");
      }
    } catch (error) {
      toast.error("Internal Server Error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("stock", form.stock);
      fd.append("amount", form.amount);
      fd.append("category", form.category); // must be _id
      fd.append("subcategory", form.subcategory);
      fd.append("dimensions", form.dimensions);
      fd.append("material", form.material);
      fd.append("Services", form.Services);
      fd.append("terms", form.terms);
      if (image instanceof File) {
        fd.append("image", image);
      }
      const main = new Listing();
      const res = await main.editServices(id, fd);
      if(res?.data?.status){
        toast.success(res?.data?.message);
        setForm({
          title: "",
          description: "",
          stock: "",
          amount: "",
          category: "",
          subcategory: "",
          dimensions: "",
          material: "",
          Services: "",
          terms: "",
        });
        setImage(null);
        router.push("/admin/Services");
      } else {
        toast.error(data.message || "Failed to edit Services");
      }
    } catch (error) {
      toast.error("Internal Server Error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // console.log("form", form);

  return (
    <AdminLayout page={"Services List"}>
      <div className="bg-white p-8 border border-blue-100">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">{id ? "Edit" : "Add"} Services</h1>

        <form className="space-y-4" onSubmit={id ? handleEdit : handleSubmit}>
          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Services Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Services Description"
            value={form.content}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

           <textarea
            name="area"
            placeholder="Services Area"
            value={form.area}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />


           <textarea
            name="scope"
            placeholder="Services Scope"
            value={form.scope}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />



          {/* Image Upload */}
          <label className="block text-gray-700 font-medium mt-4">
            Services Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            required
          />

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-3 w-32 h-32 object-cover rounded-md border border-gray-200"
            />
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium mt-4 hover:bg-blue-700 transition cursor-pointer"
          >
            {loading ? "Submitting..." : `Submit`}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}