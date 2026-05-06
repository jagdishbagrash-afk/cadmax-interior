import React from "react";
import Layout from "../common/Layout";
import Banner from "@/components/Banner";
import ProductListBanner from "../../Assets/Images/desgin001.jpeg";
import Features from "./Features";

export default function About() {
    return (
        <Layout>
            <div>
                {/* Hero */}
                <Banner
                    Slider1={ProductListBanner}
                    title={"About Us"}
                />

                {/* Section */}
                <div className="container max-w-[1430px] mx-auto  px-4 py-12 flex flex-wrap  gap-8 items-center">
                    <div className="w-full  md:w-[55%]" >
                        <h2 className="text-[#171717] font-[900] mb-2  text-[18px] md:text-[24px] uppercase Creato">
                            Designing Spaces, Creating Experiences
                        </h2>
                        <p className="text-[#4D5466] mb-2 font-[500] text-[14px]  
                tracking-[-0.01em] text-left Creato">
                            Cadmax Atelier is a curated platform that connects you with the finest interior products and trusted vendors.
                        </p>
                        <button className="px-4 py-[6px] md:px-[30px] md:py-[10px] text-[13px] font-[700] uppercase Creato border border-[#17171733]">
                            Our Story
                        </button>
                    </div>

                     <div className="w-full  md:w-[43%]" >
                        <img
                            src="/commercial.jpeg"
                            alt="about"
                            className="rounded-lg w-full"
                        />
                    </div>
                </div>

                {/* Features */}
                <Features />

                {/* Values */}
                <div className="container max-w-[1430px] mx-auto  px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-[#171717] font-[900] mb-2  text-[18px] md:text-[24px] uppercase Creato">
                            Our Values</h2>
                        <ul className="space-y-2 text-gray-600">
                            <li className="text-[#4D5466] mb-2 font-[500] text-[14px]  
                tracking-[-0.01em] text-left Creato"> <span className="text-[#c8a97e]"> ✔ </span> Quality in every product</li>
                            <li className="text-[#4D5466] mb-2 font-[500] text-[14px]  
                tracking-[-0.01em] text-left Creato"><span className="text-[#c8a97e]"> ✔ </span> Integrity in every interaction</li>
                            <li className="text-[#4D5466] mb-2 font-[500] text-[14px]  
                tracking-[-0.01em] text-left Creato"><span className="text-[#c8a97e]"> ✔ </span> Innovation in design</li>
                            <li className="text-[#4D5466] mb-2 font-[500] text-[14px]  
                tracking-[-0.01em] text-left Creato"><span className="text-[#c8a97e]"> ✔ </span> Customer satisfaction</li>
                        </ul>
                    </div>

                    <img src="/ligithing.jpg" className="rounded-lg" />
                </div>
            </div>
        </Layout>
    );
}