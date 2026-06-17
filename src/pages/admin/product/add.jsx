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

  const [priceSections, setPriceSections] = useState([
    {
      title: "",
      amount: "0",
      discount_amount: "10",
      final_amount: 0,
      sizes: [
        {
          title: "",
          amount: "0",
          discount_amount: "10",
          final_amount: 0
        }
      ]
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

        if (data.product_price_section && data.product_price_section.length > 0) {
          const loadedSections = data.product_price_section.map(section => ({
            title: section.title || "",
            amount: section.amount !== undefined && section.amount !== null ? String(section.amount) : "0",
            discount_amount: section.discount_amount || "10",
            final_amount: section.final_amount || 0,
            sizes: section.sizes && section.sizes.length > 0 
              ? section.sizes.map(size => ({
                  title: size.title || "",
                  amount: size.amount !== undefined && size.amount !== null ? String(size.amount) : "0",
                  discount_amount: size.discount_amount || "10",
                  final_amount: size.final_amount || 0
                }))
              : [{
                  title: "",
                  amount: "0",
                  discount_amount: "10",
                  final_amount: 0
                }]
          }));
          setPriceSections(loadedSections);
        } else {
          setPriceSections([
            {
              title: "",
              amount: "0",
              discount_amount: "10",
              final_amount: 0,
              sizes: [
                {
                  title: "",
                  amount: "0",
                  discount_amount: "10",
                  final_amount: 0
                }
              ]
            }
          ]);
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
      console.log("response", response);
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

  const addPriceSection = () => {
    setPriceSections([
      ...priceSections,
      {
        title: "",
        amount: "0",
        discount_amount: "10",
        final_amount: 0,
        sizes: [
          {
            title: "",
            amount: "0",
            discount_amount: "10",
            final_amount: 0
          }
        ]
      }
    ]);
  };

  const removePriceSection = (index) => {
    if (priceSections.length > 1) {
      setPriceSections(priceSections.filter((_, i) => i !== index));
    } else {
      toast.error("At least one price section is required");
    }
  };

  const updatePriceSection = (index, field, value) => {
    const updated = [...priceSections];
    updated[index][field] = value;
    setPriceSections(updated);
  };

  const addSize = (sectionIndex) => {
    const updated = [...priceSections];
    updated[sectionIndex].sizes.push({
      title: "",
      amount: "0",
      discount_amount: "10",
      final_amount: 0
    });
    setPriceSections(updated);
  };

  const removeSize = (sectionIndex, sizeIndex) => {
    const updated = [...priceSections];
    if (updated[sectionIndex].sizes.length > 1) {
      updated[sectionIndex].sizes.splice(sizeIndex, 1);
      setPriceSections(updated);
    } else {
      updated[sectionIndex].sizes[0] = {
        title: "",
        amount: "0",
        discount_amount: "10",
        final_amount: 0
      };
      setPriceSections(updated);
      toast.info("Size fields cleared. Add new size or fill in the values.");
    }
  };

  const updateSize = (sectionIndex, sizeIndex, field, value) => {
    const updated = [...priceSections];
    updated[sectionIndex].sizes[sizeIndex][field] = value;
    if (field === 'amount' || field === 'discount_amount') {
      const amount = parseFloat(updated[sectionIndex].sizes[sizeIndex].amount) || 0;
      const discount = parseFloat(updated[sectionIndex].sizes[sizeIndex].discount_amount) || 10;
      updated[sectionIndex].sizes[sizeIndex].final_amount = amount - (amount * discount) / 100;
    }
    setPriceSections(updated);
  };

  // ========== FIXED handleSubmit ==========
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

    // Build price sections – now includes section even without sizes
    const validPriceSections = [];
    
    for (const section of priceSections) {
      const hasValidTitle = section.title && section.title.trim() !== '';
      const amountNum = parseFloat(section.amount);
      const hasValidAmount = section.amount !== '' && !isNaN(amountNum) && amountNum >= 0;
      
      if (hasValidTitle && hasValidAmount) {
        const validSizes = section.sizes
          .filter(size => {
            const hasSizeTitle = size.title && size.title.trim() !== '';
            const sizeAmountNum = parseFloat(size.amount);
            const hasSizeAmount = size.amount !== '' && !isNaN(sizeAmountNum) && sizeAmountNum >= 0;
            return hasSizeTitle && hasSizeAmount;
          })
          .map(size => ({
            title: size.title.trim(),
            amount: parseFloat(size.amount),
            discount_amount: parseFloat(size.discount_amount) || 10,
            final_amount: 0
          }));
        
        // Always add section, even if validSizes is empty
        validPriceSections.push({
          title: section.title.trim(),
          amount: parseFloat(section.amount),
          discount_amount: parseFloat(section.discount_amount) || 10,
          final_amount: 0,
          sizes: validSizes  // can be []
        });
      }
    }
    
    console.log("validPriceSections", validPriceSections);

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

  // ========== FIXED handleEdit ==========
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

    const validPriceSections = [];
    
    for (const section of priceSections) {
      const hasValidTitle = section.title && section.title.trim() !== '';
      const amountNum = parseFloat(section.amount);
      const hasValidAmount = section.amount !== '' && !isNaN(amountNum) && amountNum >= 0;
      
      if (hasValidTitle && hasValidAmount) {
        const validSizes = section.sizes
          .filter(size => {
            const hasSizeTitle = size.title && size.title.trim() !== '';
            const sizeAmountNum = parseFloat(size.amount);
            const hasSizeAmount = size.amount !== '' && !isNaN(sizeAmountNum) && sizeAmountNum >= 0;
            return hasSizeTitle && hasSizeAmount;
          })
          .map(size => ({
            title: size.title.trim(),
            amount: parseFloat(size.amount),
            discount_amount: parseFloat(size.discount_amount) || 10,
            final_amount: 0
          }));
        
        validPriceSections.push({
          title: section.title.trim(),
          amount: parseFloat(section.amount),
          discount_amount: parseFloat(section.discount_amount) || 10,
          final_amount: 0,
          sizes: validSizes
        });
      }
    }

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
          images: images.filter(img => typeof img === 'string')
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          {/* Price Sections */}
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

            {priceSections.map((section, sectionIdx) => (
              <div key={sectionIdx} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-700">Section #{sectionIdx + 1}</h3>
                  {priceSections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePriceSection(sectionIdx)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-sm"
                    >
                      Remove Section
                    </button>
                  )}
                </div>
                
                {/* Main Section Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Section Title (e.g., King)"
                    value={section.title}
                    onChange={(e) => updatePriceSection(sectionIdx, 'title', e.target.value)}
                    className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Section Amount (₹) – can be 0"
                    value={section.amount}
                    onChange={(e) => updatePriceSection(sectionIdx, 'amount', e.target.value)}
                    className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Sizes Sub-section */}
                <div className="border-t border-gray-200 pt-3 mt-2">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-600">Sizes</h4>
                    <button
                      type="button"
                      onClick={() => addSize(sectionIdx)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 text-sm"
                    >
                      + Add Size
                    </button>
                  </div>
                  
                  {section.sizes.map((size, sizeIdx) => (
                    <div key={sizeIdx} className="border border-gray-300 rounded-lg p-3 mb-2 bg-white">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-gray-500">Size #{sizeIdx + 1}</span>
                        {section.sizes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSize(sectionIdx, sizeIdx)}
                            className="bg-red-500 text-white px-2 py-0.5 rounded hover:bg-red-600 text-xs"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Size Title (e.g., Small)"
                          value={size.title}
                          onChange={(e) => updateSize(sectionIdx, sizeIdx, 'title', e.target.value)}
                          className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Size Amount (₹) – can be 0"
                          value={size.amount}
                          onChange={(e) => updateSize(sectionIdx, sizeIdx, 'amount', e.target.value)}
                          className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  ))}
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

          {/* Color Variants */}
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