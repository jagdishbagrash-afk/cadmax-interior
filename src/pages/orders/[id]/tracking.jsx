import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/pages/common/Layout";
import Listing from "@/pages/api/Listing";
import Image from "next/image";
import Link from "next/link";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiPackage,
  FiCreditCard,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiArrowLeft,
  FiPrinter,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import { formatMultiPrice } from "@/components/ValueDataHook";
import DateComponent from "@/components/DateComponent";
import {
  extractTrackingPending,
  unwrapApiData,
  buildTransitDisplay,
  formatTransitDate,
} from "@/components/shipmentUtils";

// ─── HELPERS ────────────────────────────────────────────────
function getQueryValue(value) {
  return Array.isArray(value) ? value[0] || "" : value || "";
}

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusColor = (status) => {
  const map = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-700 border-blue-200",
    processing: "bg-indigo-100 text-indigo-700 border-indigo-200",
    shipped: "bg-purple-100 text-purple-700 border-purple-200",
    delivered: "bg-green-100 text-green-700 border-green-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
    "out for delivery": "bg-orange-100 text-orange-700 border-orange-200",
    "ready to ship": "bg-cyan-100 text-cyan-700 border-cyan-200",
  };
  return map[status?.toLowerCase()] || "bg-gray-100 text-gray-700 border-gray-200";
};

// ─── MAIN COMPONENT ─────────────────────────────────────────
export default function OrderTrackingPage() {
  const router = useRouter();
  const [shipmentData, setShipmentData] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [transitTimeResponse, setTransitTimeResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const orderId = useMemo(
    () => getQueryValue(router.query.id),
    [router.query.id]
  );

  // ─── DATA FETCHING (unchanged) ────────────────────────────
  const fetchTracking = async (activeOrderId, options = {}) => {
    const targetOrderId = activeOrderId || orderId;
    const shouldRefresh = Boolean(options.refresh);

    if (!router.isReady || !targetOrderId) return;

    setLoading(true);
    setError("");

    try {
      const main = new Listing();
      if (shouldRefresh) {
        await main.RefreshOrderShipment(targetOrderId);
      }

      const [shipmentResponse, transitResponse] = await Promise.allSettled([
        main.GetOrderShipment(targetOrderId),
        main.GetTransitTimeByOrder(targetOrderId),
      ]);

      if (shipmentResponse.status === "fulfilled") {
        const shipmentPayload = unwrapApiData(shipmentResponse.value);
        const trackingPending = extractTrackingPending(shipmentPayload);

        setShipmentData(shipmentResponse.value);

        try {
          const trackingResponse = await main.GetOrderTracking(targetOrderId);
          setTrackingData(trackingResponse);
        } catch (trackingError) {
          if (!trackingPending) {
            setTrackingData(null);
          }
        }
      } else {
        throw shipmentResponse.reason;
      }

      if (transitResponse.status === "fulfilled") {
        setTransitTimeResponse(transitResponse.value);
      } else {
        console.error(
          "ORDER TRANSIT TIME FETCH ERROR:",
          transitResponse.reason?.response?.data || transitResponse.reason?.message
        );
        setTransitTimeResponse(null);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to fetch tracking details for this order."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!router.isReady || !orderId) return;
    let isMounted = true;

    const fetchInitialTracking = async () => {
      try {
        setLoading(true);
        setError("");

        const main = new Listing();

        const [shipmentResponse, transitResponse] = await Promise.allSettled([
          main.GetOrderShipment(orderId),
          main.GetTransitTimeByOrder(orderId),
        ]);

        let trackingPending = false;

        if (shipmentResponse.status === "fulfilled") {
          const shipmentPayload = unwrapApiData(shipmentResponse.value);
          trackingPending = extractTrackingPending(shipmentPayload);

          if (isMounted) setShipmentData(shipmentResponse.value);

          try {
            const trackingResp = await main.GetOrderTracking(orderId);
            if (isMounted) setTrackingData(trackingResp);
          } catch (trackingError) {
            if (isMounted && !trackingPending) setTrackingData(null);
          }
        } else if (isMounted) {
          throw shipmentResponse.reason;
        }

        if (transitResponse.status === "fulfilled" && isMounted) {
          setTransitTimeResponse(transitResponse.value);
        } else if (isMounted) {
          console.error(
            "ORDER TRANSIT TIME FETCH ERROR:",
            transitResponse.reason?.response?.data || transitResponse.reason?.message
          );
          setTransitTimeResponse(null);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(
          err?.response?.data?.message ||
            "Unable to fetch tracking details for this order."
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchInitialTracking();

    return () => {
      isMounted = false;
    };
  }, [orderId, router.isReady]);

  // ─── ETA DISPLAY (unchanged) ──────────────────────────────
  const etaDisplay = (() => {
    const display = buildTransitDisplay(transitTimeResponse);
    const deliveryFormatted = formatTransitDate(display.deliveryDate);
    const podFormatted = formatTransitDate(display.podDate);
    return {
      ...display,
      deliveryFormatted,
      podFormatted,
      deliveryByLabel:
        deliveryFormatted && !display.isError
          ? `Delivery by ${deliveryFormatted}`
          : "",
      podLabel:
        podFormatted && !display.isError
          ? `POD expected ${podFormatted}`
          : "",
      cutoffLabel: display.isAfterCutoff
        ? "Pickup scheduled next business day"
        : "",
      hasValidData: Boolean(
        transitTimeResponse &&
          !display.isError &&
          (deliveryFormatted || display.destinationCity)
      ),
    };
  })();

  // ─── EXTRACT ORDER DATA FROM SHIPMENT ──────────────────────
  const order = shipmentData?.data?.data || {};
  const {
    orderId: orderIdFromData,
    name,
    mobile,
    product = [],
    status = "pending",
    amount = 0,
    PaymentId,
    createdAt,
    updatedAt,
    shipping_status = "pending",
    courier_name = "N/A",
    awb_number = "N/A",
    addressId,
    userId,
    paymentMethod = "ONLINE",
    dispatched_at,
    delivered_at,
  } = order;

  const user = userId || {};
  const address = addressId || {};

  // Calculate totals
  const subtotal = product.reduce((sum, p) => sum + (p.total || p.price * p.quantity || 0), 0);
  const discountTotal = product.reduce((sum, p) => sum + ((p.originalPrice - p.price) * p.quantity || 0), 0);
  const tax = 0; // if you have tax field
  const deliveryCharges = 0;
  const finalTotal = amount || subtotal;

  // ─── BUILD TIMELINE ────────────────────────────────────────
  const timelineItems = [
    { status: "Order Placed", date: formatDate(createdAt), active: true },
    { status: "Confirmed", date: formatDate(createdAt), active: true }, // assuming confirmed same as placed for now
    { status: "Shipped", date: formatDate(dispatched_at), active: !!dispatched_at },
    { status: "Out for Delivery", date: formatDate(dispatched_at), active: !!dispatched_at }, // placeholder
    { status: "Delivered", date: formatDate(delivered_at), active: !!delivered_at },
  ].filter(item => item.date !== "N/A");

  // ─── LOADING / ERROR ──────────────────────────────────────
  if (loading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !orderIdFromData) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <FiXCircle className="w-16 h-16 text-red-500 mx-auto" />
            <p className="mt-4 text-gray-600">{error || "Order not found"}</p>
            <button
              onClick={() => router.push("/orders")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // ─── RENDER ────────────────────────────────────────────────
  return (
    <Layout>
      <div className="max-w-[1430px] mx-auto px-4 sm:px-6 py-6 md:py-10 bg-white min-h-screen font-sans text-gray-800">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/orders")}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-light tracking-tight">Order Details</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchTracking(orderId, { refresh: true })}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors">
              <FiPrinter className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header: Order ID, Date, Status */}
          <div className="p-5 border-b border-gray-100 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Order ID</p>
              <p className="text-lg font-mono font-bold text-gray-800 mt-0.5">{orderIdFromData}</p>
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                <FiCalendar className="w-3.5 h-3.5" />
                Placed on {formatDate(createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase border ${getStatusColor(status)}`}>
                {status}
              </span>
            </div>
          </div>

          {/* Body: Two columns on large screens */}
          <div className="p-5 grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left column (3/5) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                  <FiClock className="w-4 h-4 text-gray-400" />
                  Order Timeline
                </h3>
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                  {timelineItems.map((item, idx) => (
                    <div key={idx} className="relative">
                      <div className={`
                        absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2
                        ${item.active ? "bg-green-500 border-green-500" : "bg-gray-200 border-gray-300"}
                      `} />
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <span className={`text-sm font-medium ${item.active ? "text-gray-800" : "text-gray-400"}`}>
                          {item.status}
                        </span>
                        <span className={`text-xs ${item.active ? "text-gray-500" : "text-gray-400"}`}>
                          {item.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                  <FiPackage className="w-4 h-4 text-gray-400" />
                  Product
                </h3>
                {product.map((item, idx) => {
                  const selectedVariant = item?.id?.variants?.find(
                    (v) =>
                      v.title?.toLowerCase().trim() === item.variant?.toLowerCase().trim() ||
                      v.color?.toLowerCase().trim() === item.variant?.toLowerCase().trim()
                  );
                  const variantImg = selectedVariant?.images?.[0];
                  return (
                    <div key={idx} className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-16 h-16 relative flex-shrink-0 bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <Image
                          src={variantImg || "/placeholder.png"}
                          alt={item?.id?.title || "Product"}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item?.id?.title || "Untitled"}</p>
                        <p className="text-xs text-gray-500">
                          {item.variant} • {item.priceSectionTitle}
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          {formatMultiPrice(item?.total || item.price * item.quantity, "INR")}
                        </p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <FiMapPin className="w-4 h-4 text-gray-400" />
                  Shipping Address
                </h3>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-700 leading-relaxed">
                  <p>
                    {address.street_address || "N/A"}
                    {address.city && `, ${address.city}`}
                    {address.state && `, ${address.state}`}
                    {address.pincode && ` - ${address.pincode}`}
                    {address.country && `, ${address.country}`}
                  </p>
                  <p className="mt-1">
                    <span className="font-medium">{name || user.name || "N/A"}</span> | {mobile || "N/A"}
                  </p>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <FiCreditCard className="w-4 h-4 text-gray-400" />
                  Payment Method
                </h3>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm">
                  <p className="font-medium">{paymentMethod || "N/A"}</p>
                  <p className="text-gray-600">Paid: {formatMultiPrice(finalTotal, "INR")}</p>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <FiCalendar className="w-4 h-4 text-gray-400" />
                  Order Summary
                </h3>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatMultiPrice(subtotal, "INR")}</span>
                  </div>
                  {discountTotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-green-600">-{formatMultiPrice(discountTotal, "INR")}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">{formatMultiPrice(deliveryCharges, "INR")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (18%)</span>
                    <span className="font-medium">{formatMultiPrice(tax, "INR")}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-gray-800">
                    <span>Total</span>
                    <span>{formatMultiPrice(finalTotal, "INR")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column (2/5) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipment Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                  <FiTruck className="w-4 h-4 text-gray-400" />
                  Shipment Details
                </h3>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3 text-sm">
                  <div>
                    <p className="text-xs uppercase text-gray-400 font-semibold">Shipment ID</p>
                    <p className="font-mono font-medium">SHP-{orderIdFromData?.slice(-6) || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-400 font-semibold">Courier Partner</p>
                    <p className="font-medium">{courier_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-400 font-semibold">Tracking ID</p>
                    <p className="font-mono font-medium">{awb_number || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-400 font-semibold">Shipped On</p>
                    <p className="font-medium">{formatDate(dispatched_at) || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-400 font-semibold">Delivered On</p>
                    <p className="font-medium">{formatDate(delivered_at) || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-400 font-semibold">Status</p>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(shipping_status)}`}>
                      {shipping_status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Estimated Delivery */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                  <FiClock className="w-4 h-4 text-gray-400" />
                  Estimated Delivery Information
                </h3>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ordered On</span>
                    <span className="font-medium">{formatDate(createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. Shipping</span>
                    <span className="font-medium">{formatDate(dispatched_at) || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. Delivery</span>
                    <span className="font-medium">{etaDisplay.deliveryFormatted || "N/A"}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="text-gray-600 font-medium">Actual Delivery</span>
                    <span className="font-bold text-green-600">{formatDate(delivered_at) || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button className="w-full py-2.5 rounded-lg bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <FiMail className="w-4 h-4" />
                  Need Help? Contact Support
                </button>
                <button className="w-full py-2.5 rounded-lg bg-orange-50 text-orange-700 font-medium text-sm border border-orange-200 hover:bg-orange-100 transition-colors flex items-center justify-center gap-2">
                  <FiRefreshCw className="w-4 h-4" />
                  Return / Replace
                </button>
                <Link
                  href={`/orders/${orderIdFromData}`}
                  className="w-full py-2.5 rounded-lg bg-blue-50 text-blue-700 font-medium text-sm border border-blue-200 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                >
                  <FiPackage className="w-4 h-4" />
                  View Order Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}