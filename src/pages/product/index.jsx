import ProductGrid from "@/components/ProductGrid";
import Layout from "../common/Layout";
import Sliderimage from "../../Assets/Images/seller.png";
import Sliderimage1 from "../../Assets/Images/seller2.png";
import Sliderimage2 from "../../Assets/Images/seller3.jpg";
import Sliderimage3 from "../../Assets/Images/seller4.jpg";
import Shop from "./Shop";
import ContactStyling from "../common/ContactStyling";
import FeaturedCategories from "./CategoryCard";
import ThreeBanner from "./ThreeBanner";
function Index() {
    const sampleOfferProducts = [
        {
            id: 1,
            title: "BELMONT DEEP-SEAT CONTEMPORARY SOFA",
            price: "₹68,500",
            image: Sliderimage2?.src,
            offer: "20% off"
        },
        {
            id: 2,
            title: "MONARCH BRUSHED-BRASS ARCHED FLOOR LAMP",
            price: "₹22,300",
            image: Sliderimage?.src
            ,
            offer: "20% off"
        },
        {
            id: 3,
            title: "HERITAGE HANDWOVEN TEXTURED UPHOLSTERY CUSHION SET",
            price: "₹35,750",
            image: Sliderimage1?.src,
            offer: "20% off"
        },
        {
            id: 4,
            title: "AURELUM LARGE-FORM SCULPTED CERAMIC CENTERPIECE VASE",
            price: "₹85,000",
            image: Sliderimage3?.src,
            offer: "20% off"
        },
    ];
    const sampleProducts = [
        {
            id: 1,
            title: "BELMONT DEEP-SEAT CONTEMPORARY SOFA",
            price: "₹68,500",
            image: Sliderimage2?.src

        },
        {
            id: 2,
            title: "MONARCH BRUSHED-BRASS ARCHED FLOOR LAMP",
            price: "₹22,300",
            image: Sliderimage?.src
            ,
        },
        {
            id: 3,
            title: "HERITAGE HANDWOVEN TEXTURED UPHOLSTERY CUSHION SET",
            price: "₹35,750",
            image: Sliderimage1?.src
        },
        {
            id: 4,
            title: "AURELUM LARGE-FORM SCULPTED CERAMIC CENTERPIECE VASE",
            price: "₹85,000",
            image: Sliderimage3?.src

        },
    ];
    return (
        <>
            <Layout>
                {/* <Banner Slider1={Sliderimage} title={""} button={"shop product"}/> */}
                <ThreeBanner />
                <FeaturedCategories/>
                <ProductGrid products={sampleProducts} title={"OUR BEST SELLER"} />
                <ProductGrid products={sampleProducts} title={"New Arrival"} />
                <Shop />
                <ProductGrid products={sampleOfferProducts} title={"top sales products "} />
                <ContactStyling />

            </Layout>
        </>);
}

export default Index;