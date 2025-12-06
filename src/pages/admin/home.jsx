import React, { useEffect, useState } from 'react';
import AdminLayout from './common/AdminLayout';
import toast from 'react-hot-toast';
import Listing from '../api/Listing';
import ViewImage from './common/ViewImage';
import { IoCloseSharp } from 'react-icons/io5';
import { IoMdEye } from 'react-icons/io';
import Link from 'next/link';
import FaqManager from './FaqManager';
import Featured from './Featured';

export default function Home() {
    const [processing, setProcessing] = useState(false);
    const [images, setImages] = useState({ hero_img_first: null, hero_img_second: null, course_img: null });
    const [data, setData] = useState({
        hero_heading: "",
        hero_img_first: null,
        hero_img_second: null,
        course_heading: "",
        course_paragraph: "",
        course_img: null,
        learn: "",
        best_teacher: "",
        _id: "",
    });

    const HomeLists = async () => {
        try {
            setProcessing(true);
            const main = new Listing();
            const response = await main.HomeList();
            const res = response?.data?.data;
            setData({
                hero_heading: res.record.hero_heading || "",
                course_heading: res.record.course_heading || "",
                course_paragraph: res.record.course_paragraph || "",
                learn: res.record.learn || "",
                best_teacher: res.record.best_teacher || "",
                _id: res.record?._id || ""
            });
            setImages({
                hero_img_first: res.record.hero_img_first || null,
                hero_img_second: res.record.hero_img_second || null,
                course_img: res.record.course_img || null,
            })


        } catch (error) {
            console.log('error', error);
            setData([]);
        }
        setProcessing(false);
    };

    useEffect(() => {
        HomeLists();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const { name, files } = e.target;
        setImages(prev => ({ ...prev, [name]: files[0] }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (processing) return;

        setProcessing(true);
        try {
            const main = new Listing();
            const formData = new FormData();
            formData.append("hero_heading", data.hero_heading);
            formData.append("learn", data.learn);
            formData.append("best_teacher", data.best_teacher);
            formData.append("course_heading", data.course_heading);
            formData.append("course_paragraph", data.course_paragraph);
            formData.append("_id", data._id);
            if (images.hero_img_first) formData.append("hero_img_first", images.hero_img_first);
            if (images.hero_img_second) formData.append("hero_img_second", images.hero_img_second);
            if (images.course_img) formData.append("course_img", images.course_img);
            const response = await main.HomeUpdate(formData);
            if (response) {
                HomeLists();
                toast.success(response.data.message)
            }
        } catch (error) {
            const status = error?.response?.status;
            const message = error?.response?.data?.message || "Something went wrong.";
            toast.error({
                401: "Unauthorized",
                403: "Access denied.",
                404: message,
                500: "Server error. Please try again later."
            }[status] || message);
        }
        setProcessing(false);
    };


    const FileUpload = ({ label, name, view }) => {
        const fileValue = images[name];

        const getImagePreview = () => {
            if (!fileValue) return null;
            if (typeof fileValue === 'string') {
                return fileValue; // existing image URL
            }
            return URL.createObjectURL(fileValue); // preview from uploaded File
        };

        const handleRemove = () => {
            setImages(prev => ({ ...prev, [name]: null }));
            HomeLists();
        };

        return (
            <div className="mb-4 w-full lg:w-6/12 xl:w-6/12 lg:pr-3">
                <label className="text-[#000000] font-medium text-base xl:text-lg mb-1 flex items-center">
                    {label}
                    {view && typeof fileValue === 'string' && (
                        <Link href={view} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 underline p-1 bg-[#CC28281A] rounded">
                            <IoMdEye className='text-[#46494D]' />
                        </Link>
                    )}
                </label>

                <input
                    type="file"
                    name={name}
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full h-11 lg:h-[54px] font-medium appearance-none block bg-[#F4F6F8] text-[#727272] border border-[#F4F6F8] rounded-[10px] py-3 px-6 focus:outline-none"
                />

                {fileValue && (
                    <div className="mt-2 relative inline-block">
                        <img
                            src={getImagePreview()}
                            alt="Preview"
                            className="h-24 w-auto rounded border border-gray-300"
                        />
                        {/* Show Remove icon only for newly uploaded image */}
                        {typeof fileValue !== 'string' && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1 text-red-600 hover:text-red-800"
                                title="Remove"
                            >
                                <IoCloseSharp className="text-lg" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    };



    const SectionHeading = ({ title }) => (
        <div className="w-full lg:w-6/12  lg:pl-0 mb-4">
            <h2 className="text-[#000000] text-xl lg:text-2xl font-semibold tracking-[-0.04em]">{title}</h2>
        </div>
    );

    return (
        <AdminLayout page="Home Edit">
            <form onSubmit={handleSubmit} className="min-h-screen p-5 lg:p-[30px] space-y-6">
                <div>
                    {/* Hero Section */}
                    <SectionHeading title="Hero Section" />
                    <div className="flex flex-wrap">
                        <div className="mb-4 w-full lg:w-6/12 xl:w-6/12 lg:pr-3">
                            <label className="block text-[#000000] font-medium text-base xl:text-lg mb-1">Hero Heading</label>
                            <input
                                type={"text"}
                                name={"hero_heading"}
                                onChange={handleChange}
                                value={data.hero_heading || ""}
                                className="w-full h-11 lg:h-[54px] font-medium appearance-none block bg-[#F4F6F8] text-[#727272] border border-[#F4F6F8] rounded-[10px] py-3 px-6 focus:outline-none"
                            />
                        </div>

                        <FileUpload label="Upload Image 1" name="hero_img_first" view={images?.hero_img_first} />
                        <FileUpload label="Upload Image 2" name="hero_img_second" view={images?.hero_img_second} />
                    </div>
                </div>

                <div>
                    {/* Find Your Course Section */}
                    <SectionHeading title="Find Your Course" />
                    <div className="flex flex-wrap">
                        <div className="mb-4 w-full lg:w-6/12 xl:w-6/12 lg:pr-3">
                            <label className="block text-[#000000] font-medium text-base xl:text-lg mb-1">Course Heading</label>
                            <input
                                type={"text"}
                                name={"course_heading"}
                                onChange={handleChange}
                                value={data.course_heading || ""}
                                className="w-full h-11 lg:h-[54px] font-medium appearance-none block bg-[#F4F6F8] text-[#727272] border border-[#F4F6F8] rounded-[10px] py-3 px-6 focus:outline-none"
                            />
                        </div>
                        <FileUpload label="Upload Image 2" name="course_img" view={images?.course_img} />
                        <div className="w-full mb-4">
                            <label className="block text-[#000000] font-medium text-base xl:text-xl mb-1">Description</label>
                            <textarea
                                rows={5}
                                name="course_paragraph"
                                onChange={handleChange}
                                value={data.course_paragraph}
                                placeholder="Enter description"
                                className="w-full bg-[#F4F6F8] text-[#727272] border border-[#F4F6F8] rounded-[20px] py-3 px-6 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className='flex flex-wrap'>
                    <div className="mb-4 w-full lg:w-6/12 xl:w-6/12 lg:pr-3">
                        <SectionHeading title="Ready" />
                        <label className="block text-[#000000] font-medium text-base xl:text-lg mb-1">learn Heading</label>
                        <input
                            type={"text"}
                            name={"learn"}
                            onChange={handleChange}
                            value={data.learn || ""}
                            className="w-full h-11 lg:h-[54px] font-medium appearance-none block bg-[#F4F6F8] text-[#727272] border border-[#F4F6F8] rounded-[10px] py-3 px-6 focus:outline-none"
                        />
                    </div>
                    {/* Teacher Section */}
                    <div className="mb-4 w-full lg:w-6/12 xl:w-6/12 lg:pr-3">
                        <SectionHeading title="Teacher" />

                        <label className="block text-[#000000] font-medium text-base xl:text-lg mb-1">best teacher Heading</label>
                        <input
                            type={"text"}
                            name={"best_teacher"}
                            onChange={handleChange}
                            value={data.best_teacher || ""}
                            className="w-full h-11 lg:h-[54px] font-medium appearance-none block bg-[#F4F6F8] text-[#727272] border border-[#F4F6F8] rounded-[10px] py-3 px-6 focus:outline-none"
                        />
                    </div>


                    {/* Submit Button */}
                    <div className="flex justify-center w-full">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full max-w-[170px] border border-[#CC2828] bg-[#000000] hover:bg-[#ffffff] hover:text-black text-white py-3  rounded-[10px] font-normal text-base xl:text-lg transition tracking-[-0.04em]"
                        >
                            {processing ? "Loading..." : "Submit"}
                        </button>
                    </div>
                </div>

            </form>
            <Featured />
            <FaqManager />
        </AdminLayout>
    );
}