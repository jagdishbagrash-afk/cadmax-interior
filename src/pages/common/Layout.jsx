import React, { useEffect, useState, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useRole } from "@/context/RoleContext";
import Listing from "../api/Listing";
import useWishlist from "@/hooks/useWishlist";
import { useDispatch } from "react-redux";
import { clearWishlist } from "@/redux/wishlistSlice";

export default function Layout({ children }) {
  const { user, setUser } = useRole();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const prevUserIdRef = useRef("__initial__");

  const { fetchWishlist } = useWishlist();

  // Combined init: skip profileVerify if user already set (e.g. after login redirect)
  const initializeApp = async () => {
    try {
      // If user is already in context (set by login page), skip API profileVerify
      if (user?._id) {
        // Directly fetch wishlist (localStorage already loaded by initialState)
        if (user?.role === "customer") {
          try {
            await fetchWishlist();
          } catch (e) {
            // API fail - localStorage data is fine
          }
        }
      } else {
        const main = new Listing();
        const response = await main.profileVerify();

        const userData = response?.data?.data || null;

        if (userData) setUser(userData);

        if (userData?.role === "customer") {
          try {
            await fetchWishlist();
          } catch (e) {
            // API fail - localStorage data works fine
          }
        }
      }
    } catch (error) {
      localStorage?.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  // Handle user changes (login/logout without page reload)
  useEffect(() => {
    if (loading) return;

    const currentUserId = user?._id || null;

    if (prevUserIdRef.current === "__initial__") {
      prevUserIdRef.current = currentUserId;
      return;
    }

    // User changed (different user OR logout)
    if (prevUserIdRef.current !== currentUserId) {
      dispatch(clearWishlist()); // removes localStorage + Redux state
      prevUserIdRef.current = currentUserId;

      if (user?.role === "customer") {
        fetchWishlist(); // API fetch -> saves to localStorage + Redux
      }
    }
  }, [user, fetchWishlist, dispatch, loading]);

  if (loading) return null;


  return (
    <>
      <Header />
     <main>{children}</main>

      <Footer />
    </>
  );
}
