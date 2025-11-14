import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
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


function Index() {

  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

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
      <Slider />
      <Servcies />
      <ProductGrid products={sampleProducts} />
      <DesignConcept />
      <About/>
      <ContactStyling />
      <Slider2/>
      {/* <SliderWithFade /> */}
    </>
  );
}

export default Index;
