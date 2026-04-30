import React from "react";
import { FaCouch, FaShieldAlt, FaHeadset, FaShippingFast } from "react-icons/fa";
import { MdEditRoad } from "react-icons/md";
import { MdViewInAr } from "react-icons/md";
import { MdLightbulbOutline } from "react-icons/md";
import { MdVerified } from "react-icons/md";
const Predictable = () => {


const processData = [
  {
    title: "Site Study & 2D Planning",
    desc: "Spatial assessment, functional zoning, and layout creation.",
    icon: <MdEditRoad size={24}/>
  },
  {
    title: "3D Modeling & Visualization",
    desc: "Realistic renders enabling precise visualization.",
    icon: <MdViewInAr size={24}/>
  },
  {
    title: "Concept Development",
    desc: "Color palette, mood boards, and design direction.",
    icon: <MdLightbulbOutline size={24}/>
  },
  {
    title: "Final Styling & Handover",
    desc: "On-site detailing and final documentation.",
    icon: <MdVerified size={24}/>
  }
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
          {processData && processData?.map((item) => (
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