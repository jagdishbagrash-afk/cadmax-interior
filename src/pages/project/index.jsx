import Banner from "@/components/Banner";
import ProductListBanner from "../../Assets/Images/ProductListBanner.png";
import ProjectList from "../../Assets/Images/projectlist.jpg";
import Layout from "../common/Layout";
import Button from "../common/Button";
import Listing from "../api/Listing";
import { useEffect, useState } from "react";

export default function Index() {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const main = new Listing();
            const response = await main.getAllProject();
            if (response.data?.data) {
                setData(response.data.data);
            } else {
                setData([]);
            }
        } catch (error) {
            console.log("Error:", error);
            setData([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    return (
        <Layout>
            <Banner Slider1={ProductListBanner}
                title={"From Blueprint to Reality — Complete AND LUXURY FURNITURE"}
                button={"SHOP OUR FURNITURE"} />
            <div
                className="bg-[#FFFFFF] py-4 md:py-8 ">
                <div className="container mx-auto px-4 max-w-[1430px]">
                    {data && data?.map((item, index) => {
                        const isReverse = index % 2 !== 0; // alternate layout
                        return (
                            <div
                                key={item.id}
                                className={`grid grid-cols-1 md:grid-cols-3 gap-10 items-center  my-10 md:my-16 lg:my-20 ${isReverse ? "md:flex-row-reverse" : ""
                                    }`}
                            >
                                <div className={`md:col-span-2 ${isReverse ? "md:order-2" : ""}`}>

                                    <img
                                        src={item.Image}
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
                                        {item.designed}
                                    </p>
                                    <div className="space-y-5">
                                        <div className="space-y-2">

                                            <h3 className="Creato font-bold text-[16px] sm:text-[17px] md:text-[18px] leading-[1] tracking-[-0.02em] text-[#171717]">
                                                Client Brief
                                            </h3>

                                            <p className="Creato font-medium text-[14px] sm:text-[15px] md:text-[16px] leading-[1.4] tracking-[-0.02em] text-[#4D5466]">
                                                {item?.brief}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <h3 className="Creato font-bold text-[16px] sm:text-[17px] md:text-[18px] leading-[1] tracking-[-0.02em] text-[#171717]">
                                                Design Solution
                                            </h3>
                                            <p className="Creato font-medium text-[14px] sm:text-[15px] md:text-[16px] leading-[1.4] tracking-[-0.02em] text-[#4D5466]">
                                                {item?.solution}
                                            </p>
                                        </div>
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
                                        GET A QUOTE
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