import React, { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRole } from "@/context/RoleContext";
import Listing from "@/pages/api/Listing";

export default function ProfileIndex() {
  const { setUser } = useRole();
  const [loading, setLoading] = useState(false);
  const [previewImgSrc, setPreviewImgSrc] = useState("/default-user.png");

  const [record, setRecord] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    timezone: "",
    profileImage: null, // ✅ backend-matched key
  });

  /* ================= FETCH PROFILE ================= */
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await new Listing().profileVerify();
      const data = res?.data?.data;

      setUser(data);
      setRecord({
        name: data?.name || "",
        email: data?.email || "",
        phone: data?.phone || "",
        gender: data?.gender || "",
        address: data?.address || "",
        timezone: data?.timezone || "",
        profileImage: null,
      });

      if (data?.profileImage) {
        setPreviewImgSrc(data.profileImage);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRecord((prev) => ({ ...prev, profileImage: file }));
    setPreviewImgSrc(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      Object.entries(record).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const api = new Listing();
      const response = await api.AdminProfileUpdate(formData);

      response?.data?.status
        ? toast.success(response.data.message)
        : toast.error(response.data.message);
    } catch (err) {
      console.error(err);
      toast.error("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className=" mx-auto p-6 bg-white ">

        {/* ================= PROFILE IMAGE ================= */}
        <section className="flex flex-col md:flex-row gap-6 items-start border-b pb-8">
          <div className="md:w-1/3">
            <h3 className="text-xl font-semibold text-black">Your Photo</h3>
            <p className="text-gray-500 text-sm">
              This will be displayed on your profile
            </p>
          </div>

          <div className="flex items-center gap-5">
            <Image
              src={previewImgSrc}
              alt="Profile"
              width={64}
              height={64}
              className="rounded-full object-cover"
            />

            <div>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
              <label
                htmlFor="profileImage"
                className="cursor-pointer font-medium text-black hover:underline"
              >
                Update Avatar
              </label>
            </div>
          </div>
        </section>

        {/* ================= FORM ================= */}
        <section className="space-y-6">
          <FormRow label="Name" desc="Edit your full name">
            <Input
              name="name"
              value={record.name}
              onChange={handleChange}
              placeholder="Enter name"
            />
          </FormRow>

          <FormRow label="Email" desc="Edit your email address">
            <Input
              type="email"
              name="email"
              value={record.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </FormRow>

          <FormRow label="Phone" desc="Edit your phone number">
            <Input
              name="phone"
              value={record.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </FormRow>

          <FormRow label="Gender" desc="Select your gender">
            <select
              name="gender"
              value={record.gender}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </FormRow>

          <FormRow label="Address" desc="Your full address">
            <textarea
              name="address"
              value={record.address}
              onChange={handleChange}
              rows={3}
              className="form-input"
              placeholder="Enter address"
            />
          </FormRow>
        </section>

        {/* ================= BUTTON ================= */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full sm:w-auto px-10 py-4 font-bold uppercase tracking-widest text-sm bg-black text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

const FormRow = ({ label, desc, children }) => (
  <div className="flex flex-col md:flex-row gap-4">
    <div className="md:w-1/3">
      <label className="font-medium text-lg text-black">{label}</label>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
    <div className="md:w-2/3">{children}</div>
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="form-input"
  />
);
