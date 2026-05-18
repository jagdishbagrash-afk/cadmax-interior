import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Listing from "@/pages/api/Listing";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

export default function Register() {
  const router = useRouter();

  // ================= STATES =================
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // 5 MIN TIMER
  const [timer, setTimer] = useState(0);

  const [data, setData] = useState({
    phone: "",
    otp: "",
    name: "",
    email: "",
    gender: "",
    password: "",
    confirm_password: "",
  });

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= BACK BUTTON =================
  const handleBack = () => {

    // STEP 2 → STEP 1
    if (step === 2) {
      setStep(1);

      setData((prev) => ({
        ...prev,
        otp: "",
      }));

      // RESET TIMER
      setTimer(0);
    }

    // STEP 3 → STEP 2
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

      const res = await main.UserSendOTP({
        phone: data.phone,
      });

      if (res?.data?.status) {
        toast.success("OTP sent successfully");
        setTimer(300);

        setStep(2);
      } else {
        toast.error(
          res?.data?.message || "OTP send failed"
        );
      }

    } catch (err) {
      const msg = err?.response?.data?.message;

      if (msg?.includes("Already registered")) {
        toast.error(
          "Account already exists, please login"
        );
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

      const res = await main.VerifyOTP({
        phone: data.phone,
        otp: data.otp,
      });

      if (res?.data?.success) {
        toast.success("Phone verified");
        setStep(3);
      } else {
        toast.error(
          res?.data?.message || "Invalid OTP"
        );
      }

    } catch (error) {
      console.log(error);

      toast.error("OTP verification failed");
    }

    setLoading(false);
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
        toast.error(
          res?.data?.message ||
          "Registration failed"
        );
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <div className="bg-white px-4 md:px-6 lg:px-16 pt-5 pb-10 lg:pb-20 rounded-[20px] md:rounded-[20px] lg:rounded-[40px] shadow lg:shadow-lg w-full max-w-[976px]">

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

        {/* TITLE */}
        <h2 className="text-center text-[#000000] text-2xl lg:text-4xl font-bold tracking-[-0.04em] mb-6 lg:mb-8">
          Register
        </h2>

        <div className="max-w-[551px] mx-auto">

          {/* ================= STEP 1 ================= */}
          {step === 1 && (
            <div className="max-w-md mx-auto">

              <input
                type="tel"
                name="phone"
                maxLength={10}
                value={data.phone}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, "");

                  handleChange({
                    target: {
                      name: "phone",
                      value,
                    },
                  });
                }}
                placeholder="Enter mobile number"
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full h-[50px] px-4 rounded-lg border bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
              />

              <button
                onClick={sendOTP}
                disabled={loading}
                className="mt-4 bg-black text-white w-full h-[48px] rounded-lg font-semibold hover:bg-gray-900 transition disabled:opacity-50"
              >
                {loading
                  ? "Sending..."
                  : "Send OTP"}
              </button>

            </div>
          )}

          {/* ================= STEP 2 ================= */}
          {step === 2 && (
            <div className="max-w-md mx-auto">

              <input
                type="text"
                name="otp"
                placeholder="Enter 6 digit OTP"
                value={data.otp}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, "");

                  if (value.length <= 6) {
                    handleChange({
                      target: {
                        name: "otp",
                        value,
                      },
                    });
                  }
                }}
                maxLength={6}
                className="w-full h-[50px] px-4 border rounded-lg bg-gray-100 focus:ring-1 focus:ring-black"
              />

              <button
                onClick={verifyOTP}
                disabled={loading}
                className="mt-4 bg-black text-white w-full h-[48px] rounded-lg font-semibold hover:bg-gray-900 transition disabled:opacity-50"
              >
                {loading
                  ? "Verifying..."
                  : "Verify OTP"}
              </button>

              {/* BACK + RESEND */}
              <div className="flex items-center justify-between mt-3">

                <button
                  type="button"
                  onClick={handleBack}
                  className="text-sm font-medium text-black hover:underline"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={sendOTP}
                  disabled={timer > 0}
                  className={`text-sm font-medium transition
      ${timer > 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-black hover:underline"
                    }`}
                >
                  {timer > 0
                    ? `Resend OTP in ${formatTime(timer)}`
                    : "Resend OTP"}
                </button>


              </div>

            </div>
          )}

          {/* ================= STEP 3 ================= */}
          {step === 3 && (
            <div className="max-w-[551px] mx-auto">

              <form onSubmit={handleRegister}>

                <p className="text-green-600 text-center mb-6 font-medium">
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
                    <option value="">
                      Select Gender
                    </option>

                    <option value="male">
                      Male
                    </option>

                    <option value="female">
                      Female
                    </option>

                    <option value="other">
                      Other
                    </option>
                  </select>

                </div>

                {/* REGISTER BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition disabled:opacity-50"
                >
                  {loading
                    ? "Creating Account..."
                    : "Register"}
                </button>

                {/* BACK BUTTON */}
                <button
                  type="button"
                  onClick={handleBack}
                  className="mt-3 w-full border border-black text-black py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  ← Back
                </button>

              </form>

            </div>
          )}

        </div>

        {/* LOGIN LINK */}
        <p className="text-center mt-6 text-sm text-gray-600">

          Already have an account?

          <Link
            href="/login"
            className="ml-2 font-semibold underline text-black"
          >
            Login
          </Link>

        </p>

      </div>
    </div>
  );
}

