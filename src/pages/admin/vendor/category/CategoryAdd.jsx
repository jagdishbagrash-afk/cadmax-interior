"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Popup from "@/pages/common/Popup";
import { MdAdd, MdClose, MdEdit } from "react-icons/md";

import Listing from "@/pages/api/Listing";
import { toast } from "react-hot-toast";

export default function AddCategory({ fetchDatas, isEdit, item }) {
  const [isOpen, setIsOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Form data with meta fields
  const [formData, setFormData] = useState({
    name: "",
    file: null,
    preview: "",
    SuperCategory: "", // included for consistency (though not used in UI)
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
  });

  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      const main = new Listing();
      const response = await main.SupercategoryList();
      if (response.data?.data) {
        setData(response.data.data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (isEdit && item) {
      setFormData({
        name: item.name || "",
        file: null,
        preview: item.Image || "",
        SuperCategory: item?.SuperCategory?._id || "",
        meta_title: item.meta_title || "",
        meta_description: item.meta_description || "",
        meta_keywords: item.meta_keywords || "",
      });
    }
  }, [isEdit, item]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  // Handle form data changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Image Change Handler
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Only JPG, PNG, or WEBP images are allowed");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    handleInputChange("file", selectedFile);
    handleInputChange("preview", URL.createObjectURL(selectedFile));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (processing) return;
    setProcessing(true);

    try {
      const main = new Listing();
      const submitFormData = new FormData();
      submitFormData.append("name", formData.name);
      submitFormData.append("meta_title", formData.meta_title || "");
      submitFormData.append("meta_description", formData.meta_description || "");
      submitFormData.append("meta_keywords", formData.meta_keywords || "");
      if (formData.file) {
        submitFormData.append("Image", formData.file);
      }
      // If SuperCategory is needed, uncomment:
      // submitFormData.append("SuperCategory", formData.SuperCategory);

      let response;
      if (isEdit) {
        response = await main.vednorcategoryUpdate(item._id, submitFormData);
      } else {
        response = await main.vendorcategory(submitFormData);
      }

      if (response?.data?.status) {
        toast.success(response.data.message);
        // Reset form data
        setFormData({
          name: "",
          file: null,
          preview: "",
          SuperCategory: "",
          meta_title: "",
          meta_description: "",
          meta_keywords: "",
        });
        handleClose();
        fetchDatas();
      } else {
        toast.error(response?.data?.message || "Error occurred");
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }

    setProcessing(false);
  };

  return (
    <>
      {/* Add Button */}
      <div className="flex justify-center items-center">
        <button
          onClick={handleOpen}
          className="cursor-pointer m-auto flex items-center justify-center
             w-[42px] h-[42px]
             rounded-lg border border-gray-200 shadow-sm 
             bg-white hover:bg-gray-50
             transition-all duration-200"
        >
          {isEdit ? (
            <MdEdit
              size={22}
              className="text-blue-600 group-hover:text-blue-700 transition"
            />
          ) : (
            <MdAdd
              size={22}
              className="text-blue-600 group-hover:text-blue-700 transition"
            />
          )}
        </button>
      </div>

      {/* Popup Modal */}
      {isOpen && (
        <Popup
          isOpen={isOpen}
          onClose={handleClose}
          size={"max-w-2xl"}
          className="shadow-none"
        >
          <div className="border-b border-black/10 px-4 py-4 lg:px-6 lg:py-5 flex justify-between items-center">
            <h2 className="text-xl lg:text-2xl text-[#212121] font-semibold">
              {isEdit ? "Edit" : "Add"} Vendor Category
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-700 hover:text-gray-900"
            >
              <MdClose size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="py-4 px-4">
            <div className="mb-4">
              <label className="block text-[14px] font-medium text-[#3E3E3E] mb-1 text-left">
                Vendor Category Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 h-[48px] lg:h-[56px] border border-[#F4F6F8] rounded-[10px] bg-[#F4F6F8] focus:ring-1 focus:ring-gray-300 outline-none"
                placeholder="Enter category name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            {/* Category Image */}
            <div className="mb-4">
              <label className="block text-[14px] font-medium text-[#3E3E3E] mb-1 text-left">
                Vendor Category Image
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full px-4 py-2 h-[48px] lg:h-[56px] border border-[#F4F6F8] rounded-[10px] bg-[#F4F6F8]"
                onChange={handleImageChange}
              />
              {formData.preview && (
                <img
                  src={formData.preview}
                  alt="Preview"
                  className="w-32 h-32 object-cover mt-3 rounded border"
                />
              )}
            </div>

            {/* ✅ Meta Fields */}
              <div className="border border-gray-200 rounded-xl p-2 bg-gray-50 mb-2">
  <h3 className="text-lg font-semibold text-gray-800 mb-5">
    SEO <span className="text-sm font-normal text-gray-500">(Optional)</span>
  </h3>

  {/* Meta Title */}
  <div className="mb-2">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Meta Title
    </label>
    <input
      type="text"
      placeholder="Enter Meta Title"
      value={formData.meta_title}
      onChange={(e) => handleInputChange("meta_title", e.target.value)}
      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
    />
  </div>

  {/* Meta Description */}
  <div className="mb-2">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Meta Description
    </label>
    <input
      type="text"
      placeholder="Enter Meta Description"
      value={formData.meta_description}
      onChange={(e) =>
        handleInputChange("meta_description", e.target.value)
      }
      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
    />
  </div>

  {/* Meta Keywords */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Meta Keywords
    </label>
    <input
      type="text"
      placeholder="e.g. web development, react, nextjs"
      value={formData.meta_keywords}
      onChange={(e) => handleInputChange("meta_keywords", e.target.value)}
      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
    />
    <p className="mt-1 text-xs text-gray-500">
      Separate multiple keywords with commas (,).
    </p>
  </div>
</div>

            {/* Footer Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                disabled={processing}
              >
                {processing ? "Processing..." : "Submit"}
              </button>
            </div>
          </div>
        </Popup>
      )}
    </>
  );
}