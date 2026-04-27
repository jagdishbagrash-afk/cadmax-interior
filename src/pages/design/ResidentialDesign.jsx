import Image from "next/image";
import imagesrc from "../../Assets/Images/end.jpg"
import Link from "next/link";


export default function ResidentialDesign({Residentialservices}) {
    return (
        <div
            className="bg-[#FFFFFF] py-4 md:py-8 ">
            <div className="container mx-auto px-4 max-w-[1430px]">
                {/* Heading */}
                <div className="max-w-4xl mx-auto mb-10 md:mb-16 flex flex-col items-center justify-between">

                    <h2 className="text-[#171717] font-[900] text-[18px] md:text-[20px] lg:text-[24px] leading-[100%] 
                     tracking-[-0.02em] text-center uppercase Creato  ">
                        Residential Design Tailored for Comfort, Coherence, and Daily Living
                    </h2>
                    {/* <p className="text-[#4D5466] font-[500] text-sm md:text-base leading-relaxed mt-3  text-center  ">
                        From compact apartments to villas, we deliver interiors that function
                        with character. Our process includes precise layout planning, 3D
                        visualizations, and on-site supervision for complete spatial control.
                    </p> */}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Residentialservices?.map((item, index) => (
                        <Link
                        href={`/design/residential/${item.slug}`}
                            key={index}
                            className="relative overflow-hidden group"
                        >
                            <Image
                                src={item?.Image}
                                alt={item.title}
                                width={500}
                                height={350}
                                className="w-full h-[325px] object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center  p-4">
                                <h3 className="text-white Creato text-[16px] lg:text-[18px] font-normal leading-[120%] tracking-[-0.03em] ">
                                    {item.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
