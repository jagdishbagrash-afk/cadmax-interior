"use client";
import React from "react";
import Image from "next/image";
import FooterLogo from "../../Assets/Images/CADMAX.png"; // your logo path

export default function Footer() {
  return (
    <footer className="bg-[#000000] text-white py-10 md:py-16 relative overflow-hidden">
      {/* Background Logo Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] select-none">
        <Image src={FooterLogo} alt="CADMAX Logo" className="w-[600px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 xl:max-w-[1230px]">
        {/* Top Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-center md:text-left">
          {/* SHOP */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-3 uppercase tracking-wide">
              Shop
            </h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li><a href="#" className="hover:underline">Furniture</a></li>
              <li><a href="#" className="hover:underline">Table & Seating</a></li>
              <li><a href="#" className="hover:underline">Lamps, Lighting</a></li>
              <li><a href="#" className="hover:underline">Wall Mirrors</a></li>
              <li><a href="#" className="hover:underline">Home Décor</a></li>
            </ul>
          </div>

          {/* RESIDENTIAL */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-3 uppercase tracking-wide">
              Residential
            </h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li><a href="#" className="hover:underline">2BHK Planning</a></li>
              <li><a href="#" className="hover:underline">Duplex/Pent House</a></li>
              <li><a href="#" className="hover:underline">Fixed Elevations</a></li>
              <li><a href="#" className="hover:underline">Layer of Custom</a></li>
              <li><a href="#" className="hover:underline">Living Area</a></li>
            </ul>
          </div>

          {/* COMMERCIAL */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-3 uppercase tracking-wide">
              Commercial
            </h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li><a href="#" className="hover:underline">Office Furniture</a></li>
              <li><a href="#" className="hover:underline">Retail & Workstations</a></li>
              <li><a href="#" className="hover:underline">Storage Solutions</a></li>
              <li><a href="#" className="hover:underline">Meeting Rooms</a></li>
              <li><a href="#" className="hover:underline">Collaborative Spaces</a></li>
            </ul>
          </div>

          {/* PROJECTS */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-3 uppercase tracking-wide">
              Projects
            </h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li><a href="#" className="hover:underline">Private Security</a></li>
              <li><a href="#" className="hover:underline">Green Resort Project</a></li>
              <li><a href="#" className="hover:underline">Energy Habitat</a></li>
              <li><a href="#" className="hover:underline">Plant-on Project</a></li>
              <li><a href="#" className="hover:underline">Open-site Projects</a></li>
            </ul>
          </div>

          {/* SOCIAL MEDIA */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-3 uppercase tracking-wide">
              Social Media
            </h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li><a href="#" className="hover:underline">Instagram</a></li>
              <li><a href="#" className="hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:underline">X</a></li>
              <li><a href="#" className="hover:underline">LinkedIn</a></li>
              <li><a href="#" className="hover:underline">Studio</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-10 pt-5 text-center text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 Cadmax Interior</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:underline">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
