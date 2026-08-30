"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Popup from "@/pages/common/Popup";
import { MdAdd, MdClose, MdEdit } from "react-icons/md";
import Listing from "@/pages/api/Listing";
import { toast } from "react-hot-toast";
import seoConfig from "@/config/seoConfig.json";
const cleanSeoText = (value = "") => {
  return String(value)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
};
const replaceSeoVariables = (
  template = "",
  values = {}
) => {
  return template.replace(
    /\{(\w+)\}/g,
    (_, key) => values[key] || ""
  );
};


const generateSubCategorySEO = ({
  name,
  category,
}) => {
  const cleanName =
    cleanSeoText(name);

  const cleanCategory =
    cleanSeoText(category);

  const values = {
    name: cleanName,
    category: cleanCategory,
    brand: seoConfig.brand,
  };


  const metaTitle =
    replaceSeoVariables(
      seoConfig.subcategory.metaTitle,
      values
    )
      .replace(/\s+/g, " ")
      .trim();


  let metaDescription =
    replaceSeoVariables(
      seoConfig.subcategory.metaDescription,
      values
    )
      .replace(/\s+/g, " ")
      .trim();


  // Meta description limit
  if (metaDescription.length > 165) {
    metaDescription =
      `${metaDescription
        .substring(0, 162)
        .trim()}...`;
  }


  return {
    meta_title: metaTitle,
    meta_description: metaDescription,
  };
};

export default function AddSubCategory({ fetchDatas, isEdit, item }) {
  const [isOpen, setIsOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Form data with meta fields
  const [formData, setFormData] = useState({
    name: "",
    file: null,
    preview: "",
    SuperCategory: "",
    Category: "",
    // meta_title: "",
    // meta_description: "",
    // meta_keywords: "",
  });

  const [data, setData] = useState([]); // for SuperCategory
  const [datacategiroes, setDatacategiroes] = useState([]); // for Category

  // Fetch SuperCategories
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

  // Fetch Categories
  const fetchCaData = async () => {
    try {
      const main = new Listing();
      const response = await main.categoryList();
      if (response.data?.data) {
        setDatacategiroes(response.data.data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCaData();
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (isEdit && item) {
      setFormData({
        name: item.name || "",
        file: null,
        preview: item.Image || "",
        SuperCategory: item?.SuperCategory?._id || "",
        Category: item?.category?._id || "",
        // meta_title: item.meta_title || "",
        // meta_description: item.meta_description || "",
        // meta_keywords: item.meta_keywords || "",
      });
    }
  }, [isEdit, item]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  // Universal change handler
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Image handler
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Only JPG, PNG, or WEBP images are allowed");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    handleInputChange("file", selectedFile);
    handleInputChange("preview", URL.createObjectURL(selectedFile));
  };
  // ========================================
  // GET DYNAMIC SEO
  // ========================================

  const getSeoData = () => {

    const selectedCategory =
      datacategiroes.find(
        (category) =>
          String(category?._id) ===
          String(formData.Category)
      );


    return generateSubCategorySEO({

      name:
        formData.name,

      category:
        selectedCategory?.name || "",
    });
  };

  // ========================================
  // SUBMIT
  // ========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (processing) return;
    if (
      !formData.Category
    ) {

      toast.error(
        "Please select category"
      );

      return;
    }


    if (
      !formData.name?.trim()
    ) {

      toast.error(
        "Please enter sub category name"
      );

      return;
    }

    setProcessing(true);

    try {
      const main = new Listing();
      // =====================================
      // DYNAMIC SEO
      // =====================================

      const seoData =
        getSeoData();


      console.log(
        "Sub Category SEO:",
        seoData
      );
      const submitFormData = new FormData();
      submitFormData.append("name", formData.name);
      submitFormData.append("meta_title", seoData.meta_title || "");
      submitFormData.append("meta_description", seoData.meta_description || "");
      // submitFormData.append("meta_keywords", formData.meta_keywords || "");
      if (
        formData.SuperCategory
      ) {

        submitFormData.append(
          "SuperCategory",
          formData.SuperCategory
        );
      }
      submitFormData.append("category", formData.Category);

      if (formData.file) {
        submitFormData.append("Image", formData.file);
      }

      let response;
      if (isEdit) {
        response = await main.SubcategoryUpdate(item._id, submitFormData);
      } else {
        response = await main.subcategory(submitFormData);
      }

      if (response?.data?.status) {
        toast.success(response.data.message);
        // Reset form data (including all fields)
        setFormData({
          name: "",
          file: null,
          preview: "",
          SuperCategory: "",
          Category: "",
          // meta_title: "",
          // meta_description: "",
          // meta_keywords: "",
        });
        handleClose();
        fetchDatas(); // refresh parent list
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

      {/* ADD / EDIT BUTTON */}

      <div
        className="
          flex
          justify-center
          items-center
        "
      >

        <button
          type="button"
          onClick={handleOpen}
          className="
            cursor-pointer
            flex
            items-center
            justify-center
            gap-2
            min-w-[42px]
            h-[42px]
            px-4
            rounded-lg
            border
            border-gray-200
            shadow-sm
            bg-white
            hover:bg-gray-50
            transition-all
            duration-200
          "
        >

          {isEdit ? (

            <MdEdit
              size={22}
              className="text-blue-600"
            />

          ) : (

            <>
              <MdAdd
                size={22}
                className="text-blue-600"
              />

              <span
                className="
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                Add
              </span>
            </>
          )}

        </button>

      </div>


      {/* ====================================
          POPUP
      ==================================== */}

      {isOpen && (

        <Popup
          isOpen={isOpen}
          onClose={handleClose}
          size="max-w-2xl"
          className="shadow-none"
        >

          {/* HEADER */}

          <div
            className="
              border-b
              border-black/10
              px-4
              py-4
              lg:px-6
              lg:py-5
              flex
              justify-between
              items-center
            "
          >

            <h2
              className="
                text-xl
                lg:text-2xl
                text-[#212121]
                font-semibold
              "
            >
              {isEdit
                ? "Edit"
                : "Add"}{" "}
              Sub Category
            </h2>


            <button
              type="button"
              onClick={handleClose}
              className="
                text-gray-700
                hover:text-gray-900
              "
            >

              <MdClose
                size={24}
              />

            </button>

          </div>


          {/* ====================================
              FORM
          ==================================== */}

          <form
            onSubmit={handleSubmit}
            className="py-4 px-4"
          >

            {/* CATEGORY */}

            <div className="mb-4">

              <label
                className="
                  block
                  text-[14px]
                  font-medium
                  text-[#3E3E3E]
                  text-left
                  mb-1
                "
              >
                Category
              </label>


              <select
                className="
                  w-full
                  px-4
                  lg:px-5
                  py-2
                  border
                  h-[48px]
                  lg:h-[56px]
                  border-[#F4F6F8]
                  rounded-[10px]
                  bg-[#F4F6F8]
                  focus:outline-none
                  focus:ring-1
                  focus:ring-[#c9c9c9]
                "

                value={
                  formData.Category
                }

                onChange={(e) =>
                  handleInputChange(
                    "Category",
                    e.target.value
                  )
                }

                required
              >

                <option value="">
                  Select Category
                </option>


                {datacategiroes?.map(
                  (category) => (

                    <option
                      value={
                        category?._id
                      }

                      key={
                        category?._id
                      }
                    >
                      {category?.name}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* SUB CATEGORY NAME */}

            <div className="mb-4">

              <label
                className="
                  block
                  text-[14px]
                  font-medium
                  text-[#3E3E3E]
                  text-left
                  mb-1
                "
              >
                Sub Category Name
              </label>


              <input
                type="text"

                className="
                  w-full
                  px-4
                  py-2
                  h-[48px]
                  lg:h-[56px]
                  border
                  border-[#F4F6F8]
                  rounded-[10px]
                  bg-[#F4F6F8]
                  focus:ring-1
                  focus:ring-gray-300
                  outline-none
                "

                placeholder="Enter sub category name"

                value={
                  formData.name
                }

                onChange={(e) =>
                  handleInputChange(
                    "name",
                    e.target.value
                  )
                }

                required
              />

            </div>


            {/* IMAGE */}

            <div className="mb-4">

              <label
                className="
                  block
                  text-[14px]
                  font-medium
                  text-[#3E3E3E]
                  text-left
                  mb-1
                "
              >
                Sub Category Image
              </label>


              <input
                type="file"

                accept=".jpg,.jpeg,.png,.webp"

                className="
                  w-full
                  px-4
                  py-2
                  h-[48px]
                  lg:h-[56px]
                  border
                  border-[#F4F6F8]
                  rounded-[10px]
                  bg-[#F4F6F8]
                "

                onChange={
                  handleImageChange
                }
              />


              {formData.preview && (

                <img
                  src={
                    formData.preview
                  }

                  alt={
                    formData.name ||
                    "Sub Category Preview"
                  }

                  className="
                    w-32
                    h-32
                    object-cover
                    mt-3
                    rounded
                    border
                  "
                />

              )}

            </div>


            {/* ====================================
                AUTO SEO INFO
            ==================================== */}

            <div
              className="
                mb-5
                p-3
                rounded-lg
                bg-blue-50
                border
                border-blue-100
              "
            >

              <p
                className="
                  text-sm
                  text-gray-600
                "
              >
                SEO title and description will
                be generated automatically from
                the sub category and category
                name.
              </p>

            </div>


            {/* FOOTER */}

            <div
              className="
                flex
                justify-end
                space-x-4
              "
            >

              <button
                type="button"
                onClick={handleClose}

                className="
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-gray-700
                  bg-gray-200
                  rounded
                  hover:bg-gray-300
                "
              >
                Cancel
              </button>


              <button
                type="submit"

                disabled={
                  processing
                }

                className="
                  cursor-pointer
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-white
                  bg-blue-600
                  rounded
                  hover:bg-blue-700
                  disabled:bg-gray-400
                  disabled:cursor-not-allowed
                "
              >

                {processing
                  ? "Processing..."
                  : isEdit
                    ? "Update"
                    : "Submit"}

              </button>

            </div>

          </form>

        </Popup>
      )}

    </>
  );
}