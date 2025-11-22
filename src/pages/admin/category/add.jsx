"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Popup from "@/pages/common/Popup";
import { MdAdd, MdClose } from "react-icons/md";

export default function AddCategory() {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [MainCategories, setMainCategories] = useState([]);
  const [MainCategory, setMainCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false);  // Popup state
  const [processing, setProcessing] = useState(false);
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleopen = () => {
    setIsOpen(true);
  };
  // Fetch Main Categories
  useEffect(() => {
    axios
      .get("/api/Maincategory")
      .then((res) => setMainCategories(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Handle Image Preview
  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("Image", image);
    formData.append("MainCategory", MainCategory);

    try {
      await axios.post("/api/category", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Category Created Successfully!");
      setName("");
      setImage(null);
      setPreview("");
      setMainCategory("");
    } catch (error) {
      console.log(error);
      alert("Error creating category");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="cursor-pointer  text-[#000000] bg-[#fff000]/10 hover:bg-[#fff446]/30 rounded-md shadow-md inline-flex items-center gap-2 px-4 py-2 font-medium"
      >
        <MdAdd size={24} /> Add  Category
      </button>

      {isOpen && (
        <Popup
          isOpen={isOpen}
          onClose={handleClose}
          className="shadow-none"
          dialogClassName="custom-dialog-width"
          size={"max-w-2xl"}>
          <div className="relative bg-white w-full rounded-[30px] lg:rounded-[40px] h-auto mx-auto">
            <div className="border-b border-black border-opacity-10 px-4 py-4 lg:px-6 lg:py-5 relative flex items-center justify-between">
              <h2 className="text-xl lg:text-2xl text-[#212121] tracking-[-0.04em] font-semibold m-0">
                Add  Category
              </h2>

              <button
                type="button"
                onClick={handleClose}
                className="text-gray-700 hover:text-gray-900"
              >
                <MdClose size={24} />
              </button>
            </div>



            <div className="py-6 lg:py-8">
              <div className="mb-6 ">
                <label className="block text-base font-medium text-[#727272] tracking-[-0.06em] mb-1">Main Category</label>

                <select
                  className="w-full px-4 lg:px-5 py-2 border h-[48px] lg:h-[56px] border-[#F4F6F8] rounded-[6px] lg:rounded-[10px] bg-[#F4F6F8] focus:outline-none focus:ring-1 focus:ring-[#c9c9c9]"
                  value={MainCategory}
                  onChange={(e) => setMainCategory(e.target.value)}
                  required
                >
                  <option value="">Select Main Category</option>
                  {MainCategories.map((item) => (
                    <option value={item._id} key={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6 ">

                <label className="block text-base font-medium text-[#727272] tracking-[-0.06em] mb-1">Category Name</label>
                <input
                  type="text"
                  className="w-full px-4 lg:px-5 py-2 border h-[48px] lg:h-[56px] border-[#F4F6F8] rounded-[6px] lg:rounded-[10px] bg-[#F4F6F8] focus:outline-none focus:ring-1 focus:ring-[#c9c9c9]"
                  placeholder="Enter category name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="mb-6 ">

                <label className="block text-base font-medium text-[#727272] tracking-[-0.06em] mb-1">Category Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-4 lg:px-5 py-2 border h-[48px] lg:h-[56px] border-[#F4F6F8] rounded-[6px] lg:rounded-[10px] bg-[#F4F6F8] focus:outline-none focus:ring-1 focus:ring-[#c9c9c9]"

                  onChange={handleImage}
                />

                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-32 h-32 object-cover mt-3 rounded border"
                  />
                )}
              </div>


              <div className="flex justify-end px-6 lg:px-10 py-4 space-x-4">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                >
                  No
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"

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
