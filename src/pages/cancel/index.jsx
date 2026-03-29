import React from "react";
import { useRouter } from "next/router";

const Cancel = () => {
    const router = useRouter();

    return (
            <div className="container mx-auto flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
                <div className="pt-20 pb-16">
                    <div className="flex items-center justify-center mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="100"
                            height="100"
                            viewBox="0 0 48 48"
                            className="mx-auto"
                        >
                            <linearGradient
                                id="wRKXFJsqHCxLE9yyOYHkza_fYgQxDaH069W_gr1"
                                x1="9.858"
                                x2="38.142"
                                y1="9.858"
                                y2="38.142"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop offset="0" stopColor="#f44f5a"></stop>
                                <stop offset=".443" stopColor="#ee3d4a"></stop>
                                <stop offset="1" stopColor="#e52030"></stop>
                            </linearGradient>
                            <path
                                fill="url(#wRKXFJsqHCxLE9yyOYHkza_fYgQxDaH069W_gr1)"
                                d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
                            ></path>
                            <path
                                d="M33.192,28.95L28.243,24l4.95-4.95c0.781-0.781,0.781-2.047,0-2.828l-1.414-1.414	c-0.781-0.781-2.047-0.781-2.828,0L24,19.757l-4.95-4.95c-0.781-0.781-2.047-0.781-2.828,0l-1.414,1.414	c-0.781,0.781-0.781,2.047,0,2.828l4.95,4.95l-4.95,4.95c-0.781,0.781-0.781,2.047,0,2.828l1.414,1.414	c0.781,0.781,2.047,0.781,2.828,0l4.95-4.95l4.95,4.95c0.781,0.781,2.047,0.781,2.828,0l1.414-1.414	C33.973,30.997,33.973,29.731,33.192,28.95z"
                                opacity=".05"
                            ></path>
                            <path
                                d="M32.839,29.303L27.536,24l5.303-5.303c0.586-0.586,0.586-1.536,0-2.121l-1.414-1.414	c-0.586-0.586-1.536-0.586-2.121,0L24,20.464l-5.303-5.303c-0.586-0.586-1.536-0.586-2.121,0l-1.414,1.414	c-0.586,0.586-0.586,1.536,0,2.121L20.464,24l-5.303,5.303c-0.586,0.586-0.586,1.536,0,2.121l1.414,1.414	c0.586,0.586,1.536,0.586,2.121,0L24,27.536l5.303,5.303c0.586,0.586,1.536,0.586,2.121,0l1.414-1.414	C33.425,30.839,33.425,29.889,32.839,29.303z"
                                opacity=".07"
                            ></path>
                            <path
                                fill="#fff"
                                d="M31.071,15.515l1.414,1.414c0.391,0.391,0.391,1.024,0,1.414L18.343,32.485	c-0.391,0.391-1.024,0.391-1.414,0l-1.414-1.414c-0.391-0.391-0.391-1.024,0-1.414l14.142-14.142	C30.047,15.124,30.681,15.124,31.071,15.515z"
                            ></path>
                            <path
                                fill="#fff"
                                d="M32.485,31.071l-1.414,1.414c-0.391,0.391-1.024,0.391-1.414,0L15.515,18.343	c-0.391-0.391-0.391-1.024,0-1.414l1.414-1.414c0.391-0.391,1.024-0.391,1.414,0l14.142,14.142	C32.876,30.047,32.876,30.681,32.485,31.071z"
                            ></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-center mt-2 mb-2">
                        Payment Failed!
                    </h2>
                    <p className="text-gray-400 text-center text-lg sm:text-xl mt-2">
                        Your transaction declined. Please try again later
                    </p>
                    <div className="flex my-3">
                        <button
                            onClick={() => { router.push("/") }}
                            className="mx-auto text-white bg-red-500 w-full sm:w-1/2 md:w-1/3 lg:w-2/4 p-4 btn"
                        >
                            Go to Home Page
                        </button>
                    </div>
                </div>
            </div>
    );
};

export default Cancel;
