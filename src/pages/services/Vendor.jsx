import Image from "next/image";
import imagesrc from "../../Assets/Images/swiper.jpg"

export default function Vendor() {
    const Products = [
        { title: "3D MODELING & BRAND-CENTRIC VISUALIZATION", span: "row-span-2", image: imagesrc?.src },
        { title: "2D SPACE PLANNING & OPTIMIZATION", image: imagesrc?.src },
        { title: "CORPORATE OFFICES & WORKSPACES", image: imagesrc?.src },
        { title: "CAFÉS, SALONS & SERVICE STUDIOS", image: imagesrc?.src },
    ];

    return (
        <div
            className="bg-[#FFFFFF] py-4 md:py-8 ">
            <div className="container mx-auto px-4 max-w-[1430px]">
                {/* Heading */}
                <div className="     mx-auto mb-10 md:mb-16 flex flex-col md:flex-row items-start md:items-end justify-between">
                    <h2 className="text-[#171717] font-[900] text-[24px] leading-[100%] tracking-[-0.02em] text-left mb-6 uppercase Creato">
                        Book a vendor
                    </h2>
                    <p className="text-[#4D5466] font-[500] text-sm md:text-base leading-relaxed md:w-2/3 md:pl-8">
                        Every Cadmax project includes detailed 3D renders that depict scale, lighting, and material texture — eliminating uncertainty and enabling clients to make informed decisions before execution begins.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Products?.map((p, idx) => (
                        <article key={p.id ?? idx} className="overflow-hidden">
                            {/* IMAGE + OFFER */}
                            <div className="relative w-full h-[400px] md:h-[480px] overflow-hidden bg-gray-100">
                                <img
                                    src={p.image}
                                    alt={p.title}
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>
                            {/* TITLE + PRICE */}
                            <div className="pt-2">
                                <h3 className="text-[14px] uppercase text-[#262A33] mb-2 font-medium Creato tracking-[0.05em]">
                                    {p.title}
                                </h3>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>

    );
}
