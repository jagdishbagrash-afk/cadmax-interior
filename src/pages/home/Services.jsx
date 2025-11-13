"use client";
import end from "../../Assets/Images/end.jpg";
import ligithing from "../../Assets/Images/ligithing.jpg";
import Button from "../common/Button";

export default function Services() {
  return (
    <div className="flex flex-col lg:flex-row gap-1 mt-1">
      {/* LEFT SECTION */}
      <div
        className="relative flex-1 bg-cover bg-center h-96 lg:h-[450px]"
        style={{
          backgroundImage: `url(${end?.src})`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}
        <div className="relative flex flex-col items-center justify-center h-full p-8 text-white text-center">
          <h2 className="text-[#ffffff] font-[900] text-[24px] leading-[100%] tracking-[-0.02em] text-left mb-6 uppercase cartera max-w-[550px] mx-auto">
            CONTEMPORARY FURNITURE, LIGHTING, AND DECOR FOR DAILY USE.
          </h2>
          <Button
            title={" SHOP NOW"}
            classes={"bg-transparent text-white border border-white"}
          />

        </div>
      </div>

      {/* RIGHT SECTION */}
      <div
        className="relative flex-1 bg-cover bg-center h-96 lg:h-[450px]"
        style={{
          backgroundImage: `url(${ligithing?.src})`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}
        <div className="relative flex flex-col items-center justify-center h-full p-8 text-white text-center">
          <h2 className="text-[#ffffff] font-[900] text-[24px] leading-[100%] tracking-[-0.02em] text-left mb-6 uppercase cartera max-w-[550px] mx-auto">

            RESIDENTIAL AND COMMERCIAL INTERIORS DELIVERED END-TO-END.
          </h2>
          <Button
            title={"VIEW SERVICES"}
            classes={"bg-transparent text-white border border-white"}
          />
        </div>
      </div>
    </div>
  );
}
