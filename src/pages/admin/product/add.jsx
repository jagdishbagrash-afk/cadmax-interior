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
    discount_amount : "",
    terms: "",
    subsubcategory :""
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
    title: "",
    hex: c.hex,

    amount: "",
    discount_amount: 10,

    selected: false,
    stock: "",
    images: [],
    previews: []
  }))
);

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const updateVariantField = (index, field, value) => {
  setVariants(prev =>
    prev.map((v, i) =>
      i === index
        ? { ...v, [field]: value }
        : v
    )
  );
};

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
          subsubcategory : data.subsubcategory?._id || ""
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
    if (form?.category) {
      fetchSubCategories();
    }
  }, [form?.category]);


  const fetchSubSubCategories = async () => {
    try {
      const main = new Listing();
      const response = await main.getproductsubcategory(form?.subcategory);
console.log("response",response)
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
    const previews = fileArr.map(file => URL.createObjectURL(file));

    setVariants(prev =>
      prev.map((v, i) =>
        i === index
          ? {
            ...v,
            images: [...v.images, ...fileArr],     // ✅ append images
            previews: [...v.previews, ...previews] // ✅ append previews
          }
          : v
      )
    );
  };

  //   const handleVariantImages = (index, files) => {
  //   const fileArr = Array.from(files);
  //   const previews = fileArr.map(f => URL.createObjectURL(f));

  //   setVariants(prev =>
  //     prev.map((v, i) =>
  //       i === index
  //         ? {
  //             ...v,
  //             images: [...v.images, ...fileArr],       // ✅ append
  //             previews: [...v.previews, ...previews]   // ✅ append
  //           }
  //         : v
  //     )
  //   );
  // };

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];

  //   if (file) {
  //     // old preview cleanup
  //     if (imagePreview) {
  //       URL.revokeObjectURL(imagePreview);
  //     }

  //     setImage(file);
  //     setImagePreview(URL.createObjectURL(file));
  //   }
  // };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
   const selectedVariants = variants
  .filter(v => v.selected)
  .map(
    ({
      color,
      title,
      amount,
      discount_amount,
      stock,
      images
    }) => ({
      color,
      title,
      amount,
      discount_amount,
      stock,
      images
    })
  );

    if (!selectedVariants.length) {
      toast.error("Select at least one color variant");
      return;
    }

    if (!selectedVariants.every(v => v.images.length > 0)) {
      toast.error("Each selected variant must have at least one image");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        fd.append(key, value);
      });

     fd.append(
  "variants",
  JSON.stringify(
    selectedVariants.map(v => ({
      color: v.color,
      title: v.title,
      amount: v.amount,
      discount_amount: v.discount_amount,
      stock: v.stock
    }))
  )
);


      selectedVariants.forEach(v => {
        v.images.forEach(img => {
          fd.append(`variantImages_${v.color}`, img);
        });
      });

      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("stock", form.stock);
      fd.append("amount", form.amount);
      fd.append("discount_amount", form.discount_amount);
      fd.append("category", form.category); // must be _id
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
      fd.append("discount_amount", form.discount_amount);
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
      if (res?.data?.status) {
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

  console.log("subSubCategories" ,subSubCategories)

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
              name="discount_amount"
              placeholder="discount_amount"
              value={form.discount_amount}
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
            />
            <input
              type="text"
              name="dimensions"
              placeholder="Dimensions"
              value={form.dimensions}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
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
                  <option key={cat?._id} value={cat?._id} className="text-black">
                    {cat?.name}
                  </option>
                ))}
            </select>

             <select
              name="subsubcategory"
              value={form.subsubcategory}
              onChange={handleChange}
              disabled={!form.subcategory} // 🔹 Disable if category is empty
              className={`w-full border border-gray-300 rounded-lg p-3 focus:ring-2 outline-none capitalize 
                ${!form.subcategory ? "bg-gray-200 cursor-not-allowed" : "focus:ring-blue-400"}
              `}
              required
            >
              <option value="" disabled>
                {form.subcategory ? "Select Sub Sub Category" : "Select a subcategory Category first"}
              </option>

              {subSubCategories &&
                subSubCategories?.map((cat) => (
                  <option key={cat?._id} value={cat?._id} className="text-black">
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

          <div className="border rounded-lg p-5 bg-white shadow-sm space-y-5">
            <h2 className="text-xl font-semibold text-gray-800">🎨 Color Variants</h2>

            {variants.map((v, i) => (
              <div
                key={v.color}
                className="border rounded-lg p-4 bg-gray-50 hover:shadow transition"
              >
                {/* Header Row */}

                <div className="grid grid-cols-1 md:grid-cols-2 mb-4  gap-3">
  <input
    type="text"
    placeholder="Variant Title"
    value={v.title}
    onChange={(e) =>
      updateVariantField(i, "title", e.target.value)
    }
    className="border px-3 py-2 rounded"
  />

  <input
    type="text"
    placeholder="Price"
    value={v.amount}
    onChange={(e) =>
      updateVariantField(i, "amount", e.target.value)
    }
    className="border px-3 py-2 rounded"
  />

</div>
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

                {/* Expanded Section */}
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