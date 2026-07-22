import Head from "next/head";
import ProductGrid from "@/components/ProductGrid";
import Layout from "../common/Layout";
import ContactStyling from "../common/ContactStyling";
import FeaturedCategories from "./CategoryCard";
import ProductListBanner from "../../Assets/Images/desgin001.jpeg";
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
            <Head>
                <title>
                    Luxury Furniture Store in Jaipur | Custom Furniture | CADMAX Atelier
                </title>

                <meta
                    name="description"
                    content="Discover handcrafted luxury furniture in Jaipur by CADMAX Atelier. We design custom furniture for residential, commercial, hospitality, and luxury interior projects."
                />

                <meta
                    name="keywords"
                    content="Luxury Furniture Jaipur, Custom Furniture Jaipur, Bespoke Furniture, Premium Furniture, Interior Design Jaipur, Residential Furniture, Commercial Furniture, Hospitality Furniture, Luxury Interiors, Modular Furniture, Designer Furniture, CADMAX Atelier"
                />

                <meta name="robots" content="index, follow" />

                <link
                    rel="canonical"
                    href="https://cadmaxatelier.com/product"
                />

                {/* Open Graph */}
                <meta
                    property="og:title"
                    content="Luxury Furniture Store in Jaipur | CADMAX Atelier"
                />

                <meta
                    property="og:description"
                    content="Discover handcrafted luxury furniture in Jaipur for residential, commercial, hospitality and luxury interior projects."
                />

                <meta
                    property="og:url"
                    content="https://cadmaxatelier.com/product"
                />

                <meta property="og:type" content="website" />

                <meta
                    property="og:image"
                    content="https://cadmaxatelier.com/logo.png"
                />

                {/* Twitter */}
                <meta
                    name="twitter:card"
                    content="summary_large_image"
                />

                <meta
                    name="twitter:title"
                    content="Luxury Furniture Store in Jaipur | CADMAX Atelier"
                />

                <meta
                    name="twitter:description"
                    content="Discover handcrafted luxury furniture in Jaipur by CADMAX Atelier."
                />

                <meta
                    name="twitter:image"
                    content="https://cadmaxatelier.com/logo.png"
                />
            </Head>
            {/* SEO H1 */}
            <h1
                style={{
                    position: "absolute",
                    width: "1px",
                    height: "1px",
                    padding: 0,
                    margin: "-1px",
                    overflow: "hidden",
                    clip: "rect(0, 0, 0, 0)",
                    whiteSpace: "nowrap",
                    border: 0,
                }}
            >
                Luxury Furniture & Bespoke Interior Solutions in Jaipur
            </h1>
            <Layout>
                {/* <ThreeBanner /> */}

                <Banner
                    Slider1={ProductListBanner}
                    title={"Discover Luxury Furniture Crafted for Modern Living"}
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