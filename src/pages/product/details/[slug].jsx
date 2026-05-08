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
import toast from "react-hot-toast";

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
      const newQty = prev < maxStock ? prev + 1 : prev;

      handleQtyChange(newQty); // ✅ direct new qty

      return newQty;
    });
  };

  const decreaseQty = () => {
    setQty((prev) => {
      const newQty = prev > 1 ? prev - 1 : 1;

      handleQtyChange(newQty); // ✅ direct new qty

      return newQty;
    });
  };


  const handleQtyChange = async (quantity) => {
    try {
      const main = new Listing();

      const response = await main.UpdateTocart({
        productId: ProductDetails?._id,
        variant: selectedVariant?.color,
        quantity: quantity, // ✅ direct final qty
      });

      if (response?.data?.status) {
        toast.success(response.data.message);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update quantity"
      );
    }
  };



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

    // ✅ backend ke liye clean payload
    HadleAddtocart({
      productId: ProductDetails?._id,
      quantity: qty,
      variant: selectedVariant?.color
    });

    dispatch(addItem(newItem));

    if (redirect) {
      router.push("/checkout");
    }
  };

  const HadleAddtocart = async (cartData) => {
    try {
      const main = new Listing();

      const response = await main.AddTocart(cartData); // 👈 full object

      if (response?.data) {
        toast.success(response.data.message);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to add to cart"
      );
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

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              <div className="block md:hidden w-full">
                <Swiper
                  slidesPerView={4}
                  spaceBetween={10}
                  className="w-full"
                >
                  {selectedVariant?.images?.map((img, index) => (
                    <SwiperSlide key={index}>
                      <div
                        onClick={() => setCurrentIndex(index)}
                        className={`relative aspect-square rounded-md overflow-hidden border cursor-pointer
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
                <div className="flex-1 w-full md:max-w-[500px] mt-5 mb-3">
                  <img
                    src={selectedVariant?.images?.[currentIndex]}
                    alt="Product"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              </div>

              <div className="hidden  md:flex   gap-4 w-full">

                <div className="w-[80px]">
                  <Swiper
                    direction="vertical"
                    slidesPerView={5}
                    spaceBetween={10}
                    watchSlidesProgress
                    onSwiper={setThumbsSwiper}
                    modules={[Thumbs]}
                    className="h-[500px]"
                  >
                    {selectedVariant?.images && selectedVariant?.images?.map((img, index) => (
                      <SwiperSlide
                        key={index}
                        className="cursor-pointer"
                        onMouseEnter={() => setCurrentIndex(index)}
                        onClick={() => setCurrentIndex(index)}
                      >
                        <div
                          className={`relative aspect-square rounded-md overflow-hidden border
                            ${currentIndex === index
                              ? "border-black"
                              : "border-gray-300 hover:border-black"
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

                <div className="flex-1 w-full md:max-w-[500px]">
                  <div className="relative aspect-[4/5] z-50 rounded-lg overflow-visible">
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
                      />)}

                  </div>
                </div>

              </div>

              {/* Right */}
              <div className="relative z-10">
                <h1 className="text-2xl text-[#171717] font-black Creato mt-2 uppercase">
                  {ProductDetails?.title}
                </h1>

                <p className="text-[#4D5466] text-lg font-medium mt-4 Creato">
                  {ProductDetails?.description}
                </p>

                <h2 className="text-3xl text-[#171717] font-bold mt-6 Creato">
                  ₹{ProductDetails?.amount}
                </h2>

                <p className="text-base font-medium text-[#4D5466] mt-2 Creato">
                  Deliver in approximately 8–12 days
                </p>

                {/* Color Variants */}
                {ProductDetails?.variants?.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-[#4D5466] mb-3">
                      Colour:{" "}
                      <span className="capitalize text-[#171717]">
                        {selectedVariant?.color}
                      </span>
                    </p>

                    <div className="flex gap-4">
                      {ProductDetails &&
                        ProductDetails.variants &&
                        ProductDetails?.variants?.map((variant, idx) => {
                          const isActive =
                            selectedVariant?.color === variant.color;

                          return (
                            <div
                              key={idx}
                              onClick={() => setSelectedVariant(variant)}
                              className={`w-[110px] border rounded-md p-2 cursor-pointer transition
                    ${isActive
                                  ? "border-black"
                                  : "border-gray-200 hover:border-gray-400"
                                }
                  `}
                            >
                              {/* Image */}
                              <div className="w-full aspect-square relative rounded overflow-hidden">
                                <Image
                                  src={variant.images?.[0]}
                                  alt={variant?.color}
                                  fill
                                  className="object-cover"
                                />
                              </div>

                              {/* Color label */}
                              <p className="mt-2 text-center text-sm font-medium capitalize">
                                {variant?.color}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="mt-6 flex flex-col gap-3 w-full">
                  {/* Row 1: Qty + Add to Cart */}
                  <div className="flex gap-3 w-full">
                    {/* Quantity */}
                    <div className="w-24 border border-black rounded-md px-2 py-2 flex items-center justify-between">
                      <button
                        onClick={decreaseQty}
                        className="w-6 h-6 flex items-center justify-center text-lg hover:bg-gray-100 rounded cursor-pointer"
                      >
                        −
                      </button>

                      <span className="text-md font-medium">{qty}</span>

                      <button
                        onClick={increaseQty}
                        className="w-6 h-6 flex items-center justify-center text-lg hover:bg-gray-100 rounded cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Cart */}
                    <button
                      className="flex-1 border border-black py-3 font-medium rounded-md hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        handleAdd(false);
                      }}
                    >
                      ADD TO CART
                    </button>
                  </div>

                  {/* Row 2: Buy Now */}
                  <button
                    className="w-full bg-black text-white py-3 font-medium rounded-md hover:bg-gray-800 cursor-pointer"
                    onClick={() => {
                      handleAdd(true);
                    }}
                  >
                    BUY IT NOW
                  </button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8 text-base text-[#4D5466] Creato">
                  <div className="flex items-center gap-3">
                    <span className="text-[#000000]">
                      <FiTruck size={22} />
                    </span>
                    <p className="font-medium">
                      Complimentary Delivery & Setup <br /> Above ₹20000{" "}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#000000]">
                      <FiTruck size={22} />
                    </span>
                    <p className="font-medium">
                      Complimentary Styling Services
                    </p>{" "}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#000000]">
                      <FiTruck size={22} />
                    </span>
                    <p className="font-medium">
                      Quality Assured Warranty Coverage
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#000000]">
                      <FiTruck size={22} />
                    </span>
                    <p className="font-medium">Fast Local Service Support</p>{" "}
                  </div>
                </div>

                {/* Accordion Sections */}
                <div className="mt-10">
                  {/* 1. Dimensions */}
                  <div
                    className="border-t border-gray-200 py-4 cursor-pointer"
                    onClick={() => toggle(1)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-[#171717] uppercase">
                        Dimensions
                      </span>
                      {open === 1 ? (
                        <FaMinus size={20} />
                      ) : (
                        <FaPlus size={20} />
                      )}
                    </div>

                    {open === 1 && (
                      <p className="mt-3 text-[#4D5466] font-medium Creato text-lg leading-6">
                        {ProductDetails?.dimensions}
                      </p>
                    )}
                  </div>

                  {/* 2. Materials & Features */}
                  <div
                    className="border-t border-gray-200 py-4 cursor-pointer"
                    onClick={() => toggle(2)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-[#171717] uppercase">
                        Materials & Features
                      </span>
                      {open === 2 ? (
                        <FaMinus size={20} />
                      ) : (
                        <FaPlus size={20} />
                      )}
                    </div>

                    {open === 2 && (
                      <p className="mt-3 text-[#4D5466] font-medium Creato text-lg leading-6">
                        {ProductDetails?.material}
                      </p>
                    )}
                  </div>

                  {/* 3. Product Care */}
                  <div
                    className="border-t border-gray-200 py-4 cursor-pointer"
                    onClick={() => toggle(3)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-[#171717] uppercase">
                        Product Care
                      </span>
                      {open === 3 ? (
                        <FaMinus size={20} />
                      ) : (
                        <FaPlus size={20} />
                      )}
                    </div>

                    {open === 3 && (
                      <p className="mt-3 text-[#4D5466] font-medium Creato text-lg leading-6">
                        {ProductDetails?.type}
                      </p>
                    )}
                  </div>

                  {/* 4. Terms & Conditions */}
                  <div
                    className="border-t border-gray-200 py-4 cursor-pointer"
                    onClick={() => toggle(4)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-[#171717] uppercase">
                        Terms & Conditions
                      </span>
                      {open === 4 ? (
                        <FaMinus size={20} />
                      ) : (
                        <FaPlus size={20} />
                      )}
                    </div>

                    {open === 4 && (
                      <p className="mt-3 text-[#4D5466] font-medium Creato text-lg leading-6">
                        {ProductDetails?.terms}
                      </p>
                    )}
                  </div>
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