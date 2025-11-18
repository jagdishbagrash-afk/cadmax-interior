import Banner from "@/components/Banner";
import ProductListBanner from "../../Assets/Images/ProductListBanner.png";
import Layout from "../common/Layout";
import ProductGrid from "./ProductGrid.jsx";

function Index() {
    return (
        <Layout>
            <Banner Slider1={ProductListBanner} 
            title={"From Blueprint to Reality — Complete AND LUXURY FURNITURE"} 
            button={"SHOP OUR FURNITURE"}/>
            <ProductGrid/>
        </Layout>
    );
}

export default Index;