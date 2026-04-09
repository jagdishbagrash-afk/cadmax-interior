import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import Listing from "@/pages/api/Listing";
import { IoEye, IoEyeOff } from "react-icons/io5";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [data, setData] = useState({
    phone: "",
    otp: "",
    name: "",
    email: "",
    gender: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ SEND OTP
  const sendOTP = async () => {
    if (!/^\d{10}$/.test(data.phone)) {
      return toast.error("Enter valid 10 digit phone number");
    }

    setLoading(true);
    try {
      const main = new Listing();
      const res = await main.SendOTP({ phone: data.phone });

      if (res?.data?.status) {
        toast.success("OTP sent successfully");
        setStep(2);
      } else {
        console.log("res?.data?.message ", res?.data?.message)
        toast.error(res?.data?.message || "OTP send failed");
      }
    } catch (err) {
      console.log("err", err)
      toast.error(err?.res?.data?.message || "OTP send failed");
    }
    setLoading(false);
  };

  // ✅ VERIFY OTP
  const verifyOTP = async () => {
    if (data.otp.length !== 6) {
      return toast.error("Enter valid 6 digit OTP");
    }

    setLoading(true);
    try {
      const main = new Listing();
      const res = await main.VerifyOTP({
        phone: data.phone,
        otp: data.otp,
      });

      if (res?.data?.status) {
        toast.success("Phone verified");
        setStep(3);
      } else {
        toast.error(res?.data?.message || "Invalid OTP");
      }
    } catch {
      toast.error("OTP verification failed");
    }
    setLoading(false);
  };

  // ✅ REGISTER FINAL
  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const main = new Listing();
      const res = await main.Register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        role: "customer",
      });

      if (res?.data?.status) {
        toast.success("Registration successful");
        router.push("/login");
      } else {
        toast.error(res?.data?.message || "Registration failed");
      }

    } catch (err) {
      console.log("err", err);

      const message =
        err?.response?.data?.errors?.email ||
        err?.response?.data?.errors?.phone ||
        err?.response?.data?.message ||
        "Registration failed";

      toast.error(message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white px-4 md:px-6 lg:px-16 pt-5 pb-10 lg:pb-20  rounded-[20px] md:rounded-[20px] lg:rounded-[40px] shadow lg:shadow-lg w-full max-w-[976px] login_custom">

        {/* LOGO */}
        <div className="flex justify-center mb-5">
          <Image
            src="/Logo.png"
            alt="CADMAX Interior Logo"
            width={180}
            height={70}
            priority
          />
        </div>

        <h2 className="text-center text-[#000000] text-2xl lg:text-4xl font-bold mb-6 tracking-[-0.04em] mb-6 lg:mb-8">
          Register
        </h2>
        <div className="max-w-[551px] mx-auto">

          {/* ✅ STEP 1: PHONE */}
          {step === 1 && (
            <div className="max-w-md mx-auto">
              <input
                type="tel"
                name="phone"
                maxLength={10}
                value={data.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // only digits
                  handleChange({ target: { name: "phone", value } });
                }}
                placeholder="Enter mobile number"
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full h-[50px] px-4 rounded-lg border bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                onClick={sendOTP}
                disabled={loading}
                className="mt-4 bg-black text-white w-full h-[48px] rounded-lg"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          )}

          {/* ✅ STEP 2: OTP */}
          {step === 2 && (
            <div className="max-w-md mx-auto">
              <input
                name="otp"
                placeholder="Enter 6 digit OTP"
                value={data.otp}
                onChange={handleChange}
                className="w-full h-[50px] px-4 border rounded-lg bg-gray-100 focus:ring-1 focus:ring-black"
              />
              <button
                onClick={verifyOTP}
                disabled={loading}
                className="mt-4 bg-black text-white w-full h-[48px] rounded-lg"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <p
                onClick={sendOTP}
                className="text-sm mt-2 text-right cursor-pointer text-gray-500"
              >
                Resend OTP
              </p>
            </div>
          )}

          {/* ✅ STEP 3: FULL FORM */}
          {step === 3 && (
            <div className="max-w-[551px] mx-auto">
              <form onSubmit={handleRegister}>
                <p className="text-green-600 text-center mb-6">
                  ✅ Phone Number Verified
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <input
                    name="name"
                    placeholder="Full Name"
                    value={data.name}
                    onChange={handleChange}
                    required
                    className="w-full h-[50px] px-4 border rounded-lg bg-gray-100 focus:ring-1 focus:ring-black"

                  />

                  <input
                    name="email"
                    placeholder="Email Address"
                    type="email"
                    value={data.email}
                    onChange={handleChange}
                    required
                    className="w-full h-[50px] px-4 border rounded-lg bg-gray-100 focus:ring-1 focus:ring-black"

                  />

                  <select
                    name="gender"
                    value={data.gender}
                    onChange={handleChange}
                    required
                    className="w-full h-[50px] px-4 border rounded-lg bg-gray-100 focus:ring-1 focus:ring-black"

                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>


                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full bg-black text-white py-3 rounded-lg font-semibold"
                >
                  {loading ? "Creating Account..." : "Register"}
                </button>
              </form>
            </div>
          )}
        </div>

        <p className="text-center mt-6 text-sm">
          Already have an account?
          <Link href="/login" className="ml-2 font-semibold underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
