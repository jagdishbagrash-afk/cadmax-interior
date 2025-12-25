import React, { useState } from "react";
import { MdSpaceDashboard, MdReviews, MdPayments } from "react-icons/md";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { IoIosMenu } from "react-icons/io";
import { IoMdArrowRoundBack } from "react-icons/io";
import Image from "next/image";
import { PiChalkboardTeacherFill } from "react-icons/pi";
import { PiStudentFill } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineRateReview } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { MdOutlineReviews } from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";
import { BsCartCheckFill } from "react-icons/bs";

function SideBar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {!isOpen &&
                <button
                    className="lg:hidden p-2 fixed font-bold top-2.5 text-[#565F66] z-[99]"
                    onClick={() => setIsOpen(true)}
                >
                    <IoIosMenu size={24} />
                </button>}

            <div
                className={`z-50 custom_scroll sidebar border-opacity-10 w-[260px] md:w-[286px] fixed left-0 top-0 bottom-0 overflow-y-auto bg-white transition-transform transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0 lg:block`}
            >
                {isOpen &&
                    <button
                        className="lg:hidden p-2 absolute left-[213px] top-6 text-red-700 border border-red-700 z-[99] rounded"
                        onClick={() => setIsOpen(false)}
                    >
                        <IoMdArrowRoundBack size={18} />
                    </button>}

                <div className="px-4 lg:px-6 text-center py-46 lg:py-6">
                    {/* <Image
                        src="/Logo.png"
                        width={120}
                        height={120}
                        alt="Logo"
                        className="mx-auto h-[70px] w-auto"
                    /> */}
                </div>

                <div className=" py-4 lg:py-5">
                    <div className="px-3 md:px-4 lg:px-6 uppercase text-[#727272] text-sm font-medium mb-4 lg:mb-5">MAIN MENU</div>
                    <ul className="mt-2 space-y-1 mb-10">
                        {/* <Link
                            href="/admin"
                            className={`flex items-center py-2.5 px-3 md:px-4 lg:px-6 gap-2 text-[#565F66] text-base font-medium tracking-[-0.06em] ${pathname === "/admin" ? "text-white bg-[#000000]" : "hover:bg-gray-100"} `}
                        >
                            <MdSpaceDashboard size={20} />
                            Dashboard
                        </Link> */}
                        <Link
                            href="/admin/category"
                            className={`flex items-center py-2.5 px-3 md:px-4 lg:px-6  gap-2 text-[#565F66] text-base font-medium tracking-[-0.06em] ${pathname === "/admin/category" ? "text-white bg-[#000000]" : "hover:bg-gray-100"} `}
                        >
                            <PiStudentFill size={20} />
                            Category
                        </Link>
                        <Link
                            href="/admin/subcategory"
                            className={`flex items-center py-2.5 px-3 md:px-4 lg:px-6 gap-2 text-[#565F66] text-base font-medium tracking-[-0.06em] ${pathname === "/admin/subcategory" ? "text-white bg-[#000000]" : "hover:bg-gray-100"} `}
                        >
                            <MdReviews size={20} />
                            Sub  Category
                        </Link>
                        <Link
                            href="/admin/product"
                            className={`flex items-center py-2.5 px-3 md:px-4 lg:px-6 gap-2 text-[#565F66] text-base font-medium tracking-[-0.06em] ${pathname === "/admin/product" ? "text-white bg-[#000000]" : "hover:bg-gray-100"} `}
                        >
                            <AiFillProduct size={20} />
                            Products
                        </Link>
                        <Link
                            href="/admin/order"
                            className={`flex items-center py-2.5 px-3 md:px-4 lg:px-6 gap-2 text-[#565F66] text-base font-medium tracking-[-0.06em] ${pathname === "/admin/order" ? "text-white bg-[#000000]" : "hover:bg-gray-100"} `}
                        >
                            <BsCartCheckFill size={20} />
                            Product Order
                        </Link>
                        <Link
                            href="/admin/banner"
                            className={`flex items-center py-2.5 px-3 md:px-4 lg:px-6 gap-2 text-[#565F66] text-base font-medium tracking-[-0.06em]
                                     ${pathname === "/admin/banner" ? "text-white bg-[#000000]" : "hover:bg-gray-100"} `}
                        >
                            <AiFillProduct size={20} />
                            Banners
                        </Link>
                        <Link
                            href="/admin/user"
                            className={`flex items-center py-2.5 px-3 md:px-4 lg:px-6 gap-2 text-[#565F66] text-base font-medium tracking-[-0.06em]
                                     ${pathname === "/admin/user" ? "text-white bg-[#000000]" : "hover:bg-gray-100"} `}
                        >
                            <AiFillProduct size={20} />
                            User
                        </Link>

                        <Link
                            href="/admin/booking"
                            className={`flex items-center py-2.5 px-3 md:px-4 lg:px-6 gap-2 text-[#565F66] text-base font-medium tracking-[-0.06em]
                                     ${pathname === "/admin/booking" ? "text-white bg-[#000000]" : "hover:bg-gray-100"} `}
                        >
                            <AiFillProduct size={20} />
                            Booking
                        </Link>

                        <Link
                            href="/admin/project"
                            className={`flex items-center py-2.5 px-3 md:px-4 lg:px-6 gap-2 text-[#565F66] text-base font-medium tracking-[-0.06em]
                                     ${pathname === "/admin/project" ? "text-white bg-[#000000]" : "hover:bg-gray-100"} `}
                        >
                            <AiFillProduct size={20} />
                            Project
                        </Link>
                        <Link
                            href="/admin/services/services"
                            className={`flex items-center py-2.5 px-3 md:px-4 lg:px-6 gap-2 text-[#565F66] text-base font-medium tracking-[-0.06em]
                                     ${pathname === "/admin/services/services" ? "text-white bg-[#000000]" : "hover:bg-gray-100"} `}
                        >
                            <AiFillProduct size={20} />
                            Concept  
                        </Link>
                        <Link
                            href="/admin/vendor/vendor"
                            className={`flex items-center py-2.5 px-3 md:px-4 lg:px-6 gap-2 text-[#565F66] text-base font-medium tracking-[-0.06em]
                                     ${pathname === "/admin/vendor/vendor" ? "text-white bg-[#000000]" : "hover:bg-gray-100"} `}
                        >
                            <AiFillProduct size={20} />
                            Vendor
                        </Link>

                        <Link
                            href="/admin/setting"
                            className={`flex items-center py-2.5 px-3 md:px-4 lg:px-6 gap-2 text-[#565F66] text-base font-medium tracking-[-0.06em] ${pathname === "/admin/setting" ? "text-white bg-[#000000]" : "hover:bg-gray-100"}`}
                        >
                            <IoSettingsOutline size={20} />
                            Settings
                        </Link>

                    </ul>
                </div>
            </div>
        </>
    );
}

export default SideBar;