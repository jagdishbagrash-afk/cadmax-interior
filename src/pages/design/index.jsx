import Banner from "@/components/Banner";
import ProductListBanner from "../../Assets/Images/Desgin.png";
import servicesbottom from "../../Assets/Images/servicesbottom.jpg"
import Layout from "../common/Layout";
import ResidentialDesign from "./ResidentialDesign";
import CommercialDesign from "./CommercialDesign";
import Predictable from "./Predictable";
import Execution from "./Execution";
import Slider2 from "../home/Slider2";
import Button from "../common/Button";
import Listing from "../api/Listing";
import { useEffect, useState } from "react";

export default function Index() {

    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const main = new Listing();
            const response = await main.ServciesType();
            if (response.data?.data) {
                setData(response.data.data);
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Layout>
            <Banner Slider1={ProductListBanner}
                title={"Get our latest designs"}
                button={"SHOP OUR FURNITURE"} />
            <div className="w-full">
                <div className="container mx-auto px-4 max-w-[1430px]">
                    <div className="max-w-5xl mx-auto mt-8 mb-12 md:mt-12 md:mb-20 flex justify-center">
                        <h2 className="
        text-[#171717]
        text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px]
        leading-[130%]
        tracking-[-0.02em]
        text-center
        uppercase font-[900]
        Creato
      ">
                            Every Cadmax project begins with clarity — measured planning, verified
                            materials, and visual precision. We integrate creative detailing with
                            technical practicality to ensure what’s designed is exactly what’s built.
                        </h2>
                    </div>
                </div>
            </div>
            <Predictable />
            <ResidentialDesign Residentialservices={data?.Residentialservices} />
            <CommercialDesign Commercialservices={data?.Commercialservices} />
            {/* <Vendor /> */}
            <Execution />
            <Slider2 />
            <div className="relative w-full h-full md:h-[450px]">
                <img
                    src={servicesbottom?.src}
                    alt="Slide"
                    className="object-cover w-full h-full"
                />

                <div className="absolute inset-0 bg-black/30"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center w-full">

                    <h1
                        className="
        font-[900]
        text-[18px]
        sm:text-[20px]
        lg:text-[24px]
        text-white
        uppercase
        Creato
        leading-[110%]
        tracking-[-0.01em]
        max-w-[90%]
        sm:max-w-[500px]
        mx-auto
      "
                    >
                        Start Your Interior Journey with Cadmax Interio
                    </h1>

                    <div
                        className="
        flex
        flex-wrap
        justify-center
        items-center
        gap-2
        sm:gap-3
        mt-3
        sm:mt-5
        max-w-[95%]
        mx-auto
      "
                    >
                        <Button
                            title={"Book a Design Consultation"}
                            classes={"bg-transparent text-white border-2 border-white whitespace-nowrap px-4 py-2"}
                        />
                    </div>

                </div>
            </div>
        </Layout>
    );
}