import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiUser, FiShoppingBag } from "react-icons/fi";
import MegaMenu from "./MegaMenu";
import { useRole } from "@/context/RoleContext";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Image from "next/image";
import VendorMenu from "./VendorMenu";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import DesignMenu from "./DesignMenu";
import { FaRegAddressCard } from "react-icons/fa6";
import toast from "react-hot-toast";

export default function Header() {
  const { user, setUser } = useRole();

  const role = user?.role;
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const cartItemsRedux = useSelector((state) => state.cart.cartItems);

  /* SCROLL EFFECT */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* TEXT COLOR */
  const textColor = scrolled ? "text-black" : "text-black";

  /* ACTIVE ROUTE */
  const isActive = (path) =>
    router.pathname.startsWith(path) ||
    router.asPath.startsWith(path);

  /* CART COUNT */
  useEffect(() => {
    const total = cartItemsRedux.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
    setCartCount(total);
  }, [cartItemsRedux]);

  /* LOGOUT */
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout Successfully");
    setUser(null);
    setDropdownOpen(false)
    router.push("/");
  };

  return (
    <header
      className={`sticky top-0 z-[100] transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md"
          : "bg-white/30"
      }`}
    >
      <nav className="max-w-[1430px] container bg-transparent  mx-auto flex items-center justify-between px-6 xl:px-0 py-3 md:py-0">

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
        <ul className={`hidden md:flex items-center gap-8`}>
          <MegaMenu active={isActive("/product")} textColor={textColor} />
          <DesignMenu active={isActive("/design")} textColor={textColor} />
          <VendorMenu active={isActive("/vendor")} textColor={textColor} />
        </ul>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {role === "customer" ? (
            <div className="relative">
              <FiUser
                className={`cursor-pointer ${textColor}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
                  <ul className="text-black">
                    <Link href="/orders" className="block px-4 py-2 hover:bg-gray-100">
                      Order History
                    </Link>
                    <Link href="/setting" className="block px-4 py-2 hover:bg-gray-100">
                      Settings
                    </Link>
                    <Link href="/address" className="block px-4 py-2 hover:bg-gray-100">
                      Address
                    </Link>
                    <li
                      onClick={handleLogout}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Logout
                    </li>
                  </ul>
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
          <Link href="/checkout" className="relative">
            <FiShoppingBag className={textColor} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white px-1 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* MOBILE BUTTON */}
        <button
          className={`md:hidden ${textColor}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiOutlineX size={22} /> : <HiOutlineMenu size={22} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t">
          <ul className="flex flex-col p-4 space-y-3 text-black">
            <Link href="/product">PRODUCT</Link>
            <Link href="/design">DESIGN</Link>
            <Link href="/vendor">VENDOR</Link>
          </ul>
        </div>
      )}
    </header>
  );
}