import React from "react";
import { FaCouch, FaShieldAlt, FaHeadset, FaShippingFast } from "react-icons/fa";

const Predictable = () => {
  const items = [
    {
      id: 1,
      icon: <FaCouch size={28} />,
      title: "Complimentary Home Styling",
      desc: "We're here to help curate your private sanctuary in your personal style.",
    },
    {
      id: 2,
      icon: <FaShieldAlt size={28} />,
      title: "Warranty Coverage",
      desc: "Every purchase is protected with at least a year of coverage, for peace of mind.",
    },
    {
      id: 3,
      icon: <FaHeadset size={28} />,
      title: "Service Excellence",
      desc: "Count on our dedicated team for support every step of the way.",
    },
    {
      id: 4,
      icon: <FaShippingFast size={28} />,
      title: "Flat Rate Shipping",
      desc: "Enjoy hassle-free delivery with a flat, low rate for all your purchases.",
    },
  ];

  return (
    <section className="bg-[#F6F6F6] py-6 md:py-10">
      <div className="container mx-auto px-4 max-w-[1430px]">

        {/* Heading */}
        <div className=" mb-10 md:mb-16 flex flex-col  items-center  justify-between gap-5">
          <h2 className="text-[#171717] font-[900] text-[22px] md:text-[26px] uppercase Creato text-center md:text-left">
       Our Process
          </h2>

          {/* <p className="text-[#4D5466] text-sm md:text-base md:max-w-[55%] text-center md:text-left">
            Every project follows a defined framework and craft for design accuracy and execution reliability.
          </p> */}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300 p-6 flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div className="w-[70px] h-[70px] flex items-center justify-center rounded-full bg-gray-100 mb-4 text-[#171717]">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-[#171717] font-[700] text-[16px] md:text-[18px] mb-2">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-[#4D5466] text-[14px] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Predictable;