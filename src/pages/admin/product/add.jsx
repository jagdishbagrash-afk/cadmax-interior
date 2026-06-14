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
    discount_amount: "10",
    category: "",
    subcategory: "",
    dimensions: "",
    material: "",
    type: "",
    terms: "",
    subsubcategory: ""
  });
  
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const [variants, setVariants] = useState(
    AVAILABLE_COLORS.map(c => ({
      color: c.name,
      hex: c.hex,
      selected: false,
      title: `${c.name.charAt(0).toUpperCase() + c.name.slice(1)} Variant`,
      stock: "",
      images: [],
      previews: []
    }))
  );

  // New state for price sections
  const [priceSections, setPriceSections] = useState([
    {
      title: "",
      amount: "",
      discount_amount: "10",
      final_amount: 0
    }
  ]);

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
          discount_amount: data.discount_amount ?? "10",
          category: data.category?._id || "",
          subcategory: data.subcategory?._id || "",
          dimensions: data.dimensions || "",
          material: data.material || "",
          type: data.type || "",
          terms: data.terms || "",
          subsubcategory: data.subsubcategory?._id || ""
        });
        setImagePreview(data.image || "");
        setImage(null);

        // Load variants if exists
        if (data.variants && data.variants.length > 0) {
          const updatedVariants = AVAILABLE_COLORS.map(color => {
            const existingVariant = data.variants.find(v => v.color === color.name);
            if (existingVariant) {
              return {
                color: color.name,
                hex: color.hex,
                selected: true,
                title: existingVariant.title || `${color.name.charAt(0).toUpperCase() + color.name.slice(1)} Variant`,
                stock: existingVariant.stock,
                images: [],
                previews: [],
                existingImages: existingVariant.images || []
              };
            }
            return {
              color: color.name,
              hex: color.hex,
              selected: false,
              title: `${color.name.charAt(0).toUpperCase() + color.name.slice(1)} Variant`,
              stock: "",
              images: [],
              previews: []
            };
          });
          setVariants(updatedVariants);
        }

        // Load price sections
        if (data.product_price_section && data.product_price_section.length > 0) {
          setPriceSections(data.product_price_section);
        }
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
    if (form?.category) {
      fetchSubCategories();
    }
  }, [form?.category]);

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

  useEffect(() => {
    if (id) {
      fetchProductData();
    }
  }, [id]);

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

  const updateVariantTitle = (index, value) => {
    setVariants(prev =>
      prev.map((v, i) =>
        i === index ? { ...v, title: value } : v
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
    const previews = fileArr.map(file => URL.createObjectURL(file));

    setVariants(prev =>
      prev.map((v, i) =>
        i === index
          ? {
            ...v,
            images: [...v.images, ...fileArr],
            previews: [...v.previews, ...previews]
          }
          : v
      )
    );
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    setVariants(prev =>
      prev.map((v, i) => {
        if (i !== variantIndex) return v;

        const newImages = [...v.images];
        const newPreviews = [...v.previews];

        URL.revokeObjectURL(newPreviews[imageIndex]);

        newImages.splice(imageIndex, 1);
        newPreviews.splice(imageIndex, 1);

        return {
          ...v,
          images: newImages,
          previews: newPreviews
        };
      })
    );
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedVariants = variants
      .filter(v => v.selected)
      .map(({ color, title, stock, images, existingImages }) => ({
        color,
        title,
        stock,
        images: images.length > 0 ? images : (existingImages || [])
      }));

    if (!selectedVariants.length) {
      toast.error("Select at least one color variant");
      return;
    }

    if (!selectedVariants.every(v => v.images.length > 0)) {
      toast.error("Each selected variant must have at least one image");
      return;
    }

    // Validate price sections
    const validPriceSections = priceSections.filter(section => section.title && section.amount);
    if (validPriceSections.length > 0) {
      for (const section of validPriceSections) {
        if (!section.title || !section.amount) {
          toast.error("Each price section must have a title and amount");
          return;
        }
      }
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        fd.append(key, value);
      });

      fd.append("variants", JSON.stringify(
        selectedVariants.map(({ color, title, stock }) => ({
          color,
          title,
          stock
        }))
      ));

      fd.append("product_price_section", JSON.stringify(validPriceSections));

      selectedVariants.forEach(v => {
        v.images.forEach(img => {
          if (img instanceof File) {
            fd.append(`variantImages_${v.color}`, img);
          }
        });
      });

      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("stock", form.stock);
      fd.append("amount", form.amount);
      fd.append("discount_amount", form.discount_amount);
      fd.append("category", form.category);
      fd.append("subcategory", form.subcategory);
      fd.append("subsubcategory", form.subsubcategory);
      fd.append("dimensions", form.dimensions);
      fd.append("material", form.material);
      fd.append("type", form.type);
      fd.append("terms", form.terms);
      
      if (image instanceof File) {
        fd.append("image", image);
      }
      
      const main = new Listing();
      const res = await main.productAdd(fd);
      if (res?.data?.status) {
        toast.success(res?.data?.message);
        setForm({
          title: "",
          description: "",
          stock: "",
          amount: "",
          discount_amount: "10",
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
        toast.error(res?.data?.message || "Failed to add product");
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
    
    const selectedVariants = variants
      .filter(v => v.selected)
      .map(({ color, title, stock, images, existingImages }) => ({
        color,
        title,
        stock,
        images: images.length > 0 ? images : (existingImages || [])
      }));

    const validPriceSections = priceSections.filter(section => section.title && section.amount);

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("stock", form.stock);
      fd.append("amount", form.amount);
      fd.append("discount_amount", form.discount_amount);
      fd.append("category", form.category);
      fd.append("subcategory", form.subcategory);
      fd.append("subsubcategory", form.subsubcategory);
      fd.append("dimensions", form.dimensions);
      fd.append("material", form.material);
      fd.append("type", form.type);
      fd.append("terms", form.terms);
      fd.append("variants", JSON.stringify(
        selectedVariants.map(({ color, title, stock, images }) => ({
          color,
          title,
          stock,
          images: images.filter(img => typeof img === 'string') // Keep existing image URLs
        }))
      ));
      fd.append("product_price_section", JSON.stringify(validPriceSections));
      
      selectedVariants.forEach(v => {
        v.images.forEach(img => {
          if (img instanceof File) {
            fd.append(`variantImages_${v.color}`, img);
          }
        });
      });
      
      if (image instanceof File) {
        fd.append("image", image);
      }
      
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
              name="amount"
              placeholder="Price (₹)"
              value={form.amount}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
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
              <option value="" disabled>Select Category</option>
              {categories && categories?.map((cat) => (
                <option key={cat?._id} value={cat?._id} className="text-black">
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
                ${!form.category ? "bg-gray-200 cursor-not-allowed" : "focus:ring-blue-400"}`}
              required
            >
              <option value="" disabled>
                {form.category ? "Select SubCategory" : "Select a Category first"}
              </option>
              {subCategories && subCategories?.map((cat) => (
                <option key={cat?._id} value={cat?._id} className="text-black">
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
                ${!form.subcategory ? "bg-gray-200 cursor-not-allowed" : "focus:ring-blue-400"}`}
            >
              <option value="" disabled>
                {form.subcategory ? "Select Sub Sub Category" : "Select a subcategory first"}
              </option>
              {subSubCategories && subSubCategories?.map((cat) => (
                <option key={cat?._id} value={cat?._id} className="text-black">
                  {cat?.name}
                </option>
              ))}
            </select>
          </div>
  {/* Price Sections Component */}
          <div className="border rounded-lg p-5 bg-white shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">💰 Price Sections</h2>
              <button
                type="button"
                onClick={addPriceSection}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                + Add Section
              </button>
            </div>

            {priceSections.map((section, idx) => (
              <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                  
                    {priceSections.length > 1 && (
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
          <div className="border rounded-lg p-5 bg-white shadow-sm space-y-5">
            <h2 className="text-xl font-semibold text-gray-800">🎨 Color Variants</h2>

            {variants.map((v, i) => (
              <div key={v.color} className="border rounded-lg p-4 bg-gray-50 hover:shadow transition">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={v.selected}
                      onChange={() => toggleVariant(i)}
                      className="w-4 h-4"
                    />
                    <span
                      className="w-6 h-6 rounded-full border shadow"
                      style={{ backgroundColor: v.hex }}
                    />
                    <span className="capitalize font-medium text-gray-700">
                      {v.color}
                    </span>
                  </label>
                </div>

                {v.selected && (
                  <div className="mt-4 pl-6 space-y-4">
                    {/* Stock Input */}
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        placeholder="Enter stock"
                        value={v.stock}
                        onChange={(e) => updateVariantStock(i, e.target.value)}
                        className="w-full mt-1 rounded border px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        required
                      />
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Upload Images
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleVariantImages(i, e.target.files)}
                        className="mt-1 block w-full text-sm file:bg-blue-600 file:text-white file:px-4 file:py-1 file:border-none file:rounded cursor-pointer"
                      />
                    </div>

                    {/* Image Preview */}
                    {v.previews.length > 0 && (
                      <div className="flex gap-3 flex-wrap mt-2">
                        {v.previews.map((src, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={src}
                              className="w-20 h-20 object-cover rounded-lg border shadow-sm"
                              alt={`Preview ${idx}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeVariantImage(i, idx)}
                              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white text-xs hidden group-hover:flex items-center justify-center"
                              title="Remove Image"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Existing Images Preview for Edit */}
                    {v.existingImages && v.existingImages.length > 0 && v.previews.length === 0 && (
                      <div className="flex gap-3 flex-wrap mt-2">
                        {v.existingImages.map((src, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={src}
                              className="w-20 h-20 object-cover rounded-lg border shadow-sm"
                              alt={`Existing ${idx}`}
                            />
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
            {loading ? "Submitting..." : (id ? "Update Product" : "Add Product")}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}