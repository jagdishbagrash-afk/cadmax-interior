import React from "react";
import icon from "../../Assets/Images/icon.png";
import icon1 from "../../Assets/Images/icon2.png";
import icon2 from "../../Assets/Images/icon3.png";
import icon3 from "../../Assets/Images/icon4.png";

const ContactStyling = () => {
  const items = [
    {
      id: 1,
      icon: icon?.src,
      title: "Complimentary Home Styling",
      desc: "We're here to help curate your private sanctuary in your personal style.",
    },
    {
      id: 2,
      icon: icon1?.src,
      title: "Warranty Coverage",
      desc: "Every purchase is protected with at least a year of coverage, for a peace of mind.",
    },
    {
      id: 3,
      icon: icon2?.src,
      title: "Service Excellence",
      desc: "Count on our dedicated team for support every step of the way.",
    },
    {
      id: 4,
      icon: icon3?.src,
      title: "Flat Rate Shipping",
      desc: "Enjoy hassle-free delivery with a flat, low rate for all your purchases.",
    },
  ];

  return (
    <section className="bg-white py-4 md:py-8">
      <div className="container mx-auto px-4 max-w-[1430px]">
        {/* Heading */}
        <h2 className="text-[#171717] font-[900] text-[24px] leading-[100%] mb-[32px] tracking-[-0.02em] text-center uppercase cartera">
          CONTACT US FOR INTERIOR STYLING
        </h2>

        {/* Icons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center ">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center justify-center px-4"
            >
              <img
                src={item.icon}
                alt={item.title}
                className="w-[60px] h-[60px] mb-4 object-contain"
              />
              <h3 className="text-[#171717] font-[700] text-[20px] leading-[100%] tracking-[-0.02em] text-center cartera">
                {item.title}
              </h3>

              <p className="mt-2 text-[#4D5466] font-[500] text-[16px] leading-[100%] tracking-[-0.02em] text-center cartera">
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
