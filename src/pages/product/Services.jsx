"use client";
import productservices2 from "../../Assets/Images/productservices2.png";
import productservices1 from "../../Assets/Images/productservices1.jpg";

import Button from "../common/Button";

export default function Services() {
  return (
    <section className="bg-[#ffffff] py-4 md:py-8 ">
      <div className="container mx-auto px-4 max-w-[1430px]">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
          <div
            className="relative bg-cover bg-center h-[550px] lg:h-[420px]"
            style={{ backgroundImage: `url(${productservices2?.src})` }}
          >
            <div className="absolute inset-0 bg-black/40"></div>

            {/* CENTER THE TEXT */}
            <div className="relative flex flex-col items-start justify-start h-full w-full p-8 text-white text-left">

              <h2 className="text-[#ffffff] font-[900] text-[15px] md:text-[20px] leading-[100%] tracking-[-0.02em] mb-3 md:mb-6 uppercase Creato max-w-[550px] ">
                Up to 40% Off on Sofas, Lighting & Decor
              </h2>
              <Button title="Shop Collections" classes="bg-white text-black border border-white" />
            </div>
          </div>

          <div
            className="relative bg-cover bg-center h-[550px] lg:h-[420px]"
            style={{ backgroundImage: `url(${productservices1?.src})` }}
          >
            <div className="absolute inset-0 bg-black/40"></div>

            {/* CENTER THE TEXT */}
            <div className="relative flex flex-col items-start justify-start h-full w-full p-8 text-white text-left">
              <h2 className="text-[#ffffff] font-[900] text-[15px] md:text-[20px] leading-[100%] tracking-[-0.02em] mb-3 md:mb-6 uppercase Creato max-w-[550px]">
                Extra 15% Off on Orders Above ₹50,000
              </h2>
              <Button title="Shop Collections" classes="bg-white text-black border border-white" />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
