"use client";

import { useState, useEffect } from "react";
import Popup from "@/pages/common/Popup";
import { MdAdd, MdClose, MdEdit } from "react-icons/md";
import Listing from "@/pages/api/Listing";
import { toast } from "react-hot-toast";

export default function AddVendor({ fetchDatas, isEdit, item }) {
    const [categroy, setCategory] = useState([]);

    const fetchVendorCategoryData = async () => {
        try {
            const main = new Listing();
            const response = await main.vendorcategoryList();

            if (response.data?.data) {
                setCategory(response.data.data);
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    useEffect(() => {
        fetchVendorCategoryData();
    }, []);

    const [isOpen, setIsOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        experience: "",
        sepectailze: "",
        VendorCategory: "",
        price: "",
        phone: "",
        isAvailable: true,
        file: null,
        preview: ""
    });

    useEffect(() => {
        if (isEdit && item) {
            setFormData({
                name: item?.name || "",
                experience: item?.experience || "",
                sepectailze: item?.sepectailze || "",
                VendorCategory: item?.VendorCategory?._id || "",
                price: item?.price || "",
                phone: item?.phone || "",
                isAvailable: item?.isAvailable ?? true,
                preview: item?.Image || "",
                file: null
            });
        }
    }, [isEdit, item]);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(selectedFile.type)) {
            toast.error("Only JPG, PNG, or WEBP allowed");
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            toast.error("Max size 5MB");
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
            const submitForm = new FormData();
            submitForm.append("name", formData.name);
            submitForm.append("experience", formData.experience);
            submitForm.append("sepectailze", formData.sepectailze);
            submitForm.append("VendorCategory", formData.VendorCategory);
            submitForm.append("phone", formData.phone);
            if (formData.file) submitForm.append("Image", formData.file);
            let response;
            if (isEdit) {
                response = await main.vendorUpdate(item._id, submitForm);
            } else {
                response = await main.vendorCreate(submitForm);
            }

            if (response?.data?.status) {
                toast.success(response.data.message);

                setFormData({
                    name: "",
                    experince: "",
                    sepectailze: "",
                    VendorCategory: "",
                    price: "",
                    phone: "",
                    isAvailable: true,
                    file: null,
                    preview: ""
                });

                handleClose();
                fetchDatas();
            } else {
                toast.error(response?.data?.message || "Error occurred");
            }
        } catch (err) {
            toast.error("Something went wrong");
            console.log(err);
        }

        setProcessing(false);
    };

    return (
        <>
            <div className="flex justify-center items-center">
                <button
                    onClick={handleOpen}
                    className="cursor-pointer m-auto flex items-center justify-center
          w-[42px] h-[42px] rounded-lg border border-gray-200 shadow-sm
          bg-white hover:bg-gray-50 transition-all duration-200"
                >
                    {isEdit ? (
                        <MdEdit size={22} className="text-blue-600" />
                    ) : (
                        <MdAdd size={22} className="text-blue-600" />
                    )}
                </button>
            </div>
            {isOpen && (
                <Popup isOpen={isOpen} onClose={handleClose} size={"max-w-5xl"}>
                    <div className="border-b px-4 py-4 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">
                            {isEdit ? "Edit Vendor" : "Add Vendor"}
                        </h2>
                        <MdClose size={24} className="cursor-pointer" onClick={handleClose} />
                    </div>

                    <div className="py-4 px-4 grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Vendor Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vendor Name
                            </label>
                            <input
                                className="w-full px-4 py-2 h-[48px] border border-gray-200 rounded-[10px] bg-[#F4F6F8] focus:ring focus:ring-gray-300 outline-none"
                                placeholder="Enter Vendor Name"
                                value={formData.name}
                                name="name"
                                type="text"
                                onChange={(e) => handleInputChange("name", e.target.value)}
                            />
                        </div>

                        {/* Experience */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Experience
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 h-[48px] border border-gray-200 rounded-[10px] bg-[#F4F6F8] focus:ring focus:ring-gray-300 outline-none"
                                placeholder="Enter Experience"
                                name="experience"
                                value={formData.experience}
                                onChange={(e) => handleInputChange("experience", e.target.value)}
                            />
                        </div>

                        {/* Specialization */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Specialization
                            </label>
                            <input
                                className="w-full px-4 py-2 h-[48px] border border-gray-200 rounded-[10px] bg-[#F4F6F8] focus:ring focus:ring-gray-300 outline-none"
                                placeholder="Enter Specialization"
                                value={formData.sepectailze}
                                name="sepectailze"
                                type="text"
                                onChange={(e) => handleInputChange("sepectailze", e.target.value)}
                            />
                        </div>

                        {/* Service Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                vendor category Type
                            </label>
                            <select
                                className="w-full px-4 py-2 h-[48px] border border-gray-200 rounded-[10px] bg-[#F4F6F8] focus:ring focus:ring-gray-300 outline-none"
                                value={formData.VendorCategory}
                                onChange={(e) => handleInputChange("VendorCategory", e.target.value)}
                            >
                                <option value="">Select Service</option>
                                {categroy?.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                maxLength={10}
                                className="w-full px-4 py-2 h-[48px] border border-gray-200 rounded-[10px] bg-[#F4F6F8] focus:ring focus:ring-gray-300 outline-none"
                                placeholder="Enter Phone Number"
                                value={formData.phone}
                                name="phone"
                                onChange={(e) => {
                                    const value = e.target.value;

                                    // sirf digits allow
                                    if (/^\d*$/.test(value)) {
                                        handleInputChange("phone", value);
                                    }
                                }}
                            />
                        </div>



                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vendor Image
                            </label>
                            <input
                                type="file"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-[#F4F6F8]"
                                onChange={handleImageChange}
                            />
                            {formData.preview && (
                                <img
                                    src={formData.preview}
                                    className="w-24 h-24 mt-3 rounded-lg object-cover border"
                                />
                            )}
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
                        >
                            {processing ? "Saving..." : "Submit"}
                        </button>
                    </div>
                </Popup>
            )}
        </>
    );
}
