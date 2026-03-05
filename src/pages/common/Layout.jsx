import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useRole } from "@/context/RoleContext";
import Listing from "../api/Listing";

export default function Layout({ children }) {
  const { user, setUser } = useRole();
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Profile
  const fetchData = async (signal) => {
    try {
      const main = new Listing();
      const response = await main.profileVerify(signal);

      if (response?.data?.data) {
        setUser(response.data.data);
      }
    } catch (error) {
      localStorage?.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);

    return () => controller.abort();
  }, []);

  if (loading) return null;


  return (
    <>
     <Header />
        <main>{children}</main>
      
        <Footer />
    </>
  );
}
