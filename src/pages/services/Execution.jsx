import React from "react";
import icon from "../../Assets/Images/icon.png";
import icon1 from "../../Assets/Images/icon2.png";
import icon2 from "../../Assets/Images/icon3.png";
import icon3 from "../../Assets/Images/icon4.png";

const Execution = () => {
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
        <section className="bg-[#171717] py-4 md:py-8">
            <div className="container mx-auto px-4 max-w-[1430px]">
                {/* Heading */}
                <div className="max-w-7xl mx-auto mb-10 md:mb-16 flex flex-col md:flex-row items-start md:items-end justify-between">
                    <h2 className="text-[#FFFFFF] font-[900] text-[24px] leading-[100%] tracking-[-0.02em] text-left mb-6 uppercase Creato">
                        Structured Design. Predictable Results.
                    </h2>
                    <p className="text-[#ffffff] font-[500] text-sm md:text-base leading-relaxed md:w-2/3 md:pl-8">
                        Every project follows a defined framework and craft for design accuracy and execution reliability.
                    </p>
                </div>

                {/* Icons Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {items && items?.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col items-center justify-start px-4"
                        >
                            <img
                                src={item.icon}
                                alt={item.title}
                                className="w-[60px] h-[60px] mb-4  object-cover"
                            />

                            <h3 className="text-[#171717] font-[700] text-[16px] md:text-[18px]
                tracking-[-0.01em] text-center mb-2 Creato">
                                {item.title}
                            </h3>

                            <p className="text-[#4D5466] font-[500] text-[14px]  
                tracking-[-0.01em] text-center Creato">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Execution;
