import Banner from "@/components/Banner";
import ProductListBanner from "../../Assets/Images/ProductListBanner.png";
import Layout from "../common/Layout";

export default function Index() {
    return (
        <Layout>
            <Banner Slider1={ProductListBanner}
                title={"From Blueprint to Reality — Complete Interior Design & Execution"}
                button={"SHOP OUR FURNITURE"} />
        </Layout>
    );
}