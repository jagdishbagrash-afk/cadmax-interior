"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Listing from "../api/Listing";
import { useRole } from "@/context/RoleContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EnquiryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const router = useRouter();
  const { user } = useRole();

  const [form, setForm] = useState({
    type: "design",
    services: "commercial",
    category: "",
    message: "",
  });

  const [error, setError] = useState("");

  // Disable scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  // Fetch services
  const fetchData = async () => {
    try {
      const main = new Listing();
      const res = await main.ServciesType();
      if (res.data?.data) {
        setData(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const residentialServices = data?.Residentialservices || [];
  const commercialServices = data?.Commercialservices || [];

  const categoryOptions =
    form.services === "residential"
      ? residentialServices
      : commercialServices;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "services") {
      setForm({ ...form, services: value, category: "" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ✅ Single clean submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first");
      return router.push("/login");
    }

    if (!form.category || !form.message) {
      return setError("All fields are required");
    }

    try {
      setLoading(true);
      setError("");

      const main = new Listing();
      const res = await main.Addcommon({
        ...form,
        userId: user?._id,
      });

      if (res?.data?.status) {
        toast.success("Enquiry sent successfully ✅");
        setIsOpen(false);

        setForm({
          type: "design",
          services: "commercial",
          category: "",
          message: "",
        });
      } else {
        toast.error(res?.data?.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setIsOpen(true)}
          className="px-6 py-2 font-semibold uppercase text-sm bg-white border rounded-lg hover:bg-black hover:text-white transition"
        >
          Enquire Now
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
        className="fixed  h-full inset-0 z-[9999999] flex items-center justify-center bg-black/70 backdrop-blur-sm px-3">

          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 relative">

            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            {/* Heading */}
            <h2 className="text-center text-xl font-bold mb-1">
              Send Inquiry
            </h2>
            <p className="text-center text-sm text-gray-500 mb-3">
              Fill the details and our team will contact you
            </p>

            {error && (
              <p className="text-red-500 text-sm mb-3 text-center">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Type */}
              <div className="w-full text-left">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg"
                >
                  <option value="design">Design</option>
                  <option value="product">Vendor</option>
                </select>
              </div>

              {/* Services */}
              <div className="w-full text-left">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Services
                </label>
                <select
                  name="services"
                  value={form.services}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg"
                >
                  <option value="commercial">Commercial</option>
                  <option value="residential">Residential</option>
                </select>
              </div>

              {/* Category */}
              <div className="w-full text-left">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg"
                >
                  <option value="">Select Category</option>

                  {categoryOptions.map((item, i) => (
                    <option key={i} value={item?.title}>
                      {item?.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="w-full text-left">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border p-2 rounded-lg"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold"
              >
                {loading ? "Sending..." : "Submit Inquiry"}
              </button>

            </form>
          </div>
        </div>
      )}
    </>
  );
}