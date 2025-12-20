import Button from '@/pages/common/Button';
import React from 'react';

export default function Banner({ title, button, Slider1 }) {

  return (
    <div className="relative w-full h-[300px] sm:h-[360px] md:h-[420px] lg:h-[480px] overflow-hidden md:mt-[-80px]">

      <img
        src={Slider1?.src}
        alt="Slide"
        className="object-cover w-full h-full"
      />

      <div className="absolute inset-0 bg-black/25"></div>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 text-center">

        <h1
          className="
            font-[900]
            text-[18px]
            sm:text-[20px]
            lg:text-[24px]
            text-white
            uppercase
            Creato
            leading-[110%]
            tracking-[-0.02em]
            max-w-[90%]
            sm:max-w-[550px]
            mx-auto
          "
        >
          {title || " Modern Furniture. Curated Lighting. Defined Living."}
        </h1>

        {button && (
          <div className="flex flex-wrap justify-center mt-3 sm:mt-5">
            <Button
              title={button || "Shop product"}
              classes="bg-white text-[#171717]"
            />
          </div>
        )}
      </div>
    </div>
  );
}
