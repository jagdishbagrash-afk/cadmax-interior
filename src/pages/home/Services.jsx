"use client";

export default function Services() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* LEFT SECTION */}
      <div
        className="flex-1 bg-cover bg-center h-96 lg:h-auto"
        style={{
          backgroundImage:
            "url('https://cadmaxpro-buket.s3.ap-south-1.amazonaws.com/assets/about/image19.png')",
        }}
      >
        <div className="flex flex-col items-center justify-center h-full p-8 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-semibold leading-snug tracking-wider mb-8 uppercase max-w-xl">
            CONTEMPORARY FURNITURE, LIGHTING, AND DECOR FOR DAILY USE.
          </h2>
          <a
            href="#"
            className="border-2 border-white text-white py-3 px-8 text-sm font-medium tracking-widest hover:bg-white hover:text-black transition duration-300"
          >
            SHOP NOW
          </a>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div
        className="flex-1 bg-cover bg-center h-96 lg:h-auto"
        style={{
          backgroundImage:
            "url('https://cadmaxpro-buket.s3.ap-south-1.amazonaws.com/assets/about/image18.png')",
        }}
      >
        <div className="flex flex-col items-center justify-center h-full p-8 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-semibold leading-snug tracking-wider mb-8 uppercase max-w-xl">
            RESIDENTIAL AND COMMERCIAL INTERIORS DELIVERED END-TO-END.
          </h2>
          <a
            href="#"
            className="border-2 border-white text-white py-3 px-8 text-sm font-medium tracking-widest hover:bg-white hover:text-black transition duration-300"
          >
            VIEW SERVICES
          </a>
        </div>
      </div>
    </div>
  );
}
