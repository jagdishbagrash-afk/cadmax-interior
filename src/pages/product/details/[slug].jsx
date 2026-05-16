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
// Remove EasyZoomOnHover import since it's not working properly
// import { EasyZoomOnHover } from "easy-magnify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import toast from "react-hot-toast";
import { useRole } from "@/context/RoleContext";

// Custom Zoom Component - Fixed version
const CustomZoomOnHover = ({ imageSrc, alt, zoomScale = 2.5 }) => {
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0, show: false });
  const imageRef = React.useRef(null);
  const containerRef = React.useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({
      x: Math.min(Math.max(x, 0), 100),
      y: Math.min(Math.max(y, 0), 100),
      show: true
    });
  };

  const handleMouseLeave = () => {
    setZoomPosition({ ...zoomPosition, show: false });
  };

  return (
    <div className="relative w-full" ref={containerRef}>
  <div
  className="relative w-full h-full min-h-full cursor-crosshair flex items-center justify-center"
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
>
  <img
    src={imageSrc}
    alt={alt}
    className="w-full h-full object-contain"
  />
</div>

      {/* Zoom Lens Effect */}
      {/* {zoomPosition.show && (
        <div
          className="hidden lg:block fixed pointer-events-none z-[1000] w-[120px] h-[120px] rounded-full border-2 border-white shadow-lg"
          style={{
            left: `${zoomPosition.x}%`,
            top: `${zoomPosition.y}%`,
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(1px)',
          }}
        />
      )} */}

      {/* Zoom Preview Window */}
      {zoomPosition.show && (
        <div
          className="fixed top-24 right-80 w-[450px] h-[550px] bg-white border rounded-lg shadow-2xl z-[99999] hidden lg:block overflow-hidden"
        >
          <div
            className="w-full h-full bg-no-repeat"
            style={{
              backgroundImage: `url(${imageSrc})`,
              backgroundSize: `${zoomScale * 100}%`,
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#f5f5f5'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default function Index() {
  const router = useRouter();
  const { user, setUser } = useRole();

  console.log("user", user)

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

  const dispatch = useDispatch();

  const toggle = (id) => {
    setOpen(open === id ? null : id);
  };

  const increaseQty = () => {
    setQty((prev) => {
      const maxStock = selectedVariant?.stock ?? 0;
      const newQty = prev < maxStock ? prev + 1 : prev;
      handleQtyChange(newQty);
      return newQty;
    });
  };

  const decreaseQty = () => {
    setQty((prev) => {
      const newQty = prev > 1 ? prev - 1 : 1;
      handleQtyChange(newQty);
      return newQty;
    });
  };

  const handleQtyChange = async (quantity) => {
    try {
      const main = new Listing();
      const response = await main.UpdateTocart({
        productId: ProductDetails?._id,
        variant: selectedVariant?.color,
        quantity: quantity,
      });
      if (response?.data?.status) {
        toast.success(response.data.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update quantity");
    }
  };

  const fetchData = async (id) => {
    try {
      const main = new Listing();
      const response = await main.GetAllProductsId(id);
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

  const handleAdd = () => {
    if (!user || user?.role !== "customer") {
      router.push("/login");
      return;
    }
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }
    const id = `${selectedVariant?.color}_${ProductDetails?._id}`;
    const newItem = {
      id,
      name: ProductDetails?.title,
      price: ProductDetails?.amount,
      quantity: qty,
      imgUrl: selectedVariant?.images?.[0],
      product: ProductDetails,
      selectedVariant: selectedVariant?.color,
    };
    HadleAddtocart({
      productId: ProductDetails?._id,
      quantity: qty,
      variant: selectedVariant?.color,
    });
    dispatch(addItem(newItem));
    toast.success("Item added to cart");
  };

  const handlecheckoutAdd = (redirect) => {
    if (!user || user?.role !== "customer") {
      router.push("/login");
      return;
    }
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }
    const id = `${selectedVariant?.color}_${ProductDetails?._id}`;
    const newItem = {
      id,
      name: ProductDetails?.title,
      price: ProductDetails?.amount,
      quantity: qty,
      imgUrl: selectedVariant?.images?.[0],
      product: ProductDetails,
      selectedVariant: selectedVariant?.color,
    };
    HadleAddtocart({
      productId: ProductDetails?._id,
      quantity: qty,
      variant: selectedVariant?.color,
    });
    dispatch(addItem(newItem));
    toast.success("Item added to cart");
    router.push("/checkout");
  };

  const HadleAddtocart = async (cartData) => {
    try {
      const main = new Listing();
      const response = await main.AddTocart(cartData);
      if (response?.data) {
        toast.success(response.data.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add to cart");
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
    setCurrentIndex(index);
    setCurrentImage(item);
    if (!show) {
      setShow(true);
    }
  };

  const GalleryModal = () => {
    return (
      <div className="fixed inset-0 z-[9999999] bg-black flex items-center justify-center">
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
        <div className="flex items-center justify-center w-full h-full px-4">
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
          <img
            src={currentImage || ""}
            alt="image"
            className="max-h-full max-w-full object-contain mx-4"
          />
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

  return (
    <Layout>
      <div className="w-full md:py-14 flex flex-col justify-center">
        <div className="w-full container max-w-[1350px] mx-auto px-6 xl:px-0 py-3">
          <div className="bg-white">
            <p className="text-base text-[#4D5466] tracking-widest mb-6 uppercase">
              <span className="text-[#171717]">
                {ProductDetails?.category?.name}{" "}
              </span>
              | {ProductDetails?.subcategory?.name}
            </p>

            <div className="flex flex-col lg:flex-row gap-8 xl:gap-14 w-full">

              {/* LEFT SIDE - PRODUCT GALLERY */}
              <div className="w-full lg:w-[62%]">

                {/* MOBILE VIEW */}
                <div className="block md:hidden">

                  {/* MAIN IMAGE */}
                  <div className="w-full rounded-2xl overflow-hidden bg-[#F7F7F7]">
                    <div className="relative w-full aspect-[4/5] flex items-center justify-center p-4">
                      <img
                        src={selectedVariant?.images?.[currentIndex]}
                        alt="Product"
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>
                  </div>

                  {/* THUMBNAILS */}
                  <Swiper
                    slidesPerView={4}
                    spaceBetween={12}
                    className="w-full mt-4"
                  >
                    {selectedVariant?.images?.map((img, index) => (
                      <SwiperSlide key={index}>
                        <div
                          onClick={() => setCurrentIndex(index)}
                          className={`
                relative aspect-square rounded-xl overflow-hidden 
                border-2 cursor-pointer bg-[#F7F7F7]
                transition-all duration-300
                ${currentIndex === index
                              ? "border-black"
                              : "border-gray-200"
                            }
              `}
                        >
                          <Image
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* DESKTOP VIEW */}
                <div className="hidden md:flex gap-5">

                  {/* THUMBNAILS */}
                  <div className="w-[90px] shrink-0">
                    <Swiper
                      direction="vertical"
                      slidesPerView={5}
                      spaceBetween={14}
                      watchSlidesProgress
                      onSwiper={setThumbsSwiper}
                      modules={[Thumbs]}
                      className="h-[720px]"
                    >
                      {selectedVariant?.images?.map((img, index) => (
                        <SwiperSlide
                          key={index}
                          onMouseEnter={() => setCurrentIndex(index)}
                          onClick={() => setCurrentIndex(index)}
                          className="cursor-pointer"
                        >
                          <div
                            className={`
                  relative aspect-square rounded-2xl overflow-hidden
                  transition-all duration-300
                  ${currentIndex === index
                                ? "border-black"
                                : "border-gray-200 hover:border-gray-400"
                              }
                `}
                          >
                            <Image
                              src={img}
                              alt={`Thumbnail ${index + 1}`}
                              fill
                              className="object-cover p-2 rounded-2xl"
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>

                  {/* MAIN IMAGE */}
                  <div className="flex-1">
                    <div className="w-full rounded-3xl overflow-hidden ">

                      <div className="relative w-full aspect-[4/5]">
                        {isMobile ? (
                          <div className="absolute inset-0 flex items-center justify-center p-6">
                            <img
                              src={selectedVariant?.images?.[currentIndex]}
                              alt="Product"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="absolute inset-0 p-4">
                            <CustomZoomOnHover
                              imageSrc={selectedVariant?.images?.[currentIndex]}
                              alt="Product Image"
                              zoomScale={2.5}
                            />
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE - PRODUCT DETAILS */}
              <div className="w-full lg:w-[42%]">

                <div className="sticky top-24">

                  <h1 className="text-3xl xl:text-4xl font-black uppercase text-[#171717] leading-tight">
                    {ProductDetails?.title}
                  </h1>

                  <p className="text-[#4D5466] text-base xl:text-lg mt-5 leading-7 font-medium">
                    {ProductDetails?.description}
                  </p>

                  {/* PRICE */}
                  <div className="mt-7 flex items-end gap-3">
                    <h2 className="text-4xl font-bold text-black">
                      ₹{ProductDetails?.amount}
                    </h2>

                    <span className="text-sm text-[#4D5466] mb-1">
                      Inclusive of all taxes
                    </span>
                  </div>

                  <p className="text-[#4D5466] text-base mt-3 font-medium">
                    Deliver in approximately 8–12 days
                  </p>

                  {/* COLOR VARIANTS */}
                  {ProductDetails?.variants?.length > 0 && (
                    <div className="mt-8">

                      <p className="text-sm font-semibold mb-4 text-[#171717]">
                        Colour :
                        <span className="capitalize ml-2">
                          {selectedVariant?.color}
                        </span>
                      </p>

                      <div className="flex flex-wrap gap-4">
                        {ProductDetails?.variants?.map((variant, idx) => {
                          const isActive =
                            selectedVariant?.color === variant?.color;

                          return (
                            <div
                              key={idx}
                              onClick={() => {
                                setSelectedVariant(variant);
                                setCurrentIndex(0);
                              }}
                              className={`
                    w-[110px] rounded-2xl overflow-hidden 
                    border-2 cursor-pointer bg-white
                    transition-all duration-300
                    ${isActive
                                  ? "border-black shadow-md"
                                  : "border-gray-200 hover:border-gray-400"
                                }
                  `}
                            >
                              <div className="relative aspect-square bg-[#F7F7F7]">
                                <Image
                                  src={variant.images?.[0]}
                                  alt={variant?.color}
                                  fill
                                  className="object-contain p-2"
                                />
                              </div>

                              <p className="text-center text-sm font-semibold py-3 capitalize">
                                {variant?.color}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* BUTTONS */}
                  <div className="mt-8 space-y-4">

                    <div className="flex gap-4">

                      {/* QTY */}
                      <div className="w-[130px] h-[54px] border border-black rounded-xl flex items-center justify-between px-4">
                        <button
                          onClick={decreaseQty}
                          className="text-2xl cursor-pointer"
                        >
                          −
                        </button>

                        <span className="font-semibold text-lg">
                          {qty}
                        </span>

                        <button
                          onClick={increaseQty}
                          className="text-2xl cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* CART */}
                      <button
                        onClick={handleAdd}
                        className="flex-1 h-[54px] border border-black rounded-xl font-semibold hover:bg-black hover:text-white transition-all duration-300 cursor-pointer"
                      >
                        ADD TO CART
                      </button>
                    </div>

                    {/* BUY NOW */}
                    <button
                      onClick={handlecheckoutAdd}
                      className="w-full h-[56px] rounded-xl bg-black text-white font-semibold hover:opacity-90 transition-all duration-300 cursor-pointer"
                    >
                      BUY IT NOW
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Related selectedId={ProductDetails?.subcategory?._id} />
        </div>
      </div>
      {show && <GalleryModal />}
    </Layout>
  );
}