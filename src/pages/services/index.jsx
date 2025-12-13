import Banner from "@/components/Banner";
import ProductListBanner from "../../Assets/Images/ProductListBanner.png";
import Layout from "../common/Layout";
import ResidentialDesign from "./ResidentialDesign";
import CommercialDesign from "./CommercialDesign";
import Vendor from "./Vendor";
import Predictable from "./Predictable";
import Execution from "./Execution";
import Slider2 from "../home/Slider2";

export default function Index() {
    return (
        <Layout>
            <Banner Slider1={ProductListBanner}
                title={"From Blueprint to Reality — Complete Interior Design & Execution"}
                button={"SHOP OUR FURNITURE"} />
            <div className="w-full px-4">
                <div className="max-w-[1430px] mx-auto">
                    <div className="max-w-5xl mx-auto mt-8 mb-12 md:mt-12 md:mb-20 flex justify-center">
                        <h2 className="
        text-[#171717]
        text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px]
        leading-[130%]
        tracking-[-0.02em]
        text-center
        uppercase font-bold
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
            <ResidentialDesign />
            <CommercialDesign />
            <Vendor />
            <Execution />
            <Slider2 />
            <Banner Slider1={ProductListBanner}
                title={"From Blueprint to Reality — Complete Interior Design & Execution"}
                button={"SHOP OUR FURNITURE"} />
        </Layout>
    );
}