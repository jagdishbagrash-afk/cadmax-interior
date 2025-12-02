"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "../common/AdminLayout";
import Listing from "@/pages/api/Listing";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

export default function Add() {
  
const AVAILABLE_COLORS = [
    { name: "red", hex: "#ef4444" },
    { name: "blue", hex: "#3b82f6" },
    { name: "green", hex: "#22c55e" },
    { name: "yellow", hex: "#eab308" },
    { name: "pink", hex: "#ec4899" },
    { name: "purple", hex: "#a855f7" },
    { name: "black", hex: "#000000" },
    { name: "white", hex: "#ffffff" },
    { name: "gray", hex: "#6b7280" },
    { name: "orange", hex: "#f97316" },
    { name: "teal", hex: "#14b8a6" },
    { name: "brown", hex: "#92400e" }
  ];

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
    type: "",
    terms: "",
  });
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const [variants, setVariants] = useState(
    AVAILABLE_COLORS.map(c => ({
      color: c.name,
      hex: c.hex,
      selected: false,
      stock: "",
      images: [],
      previews: []
    }))
  );

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
          type: data.type || "",
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

  const toggleVariant = (index) => {
    setVariants(prev =>
      prev.map((v, i) =>
        i === index ? { ...v, selected: !v.selected } : v
      )
    );
  };

  const updateVariantStock = (index, value) => {
    setVariants(prev =>
      prev.map((v, i) =>
        i === index ? { ...v, stock: value } : v
      )
    );
  };

  const handleVariantImages = (index, files) => {
    const fileArr = Array.from(files);
    const previews = fileArr.map(f => URL.createObjectURL(f));

    setVariants(prev =>
      prev.map((v, i) =>
        i === index
          ? { ...v, images: fileArr, previews }
          : v
      )
    );
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
    const selectedVariants = variants
      .filter(v => v.selected)
      .map(({ color, stock, images }) => ({
        color,
        stock,
        images
      }));

    if (!selectedVariants.length) {
      toast.error("Select at least one color variant");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        fd.append(key, value);
      });

      fd.append("variants", JSON.stringify(
        selectedVariants.map(({ color, stock }) => ({
          color,
          stock
        }))
      ));

      selectedVariants.forEach(v => {
        v.images.forEach(img => {
          fd.append(`variantImages_${v.color}`, img);
        });
      });
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("stock", form.stock);
      fd.append("amount", form.amount);
      fd.append("category", form.category); // must be _id
      fd.append("subcategory", form.subcategory);
      fd.append("dimensions", form.dimensions);
      fd.append("material", form.material);
      fd.append("type", form.type);
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
          type: "",
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
      fd.append("type", form.type);
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
          type: "",
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
            {/* <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            /> */}
            <input
              type="number"
              name="amount"
              placeholder="Price (₹)"
              value={form.amount}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
            <input
              type="text"
              name="dimensions"
              placeholder="Dimensions"
              value={form.dimensions}
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
            name="type"
            placeholder="Product Type"
            value={form.type}
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

          <div className="border p-4 rounded space-y-4">
            <h2 className="font-semibold text-lg">Color Variants</h2>

            {variants.map((v, i) => (
              <div key={v.color} className="border p-3 rounded">

                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={v.selected} onChange={() => toggleVariant(i)} />
                  <span className="w-5 h-5 rounded border" style={{ backgroundColor: v.hex }} />
                  <span className="capitalize">{v.color}</span>
                </div>

                {v.selected && (
                  <div className="mt-3 pl-6 space-y-3">
                    <input type="number" placeholder="Stock" value={v.stock} onChange={(e) => updateVariantStock(i, e.target.value)} className="input" required />
                    <input type="file" multiple onChange={(e) => handleVariantImages(i, e.target.files)} />

                    <div className="flex gap-2 flex-wrap">
                      {v.previews.map((src, idx) => (
                        <img key={idx} src={src} className="w-20 h-20 object-cover rounded border" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>          

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