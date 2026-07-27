"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "../common/AdminLayout";
import Listing from "@/pages/api/Listing";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

export default function Edit() {
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
    discount_amount: "",
    label_category: "",
    label_size: "",
     meta_title: "",
  meta_description: "",
  meta_keywords: "",
  });
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------- PRICE MODE ----------
  const [priceMode, setPriceMode] = useState("single"); // "single" | "multiple"

  // Price sections – default with one empty section and one empty size
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

  const [variants, setVariants] = useState(
    AVAILABLE_COLORS.map((c) => ({
      color: c.name,
      hex: c.hex,
      selected: false,
      title: `${c.name.charAt(0).toUpperCase() + c.name.slice(1)} Variant`,
      stock: "",
      images: [],
      newImages: [],
    }))
  );

  // ---------- HANDLE PRICE MODE CHANGE ----------
  const handlePriceModeChange = (mode) => {
    setPriceMode(mode);
    if (mode === "single") {
      // Reset price sections to default empty state
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
    } else {
      // mode === "multiple" – clear single price fields
      setForm(prev => ({
        ...prev,
        amount: "",
        discount_amount: ""
      }));
    }
  };

  // ---------- FETCH PRODUCT DATA ----------
  const fetchProduct = async () => {
    const res = await new Listing().getProductbyId(id);
    const data = res?.data?.data;
    if (!data) return;

    setForm({
      title: data.title,
      description: data.description,
      amount: data.amount || "",
      category: data.category?._id || "",
      subcategory: data.subcategory?._id || "",
      subsubcategory: data.subsubcategory?._id || "",
      dimensions: data.dimensions,
      material: data.material,
      label_category: data?.label_category || "",
      label_size: data?.label_size || "",
      type: data.type,
      terms: data.terms,
      discount_amount: data.discount_amount || "",
      stock: data.stock || "",
      meta_title: data.meta_title || "",
  meta_description: data.meta_description || "",
  meta_keywords: data.meta_keywords || "",

    });

    setImagePreview(data.image || "");

    // Determine price mode based on existing data
    if (data.product_price_section && data.product_price_section.length > 0) {
      setPriceMode("multiple");
      // Load price sections
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
          : [
            {
              title: "",
              amount: "0",
              discount_amount: "10",
              final_amount: 0
            }
          ]
      }));
      setPriceSections(loadedSections);
    } else {
      setPriceMode("single");
      // Reset sections to default empty
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

  // ---------- FETCH CATEGORIES ----------
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

  // ---------- VARIANT HANDLERS ----------
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
    // Allow only numeric input, keep as string for editing
    // User can clear field or type any number freely
    if (value === '' || /^\d+$/.test(value)) {
      setVariants((prev) =>
        prev.map((v, i) => (i === index ? { ...v, stock: value } : v))
      );
    }
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

  // ---------- PRICE SECTION HANDLERS ----------
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

    if (field === 'amount' || field === 'discount_amount') {
      const amount = parseFloat(updated[index].amount) || 0;
      const discount = parseFloat(updated[index].discount_amount) || 10;
      updated[index].final_amount = amount - (amount * discount) / 100;
    }

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

  // ---------- FETCH SUB-SUB CATEGORIES ----------
  const fetchSubSubCategories = async () => {
    try {
      const main = new Listing();
      const response = await main.getproductsubcategory(form?.subcategory);
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

  // ---------- HANDLE EDIT SUBMIT ----------
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

    // Build price sections only if in multiple mode
    let validPriceSections = [];
    if (priceMode === "multiple") {
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
    }

    setLoading(true);
    try {
      const fd = new FormData();

      // Append common fields
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("stock", form.stock || "0");
      fd.append("category", form.category);
      fd.append("subcategory", form.subcategory);
      fd.append("subsubcategory", form.subsubcategory || "");
      fd.append("dimensions", form.dimensions);
      fd.append("material", form.material);
      fd.append("type", form.type);
      fd.append("terms", form.terms);
      fd.append("label_category", form.label_category || "");
      fd.append("label_size", form.label_size || "");
fd.append("meta_title", form.meta_title || "");
fd.append("meta_description", form.meta_description || "");
fd.append("meta_keywords", form.meta_keywords || "");
      // Price related – based on mode
      if (priceMode === "single") {
        fd.append("amount", form.amount);
        fd.append("discount_amount", form.discount_amount);
        
        // Do NOT append product_price_section
      } else {
        fd.append("product_price_section", JSON.stringify(validPriceSections));
         fd.append("amount",0);
        fd.append("discount_amount", 0);
        // Do NOT append amount/discount_amount
      }

      fd.append(
        "variants",
        JSON.stringify(
          selectedVariants.map(v => ({
            color: v.color,
            title: v.title,
            stock: v.stock,
            images: v.images
          }))
        )
      );

      selectedVariants.forEach(v =>
        v.newImages.forEach(img =>
          fd.append(`variantImages_${v.color}`, img)
        )
      );

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

  // ---------- RENDER ----------
  return (
    <AdminLayout page={"Product List"}>
      <div className="bg-white p-8 border border-blue-100">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Edit Product</h1>

        <form className="space-y-4" onSubmit={handleEdit}>
          <input
            type="text"
            name="title"
            placeholder="Product Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          <textarea
            name="description"
            placeholder="Product Description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          <div className="grid grid-cols-1 gap-4">
            {/* Dimensions only – amount will be conditionally rendered below */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none capitalize"
              required
            >
              <option value="" disabled>Select Category</option>
              {categories?.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>

            <select
              name="subcategory"
              value={form.subcategory}
              onChange={handleChange}
              disabled={!form.category}
              className={`w-full border border-gray-300 rounded-lg p-3 focus:ring-2 outline-none capitalize ${!form.category ? "bg-gray-200 cursor-not-allowed" : "focus:ring-blue-400"
                }`}
              required
            >
              <option value="" disabled>
                {form.category ? "Select SubCategory" : "Select a Category first"}
              </option>
              {subCategories?.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* ---------- PRICE MODE RADIO BUTTONS ---------- */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priceMode"
                  value="single"
                  checked={priceMode === 'single'}
                  onChange={() => handlePriceModeChange('single')}
                  className="w-4 h-4"
                />
                <span className="font-medium">Single Price</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priceMode"
                  value="multiple"
                  checked={priceMode === 'multiple'}
                  onChange={() => handlePriceModeChange('multiple')}
                  className="w-4 h-4"
                />
                <span className="font-medium">Multiple Price (Sections)</span>
              </label>
            </div>
          </div>

          {/* ---------- SINGLE PRICE INPUT ---------- */}
          {priceMode === 'single' && (
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <input
                type="number"
                name="amount"
                placeholder="Price (₹)"
                value={form.amount}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
                required
                min="0"
                step="0.01"
              />

            </div>
          )}


          {/* ---------- MULTIPLE PRICE SECTIONS ---------- */}
          {priceMode === 'multiple' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">

                <div className="w-full mt-2 mb-2  flex ">

                  <input
                    type="text"
                    placeholder="Main Title (e.g., seating ca)"
                    value={form.label_category}
                    name="label_category"
                    onChange={handleChange}
                    className="border w-full rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                </div>

                <div className="w-full mt-2 mb-2  flex ">

                  <input
                    type="text"
                    placeholder="Main Title (e.g., type ca)"
                    value={form.label_size}
                    onChange={handleChange}
                    name="label_size"   // 👈 add this

                    className="border w-full rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                </div>
              </div>
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

                {priceSections.map((section, sectionIdx) => (
                  <div key={sectionIdx} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-700">Section #{sectionIdx + 1}</h3>
                      {priceSections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePriceSection(sectionIdx)}
                          className="bg-red-600  text-white px-3 py-1 rounded-lg hover:bg-red-700 text-sm"
                        >
                          Remove Section
                        </button>
                      )}
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
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
                            <button
                              type="button"
                              onClick={() => removeSize(sectionIdx, sizeIdx)}
                              className="bg-red-500 text-white px-2 py-0.5 rounded hover:bg-red-600 text-xs"
                            >
                              Remove
                            </button>
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
            </>

          )}

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
          <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">🎨 Color Variants</h2>

            {variants.map((v, i) => (
              <div
                key={v.color}
                className={`rounded-lg border p-4 transition ${v.selected ? "bg-blue-50 border-blue-400" : "bg-gray-50"
                  }`}
              >
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
                    <span className="capitalize font-medium text-gray-700">{v.color}</span>
                  </div>
                </label>

                {v.selected && (
                  <div className="mt-4 ml-7 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600">Variant Title</label>
                      <input
                        type="text"
                        value={v.title}
                        onChange={e => updateVariantTitle(i, e.target.value)}
                        className="w-full mt-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="Enter variant title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600">Stock Quantity</label>
                      <input
                        type="number"
                        value={v.stock}
                        onChange={e => updateVariantStock(i, e.target.value)}
                        className="w-full mt-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="Enter stock"
                        min="0"
                        step="1"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600">Upload Images</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={e => addNewImages(i, [...e.target.files])}
                        className="mt-1 block w-full text-sm file:bg-blue-600 file:text-white file:px-4 file:py-1 file:rounded file:border-none hover:file:bg-blue-700 cursor-pointer"
                      />
                    </div>

                    {(v.images.length > 0 || v.newImages.length > 0) && (
                      <div className="flex flex-wrap gap-3">
                        {v.images.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img src={img} className="w-20 h-20 rounded-lg border object-cover shadow" alt="existing" />
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
                            <img src={URL.createObjectURL(img)} className="w-20 h-20 rounded-lg border object-cover shadow" alt="new" />
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
          <input
  type="text"
  name="meta_title"
  placeholder="Meta Title (SEO)"
  value={form.meta_title}
  onChange={handleChange}
  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
/>

<input
  type="text"
  name="meta_description"
  placeholder="Meta Description"
  value={form.meta_description}
  onChange={handleChange}
  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
/>

<input
  type="text"
  name="meta_keywords"
  placeholder="Meta Keywords (comma separated)"
  value={form.meta_keywords}
  onChange={handleChange}
  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
/>  

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium mt-4 hover:bg-blue-700 transition cursor-pointer disabled:bg-gray-400"
          >
            {loading ? "Submitting..." : "Update Product"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
