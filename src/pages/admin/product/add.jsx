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
    description: "",
    stock: "",
    amount: "",
    category: "",
    subcategory: "",
    dimensions: "",
    material: "",
    product: "",
    terms: "",
  });
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProductData = async () => {
    try {
      const main = new Listing();
      const response = await main.getProductbyId(id);

      const data = response?.data?.data;
      if (data) {
        setForm({
          title: data.title || "",
          description: data.description || "",
          stock: data.stock ?? "",
          amount: data.amount ?? "",
          category: data.category?._id || "",
          subcategory: data.subcategory?._id || "",
          dimensions: data.dimensions || "",
          material: data.material || "",
          product: data.product || "",
          terms: data.terms || "",
        });
      setImagePreview(data.image || "");
      setImage(null);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const main = new Listing();
      const response = await main.categoryList();

      if (response.data?.data) {
        setCategories(response.data.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.log("Error:", error);
      setCategories([]);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const main = new Listing();
      const response = await main.getSubcategorybyCategory(form?.category);

      if (response.data?.data) {
        setSubCategories(response.data.data);
      } else {
        setSubCategories([]);
      }
    } catch (error) {
      console.log("Error:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);


  useEffect(() => {
    if(form?.category){
      fetchSubCategories();
    }
  }, [form?.category]);

  useEffect(() => {
    if(id){
      fetchProductData();
    }
  }, [id]);

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
      fd.append("description", form.description);
      fd.append("stock", form.stock);
      fd.append("amount", form.amount);
      fd.append("category", form.category); // must be _id
      fd.append("subcategory", form.subcategory);
      fd.append("dimensions", form.dimensions);
      fd.append("material", form.material);
      fd.append("product", form.product);
      fd.append("terms", form.terms);
      if (image instanceof File) {
        fd.append("image", image);
      }
      const main = new Listing();
      const res = await main.productAdd(fd);
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
          product: "",
          terms: "",
        });
        setImage(null);
        router.push("/admin/product");
      } else {
        toast.error(data.message || "Failed to add product");
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
      fd.append("product", form.product);
      fd.append("terms", form.terms);
      if (image instanceof File) {
        fd.append("image", image);
      }
      const main = new Listing();
      const res = await main.editProduct(id, fd);
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
          product: "",
          terms: "",
        });
        setImage(null);
        router.push("/admin/product");
      } else {
        toast.error(data.message || "Failed to edit product");
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
    <AdminLayout page={"Product List"}>
      <div className="bg-white p-8 border border-blue-100">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">{id ? "Edit" : "Add"} Product</h1>

        <form className="space-y-4" onSubmit={id ? handleEdit : handleSubmit}>
          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Product Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Product Description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          {/* Stock & Price */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
            <input
              type="number"
              name="amount"
              placeholder="Price (₹)"
              value={form.amount}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Category / Subcategory */}
          <div className="grid grid-cols-2 gap-4">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none capitalize"
              required
            >
              <option value="" disabled>
                Select Category
              </option>

              {categories && categories?.map((cat) => (
                <option key={cat?._id} value={cat?._id}>
                  {cat?.name}
                </option>
              ))}
            </select>

           <select
              name="subcategory"
              value={form.subcategory}
              onChange={handleChange}
              disabled={!form.category} // 🔹 Disable if category is empty
              className={`w-full border border-gray-300 rounded-lg p-3 focus:ring-2 outline-none capitalize 
                ${!form.category ? "bg-gray-200 cursor-not-allowed" : "focus:ring-blue-400"}
              `}
              required
            >
              <option value="" disabled>
                {form.category ? "Select SubCategory" : "Select a Category first"}
              </option>

              {subCategories &&
                subCategories?.map((cat) => (
                  <option key={cat?._id} value={cat?._id}>
                    {cat?.name}
                  </option>
                ))}
            </select>
          </div>

          {/* New String Fields */}
          <textarea
            type="text"
            name="dimensions"
            placeholder="Dimensions"
            value={form.dimensions}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          <textarea
            type="text"
            name="material"
            placeholder="Material"
            value={form.material}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          <textarea
            type="text"
            name="product"
            placeholder="Product Type"
            value={form.product}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          <textarea
            name="terms"
            placeholder="Terms & Conditions"
            value={form.terms}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          {/* Image Upload */}
          <label className="block text-gray-700 font-medium mt-4">
            Product Image
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