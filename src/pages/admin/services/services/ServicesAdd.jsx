"use client";

import { useState, useEffect } from "react";
import { MdAdd, MdClose, MdEdit } from "react-icons/md";
import Popup from "@/pages/common/Popup";
import Listing from "@/pages/api/Listing";
import { toast } from "react-hot-toast";

export default function ServicesAdd({ fetchDatas, isEdit, item }) {
  const [isOpen, setIsOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    file: null,
    preview: "",
    TypeServices: ""
  });

  useEffect(() => {
    if (isEdit && item) {
      setFormData({
        title: item.title || "",
        file: null,
        preview: item.Image || "",
        TypeServices: item.TypeServices || "",
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

        setFormData({
          name: "",
          file: null,
          preview: "",
          serviceType: "",
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
              {isEdit ? "Edit" : "Add"} Services Type
            </h2>

            <button type="button" onClick={handleClose}>
              <MdClose size={24} />
            </button>
          </div>

          <div className="py-4 px-4">

            {/* Service Type */}
            <div className="mb-4">
              <label className="block text-[14px] font-medium text-[#3E3E3E] Creato  text-left">
                Service Type
              </label>

              <select
                className="w-full px-4 lg:px-5 py-2 border h-[48px] lg:h-[56px] border-[#F4F6F8] rounded-[6px] lg:rounded-[10px] bg-[#F4F6F8] focus:outline-none focus:ring-1 focus:ring-[#c9c9c9]"
                value={formData.TypeServices}
                onChange={(e) =>
                  handleInputChange("TypeServices", e.target.value)
                }
              >
                <option value="">Select Type</option>
                <option value="Commercial">Commercial</option>
                <option value="Residential">Residential</option>
              </select>
            </div>

            {/* Service Name */}
            <div className="mb-4">
              <label className="block text-[14px] font-medium text-[#3E3E3E] Creato  text-left">
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
              <label className="block text-[14px] font-medium text-[#3E3E3E] Creato  text-left">
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

            {/* Footer */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
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
