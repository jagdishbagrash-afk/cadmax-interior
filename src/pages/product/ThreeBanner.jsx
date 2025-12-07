import React from "react";
import Button from "@/pages/common/Button";

// Images import here
import Slider1 from "../../Assets/Images/c1.jpg";
import Slider2 from "../../Assets/Images/c2.jpg";
import Slider3 from "../../Assets/Images/c3.jpg";

export default function ThreeBanner() {
  const banners = [
    {
      id: 1,
      title: "Modern",
      image: Slider1.src,
    },
    {
      id: 2,
      title: "Contemporary",
      image: Slider2.src,
    },
    {
      id: 3,
      title: "neoclassic",
      image: Slider3.src,
    },
  ];


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 ">
      {banners?.map((item) => (
        <div
          key={item.id}
          className="relative h-[300px] md:h-[380px] lg:h-[550px]  overflow-hidden"
        >
          {/* Image */}
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />

          {/* Black Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Centered Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-white text-[18px] md:text-[20px] font-[900] uppercase leading-[110%] tracking-[-0.02em] Creato max-w-[300px]">
              {item.title}
            </h1>
{/* 
            <Button
              title={item.button}
              classes="bg-white text-[#171717] mt-4"
            /> */}
          </div>
        </div>
      ))}

    </div>
  );
}
