"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Popup from "@/pages/common/Popup";
import { MdAdd, MdClose } from "react-icons/md";
import Listing from "@/pages/api/Listing";
import { toast } from "react-hot-toast";

export default function AddSuperCategory() {
  const [isOpen, setIsOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Single state for form data
  const [formData, setFormData] = useState({
    name: "",
    file: null,
    preview: ""
  });

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  // Handle form data changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Image Change Handler
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    // Allowed File Types
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Only JPG, PNG, or WEBP images are allowed");
      return;
    }

    // File Size Validation
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    handleInputChange("file", selectedFile);
    handleInputChange("preview", URL.createObjectURL(selectedFile));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    console.log("Hello")
    e.preventDefault();
    if (processing) return;
    setProcessing(true);
    console.log("Hell2o")

    try {
      const main = new Listing();
      const submitFormData = new FormData();
      submitFormData.append("name", formData.name);
      submitFormData.append("Image", formData.file);
      const response = await main.Supercategory(submitFormData);
      if (response?.data?.status) {
        toast.success(response.data.message);
        // Reset form data
        setFormData({
          name: "",
          file: null,
          preview: ""
        });
        handleClose();
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
          className="cursor-pointer text-black bg-yellow-400/20 hover:bg-yellow-400/40 rounded-md shadow-md inline-flex items-center gap-2 px-4 py-2 font-medium"
        >
          <MdAdd size={18} />
          Add Main Category
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
          <div className="relative bg-white w-full rounded-[30px] lg:rounded-[40px] h-auto mx-auto">

            {/* Header */}
            <div className="border-b border-black/10 px-4 py-4 lg:px-6 lg:py-5 flex justify-between items-center">
              <h2 className="text-xl lg:text-2xl text-[#212121] font-semibold">
                Add Main Category
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
            <div className="py-6 lg:py-8 px-6 lg:px-10">
              {/* Category Name */}
              <div className="mb-6 lg:mb-10">
                <label className="block text-base font-medium text-[#727272] mb-1">
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
              <div className="mb-6 lg:mb-10">
                <label className="block text-base font-medium text-[#727272] mb-1">
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

              {/* Footer Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                >
                  No
                </button>
                <button
                  onClick={handleSubmit}
                  className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  {processing ? "Processing..." : "Yes"}
                </button>
              </div>
            </div>
          </div>
        </Popup>
      )}
    </>
  );
}