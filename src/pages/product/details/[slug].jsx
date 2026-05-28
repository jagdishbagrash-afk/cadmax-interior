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
  const [open, setOpen] = useState(null);
  const [ProductDetails, setProductDetails] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const dispatch = useDispatch();


const FetchCart = async () => {
  try {
    const main = new Listing();
    const response = await main.CartGet();

    if (response?.data?.data?.items) {
      localStorage.setItem(
        "cartItems",
        JSON.stringify(response.data.data.items)
      );

    } else {
      localStorage.removeItem("cartItems");
    }
  } catch (error) {
    console.log(error);
  }
};
  




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
      FetchCart();
  };

const handlecheckoutAdd = (redirect = false) => {

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

  // BUY NOW
  if (redirect) {

    const buyNowItem = {
      id,
      name: ProductDetails?.title,
      price: ProductDetails?.amount,
      discount_amount : ProductDetails?.discount_amount,
      final_amount  : ProductDetails?.final_amount ,
      quantity: qty,
      imgUrl: selectedVariant?.images?.[0],
      productId: ProductDetails?._id,
      variant: selectedVariant?.color,
      images: selectedVariant?.images,
    };

    localStorage.setItem(
      "buyNowItem",
      JSON.stringify(buyNowItem)
    );
    router.push("/buy-now?type=buy-now");
    return;
  }
  // CART
  dispatch(addItem(newItem));

  toast.success("Item added to cart");
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
      <div className="w-full bg-white">
        <div className="container max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 lg:py-12">

          {/* BREADCRUMB */}
          <p className="text-[11px] sm:text-xs md:text-sm text-[#6B7280] uppercase tracking-[2px] mb-5 md:mb-8">
            <span className="text-black font-semibold">
              {ProductDetails?.category?.name}
            </span>{" "}
            / {ProductDetails?.subcategory?.name}
          </p>

          {/* MAIN SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-14">

            {/* =====================================
          LEFT SIDE - PRODUCT GALLERY
      ===================================== */}
            <div className="w-full">

              {/* MOBILE + TABLET */}
              <div className="block lg:hidden">

                {/* MAIN IMAGE */}
                <div className="relative w-full aspect-[4/5] bg-[#F7F7F7] rounded-3xl overflow-hidden">

                  <img
                    src={selectedVariant?.images?.[currentIndex]}
                    alt="Product"
                    className="w-full h-full object-contain p-4 sm:p-6"
                  />

                </div>

                {/* THUMBNAILS */}
                <Swiper
                  slidesPerView={4}
                  spaceBetween={12}
                  className="mt-4"
                >
                  {selectedVariant?.images?.map((img, index) => (
                    <SwiperSlide key={index}>
                      <div
                        onClick={() => setCurrentIndex(index)}
                        className={`
                    relative aspect-square rounded-2xl overflow-hidden
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
                          alt="thumb"
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* DESKTOP */}
              <div className="hidden lg:flex gap-5">

                {/* THUMBNAILS */}
                <div className="w-[90px] shrink-0">

                  <Swiper
                    direction="vertical"
                    slidesPerView={5}
                    spaceBetween={14}
                    modules={[Thumbs]}
                    className="h-[700px]"
                  >
                    {selectedVariant?.images?.map((img, index) => (
                      <SwiperSlide key={index}>
                        <div
                          onMouseEnter={() => setCurrentIndex(index)}
                          className={`
                      relative aspect-square rounded-2xl overflow-hidden
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
                            alt="thumb"
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* MAIN IMAGE */}
              {/* MAIN IMAGE */}
<div className="flex-1">

  <div className="relative w-full aspect-[4/5] bg-[#F7F7F7] rounded-[32px] overflow-hidden">

    {/* ✅ Discount Badge */}
    {ProductDetails?.discount_amount > 0 && (
      <div className="absolute top-6 left-6 z-50 bg-red-500 text-white text-sm font-bold px-4 py-2  shadow-lg">
        {ProductDetails?.discount_amount}% OFF
      </div>
    )}

    <div className="absolute inset-0 p-6">
      <CustomZoomOnHover
        imageSrc={selectedVariant?.images?.[currentIndex]}
        alt="Product"
        zoomScale={2.5}
      />
    </div>

  </div>
</div>
              </div>
            </div>

            {/* =====================================
          RIGHT SIDE - PRODUCT INFO
      ===================================== */}
            <div className="w-full">

              <div className="lg:sticky lg:top-24">

                {/* TITLE */}
                <h1 className="text-[26px] sm:text-[32px] xl:text-[42px] leading-tight font-black uppercase text-black">
                  {ProductDetails?.title}
                </h1>

                {/* DESCRIPTION */}
                <p className="mt-4 text-[15px] sm:text-base leading-7 text-[#4D5466] font-medium text-justify">
                  {ProductDetails?.description}
                </p>

                {/* PRICE */}
           {/* PRICE */}
<div className="mt-6 flex items-end gap-3 flex-wrap">

  {/* ✅ Discount Price */}
  <h2 className="text-3xl sm:text-4xl font-bold text-black">
    ₹{ProductDetails?.final_amount || ProductDetails?.amount}
  </h2>

  {/* ✅ Original Price */}
  {ProductDetails?.discount_amount > 0 && (
    <span className="text-lg text-gray-400 line-through">
      ₹{ProductDetails?.amount}
    </span>
  )}

  {/* ✅ Discount Badge */}
  {ProductDetails?.discount_amount > 0 && (
    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
      {ProductDetails?.discount_amount}% OFF
    </span>
  )}

  <span className="text-sm text-[#6B7280]">
    Inclusive of all taxes
  </span>

</div>

                {/* DELIVERY */}
                <div className="mt-3 flex items-center gap-2 text-sm text-[#4D5466]">
                  <FiTruck className="text-lg" />
                  Deliver in approximately 8–12 days
                </div>

                {/* =====================================
              VARIANTS
          ===================================== */}
                {ProductDetails?.variants?.length > 0 && (
                  <div className="mt-8">

                    <p className="text-sm font-semibold text-black mb-4">
                      Colour :
                      <span className="capitalize ml-2">
                        {selectedVariant?.color}
                      </span>
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

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
                        rounded-2xl overflow-hidden border-2
                        cursor-pointer transition-all duration-300
                        bg-white
                        ${isActive
                                ? "border-black shadow-lg"
                                : "border-gray-200"
                              }
                      `}
                          >

                            <div className="relative aspect-square bg-[#F7F7F7]">
                              <Image
                                src={variant.images?.[0]}
                                alt={variant?.color}
                                fill
                                className="object-contain p-3"
                              />
                            </div>

                            <p className="text-center py-3 text-sm font-semibold capitalize">
                              {variant?.color}
                            </p>

                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* =====================================
              BUTTONS
          ===================================== */}
                <div className="mt-8 space-y-4">

                  <div className="flex flex-col sm:flex-row gap-4">

                    {/* QUANTITY */}
                    <div className="w-full sm:w-[150px] h-[35px] md:h-[56px] border border-black rounded-2xl flex items-center justify-between px-5">

                      <button
                        onClick={decreaseQty}
                        className="text-xl font-bold"
                      >
                        −
                      </button>

                      <span className="font-semibold text-lg">
                        {qty}
                      </span>

                      <button
                        onClick={increaseQty}
                        className="text-xl font-bold"
                      >
                        +
                      </button>

                    </div>

                    {/* ADD TO CART */}
                    <button
                      onClick={handleAdd}
                      className="
                w-full h-[35px] md:h-[58px]
                rounded-2xl bg-white text-black
                border-1 border-[#000000]
                font-semibold tracking-wide
                hover:opacity-90
                transition-all duration-300
                "
                    >
                      ADD TO CART
                    </button>

                  </div>

                  {/* BUY NOW */}
                  <button
                    onClick={handlecheckoutAdd}
                    className="
                     w-full h-[35px] md:h-[58px]
                rounded-2xl bg-black text-white
                font-semibold tracking-wide
                hover:opacity-90
                transition-all duration-300
              "
                  >
                    BUY IT NOW
                  </button>
                </div>

                {/* =====================================
              ACCORDION
          ===================================== */}
                <div className="mt-10 border-t border-gray-200">

                  {[
                    {
                      id: 1,
                      title: "Dimensions",
                      content: ProductDetails?.dimensions,
                    },
                    {
                      id: 2,
                      title: "Materials & Features",
                      content: ProductDetails?.material,
                    },
                    {
                      id: 3,
                      title: "Product Care",
                      content: ProductDetails?.type,
                    },
                    {
                      id: 4,
                      title: "Terms & Conditions",
                      content: ProductDetails?.terms,
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="border-b border-gray-200 py-5"
                    >

                      <div
                        onClick={() => toggle(item.id)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <h3 className="text-[15px] sm:text-base font-bold uppercase text-black">
                          {item.title}
                        </h3>

                        {open === item.id ? (
                          <FaMinus size={18} />
                        ) : (
                          <FaPlus size={18} />
                        )}
                      </div>

                      {open === item.id && (
                        <p className="mt-4 text-[15px] leading-7 text-[#4D5466]">
                          {item.content}
                        </p>
                      )}

                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>

          {/* RELATED PRODUCTS */}
          <div className="mt-12 md:mt-16">
            <Related selectedId={ProductDetails?.subcategory?._id} />
          </div>

        </div>
      </div>
    </Layout>
  );
}