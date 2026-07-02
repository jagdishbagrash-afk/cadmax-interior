"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { FaTimes, FaLock } from "react-icons/fa";
import Listing from "@/pages/api/Listing";
import loginImage from "@/Assets/Images/login-page.png";
import { useRole } from "@/context/RoleContext";

export default function AuthModal({ isOpen, onClose, defaultTab = "login" }) {
  const router = useRouter();
  const { setUser } = useRole();
  const [activeTab, setActiveTab] = useState(defaultTab); // 'login' or 'signup'

  // Login states
  const [loginStep, setLoginStep] = useState(1);
  const [loginTimer, setLoginTimer] = useState(0);
  const [loginData, setLoginData] = useState({ phone: "" });
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup states
  const [signupStep, setSignupStep] = useState(1);
  const [signupTimer, setSignupTimer] = useState(0);
  const [signupData, setSignupData] = useState({
    phone: "",
    otp: "",
    name: "",
    email: "",
    gender: "",
  });
  const [signupLoading, setSignupLoading] = useState(false);

  // ================= TIMER EFFECT =================
  useEffect(() => {
    let interval;
    if (loginTimer > 0) {
      interval = setInterval(() => {
        setLoginTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [loginTimer]);

  useEffect(() => {
    let interval;
    if (signupTimer > 0) {
      interval = setInterval(() => {
        setSignupTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [signupTimer]);

  // FORMAT TIMER
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // ================= LOGIN FUNCTIONS =================
  const handleLoginChange = (e) => {
    setLoginData({ phone: e.target.value });
  };

  const handleLoginSendOTP = async () => {
    if (loginStep === 2 && loginTimer > 0) {
      return toast.error(`Please wait ${formatTime(loginTimer)} before resending OTP`);
    }

    if (loginData.phone.length < 10) {
      return toast.error("Enter valid phone number");
    }

    setLoginLoading(true);
    try {
      const main = new Listing();
      const res = await main.SendOTP({ phone: loginData.phone });

      if (res?.data?.data?.isNewUser) {
        toast.error("Phone not registered. Please sign up first.");
        setLoginLoading(false);
        return;
      }

      if (res?.data?.success || res?.data?.status) {
        toast.success("OTP sent successfully");
        setLoginStep(2);
        setLoginTimer(300);
      } else {
        toast.error(res?.data?.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
    setLoginLoading(false);
  };

  const handleLoginVerifyOTP = async () => {
    if (loginData.otp.length !== 6) {
      return toast.error("Enter valid 6 digit OTP");
    }

    setLoginLoading(true);
    try {
      const main = new Listing();
      const res = await main.VerifyLogin({
        phone: loginData.phone,
        otp: loginData.otp,
      });

      if (res?.data?.success || res?.data?.status) {
        localStorage.setItem("token", res?.data?.data?.token);
        
        // Set user data in context so Header updates immediately
        const userData = res?.data?.data?.user || res?.data?.data;
        if (userData) {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
        
        toast.success("Login successful");
        onClose();
      } else {
        toast.error(res?.data?.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error(error?.response?.data?.errors || "Verification failed");
    }
    setLoginLoading(false);
  };

  const handleLoginBack = () => {
    setLoginStep(1);
    setLoginData({ phone: "" });
    setLoginTimer(0);
  };

  // ================= SIGNUP FUNCTIONS =================
  const handleSignupChange = (e) => {
    setSignupData((prev) => ({ ...prev, phone: e.target.value }));
  };

  const handleSignupSendOTP = async () => {
    if (signupData.phone.length < 10) {
      return toast.error("Enter valid phone number");
    }

    setSignupLoading(true);
    try {
      const main = new Listing();
      const res = await main.UserSendOTP({ phone: signupData.phone });

      if (res?.data?.status) {
        toast.success("OTP sent successfully");
        setSignupTimer(300);
        setSignupStep(2);
      } else {
        toast.error(res?.data?.message || "OTP send failed");
      }
    } catch (err) {
      const msg = err?.response?.data?.message;
      if (msg?.includes("Already registered")) {
        toast.error("Account already exists, please login");
        setActiveTab("login");
      } else {
        toast.error(msg || "OTP send failed");
      }
    }
    setSignupLoading(false);
  };

  const handleSignupVerifyOTP = async () => {
    if (signupData.otp.length !== 6) {
      return toast.error("Enter valid 6 digit OTP");
    }

    setSignupLoading(true);
    try {
      const main = new Listing();
      const res = await main.VerifyOTP({
        phone: signupData.phone,
        otp: signupData.otp,
      });

      if (res?.data?.success) {
        toast.success("Phone verified");
        setSignupStep(3);
      } else {
        toast.error(res?.data?.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error("OTP verification failed");
    }
    setSignupLoading(false);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupLoading(true);

    try {
      const main = new Listing();
      const res = await main.Register({
        name: signupData.name,
        email: signupData.email,
        phone: signupData.phone,
        gender: signupData.gender,
        role: "customer",
      });

      if (res?.data?.status) {
        // Save token
        if (res?.data?.data?.token) {
          localStorage.setItem("token", res?.data?.data?.token);
        }
        
        // Set user data in context so Header updates immediately
        const userData = res?.data?.data?.user || res?.data?.data;
        if (userData) {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
        
        toast.success("Registration successful");
        onClose();
      } else {
        toast.error(res?.data?.message || "Registration failed");
      }
    } catch (err) {
      const message =
        err?.response?.data?.errors?.email ||
        err?.response?.data?.errors?.phone ||
        err?.response?.data?.message ||
        "Registration failed";
      toast.error(message);
    }
    setSignupLoading(false);
  };

  const handleSignupBack = () => {
    if (signupStep === 3) {
      setSignupStep(2);
    } else if (signupStep === 2) {
      setSignupStep(1);
      setSignupData((prev) => ({ ...prev, otp: "" }));
      setSignupTimer(0);
    }
  };

  // ================= CLOSE MODAL =================
  const handleClose = () => {
    onClose();
    // Reset all states
    setActiveTab(defaultTab);
    setLoginStep(1);
    setLoginData({ phone: "" });
    setLoginTimer(0);
    setSignupStep(1);
    setSignupData({ phone: "", otp: "", name: "", email: "", gender: "" });
    setSignupTimer(0);
  };

  // ================= RENDER =================
  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex items-start justify-center bg-black/60 backdrop-blur-sm px-4 pt-[80px] min-h-screen overflow-y-auto">
      <div className="relative w-full max-w-[850px] bg-white rounded-[22px] shadow-2xl overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 w-[26px] h-[26px] rounded-full bg-gray-400 hover:bg-black transition flex items-center justify-center"
        >
          <FaTimes className="text-white text-xs" />
        </button>

        <div className="flex flex-col lg:flex-row lg:items-stretch">
          
          {/* LEFT SECTION */}
          <div className="relative w-full lg:w-[45%] h-[200px] lg:h-auto lg:min-h-[400px] overflow-hidden flex-shrink-0 flex items-center justify-center">
            {/* Background Image */}
            <Image
              src={loginImage}
              alt=""
              fill
              className="object-cover"
              priority
            />
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/45 to-black/40"></div>

            {/* Content */}
            <div className="relative z-10 text-center px-6 py-8">
              {/* Logo */}
              <div className="flex justify-center mb-5">
                <Image
                  src="/Logo.png"
                  alt="CadMax Logo"
                  width={160}
                  height={50}
                  className="object-contain"
                  priority
                />
              </div>

              {/* Welcome Text */}
              <h2 className="text-white text-xl lg:text-2xl font-light mb-2">
                Welcome to
              </h2>
              <h1 className="text-[#C8942E] text-2xl lg:text-3xl font-bold mb-3">
                CadMaxAtelier
              </h1>

              {/* Caption */}
              {/* <p className="text-gray-300 text-sm leading-relaxed max-w-[280px] mx-auto">
                Where luxury meets comfort — discover curated furniture and bespoke interior solutions for your dream space.
              </p> */}
            </div>
          </div>

          {/* RIGHT SECTION - Auth Form */}
          <div className="w-full lg:w-[55%] px-5 md:px-8 lg:px-[30px] py-6 lg:py-[30px]">
            
            {/* Tabs */}
            <div className="flex gap-6 mb-4 border-b border-gray-200">
              <button
                onClick={() => {
                  setActiveTab("login");
                  setLoginStep(1);
                  setLoginData({ phone: "" });
                  setLoginTimer(0);
                }}
                className={`pb-2 text-sm font-semibold transition relative ${
                  activeTab === "login" ? "text-[#222]" : "text-gray-400"
                }`}
              >
                Login
                {activeTab === "login" && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C8942E]"></div>
                )}
              </button>
              <button
                onClick={() => {
                  setActiveTab("signup");
                  setSignupStep(1);
                  setSignupData({ phone: "", otp: "", name: "", email: "", gender: "" });
                  setSignupTimer(0);
                }}
                className={`pb-2 text-sm font-semibold transition relative ${
                  activeTab === "signup" ? "text-[#222]" : "text-gray-400"
                }`}
              >
                Sign Up
                {activeTab === "signup" && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C8942E]"></div>
                )}
              </button>
            </div>

            {/* ================= LOGIN FORM ================= */}
            {activeTab === "login" && (
              <>
                {/* Description */}
                <p className="text-left text-[13px] text-[#6B7280] mb-4">
                  Enter your mobile  number 
                </p>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (loginStep === 1) {
                    handleLoginSendOTP();
                  } else {
                    handleLoginVerifyOTP();
                  }
                }}>
                  
                  {/* Phone Input */}
                  <div className="mb-4">
                    <input
                      type="tel"
                      value={loginData.phone}
                      onChange={handleLoginChange}
                      placeholder="Enter Mobile Number"
                      required
                      disabled={loginStep === 2}
                      className="w-full h-[45px] px-3 border border-[#E7D4AF] rounded-md text-sm focus:outline-none focus:border-[#C8942E] focus:ring-2 focus:ring-[#C8942E]/20 transition-all"
                    />
                  </div>

                  {/* OTP Input */}
                  {loginStep === 2 && (
                    <div className="mt-3">
                      <div className="relative">
                        <input
                          type="text"
                          name="otp"
                          value={loginData.otp}
                          onChange={(e) => setLoginData((prev) => ({ ...prev, otp: e.target.value }))}
                          placeholder="Enter OTP"
                          maxLength={6}
                          className="w-full h-[45px] px-3 pr-12 border border-[#E7D4AF] rounded-md text-sm focus:outline-none focus:border-[#C8942E] focus:ring-2 focus:ring-[#C8942E]/20 transition-all"
                        />
                        <FaLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <button
                          type="button"
                          onClick={handleLoginBack}
                          className="text-xs text-[#222] font-medium hover:text-[#C8942E] transition"
                        >
                          ← Back
                        </button>

                        <button
                          type="button"
                          onClick={handleLoginSendOTP}
                          disabled={loginTimer > 0}
                          className={`text-xs font-medium transition ${
                            loginTimer > 0
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-[#C8942E] hover:underline"
                          }`}
                        >
                          {loginTimer > 0
                            ? `Resend OTP in ${formatTime(loginTimer)}`
                            : "Resend OTP"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full h-[45px] bg-gradient-to-r from-[#C8942E] to-[#D4A84B] hover:from-[#B8842E] hover:to-[#C4983B] text-white font-bold rounded-md transition-all duration-300 disabled:opacity-50 mb-4"
                  >
                    {loginLoading
                      ? loginStep === 1
                        ? "Sending OTP..."
                        : "Verifying..."
                      : loginStep === 1
                      ? "Get OTP"
                      : "Login"}
                  </button>
                </form>

                {/* Info Section */}
                <div className="flex flex-col items-center text-center mb-4">
                  <FaLock className="text-gray-400 text-[10px] mb-1" />
                  <p className="text-[11px] text-[#6B7280] leading-relaxed">
                    We will send a OTP to your mobile number
                  </p>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-[11px] text-gray-400 font-medium">OR</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {/* Bottom Agreement */}
                <p className="text-center text-[11px] text-[#6B7280]  leading-relaxed">
                  By continuing, you agree to <span className="font-bold capitalize">CadMaxAtelier</span> 
                  <br />
                  <a href="/term-conditions" className="text-[#C8942E] hover:underline">
                    Terms & Conditions
                  </a>
                  {" & "}
                  <a href="/privacy-policy" className="text-[#C8942E] hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </>
            )}

            {/* ================= SIGNUP FORM ================= */}
            {activeTab === "signup" && (
              <>
                {/* Description */}
                <p className="text-left text-[13px] text-[#6B7280] mb-4">
                  Create your account to get started
                </p>

                <form onSubmit={signupStep === 3 ? handleSignupSubmit : (e) => {
                  e.preventDefault();
                  if (signupStep === 1) {
                    handleSignupSendOTP();
                  } else {
                    handleSignupVerifyOTP();
                  }
                }}>
                  
                  {/* STEP 1: Phone */}
                  {signupStep === 1 && (
                    <div className="mb-4">
                      <input
                        type="tel"
                        value={signupData.phone}
                        onChange={handleSignupChange}
                        placeholder="Enter Mobile Number"
                        required
                        maxLength={15}
                        className="w-full h-[45px] px-3 border border-[#E7D4AF] rounded-md text-sm focus:outline-none focus:border-[#C8942E] focus:ring-2 focus:ring-[#C8942E]/20 transition-all"
                      />
                    </div>
                  )}

                  {/* STEP 2: OTP */}
                  {signupStep === 2 && (
                    <div className="mb-4">
                      <div className="relative">
                        <input
                          type="text"
                          name="otp"
                          value={signupData.otp}
                          onChange={(e) => setSignupData((prev) => ({ ...prev, otp: e.target.value }))}
                          placeholder="Enter 6 digit OTP"
                          maxLength={6}
                          className="w-full h-[45px] px-3 pr-12 border border-[#E7D4AF] rounded-md text-sm focus:outline-none focus:border-[#C8942E] focus:ring-2 focus:ring-[#C8942E]/20 transition-all"
                        />
                        <FaLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <button
                          type="button"
                          onClick={handleSignupBack}
                          className="text-xs text-[#222] font-medium hover:text-[#C8942E] transition"
                        >
                          ← Back
                        </button>

                        <button
                          type="button"
                          onClick={handleSignupSendOTP}
                          disabled={signupTimer > 0}
                          className={`text-xs font-medium transition ${
                            signupTimer > 0
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-[#C8942E] hover:underline"
                          }`}
                        >
                          {signupTimer > 0
                            ? `Resend OTP in ${formatTime(signupTimer)}`
                            : "Resend OTP"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Additional Details */}
                  {signupStep === 3 && (
                    <div className="space-y-2.5">
                      <div className="p-2 bg-green-50 border border-green-200 rounded-md mb-2">
                        <p className="text-green-700 text-sm text-center font-medium">
                           Mobile Number Verified
                        </p>
                      </div>

                      <input
                        name="name"
                        placeholder="Full Name"
                        value={signupData.name}
                        onChange={(e) => setSignupData((prev) => ({ ...prev, name: e.target.value }))}
                        required
                        className="w-full h-[45px] px-3 border border-[#E7D4AF] rounded-md text-sm focus:outline-none focus:border-[#C8942E] focus:ring-2 focus:ring-[#C8942E]/20 transition-all"
                      />

                      <input
                        name="email"
                        placeholder="Email Address"
                        type="email"
                        value={signupData.email}
                        onChange={(e) => setSignupData((prev) => ({ ...prev, email: e.target.value }))}
                        required
                        className="w-full h-[45px] px-3 border border-[#E7D4AF] rounded-md text-sm focus:outline-none focus:border-[#C8942E] focus:ring-2 focus:ring-[#C8942E]/20 transition-all"
                      />

                      <select
                        name="gender"
                        value={signupData.gender}
                        onChange={(e) => setSignupData((prev) => ({ ...prev, gender: e.target.value }))}
                        required
                        className="w-full h-[45px] px-3 border border-[#E7D4AF] rounded-md text-sm focus:outline-none focus:border-[#C8942E] focus:ring-2 focus:ring-[#C8942E]/20 transition-all"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  )}

                  {/* Submit Button */}
                  {signupStep !== 2 && (
                    <button
                      type="submit"
                      disabled={signupLoading}
                      className="w-full h-[45px] bg-gradient-to-r from-[#C8942E] to-[#D4A84B] hover:from-[#B8842E] hover:to-[#C4983B] text-white font-bold rounded-md transition-all duration-300 disabled:opacity-50 mb-4"
                    >
                      {signupLoading
                        ? "Processing..."
                        : signupStep === 1
                        ? "Send OTP"
                        : "Create Account"}
                    </button>
                  )}

                  {signupStep === 2 && (
                    <button
                      type="submit"
                      disabled={signupLoading}
                      className="w-full h-[45px] bg-gradient-to-r from-[#C8942E] to-[#D4A84B] hover:from-[#B8842E] hover:to-[#C4983B] text-white font-bold rounded-md transition-all duration-300 disabled:opacity-50 mb-4"
                    >
                      {signupLoading ? "Verifying..." : "Verify OTP"}
                    </button>
                  )}
                </form>

                {/* Info Section */}
                <div className="flex flex-col items-center text-center mb-4">
                  <FaLock className="text-gray-400 text-[10px] mb-1" />
                  <p className="text-[11px] text-[#6B7280] leading-relaxed">
                    We will send a OTP to your mobile number
                  </p>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-[11px] text-gray-400 font-medium">OR</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {/* Bottom Agreement */}
                 <p className="text-center text-[11px] text-[#6B7280]  leading-relaxed">
                  By continuing, you agree to <span className="font-bold capitalize">CadMaxAtelier</span> 
                  <br />
                  <a href="/term-conditions" className="text-[#C8942E] hover:underline">
                    Terms & Conditions
                  </a>
                  {" & "}
                  <a href="/privacy-policy" className="text-[#C8942E] hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}