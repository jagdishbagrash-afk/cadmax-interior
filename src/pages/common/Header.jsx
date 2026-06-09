import React, { useEffect, useState } from "react";
import Link from "next/link";
import MegaMenu from "./MegaMenu";
import { useRole } from "@/context/RoleContext";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Image from "next/image";
import VendorMenu from "./VendorMenu";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import DesignMenu from "./DesignMenu";
import toast from "react-hot-toast";
import SearchPopup from "./SearchPopup";
import Listing from "../api/Listing";
import {
  FiMapPin,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { DiJava } from "react-icons/di";
export default function Header() {
  const { user, setUser } = useRole();

  const role = user?.role;
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // SEARCH STATES

  const cartItemsRedux = useSelector((state) => state.cart.cartItems);

  /* SCROLL EFFECT */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [cartCount, setCartCount] = useState(0);

  /* FETCH CART */
  const FetchCart = async () => {
    try {
      const main = new Listing();
      const response = await main.CartGet();

      const items = response?.data?.data?.items || [];

      // SET COUNT
      const totalQuantity = items.reduce(
        (sum, item) => sum + (item.quantity || 1),
        0
      );

      setCartCount(totalQuantity);

      // OPTIONAL LOCAL STORAGE UPDATE
      localStorage.setItem("cartItems", JSON.stringify(items));

    } catch (error) {
      console.log(error);

      setCartCount(0);
      localStorage.removeItem("cartItems");
    }
  };

  /* INITIAL LOAD */
  useEffect(() => {
    FetchCart();
  }, []);

  /* REAL TIME AUTO REFRESH */
  useEffect(() => {
    const interval = setInterval(() => {
      FetchCart();
    }, 2000);

    return () => clearInterval(interval);
  }, []);
  /* TEXT COLOR */
  const textColor = scrolled ? "text-black" : "text-black";

  /* ACTIVE ROUTE */
  const isActive = (path) =>
    router.pathname.startsWith(path) ||
    router.asPath.startsWith(path);

  /* CART */
  const wishlistCount = useSelector((state) => state.wishlist.count);

  const [record, setRecord] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cartData =
        JSON.parse(localStorage.getItem("cartItems")) || [];
      setRecord(cartData);
    }
  }, []);


  /* LOGOUT */
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout Successfully");
    setUser(null);
    setDropdownOpen(false);
    router.push("/");
  };


  return (
    <>
      <header
        className={`sticky top-0 z-[100] transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-white/30"
          }`}
      >
        <nav className="max-w-[1430px] container bg-transparent mx-auto flex items-center justify-between px-6 xl:px-0 py-3 md:py-0">

          {/* LOGO */}
          <Link href="/" className="mt-2 mb-2">
            <Image
              src="/Logo.png"
              width={200}
              height={80}
              alt="Logo"
              className="h-[50px] sm:h-[60px] md:h-[70px] w-auto object-cover"
            />
          </Link>

          {/* DESKTOP MENU */}
          <ul className="hidden md:flex items-center gap-8">
            <MegaMenu
              active={isActive("/product")}
              textColor={textColor}
            />

            <DesignMenu
              active={isActive("/design")}
              textColor={textColor}
            />

            <VendorMenu
              active={isActive("/vendor")}
              textColor={textColor}
            />
          </ul>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            {/* SEARCH ICON */}
            <SearchPopup textColor={textColor} />

            {/* USER */}
            {role === "customer" ? (
              <div className="relative">
                <FiUser
                  size={24}
                  className={`cursor-pointer ${textColor}`}
                  onClick={() =>
                    setDropdownOpen(!dropdownOpen)
                  }
                />

                {dropdownOpen && (
                  <div className="hidden md:block absolute -right-4 mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">

                    {/* Profile Header */}
                    <div  
                    onClick={() => setDropdownOpen(false)}
                     className="px-2 py-2 bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white">
                      <Link href="/setting"  className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-semibold truncate">
                            {user?.name || "User"}
                          </h3>

                          <p className="text-sm text-white/80 truncate">
                            {user?.email || ""}
                          </p>
                        </div>
                      </Link>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href="/orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all duration-200"
                      >
                        <FiShoppingBag size={18} />
                        <span>Order History</span>
                      </Link>

                      <Link
                        href="/wishlist"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Wishlist
                      </Link>

                      <Link
                        href="/setting"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all duration-200"
                      >
                        <FiSettings size={18} />
                        <span>Settings</span>
                      </Link>

                      <Link
                        href="/address"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all duration-200"
                      >
                        <FiMapPin size={18} />
                        <span>Address</span>
                      </Link>

                      <div className="border-t border-gray-100 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition-all duration-200"
                      >
                        <FiLogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={`flex gap-3 ${textColor}`}>
                <Link href="/login">Login</Link>
                <Link href="/register">Signup</Link>
              </div>
            )}

            {/* CART */}
            {role === "customer" && (
              <Link
                href="/checkout"
                className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-200"
              >
                <FiShoppingBag
                  className={`${textColor} text-[22px]`}
                />

                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-semibold bg-red-500 text-white rounded-full shadow-md">
                    {cartCount > 99
                      ? "99+"
                      : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* MOBILE MENU BUTTON */}
            <button
              className={`md:hidden ${textColor}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <HiOutlineX size={22} />
              ) : (
                <HiOutlineMenu size={22} />
              )}
            </button>
          </div>
        </nav>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg rounded-b-2xl">
            <ul className="flex flex-col p-4 space-y-2 text-black text-[15px] font-medium">
              <Link
                href="/product"
                className="px-4 py-3 rounded-xl hover:bg-gray-100 transition-all duration-200"
              >
                PRODUCT
              </Link>

              <Link
                href="/design"
                className="px-4 py-3 rounded-xl hover:bg-gray-100 transition-all duration-200"
              >
                DESIGN
              </Link>

              <Link
                href="/vendor"
                className="px-4 py-3 rounded-xl hover:bg-gray-100 transition-all duration-200"
              >
                VENDOR
              </Link>

              {role === "customer" && (
                <div className="border-t pt-2 mt-2 space-y-2">
                  <Link
                    href="/orders"
                    className="block px-4 py-3 rounded-xl hover:bg-gray-100 transition-all duration-200"
                  >
                    Order History
                  </Link>

                  <Link
                    href="/wishlist"
                    className="block px-4 py-3 rounded-xl hover:bg-gray-100 transition-all duration-200"
                  >
                    Wish List
                  </Link>

                  <Link
                    href="/setting"
                    className="block px-4 py-3 rounded-xl hover:bg-gray-100 transition-all duration-200"
                  >
                    Settings
                  </Link>

                  <Link
                    href="/address"
                    className="block px-4 py-3 rounded-xl hover:bg-gray-100 transition-all duration-200"
                  >
                    Address
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </ul>
          </div>
        )}
      </header>

      {/* SEARCH POPUP */}

    </>
  );
}