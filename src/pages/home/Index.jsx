import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import Button from '../common/Button';
import Servcies from './Services';
import ProductGrid from '@/components/ProductGrid';
import DesignConcept from './DesignConcept';
import ContactStyling from '../common/ContactStyling';
import SliderWithFade from './Achivement';
function Index() {
    const slides = [
        {
            front: "https://cadmaxpro-buket.s3.ap-south-1.amazonaws.com/assets/services/LANDMARK-001.jpg",
        },
        {
            front: "https://cadmaxpro-buket.s3.ap-south-1.amazonaws.com/assets/home/addnew.jpg",
        },
        {
            front: "https://cadmaxpro-buket.s3.ap-south-1.amazonaws.com/assets/services/ServicesPhoto.jpg",
        },
        {
            front: "https://cadmaxpro-buket.s3.ap-south-1.amazonaws.com/assets/work/Cadmax.jpg",
        },


    ]
    useEffect(() => {
        AOS.init();
        AOS.refresh();
    }, []);

    const sampleProducts = [
        {
            id: 1,
            title: "BELMONT DEEP-SEAT CONTEMPORARY SOFA",
            price: "₹68,500",
            image: "https://images.unsplash.com/photo-1549187774-b4e9f04428b0?auto=format&fit=crop&w=1200&q=60",
        },
        {
            id: 2,
            title: "MONARCH BRUSHED-BRASS ARCHED FLOOR LAMP",
            price: "₹22,300",
            image: "https://images.unsplash.com/photo-1505691723518-36a3f3b0bd8b?auto=format&fit=crop&w=1200&q=60",
        },
        {
            id: 3,
            title: "HERITAGE HANDWOVEN TEXTURED UPHOLSTERY CUSHION SET",
            price: "₹35,750",
            image: "https://images.unsplash.com/photo-1598300054635-9b3a2c2a7f5d?auto=format&fit=crop&w=1200&q=60",
        },
        {
            id: 4,
            title: "AURELUM LARGE-FORM SCULPTED CERAMIC CENTERPIECE VASE",
            price: "₹85,000",
            image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=60",
        },
    ];
    return (<>

        <div className="relative h-[425px] md:h-[560px] lg:h-[860px] md:mt-[-150px]">
            <Swiper
                slidesPerView={1}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                loop={true}
                breakpoints={{
                    300: { slidesPerView: 1 },
                    480: { slidesPerView: 1 },
                    768: { slidesPerView: 1 },
                    1024: { slidesPerView: 1 },
                }}
                modules={[Autoplay]}
                className="w-full h-full"
            >
                {slides?.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative w-full h-full">
                            <img
                                src={slide.front}
                                alt="Slide"
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-black/50"></div>

                            {/* Overlay content centered */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center w-full m-auto px-[15px] text-center">
                                <h1
                                    className="
      font-[900]
      text-[20px] 
      md:text-[22px] 
      lg:text-[25px]
      text-white 
      uppercase 
      leading-[100%]
      tracking-[-0.02em]
      max-w-[700px]
    "

                                >
                                    Elevate Every Room with Built-to-Last Furniture and End-to-End Interior Design
                                </h1>

                                <div className="flex flex-wrap justify-center gap-[15px] mt-[20px]">
                                    <Button title={"Shop product"} classes={"bg-white text-[#171717]"} />
                                    <Button title={"Request concept"} classes={"bg-transparent text-white border border-white"} />
                                </div>
                            </div>


                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>


        <Servcies />

        <ProductGrid products={sampleProducts} />
        <DesignConcept />
        <ContactStyling />
        <SliderWithFade />
    </>);
}

export default Index;