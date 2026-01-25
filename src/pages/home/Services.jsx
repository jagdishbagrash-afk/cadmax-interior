"use client";
import Link from "next/link";
import end from "../../Assets/Images/end.jpg";
import ligithing from "../../Assets/Images/ligithing.jpg";
import Button from "../common/Button";

export default function Services() {
  return (
    <div className="grid  grid-cols-1 md:grid-cols-2 gap-1 mt-1">
      <div
        className="relative  bg-cover bg-center h-[600px] lg:h-[450px]"
        style={{
          backgroundImage: `url(${end?.src})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative flex flex-col items-center justify-center h-full p-8 text-white text-center">
          <h2 className="text-[#ffffff] font-[900] text-[15px] md:text-[20px] leading-[100%] tracking-[-0.02em] mb-3 md:mb-6 uppercase Creato max-w-[550px] mx-auto">
            CONTEMPORARY FURNITURE, LIGHTING, AND DECOR FOR DAILY USE.
          </h2>
          <Link href="/product" className="
           px-4 
        py-[6px]
        font-[700] 
        cursor-pointer 
        Creato 
        uppercase 
        md:px-[30px] 
        md:py-[10px] 
        text-[13px]
        bg-transparent text-white border border-white
          ">
            SHOP NOW
          </Link>

        </div>
      </div>
      <div
        className="relative  bg-cover bg-center h-[600px] lg:h-[450px]"
        style={{
          backgroundImage: `url(${ligithing?.src})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative flex flex-col items-center justify-center h-full p-8 text-white text-center">
          <h2 className="text-[#ffffff] font-[900] text-[15px] md:text-[20px] leading-[100%] tracking-[-0.02em] mb-3 md:mb-6 uppercase Creato max-w-[550px] mx-auto">
            RESIDENTIAL AND COMMERCIAL INTERIORS DELIVERED END-TO-END.
          </h2>
          <Link href="/concept" className="
           px-4 
        py-[6px]
        font-[700] 
        cursor-pointer 
        Creato 
        uppercase 
        md:px-[30px] 
        md:py-[10px] 
        text-[13px]
        bg-transparent text-white border border-white
          ">
            VIEW CONCEPT
          </Link>

        </div>
      </div>
    </div>
  );
}
