import Banner from "@/components/Banner";
import ProductListBanner from "../../Assets/Images/ProductListBanner.png";
import Layout from "../common/Layout";
import ProductCard from "../common/ProductCard";
import { useEffect, useState } from "react";
import Listing from "../api/Listing";

export default function Index() {
    const [bestseller, setbestseller] = useState([])

console.log("bestseller" ,bestseller)
    const fetchData = async () => {
        try {
            const main = new Listing();
            const response = await main.GetBestSeller();
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
        fetchData();
    }, []);
    return (
        <Layout>
            <Banner Slider1={ProductListBanner}
                title={"OUR BEST SELLER"}
            />
            <div className="bg-[#FFFFFF] py-4 md:py-8 ">
                <div className="container mx-auto px-4 max-w-[1430px]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                       {(Array.isArray(bestseller) ? bestseller : []).map((item, idx) => {
    const product = item?.product ?? item;
    return <ProductCard key={product?._id || idx} item={product} />;
})}


                    </div>
                </div>
            </div>
        </Layout>
    );
}