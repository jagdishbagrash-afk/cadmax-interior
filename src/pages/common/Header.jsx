import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { IoIosArrowDown } from "react-icons/io";
import { useRole } from "@/context/RoleContext";
import Cadmax from "../../Assets/Images/CADMAX.png"
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function Header() {

    const [menuOpen, setMenuOpen] = useState();
    // const { user, setUser, language, setLanguage } = useRole();
    const router = useRouter();
    // console.log("router",router);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }

    const [DropDown, setDropDown] = useState(false);
    const ToggleDropdown = () => {
            setDropDown(!DropDown);
    }
    // const [selectLang, setSelectLang] = useState('English');
    const handleLanguageSelect = (lang) => {
        setLanguage(lang);
        setDropDown(false);
    }

    // header fixed 
    const [Scrolled, setScrolled] = useState();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 5);
        }
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [])

    const handleLogout = () => {
        localStorage && localStorage.removeItem("token");
        router.push("/login");
        toast.success("Logout Successfully");
        setUser(null);
    };

    return (
        <>
            <nav className={`fixed w-full top-0 z-50  transition-all duration-300 ease-in-out  ${Scrolled ? "bg-[#fff] py-1 lg:py-1" : "bg-transparent py-3 lg:py-6"}`}>
                <div className="mx-auto container sm:container md:container lg:container xl:max-w-[1230px]  px-4">
                    <div className="relative flex items-center justify-between">
                        <div className="flex-shrink-0">
                            <Link href="/">
                                   <Image
                                    className="w-[100px] h-[80px] "
                                    height={1000}
                                    width={1000}
                                    layout="fixed"
                                    src={Cadmax}
                                    alt="Cadmax logo"
                                />
                            </Link>
                        </div>
                        <div className={`rounded lg:rounded-[0] absolute top-full lg:top-auto lg:relative left-0 right-0 bg-white lg:bg-transparent lg:ml-2 lg:block ${menuOpen ? 'block' : 'hidden'}`}>
                            {/* <!-- Current: "text-[#EE834E]" --> */}
                            <ul className="flex flex-wrap lg:space-x-8 xl:space-x-10">
                                <li className="w-full lg:w-auto relative cursor-pointer [&:not(:last-child)]:border-b lg:border-none border-[#ddd] ">
                                    <Link
                                        href="/"
                                        className="py-3 lg:py-0 inline-block px-4 lg:px-0 capitalize text-base xl:text-lg tracking-[-0.04em] font-medium text-[#ffffff] hover:text-[#ad0e0e]">
                                        Home
                                    </Link>
                                </li>
                                <li className="w-full lg:w-auto relative cursor-pointer [&:not(:last-child)]:border-b lg:border-none border-[#ddd] ">
                                    <Link
                                        href="/find-teacher"
                                        className="py-3 lg:py-0 inline-block px-4 lg:px-0 capitalize text-base xl:text-lg tracking-[-0.04em] font-medium text-[#ffffff] hover:text-[#ad0e0e]">
                                       Project 
                                    </Link>
                                </li>
                              
                                <li className="w-full lg:w-auto relative cursor-pointer [&:not(:last-child)]:border-b lg:border-none border-[#ddd] ">
                                    <Link
                                        href="/become-teacher"
                                        className="py-3 lg:py-0 inline-block px-4 lg:px-0 capitalize text-base xl:text-lg tracking-[-0.04em] font-medium text-[#ffffff] hover:text-[#ad0e0e]">
                                       Services
                                    </Link>
                                </li>

                                  <li className="w-full lg:w-auto relative cursor-pointer [&:not(:last-child)]:border-b lg:border-none border-[#ddd] ">
                                    <Link
                                        href="/become-teacher"
                                        className="py-3 lg:py-0 inline-block px-4 lg:px-0 capitalize text-base xl:text-lg tracking-[-0.04em] font-medium text-[#ffffff] hover:text-[#ad0e0e]">
                                       Booking 
                                    </Link>
                                </li>
                            </ul>
                            {/* {user && user?.role ?
                                <div className="flex flex-col lg:hidden">
                                    <Link
                                        href={`${user && user?.role === "student" ? "/student" : user?.role === "teacher" ? "/teacher-dashboard" : "/admin"}`}
                                        className="text-[#ffffff] hover:text-[#ad0e0e] border-t border-b border-[#ddd] text-base py-3 px-4 font-medium cursor-pointer" >
                                        View dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-[#ffffff] hover:text-[#ad0e0e] border-t border-[#ddd] text-base py-3 px-4 font-medium cursor-pointer text-left appearance-none bg-transparent border-none"
                                    >
                                        Logout
                                    </button>
                                </div>
                                :
                                <div className="flex flex-col lg:hidden">
                                    <Link href="/login" className="text-[#ffffff] hover:text-[#ad0e0e] border-t border-[#ddd] text-base py-3 px-4 font-medium cursor-pointer" >
                                        Log In
                                    </Link>
                                    <Link href="/student/register" className="text-[#ffffff] hover:text-[#ad0e0e] border-t border-[#ddd] text-base py-3 px-4 font-medium cursor-pointer" >
                                        Sign Up
                                    </Link>
                                </div>
                            } */}
                        </div>
                        <div className="flex flex-wrap space-x-4 items-center ml-auto lg:ml-0 mr-2 lg:mr-0">
                            {router?.pathname == "/become-teacher" &&
                            <div className="group relative mr-0 lg:mr-4 xl:mr-5">
                                <div onClick={ToggleDropdown} className="relative cursor-pointer border border-[#CC2828] text-base tracking-[-0.03em] rounded-[6px] text-[#ffffff] py-1.5 pl-4 pr-8 min-w-[126px] text-center">
                                    {language == "en" ? "English" : "Japanese"} <IoIosArrowDown size="16" className="absolute right-2 top-1/2 -translate-y-1/2" />
                                </div>
                                <div className={`absolute border-b border-l border-r border-[#ddd] bg-white top-full left-0 rounded-b ${DropDown ? 'block' : 'hidden'}`}>
                                    <button onClick={() => (handleLanguageSelect('en'))} className="w-full cursor-pointer bg-transparent py-.5 px-2 [&:not(:last-child)]:border-b py-2 border-[#ddd] hover:text-[#ffffff]">English</button>
                                    <button onClick={() => (handleLanguageSelect('ja'))} className="w-full cursor-pointer bg-transparent py-.5 px-2 py-2 [&:not(:last-child)]:border-b hover:text-[#ffffff]">Japanese</button>
                                </div>
                            </div>}
                            {/* {user && user?.role ?
                                <>
                                    <Link
                                        href={`${user && user?.role === "student" ? "/student" : user?.role === "teacher" ? "/teacher-dashboard" : "/admin"}`}
                                        className="hidden lg:block bg-[#CC2828] hover:bg-[#ad0e0e] text-white text-base py-3.5 px-8 xl:px-10 font-medium cursor-pointer rounded-full" >
                                        View Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        href={`${user?.role === "student" ? "/student" : "/teacher-dashboard"}`}
                                        className="hidden lg:block bg-[#CC2828] hover:bg-[#ad0e0e] text-white text-base py-3.5 px-8 xl:px-10 font-medium cursor-pointer rounded-full" >
                                        Logout
                                    </button>
                                </>
                                :
                                <>
                                    <Link href="/student/register" className="hidden lg:block bg-[#CC2828] hover:bg-[#ad0e0e] text-white text-base py-3.5 px-8 xl:px-10 font-medium cursor-pointer rounded-full" >
                                        Sign Up                            </Link>
                                    <Link href="/login" className="hidden lg:block bg-[#CC2828] hover:bg-[#ad0e0e] text-white text-base py-3.5 px-8 xl:px-10 font-medium cursor-pointer rounded-full" >
                                        Log In
                                    </Link>
                                </>
                            } */}

                        </div>
                        <div className="flex lg:hidden">
                            {/* <!-- Mobile menu button --> */}
                            <button
                                type="button"
                                className="relative inline-flex items-center justify-center rounded-md py-2 px-2.5 text-[#ffffff] hover:bg-gray-700 hover:text-[#ad0e0e] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#CC2828]"
                                aria-controls="mobile-menu"
                                aria-expanded={menuOpen}
                                onClick={toggleMenu}
                            >
                                <span className="absolute -inset-0.5"></span>
                                <span className="sr-only">Open main menu</span>
                                {/* <!-- Icon when menu is closed.   Menu open: "hidden", Menu closed: "block"--> */}
                                <svg
                                    className={`${menuOpen ? "hidden" : "block"} h-6 w-6`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                    />
                                </svg>
                                <svg
                                    className={`${menuOpen ? "block" : "hidden"} h-6 w-6`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

            </nav>
        </>
    )
}