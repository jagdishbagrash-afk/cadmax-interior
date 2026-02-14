import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoIosArrowDown } from "react-icons/io";
import { FiSearch, FiUser, FiShoppingBag } from "react-icons/fi";
import MegaMenu from "./MegaMenu";
import { useRole } from "@/context/RoleContext";
import { useRouter } from "next/router";
// import { MdOutlineAvTimer } from "react-icons/md";
import { MdHistory } from "react-icons/md";
import { MdOutlineSecurity } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function Header() {
  const { user, setUser } = useRole();
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const cartItemsRedux = useSelector((state) => state.cart.cartItems);
  // console.log("cartItemsRedux", cartItemsRedux);
  // const cartCount = cartItemsRedux?.length || 0;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const totalQuantity = cartItemsRedux.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );

    setCartCount(totalQuantity);
  }, [cartItemsRedux]);

  const handleLogout = () => {
    localStorage && localStorage.removeItem("token");
    // router.push("/login");
    toast.success("Logout Successfully");
    setUser(null);
  };

  // console.log("user", user);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-[1350px] mx-auto flex items-center justify-between px-6 xl:px-0 py-3">
        {/* Left Logo */}
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-black"
        >
          CADMAX
        </Link>

        {/* Center Menu */}
        <ul className="hidden md:flex items-center gap-8">
          <li>
            <Link
              href="/"
              className={`${router.pathname === "/" ? "text-yellow-500" : "text-black"} text-sm font-medium hover:text-gray-500 transition`}
            >
              Home
            </Link>
          </li>
          <MegaMenu />
          <li>
            <Link
              href="/concept"
              className={`${router.pathname === "/concept" ? "text-yellow-500" : "text-black"} text-sm font-medium hover:text-gray-500 transition`}
            >
              CONCEPT
            </Link>
          </li>
          <li>
            <Link
              href="/project"
              className={`${router.pathname === "/project" ? "text-yellow-500" : "text-black"} text-sm font-medium hover:text-gray-500 transition`}

            >
              PROJECTS
            </Link>
          </li>
          <li>
            <Link
              href="/booking"
              className={`${router.pathname === "/booking" ? "text-yellow-500" : "text-black"} text-sm font-medium hover:text-gray-500 transition`}
            >
              BOOKING
            </Link>
          </li>
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <FiUser
                size={18}
                className="cursor-pointer text-[#171717]"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                  <ul className="py-1">
                    <Link
                      href="/orders"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <MdHistory size={24} />
                      Order History
                    </Link>

                    <Link
                      href="/security"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <MdOutlineSecurity size={24} />
                      Security
                    </Link>

                    <Link
                      href="/setting"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <IoSettingsOutline size={18} />
                      Settings
                    </Link>

                    <li
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <MdLogout size={18} />
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-[#171717] hover:underline">
                Login
              </Link>
              <Link href="/register" className="text-sm font-medium text-[#171717] hover:underline">
                Signup
              </Link>
            </div>
          )}

          <Link href="/checkout" className="relative">
            <FiShoppingBag size={18} className="cursor-pointer text-[#171717]" />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-semibold text-white bg-red-500 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <ul className="flex flex-col px-6 py-3 space-y-3">
            <li>
              <Link href="/"
                className={`${router.pathname === "/" ? "text-yellow-500" : "text-black"} text-sm font-medium hover:text-gray-500 transition`}

              >
                CADMAX
              </Link>
            </li>
            <li className="group relative">
              <Link
                href="/product"
                className={`${router.pathname === "/product" ? "text-yellow-500" : "text-black"} text-sm font-medium hover:text-gray-500 transition`}

              >
                PRODUCT
              </Link>

              <div
                className="
      absolute left-1/2 -translate-x-1/2 
      w-[90vw] 
      bg-white shadow-2xl rounded-xl 
      p-8 mt-5 hidden group-hover:block 
      animate-[topToCenter_0.45s_ease-out]
      z-50
    "
              >
                <div className="grid grid-cols-5 gap-6">

                  <Link href="/product?cat=furniture" className="block">
                    <img src="/productImages/furniture.jpg" className="rounded-xl h-48 w-full object-cover" />
                    <p className="text-center mt-2 font-medium">FURNITURE</p>
                  </Link>

                  <Link href="/product?cat=sofa" className="block">
                    <img src="/productImages/sofa.jpg" className="rounded-xl h-48 w-full object-cover" />
                    <p className="text-center mt-2 font-medium">SOFA & SEATING</p>
                  </Link>

                  <Link href="/product?cat=lamps" className="block">
                    <img src="/productImages/lamps.jpg" className="rounded-xl h-48 w-full object-cover" />
                    <p className="text-center mt-2 font-medium">LAMPS & LIGHTING</p>
                  </Link>

                  <Link href="/product?cat=upholstery" className="block">
                    <img src="/productImages/upholstery.jpg" className="rounded-xl h-48 w-full object-cover" />
                    <p className="text-center mt-2 font-medium">UPHOLSTERY</p>
                  </Link>

                  <Link href="/product?cat=decor" className="block">
                    <img src="/productImages/decor.jpg" className="rounded-xl h-48 w-full object-cover" />
                    <p className="text-center mt-2 font-medium">HOME DÉCOR</p>
                  </Link>

                </div>
              </div>
            </li>


            <li>
              <Link href="/concept"
                className={`${router.pathname === "/concept" ? "text-yellow-500" : "text-black"} text-sm font-medium hover:text-gray-500 transition`}

              >
                CONCEPT
              </Link>
            </li>
            <li>
              <Link href="/project"
                className={`${router.pathname === "/project" ? "text-yellow-500" : "text-black"} text-sm font-medium hover:text-gray-500 transition`}
              >
                PROJECTS
              </Link>
            </li>
            <li>
              <Link href="/booking"
                className={`${router.pathname === "/booking" ? "text-yellow-500" : "text-black"} text-sm font-medium hover:text-gray-500 transition`}
              >
                BOOKING
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
