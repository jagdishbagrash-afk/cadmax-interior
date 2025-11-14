import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoIosArrowDown } from "react-icons/io";
import { FiSearch, FiUser, FiShoppingBag } from "react-icons/fi";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

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
              className="text-sm font-medium text-black hover:text-gray-500 transition"
            >
              CADMAX
            </Link>
          </li>
          <li className="flex items-center gap-1 cursor-pointer text-sm font-medium text-black hover:text-gray-500 transition">
            PRODUCT <IoIosArrowDown size={14} />
          </li>
          <li className="flex items-center gap-1 cursor-pointer text-sm font-medium text-black hover:text-gray-500 transition">
            CONCEPT <IoIosArrowDown size={14} />
          </li>
          <li>
            <Link
              href="/projects"
              className="text-sm font-medium text-black hover:text-gray-500 transition"
            >
              PROJECTS
            </Link>
          </li>
          <li>
            <Link
              href="/booking"
              className="text-sm font-medium text-black hover:text-gray-500 transition"
            >
              BOOKING
            </Link>
          </li>
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          <FiSearch size={18} className="cursor-pointer text-[#171717]" />
          <FiUser size={18} className="cursor-pointer text-[#171717]" />
          <FiShoppingBag
            size={18}
            className="cursor-pointer text-[#171717]"
          />
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

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <ul className="flex flex-col px-6 py-3 space-y-3">
            <li>
              <Link href="/" className="text-black text-sm font-medium">
                CADMAX
              </Link>
            </li>
            <li>
              <Link href="/product" className="text-black text-sm font-medium">
                PRODUCT
              </Link>
            </li>
            <li>
              <Link href="/concept" className="text-black text-sm font-medium">
                CONCEPT
              </Link>
            </li>
            <li>
              <Link href="/projects" className="text-black text-sm font-medium">
                PROJECTS
              </Link>
            </li>
            <li>
              <Link href="/booking" className="text-black text-sm font-medium">
                BOOKING
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
