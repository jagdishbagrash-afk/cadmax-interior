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
import Slider from "./Slider";
import Slider2 from "./Slider2";
import Listing from "../api/Listing";
import About from "./About";


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
      {/* <ProductGrid products={bestseller}  link={"/best-seller"} /> */}
      <DesignConcept />
      <About />
      <ContactStyling />
      <Slider2 />
      {/* <SliderWithFade /> */}
    </>
  );
}

export default Index;
