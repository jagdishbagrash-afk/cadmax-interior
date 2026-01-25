import Banner from "@/components/Banner";
import ProductListBanner from "../../Assets/Images/ProductListBanner.png";
import Layout from "../common/Layout";
import ProductCard from "../common/ProductCard";
import { useEffect, useState } from "react";
import Listing from "../api/Listing";

export default function Index() {
    const [bestseller, setbestseller] = useState([])


   const fetchDatas = async () => {
        try {
            const main = new Listing();
            const response = await main.GetLastproduct();
            console.log("responselast", response)
            if (response.data?.data) {
                setbestseller(response.data.data);
            } else {
                setbestseller([]);
            }
        } catch (error) {
            console.log("Error:", error);
            setbestseller([]);
        }
    };

    useEffect(() => {
        fetchDatas();
    }, []);


    return (
        <Layout>
            <Banner Slider1={ProductListBanner}
                title={"New Arrival"}
            />
            <div className="bg-[#FFFFFF] py-4 md:py-8 ">
                <div className="container mx-auto px-4 max-w-[1430px]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {bestseller?.map((item, idx) => {
                                return (
                                    <ProductCard
                                        key={item?._id || idx}
                                        item={item}
                                    />
                                );
                            })}

                    </div>
                </div>
            </div>
        </Layout>
    );
}