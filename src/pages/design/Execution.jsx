import React from "react";
import icon from "../../Assets/Images/Mask22.png";
import icon1 from "../../Assets/Images/icon2.png";
import icon2 from "../../Assets/Images/icon3.png";
import icon3 from "../../Assets/Images/icon4.png";

const Execution = () => {
    const items = [
        {
            id: 1,
            icon: icon?.src,
            title: "In-House Design + Execution Teams",
            desc: "We're here to help curate your private sanctuary in your personal style.",
        },
        {
            id: 2,
            icon: icon?.src,
            title: "Verified Vendor Network",
            desc: "Every purchase is protected with at least a year of coverage, for a peace of mind.",
        },
        {
            id: 3,
            icon: icon?.src,
            title: "On-Site Quality Audits",
            desc: "Count on our dedicated team for support every step of the way.",
        },
        {
            id: 4,
            icon: icon?.src,
            title: "Post-Installation Support",
            desc: "Enjoy hassle-free delivery with a flat, low rate for all your purchases.",
        },
    ];

    return (
        <section className="bg-[#171717] py-4 md:py-8">
            <div className="container mx-auto px-4 max-w-[1430px]">
                {/* Heading */}

                <div className="max-w-[1430px] mx-auto mb-10 md:mb-16 
flex flex-col md:flex-row items-start md:items-end justify-between gap-6">

                    <h2 className="text-[#ffffff] font-[900] text-[24px] tracking-[-0.02em] uppercase Creato md:max-w-[40%]">
                        Precision Beyond Design — Execution You Can Measure
                    </h2>

                    <p className="text-[#ffffff] font-[500] text-[16px] md:text-[18px] leading-[100%] 
  tracking-[-0.02em] md:max-w-[55%] text-center md:text-left Creato">
                        Design only works when execution matches the plan. We maintain strict supervision
                        across sourcing, fabrication, and installation to ensure longevity and visual fidelity.
                    </p>

                </div>


                {/* Icons Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {items?.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col items-center justify-start text-center"
                        >
                            {/* IMAGE CIRCLE */}
                            <div className="w-[200px] h-[200px] border border-[#ffffff40] rounded-full 
          flex items-center justify-center mb-4 mx-auto">
                                <img
                                    src={item.icon}
                                    alt={item.title}
                                    className="w-[90px] h-[90px] object-contain"
                                />
                            </div>

                            {/* TITLE */}
                            <h3 className="text-white font-[900] text-[16px] md:text-[18px] tracking-[-0.01em] Creato max-w-[220px]">
                                {item.title}
                            </h3>
                        </div>
                    ))}
                </div>


            </div>
        </section>
    );
};

export default Execution;
