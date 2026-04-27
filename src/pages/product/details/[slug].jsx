"use client";
import React, { useEffect, useState } from "react";
import Layout from "../../common/Layout";
import ProductImage from "../../../Assets/Images/ProductDetail.png";
import Image from "next/image";
import { FiTruck } from "react-icons/fi";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { addItem } from "@/redux/cartSlice";
import Related from "../Related";
import { useRouter } from "next/router";
import Listing from "@/pages/api/Listing";
import { EasyZoomOnHover } from "easy-magnify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";

export default function Index() {
  const router = useRouter();
  // console.log("router", router)
  const id = router?.query?.slug;
  const { error, isLoading, Razorpay } = useRazorpay();
  const RAZOPAY_KEY = process.env.NEXT_PUBLIC_RAZOPAY_KEY;
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [open, setOpen] = useState(null);
  const [ProductDetails, setProductDetails] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [zoomData, setZoomData] = useState(null);

  const dispatch = useDispatch();

  const toggle = (id) => {
    setOpen(open === id ? null : id);
  };

  const increaseQty = () => {
    setQty((prev) => {
      const maxStock = selectedVariant?.stock ?? 0;
      return prev < maxStock ? prev + 1 : prev;
    });
  };
  const decreaseQty = () => setQty((prev) => (prev > 1 ? prev - 1 : 1));

  const fetchData = async (id) => {
    try {
      const main = new Listing();
      const response = await main.GetAllProductsId(id);
      // console.log("response", response)
      if (response.data?.status) {
        setProductDetails(response.data?.data);
      } else {
        setProductDetails(null);
      }
    } catch (error) {
      console.log("Error:", error);
      setProductDetails(null);
    }
  };

  const handleAdd = (redirect) => {
    const id = `${selectedVariant?.color}_${ProductDetails?._id}`;
    const newItem = {
      id: id,
      name: ProductDetails?.title,
      price: ProductDetails?.amount,
      quantity: qty,
      imgUrl: selectedVariant?.images,
      product: ProductDetails,
      selectedVariant: selectedVariant?.color,
    };
    dispatch(addItem(newItem));
    if (redirect) {
      router.push("/checkout");
    }
  };

  useEffect(() => {
    if (id) fetchData(id);
  }, [id]);

  useEffect(() => {
    if (ProductDetails && ProductDetails?.variants?.length) {
      setSelectedVariant(ProductDetails.variants[0]);
    }
  }, [ProductDetails]);

  const goToNext = () => {
    if (currentIndex < selectedVariant?.images.length - 1) {
      setCurrentImage(selectedVariant?.images[currentIndex + 1]);
      setCurrentIndex(currentIndex + 1);
    } else {
      setShow(false);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentImage(selectedVariant?.images[currentIndex - 1]);
      setCurrentIndex(currentIndex - 1);
    } else {
      setShow(false);
    }
  };

  const handleClose = () => setShow(false);

  const handleShow = (item, index) => {
    // console.log("item", item);
    // console.log("index", index);
    setCurrentIndex(index);
    setCurrentImage(item);
    if (!show) {
      setShow(true);
    }
  };


  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const GalleryModal = () => {
    return (
      <div className="fixed inset-0 z-[9999999] bg-black flex items-center justify-center">
        {/* Close button */}
        <div
          onClick={handleClose}
          className="fixed top-2.5 right-2.5 sm:top-7 sm:right-7 cursor-pointer text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-10 h-10"
            fill="currentColor"
          >
            <path d="m6.4 18.308l-.708-.708l5.6-5.6l-5.6-5.6l.708-.708l5.6 5.6l5.6-5.6l.708.708l-5.6 5.6l5.6 5.6l-.708.708l-5.6-5.6z" />
          </svg>
        </div>

        {/* Image carousel wrapper */}
        <div className="flex items-center justify-center w-full h-full px-4">
          {/* Previous */}
          <button
            onClick={goToPrevious}
            className="text-white p-2 hover:bg-white/10 rounded-full transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          {/* Image */}
          <img
            src={currentImage || ""}
            alt="image"
            className="max-h-full max-w-full object-contain mx-4"
          />

          {/* Next */}
          <button
            onClick={goToNext}
            className="text-white p-2 hover:bg-white/10 rounded-full transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const ZoomImage = ({ src, onZoom }) => {
    const LENS_SIZE = 120;

    const handleMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();

      let x = e.clientX - rect.left - LENS_SIZE / 2;
      let y = e.clientY - rect.top - LENS_SIZE / 2;

      x = Math.max(0, Math.min(x, rect.width - LENS_SIZE));
      y = Math.max(0, Math.min(y, rect.height - LENS_SIZE));

      onZoom({
        show: true,
        src,
        bgX: (x / (rect.width - LENS_SIZE)) * 100,
        bgY: (y / (rect.height - LENS_SIZE)) * 100,
      });
    };

    return (
      <div
        className="relative w-full h-full cursor-crosshair"
        onMouseMove={handleMove}
      // Note: No onMouseLeave here anymore
      >
        <Image src={src} fill className="object-cover" alt="product" />
      </div>
    );
  };

  const ZoomPreview = ({ zoom }) => {
    // If zoom is null OR show is false, hide the component
    if (!zoom || zoom.show === false) return null;

    return (
      <div
        className="fixed top-24 right-24 w-full max-w-[40vw] h-[520px] bg-white border rounded-lg shadow-2xl
        z-[999999] hidden lg:block pointer-events-none"
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url(${zoom.src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "250%",
            backgroundPosition: `${zoom.bgX}% ${zoom.bgY}%`,
          }}
        />
      </div>
    );
  };

  return (
    <Layout>
      <div className="w-full md:py-14 flex flex-col justify-center"
        onHover={() => setZoomData(null)} // <--- KILL SWITCH HERE
      >
        <div className="w-full container max-w-[1350px] mx-auto px-6 xl:px-0 py-3">
          <div className="bg-white">
            <p className="text-base text-[#4D5466] tracking-widest mb-6  uppercase">
              <span className="text-[#171717]">
                {ProductDetails?.category?.name}{" "}
              </span>
              | {ProductDetails?.subcategory?.name}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

              {/* ================= LEFT: IMAGES ================= */}
              <div className="flex flex-col md:flex-row gap-4 w-full">

                {/* 🖼️ MAIN IMAGE */}
                <div className="order-1 md:order-2 flex-1 w-full md:max-w-[500px]">
                  <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
                    {isMobile ? (
                      <img
                        src={selectedVariant?.images?.[currentIndex]}
                        alt="Product"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <EasyZoomOnHover
                        key={currentIndex}
                        mainImage={{
                          src: selectedVariant?.images?.[currentIndex],
                          alt: "Product Image",
                          width: 500,
                          height: 625,
                        }}
                        zoomImage={{
                          src: selectedVariant?.images?.[currentIndex],
                          alt: "Zoom Image",
                        }}
                        zoomContainerWidth={520}
                        zoomContainerHeight={520}
                        zoomLensScale={3}
                        distance={16}
                      />
                    )}
                  </div>
                </div>

                {/* 📱💻 THUMBNAILS */}
                <div className="order-2 md:order-1 w-full md:w-[80px]">

                  <Swiper
                    direction="horizontal"
                    breakpoints={{
                      768: {
                        direction: "vertical",
                        slidesPerView: 5,
                      },
                    }}
                    slidesPerView={4}
                    spaceBetween={8}
                    modules={[Thumbs]}
                    className="w-full md:h-[500px]"
                  >
                    {selectedVariant?.images?.map((img, index) => (
                      <SwiperSlide
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className="cursor-pointer"
                      >
                        <div
                          className={`relative aspect-square rounded-md overflow-hidden border
              ${currentIndex === index
                              ? "border-black"
                              : "border-gray-300"
                            }`}
                        >
                          <Image
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                </div>
              </div>

              {/* ================= RIGHT: DETAILS ================= */}
              <div className="relative z-10">

                <h1 className="text-xl md:text-2xl font-black uppercase mt-2">
                  {ProductDetails?.title}
                </h1>

                <p className="text-[#4D5466] text-base md:text-lg mt-3 md:mt-4">
                  {ProductDetails?.description}
                </p>

                <h2 className="text-2xl md:text-3xl font-bold mt-4 md:mt-6">
                  ₹{ProductDetails?.amount}
                </h2>

                <p className="text-sm md:text-base text-[#4D5466] mt-2">
                  Deliver in approximately 8–12 days
                </p>

                {/* 🎨 Variants */}
                {ProductDetails?.variants?.length > 0 && (
                  <div className="mt-5 md:mt-6">
                    <p className="text-sm text-[#4D5466] mb-3">
                      Colour:{" "}
                      <span className="capitalize text-black">
                        {selectedVariant?.color}
                      </span>
                    </p>

                    <div className="flex gap-3 md:gap-4 flex-wrap">
                      {ProductDetails?.variants?.map((variant, idx) => {
                        const isActive =
                          selectedVariant?.color === variant.color;

                        return (
                          <div
                            key={idx}
                            onClick={() => setSelectedVariant(variant)}
                            className={`w-[90px] md:w-[110px] border rounded-md p-2 cursor-pointer
                ${isActive
                                ? "border-black"
                                : "border-gray-200"
                              }`}
                          >
                            <div className="w-full aspect-square relative rounded overflow-hidden">
                              <Image
                                src={variant.images?.[0]}
                                alt={variant?.color}
                                fill
                                className="object-cover"
                              />
                            </div>

                            <p className="mt-2 text-center text-xs md:text-sm capitalize">
                              {variant?.color}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 🛒 Buttons */}
                <div className="mt-6 flex flex-col gap-3 w-full">

                  <div className="flex gap-3 w-full">
                    {/* Qty */}
                    <div className="w-24 border border-black rounded-md px-2 py-2 flex items-center justify-between">
                      <button onClick={decreaseQty}>−</button>
                      <span>{qty}</span>
                      <button onClick={increaseQty}>+</button>
                    </div>

                    {/* Add */}
                    <button
                      className="flex-1 border border-black py-3 rounded-md"
                      onClick={() => handleAdd(false)}
                    >
                      ADD TO CART
                    </button>
                  </div>

                  <button
                    className="w-full bg-black text-white py-3 rounded-md"
                    onClick={() => handleAdd(true)}
                  >
                    BUY IT NOW
                  </button>
                </div>

              </div>
            </div>
          </div>
          <Related selectedId={ProductDetails?.subcategory?._id} />
        </div>
      </div>
      {show && <GalleryModal />}
      <ZoomPreview zoom={zoomData} />
    </Layout>
  );
}
