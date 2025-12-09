import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import Listing from "@/pages/api/Listing";
import { IoEye, IoEyeOff } from "react-icons/io5";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSymbol: false,
    hasMinLength: false,
  });

  const [data, setData] = useState({
    name: "",
    email: "",
    nationalities: "",
    password: "",
    confirm_password: "",
    gender: "",
    phone: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      const criteria = {
        hasUpper: /[A-Z]/.test(value),
        hasLower: /[a-z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        hasMinLength: value.length >= 8,
      };
      setPasswordCriteria(criteria);
    }
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (
      !passwordCriteria?.hasUpper ||
      !passwordCriteria?.hasLower ||
      !passwordCriteria?.hasNumber ||
      !passwordCriteria?.hasSymbol ||
      !passwordCriteria?.hasMinLength
    ) {
      toast.error(
        "Password must include uppercase, lowercase, number, symbol, and be 8+ characters."
      );
      return;
    }
    if (data?.password !== data?.confirm_password) {
      toast.error("Password and Confirm Password do not match");
      return;
    }
    setLoading(true);
    try {
      const main = new Listing();
      const response = await main.Register({
        email: data?.email,
        password: data?.password,
        name: data?.name,
        role: "customer",
        phone: data?.phone,
        gender: data?.gender,
      });
      if (response?.data?.status) {
        router.push("/login");
        toast.success(response.data.message);
        setData({
          email: "",
          confirm_email: "",
          password: "",
          confirm_password: "",
          name: "",
          role: "",
          gender: "",
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white px-4 md:px-6 lg:px-16 pt-5 pb-10 lg:pb-20  rounded-[20px] md:rounded-[20px] lg:rounded-[40px] shadow lg:shadow-lg w-full max-w-[976px] login_custom">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/">
            <Image
              className="max-w-fit h-[100px]"
              height={1000}
              width={1000}
              layout="fixed"
              src={"/Logo.png"}
              alt="japanese for me logo"
            />
          </Link>
        </div>

        {/* Heading */}
        <h2 className="text-center text-black text-xl lg:text-2xl font-semibold mb-2 uppercase">
          REGISTER
        </h2>

        <p className="text-center text-sm text-black mb-8">
          Create your CADMAX Interior account to explore premium interior products,
          exclusive deals & hassle-free shopping experience.
        </p>

        {/* Form Fields */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap -mx-2.5 justify-center">
            <div className="w-full md:w-6/12 px-2.5 mb-5">
              <label className="block text-base font-medium text-[#727272] tracking-[-0.06em] mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                value={data?.name}
                onChange={handleChange}
                type="text"
                name="name"
                placeholder="Name"
                className="w-full px-4 lg:px-5 py-2 border h-[48px] lg:h-[56px] border-[#F4F6F8] rounded-[6px] lg:rounded-[10px] bg-[#F4F6F8] focus:outline-none focus:ring-1 focus:ring-[#c9c9c9]"
                required
              />
            </div>
            <div className="w-full md:w-6/12 px-2.5 mb-5">
              <label className="block text-base font-medium text-[#727272] tracking-[-0.06em] mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                value={data?.phone}
                onChange={handleChange}
                type="email"
                name="phone"
                placeholder=" Phone Number"
                className="w-full px-4 lg:px-5 py-2 border h-[48px] lg:h-[5 6px] border-[#F4F6F8] rounded-[6px] lg:rounded-[10px] bg-[#F4F6F8] focus:outline-none focus:ring-1 focus:ring-[#c9c9c9]"
                required
              />
            </div>
            <div className="w-full md:w-6/12 px-2.5 mb-5">
              <label className="block text-base font-medium text-[#727272] tracking-[-0.06em] mb-1">
                Email <span className="text-red-500">*</span>

              </label>
              <input
                value={data?.email}
                onChange={handleChange}
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 lg:px-5 py-2 border h-[48px] lg:h-[5 6px] border-[#F4F6F8] rounded-[6px] lg:rounded-[10px] bg-[#F4F6F8] focus:outline-none focus:ring-1 focus:ring-[#c9c9c9]"
                required
              />
            </div>


            <div className="w-full md:w-6/12 px-2.5 mb-5 relative">
              <label className="block text-base font-semibold text-[#727272] tracking-[-0.06em] mb-1">
                Password  <span className="text-red-500">*</span>

              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 lg:px-5 py-2 border h-[48px] lg:h-[56px] border-[#F4F6F8] rounded-[6px] lg:rounded-[10px] bg-[#F4F6F8] focus:outline-none focus:ring-1 focus:ring-[#c9c9c9]"
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 cursor-pointer right-4 -translate-y-1/2 bg-[#F4F6F8] p-2"
                >
                  {showPassword ? (
                    <IoEyeOff size={24} className="text-gray-400" />
                  ) : (
                    <IoEye size={24} className="text-gray-400" />
                  )}
                </button>
              </div>

              {passwordFocused && (
                <div className="text-gray-700 text-sm mt-2 space-y-1">
                  <p className="flex items-center gap-2">
                    {passwordCriteria.hasLower ? (
                      <FaCheckCircle className="text-green-600" />
                    ) : (
                      <FaTimesCircle className="text-red-600" />
                    )}
                    Contains lowercase letter
                  </p>
                  <p className="flex items-center gap-2">
                    {passwordCriteria.hasUpper ? (
                      <FaCheckCircle className="text-green-600" />
                    ) : (
                      <FaTimesCircle className="text-red-600" />
                    )}
                    Contains uppercase letter
                  </p>
                  <p className="flex items-center gap-2">
                    {passwordCriteria.hasNumber ? (
                      <FaCheckCircle className="text-green-600" />
                    ) : (
                      <FaTimesCircle className="text-red-600" />
                    )}
                    Contains number
                  </p>
                  <p className="flex items-center gap-2">
                    {passwordCriteria.hasSymbol ? (
                      <FaCheckCircle className="text-green-600" />
                    ) : (
                      <FaTimesCircle className="text-red-600" />
                    )}
                    Contains special character
                  </p>
                  <p className="flex items-center gap-2">
                    {passwordCriteria.hasMinLength ? (
                      <FaCheckCircle className="text-green-600" />
                    ) : (
                      <FaTimesCircle className="text-red-600" />
                    )}
                    At least 8 characters long
                  </p>
                </div>
              )}
            </div>
            <div className="w-full md:w-6/12 px-2.5 mb-5 relative">
              <label className="block text-base font-semibold text-[#727272] tracking-[-0.06em] mb-1">
                Confirm Password <span className="text-red-500">*</span>

              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm_password"
                  name="confirm_password"
                  placeholder="Confirm Password"
                  value={data?.confirm_password}
                  onChange={handleChange}
                  className="w-full px-4 lg:px-5 py-2 border h-[48px] lg:h-[56px] border-[#F4F6F8] rounded-[6px] lg:rounded-[10px] bg-[#F4F6F8] focus:outline-none focus:ring-1 focus:ring-[#c9c9c9]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 cursor-pointer right-4 -translate-y-1/2 bg-[#F4F6F8] p-2"
                >
                  {showConfirmPassword ? (
                    <IoEyeOff size={24} className="text-gray-400" />
                  ) : (
                    <IoEye size={24} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div className="w-full md:w-6/12 px-2.5 mb-5">
              <label className="block text-base font-semibold text-[#727272] tracking-[-0.06em] mb-1">
                Gender  <span className="text-red-500">*</span>

              </label>
              {/* Gender */}
              <select
                className="w-full px-4 lg:px-5 py-2 border h-[48px] lg:h-[56px] border-[#F4F6F8] rounded-[6px] lg:rounded-[10px] bg-[#F4F6F8] focus:outline-none focus:ring-1 focus:ring-[#c9c9c9]"
                onChange={handleChange}
                value={data?.gender || ""}
                name="gender"
                required
              >
                <option value="">Please select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="w-full md:w-12/12 px-2.5 mb-5 flex flex-wrap justify-center">
              <div className="w-full md:w-6/12">
                <button
                  type="submit"
                  disabled={loading} //
                  className="w-full py-[15px] bg-black hover:bg-gray-600 cursor-pointer text-white py-2 rounded-md font-semibold transition"
                >
                  {loading ? "Loading.." : "Sign Up"} {/* Fixed typo */}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Login Redirect */}
        <p className="text-center text-base text-[#727272] mt-6 lg:mt-8 tracking-[-0.03em] font-medium">
          Already have an account?{" "}
          <Link href="/login" className="text-[#000000] hover:underline">
            Log in.
          </Link>
        </p>
      </div>
    </div>
  );
}
