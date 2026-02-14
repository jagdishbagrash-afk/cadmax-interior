import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiUser, FiShoppingBag } from "react-icons/fi";
import MegaMenu from "./MegaMenu";
import { useRole } from "@/context/RoleContext";
import { useRouter } from "next/router";
import { MdHistory, MdOutlineSecurity, MdLogout } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function Header() {
  const { user, setUser } = useRole();
  const router = useRouter();

  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const cartItemsRedux = useSelector((state) => state.cart.cartItems);

  /* ---------------- ACTIVE ROUTE HELPER ---------------- */
  const isActive = (path) =>
    router.pathname.startsWith(path) ||
    router.asPath.startsWith(path);

  /* ---------------- CART COUNT ---------------- */
  useEffect(() => {
    const totalQuantity = cartItemsRedux.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
    setCartCount(totalQuantity);
  }, [cartItemsRedux]);

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout Successfully");
    setUser(null);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-[1350px] mx-auto flex items-center justify-between px-6 xl:px-0 py-3">

        {/* LOGO */}
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          CADMAX
        </Link>

        {/* ================= DESKTOP MENU ================= */}
        <ul className="hidden md:flex items-center gap-8">
          <li>
            <Link
              href="/"
              className={`${router.pathname === "/"
                  ? "text-yellow-500"
                  : "text-black"
                } text-sm font-medium hover:text-gray-500 transition`}
            >
              HOME
            </Link>
          </li>

          {/* Mega Menu */}
          <MegaMenu active={isActive("/product")} />

          <li>
            <Link
              href="/concept"
              className={`${isActive("/concept") ? "text-yellow-500" : "text-black"
                } text-sm font-medium hover:text-gray-500 transition`}
            >
              CONCEPT
            </Link>
          </li>

          <li>
            <Link
              href="/project"
              className={`${isActive("/project") ? "text-yellow-500" : "text-black"
                } text-sm font-medium hover:text-gray-500 transition`}
            >
              PROJECTS
            </Link>
          </li>

          <li>
            <Link
              href="/booking"
              className={`${isActive("/booking") ? "text-yellow-500" : "text-black"
                } text-sm font-medium hover:text-gray-500 transition`}
            >
              BOOKING
            </Link>
          </li>
        </ul>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <FiUser
                size={18}
                className="cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />

              {dropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border rounded-md shadow-lg">
                  <ul className="py-1">
                    <Link href="/orders" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                      <MdHistory /> Order History
                    </Link>

                    <Link href="/security" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                      <MdOutlineSecurity /> Security
                    </Link>

                    <Link href="/setting" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                      <IoSettingsOutline /> Settings
                    </Link>

                    <li
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <MdLogout /> Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <Link href="/login" className="text-sm hover:underline">
                Login
              </Link>
              <Link href="/register" className="text-sm hover:underline">
                Signup
              </Link>
            </div>
          )}

          {/* CART */}
          <Link href="/checkout" className="relative">
            <FiShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 text-[10px] flex items-center justify-center text-white bg-red-500 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white">
          <ul className="flex flex-col px-6 py-3 space-y-3">

            <Link
              href="/"
              className={`${router.pathname === "/" ? "text-yellow-500" : "text-black"
                }`}
            >
              HOME
            </Link>

            <Link
              href="/product"
              className={`${isActive("/product") ? "text-yellow-500" : "text-black"
                }`}
            >
              PRODUCT
            </Link>

            <Link
              href="/concept"
              className={`${isActive("/concept") ? "text-yellow-500" : "text-black"
                }`}
            >
              CONCEPT
            </Link>

            <Link
              href="/project"
              className={`${isActive("/project") ? "text-yellow-500" : "text-black"
                }`}
            >
              PROJECTS
            </Link>

            <Link
              href="/booking"
              className={`${isActive("/booking") ? "text-yellow-500" : "text-black"
                }`}
            >
              BOOKING
            </Link>

          </ul>
        </div>
      )}
    </header>
  );
}
