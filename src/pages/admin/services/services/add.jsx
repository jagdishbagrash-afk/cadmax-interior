"use client";

import { useState, useEffect } from "react";
import Listing from "@/pages/api/Listing";
import { toast } from "react-hot-toast";
import AdminLayout from "../../common/AdminLayout";
import ImageUploader from "./ImageUploader";
import { useRouter } from "next/router";

export default function ServicesAdd() {

     const [data, setData] = useState([]);

     console.log("data" ,data)
    
      const fetchSubcategroyData = async () => {
        try {
          const main = new Listing();
          const response = await main.ServicesSubCategoryList();
    
          if (response.data?.data) {
            setData(response.data.data);
          }
        } catch (error) {
          console.log("Error:", error);
        }
      };
    
      useEffect(() => {
        fetchSubcategroyData();
      }, []);
    const router = useRouter();
    const isEdit = router.query.id;
    const [formData, setFormData] = useState({
        title: "",
        file: null,
        preview: "",
        ServicesType: "",
        content: "",
        timeline: "",
        material_details: "",
        concept: "",
        cost: "",
        subcategory :"" ,
        ServicesSubCategory:""
    });
    const [images, setImages] = useState([]);
const[project ,setProject] = useState([]);
    // Fetch categories
    const fetchData = async (isEdit) => {
        try {
            const main = new Listing();
            const response = await main.ServciesDetails(isEdit);
            if (response.data?.data) {
                const list = response.data.data || [];
                setProject(list || "")
                setFormData({
                    title: list.title || "",
                    file: null,
                    preview: list.Image || "",
                    ServicesType: list.ServicesType?._id || "",
                    content: list.content || "",
                    concept: list.concept || "",
                    cost:list.cost ||"",
                    timeline :  list?.timeline|| "",
                    ServicesSubCategory :  list?.ServicesSubCategory || "",
                    material_details :  list?.material_details || ""
                });
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    useEffect(() => {
        if (isEdit) fetchData(isEdit);
    }, [isEdit]);
    const [datacategiroes, setDatacategiroes] = useState([]);
    const fecthServicesData = async () => {
        try {
            const main = new Listing();
            const response = await main.servciestypeList();
            if (response.data?.data) {
                setDatacategiroes(response.data.data);
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    useEffect(() => {
        fecthServicesData();
    }, []);

    const [isOpen, setIsOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    // useEffect(() => {
    //     if (isEdit && item) {
    //         setFormData({
    //             title: item.title || "",
    //             file: null,
    //             preview: item.Image || "",
    //             ServicesType: item.ServicesType?._id || "",
    //             content: item.content || "",
    //             concept: item.concept || ""
    //         });
    //     }
    // }, [isEdit, item]);
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
            submitFormData.append("content", formData.content);
            submitFormData.append("ServicesType", formData.ServicesType);
            submitFormData.append("concept", formData.concept)
            submitFormData.append("material_details", formData.material_details)
            submitFormData.append("timeline", formData.timeline)
            submitFormData.append("ServicesSubCategory", formData.ServicesSubCategory)
            submitFormData.append("cost", formData.cost)
            if (formData.file) {
                submitFormData.append("Image", formData.file);
            }
            images.forEach((img) => {
                submitFormData.append("images[]", img); // remove [] — most servers expect 'images' multiple times
            });
            let response;
            if (isEdit) {
                response = await main.ServicesUpdate(project._id, submitFormData);
            } else {
            response = await main.services(submitFormData);
            }

            if (response?.data) {
                router.push("/admin/services/services")
                toast.success(response.data.message);
                setFormData({
                    name: "",
                    file: null,
                    preview: "",
                    serviceType: "",
                    concept: ""
                });
            } else {
                toast.error(response?.data?.message || "Error occurred");
            }
        } catch (err) {
            console.log("err" ,err)
            toast.error(err?.response?.data?.message || "Something went wrong");
        }

        setProcessing(false);
    };

    console.log("datacategiroes", datacategiroes)
    return (
        <>
            <AdminLayout page={"Add / Edit Concept "}>
                <div className="bg-white border border-blue-100 rounded-xl shadow-sm">
                    <div className="px-6 py-4 border-b">
                        <h1 className="text-2xl font-bold text-blue-600">
                            {isEdit ? "Edit New  Concept" : "Add New Concept"}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Fill in the details below to {isEdit ? "update" : "create"} your Concept.
                        </p>
                    </div>

                    <div className="p-6 space-y-6">

                        {/* GRID FORM */}
                        <div className="grid grid-cols-1  gap-6">

                            {/* LEFT SECTION */}
                            <div className="space-y-4">

                                {/* Service Type */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">
                                        Service Type
                                    </label>
                                    <select
                                        className="mt-1 w-full h-[48px] px-4 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
                                        value={formData.ServicesType}
                                        onChange={(e) => handleInputChange("ServicesType", e.target.value)}
                                    >
                                        <option value="">Select Type</option>
                                        {datacategiroes?.map((item) => (
                                            <option key={item._id} value={item._id}>
                                                {item.TypeServices} — {item.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>


                                   <div>
                                    <label className="text-sm font-semibold text-gray-700">
                                      Concept Sub Category 
                                    </label>
                                    <select
                                        className="mt-1 w-full h-[48px] px-4 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
                                        value={formData.ServicesSubCategory}
                                        onChange={(e) => handleInputChange("ServicesSubCategory", e.target.value)}
                                    >
                                        <option value="">Select Concept Sub Category</option>
                                        {data?.map((item) => (
                                            <option key={item._id} value={item._id}>
                                          {item.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>


                                {/* Concept */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">
                                        Concept
                                    </label>
                                    <select
                                        className="mt-1 w-full h-[48px] px-4 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
                                        value={formData.concept}
                                        onChange={(e) => handleInputChange("concept", e.target.value)}
                                    >
                                        <option value="">Select Concept</option>
                                        <option value="modern">Modern</option>
                                        <option value="neo_classic">Neo Classic</option>
                                        <option value="contemporary">Contemporary</option>
                                        <option value="common">Common</option>

                                    </select>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">
                                        Service Name
                                    </label>
                                    <input
                                        className="mt-1 w-full h-[48px] px-4 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
                                        placeholder="Enter service title"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange("title", e.target.value)}
                                    />
                                </div>

                                {/* Content */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">
                                        Service Content
                                    </label>
                                    <textarea
                                        rows={5}
                                        className="mt-1 w-full px-4 py-2 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
                                        placeholder="Enter service content"
                                        value={formData.content}
                                        onChange={(e) => handleInputChange("content", e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* RIGHT SECTION */}
                            <div className="space-y-4">

                                {/* Main Image */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">
                                        Service Image
                                    </label>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="mt-1 w-full h-[48px] px-4 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
                                    />

                                    {formData.preview && (
                                        <img
                                            src={formData.preview}
                                            className="w-40 h-40 mt-3 rounded-lg border object-cover"
                                            alt="Preview"
                                        />
                                    )}
                                </div>





                                {/* Timeline */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">
                                        Service Timeline
                                    </label>
                                    <textarea
                                        value={formData.timeline}
                                        onChange={(e) => handleInputChange("timeline", e.target.value)}
                                        rows={1}
                                        className="mt-1 w-full px-4 py-2 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
                                        placeholder="Enter timeline details"
                                    />
                                </div>

                                {/* Cost */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">
                                        Service Design Cost
                                    </label>
                                    <textarea
                                        rows={1}
                                        value={formData.cost}
                                        onChange={(e) => handleInputChange("cost", e.target.value)}
                                        className="mt-1 w-full px-4 py-2 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
                                        placeholder="Enter design cost details"
                                    />
                                </div>

                                {/* Material */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">
                                        Service Material Details
                                    </label>
                                    <textarea
                                        value={formData.material_details}
                                        onChange={(e) => handleInputChange("material_details", e.target.value)}
                                        rows={4}
                                        className="mt-1 w-full px-4 py-2 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
                                        placeholder="Enter material details"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Project Images */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700">
                                Project Images
                            </label>
                            <ImageUploader images={images} setImages={setImages} project={project} type={"services"} fetchData={fetchData} />
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            {isEdit ? (
<button
                                onClick={handleSubmit}
                                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                                {processing ? "Processing..." : "Update"}
                            </button>
                            ) : (
                                <button
                                onClick={handleSubmit}
                                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                                {processing ? "Processing..." : "Submit"}
                            </button>
                            )}
                        </div>

                    </div>
                </div>
            </AdminLayout>

        </>
    );
}
