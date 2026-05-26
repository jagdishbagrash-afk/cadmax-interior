"use client";

import { useState, useEffect } from "react";
import Popup from "@/pages/common/Popup";
import { MdAdd, MdClose, MdEdit } from "react-icons/md";
import Listing from "@/pages/api/Listing";
import { toast } from "react-hot-toast";

export default function AddProduct({ fetchDatas, isEdit = false, item }) {
  const [isOpen, setIsOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  /* =======================
     FORM STATE
  ======================== */
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    stock: "",
    amount: "",
    superCategory: "",
    subcategory: "",
    category: "",
    file: null,
    preview: "",
    discount_amount :""
  });

  /* =======================
     DROPDOWN DATA
  ======================== */
  const [superCategories, setSuperCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);

  /* =======================
     PREFILL FOR EDIT
  ======================== */
  useEffect(() => {
    if (isEdit && item) {
      setFormData({
        title: item.title || "",
        description: item.description || "",
        stock: item.stock || "",
        amount: item.amount || "",
        discount_amount: item.discount_amount || "",

        superCategory: item?.superCategory?._id || "",
        subcategory: item?.subcategory?._id || "",
        category: item?.category?._id || "",
        file: null,
        preview: item.image || "",
      });
    }
  }, [isEdit, item]);

  /* =======================
     FETCH SUPER CATEGORIES
  ======================== */
  useEffect(() => {
    const fetchSuperCategories = async () => {
      try {
        const main = new Listing();
        const res = await main.SupercategoryList();
        if (res?.data?.data) {
          setSuperCategories(res.data.data);
        }
      } catch {
        toast.error("Failed to load super categories");
      }
    };
    fetchSuperCategories();
  }, []);

  /* =======================
     FETCH SUBCATEGORY
  ======================== */
  useEffect(() => {
    if (!formData.superCategory) return;

    const fetchSubcategories = async () => {
      try {
        const main = new Listing();
        const res = await main.SubcategoryList(formData.superCategory);
        if (res?.data?.data) {
          setSubcategories(res.data.data);
        }
      } catch {
        toast.error("Failed to load subcategories");
      }
    };

    fetchSubcategories();
    setFormData(prev => ({
      ...prev,
      subcategory: "",
      category: "",
    }));
    setCategories([]);
  }, [formData.superCategory]);

  /* =======================
     FETCH CATEGORY
  ======================== */
  useEffect(() => {
    if (!formData.subcategory) return;

    const fetchCategories = async () => {
      try {
        const main = new Listing();
        const res = await main.CategoryList(formData.subcategory);
        if (res?.data?.data) {
          setCategories(res.data.data);
        }
      } catch {
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
    setFormData(prev => ({ ...prev, category: "" }));
  }, [formData.subcategory]);

  /* =======================
     HANDLERS
  ======================== */
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPG, PNG or WEBP allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max image size is 5MB");
      return;
    }

    setFormData(prev => ({
      ...prev,
      file,
      preview: URL.createObjectURL(file),
    }));
  };

  /* =======================
     SUBMIT
  ======================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (processing) return;
    setProcessing(true);

    try {
      const main = new Listing();
      const fd = new FormData();

      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("stock", formData.stock);
      fd.append("amount", formData.amount);
      fd.append("discount_amount", formData.discount_amount);

      fd.append("superCategory", formData.superCategory);
      fd.append("subcategory", formData.subcategory);
      fd.append("category", formData.category);

      if (formData.file) {
        fd.append("image", formData.file);
      }

      let res;
      if (isEdit) {
        res = await main.updateProduct(item._id, fd);
      } else {
        res = await main.addProduct(fd);
      }

      if (res?.data?.status) {
        toast.success(res.data.message);
        fetchDatas();
        handleClose();
      } else {
        toast.error(res?.data?.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Server error");
    } finally {
      setProcessing(false);
    }
  };

  /* =======================
     JSX
  ======================== */
  return (
    <>
      <button
        onClick={handleOpen}
        className="bg-yellow-400/20 hover:bg-yellow-400/40 px-4 py-2 rounded flex gap-2"
      >
        {isEdit ? <MdEdit /> : <MdAdd />} Product
      </button>
      {isOpen && (
        <Popup isOpen={isOpen} onClose={handleClose} size="max-w-2xl">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">

            <h2 className="text-xl font-semibold">
              {isEdit ? "Edit Product" : "Add Product"}
            </h2>

            {/* SUPER CATEGORY */}
            <select required value={formData.superCategory}
              onChange={e => handleInputChange("superCategory", e.target.value)}>
              <option value="">Select Super Category</option>
              {superCategories.map(sc =>
                <option key={sc._id} value={sc._id}>{sc.name}</option>
              )}
            </select>

            {/* SUB CATEGORY */}
            <select required value={formData.subcategory}
              onChange={e => handleInputChange("subcategory", e.target.value)}>
              <option value="">Select Subcategory</option>
              {subcategories.map(sub =>
                <option key={sub._id} value={sub._id}>{sub.name}</option>
              )}
            </select>

            {/* CATEGORY */}
            <select required value={formData.category}
              onChange={e => handleInputChange("category", e.target.value)}>
              <option value="">Select Category</option>
              {categories.map(cat =>
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              )}
            </select>

            <input required placeholder="Title"
              value={formData.title}
              onChange={e => handleInputChange("title", e.target.value)} />

            <textarea required placeholder="Description"
              value={formData.description}
              onChange={e => handleInputChange("description", e.target.value)} />

            <input required type="number" placeholder="Stock"
              value={formData.stock}
              onChange={e => handleInputChange("stock", e.target.value)} />

            <input required type="number" placeholder="Amount"
              value={formData.amount}
              onChange={e => handleInputChange("amount", e.target.value)} />

                  <input required type="number" placeholder="discount_amount"
              value={formData.discount_amount}
              onChange={e => handleInputChange("discount_amount", e.target.value)} />

            <input type="file" accept="image/*" onChange={handleImageChange} />

            {formData.preview && (
              <img src={formData.preview} className="w-28 h-28 rounded" />
            )}

            <div className="flex justify-end gap-3">
              <button type="button" onClick={handleClose}>Cancel</button>
              <button type="submit" disabled={processing}>
                {processing ? "Saving..." : "Save"}
              </button>
            </div>

          </form>
        </Popup>
      )}
    </>
  );
}