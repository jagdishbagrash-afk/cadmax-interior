import Image from "next/image";
import imagesrc from "../../Assets/Images/end.jpg"


export default function ResidentialDesign() {
    const services = [
    { title: "2D PLANNING & FULL-HOME LAYOUTS" },
    { title: "FRONT ELEVATIONS & FACADE DESIGN" },
    { title: "LIVING & BEDROOM INTERIORS" },
    { title: "MODULAR KITCHEN & STORAGE PLANNING" },
    { title: "STAIRCASE & BATHROOM DETAILING" },
    { title: "GARDEN, GAZEBO & ROOFTOP CONCEPTS" },
    { title: "FALSE CEILINGS, LIGHTING & WARDROBE SYSTEMS" },
    { title: "CUSTOM TV PANELS & BUILT-IN UNITS" },
];
    return (
        <div
            className="bg-[#FFFFFF] py-4 md:py-8 ">
            <div className="container mx-auto px-4 max-w-[1430px]">
                {/* Heading */}
                <div className="max-w-5xl mx-auto mb-10 md:mb-16 flex flex-col items-center justify-between">

                    <h2 className="text-[#171717] font-[900] text-[18px] md:text-[20px] lg:text-[24px] leading-[100%] 
 tracking-[-0.02em] text-center uppercase Creato  ">
                        Residential Design Tailored for Comfort, Coherence, and Daily Living
                    </h2>
                    <p className="mt-3 text-sm md:text-base text-gray-600 text-center ">
                        From compact apartments to villas, we deliver interiors that function
                        with character. Our process includes precise layout planning, 3D
                        visualizations, and on-site supervision for complete spatial control.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((item, index) => (
                        <div
                            key={index}
                            className="relative overflow-hidden group"
                        >
                            <Image
                                src={imagesrc?.src} // replace with real image
                                alt={item.title}
                                width={500}
                                height={350}
                                className="w-full h-[220px] object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
                                <h3 className="text-white text-sm font-semibold text-center tracking-wide">
                                    {item.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
