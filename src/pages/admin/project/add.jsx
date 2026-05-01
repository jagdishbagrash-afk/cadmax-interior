"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "../common/AdminLayout";
import Listing from "@/pages/api/Listing";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import ImageUploader from "../services/services/ImageUploader";

export default function Add() {
  const router = useRouter();
  const [project, setProject] = useState([]);

  const { id } = router.query;
  const [form, setForm] = useState({
    title: "",
    content: "",
    brief: "",
    solution: "",
    designed: ""
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProjectData = async () => {
    try {
      const main = new Listing();
      const response = await main.getAllProjectId(id);
      const data = response?.data?.data;
      if (data) {
        setProject(data)
        setForm({
          title: data.title || "",
          content: data.content || "",
          brief: data.brief || "",
          material: data.material || "",
          solution: data.solution || "",
          designed: data.designed || "",
        });
        setImagePreview(data.Image || "");
        setImage(null);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };


  useEffect(() => {
    if (id) {
      fetchProjectData();
    }
  }, [id]);

  // console.log("id", id);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("content", form.content);
      fd.append("solution", form.solution);
      fd.append("brief", form.brief);
      fd.append("designed", form.designed);
      if (image instanceof File) {
        fd.append("image", image);
      }
      images.forEach((img) => {
        fd.append("images[]", img); // remove [] — most servers expect 'images' multiple times
      });
      const main = new Listing();
      const res = await main.AddProject(fd);
      if (res?.data?.status) {
        toast.success(res?.data?.message);
        setForm({
          title: "",
          description: "",
          stock: "",
          amount: "",
          category: "",
          subcategory: "",
          dimensions: "",
          material: "",
          Project: "",
          terms: "",
        });
        setImage(null);
        router.push("/admin/project");
      } else {
        toast.error(data.message || "Failed to add Project");
      }
    } catch (error) {
      toast.error("Internal Server Error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("content", form.content);
      fd.append("solution", form.solution);
      fd.append("brief", form.brief);
      fd.append("designed", form.designed);
      if (image instanceof File) {
        fd.append("image", image);
      }
      images.forEach((img) => {
        fd.append("images[]", img); // remove [] — most servers expect 'images' multiple times
      });
      const main = new Listing();
      const res = await main.editProject(id, fd);
      if (res?.data?.status) {
        router.push("/admin/project");
        toast.success(res?.data?.message);
        setForm({
          title: "",
          description: "",
          stock: "",
          amount: "",
          category: "",
          subcategory: "",
          dimensions: "",
          material: "",
          Project: "",
          terms: "",
        });
        setImage(null);
      } else {
        toast.error(data.message || "Failed to edit Project");
      }
    } catch (error) {
      toast.error("Internal Server Error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [images, setImages] = useState([]);

  // console.log("form", form);

  return (
    <AdminLayout page={"Project List"}>
      <div className="bg-white p-8 border border-blue-100">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">{id ? "Edit" : "Add"} Project</h1>

        <form className="space-y-4" onSubmit={id ? handleEdit : handleSubmit}>
          {/* Title */}
          <label className="block text-gray-700 font-medium mt-4">
            Project Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          <label className="block text-gray-700 font-medium mt-4">
            Project Designed
          </label>
          <input
            type="text"
            name="designed"
            placeholder="Project Designed"
            value={form.designed}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
          {/* <label className="block text-gray-700 font-medium mt-4">
            Project Description
          </label>
          <textarea
            name="content"
            placeholder="Project Description"
            value={form.content}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          /> */}
          <label className="block text-gray-700 font-medium mt-4">
            Project Brieft
          </label>
          <textarea
            name="brief"
            placeholder="Project brief"
            value={form.brief}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
          <label className="block text-gray-700 font-medium mt-4">
            Project Solution
          </label>
          <textarea
            name="solution"
            placeholder="Project Solution"
            value={form.solution}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          {/* Image Upload */}
          <label className="block text-gray-700 font-medium mt-4">
            Project Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-3 w-32 h-32 object-cover rounded-md border border-gray-200"
            />
          )}

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Project Images
            </label>
            <ImageUploader images={images} setImages={setImages} project={project} type={"services"} fetchData={fetchProjectData} />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium mt-4 hover:bg-blue-700 transition cursor-pointer"
          >
            {loading ? "Submitting..." : `Submit`}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}