import Link from "next/link";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
} from "react-icons/fa";
import { IoShareSocial } from "react-icons/io5";
import { FaAngleRight, FaXTwitter } from "react-icons/fa6";
import { MdOutlineChair } from "react-icons/md";
import { GiHomeGarage } from "react-icons/gi";
import { BsBuildings } from "react-icons/bs";
import { HiUsers } from "react-icons/hi";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-black via-[#0a0a0a] to-black text-gray-300">
      
      {/* Top Section */}
      <div className="container mx-auto max-w-[1430px] px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 border-b border-gray-800">
        
        {/* Logo + Info */}
        <div>
        <Link href="/" className="inline-block">
  <Image
    src="/Logo.png"
    alt="Cadmax Atelier Logo"
    width={160}
    height={50}
    className="object-contain"
    priority
  />
</Link>

          <p className="text-sm mt-3 text-gray-400 leading-relaxed">
            Designing functional, elegant and timeless spaces for living,
            working and beyond.
          </p>

          <div className="mt-5 space-y-2 text-sm">
            <a href="tel:+918890249999" className="flex items-center gap-2 hover:text-white">
              <FaPhoneAlt className="text-[#D4AF37]" /> +91 88902 49999 
            </a>
            <a href="mailto:info@cadmaxatelier.com" className="flex items-center gap-2 hover:text-white">
              <FaEnvelope className="text-[#D4AF37]" /> info@cadmaxatelier.com
            </a>
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-[#D4AF37]" /> India
            </p>
          </div>
        </div>

        {/* Shop */}
        <div>
          <MdOutlineChair className="text-[#D4AF37]" size={32} />
          <h3 className="text-white mt-2 mb-4">SHOP</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/product/list/furniture" className="flex items-center gap-2 hover:text-[#D4AF37]"><FaAngleRight /> Furniture</Link></li>
            <li><Link href="/product/list/lamps" className="flex items-center gap-2 hover:text-[#D4AF37]"><FaAngleRight /> Lamps & Lights</Link></li>
            <li><Link href="/product/list/upholstery" className="flex items-center gap-2 hover:text-[#D4AF37]"><FaAngleRight /> Upholstery</Link></li>
          </ul>
        </div>

        {/* Residential */}
        <div>
          <GiHomeGarage className="text-[#D4AF37]" size={32} />
          <h3 className="text-white mt-2 mb-4">RESIDENTIAL DESIGNS</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/residential/elevations" className="flex items-center gap-2 hover:text-[#D4AF37]"><FaAngleRight /> Elevations</Link></li>
            <li><Link href="/residential/gazebo" className="flex items-center gap-2 hover:text-[#D4AF37]"><FaAngleRight /> Gazebo</Link></li>
            <li><Link href="/residential/living-room" className="flex items-center gap-2 hover:text-[#D4AF37]"><FaAngleRight /> Living Room</Link></li>
            <li><Link href="/residential/bedroom" className="flex items-center gap-2 hover:text-[#D4AF37]"><FaAngleRight /> Bedroom</Link></li>
            <li><Link href="/residential/kitchen" className="flex items-center gap-2 hover:text-[#D4AF37]"><FaAngleRight /> Kitchens</Link></li>
          </ul>
        </div>

        {/* Commercial */}
        <div>
          <BsBuildings className="text-[#D4AF37]" size={32} />
          <h3 className="text-white mt-2 mb-4">COMMERCIAL DESIGNS</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/commercial/offices" className="flex items-center gap-2 hover:text-[#D4AF37]"><FaAngleRight /> Offices</Link></li>
            <li><Link href="/commercial/cafe" className="flex items-center gap-2 hover:text-[#D4AF37]"><FaAngleRight /> Cafe & Restaurants</Link></li>
            <li><Link href="/commercial/showrooms" className="flex items-center gap-2 hover:text-[#D4AF37]"><FaAngleRight /> Showrooms</Link></li>
            <li><Link href="/commercial/saloon" className="flex items-center gap-2 hover:text-[#D4AF37]"><FaAngleRight /> Saloon & Spa</Link></li>
            <li><Link href="/commercial/banquet" className="flex items-center gap-2 hover:text-[#D4AF37]"><FaAngleRight /> Banquet Halls</Link></li>
          </ul>
        </div>

        {/* Vendors */}
        <div>
          <HiUsers className="text-[#D4AF37]" size={32} />
          <h3 className="text-white mt-2 mb-4">VENDORS</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/vendor/civil" className="flex items-center gap-2 hover:text-[#D4AF37]"><FaAngleRight /> Civil Contractor</Link></li>
            <li><Link href="/vendor/electrician" className="flex items-center gap-2 hover:text-[#D4AF37]"><FaAngleRight /> Electrician</Link></li>
            <li><Link href="/vendor/plumber" className="flex items-center gap-2 hover:text-[#D4AF37]"><FaAngleRight /> Plumber</Link></li>
            <li><Link href="/vendor/carpenter" className="flex items-center gap-2 hover:text-[#D4AF37]"><FaAngleRight /> Carpenter</Link></li>
            <li><Link href="/vendor/painter" className="flex items-center gap-2 hover:text-[#D4AF37]"><FaAngleRight /> Painter</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <IoShareSocial className="text-[#D4AF37]" size={32} />
          <h3 className="text-white mt-2 mb-4">SOCIAL MEDIA</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="https://www.instagram.com/cadmaxatelier/reels/?hl=en" className="flex items-center gap-2 hover:text-[#D4AF37]"><FaInstagram /> Instagram</a></li>
            <li><a href="https://www.facebook.com/profile.php?id=61566087977578" className="flex items-center gap-2 hover:text-[#D4AF37]"><FaFacebookF /> Facebook</a></li>
            <li><a href="#" className="flex items-center gap-2 hover:text-[#D4AF37]"><FaXTwitter /> X</a></li>
            <li><a href="#" className="flex items-center gap-2 hover:text-[#D4AF37]"><FaYoutube /> Youtube</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-[1430px] mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>© 2026 CADMAXATELIER. All Rights Reserved.</p>

        <div className="flex flex-wrap gap-4 mt-3 md:mt-0">
          <Link href="/term-conditions" className="hover:text-white">Terms & Conditions</Link>
          <span>•</span>
          <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
          <span>•</span>
          {/* <Link href="/refund" className="hover:text-white">Refund Policy</Link>
          <span>•</span>
          <Link href="/cookies" className="hover:text-white">Cookie Policy</Link> */}
        </div>
      </div>
    </footer>
  );
}
