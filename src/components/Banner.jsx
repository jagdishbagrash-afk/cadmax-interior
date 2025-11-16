import Button from '@/pages/common/Button';
import React from 'react';

export default function Banner({title ,button ,Slider1}) {

  return (
    <div className="relative h-[380px] md:h-[400px] lg:h-[450px] md:mt-[-150px]">
      <div className="relative w-full h-full">
        <img
          src={Slider1?.src}
          alt="Slide"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Overlay content centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-center w-full m-auto px-[15px] text-center">
          <h1
            className="
                      font-[900]
                      text-[18px] 
                      lg:text-[20px]
                      text-white 
                      uppercase 
                      Creato
                      leading-[100%]
                      tracking-[-0.02em]
                      max-w-[450px]
                    "
          >
           {title || " Modern Furniture. Curated Lighting. Defined Living."}
          </h1>

          <div className="flex flex-wrap justify-center gap-[10px] md:gap-[15px] mt-[10px] md:mt-[20px]">
            <Button
              title={button || "Shop product"}
              classes={"bg-white text-[#171717] "}
            />
          
          </div>
        </div>
      </div>
    </div>
  )
}