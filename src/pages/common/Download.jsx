"use client";

import Image from "next/image";
import ligithing from "../../Assets/Images/ligithing.jpg";
import { FaShieldAlt, FaRocket, FaHeadset } from "react-icons/fa";
import { HiBadgeCheck } from "react-icons/hi";

export default function Download() {
    return (
        <section className="relative w-full overflow-hidden py-10 md:py-16">

            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={ligithing}
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/10"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-[1300px] mx-auto px-4 text-center">

                {/* Top Small Text */}
                <p className="text-yellow-400 tracking-widest uppercase text-[16px] font-[500] mb-3">
                    — Unlock Your Potential —
                </p>

                {/* Heading */}
                <h2 className="text-white text-3xl md:text-5xl font-bold leading-tight mb-6">
                    READY TO KICKSTART? <br />
                    HIT THE DOWNLOAD BUTTON!
                </h2>

                {/* Description */}
                <p className="text-gray-200 text-semibold md:text-lg max-w-xl mx-auto mb-10">
                    Download now to unlock your premium tailoring potential and reach new heights.
                </p>

                {/* Store Buttons */}
                <div className="flex justify-center gap-5 flex-wrap mb-12">
                    <a
                        href="https://play.google.com/store/apps/details?id=com.cadmax.atelier"
                        target="_blank"
                        className="hover:scale-105 transition"
                    >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                            alt="Google Play"
                            className="h-14"
                        />
                    </a>

                    <a
                        href="https://apps.apple.com/app/6761532500"
                        target="_blank"
                        className="hover:scale-105 transition"
                    >
                        <img
                            src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                            alt="App Store"
                            className="h-14"
                        />
                    </a>
                </div>

          {/* Bottom Feature Bar */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-black/30 backdrop-blur-md p-6 md:p-8 rounded-xl border border-white/10">

  {/* ITEM */}
  <div className="flex items-center gap-4">
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400/10">
      <FaShieldAlt className="text-yellow-400 text-2xl" />
    </div>
    <div>
      <p className="text-white font-bold text-[16px] md:text-[18px] leading-tight uppercase Creato">
        100% Secure
      </p>
      <p className="mt-1 text-sm text-gray-300 uppercase Creato">
        Your data is safe
      </p>
    </div>
  </div>

  {/* ITEM */}
  <div className="flex items-center gap-4">
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400/10">
      <HiBadgeCheck className="text-yellow-400 text-2xl" />
    </div>
    <div>
      <p className="text-white font-bold text-[16px] md:text-[18px] uppercase Creato">
        Premium Quality
      </p>
      <p className="mt-1 text-sm text-gray-300 uppercase Creato">
        Tailored for excellence
      </p>
    </div>
  </div>

  {/* ITEM */}
  <div className="flex items-center gap-4">
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400/10">
      <FaRocket className="text-yellow-400 text-2xl" />
    </div>
    <div>
      <p className="text-white font-bold text-[16px] md:text-[18px] uppercase Creato">
        Instant Access
      </p>
      <p className="mt-1 text-sm text-gray-300 uppercase Creato">
        Start immediately
      </p>
    </div>
  </div>

  {/* ITEM */}
  <div className="flex items-center gap-4">
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400/10">
      <FaHeadset className="text-yellow-400 text-2xl" />
    </div>
    <div>
      <p className="text-white font-bold text-[16px] md:text-[18px] uppercase Creato">
        24/7 Support
      </p>
      <p className="mt-1 text-sm text-gray-300 uppercase Creato">
        We’re here to help
      </p>
    </div>
  </div>

</div>

            </div>
        </section>
    );
}