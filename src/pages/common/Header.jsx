"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import { FiUser, FiShoppingBag } from "react-icons/fi";
import MegaMenu from "./MegaMenu";
import { useRole } from "@/context/RoleContext";
import { useRouter } from "next/router";
import { MdHistory, MdLogout } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosMenu } from "react-icons/io";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { MdOutlineSettings, MdOutlineSecurity, MdOutlineAvTimer, MdOutlineLogout, } from "react-icons/md";

export default function Header() {
  const { user, setUser } = useRole();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const cartItemsRedux = useSelector((state) => state.cart.cartItems);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const totalQuantity = cartItemsRedux.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0,
    );
    setCartCount(totalQuantity);
  }, [cartItemsRedux]);

  const handleLogout = () => {
    localStorage && localStorage.removeItem("token");
    toast.success("Logout Successfully");
    setUser(null);
    setMenuOpen(false);
    setDropdownOpen(false);
    router.push("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-[1350px] mx-auto flex items-center justify-between px-6 xl:px-0 py-3">
        {/* Logo */}
        <Link href="/" className="text-xl font-extrabold text-black">
          CADMAX
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 text-sm">
          <li className="font-medium text-black hover:text-gray-500">
            <Link href="/">CADMAX</Link>
          </li>
          <MegaMenu />
          <li className="font-medium text-black hover:text-gray-500">
            <Link href="/concept">CONCEPT</Link>
          </li>
          <li className="font-medium text-black hover:text-gray-500">
            <Link href="/project">PROJECTS</Link>
          </li>
          <li className="font-medium text-black hover:text-gray-500">
            <Link href="/booking">BOOKING</Link>
          </li>
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative hidden md:block">
              <FiUser
                size={18}
                className="cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
                  <Link href="/orders" className="dropdown-item">
                    <MdHistory /> Order History
                  </Link>
                  <Link href="/security" className="dropdown-item">
                    <MdOutlineSecurity /> Security
                  </Link>
                  <Link href="/setting" className="dropdown-item">
                    <IoSettingsOutline /> Settings
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    <MdLogout /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex gap-3">
              <Link href="/login">Login</Link>
              <Link href="/register">Signup</Link>
            </div>
          )}

          <Link href="/checkout" className="relative">
            <FiShoppingBag size={18} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <IoIosMenu size={24} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t">
          <ul className="px-6 py-4 space-y-3 flex flex-col">
            <li className="font-medium hover:text-gray-500">
              <Link onClick={closeMenu} href="/concept">
                CONCEPT
              </Link>
            </li>
            <li className="font-medium hover:text-gray-500">
              <Link onClick={closeMenu} href="/project">
                PROJECTS
              </Link>
            </li>
            <li className="font-medium hover:text-gray-500">
              <Link onClick={closeMenu} href="/booking">
                BOOKING
              </Link>
            </li>

            {/* AUTH SECTION */}
            {user ? (
              <>
                <li className="text-2xl text-gray-700 mb-3 border-t border-gray-200 pt-4">
                  My Account
                </li>
                <ul className="space-y-3">
                  <li className="font-medium hover:text-gray-500">
                    <Link
                      onClick={closeMenu}
                      href="/orders"
                      className="flex gap-3"
                    >
                      <MdOutlineAvTimer size={24} /> Order History
                    </Link>
                  </li>
                  <li className="font-medium hover:text-gray-500">
                    <Link
                      onClick={closeMenu}
                      href="/security"
                      className="flex gap-3"
                    >
                      <MdOutlineSecurity size={24} /> Security
                    </Link>
                  </li>
                  <li className="font-medium hover:text-gray-500">
                    <Link
                      onClick={closeMenu}
                      href="/setting"
                      className="flex gap-3"
                    >
                      <MdOutlineSettings size={24} /> Settings
                    </Link>
                  </li>
                  <li className="font-medium hover:text-gray-500">
                    <button onClick={handleLogout} className="flex gap-3">
                      <MdOutlineLogout size={24} /> Logout
                    </button>
                  </li>
                </ul>
              </>
            ) : (
              <li className="pt-4 space-y-3 flex flex-col">
                <Link
                  onClick={closeMenu}
                  href="/login"
                  className="block w-full text-center py-2 rounded-md border border-black text-black font-medium hover:bg-black hover:text-white transition"
                >
                  Login
                </Link>

                <Link
                  onClick={closeMenu}
                  href="/register"
                  className="block w-full text-center py-2 rounded-md bg-black text-white font-medium hover:bg-white hover:text-black hover:border hover:border-black transition"
                >
                  Signup
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
