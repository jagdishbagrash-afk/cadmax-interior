import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Listing from "@/pages/api/Listing";
import { useSearchParams } from "next/navigation";
// import Forgot from "./forget-password/forgot";
// import { useRole } from "@/context/RoleContext";

export default function Login() {
  const router = useRouter();
  const [showConfirPassword, setShowConfirPassword] = useState(false);
  // const { setUser } = useRole();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    try {
      const main = new Listing();
      const response = await main.Login({
        email: data?.email,
        password: data?.password,
      });

      if (response?.data?.status) {
        toast.success(response.data.message);
        localStorage && localStorage.setItem("token", response?.data?.token);
        // setUser(response?.data);
          router.push("/admin/category");
      }
      else {
        toast.error(response.data.message);
      }
      setData({
        email: "",
        password: "",
      });
    } catch (error) {
      console.error("API error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white sm:bg-gray-100 p-4">
      <div className="sm:bg-white px-4 lg:px-10 pt-5 pb-10 lg:pb-20 sm:rounded-[20px] md:rounded-[20px] lg:rounded-[40px] sm:shadow lg:shadow-lg w-full max-w-[653px] sm:login_custom">
        {/* Logo */}
        <div className="flex justify-center mb-6 lg:mb-10">
          <Link href="/" className="">
            <Image
              className="h-[100px] w-[117px]"
              height={1000}
              width={1000}
              layout="fixed"
              src={"/Logo.png"}
              alt="japanese for me logo"
            />
          </Link>
        </div>

        {/* Heading */}
        <h2 className="text-center text-[#000000] text-2xl lg:text-4xl font-bold mb-6 tracking-[-0.04em] mb-6 lg:mb-8">
          LOG IN
        </h2>

        <div className="max-w-[551px] mx-auto">          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-4 lg:mb-5">
              <label className="block text-base font-medium text-[#727272] tracking-[-0.06em] mb-1">
                Email
              </label>
              <input
                value={data?.email}
                onChange={handleChange}
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 lg:px-5 py-2 border h-[48px] lg:h-[56px] border-[#F4F6F8] rounded-[6px] lg:rounded-[10px] bg-[#F4F6F8] focus:outline-none focus:ring-1 focus:ring-[#c9c9c9]"
                required
              />
            </div>
            {/* Password */}
            <div className="mb-6 lg:mb-10">
              <label className="block text-base font-medium text-[#727272] tracking-[-0.06em] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showConfirPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 lg:px-5 py-2 border h-[48px] lg:h-[56px] border-[#F4F6F8] rounded-[6px] lg:rounded-[10px] bg-[#F4F6F8] focus:outline-none focus:ring-1 focus:ring-[#c9c9c9]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirPassword(!showConfirPassword)}
                  className="absolute top-1/2 cursor-pointer right-4 -translate-y-1/2"
                >
                  {showConfirPassword ? (
                    <IoEyeOff size={24} className="text-gray-400" />
                  ) : (
                    <IoEye size={24} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            {/* <div className="flex justify-end mb-4 cursor-pointer">
              <Forgot />
            </div> */}

            {/* Login Button */}
            <button
              className="w-full cursor-pointer border border-[rgba(0,0,0,0.1)] bg-[#000000] hover:bg-[#ffffff] hover:text-black uppercase text-white py-3.5 cursor-pointer rounded-[10px] font-bold text-base transition"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging In..." : "LOG IN"}
            </button>
          </form>
          {/* Register */}
          <p className="text-center text-base text-[#727272] mt-6 lg:mt-12 tracking-[-0.03em] font-medium">
            Not registered?{" "}
            <Link
              href="/student/register"
              className="text-[#000000] hover:underline"
            >
              Register.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
