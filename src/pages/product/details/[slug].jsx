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
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/thumbs";

export default function Index() {
  const router = useRouter();
  // console.log("router", router)
  const id = router?.query?.slug;
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [open, setOpen] = useState(null);
  const [ProductDetails, setProductDetails] = useState(null);
  const dispatch = useDispatch();

  const toggle = (id) => {
    setOpen(open === id ? null : id);
  };

  const increaseQty = () => setQty((prev) => prev + 1);

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

  // console.log("ProductDetails", ProductDetails);
  return (
    <Layout>
      <div className="w-full py-14 flex flex-col justify-center">
        <div className="w-full max-w-[1350px] mx-auto px-6 xl:px-0 py-3">
          <div className="bg-white">
            <p className="text-base text-[#4D5466] tracking-widest mb-6  uppercase">
              <span className="text-[#171717]">
                {ProductDetails?.category?.name}{" "}
              </span>
              | {ProductDetails?.subcategory?.name}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left */}
              <div className="w-full">
                {/* MAIN IMAGE */}
                <div className="w-full aspect-[4/5] relative rounded-lg overflow-hidden">
                  <Swiper
                    autoplay={{
                      delay: 2500,
                      disableOnInteraction: false,
                    }}
                    navigation
                    thumbs={{ swiper: thumbsSwiper }}
                    modules={[Autoplay, Navigation, Thumbs]}
                    className="w-full h-full"
                  >
                    {selectedVariant?.images?.map((img, index) => (
                      <SwiperSlide key={index}>
                        <div className="w-full h-full relative">
                          <Image
                            src={img}
                            alt={`Product image ${index + 1}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* THUMBNAILS */}
                <div className="mt-3">
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    slidesPerView={5}
                    spaceBetween={10}
                    watchSlidesProgress
                    modules={[Thumbs]}
                    className="w-full"
                  >
                    {selectedVariant?.images &&
                      selectedVariant?.images?.map((img, index) => (
                        <SwiperSlide key={index} className="cursor-pointer">
                          <div className="aspect-square relative rounded-md overflow-hidden border border-gray-200 hover:border-black">
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

              {/* Right */}
              <div>
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
                    ${
                      isActive
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
    </Layout>
  );
}
