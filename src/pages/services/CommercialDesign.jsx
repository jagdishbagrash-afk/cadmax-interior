import Image from "next/image";
import imagesrc from "../../Assets/Images/swiper.jpg"
import Link from "next/link";



export default function CommercialDesign({Commercialservices}) {
  
    return (
        <div
            className="bg-[#F6F6F6] py-4 md:py-8 ">
            <div className="container mx-auto px-4 max-w-[1430px]">
                {/* Heading */}
                <div className="max-w-5xl mx-auto mb-10 md:mb-16 flex flex-col items-center justify-between">
                    <h2 className="text-[#171717] font-[900] text-[18px] md:text-[20px] lg:text-[24px] leading-[100%] 
                       tracking-[-0.02em] text-center uppercase Creato  ">
                        Commercial Spaces Engineered for Flow, Brand Presence & Performance
                    </h2>
                    <p className="text-[#4D5466] font-[500] text-sm md:text-base leading-relaxed mt-3  text-center  ">
                        Every commercial project is designed to optimize spatial efficiency,
                        brand impact, and customer experience. Whether it’s a café, salon, or
                        corporate office, layouts are driven by logic and modern aesthetics.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[300px] gap-6">
                    {Commercialservices && Commercialservices?.map((item, index) => (
                        <Link
                        href={`/services/${item?.slug}`}
                            key={index}
                            className={`relative overflow-hidden  group ${item.title || ""}`}
                        >
                            <Image
                                src={item?.Image} // replace with actual image
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/45 flex items-center justify-center text-center p-4">
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
