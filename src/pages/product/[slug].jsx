"use client";
import React, { useState } from "react";
import Layout from "../common/Layout";
import ProductImage from "../../Assets/Images/ProductDetail.png";
import Image from "next/image";
import { FiTruck } from "react-icons/fi";
import { FaPlus, FaMinus } from "react-icons/fa6";
import Related from "./Related";

export default function Index() {
  const [qty, setQty] = useState(1);

  const [open, setOpen] = useState(null);

  const toggle = (id) => {
    setOpen(open === id ? null : id);
  };

  return (
    <Layout>
      <div className="w-full py-14 flex flex-col justify-center">
        <div className="w-[92%] lg:w-[85%] mx-auto">
          <div className="bg-white">
            <p className="text-base text-[#4D5466] tracking-widest mb-6 Creato">
              <span className="text-[#171717]">FURNITURE </span>| BELMONT
              DEEP-SEAT CONTEMPORARY SOFA
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left */}
              <div className="w-full">
                <div className="w-full aspect-[4/5] relative rounded-lg overflow-hidden">
                  <Image
                    src={ProductImage?.src}
                    alt="Product"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Right */}
              <div>
                <h1 className="text-2xl text-[#171717] font-black Creato mt-2 uppercase">
                  AUREUM LARGE-FORM SCULPTED CERAMIC CENTERPIECE VASE
                </h1>

                <p className="text-[#4D5466] text-lg font-medium mt-4 Creato">
                  From compact apartments to full villas, we deliver interiors
                  that merge function with character...
                </p>

                <h2 className="text-3xl text-[#171717] font-bold mt-6 Creato">
                  ₹85,000
                </h2>

                {/* Qty */}
                <div className="mt-6 w-full border border-gray-200 rounded-md px-4 py-3 flex items-center justify-between cursor-pointer">
                  <span>{qty}</span>
                  <span className="text-xl">▾</span>
                </div>

                <p className="text-base font-medium text-[#4D5466] mt-2 Creato">
                  Deliver in approximately 8–12 days
                </p>

                {/* Buttons */}
                <div className="mt-6 flex flex-col gap-3">
                  <button className="w-full bg-black text-white py-3 font-medium rounded-md hover:bg-gray-800">
                    ADD TO CART
                  </button>

                  <button className="w-full border border-black py-3 font-medium rounded-md hover:bg-gray-100">
                    BUY NOW
                  </button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8 text-base text-[#4D5466] Creato">
                  <div className="flex items-center gap-3">
                    <span className="text-[#000000]">
                      <FiTruck size={22} />
                    </span>
                    <p className="font-medium">
                      Complimentary Delivery & Setup <br /> Above ₹20000{" "}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#000000]">
                      <FiTruck size={22} />
                    </span>
                    <p className="font-medium">
                      Complimentary Styling Services
                    </p>{" "}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#000000]">
                      <FiTruck size={22} />
                    </span>
                    <p className="font-medium">
                      Quality Assured Warranty Coverage
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#000000]">
                      <FiTruck size={22} />
                    </span>
                    <p className="font-medium">Fast Local Service Support</p>{" "}
                  </div>
                </div>

                {/* Accordion Sections */}
                <div className="mt-10">
                  {/* 1. Dimensions */}
                  <div
                    className="border-t border-gray-200 py-4 cursor-pointer"
                    onClick={() => toggle(1)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-[#171717] uppercase">
                        Dimensions
                      </span>
                      {open === 1 ? (
                        <FaMinus size={20} />
                      ) : (
                        <FaPlus size={20} />
                      )}
                    </div>

                    {open === 1 && (
                      <p className="mt-3 text-[#4D5466] font-medium Creato text-lg leading-6">
                        • Height: 45cm • Width: 30cm • Depth: 18cm (Add your
                        real dimensions here)
                      </p>
                    )}
                  </div>

                  {/* 2. Materials & Features */}
                  <div
                    className="border-t border-gray-200 py-4 cursor-pointer"
                    onClick={() => toggle(2)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-[#171717] uppercase">
                        Materials & Features
                      </span>
                      {open === 2 ? (
                        <FaMinus size={20} />
                      ) : (
                        <FaPlus size={20} />
                      )}
                    </div>

                    {open === 2 && (
                      <p className="mt-3 text-[#4D5466] font-medium Creato text-lg leading-6">
                        • High-gloss ceramic • Hand-sculpted finish •
                        Scratch-resistant surface • Premium glaze coating
                        (Replace with your actual specs)
                      </p>
                    )}
                  </div>

                  {/* 3. Product Care */}
                  <div
                    className="border-t border-gray-200 py-4 cursor-pointer"
                    onClick={() => toggle(3)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-[#171717] uppercase">
                        Product Care
                      </span>
                      {open === 3 ? (
                        <FaMinus size={20} />
                      ) : (
                        <FaPlus size={20} />
                      )}
                    </div>

                    {open === 3 && (
                      <p className="mt-3 text-[#4D5466] font-medium Creato text-lg leading-6">
                        Wipe and dust with a soft, non-abrasive cloth. Do not
                        use abrasive or acidic cleaning solutions or equipment.
                        Maintain the natural beauty of the table with a
                        dedicated pH-neutral stone cleaner and follow
                        instructions on the packaging. Use coasters to protect
                        the stone from scratches, chips and stains, and wipe
                        spills away quickly to avoid staining. Visit
                        cancanfurnishings.com/pages/productinformation for more.
                      </p>
                    )}
                  </div>

                  {/* 4. Terms & Conditions */}
                  <div
                    className="border-t border-gray-200 py-4 cursor-pointer"
                    onClick={() => toggle(4)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-[#171717] uppercase">
                        Terms & Conditions
                      </span>
                      {open === 4 ? (
                        <FaMinus size={20} />
                      ) : (
                        <FaPlus size={20} />
                      )}
                    </div>

                    {open === 4 && (
                      <p className="mt-3 text-[#4D5466] font-medium Creato text-lg leading-6">
                        • No cancellations after order confirmation • Warranty
                        covers manufacturing defects only • Colour variation may
                        occur due to screen differences (Add your real T&C)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Related />
        </div>
      </div>
    </Layout>
  );
}