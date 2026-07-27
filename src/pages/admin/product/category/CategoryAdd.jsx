"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Popup from "@/pages/common/Popup";
import { MdAdd, MdClose, MdEdit } from "react-icons/md";

import Listing from "@/pages/api/Listing";
import { toast } from "react-hot-toast";
// import DeleteImages from "@/components/DeleteImages"; // optional

export default function AddCategory({ fetchDatas, isEdit, item }) {
  const [isOpen, setIsOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    file: null,
    preview: "",
    SuperCategory: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
  });

  // Populate form when editing
  useEffect(() => {
    if (isEdit && item) {
      setFormData({
        name: item.name || "",
        file: null,
        preview: item.Image || "",
        SuperCategory: item?.SuperCategory?._id || "",
        // ✅ meta fields from item
        meta_title: item.meta_title || "",
        meta_description: item.meta_description || "",
        meta_keywords: item.meta_keywords || "",
      });
    }
  }, [isEdit, item]);

  // Fetch super categories for dropdown
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

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  // Universal change handler
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Image handler
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

  // Submit
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
      submitFormData.append("SuperCategory", formData.SuperCategory);

      if (formData.file) {
        submitFormData.append("Image", formData.file);
      }

      let response;
      if (isEdit) {
        response = await main.categoryUpdate(item._id, submitFormData);
      } else {
        response = await main.category(submitFormData);
      }

      if (response?.data?.status) {
        toast.success(response.data.message);
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
        fetchDatas(); // refresh parent list
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
      {/* Toggle Button */}
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
            <MdEdit size={22} className="text-blue-600" />
          ) : (
            <MdAdd size={22} className="text-blue-600" />
          )}
        </button>
      </div>

      {/* Popup */}
      {isOpen && (
        <Popup
          isOpen={isOpen}
          onClose={handleClose}
          size={"max-w-2xl"}
          className="shadow-none"
        >
          <div className="border-b border-black/10 px-4 py-4 lg:px-6 lg:py-5 flex justify-between items-center">
            <h2 className="text-xl lg:text-2xl text-[#212121] font-semibold">
              {isEdit ? "Edit" : "Add"} Category
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-700 hover:text-gray-900"
            >
              <MdClose size={24} />
            </button>
          </div>

          <div className="py-4 px-4">
          

            {/* Category Name */}
            <div className="mb-4">
              <label className="block text-[14px] font-medium text-[#3E3E3E] mb-1 text-left">
                Category Name
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
                Category Image
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

            {/* ✅ Meta Fields – using handleInputChange */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Meta Title (SEO)"
                value={formData.meta_title}
                onChange={(e) => handleInputChange("meta_title", e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Meta Description"
                value={formData.meta_description}
                onChange={(e) => handleInputChange("meta_description", e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Meta Keywords (comma separated)"
                value={formData.meta_keywords}
                onChange={(e) => handleInputChange("meta_keywords", e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
              />
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