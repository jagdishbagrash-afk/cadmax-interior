import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Listing from "@/pages/api/Listing";
import {
  HiCheck,
  HiOutlineShoppingBag,
  HiOutlineTruck,
  HiOutlineDocumentText,
  HiOutlineMapPin,
  HiOutlineCreditCard,
  HiOutlineArrowDownTray,
  HiOutlinePhone,
  HiOutlineArrowPath,
  HiOutlineEye,
  HiOutlineCalendar,
} from "react-icons/hi2";
import { FaBox, FaCheck } from "react-icons/fa";

// Default Mock Data matching exact prompt & UI design image
const DEFAULT_ORDER_DATA = {
  orderHeader: {
    orderId: "#ORD-792456",
    rawOrderId: "ORD-792456",
    placedOn: "23 July 2026, 12:47 PM",
    status: "Delivered",
    statusBadgeColor: "#22c55e",
  },
  stepperTimeline: [
    {
      step: 1,
      key: "order_placed",
      title: "Order Placed",
      completed: true,
      timestamp: "23 July, 12:47 PM",
      iconType: "cart",
    },
    {
      step: 2,
      key: "confirmed",
      title: "Confirmed",
      completed: true,
      timestamp: "23 July, 01:10 PM",
      iconType: "check",
    },
    {
      step: 3,
      key: "shipped",
      title: "Shipped",
      completed: true,
      timestamp: "24 July, 10:30 AM",
      iconType: "truck",
    },
    {
      step: 4,
      key: "out_for_delivery",
      title: "Out for Delivery",
      completed: true,
      timestamp: "24 July, 09:15 AM",
      iconType: "box",
    },
    {
      step: 5,
      key: "delivered",
      title: "Delivered",
      completed: true,
      timestamp: "24 July, 12:20 PM",
      iconType: "delivered",
    },
  ],
  products: [
    {
      productId: "prod-101",
      title: "CARTING BED",
      variant: "Queen Size  |  Walnut, Teak",
      quantity: 1,
      price: 30360,
      priceFormatted: "₹ 30,360.00",
      total: 30360,
      totalFormatted: "₹ 30,360.00",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80",
      actions: {
        canBuyAgain: true,
        canWriteReview: true,
        buyAgainUrl: "/cart",
        reviewUrl: "#",
      },
    },
  ],
  shippingAddress: {
    name: "A-12, Sikar Road, Vaishali Nagar,",
    address: "Jaipur, Rajasthan - 302021",
    phone: "Phone: +91 98765 43210",
  },
  paymentMethod: {
    method: "Online Payment",
    status: "Paid: ₹ 30,360.00",
  },
  orderSummary: {
    subtotalFormatted: "₹ 27,250.00",
    shippingFormatted: "₹ 1,110.00",
    taxFormatted: "₹ 2,000.00",
    taxPercentage: "18%",
    totalFormatted: "₹ 30,360.00",
  },
  shipmentDetails: {
    shipmentId: "SHP-554789",
    courierPartner: "Ecom Express",
    trackingId: "1234567890",
    shippedOn: "24 July 2026, 10:30 AM",
    deliveredOn: "24 July 2026, 12:20 PM",
    status: "Delivered",
    actions: {
      canTrackShipment: true,
      canDownloadInvoice: true,
    },
  },
  estimatedDeliveryInformation: {
    orderedOn: "23 July 2026, 12:47 PM",
    estShipping: "24 July 2026",
    estDelivery: "24 July 2026",
    actualDelivery: "24 July 2026, 12:20 PM",
  },
  footerActions: {
    needHelp: {
      title: "Need Help?",
      subtitle: "Contact Support",
    },
    returnReplace: {
      title: "Return / Replace",
      subtitle: "Start a Return",
    },
    viewDetails: {
      title: "View Details",
      subtitle: "View Order Details",
    },
  },
};

export default function OrderDetailsView({ orderIdProp }) {
  const router = RouterHook();
  const orderId = orderIdProp || router.query?.id || router.query?.orderId || "ORD-792456";

  const [orderData, setOrderData] = useState(DEFAULT_ORDER_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const listing = new Listing();
        const res = await listing.GetWebOrderDetails(orderId);

        if (res?.data?.data) {
          setOrderData(mergeOrderData(res.data.data));
        } else if (res?.data && res.data.orderHeader) {
          setOrderData(mergeOrderData(res.data));
        }
      } catch (err) {
        console.warn("Using fallback default order design data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  function RouterHook() {
    try {
      return useRouter() || { query: {} };
    } catch {
      return { query: {} };
    }
  }

  const mergeOrderData = (apiData) => {
    return {
      orderHeader: {
        ...DEFAULT_ORDER_DATA.orderHeader,
        ...apiData.orderHeader,
      },
      stepperTimeline:
        apiData.stepperTimeline?.length > 0
          ? apiData.stepperTimeline
          : DEFAULT_ORDER_DATA.stepperTimeline,
      products:
        apiData.products?.length > 0
          ? apiData.products
          : DEFAULT_ORDER_DATA.products,
      shippingAddress: {
        ...DEFAULT_ORDER_DATA.shippingAddress,
        ...apiData.shippingAddress,
      },
      paymentMethod: {
        ...DEFAULT_ORDER_DATA.paymentMethod,
        ...apiData.paymentMethod,
      },
      orderSummary: {
        ...DEFAULT_ORDER_DATA.orderSummary,
        ...apiData.orderSummary,
      },
      shipmentDetails: {
        ...DEFAULT_ORDER_DATA.shipmentDetails,
        ...apiData.shipmentDetails,
      },
      estimatedDeliveryInformation: {
        ...DEFAULT_ORDER_DATA.estimatedDeliveryInformation,
        ...apiData.estimatedDeliveryInformation,
      },
      footerActions: {
        ...DEFAULT_ORDER_DATA.footerActions,
        ...apiData.footerActions,
      },
    };
  };

  const handleDownloadInvoice = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleTrackShipment = () => {
    const trackingId = orderData.shipmentDetails?.trackingId || "1234567890";
    alert(`Tracking Shipment #${trackingId} via ${orderData.shipmentDetails?.courierPartner}`);
  };

  const header = orderData.orderHeader;
  const stepper = orderData.stepperTimeline;
  const products = orderData.products;
  const address = orderData.shippingAddress;
  const payment = orderData.paymentMethod;
  const summary = orderData.orderSummary;
  const shipment = orderData.shipmentDetails;
  const estDelivery = orderData.estimatedDeliveryInformation;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-6 sm:py-8 px-3 sm:px-6 lg:px-8 text-gray-800 font-sans">
      <div className="max-w-5xl mx-auto space-y-5 sm:space-y-6">
        
        {/* TOP BREADCRUMB / BACK LINK */}
        <div className="flex items-center justify-between">
          <Link
            href="/orders"
            className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            &larr; Back to Orders
          </Link>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Order Details & Tracking
          </span>
        </div>

        {/* MAIN ORDER CONTAINER CARD */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 sm:p-8 space-y-8">
          
          {/* 1. HEADER CARD */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-8 flex-wrap">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  ORDER ID
                </p>
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-0.5 tracking-tight">
                  {header.orderId}
                </h1>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  PLACED ON
                </p>
                <p className="text-sm sm:text-base font-bold text-gray-800 mt-0.5">
                  {header.placedOn}
                </p>
              </div>
            </div>

            {/* STATUS BADGE */}
            <div>
              <span className="inline-flex items-center gap-1.5 bg-[#e6f4ea] text-[#1e8e3e] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#ceebd5] shadow-2xs">
                <span className="w-4 h-4 rounded-full bg-[#1e8e3e] text-white flex items-center justify-center text-[10px]">
                  <FaCheck className="w-2.5 h-2.5" />
                </span>
                {header.status || "Delivered"}
              </span>
            </div>
          </div>

          {/* 2. HORIZONTAL STEPPER TIMELINE */}
          <div className="py-2 overflow-x-auto">
            <div className="min-w-[620px] sm:min-w-0">
              <div className="grid grid-cols-5 gap-2 relative z-10">
                {stepper.map((item, idx) => {
                  const isLast = idx === stepper.length - 1;
                  const isCompleted = item.completed;

                  return (
                    <div
                      key={item.step || idx}
                      className="flex flex-col items-center text-center group"
                    >
                      {/* STEP ICON CIRCLE */}
                      <div className="relative flex items-center justify-center w-full">
                        {/* Connecting Line (left side) */}
                        {idx > 0 && (
                          <div
                            className={`absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-[2px] ${
                              isCompleted ? "bg-[#22c55e]" : "bg-gray-200"
                            }`}
                          />
                        )}

                        {/* Connecting Line (right side) */}
                        {!isLast && (
                          <div
                            className={`absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[2px] ${
                              stepper[idx + 1]?.completed ? "bg-[#22c55e]" : "bg-gray-200"
                            }`}
                          />
                        )}

                        {/* ICON CIRCLE BADGE */}
                        <div
                          className={`relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isCompleted
                              ? isLast
                                ? "bg-[#16a34a] text-white shadow-xs ring-4 ring-emerald-50"
                                : "bg-white border-2 border-[#16a34a] text-[#16a34a]"
                              : "bg-white border-2 border-gray-300 text-gray-400"
                          }`}
                        >
                          {isLast && isCompleted ? (
                            <FaCheck className="w-4 h-4 text-white" />
                          ) : item.iconType === "cart" || item.key === "order_placed" ? (
                            <HiOutlineShoppingBag className="w-5 h-5 text-[#16a34a]" />
                          ) : item.iconType === "check" || item.key === "confirmed" ? (
                            <HiCheck className="w-5 h-5 text-[#16a34a]" />
                          ) : item.iconType === "truck" || item.key === "shipped" ? (
                            <HiOutlineTruck className="w-5 h-5 text-[#16a34a]" />
                          ) : item.iconType === "box" || item.key === "out_for_delivery" ? (
                            <HiOutlineDocumentText className="w-5 h-5 text-[#16a34a]" />
                          ) : (
                            <FaCheck className="w-3.5 h-3.5" />
                          )}
                        </div>
                      </div>

                      {/* STEP LABEL AND TIMESTAMP */}
                      <div className="mt-3 space-y-0.5">
                        <p
                          className={`text-xs sm:text-sm font-bold transition-colors ${
                            isCompleted ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {item.title}
                        </p>
                        <p className="text-[11px] sm:text-xs text-gray-400 font-medium">
                          {item.timestamp || "--"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. PRODUCT ITEM CARD */}
          <div className="border border-gray-200/90 rounded-2xl p-4 sm:p-6 bg-white hover:border-gray-300 transition-colors">
            {products.map((prod, index) => (
              <div
                key={prod.productId || index}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
              >
                {/* Left Product Details */}
                <div className="flex items-start sm:items-center gap-4 sm:gap-5 w-full sm:w-auto">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                    <img
                      src={
                        prod.image ||
                        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={prod.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-wide uppercase">
                      {prod.title}
                    </h2>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">
                      {prod.variant}
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-gray-700 pt-1">
                      Qty: {prod.quantity}
                    </p>
                    <p className="text-base sm:text-xl font-extrabold text-gray-900 pt-1">
                      {prod.totalFormatted || prod.priceFormatted}
                    </p>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end pt-2 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => router.push?.(prod.actions?.buyAgainUrl || "/cart")}
                    className="flex-1 sm:flex-none border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold px-5 py-2.5 rounded-lg text-sm transition-all active:scale-95 text-center"
                  >
                    Buy Again
                  </button>

                  <button
                    type="button"
                    onClick={() => alert(`Reviewing product: ${prod.title}`)}
                    className="flex-1 sm:flex-none bg-[#111827] hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-all shadow-xs active:scale-95 text-center"
                  >
                    Write a Review
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 4. THREE-COLUMN SECTION */}
          <div className="border border-gray-200/90 rounded-2xl p-5 sm:p-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200/80 gap-6 md:gap-0">
              
              {/* Left Column: SHIPPING ADDRESS */}
              <div className="md:pr-6 space-y-3 pt-2 md:pt-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <HiOutlineMapPin className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                    SHIPPING ADDRESS
                  </h3>
                </div>

                <div className="pl-12 text-sm text-gray-600 space-y-1">
                  {address.name && (
                    <p className="font-bold text-gray-900 leading-snug">
                      {address.name}
                    </p>
                  )}
                  <p className="leading-relaxed">
                    {address.address || "A-12, Sikar Road, Vaishali Nagar, Jaipur, Rajasthan - 302021"}
                  </p>
                  {address.phone && (
                    <p className="font-semibold text-gray-700 pt-1">
                      {address.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Middle Column: PAYMENT METHOD */}
              <div className="md:px-6 space-y-3 pt-6 md:pt-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <HiOutlineCreditCard className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                    PAYMENT METHOD
                  </h3>
                </div>

                <div className="pl-12 text-sm text-gray-600 space-y-1">
                  <p className="font-bold text-gray-900">
                    {payment.method || "Online Payment"}
                  </p>
                  <p className="font-semibold text-gray-600">
                    {payment.status || "Paid: ₹ 30,360.00"}
                  </p>
                </div>
              </div>

              {/* Right Column: ORDER SUMMARY */}
              <div className="md:pl-6 space-y-3 pt-6 md:pt-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
                    <HiOutlineDocumentText className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                    ORDER SUMMARY
                  </h3>
                </div>

                <div className="pl-12 text-sm text-gray-600 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium">Subtotal</span>
                    <span className="font-semibold text-gray-800">
                      {summary.subtotalFormatted || "₹ 27,250.00"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium">Shipping</span>
                    <span className="font-semibold text-gray-800">
                      {summary.shippingFormatted || "₹ 1,110.00"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium">
                      Tax ({summary.taxPercentage || "18%"})
                    </span>
                    <span className="font-semibold text-gray-800">
                      {summary.taxFormatted || "₹ 2,000.00"}
                    </span>
                  </div>

                  <div className="border-t border-gray-200/90 pt-2 mt-2 flex items-center justify-between">
                    <span className="font-extrabold text-gray-900 text-base">
                      Total
                    </span>
                    <span className="font-black text-gray-900 text-base">
                      {summary.totalFormatted || "₹ 30,360.00"}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 5. SHIPMENT DETAILS CARD */}
          <div className="border border-gray-200/90 rounded-2xl p-5 sm:p-6 bg-white space-y-6">
            
            {/* Shipment Header & Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-gray-900 uppercase tracking-wide">
                  SHIPMENT DETAILS
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-0.5">
                  Shipment ID: {shipment.shipmentId || "SHP-554789"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleTrackShipment}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold px-4 py-2 rounded-lg text-sm transition-all active:scale-95"
                >
                  Track Shipment
                </button>

                <button
                  type="button"
                  onClick={handleDownloadInvoice}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold px-4 py-2 rounded-lg text-sm transition-all inline-flex items-center gap-2 active:scale-95"
                >
                  <HiOutlineArrowDownTray className="w-4 h-4 text-gray-700" />
                  Download Invoice
                </button>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-2">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  COURIER PARTNER
                </p>
                <p className="text-sm font-bold text-gray-900 mt-1">
                  {shipment.courierPartner || "Ecom Express"}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  TRACKING ID
                </p>
                <p className="text-sm font-bold text-gray-900 mt-1">
                  {shipment.trackingId || "1234567890"}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  SHIPPED ON
                </p>
                <p className="text-sm font-bold text-gray-800 mt-1">
                  {shipment.shippedOn || "24 July 2026, 10:30 AM"}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  DELIVERED ON
                </p>
                <p className="text-sm font-bold text-[#16a34a] mt-1">
                  {shipment.deliveredOn || "24 July 2026, 12:20 PM"}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  STATUS
                </p>
                <p className="text-sm font-bold text-[#16a34a] mt-1">
                  {shipment.status || "Delivered"}
                </p>
              </div>
            </div>

            {/* 6. ESTIMATED DELIVERY INFORMATION BANNER */}
            <div className="bg-[#f0fdf4] border border-emerald-200/80 rounded-2xl p-5 sm:p-6 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              <div className="space-y-4 flex-1 w-full">
                {/* Banner Title */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#16a34a] flex items-center justify-center">
                    <HiOutlineCalendar className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">
                    Estimated Delivery Information
                  </h4>
                </div>

                {/* 4-Step Timestamp Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      ORDERED ON
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">
                      {estDelivery.orderedOn || "23 July 2026, 12:47 PM"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      EST. SHIPPING
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">
                      {estDelivery.estShipping || "24 July 2026"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      EST. DELIVERY
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">
                      {estDelivery.estDelivery || "24 July 2026"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      ACTUAL DELIVERY
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">
                      {estDelivery.actualDelivery || "24 July 2026, 12:20 PM"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Box Graphic Illustration */}
              <div className="hidden md:flex items-center justify-center pr-2 flex-shrink-0">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-tr from-emerald-400 to-emerald-200 rounded-xl transform rotate-6 flex items-center justify-center shadow-md">
                    <FaBox className="w-8 h-8 text-emerald-800/80" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-600 text-white rounded-full border-2 border-white flex items-center justify-center shadow-xs">
                    <FaCheck className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* 7. BOTTOM ACTION LINKS BAR */}
          <div className="pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
              
              {/* Need Help? */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 flex-shrink-0">
                  <HiOutlinePhone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">Need Help?</p>
                  <a
                    href="tel:+919876543210"
                    className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline inline-block mt-0.5"
                  >
                    Contact Support
                  </a>
                </div>
              </div>

              {/* Return / Replace */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 flex-shrink-0">
                  <HiOutlineArrowPath className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">Return / Replace</p>
                  <button
                    type="button"
                    onClick={() => alert("Initiating return request...")}
                    className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline inline-block mt-0.5 text-left"
                  >
                    Start a Return
                  </button>
                </div>
              </div>

              {/* View Details */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 flex-shrink-0">
                  <HiOutlineEye className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">View Details</p>
                  <Link
                    href={`/orders/${header.rawOrderId || "ORD-792456"}`}
                    className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline inline-block mt-0.5"
                  >
                    View Order Details
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
