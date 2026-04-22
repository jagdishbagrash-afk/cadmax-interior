import ProductGrid from "@/components/ProductGrid";
import Layout from "../common/Layout";
import Sliderimage from "../../Assets/Images/seller.png";
import Sliderimage1 from "../../Assets/Images/seller2.png";
import Sliderimage2 from "../../Assets/Images/seller3.jpg";
import Sliderimage3 from "../../Assets/Images/seller4.jpg";
import ContactStyling from "../common/ContactStyling";
import FeaturedCategories from "./CategoryCard";
import ProductListBanner from "../../Assets/Images/desgin001.jpeg";

import ThreeBanner from "./ThreeBanner";
import { useEffect, useState } from "react";
import Listing from "../api/Listing";
import Banner from "@/components/Banner";
function Index() {
    const [bestseller, setbestseller] = useState("")
    const [lastproduct, setlastproduct] = useState("")


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


    const fetchDatas = async () => {
        try {
            const main = new Listing();
            const response = await main.GetLastproduct();
            if (response.data?.data) {
                setlastproduct(response.data.data);
            } else {
                setlastproduct([]);
            }
        } catch (error) {
            console.log("Error:", error);
            setlastproduct([]);
        }
    };

    useEffect(() => {
        fetchData();
        fetchDatas();
    }, []);

    return (
        <>
            <Layout>
                {/* <ThreeBanner /> */}

                <Banner
                    Slider1={ProductListBanner}
                    title={"Discover Luxury Furniture Crafted for Modern Living"}
                    button={"Shop Our Products"}
                />
                <FeaturedCategories />

                <ProductGrid products={bestseller} title={"OUR BEST SELLER"} link={"/best-seller"} />
                <ProductGrid products={lastproduct} title={"New Arrival"} link={"/new-arrival"} />
                <ProductGrid products={bestseller} title={"top sales products "} link={"/top-selling-products"} />

                <ContactStyling />
            </Layout>


            {/* <Layout> */}
            {/* <Banner Slider1={Sliderimage} title={""} button={"shop product"}/> */}
            {/* <ThreeBanner /> */}
            {/* <FeaturedCategories /> */}
            {/* <Services /> */}
            {/* <Shop /> */}
            {/* <ContactStyling /> */}
            {/* </Layout> */}
        </>);
}

export default Index;