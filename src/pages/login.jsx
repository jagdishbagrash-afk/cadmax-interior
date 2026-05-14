"use client";

import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Listing from "@/pages/api/Listing";
import { useSearchParams } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [data, setData] = useState({
    phone: "",
    otp: "",
  });

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone only digits max 10
    if (name === "phone") {
      const onlyDigits = value.replace(/\D/g, "").slice(0, 10);

      setData((prev) => ({
        ...prev,
        phone: onlyDigits,
      }));
    }

    // OTP only digits max 6
    if (name === "otp") {
      const onlyDigits = value.replace(/\D/g, "").slice(0, 6);

      setData((prev) => ({
        ...prev,
        otp: onlyDigits,
      }));
    }
  };

  // ================= SEND OTP =================
 const handleSendOTP = async () => {
  if (data.phone.length !== 10) {
    return toast.error("Enter valid 10 digit phone number");
  }

  setLoading(true);

  try {
    const main = new Listing();

    const res = await main.SendOTP({
      phone: data.phone,
    });

    // New User Check
    if (res?.data?.data?.isNewUser) {
      toast.error("Phone not registered. Please sign up first.");
  setLoading(false);
      return;
    }

    // Existing User
    if (res?.data?.success || res?.data?.status) {
      toast.success("OTP sent successfully");
      setStep(2);
    } else {
      toast.error(res?.data?.message || "Failed to send OTP");
    }
  setLoading(false);

  } catch (err) {
    console.log(err);

    toast.error(
      err?.response?.data?.message || "Something went wrong"
    );
  }

  setLoading(false);
};

  // ================= VERIFY OTP =================
  const handleVerifyOTP = async () => {
    if (data.otp.length !== 6) {
      return toast.error("Enter valid 6 digit OTP");
    }

    setLoading(true);

    try {
      const main = new Listing();

      const res = await main.VerifyLogin({
        phone: data.phone,
        otp: data.otp,
      });


      if (res?.data?.success || res?.data?.status) {
        localStorage.setItem(
          "token",
          res?.data?.data?.token
        );

        toast.success("Login successful");

        if (redirect) {
          router.push(`${redirect}`);
        } else {
          router.push("/");
        }
      } else {
        toast.error(res?.data?.message || "Invalid OTP");
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.errors ||
        "Verification failed"
      );
    }

    setLoading(false);
  };

  // ================= BACK BUTTON =================
  const handleBack = () => {
    setStep(1);

    setData((prev) => ({
      ...prev,
      otp: "",
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      await handleSendOTP();
    } else {
      await handleVerifyOTP();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white px-4 md:px-6 lg:px-16 pt-5 pb-10 lg:pb-20 rounded-[20px] lg:rounded-[40px] shadow-lg w-full max-w-[976px]">

        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <Link href="/">
            <Image
              src="/Logo.png"
              alt="Logo"
              width={200}
              height={200}
              priority
            />
          </Link>
        </div>

        {/* TITLE */}
        <h2 className="text-center text-2xl lg:text-4xl font-bold mb-4">
          Login with OTP
        </h2>

        <p className="text-center text-sm text-gray-500 mb-8">
          Enter your phone number to receive OTP
        </p>

        {/* FORM */}
        <div className="max-w-[551px] mx-auto">
          <form onSubmit={handleSubmit}>

            {/* PHONE INPUT */}
            {step === 1 && (
              <div className="mb-5">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={data.phone}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  className="w-full h-[50px] px-4 rounded-lg border bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            )}

            {/* OTP INPUT */}
            {step === 2 && (
              <div className="mb-5">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Enter OTP
                </label>

                <input
                  type="text"
                  name="otp"
                  value={data.otp}
                  onChange={handleChange}
                  placeholder="Enter 6 digit OTP"
                  maxLength={6}
                  className="w-full h-[50px] px-4 rounded-lg border bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
                />

                <div className="flex items-center justify-between mt-2">
                  {/* BACK BUTTON */}
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-sm text-black font-medium hover:underline"
                  >
                    ← Back
                  </button>

                  {/* RESEND OTP */}
                  <p
                    onClick={handleSendOTP}
                    className="text-sm text-gray-500 cursor-pointer hover:text-black"
                  >
                    Resend OTP
                  </p>
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white h-[50px] rounded-lg font-semibold hover:bg-gray-900 transition disabled:opacity-50"
            >
              {loading
                ? step === 1
                  ? "Sending OTP..."
                  : "Verifying..."
                : step === 1
                  ? "Send OTP"
                  : "Login"}
            </button>


          </form>
        </div>

        {/* REGISTER */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Not registered?{" "}
          <Link
            href="/register"
            className="text-black font-medium hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}