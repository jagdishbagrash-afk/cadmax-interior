import React from "react";
import { FaShieldAlt, FaUserCheck, FaPalette, FaSmile } from "react-icons/fa";

const features = [
    {
        icon: <FaShieldAlt />,
        title: "Premium Quality",
        desc: "Carefully curated high-quality products",
    },
    {
        icon: <FaUserCheck />,
        title: "Trusted Vendors",
        desc: "Verified & experienced professionals",
    },


    
    {
        icon: <FaPalette />,
        title: "Unique Designs",
        desc: "Modern, elegant & timeless collections",
    },
    {
        icon: <FaSmile />,
        title: "Customer First",
        desc: "Your satisfaction is our priority",
    },
];

export default function Features() {
    return (
        <div className="bg-[#f8f6f3] py-10">
            <div className="container max-w-[1430px] mx-auto  px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {features.map((item, index) => (
                    <div
                        key={item.id}
                        className="flex flex-col items-center justify-start px-4"
                    >
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white text-sm">
                            {item.icon}
                        </div>

                        <h3 className="text-[#171717] font-[700] text-[16px] md:text-[18px]
                       tracking-[-0.01em] text-center mb-2 Creato">
                            {item.title}
                        </h3>

                        <p className="text-[#4D5466] font-[500] text-[14px]  
                       tracking-[-0.01em] text-center Creato">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}