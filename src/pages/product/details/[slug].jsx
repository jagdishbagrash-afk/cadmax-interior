"use client";
import React, { useEffect, useState } from "react";
import Layout from "../../common/Layout";
import ProductImage from "../../../Assets/Images/ProductDetail.png";
import { createPortal } from "react-dom";
import Image from "next/image";
import { FiTruck, FiHeart, FiShare } from "react-icons/fi";
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
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import toast from "react-hot-toast";
import { useRole } from "@/context/RoleContext";
import { formatPrice } from "@/components/formatPrice";
import useWishlist from "@/hooks/useWishlist";
import { useSelector } from "react-redux";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import Link from "next/link";

// Custom Zoom Component - Fixed version
const CustomZoomOnHover = ({ imageSrc, alt, zoomScale = 2.5 }) => {
  const [zoomPosition, setZoomPosition] = useState({
    x: 50,
    y: 50,
    show: false,
  });

  const containerRef = React.useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({
      x: Math.min(Math.max(x, 0), 100),
      y: Math.min(Math.max(y, 0), 100),
      show: true,
    });
  };

  const handleMouseLeave = () => {
    setZoomPosition((prev) => ({
      ...prev,
      show: false,
    }));
  };

  return (
    <>
      {/* Main Image */}
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={imageSrc}
          alt={alt}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Zoom Preview */}
      {typeof window !== "undefined" &&
        zoomPosition.show &&
        createPortal(
          <div
            className="
              fixed
              top-20
              right-20
              w-[500px]
              h-[600px]
              bg-white
              border
              border-gray-200
              rounded-xl
              shadow-2xl
              overflow-hidden
              hidden
              lg:block
            "
            style={{
              zIndex: 999999999,
            }}
          >
            <div
              className="w-full h-full bg-no-repeat"
              style={{
                backgroundImage: `url(${imageSrc})`,
                backgroundSize: `${zoomScale * 100}%`,
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                backgroundRepeat: "no-repeat",
                backgroundColor: "#f5f5f5",
              }}
            />
          </div>,
          document.body
        )}
    </>
  );
};

export default function Index() {
  const router = useRouter();
  const { user, setUser } = useRole();

  const {
    subcategory,
    subsubcategory,
    type,
  } = router.query;

  const id = router?.query?.slug;

  const { error, isLoading, Razorpay } = useRazorpay();
  const RAZOPAY_KEY = process.env.NEXT_PUBLIC_RAZOPAY_KEY;
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedPriceSection, setSelectedPriceSection] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [open, setOpen] = useState(null);
  const [ProductDetails, setProductDetails] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#10b981",
          color: "#ffffff",
          border: "1px solid #059669",
          borderRadius: "12px",
          padding: "16px 24px",
          fontSize: "14px",
          fontWeight: "600",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        },
        iconTheme: {
          primary: "#ffffff",
          secondary: "#10b981",
        },
      });
    } catch (error) {
      toast.error("Failed to copy link", {
        duration: 3000,
        position: "top-right",
      });
    }
  };

  // ================= NEW: SORT STATE FOR RELATED PRODUCTS =================
  const [relatedSortBy, setRelatedSortBy] = useState("");

  const { toggleWishlist } = useWishlist();
  const wishlistIds = useSelector((state) => state.wishlist.wishlistIds);
  const isWishlisted = ProductDetails && wishlistIds.includes(ProductDetails._id);

  console.log("ProductDetails", ProductDetails)
  const dispatch = useDispatch();

  // Get the current price based on main amount or selected price section and size
  const getCurrentPrice = () => {
    // If a size is selected within a price section
    if (selectedPriceSection && selectedSize) {
      return {
        amount: selectedSize.amount,
        final_amount: selectedSize.final_amount,
        discount_amount: selectedSize.discount_amount
      };
    }
    // If only price section is selected (no size)
    if (selectedPriceSection) {
      return {
        amount: selectedPriceSection.amount,
        final_amount: selectedPriceSection.final_amount,
        discount_amount: selectedPriceSection.discount_amount
      };
    }
    // Default product price
    return {
      amount: ProductDetails?.amount || 0,
      final_amount: ProductDetails?.final_amount || 0,
      discount_amount: ProductDetails?.discount_amount || 0
    };
  };

  // Get display price
  const getDisplayPrice = () => {
    const currentPrice = getCurrentPrice();
    if (currentPrice.final_amount > 0) {
      return currentPrice.final_amount;
    }
    return currentPrice.amount;
  };

  // Get original amount for discount display
  const getOriginalAmount = () => {
    const currentPrice = getCurrentPrice();
    return currentPrice.amount;
  };

  // Get discount percentage
  const getDiscountPercentage = () => {
    const currentPrice = getCurrentPrice();
    return currentPrice.discount_amount;
  };

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
      if (prev >= maxStock) {
        toast.error(`Only ${maxStock} items available in stock`, {
          duration: 3000,
          position: "top-right",
          style: {
            background: "#fee2e2",
            color: "#991b1b",
            border: "1px solid #fecaca",
            borderRadius: "12px",
            padding: "16px 24px",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          },
          iconTheme: {
            primary: "#dc2626",
            secondary: "#fee2e2",
          },
        });
        return prev;
      }
      const newQty = prev + 1;
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
      const currentPrice = getCurrentPrice();
      const main = new Listing();
      await main.UpdateTocart({
        productId: ProductDetails?._id,
        variant: selectedVariant?.color,
        price: currentPrice?.final_amount || currentPrice?.amount || 0,
        quantity: quantity,
        priceSectionTitle: selectedPriceSection?.title || null,
        sizeTitle: selectedSize?.title || null
      });
    } catch (err) {
      // Silently fail - no toast on quantity change
    }
  };

  const fetchData = async (
    slug,
    subcategory = "",
    subsubcategory = "",
    type = ""
  ) => {
    try {
      const main = new Listing();

      console.log("API PARAMS", {
        slug,
        subcategory,
        subsubcategory,
        type,
      });

      const response = await main.GetAllProductsId(
        slug,
        subcategory,
        subsubcategory,
        type
      );

      console.log("API RESPONSE", response?.data);

      if (response?.data?.status) {
        setProductDetails(response.data.data);
      } else {
        setProductDetails(null);
      }
    } catch (error) {
      console.log("API ERROR", error);
      setProductDetails(null);
    }
  };

  useEffect(() => {
    if (!router.isReady || !id) return;

    // Reset product state when route changes
    setProductDetails(null);
    setSelectedVariant(null);
    setSelectedPriceSection(null);
    setSelectedSize(null);
    setQty(1);
    setCurrentIndex(0);

    // subsubcategory page
    if (
      type === "subsubcategory" &&
      subcategory &&
      subsubcategory
    ) {
      fetchData(
        id,
        subcategory,
        subsubcategory,
        type
      );
      return;
    }

    // normal product page
    if (!type) {
      fetchData(id);
    }
  }, [
    router.isReady,
    id,
    subcategory,
    subsubcategory,
    type,
  ]);

  const [subSubCategories, setSubSubCategories] = useState([]);

  const fetchSubSubCategories = async (subsubcategoryId) => {
    if (!subsubcategoryId) return;

    try {
      const main = new Listing();
      const response = await main.getproductsubcategory(subsubcategoryId);

      setSubSubCategories(response?.data?.data || []);
    } catch (error) {
      console.log(error);
      setSubSubCategories([]);
    }
  };

  useEffect(() => {
    if (!ProductDetails?.subcategory?._id) return;

    fetchSubSubCategories(ProductDetails.subcategory._id);
  }, [ProductDetails?.subcategory?._id]);

  const handleAdd = () => {
    if (!user || user?.role !== "customer") {
      router.push("/login");
      return;
    }
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    const currentPrice = getCurrentPrice();
    const finalPrice = getDisplayPrice();
    const id = `${selectedVariant?.color}_${ProductDetails?._id}_${selectedPriceSection?.title || 'default'}_${selectedSize?.title || 'default'}`;
    const newItem = {
      id,
      name: ProductDetails?.title,
      price: finalPrice,
      originalPrice: currentPrice.amount,
      discount_amount: currentPrice.discount_amount,
      quantity: qty,
      imgUrl: selectedVariant?.images?.[0],
      product: ProductDetails,
      selectedVariant: selectedVariant?.color,
      selectedPriceSection: selectedPriceSection,
      selectedSize: selectedSize,
    };
    HadleAddtocart({
      productId: ProductDetails?._id,
      quantity: qty,
      variant: selectedVariant?.color,
      priceSection: selectedPriceSection?.title || "",
      size: selectedSize?.title || "",
      price: currentPrice?.final_amount || currentPrice?.amount || 0,
    });
    dispatch(addItem(newItem));
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

    const currentPrice = getCurrentPrice();
    const finalPrice = getDisplayPrice();

    const id = `${selectedVariant?.color}_${ProductDetails?._id}_${selectedPriceSection?.title || 'default'}_${selectedSize?.title || 'default'}`;

    const newItem = {
      id,
      name: ProductDetails?.title,
      price: finalPrice,
      originalPrice: currentPrice.amount,
      discount_amount: currentPrice.discount_amount,
      quantity: qty,
      imgUrl: selectedVariant?.images?.[0],
      product: ProductDetails,
      selectedVariant: selectedVariant?.color,
      selectedPriceSection: selectedPriceSection,
      selectedSize: selectedSize,
    };

    // BUY NOW
    if (redirect) {
      const buyNowItem = {
        id,
        name: ProductDetails?.title,
        price: finalPrice,
        originalPrice: currentPrice.amount,
        discount_amount: currentPrice.discount_amount,
        final_amount: finalPrice,
        quantity: qty,
        imgUrl: selectedVariant?.images?.[0],
        productId: ProductDetails?._id,
        variant: selectedVariant?.color,
        images: selectedVariant?.images,
        selectedPriceSection: selectedPriceSection,
        selectedSize: selectedSize,
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
      await main.AddTocart(cartData);
      toast.success("Added to cart", {
        duration: 2000,
        position: "bottom-center",
        style: {
          background: "#ffffff",
          color: "#1a1a1a",
          border: "1px solid #e5e7eb",
          borderRadius: "9999px",
          padding: "10px 24px",
          fontSize: "13px",
          fontWeight: "500",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        },
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add to cart");
    }
  };

  useEffect(() => {
    if (ProductDetails && ProductDetails?.variants?.length) {
      setSelectedVariant(ProductDetails.variants[0]);
    }
    // Auto-select first price section if main amount is 0 and price sections exist
    if (ProductDetails?.product_price_section?.length > 0 &&
      (!ProductDetails?.amount || ProductDetails?.amount === 0)) {
      const firstSection = ProductDetails.product_price_section[0];
      setSelectedPriceSection(firstSection);
      // Auto-select first size if available
      if (firstSection?.sizes?.length > 0) {
        setSelectedSize(firstSection.sizes[0]);
      }
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

 

  const isOutOfStock = ProductDetails?.stock_status === "out_of_stock";
  const currentPriceData = getCurrentPrice();
  const displayPrice = getDisplayPrice();
  const originalAmount = getOriginalAmount();
  const discountPercent = getDiscountPercentage();
  const hasPriceSections = ProductDetails?.product_price_section?.length > 0;
  const shouldShowPriceSections = hasPriceSections && (!ProductDetails?.amount || ProductDetails?.amount === 0);

  return (
    <Layout>
      <div className="w-full bg-white">
        <div className="container max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 py-1 md:py-2 lg:py-4">

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
          LEFT SIDE - PRODUCT GALLERY (STICKY)
      ===================================== */}
            <div className="w-full lg:sticky lg:top-24 lg:self-start">

              {/* MOBILE + TABLET */}
              <div className="block lg:hidden">

                {/* MAIN IMAGE */}
                <div className="relative w-full aspect-[4/5] bg-[#F7F7F7] rounded-3xl overflow-hidden">
                  <img
                    src={selectedVariant?.images?.[currentIndex]}
                    alt="Product"
                    className="w-full h-full object-cover p-0"
                  />
                  {/* Wishlist & Share Icons */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button
                      onClick={() => toggleWishlist(ProductDetails?._id)}
                      className={`w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 ${isWishlisted
                        ? "text-red-500"
                        : "text-gray-600 hover:text-red-500"
                        }`}
                    >
                      <FiHeart className={`text-lg ${isWishlisted ? 'fill-red-500' : ''}`} />
                    </button>
                    <button
                      onClick={handleShare}
                      className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-black transition-all duration-300"
                    >
                      <FiShare className="text-lg" />
                    </button>
                  </div>
                </div>

                {/* THUMBNAILS */}
                <Swiper
                  slidesPerView={4}
                  spaceBetween={12}
                  className="mt-4"
                >
                  {selectedVariant?.images?.map((img, index) => (
                    <SwiperSlide key={index}>
                      <div className="w-full sm:w-[150px]">
                        <div
                          className={`h-[35px] md:h-[56px] border border-black rounded-2xl flex items-center justify-between px-5 ${isOutOfStock ? "opacity-50 pointer-events-none" : ""}`}
                        >
                          <button
                            onClick={decreaseQty}
                            disabled={isOutOfStock}
                            className="text-xl font-bold"
                          >
                            −
                          </button>
                          <span className="font-semibold text-lg">{qty}</span>
                          <button
                            onClick={increaseQty}
                            disabled={isOutOfStock}
                            className="text-xl font-bold"
                          >
                            +
                          </button>
                        </div>
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
      relative w-full h-[120px]
      rounded-xl overflow-hidden
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
                            className="object-cover p-0"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* MAIN IMAGE */}
                <div className="flex-1">
               <div className="relative w-full aspect-[4/5] bg-[#F7F7F7] rounded-[32px] overflow-hidden">
  {isOutOfStock && (
    <div className="absolute top-6 left-6 z-50 bg-red-500 text-white text-sm font-bold px-4 py-2 shadow-lg">
      Out Of Stock
    </div>
  )}

  <CustomZoomOnHover
    imageSrc={selectedVariant?.images?.[currentIndex]}
    alt="Product"
    zoomScale={2.5}
  />

  {/* Wishlist & Share Icons */}
  <div className="absolute top-6 right-6 flex flex-col gap-2 z-40">
    <button
      onClick={() => toggleWishlist(ProductDetails?._id)}
      className={`w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${isWishlisted
        ? "text-red-500"
        : "text-gray-600 hover:text-red-500"
        }`}
    >
      <FiHeart className={`text-xl ${isWishlisted ? 'fill-red-500' : ''}`} />
    </button>
    <button
      onClick={handleShare}
      className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-black transition-all duration-300 hover:scale-110"
    >
      <FiShare className="text-xl" />
    </button>
  </div>
</div>
                </div>
              </div>
            </div>

            {/* =====================================
          RIGHT SIDE - PRODUCT INFO (SCROLLABLE)
      ===================================== */}
            <div className="w-full">
              <div>

                {/* TITLE */}
                <h1 className="text-[26px] sm:text-[32px] xl:text-[42px] leading-tight font-black uppercase text-black">
                  {ProductDetails?.title}
                </h1>

                {/* DESCRIPTION */}
                <p className="mt-4 text-[15px] sm:text-base leading-7 text-[#4D5466] font-medium text-justify">
                  {ProductDetails?.description}
                </p>

                {/* PRICE */}
                <div className="mt-6 flex items-end gap-3 flex-wrap">
                  <h2 className="text-3xl sm:text-4xl font-bold text-black">
                    ₹{formatPrice(displayPrice)}
                  </h2>

                  {discountPercent > 0 && originalAmount > displayPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      ₹{formatPrice(originalAmount)}
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
              PRICE SECTIONS WITH SIZES
          ===================================== */}
                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-black mb-4">
                    {ProductDetails?.label_category}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {ProductDetails?.product_price_section?.map((section, idx) => {
                      const isActive = selectedPriceSection?.title === section?.title;

                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedPriceSection(section);

                            if (section?.sizes?.length > 0) {
                              setSelectedSize(section.sizes[0]);
                            } else {
                              setSelectedSize(null);
                            }
                          }}
                          className={`
          rounded-lg px-3 py-2 border cursor-pointer transition-all duration-200
          ${isActive
                              ? "border-black bg-gray-50 shadow-sm"
                              : "border-gray-200 hover:border-gray-300"
                            }
        `}
                        >
                          <h3 className="font-medium text-sm capitalize text-center">
                            {section?.title}
                          </h3>
                        </div>
                      );
                    })}
                  </div>

                  {/* Sizes within selected section */}
                  {selectedPriceSection?.sizes?.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-black mb-3">
                        {ProductDetails?.label_size}
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {selectedPriceSection.sizes.map((size, idx) => {
                          const isSizeActive = selectedSize?.title === size?.title;
                          return (
                            <div
                              key={idx}
                              onClick={() => setSelectedSize(size)}
                              className={`
                                  rounded-xl p-3 border-2 cursor-pointer transition-all duration-300
                                  ${isSizeActive
                                  ? "border-black bg-gray-50 shadow-lg"
                                  : "border-gray-200 hover:border-gray-300"
                                }
                                `}
                            >
                              <div className="text-center">
                                <p className="font-semibold text-sm capitalize">
                                  {size?.title}
                                </p>

                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
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
                        const isActive = selectedVariant?.color === variant?.color;
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
                    <div
                      className={`w-full sm:w-[150px] h-[35px] md:h-[56px] border border-black rounded-2xl flex items-center justify-between px-5 ${isOutOfStock ? "opacity-50 pointer-events-none" : ""
                        }`}
                    >
                      <button
                        onClick={decreaseQty}
                        disabled={isOutOfStock}
                        className="text-xl font-bold"
                      >
                        −
                      </button>
                      <span className="font-semibold text-lg">{qty}</span>
                      <button
                        onClick={increaseQty}
                        disabled={isOutOfStock}
                        className="text-xl font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* ADD TO CART */}
                    <button
                      onClick={handleAdd}
                      disabled={isOutOfStock}
                      className={`
                        w-full h-[35px] md:h-[58px]
                        rounded-2xl border border-black font-semibold tracking-wide
                        transition-all duration-300
                        ${isOutOfStock
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-white text-black hover:opacity-90"
                        }
                      `}
                    >
                      {isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
                    </button>
                  </div>

                  {/* BUY NOW */}
                  <button
                    onClick={() => handlecheckoutAdd(true)}
                    disabled={isOutOfStock}
                    className={`
                      w-full h-[35px] md:h-[58px]
                      rounded-2xl font-semibold tracking-wide
                      transition-all duration-300
                      ${isOutOfStock
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-black text-white hover:opacity-90"
                      }
                    `}
                  >
                    {isOutOfStock ? "OUT OF STOCK" : "BUY IT NOW"}
                  </button>

                </div>

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
                    <div key={item.id} className="border-b border-gray-200 py-5">
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
          {/* REVIEWS SECTION */}
          {ProductDetails?._id && (
            <ReviewsSection
              productId={ProductDetails._id}
              productName={ProductDetails?.title}
            />
          )}

          {/* RELATED PRODUCTS WITH SORT */}
          <Related
            selectedId={ProductDetails?.subcategory?._id}
            sortBy={relatedSortBy}
          />
        </div>
      </div>
    </Layout>
  );
}