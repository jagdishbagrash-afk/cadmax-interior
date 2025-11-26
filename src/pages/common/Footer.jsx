"use client";
import React from "react";
import Image from "next/image";
import FooterLogo from "../../Assets/Images/CADMAX.png"; // your logo path

export default function Footer() {
  return (
    <footer className="bg-[#000000] text-[#FFFFFF80] py-4 md:py-8 relative overflow-hidden">
      {/* Background Logo Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] select-none">
        <Image src={FooterLogo} alt="CADMAX Logo" className="w-[600px]" />
      </div>

      <div className="relative z-10 mx-auto px-2 sm:px-4 max-w-[1350px]">
        {/* Top Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center md:text-left">
          {/* SHOP */}
          <div>
            <h3 className="text-[#FFFFFF50] font-[900] Creato mb-3 uppercase tracking-wide">
              Shop
            </h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li><a href="#" className="hover:underline text-[16px] font-[500] text-white Creato text-center">Furniture</a></li>
              <li><a href="#" className="hover:underline text-[16px] font-[500] text-white Creato text-center">Table & Seating</a></li>
              <li><a href="#" className="hover:underline text-[16px] font-[500] text-white Creato text-center">Lamps, Lighting</a></li>
              <li><a href="#" className="hover:underline text-[16px] font-[500] text-white Creato text-center">Wall Mirrors</a></li>
              <li><a href="#" className="hover:underline text-[16px] font-[500] text-white Creato text-center">Home Décor</a></li>
            </ul>
          </div>

          {/* RESIDENTIAL */}
          <div>
            <h3 className="text-[#FFFFFF50] font-[900] Creato mb-3 uppercase tracking-wide">
              Residential
            </h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li><a href="#" className="hover:underline text-[16px] font-[500] text-white Creato text-center">2BHK Planning</a></li>
              <li><a href="#" className="hover:underline text-[16px] font-[500] text-white Creato text-center">Duplex/Pent House</a></li>
              <li><a href="#" className="hover:underline text-[16px] font-[500] text-white Creato text-center">Fixed Elevations</a></li>
              <li><a href="#" className="hover:underline text-[16px] font-[500] text-white Creato text-center">Layer of Custom</a></li>
              <li><a href="#" className="hover:underline text-[16px] font-[500] text-white Creato text-center">Living Area</a></li>
            </ul>
          </div>

          {/* COMMERCIAL */}
          <div>
            <h3 className="text-[#FFFFFF50] font-[900] Creato mb-3 uppercase tracking-wide">
              Commercial
            </h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li><a href="#" className="hover:underline  text-[16px] font-[500] text-white Creato text-center">Office Furniture</a></li>
              <li><a href="#" className="hover:underline text-[16px] font-[500] text-white Creato text-center">Retail & Workstations</a></li>
              <li><a href="#" className="hover:underline text-[16px] font-[500] text-white Creato text-center">Storage Solutions</a></li>
              <li><a href="#" className="hover:underline text-[16px] font-[500] text-white Creato text-center">Meeting Rooms</a></li>
              <li><a href="#" className="hover:underline text-[16px] font-[500] text-white Creato text-center">Collaborative Spaces</a></li>
            </ul>
          </div>

          {/* PROJECTS */}
          <div>
            <h3 className="text-[#FFFFFF50] font-[900] Creato mb-3 uppercase tracking-wide">
              Projects
            </h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li><a href="#" className="hover:underline text-[16px] font-[500] text-white Creato text-center">Private Security</a></li>
              <li><a href="#" className="hover:underline text-[16px] font-[500] text-white Creato text-center">Green Resort Project</a></li>
              <li><a href="#" className="hover:underline text-[16px] font-[500] text-white Creato text-center">Energy Habitat</a></li>
              <li><a href="#" className="hover:underline text-[16px] font-[500] text-white Creato text-center">Plant-on Project</a></li>
              <li><a href="#" className="hover:underline text-[16px] font-[500] text-white Creato text-center">Open-site Projects</a></li>
            </ul>
          </div>

          {/* SOCIAL MEDIA */}
          <div>
            <h3 className="text-[#FFFFFF50] font-[900] Creato mb-3 uppercase tracking-wide">
              Social Media
            </h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li><a href="#" className="hover:underline text-[16px] font-[500] text-white Creato text-center">Instagram</a></li>
              <li><a href="#" className="hover:underline text-[16px] font-[500] text-white Creato text-center">Facebook</a></li>
              <li><a href="#" className="hover:underline text-[16px] font-[500] text-white Creato text-center">X</a></li>
              <li><a href="#" className="hover:underline text-[16px] font-[500] text-white Creato text-center">LinkedIn</a></li>
              <li><a href="#" className="hover:underline text-[16px] font-[500] text-white Creato text-center">Studio</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-10 pt-5 text-center text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[16px] font-[500] text-white Creato text-center">© 2026 Cadmax Interior</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="#" className="hover:underline text-[16px] font-[500] text-white Creato text-center">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:underline text-[16px] font-[500] text-white Creato text-center">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
