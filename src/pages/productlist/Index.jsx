import Banner from "@/components/Banner";
import AuthLayout from "../common/AuthLayout";
import Slider1 from "../../Assets/Images/Slider1.png";
import ProductGrid from "@/components/ProductGrid";

function Index() {
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
    return (<>
        <AuthLayout>
            <Banner Slider1={Slider1} />
            <ProductGrid products={sampleProducts} title={"Our Best Seller"}/>
        </AuthLayout>
    </>);
}

export default Index;