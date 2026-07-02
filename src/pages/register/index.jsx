"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Listing from "@/pages/api/Listing";
import { FaLock, FaTimes, FaChevronDown } from "react-icons/fa";
import loginImage from "@/Assets/Images/login-page.png";

// Country codes data
const countries = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+1", country: "Canada", flag: "🇨🇦" },
];

export default function Register() {
  const router = useRouter();

  // ================= STATES =================
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // 5 MIN TIMER
  const [timer, setTimer] = useState(0);

  const [activeTab, setActiveTab] = useState("signup"); // 'login' or 'signup'
  
  const [data, setData] = useState({
    phone: "",
    otp: "",
    name: "",
    email: "",
    gender: "",
  });

  const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Default India
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  // ================= TIMER EFFECT =================
  useEffect(() => {
    let interval;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer]);

  // FORMAT TIMER
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const onlyDigits = value.replace(/\D/g, "").slice(0, 10);
      setData((prev) => ({ ...prev, phone: onlyDigits }));
    }
    
    if (name === "otp") {
      const onlyDigits = value.replace(/\D/g, "").slice(0, 6);
      setData((prev) => ({ ...prev, otp: onlyDigits }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ================= BACK BUTTON =================
  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setData((prev) => ({ ...prev, otp: "" }));
      setTimer(0);
    }
    if (step === 3) {
      setStep(2);
    }
  };

  // ================= SEND OTP =================
  const sendOTP = async () => {
    if (!/^\d{10}$/.test(data.phone)) {
      return toast.error("Enter valid 10 digit phone number");
    }

    setLoading(true);

    try {
      const main = new Listing();
      const res = await main.UserSendOTP({ phone: data.phone });

      if (res?.data?.status) {
        toast.success("OTP sent successfully");
        setTimer(300);
        setStep(2);
      } else {
        toast.error(res?.data?.message || "OTP send failed");
      }
    } catch (err) {
      const msg = err?.response?.data?.message;
      if (msg?.includes("Already registered")) {
        toast.error("Account already exists, please login");
      } else {
        toast.error(msg || "OTP send failed");
      }
    }

    setLoading(false);
  };

  // ================= VERIFY OTP =================
  const verifyOTP = async () => {
    if (data.otp.length !== 6) {
      return toast.error("Enter valid 6 digit OTP");
    }

    setLoading(true);

    try {
      const main = new Listing();
      const res = await main.VerifyOTP({ phone: data.phone, otp: data.otp });

      if (res?.data?.success) {
        toast.success("Phone verified");
        setStep(3);
      } else {
        toast.error(res?.data?.message || "Invalid OTP");
      }
    } catch (error) {
      console.log(error);
      toast.error("OTP verification failed");
    }

    setLoading(false);
  };

  // ================= SWITCH TAB =================
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === "login") {
      router.push("/login");
    } else {
      router.push("/register");
    }
  };

  // ================= REGISTER =================
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
      console.log(err);
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
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] p-4">
      {/* Floating Register Card */}
      <div className="relative w-full max-w-[1050px] bg-white rounded-[22px] shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <Link href="/login">
          <button
            className="absolute top-4 right-4 z-20 w-[30px] h-[30px] rounded-full bg-gray-200 hover:bg-gray-300 transition flex items-center justify-center"
          >
            <FaTimes className="text-white text-sm" />
          </button>
        </Link>

        <div className="flex flex-col lg:flex-row">
          
          {/* LEFT SECTION - Promotional Image */}
          <div className="relative w-full lg:w-[48%] h-[300px] lg:h-[560px] overflow-hidden">
            <Image
              src={loginImage}
              alt="Luxury Furniture"
              fill
              className="object-cover"
              priority
            />
            
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>

            {/* Logo */}
            <div className="absolute top-10 left-10 z-10">
              <Link href="/">
                <Image
                  src="/Logo.png"
                  alt="CadMax Logo"
                  width={180}
                  height={60}
                  className="object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Main Text */}
            <div className="absolute top-1/2 left-10 -translate-y-1/2 z-10 max-w-md">
              <h1 className="text-white text-4xl lg:text-5xl font-medium leading-tight">
                Join us
                <br />
                and discover
                <br />
                <span className="text-[#C8942E]">luxury.</span>
              </h1>
            </div>
          </div>

          {/* RIGHT SECTION - Register Form */}
          <div className="w-full lg:w-[52%] px-8 md:px-12 lg:px-[45px] py-10 lg:py-[50px]">
            
            {/* Tabs */}
            <div className="flex gap-8 mb-6 border-b border-gray-200">
              <button
                onClick={() => handleTabSwitch("login")}
                className={`pb-3 text-lg font-semibold transition relative ${
                  activeTab === "login" ? "text-[#222]" : "text-gray-400"
                }`}
              >
                Login
                {activeTab === "login" && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C8942E]"></div>
                )}
              </button>
              <button
                onClick={() => handleTabSwitch("signup")}
                className={`pb-3 text-lg font-semibold transition relative ${
                  activeTab === "signup" ? "text-[#222]" : "text-gray-400"
                }`}
              >
                Sign Up
                {activeTab === "signup" && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C8942E]"></div>
                )}
              </button>
            </div>

            {/* Description */}
            <p className="text-left text-[15px] text-[#6B7280] mb-7">
              Sign up to get started with CadMax
            </p>

            {/* Form */}
            {activeTab === "signup" && (
              <form onSubmit={step === 3 ? handleRegister : (e) => {
              e.preventDefault();
              if (step === 1) {
                sendOTP();
              } else {
                verifyOTP();
              }
            }}>
              
              {/* STEP 1: Phone Input */}
              {step === 1 && (
                <div className="mb-5">
                  <div className="flex h-[50px] border border-[#E7D4AF] rounded-md overflow-hidden relative">
                    
                    {/* Country Selector */}
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="w-[80px] bg-black flex items-center justify-center gap-1 flex-shrink-0 hover:bg-gray-900 transition"
                    >
                      <span className="text-lg">{selectedCountry.flag}</span>
                      <span className="text-white text-xs font-medium">{selectedCountry.code}</span>
                      <FaChevronDown className="text-white text-xs" />
                    </button>

                    {/* Separator Line */}
                    <div className="w-px bg-[#E7D4AF]"></div>

                    {/* Phone Input */}
                    <input
                      type="tel"
                      name="phone"
                      value={data.phone}
                      onChange={handleChange}
                      placeholder="Enter Phone Number"
                      className="flex-1 px-4 text-sm focus:outline-none"
                      maxLength={10}
                    />

                    {/* Country Dropdown */}
                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-[200px] bg-white border border-gray-200 rounded-md shadow-lg z-30 max-h-[200px] overflow-y-auto">
                        {countries.map((country, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(country);
                              setShowCountryDropdown(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition text-left"
                          >
                            <span className="text-lg">{country.flag}</span>
                            <span className="text-sm text-gray-700">{country.country}</span>
                            <span className="text-xs text-gray-500 ml-auto">{country.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: OTP Input */}
              {step === 2 && (
                <div className="mb-5">
                  <div className="relative">
                    <input
                      type="text"
                      name="otp"
                      value={data.otp}
                      onChange={handleChange}
                      placeholder="Enter 6 digit OTP"
                      maxLength={6}
                      className="w-full h-[50px] px-4 pr-12 border border-[#E7D4AF] rounded-md text-sm focus:outline-none"
                    />
                    <FaLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  </div>

                  <div className="flex items-center justify-between mt-2.5">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-sm text-[#222] font-medium hover:text-[#C8942E] transition"
                    >
                      ← Back
                    </button>

                    <button
                      type="button"
                      onClick={sendOTP}
                      disabled={timer > 0}
                      className={`text-sm font-medium transition ${
                        timer > 0
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-[#C8942E] hover:underline"
                      }`}
                    >
                      {timer > 0
                        ? `Resend OTP in ${formatTime(timer)}`
                        : "Resend OTP"}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Additional Details */}
              {step === 3 && (
                <div className="space-y-3 mb-5">
                  <div className="p-2.5 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-700 text-sm text-center font-medium">
                      ✅ Phone Number Verified
                    </p>
                  </div>

                  <input
                    name="name"
                    placeholder="Full Name"
                    value={data.name}
                    onChange={handleChange}
                    required
                    className="w-full h-[50px] px-4 border border-[#E7D4AF] rounded-md text-sm focus:outline-none"
                  />

                  <input
                    name="email"
                    placeholder="Email Address"
                    type="email"
                    value={data.email}
                    onChange={handleChange}
                    required
                    className="w-full h-[50px] px-4 border border-[#E7D4AF] rounded-md text-sm focus:outline-none"
                  />

                  <select
                    name="gender"
                    value={data.gender}
                    onChange={handleChange}
                    required
                    className="w-full h-[50px] px-4 border border-[#E7D4AF] rounded-md text-sm focus:outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              )}

              {/* Submit Button */}
              {step !== 2 && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[50px] bg-gradient-to-r from-[#C8942E] to-[#D4A84B] hover:from-[#B8842E] hover:to-[#C4983B] text-white font-bold rounded-md transition-all duration-300 disabled:opacity-50 mb-5"
                >
                  {loading
                    ? "Processing..."
                    : step === 1
                    ? "Send OTP"
                    : "Create Account"}
                </button>
              )}

              {step === 2 && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[50px] bg-gradient-to-r from-[#C8942E] to-[#D4A84B] hover:from-[#B8842E] hover:to-[#C4983B] text-white font-bold rounded-md transition-all duration-300 disabled:opacity-50 mb-5"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              )}
            </form>
            )}

            {activeTab === "login" && (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Please go to login page for login</p>
                <button
                  onClick={() => handleTabSwitch("login")}
                  className="px-6 py-3 bg-gradient-to-r from-[#C8942E] to-[#D4A84B] text-white font-bold rounded-md hover:from-[#B8842E] hover:to-[#C4983B] transition-all duration-300"
                >
                  Go to Login
                </button>
              </div>
            )}

            {/* Info Section */}
            <div className="flex flex-col items-center text-center mb-5">
              <FaLock className="text-gray-400 text-xs mb-2" />
              <p className="text-xs text-[#6B7280] leading-relaxed">
                We will send a One Time Password (OTP)
                <br />
                to your mobile number
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-5">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Bottom Agreement */}
            <p className="text-center text-xs text-[#6B7280] leading-relaxed">
              By continuing, you agree to CadMax's
              <br />
              <Link href="/term-conditions" className="text-[#C8942E] hover:underline">
                Terms & Conditions
              </Link>
              {" & "}
              <Link href="/privacy-policy" className="text-[#C8942E] hover:underline">
                Privacy Policy
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}