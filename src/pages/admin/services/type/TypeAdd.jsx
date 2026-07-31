"use client";

import { useState, useEffect } from "react";
import { MdAdd, MdClose, MdEdit } from "react-icons/md";
import Popup from "@/pages/common/Popup";
import Listing from "@/pages/api/Listing";
import { toast } from "react-hot-toast";

export default function TypeAdd({ fetchDatas, isEdit, item }) {
  const [isOpen, setIsOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Form state with meta fields
  const [formData, setFormData] = useState({
    title: "",
    file: null,
    preview: "",
    TypeServices: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
  });

  // Populate on edit
  useEffect(() => {
    if (isEdit && item) {
      setFormData({
        title: item.title || "",
        file: null,
        preview: item.Image || "",
        TypeServices: item.TypeServices || "",
        meta_title: item.meta_title || "",
        meta_description: item.meta_description || "",
        meta_keywords: item.meta_keywords || "",
      });
    }
  }, [isEdit, item]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Only JPG, PNG, WEBP allowed");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    handleInputChange("file", selectedFile);
    handleInputChange("preview", URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (processing) return;
    setProcessing(true);

    try {
      const main = new Listing();
      const submitFormData = new FormData();

      submitFormData.append("title", formData.title);
      submitFormData.append("TypeServices", formData.TypeServices);
      submitFormData.append("meta_title", formData.meta_title || "");
      submitFormData.append("meta_description", formData.meta_description || "");
      submitFormData.append("meta_keywords", formData.meta_keywords || "");

      if (formData.file) {
        submitFormData.append("Image", formData.file);
      }

      let response;

      if (isEdit) {
        response = await main.ServicesTypeUpdate(item._id, submitFormData);
      } else {
        response = await main.servicestype(submitFormData);
      }

      if (response?.data?.status) {
        toast.success(response.data.message);

        // Reset – fixed field names
        setFormData({
          title: "",
          file: null,
          preview: "",
          TypeServices: "",
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
      toast.error(err?.response?.data?.message || "Something went wrong");
    }

    setProcessing(false);
  };

  return (
    <>
      {/* Button */}
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
        <Popup isOpen={isOpen} onClose={handleClose} size={"max-w-2xl"}>
          <div className="border-b px-4 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {isEdit ? "Edit" : "Add"} Concept Type
            </h2>
            <button type="button" onClick={handleClose}>
              <MdClose size={24} />
            </button>
          </div>

          {/* Scrollable content wrapper */}
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="py-4 px-4">
              {/* Service Type */}
              <div className="mb-4">
                <label className="block text-[14px] font-medium text-[#3E3E3E] text-left">
                  Service Type
                </label>
                <select
                  className="w-full px-4 lg:px-5 py-2 border h-[48px] lg:h-[56px] border-[#F4F6F8] rounded-[6px] lg:rounded-[10px] bg-[#F4F6F8] focus:outline-none focus:ring-1 focus:ring-[#c9c9c9]"
                  value={formData.TypeServices}
                  onChange={(e) => handleInputChange("TypeServices", e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Residential">Residential</option>
                </select>
              </div>

              {/* Service Name */}
              <div className="mb-4">
                <label className="block text-[14px] font-medium text-[#3E3E3E] text-left">
                  Service Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 lg:px-5 py-2 border h-[48px] lg:h-[56px] border-[#F4F6F8] rounded-[6px] lg:rounded-[10px] bg-[#F4F6F8] focus:outline-none focus:ring-1 focus:ring-[#c9c9c9]"
                  placeholder="Enter service title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <label className="block text-[14px] font-medium text-[#3E3E3E] text-left">
                  Service Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-4 lg:px-5 py-2 border h-[48px] lg:h-[56px] border-[#F4F6F8] rounded-[6px] lg:rounded-[10px] bg-[#F4F6F8] focus:outline-none focus:ring-1 focus:ring-[#c9c9c9]"
                  onChange={handleImageChange}
                />
                {formData.preview && (
                  <img
                    src={formData.preview}
                    className="w-32 h-32 object-cover mt-3 rounded border"
                    alt="Preview"
                  />
                )}
              </div>

              {/* ✅ Meta Fields */}
             <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 space-y-5">
            <h3 className="text-lg font-semibold text-gray-800">
              SEO <span className="text-sm text-gray-500">(Optional)</span>
            </h3>

            {/* Meta Title */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Meta Title
              </label>
              <input
                type="text"
                name="meta_title"
                placeholder="Enter Meta Title"
                value={formData.meta_title}
                                  onChange={(e) => handleInputChange("meta_title", e.target.value)}

                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Meta Description */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Meta Description
              </label>
              <input
                type="text"
                name="meta_description"
                placeholder="Enter Meta Description"
                value={formData.meta_description}
                                  onChange={(e) => handleInputChange("meta_description", e.target.value)}

                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Meta Keywords */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Meta Keywords
              </label>
              <input
                type="text"
                name="meta_keywords"
                placeholder="keyword1, keyword2, keyword3"
                value={formData.meta_keywords}
                                  onChange={(e) => handleInputChange("meta_keywords", e.target.value)}

                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate keywords with commas (,)
              </p>
            </div>
          </div>

            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-4 py-3 border-t">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={processing}
            >
              {processing ? "Processing..." : "Submit"}
            </button>
          </div>
        </Popup>
      )}
    </>
  );
}