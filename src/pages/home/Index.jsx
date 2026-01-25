import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import Servcies from "./Services";
import ProductGrid from "@/components/ProductGrid";
import DesignConcept from "./DesignConcept";
import ContactStyling from "../common/ContactStyling";
import SliderWithFade from "./Achivement";
import Slider from "./Slider";
import Sliderimage from "../../Assets/Images/seller.png";
import Sliderimage1 from "../../Assets/Images/seller2.png";
import Sliderimage2 from "../../Assets/Images/seller3.jpg";
import Sliderimage3 from "../../Assets/Images/seller4.jpg";
import About from "./About";
import Slider2 from "./Slider2";
import Listing from "../api/Listing";


function Index() {

  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);
    const [bestseller, setbestseller] = useState("")


    const fetchData = async () => {
        try {
            const main = new Listing();
            const response = await main.GetBestSeller();
            console.log("response", response)
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
    <>
      <Slider />
      <Servcies />
      <ProductGrid products={bestseller} link={"best-seller"}/>
      <DesignConcept />
      <About/>
      <ContactStyling />
      <Slider2/>
      {/* <SliderWithFade /> */}
    </>
  );
}

export default Index;
