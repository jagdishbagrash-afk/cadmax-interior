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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Send OTP
  const handleSendOTP = async () => {
    if (data.phone.length !== 10) {
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
        toast.error(res?.data?.message || "Failed to send OTP");
      }
    } catch (err) {
      console.log("err" ,err)
      toast.error(err.response.data.message);
    }
    setLoading(false);
  };
console.log("redirect" ,redirect)
  // ✅ Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
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

      if (res?.data?.status) {
        localStorage && localStorage.setItem("token", res?.data?.data?.token);
        toast.success("Login successful");
             if (redirect) {
          router.push(`${redirect}`);
          return;
        }else{
          router.push("/");
        }
      } else {
        toast.error(res?.data?.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error("Verification failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white px-4 md:px-6 lg:px-16 pt-5 pb-10 lg:pb-20  rounded-[20px] md:rounded-[20px] lg:rounded-[40px] shadow lg:shadow-lg w-full max-w-[976px] login_custom">

        {/* ✅ Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/">
            <Image
              src="/Logo.png"
              alt="CADMAX Interior Logo"
              width={200}
              height={400}
              className="object-cover"

              priority
            />
          </Link>
        </div>
        <h2 className="text-center text-[#000000] text-2xl lg:text-4xl font-bold mb-6 tracking-[-0.04em] mb-6 lg:mb-8">
          Login with OTP
        </h2>
        {/* ✅ Title */}
        <p className="text-center text-sm text-gray-500 mb-6">
          Enter your phone number to receive OTP
        </p>

        {/* ✅ FORM */}
        <div className="max-w-[551px] mx-auto">
          <form onSubmit={handleVerifyOTP}>

            {/* ✅ PHONE INPUT */}
            {step === 1 && (
              <div className="mb-5">
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  Phone Number
                </label>
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

              </div>
            )}

            {/* ✅ OTP INPUT */}
            {step === 2 && (
              <div className="mb-5">
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  Enter OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  value={data.otp}
                  onChange={handleChange}
                  placeholder="6 digit OTP"
                  className="w-full h-[50px] px-4 rounded-lg border bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
                />
                <p
                  className="text-[14px] mt-1 cursor-pointer text-right text-gray-500"
                  onClick={handleSendOTP}
                >
                  Resend OTP
                </p>
              </div>
            )}

            {/* ✅ BUTTON */}
            {step === 1 ? (
              <button
                type="button"
                disabled={loading}
                onClick={handleSendOTP}
                className="cursor-pointer w-full bg-black text-white h-[50px] rounded-lg font-semibold hover:bg-gray-900 transition"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white h-[50px] rounded-lg font-semibold hover:bg-gray-900 transition"
              >
                {loading ? "Processing..." : "Login"}
              </button>
            )}
          </form>
        </div>
        {/* ✅ REGISTER */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Not registered?{" "}
          <Link href="/register" className="text-black font-medium hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
