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
    { name: "brown", hex: "#92400e" },
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
    subsubcategory: "",
    discount_amount: ""
  });
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  // State for price sections
  const [priceSections, setPriceSections] = useState([]);

  const [variants, setVariants] = useState(
    AVAILABLE_COLORS.map((c) => ({
      color: c.name,
      hex: c.hex,
      selected: false,
      title: `${c.name.charAt(0).toUpperCase() + c.name.slice(1)} Variant`,
      stock: "",
      images: [], // ✅ existing URLs
      newImages: [], // ✅ new File objects
    }))
  );

  const fetchProduct = async () => {
    const res = await new Listing().getProductbyId(id);
    const data = res?.data?.data;
    if (!data) return;

    setForm({
      title: data.title,
      description: data.description,
      amount: data.amount,
      category: data.category?._id || "",
      subcategory: data.subcategory?._id || "",
      subsubcategory: data.subsubcategory?._id || "",
      dimensions: data.dimensions,
      material: data.material,
      type: data.type,
      terms: data.terms,
      discount_amount: data.discount_amount || "",
    });

    setImagePreview(data.image || "");

    // Load price sections
    if (data.product_price_section && data.product_price_section.length > 0) {
      setPriceSections(data.product_price_section);
    } else {
      setPriceSections([]);
    }

    setVariants((prev) =>
      prev.map((v) => {
        const found = data.variants?.find((x) => x.color === v.color);
        return found
          ? {
            ...v,
            selected: true,
            title: found.title || `${v.color.charAt(0).toUpperCase() + v.color.slice(1)} Variant`,
            stock: found.stock,
            images: found.images || [],
            newImages: [],
          }
          : v;
      })
    );
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
    if (form?.category) {
      fetchSubCategories();
    }
  }, [form?.category]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const toggleVariant = (index) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, selected: !v.selected } : v))
    );
  };

  const updateVariantTitle = (index, value) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, title: value } : v))
    );
  };

  const updateVariantStock = (index, value) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, stock: value } : v))
    );
  };

  const addNewImages = (i, files) =>
    setVariants((v) =>
      v.map((x, idx) =>
        idx === i ? { ...x, newImages: [...x.newImages, ...files] } : x
      )
    );

  const removeExistingImage = (i, imgIndex) =>
    setVariants((v) =>
      v.map((x, idx) =>
        idx === i
          ? { ...x, images: x.images.filter((_, k) => k !== imgIndex) }
          : x
      )
    );

  const removeNewImage = (i, imgIndex) =>
    setVariants((v) =>
      v.map((x, idx) =>
        idx === i
          ? { ...x, newImages: x.newImages.filter((_, k) => k !== imgIndex) }
          : x
      )
    );

  // Price Section Handlers
  const addPriceSection = () => {
    setPriceSections([
      ...priceSections,
      {
        title: "",
        amount: "",
        discount_amount: "10",
        final_amount: 0
      }
    ]);
  };

  const removePriceSection = (index) => {
    setPriceSections(priceSections.filter((_, i) => i !== index));
  };

  const updatePriceSection = (index, field, value) => {
    const updated = [...priceSections];
    updated[index][field] = value;
    
    // Auto-calculate final amount
    if (field === 'amount' || field === 'discount_amount') {
      const amount = parseFloat(updated[index].amount) || 0;
      const discount = parseFloat(updated[index].discount_amount) || 10;
      updated[index].final_amount = amount - (amount * discount) / 100;
    }
    
    setPriceSections(updated);
  };

  const fetchSubSubCategories = async () => {
    try {
      const main = new Listing();
      const response = await main.getproductsubcategory(form?.subcategory);
      console.log("response", response)
      if (response.data?.data) {
        setSubSubCategories(response.data.data);
      } else {
        setSubSubCategories([]);
      }
    } catch (error) {
      console.log("Error:", error);
      setSubSubCategories([]);
    }
  };

  useEffect(() => {
    if (form?.subcategory) {
      fetchSubSubCategories();
    }
  }, [form?.subcategory]);

  const handleEdit = async (e) => {
    e.preventDefault();
    
    const selectedVariants = variants.filter(v => v.selected);
    
    if (!selectedVariants.length) {
      toast.error("Select at least one color variant");
      return;
    }

    if (!selectedVariants.every(v => (v.images.length > 0 || v.newImages.length > 0))) {
      toast.error("Each selected variant must have at least one image");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("stock", form.stock);
      fd.append("amount", form.amount);
      fd.append("category", form.category);
      fd.append("subcategory", form.subcategory);
      fd.append("subsubcategory", form.subsubcategory);
      fd.append("dimensions", form.dimensions);
      fd.append("material", form.material);
      fd.append("type", form.type);
      fd.append("discount_amount", form.discount_amount);
      fd.append("terms", form.terms);
      
      // Append variants with title
      fd.append(
        "variants",
        JSON.stringify(
          selectedVariants.map(v => ({
            color: v.color,
            title: v.title,
            stock: v.stock,
            images: v.images // Send existing image URLs
          }))
        )
      );
      
      // Append price sections
      const validPriceSections = priceSections.filter(section => section.title && section.amount);
      if (validPriceSections.length > 0) {
        fd.append("product_price_section", JSON.stringify(validPriceSections));
      }
      
      // Append new images
      selectedVariants.forEach(v =>
        v.newImages.forEach(img =>
          fd.append(`variantImages_${v.color}`, img)
        )
      );
      
      const main = new Listing();
      const res = await main.editProduct(id, fd);
      if (res?.data?.status) {
        toast.success(res?.data?.message);
        router.push("/admin/product");
      } else {
        toast.error(res?.data?.message || "Failed to edit product");
      }
    } catch (error) {
      toast.error("Internal Server Error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout page={"Product List"}>
      <div className="bg-white p-8 border border-blue-100">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">
          {"Edit"} Product
        </h1>

        <form className="space-y-4" onSubmit={handleEdit}>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              {categories &&
                categories?.map((cat) => (
                  <option key={cat?._id} value={cat?._id}>
                    {cat?.name}
                  </option>
                ))}
            </select>

            <select
              name="subcategory"
              value={form.subcategory}
              onChange={handleChange}
              disabled={!form.category}
              className={`w-full border border-gray-300 rounded-lg p-3 focus:ring-2 outline-none capitalize 
                ${!form.category
                  ? "bg-gray-200 cursor-not-allowed"
                  : "focus:ring-blue-400"
                }
              `}
              required
            >
              <option value="" disabled>
                {form.category
                  ? "Select SubCategory"
                  : "Select a Category first"}
              </option>
              {subCategories &&
                subCategories?.map((cat) => (
                  <option key={cat?._id} value={cat?._id}>
                    {cat?.name}
                  </option>
                ))}
            </select>

            <select
              name="subsubcategory"
              value={form.subsubcategory}
              onChange={handleChange}
              disabled={!form.subcategory}
              className={`w-full border border-gray-300 rounded-lg p-3 focus:ring-2 outline-none capitalize 
                ${!form.subcategory ? "bg-gray-200 cursor-not-allowed" : "focus:ring-blue-400"}
              `}
            >
              <option value="" disabled>
                {form.subcategory ? "Select Sub Sub Category" : "Select a subcategory first"}
              </option>
              {subSubCategories &&
                subSubCategories?.map((cat) => (
                  <option key={cat?._id} value={cat?._id} className="text-black">
                    {cat?.name}
                  </option>
                ))}
            </select>
          </div>

              {/* Price Sections Component */}
          <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">💰 Price Sections</h2>
              <button
                type="button"
                onClick={addPriceSection}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
              >
                + Add Section
              </button>
            </div>

            {priceSections.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No price sections added. Click "Add Section" to create one.
              </div>
            )}

            {priceSections?.map((section, idx) => (
              <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input
                    type="text"
                    placeholder="Section Title (e.g., Standard Pack)"
                    value={section.title}
                    onChange={(e) => updatePriceSection(idx, 'title', e.target.value)}
                    className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={section.amount}
                    onChange={(e) => updatePriceSection(idx, 'amount', e.target.value)}
                    className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                 
                    {priceSections.length > 0 && (
                      <button
                        type="button"
                        onClick={() => removePriceSection(idx)}
                        className="w-full max-w-[50px] bg-red-600 text-white px-3 rounded-lg hover:bg-red-700"
                      >
                        ✕
                      </button>
                    )}
                  </div>
              </div>
            ))}
          </div>

          {/* Material, Type, Terms */}
          <textarea
            name="material"
            placeholder="Material"
            value={form.material}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          <textarea
            name="type"
            placeholder="Product Care"
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

      

          {/* Color Variants Component */}
          <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">🎨 Color Variants</h2>

            {variants.map((v, i) => (
              <div
                key={v.color}
                className={`rounded-lg border p-4 transition 
      ${v.selected ? "bg-blue-50 border-blue-400" : "bg-gray-50"}`}
              >
                {/* Header */}
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={v.selected}
                      onChange={() => toggleVariant(i)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span
                      className="w-6 h-6 rounded-full border shadow-sm"
                      style={{ background: v.hex }}
                    />
                    <span className="capitalize font-medium text-gray-700">
                      {v.color}
                    </span>
                  </div>
                </label>

                {/* Expanded Section */}
                {v.selected && (
                  <div className="mt-4 ml-7 space-y-4">
                    {/* Variant Title */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600">
                        Variant Title
                      </label>
                      <input
                        type="text"
                        value={v.title}
                        onChange={e => updateVariantTitle(i, e.target.value)}
                        className="w-full mt-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="Enter variant title"
                        required
                      />
                    </div>

                    {/* Stock */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        value={v.stock}
                        onChange={e => updateVariantStock(i, e.target.value)}
                        className="w-full mt-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="Enter stock"
                      />
                    </div>

                    {/* Upload */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600">
                        Upload Images
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={e => addNewImages(i, [...e.target.files])}
                        className="mt-1 block w-full text-sm 
                file:bg-blue-600 file:text-white 
                file:px-4 file:py-1 
                file:rounded file:border-none 
                hover:file:bg-blue-700 cursor-pointer"
                      />
                    </div>

                    {/* Images */}
                    {(v.images.length > 0 || v.newImages.length > 0) && (
                      <div className="flex flex-wrap gap-3">
                        {v.images.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={img}
                              className="w-20 h-20 rounded-lg border object-cover shadow"
                              alt={`Existing ${idx}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(i, idx)}
                              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white text-xs hidden group-hover:flex items-center justify-center"
                            >
                              ✕
                            </button>
                          </div>
                        ))}

                        {v.newImages.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={URL.createObjectURL(img)}
                              className="w-20 h-20 rounded-lg border object-cover shadow"
                              alt={`New ${idx}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeNewImage(i, idx)}
                              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white text-xs hidden group-hover:flex items-center justify-center"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium mt-4 hover:bg-blue-700 transition cursor-pointer disabled:bg-gray-400"
          >
            {loading ? "Submitting..." : `Update Product`}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}