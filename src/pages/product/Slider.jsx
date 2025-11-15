import React from 'react';
import Button from "../common/Button";
import Slider1 from "../../Assets/Images/Slider1.png";

export default function Slider() {

  return (
    <div className="relative h-[425px] md:h-[560px] lg:h-[860px] md:mt-[-150px]">
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
            Modern Furniture. Curated Lighting. Defined Living.
          </h1>

          <div className="flex flex-wrap justify-center gap-[10px] md:gap-[15px] mt-[10px] md:mt-[20px]">
            <Button
              title={"Shop product"}
              classes={"bg-white text-[#171717] "}
            />
            {/* <Button
                    title={"Request concept"}
                    classes={"bg-transparent text-white border border-white"}
                  /> */}
          </div>
        </div>
      </div>
    </div>
  )
}