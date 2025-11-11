import React from "react";
// import { LuHome, LuShieldCheck, LuMedal, LuTruck } from "react-icons/lu";

const ContactStyling = () => {
  const items = [
    {
      id: 1,
      title: "Complimentary Home Styling",
      desc: "We're here to help curate your private sanctuary in your personal style.",
    },
    {
      id: 2,
      title: "Warranty Coverage",
      desc: "Every purchase is protected with at least a year of coverage, for a peace of mind.",
    },
    {
      id: 3,
      title: "Service Excellence",
      desc: "Count on our dedicated team for support every step of the way.",
    },
    {
      id: 4,
      title: "Flat Rate Shipping",
      desc: "Enjoy hassle-free delivery with a flat, low rate for all your purchases.",
    },
  ];

  return (
    <section className="bg-white py-10">
      <div className="container mx-auto px-4 max-w-[1230px]">
        {/* Heading */}
        <h2 className="text-center text-sm font-bold tracking-wide text-gray-900 mb-8">
          CONTACT US FOR INTERIOR STYLING
        </h2>

        {/* Icons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center justify-center px-4"
            >
              {/* {item.icon} */}
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactStyling;
