"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { IoIosMenu, IoMdArrowRoundBack } from "react-icons/io";
import {
  MdSpaceDashboard,
  MdVerifiedUser,
  MdBorderAll,
  MdLabel,
  MdBookmarks,
  MdTask,
} from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";
import { BsCartCheckFill } from "react-icons/bs";
import { GiLeadPipe } from "react-icons/gi";
import { IoSettingsOutline } from "react-icons/io5";

function SideBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // ✅ MENU CONFIG (easy to manage)
  const menuItems = [
    { name: "Users", path: "/admin/user", icon: <MdVerifiedUser /> },
    { name: "Vendors", path: "/admin/vendor/vendor", icon: <MdVerifiedUser /> },

    { name: "Products", path: "/admin/product", icon: <AiFillProduct /> },

    { name: "Orders", path: "/admin/order", icon: <BsCartCheckFill /> },
    { name: "Payments", path: "/admin/payment", icon: <MdBorderAll /> },

    { name: "Leads", path: "/admin/lead", icon: <GiLeadPipe /> },
    { name: "Bookings", path: "/admin/booking", icon: <MdBookmarks /> },
    { name: "Projects", path: "/admin/project", icon: <MdTask /> },

    { name: "Concept", path: "/admin/services/services", icon: <AiFillProduct /> },
    { name: "Banners", path: "/admin/banner", icon: <MdLabel /> },

    { name: "Settings", path: "/admin/setting", icon: <IoSettingsOutline /> },
  ];

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      {!isOpen && (
        <button
          className="lg:hidden fixed top-3 left-3 z-50 bg-white shadow p-2 rounded-md"
          onClick={() => setIsOpen(true)}
        >
          <IoIosMenu size={22} />
        </button>
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-[260px] bg-white shadow-lg z-50 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* CLOSE BUTTON */}
        {isOpen && (
          <button
            className="lg:hidden absolute top-4 right-4 text-red-500"
            onClick={() => setIsOpen(false)}
          >
            <IoMdArrowRoundBack size={20} />
          </button>
        )}

        {/* LOGO */}
        <div className="h-16 flex items-center justify-center border-b font-bold text-lg">
          Admin Panel
        </div>

        {/* MENU */}
        <div className="mt-4 px-2 space-y-1 overflow-y-auto h-[calc(100%-70px)]">

          {menuItems.map((item, index) => {
            const isActive = pathname === item.path;

            return (
              <Link
                key={index}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
                  
                  ${isActive
                    ? "bg-black text-white shadow"
                    : "text-gray-600 hover:bg-gray-100"}
                `}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default SideBar;