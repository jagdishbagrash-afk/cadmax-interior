"use client";
import Link from "next/link";
import end from "../../Assets/Images/end.jpg";
import ligithing from "../../Assets/Images/ligithing.jpg";

export default function Services() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-1">

  {/* First Card */}
  <div
    className="relative bg-cover bg-center h-[260px] sm:h-[300px] md:h-[500px] lg:h-[450px]"
    style={{
      backgroundImage: `url(${end?.src})`,
    }}
  >
    <div className="absolute inset-0 bg-black/40"></div>

    <div className="relative flex flex-col items-center justify-center h-full px-4 py-3 md:p-8 text-white text-center">
      
      <h2 className="text-white font-[900] text-[12px] sm:text-[14px] md:text-[20px] 
      leading-tight tracking-[-0.02em] mb-2 md:mb-6 uppercase max-w-[90%] md:max-w-[550px] mx-auto">
        CONTEMPORARY FURNITURE, LIGHTING, AND DECOR FOR DAILY USE.
      </h2>

      <Link 
        href="/product" 
        className="
          px-3 py-[5px] 
          text-[11px]
          font-[700] 
          uppercase 
          border border-white 
          text-white 
          md:px-[30px] md:py-[10px] md:text-[13px]
        "
      >
        SHOP NOW
      </Link>

    </div>
  </div>

  {/* Second Card */}
  <div
    className="relative bg-cover bg-center h-[260px] sm:h-[300px] md:h-[500px] lg:h-[450px]"
    style={{
      backgroundImage: `url(${ligithing?.src})`,
    }}
  >
    <div className="absolute inset-0 bg-black/40"></div>

    <div className="relative flex flex-col items-center justify-center h-full px-4 py-3 md:p-8 text-white text-center">
      
      <h2 className="text-white font-[900] text-[12px] sm:text-[14px] md:text-[20px] 
      leading-tight tracking-[-0.02em] mb-2 md:mb-6 uppercase max-w-[90%] md:max-w-[550px] mx-auto">
        RESIDENTIAL AND COMMERCIAL INTERIORS DELIVERED END-TO-END.
      </h2>

      <Link 
        href="/design" 
        className="
          px-3 py-[5px] 
          text-[11px]
          font-[700] 
          uppercase 
          border border-white 
          text-white 
          md:px-[30px] md:py-[10px] md:text-[13px]
        "
      >
        VIEW CONCEPT
      </Link>

    </div>
  </div>

</div>
  );
}
