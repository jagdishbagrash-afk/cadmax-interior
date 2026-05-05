"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "../common/AdminLayout";
import Listing from "@/pages/api/Listing";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { MdAdd, MdDelete } from "react-icons/md";

export default function Add() {
  const router = useRouter();
  const { id } = router.query;

  const [project, setProject] = useState({});
  const [form, setForm] = useState({
    title: "",
    content: "",
    brief: "",
    solution: "hello",
    designed: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [images, setImages] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);

  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  // ================= FETCH =================
  const fetchProjectData = async () => {
    try {
      const main = new Listing();
      const res = await main.getAllProjectId(id);
      const data = res?.data?.data;

      if (data) {
        setProject(data);
        setForm({
          title: data.title || "",
          content: data.content || "",
          brief: data.brief || "",
          solution: data.solution || "",
          designed: data.designed || "",
        });
        setImagePreview(data.Image || "");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (id) fetchProjectData();
  }, [id]);

  // ================= HANDLERS =================
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handleDragStart = (index) => setDragIndex(index);

  const handleDrop = (index) => {
    const updated = [...images];
    const [dragged] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, dragged);
    setImages(updated);
  };

  const makeCoverImage = (index) => {
    const updated = [...images];
    const [cover] = updated.splice(index, 1);
    updated.unshift(cover);
    setImages(updated);
  };

const HandleDeleteImages = async (img) => {
  try {
    setImgLoading(true);

    const main = new Listing();

    const res = await main.deleteProjectImage(id, {
      image: img,
    });

    if (res?.data?.success) {
      // remove from UI
      setProject((prev) => ({
        ...prev,
        multiple_images: prev.multiple_images.filter((i) => i !== img),
      }));

      toast.success("Image deleted successfully");
    }
  } catch (err) {
    toast.error("Delete failed");
  } finally {
    setImgLoading(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => fd.append(k, form[k]));

      if (image) fd.append("image", image);
      images.forEach((img) => fd.append("images", img));

      const main = new Listing();
      const res = id
        ? await main.editProject(id, fd)
        : await main.AddProject(fd);
      if (res?.data?.status) {
        toast.success(res.data.message);
        router.push("/admin/project");
      }
    } catch {
      toast.error("Server Error");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <AdminLayout page="Project List">
      <div className="w-full mx-auto bg-white p-8 rounded-2xl shadow-lg border">

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {id ? "Edit Project" : "Add New Project"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* INPUTS */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Project Title"
              className="input"
              required
            />

            <input
              name="designed"
              value={form.designed}
              onChange={handleChange}
              placeholder="Designed By"
              className="input"
            />
          </div>

          <textarea
            name="brief"
            value={form.brief}
            onChange={handleChange}
            placeholder="Project Brief"
            className="input h-24"
          />

          {/* <textarea
            name="solution"
            value={form.solution}
            onChange={handleChange}
            placeholder="Project Solution"
            className="input h-24"
          /> */}

          {/* SINGLE IMAGE */}
          <div>
            <label className="label">Main Image</label>
            <input type="file" onChange={handleImageChange} />

            {imagePreview && (
              <div className="mt-3 w-32 h-32 rounded-lg overflow-hidden border">
                <img
                  src={imagePreview}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* MULTIPLE IMAGE */}
          <div>
            <label className="label">Project Images</label>

            <div className="border-2 border-dashed p-8 rounded-xl text-center hover:bg-gray-50 cursor-pointer">
              <MdAdd size={40} className="mx-auto text-gray-400" />
              <p className="text-sm text-gray-500 mt-2">
                Click or Drag Images
              </p>
              <input type="file" multiple onChange={handleFileChange} />
            </div>

            {/* NEW IMAGES */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {images.map((img, i) => (
                <div
                  key={i}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(i)}
                  className="relative group rounded-xl overflow-hidden border shadow-sm"
                >
                  <img
                    src={URL.createObjectURL(img)}
                    className="h-32 w-full object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center gap-2 transition">
                    <button
                      onClick={() => removeImage(i)}
                      className="bg-red-500 text-white px-2 py-1 text-xs rounded"
                    >
                      Remove
                    </button>

                    {i !== 0 && (
                      <button
                        onClick={() => makeCoverImage(i)}
                        className="bg-yellow-500 text-white px-2 py-1 text-xs rounded"
                      >
                        Cover
                      </button>
                    )}
                  </div>

                  {i === 0 && (
                    <span className="absolute top-2 left-2 bg-white text-xs px-2 py-1 rounded">
                      Cover
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* EXISTING IMAGES */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {project?.multiple_images?.map((img, i) => (
                <div
                  key={i}
                  className="relative group rounded-xl overflow-hidden border shadow-sm"
                >
                  <img
                    src={img}
                    className="h-32 w-full object-cover"
                  />

                  <button
                    onClick={() => HandleDeleteImages(img)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                  >
                    {imgLoading ? "..." : <MdDelete size={18} />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* BUTTON */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold transition">
            {loading ? "Processing..." : id ? "Update Project" : "Add Project"}
          </button>
        </form>
      </div>

      {/* CSS */}
      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #ddd;
          padding: 12px;
          border-radius: 10px;
          outline: none;
        }
        .input:focus {
          border-color: #2563eb;
        }
        .label {
          font-weight: 600;
          display: block;
          margin-bottom: 6px;
        }
      `}</style>
    </AdminLayout>
  );
}