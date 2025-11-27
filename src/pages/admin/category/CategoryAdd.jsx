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
  console.log("item", item)
  // Single state for form data
  const [formData, setFormData] = useState({
    name: "",
    file: null,
    preview: "",
    SuperCategory: ""
  });

  useEffect(() => {
    if (isEdit && item) {
      setFormData({
        name: item.name || "",
        file: null,
        preview: item.Image || "",
        SuperCategory: item?.SuperCategory?._id || ""
      });
    }
  }, [isEdit, item]);

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
      if (formData.file) {
        submitFormData.append("Image", formData.file);
      }
      submitFormData.append("SuperCategory", formData.SuperCategory);
      // const response = await main.category(submitFormData);
      let response;
      if (isEdit) {
        response = await main.categoryUpdate(item._id, submitFormData);
      } else {
        response = await main.category(submitFormData);
      }
      console.log("response", response)
      if (response?.data?.status) {
        toast.success(response.data.message);
        // Reset form data
        setFormData({
          name: "",
          file: null,
          preview: ""
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
              {isEdit ? ("Edit") : ("Add")} Category
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-700 hover:text-gray-900"
            >
              <MdClose size={24} />
            </button>
          </div>            {/* Header */}


          {/* Body */}
          {/* Body */}
          <div className="py-4 px-4">
            {/* Category Name */}
            {/* <div className="mb-4">
              <label className="block text-[14px] font-medium text-[#3E3E3E] Creato mb-1 text-left">

                Main Category
              </label>
              <select
                className="w-full px-4 lg:px-5 py-2 border h-[48px] lg:h-[56px] border-[#F4F6F8] rounded-[6px] lg:rounded-[10px] bg-[#F4F6F8] focus:outline-none focus:ring-1 focus:ring-[#c9c9c9]"
                value={formData?.SuperCategory}
                onChange={(e) => handleInputChange("SuperCategory", e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {data?.map((item) => (
                  <option value={item._id} key={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div> */}
            <div className="mb-4">
              <label className="block text-[14px] font-medium text-[#3E3E3E] Creato mb-1 text-left">
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
              <label className="block text-[14px] font-medium text-[#3E3E3E] Creato mb-1 text-left">
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
                {processing ? "Processing..." : "Submit"}
              </button>
            </div>
          </div>
        </Popup>
      )}
    </>
  );
}