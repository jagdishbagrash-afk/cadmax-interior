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
      image:
        "https://images.unsplash.com/photo-1549187774-b4e9f04428b0?auto=format&fit=crop&w=1200&q=60",
    },
    {
      id: 2,
      title: "MONARCH BRUSHED-BRASS ARCHED FLOOR LAMP",
      price: "₹22,300",
      image:
        "https://images.unsplash.com/photo-1505691723518-36a3f3b0bd8b?auto=format&fit=crop&w=1200&q=60",
    },
    {
      id: 3,
      title: "HERITAGE HANDWOVEN TEXTURED UPHOLSTERY CUSHION SET",
      price: "₹35,750",
      image:
        "https://images.unsplash.com/photo-1598300054635-9b3a2c2a7f5d?auto=format&fit=crop&w=1200&q=60",
    },
    {
      id: 4,
      title: "AURELUM LARGE-FORM SCULPTED CERAMIC CENTERPIECE VASE",
      price: "₹85,000",
      image:
        "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=60",
    },
  ];

  return (
    <>
      <Slider/>
      <Servcies />
      <ProductGrid products={sampleProducts} />
      <DesignConcept />
      <ContactStyling />
      <SliderWithFade />
    </>
  );
}

export default Index;
