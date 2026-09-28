import React from "react";
import { FaShieldAlt, FaUserCheck, FaPalette, FaSmile } from "react-icons/fa";

const features = [
    {
        icon: <FaShieldAlt />,
        title: "Premium Quality",
        desc: "Carefully selected materials, finishes, and products built to last.",
    },
    {
        icon: <FaUserCheck />,
        title: "Trusted Vendors",
        desc: "Verified professionals and partners who align with our quality standards.",
    },
    {
        icon: <FaPalette />,
        title: "Distinctive Design",
        desc: "Modern, warm, and timeless inspirations tailored to the way you live.",
    },
    {
        icon: <FaSmile />,
        title: "Customer First",
        desc: "Friendly guidance and attention to detail from first touch to final styling.",
    },
];

export default function Features() {
    return (
        <div className="bg-[#f4efe9] py-14 md:py-18">
            <div className="container max-w-[1430px] mx-auto px-4">
                <div className="mb-10 text-center">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8f673a]">What we stand for</p>
                    <h2 className="mt-3 text-3xl font-black text-[#171717] md:text-4xl">Why homeowners choose Cadmax Atelier</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {features.map((item) => (
                        <div
                            key={item.title}
                            className="rounded-[22px] border border-[#eadbca] bg-white p-6 shadow-[0_18px_40px_rgba(23,23,23,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(23,23,23,0.08)]"
                        >
                            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#171717] text-xl text-[#f2d499]">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-black text-[#171717]">{item.title}</h3>
                            <p className="mt-3 text-sm leading-6 text-[#4d5466]">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}