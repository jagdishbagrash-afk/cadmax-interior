"use client";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import Listing from "../api/Listing";
import c1 from "../../Assets/Images/c1.jpg";

const VendorMenu = ({ textColor, active }) => {
    const [categories, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    /* FETCH DATA */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const main = new Listing();
                const res = await main.vendorcategoryList();
                if (res.data?.data) {
                    setData(res.data.data);
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, []);

    /* CLOSE ON OUTSIDE CLICK */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <li
            ref={menuRef}
            onMouseEnter={() => window.innerWidth > 768 && setOpen(true)}
            onMouseLeave={() => window.innerWidth > 768 && setOpen(false)}
        >
            {/* TRIGGER */}
            <div className="flex items-center gap-1">
                <Link
                    href="/vendor"
                    className={`uppercase ${textColor}`}
                >
                    Vendor
                </Link>

                <IoIosArrowDown
                    onClick={(e) => {
                        e.preventDefault();
                        setOpen(!open);
                    }}
                    className="cursor-pointer"
                />
            </div>

            {/* DROPDOWN */}
            <div
                className={`absolute top-full left-0 right-0   bg-white shadow-xl z-50 transition-all duration-300 ${open
                    ? "opacity-100 translate-y-0 visible"
                    : "opacity-0 -translate-y-5 invisible"
                    }`}
            >
                {/* INNER CONTAINER */}
                <div className="max-w-[1200px] mx-auto p-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {categories?.map((item) => (
                            <Link
                                key={item._id}
                                href={`/vendor/${item.slug}`}
                                onClick={() => setOpen(false)}
                                className="group"
                            >
                                <div className="h-[220px] overflow-hidden rounded-lg">
                                    <img
                                        src={item.Image || c1.src}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                                    />
                                </div>

                                <h3 className="mt-3 text-sm font-medium text-gray-800 uppercase text-center">
                                    {item.name}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </li>
    );
};

export default VendorMenu;