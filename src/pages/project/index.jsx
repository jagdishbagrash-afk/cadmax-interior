import Banner from "@/components/Banner";
import ProductListBanner from "../../Assets/Images/ProductListBanner.png";
import ProjectList from "../../Assets/Images/projectlist.jpg";

import Layout from "../common/Layout";
import Button from "../common/Button";

export default function Index() {



    const projects = [
        {
            id: 1,
            date: "INTERIOR DESIGN — DEC 21, 2023",
            title: "MODERN MINIMALISTIC 4 BHK HOME OF AJAY SHARMA",
            description:
                "Discover the ultimate luxury living spaces designed with modern elegance and premium materials that create long-lasting impressions.",
            image: ProjectList?.src,
            button: "GET A QUOTE",
            designed_by: "DESIGNED BY: DEEPAK CHOPRA",
            sections: [
                {
                    "heading": "Client Brief",
                    "content": "Auro Smitha wanted a client-centric design approach with ergonomic kitchen and interiors along minimalistic sensibilities."
                },
                {
                    "heading": "Design Solution",
                    "content": "An independent 4 BHK home designed on modern minimalist theme. The decor of this home is designed on principles of simplicity, minimalism and austerity. The colour scheme reflects the design principles with the use of neutral shades grey, black and white."
                }
            ],
        },
        {
            id: 1,
            date: "INTERIOR DESIGN — DEC 21, 2023",
            title: "MODERN MINIMALISTIC 4 BHK HOME OF AJAY SHARMA",
            description:
                "Discover the ultimate luxury living spaces designed with modern elegance and premium materials that create long-lasting impressions.",
            image: ProjectList?.src,

            button: "GET A QUOTE",
            designed_by: "DESIGNED BY: DEEPAK CHOPRA",
            sections: [
                {
                    "heading": "Client Brief",
                    "content": "Auro Smitha wanted a client-centric design approach with ergonomic kitchen and interiors along minimalistic sensibilities."
                },
                {
                    "heading": "Design Solution",
                    "content": "An independent 4 BHK home designed on modern minimalist theme. The decor of this home is designed on principles of simplicity, minimalism and austerity. The colour scheme reflects the design principles with the use of neutral shades grey, black and white."
                }
            ],
        },

        {
            id: 1,
            date: "INTERIOR DESIGN — DEC 21, 2023",
            title: "MODERN MINIMALISTIC 4 BHK HOME OF AJAY SHARMA",
            description:
                "Discover the ultimate luxury living spaces designed with modern elegance and premium materials that create long-lasting impressions.",
            image: ProjectList?.src,

            button: "GET A QUOTE",
            designed_by: "DESIGNED BY: DEEPAK CHOPRA",
            sections: [
                {
                    "heading": "Client Brief",
                    "content": "Auro Smitha wanted a client-centric design approach with ergonomic kitchen and interiors along minimalistic sensibilities."
                },
                {
                    "heading": "Design Solution",
                    "content": "An independent 4 BHK home designed on modern minimalist theme. The decor of this home is designed on principles of simplicity, minimalism and austerity. The colour scheme reflects the design principles with the use of neutral shades grey, black and white."
                }
            ],
        },
    ];
    return (
        <Layout>
            <Banner Slider1={ProductListBanner}
                title={"From Blueprint to Reality — Complete AND LUXURY FURNITURE"}
                button={"SHOP OUR FURNITURE"} />
            <div
                className="bg-[#FFFFFF] py-4 md:py-8 ">
                <div className="container mx-auto px-4 max-w-[1430px]">

                    {projects.map((item, index) => {
                        const isReverse = index % 2 !== 0; // alternate layout
                        return (
                            <div
                                key={item.id}
                                className={`grid grid-cols-1 md:grid-cols-3 gap-10 items-center  my-10 md:my-16 lg:my-20 ${isReverse ? "md:flex-row-reverse" : ""
                                    }`}
                            >
                                <div className={`md:col-span-2 ${isReverse ? "md:order-2" : ""}`}>

                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-[520px] object-cover "
                                    />
                                </div>

                                {/* Content */}
                                <div className={`md:col-span-1 ${isReverse ? "md:order-1" : ""}`}>


                                    <h2 className="Creato font-[900] uppercase text-[24px] leading-[1] tracking-[-0.02em] mb-3">
                                        {item.title}
                                    </h2>

                                    <p className="Creato font-medium text-[14px] sm:text-[15px] md:text-[16px] leading-[1] tracking-[-0.02em] uppercase text-left text-[#4D5466] mb-6">
                                        {item.designed_by}
                                    </p>

                                    <div className="space-y-5">
                                        {item.sections.map((section, i) => (
                                            <div key={i} className="space-y-2">

                                                <h3 className="Creato font-bold text-[16px] sm:text-[17px] md:text-[18px] leading-[1] tracking-[-0.02em] text-[#171717]">
                                                    {section.heading}
                                                </h3>

                                                <p className="Creato font-medium text-[14px] sm:text-[15px] md:text-[16px] leading-[1.4] tracking-[-0.02em] text-[#4D5466]">
                                                    {section.content}
                                                </p>

                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        className="
                                    mt-8
                                    w-full sm:w-[440px]
                                    h-[56px]
                                    px-[70px]
                                    py-[23px]
                                    flex items-center justify-center gap-[10px]
                                    border border-[#171717]
                                    font-Creato font-bold
                                    text-[14px]
                                    leading-[1]
                                    tracking-[0.08em]
                                    uppercase
                                    hover:text-[#171717]
                                    hover:bg-white
                                    transition
                                    bg-black text-white
                                                                              "
                                    >
                                        {item.button}
                                    </button>

                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
}