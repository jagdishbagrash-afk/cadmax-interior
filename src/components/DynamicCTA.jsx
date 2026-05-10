"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import Listing from "@/pages/api/Listing";
import { useRole } from "@/context/RoleContext";

export default function DynamicCTA({ cta, record }) {
  const { user } = useRole();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // ✅ Safety checks
      if (!record?.name || !record?.phone) {
        toast.error("Missing user details");
        return;
      }

      const main = new Listing();

      const payload = {
        name: record?.name || "",
        email: record?.email || "",
        phone: record?.phone || "",
        message: "" || record?.content || "",
        pageurl: typeof window !== "undefined" ? window.location.href : "",
        services: cta?.types || "",
      };

      const res = await main.LeadAdd(payload);

      if (res?.data?.status) {
        toast.success(res?.data?.message || "Submitted successfully");
      } else {
        toast.error(res?.data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();

    if (!cta) return;

    // ❌ Not logged in
    if (!user) {
      toast.error("Please login first");

      const redirectUrl = `${cta.redirect}?redirect=${encodeURIComponent(
        cta.redirectAfterLogin || "/"
      )}&autoSubmit=${cta.autoSubmit}`;

      router.push(redirectUrl);
      return;
    }

    // ✅ Logged in
    if (cta.autoSubmit) {
      handleSubmit();
    } else if (cta.redirectAfterLogin) {
      router.push(cta.redirectAfterLogin);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full md:w-auto px-6 cursor-pointer py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Processing..." : cta?.text || "Submit"}
    </button>
  );
}