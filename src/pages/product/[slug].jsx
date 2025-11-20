"use client";
import React, { useState } from "react";
import Layout from "../common/Layout";
import ProductImage from "../../Assets/Images/ProductDetail.png";
import Image from "next/image";

export default function Index() {
  const [qty, setQty] = useState(1);
  return (
    <Layout>
      <div className="w-full bg-white py-14 flex justify-center">
        <div className="w-[92%] lg:w-[85%]">
          <p className="text-sm text-gray-500 tracking-widest mb-6">
            FURNITURE | BELMONT DEEP-SEAT CONTEMPORARY SOFA
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side - Product Image */}
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

            {/* Right Side - Product Info */}
            <div>
              <h1 className="text-2xl text-[#171717] font-black Creato mt-2 uppercase">
                AUREUM LARGE-FORM SCULPTED CERAMIC CENTERPIECE VASE
              </h1>

              <p className="text-[#4D5466] text-lg font-medium mt-4 Creato">
                From compact apartments to full villas, we deliver interiors
                that merge function with character. Our process includes precise
                layout planning, 3D visualizations, and on-site supervision for
                complete spatial control.
              </p>

              <h2 className="text-3xl text-[#171717] font-bold mt-6 Creato">₹85,000</h2>

              {/* Qty Selector */}
              <div className="mt-6 w-full border border-gray-200 rounded-md px-4 py-3 flex items-center justify-between cursor-pointer">
                <span>{qty}</span>
                <span className="text-xl">▾</span>
              </div>

              {/* Delivery Info */}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <span>🚚</span>
                  <p>
                    Complimentary Delivery & Setup
                    <br />
                    Above ₹20000
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span>🎨</span>
                  <p>Complimentary Styling Services</p>
                </div>

                <div className="flex items-start gap-3">
                  <span>🛡️</span>
                  <p>Quality Assured Warranty Coverage</p>
                </div>

                <div className="flex items-start gap-3">
                  <span>⚡</span>
                  <p>Fast Local Service Support</p>
                </div>
              </div>

              {/* Expandable Sections */}
              <div className="mt-10">
                <div className="border-t py-4 flex justify-between items-center cursor-pointer">
                  <span className="text-lg font-medium">DIMENSIONS</span>
                  <span className="text-2xl">+</span>
                </div>

                <div className="border-t py-4 flex justify-between items-center cursor-pointer">
                  <span className="text-lg font-medium">
                    MATERIALS & FEATURES
                  </span>
                  <span className="text-2xl">+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
