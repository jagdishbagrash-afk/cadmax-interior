import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Listing from "@/pages/api/Listing";
import { useRole } from "@/context/RoleContext";
import toast from "react-hot-toast";
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
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import { FaBox, FaCheck } from "react-icons/fa";

// Default Mock Data matching exact prompt & UI design image
const DEFAULT_ORDER_DATA = {
  orderHeader: {
    orderId: "#ORD-792456",
    rawOrderId: "ORD-792456",
    placedOn: "23 July 2026, 12:47 PM",
    status: "Order Placed",
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
      completed: false,
      timestamp: "--",
      iconType: "check",
    },
    {
      step: 3,
      key: "shipped",
      title: "Shipped",
      completed: false,
      timestamp: "--",
      iconType: "truck",
    },
    {
      step: 4,
      key: "out_for_delivery",
      title: "Out for Delivery",
      completed: false,
      timestamp: "--",
      iconType: "box",
    },
    {
      step: 5,
      key: "delivered",
      title: "Delivered",
      completed: false,
      timestamp: "--",
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
    shippedOn: "--",
    deliveredOn: "--",
    status: "Order Placed",
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
  const { user } = useRole();
  const orderId = orderIdProp || router.query?.id || router.query?.orderId || "ORD-792456";

  const [orderData, setOrderData] = useState(() => ({
    ...DEFAULT_ORDER_DATA,
    orderHeader: {
      ...DEFAULT_ORDER_DATA.orderHeader,
      status: "Order Placed",
    },
    stepperTimeline: DEFAULT_ORDER_DATA.stepperTimeline.map((step, index) => ({
      ...step,
      completed: index === 0,
    })),
    shipmentDetails: {
      ...DEFAULT_ORDER_DATA.shipmentDetails,
      status: "Order Placed",
      shippedOn: "--",
      deliveredOn: "--",
    },
  }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const header = orderData.orderHeader;
  const stepper = orderData.stepperTimeline;
  const products = orderData.products;
  const address = orderData.shippingAddress;
  const payment = orderData.paymentMethod;
  const summary = orderData.orderSummary;
  const shipment = orderData.shipmentDetails;
  const estDelivery = orderData.estimatedDeliveryInformation;
  const handleBuyAgain = (product) => {
    const productSlug =
      product?.slug ||
      product?.productSlug ||
      product?.handle ||
      product?.seoSlug ||
      product?.urlSlug ||
      product?.productUrl?.slug ||
      product?.url?.slug ||
      product?.title ||
      product?.name ||
      "";

    const toSlug = (text) =>
      String(text || "")
        .trim()
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    const finalProductSlug = toSlug(productSlug) || toSlug(product?.productId) || toSlug(product?.title) || "";

    if (finalProductSlug) {
      router.push(`/product/details/${encodeURIComponent(finalProductSlug)}`);
      return;
    }

    router.push("/products");
  };

  const handleWriteReviewForProduct = (product) => {
    const toSlug = (text) =>
      String(text || "")
        .trim()
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    const productSlug =
      product?.slug ||
      product?.productSlug ||
      product?.handle ||
      product?.seoSlug ||
      product?.urlSlug ||
      product?.productUrl?.slug ||
      product?.url?.slug ||
      product?.title ||
      product?.name ||
      "";

    const finalProductSlug =
      toSlug(productSlug) ||
      toSlug(product?.productId) ||
      toSlug(product?.title) ||
      "";

    const hasLoggedInUser = !!(
      user?._id ||
      user?.id ||
      user?.email ||
      (typeof window !== "undefined" && localStorage.getItem("token"))
    );

    if (!hasLoggedInUser) {
      toast.error("Please login to write a review");
      router.push("/login");
      return;
    }

    if (user && user.role && user.role !== "customer") {
      toast.error("Only customers can write product reviews");
      return;
    }

    if (!finalProductSlug) {
      toast.error("Product review is not available for this item right now.");
      return;
    }

    router.push({
      pathname: `/product/details/${encodeURIComponent(finalProductSlug)}`,
      query: { writeReview: "1" },
    });
  };
  // Replace the activeTrackingStepIndex / truckMarkerLeft block with this:


  const extractPincode = (str) => {
    if (!str) return null;
    const match = String(str).match(/\b\d{6}\b/);
    return match ? match[0] : null;
  };

  const mapLiveTrackingEventsToStepper = (events) => {
    if (!Array.isArray(events) || events.length === 0) return null;
    return events.map((evt, idx) => ({
      step: idx + 1,
      key: evt.key || evt.status || `step_${idx + 1}`,
      title: evt.title || evt.status || evt.event || evt.label || `Event ${idx + 1}`,
      completed: evt.completed ?? true,
      timestamp: evt.timestamp || evt.date || evt.time || evt.shippedOn || "--",
      iconType: evt.iconType || (idx === 0 ? "cart" : idx === 1 ? "check" : idx === 2 ? "truck" : idx === 3 ? "box" : "delivered"),
    }));
  };

  const mergeOrderData = (apiData) => {
    const dataShipment = apiData?.shipment || apiData?.data?.shipment || {};
    const dataOrder = apiData?.order || apiData?.data?.order || {};
    const formattedWeb = apiData?.formattedForWeb || apiData?.data?.formattedForWeb || {};

    const rawShipmentDetails = formattedWeb?.shipmentDetails || apiData?.shipmentDetails || {};
    const rawEstDelivery = formattedWeb?.estimatedDeliveryInformation || apiData?.estimatedDeliveryInformation || {};

    // 1. AWB / Tracking Number Hierarchy
    const awbNumber =
      dataShipment?.awbNumber ||
      dataShipment?.trackingNumber ||
      dataOrder?.tracking_number ||
      dataOrder?.awbNumber ||
      formattedWeb?.shipmentDetails?.trackingId ||
      rawShipmentDetails?.trackingId ||
      dataShipment?.trackingNo ||
      dataOrder?.trackingNumber ||
      dataOrder?.awb_number ||
      apiData?.trackingNumber ||
      apiData?.awbNumber ||
      apiData?.tracking_number ||
      DEFAULT_ORDER_DATA.shipmentDetails.trackingId;

    // 2. Courier Partner Hierarchy
    const courierPartner =
      dataShipment?.courierPartner ||
      dataOrder?.courier_name ||
      formattedWeb?.shipmentDetails?.courierPartner ||
      rawShipmentDetails?.courierPartner ||
      dataShipment?.courierName ||
      dataShipment?.carrier ||
      dataShipment?.courier ||
      dataOrder?.courier_partner ||
      DEFAULT_ORDER_DATA.shipmentDetails.courierPartner;

    // 3. Shipping Status Hierarchy
    const shippingStatus =
      dataShipment?.shippingStatus ||
      dataOrder?.shipping_status ||
      rawShipmentDetails?.status ||
      dataShipment?.status ||
      dataOrder?.status ||
      DEFAULT_ORDER_DATA.shipmentDetails.status;

    // 4. Dispatch Date Hierarchy
    const dispatchDate =
      dataShipment?.dispatchDate ||
      formattedWeb?.shipmentDetails?.shippedOn ||
      dataOrder?.createdAt ||
      rawShipmentDetails?.shippedOn ||
      dataShipment?.shippedOn ||
      dataShipment?.createdAt ||
      DEFAULT_ORDER_DATA.shipmentDetails.shippedOn;

    // Stepper Timeline: data.formattedForWeb.stepperTimeline || data.shipment.syncedTransit.liveTracking.events
    let stepperEvents =
      formattedWeb?.stepperTimeline?.length > 0
        ? formattedWeb.stepperTimeline
        : apiData?.stepperTimeline?.length > 0
          ? apiData.stepperTimeline
          : dataShipment?.syncedTransit?.liveTracking?.events?.length > 0
            ? mapLiveTrackingEventsToStepper(dataShipment.syncedTransit.liveTracking.events)
            : DEFAULT_ORDER_DATA.stepperTimeline;

    // Estimated Delivery Hierarchy
    const estDeliveryVal =
      formattedWeb?.estimatedDeliveryInformation?.estDelivery ||
      rawEstDelivery?.estDelivery ||
      rawEstDelivery?.expectedDateDelivery ||
      dataShipment?.estDelivery;

    return {
      orderHeader: {
        ...DEFAULT_ORDER_DATA.orderHeader,
        ...apiData.orderHeader,
        orderId: dataOrder?.orderId
          ? (String(dataOrder.orderId).startsWith("#") ? dataOrder.orderId : `#${dataOrder.orderId}`)
          : (apiData.orderHeader?.orderId || DEFAULT_ORDER_DATA.orderHeader.orderId),
        rawOrderId: dataOrder?.orderId || apiData.orderHeader?.rawOrderId || DEFAULT_ORDER_DATA.orderHeader.rawOrderId,
        status: shippingStatus || apiData.orderHeader?.status || DEFAULT_ORDER_DATA.orderHeader.status,
      },
      stepperTimeline: stepperEvents,
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
        ...rawShipmentDetails,
        trackingId: awbNumber,
        courierPartner: courierPartner,
        status: shippingStatus,
        shippedOn: dispatchDate,
      },
      estimatedDeliveryInformation: {
        ...DEFAULT_ORDER_DATA.estimatedDeliveryInformation,
        ...rawEstDelivery,
        estDelivery: estDeliveryVal || DEFAULT_ORDER_DATA.estimatedDeliveryInformation.estDelivery,
        orderedOn: dataOrder?.createdAt
          ? (typeof dataOrder.createdAt === "string" && dataOrder.createdAt.includes("T")
            ? new Date(dataOrder.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
            : dataOrder.createdAt)
          : (rawEstDelivery?.orderedOn || DEFAULT_ORDER_DATA.estimatedDeliveryInformation.orderedOn),
      },
      footerActions: {
        ...DEFAULT_ORDER_DATA.footerActions,
        ...apiData.footerActions,
      },
    };
  };

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const listing = new Listing();
        const res = await listing.GetWebOrderDetails(orderId);

        const payload = res?.data?.data || res?.data || {};
        if (payload) {
          const merged = mergeOrderData(payload);
          console.log("========== ORDER DATA ==========");
          console.log("Order ID:", orderId);
          console.log("Payload:", payload);
          console.log("Merged Order Data:", merged);
          console.log("================================");
          setOrderData(merged);

          // Pincode Transit Tracking fallback hit if estimated delivery is missing
          const currentEst =
            payload?.formattedForWeb?.estimatedDeliveryInformation?.estDelivery ||
            payload?.data?.formattedForWeb?.estimatedDeliveryInformation?.estDelivery ||
            payload?.estimatedDeliveryInformation?.estDelivery;

          const targetPincode =
            payload?.shippingAddress?.pincode ||
            payload?.order?.addressId?.pincode ||
            payload?.data?.order?.addressId?.pincode ||
            extractPincode(payload?.shippingAddress?.address) ||
            extractPincode(DEFAULT_ORDER_DATA.shippingAddress.address);

          if (!currentEst && targetPincode && /^\d{4,10}$/.test(String(targetPincode).trim())) {
            try {
              const transitRes = await listing.GetTransitTimeByPincode({ toPincode: String(targetPincode).trim() });
              const transitData = transitRes?.data?.data || transitRes?.data || {};
              const fetchedEst =
                transitData.expectedDateDelivery ||
                transitData.transitEstimate?.expectedDateDelivery ||
                transitData.estDelivery;

              if (fetchedEst) {
                setOrderData((prev) => ({
                  ...prev,
                  estimatedDeliveryInformation: {
                    ...prev.estimatedDeliveryInformation,
                    estDelivery: fetchedEst,
                  },
                }));
              }
            } catch (transitErr) {
              console.warn("Pincode transit time fetch notice:", transitErr?.message);
            }
          }
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

  const handleDownloadInvoice = async () => {
    if (typeof window === "undefined") return;

    const findPdfUrlInObject = (value, visited = new WeakSet()) => {
      if (!value) return null;

      if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("data:application/pdf")) return trimmed;
        if (trimmed.startsWith("blob:")) return trimmed;
        if (/^https?:\/\//i.test(trimmed) && /(amazonaws|s3\.|cloudfront|\.pdf(?:\?|$)|\/pdf(?:\/|\?|$)|invoice|download)/i.test(trimmed)) {
          return trimmed;
        }

        if (
          /^https?:\/\//i.test(trimmed) ||
          trimmed.startsWith("/") ||
          trimmed.startsWith("./")
        ) {
          if (
            /(\.pdf(?:\?|$)|\/pdf(?:\/|\?|$)|\/invoice(?:\/|\?|$)|invoice|download|amazonaws|s3\.|cloudfront)/i.test(trimmed)
          ) {
            return trimmed;
          }
        }

        return null;
      }

      if (typeof value !== "object") return null;
      if (visited.has(value)) return null;
      visited.add(value);

      if (Array.isArray(value)) {
        for (const item of value) {
          const match = findPdfUrlInObject(item, visited);
          if (match) return match;
        }
        return null;
      }

      for (const [key, val] of Object.entries(value)) {
        const lowered = String(key).toLowerCase();
        const isLikelyPdfKey = /pdf|invoice|download|file|url|document|aws|s3|bucket|signed|blob/.test(lowered);

        if (isLikelyPdfKey || (typeof val === "string" && /(\.pdf|amazonaws|s3\.|cloudfront)/i.test(val))) {
          const match = findPdfUrlInObject(val, visited);
          if (match) return match;
        }
      }

      for (const val of Object.values(value)) {
        const match = findPdfUrlInObject(val, visited);
        if (match) return match;
      }

      return null;
    };

    const extractErrorMessage = (error) => {
      const data = error?.response?.data || error?.data || {};
      if (typeof data === "string") return data;

      if (typeof data === "object") {
        return (
          data.message ||
          data.Message ||
          data.error ||
          data.error_message ||
          data.errorMessage ||
          ""
        );
      }

      return error?.message || "";
    };

    const openPdfWindow = (pdfUrl) => {
      if (!pdfUrl) return false;

      const safeUrl = String(pdfUrl).trim();

      if (!safeUrl) return false;

      // Base64 PDF / Blob PDF
      if (
        safeUrl.startsWith("data:application/pdf") ||
        safeUrl.startsWith("blob:")
      ) {
        window.open(safeUrl, "_blank", "noopener,noreferrer");
        return true;
      }

      const productionApiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.NEXT_PUBLIC_BASE_URL ||
        "";

      if (!productionApiUrl) {
        if (safeUrl.startsWith("http://") || safeUrl.startsWith("https://") || safeUrl.startsWith("/")) {
          window.open(safeUrl, "_blank", "noopener,noreferrer");
          return true;
        }

        console.error(
          "NEXT_PUBLIC_API_URL or NEXT_PUBLIC_BASE_URL is missing"
        );
        return false;
      }

      // Remove trailing slash
      const cleanBase = String(productionApiUrl).replace(/\/+$/, "");

      // Remove /api only for file URLs
      const serverOrigin = cleanBase.replace(/\/api$/, "");

      let finalUrl = "";

      try {
        const parsed = new URL(safeUrl);

        const isLocalUrl =
          parsed.hostname === "localhost" ||
          parsed.hostname === "127.0.0.1" ||
          parsed.hostname === "0.0.0.0";

        if (isLocalUrl) {
          // IMPORTANT:
          // localhost URL -> LIVE SERVER URL

          finalUrl =
            `${serverOrigin}${parsed.pathname}${parsed.search}${parsed.hash}`;

          console.log("Original local invoice URL:", safeUrl);
          console.log("Converted live invoice URL:", finalUrl);
        } else {
          // Already production URL
          finalUrl = safeUrl;
        }
      } catch (error) {
        // Relative URL
        if (safeUrl.startsWith("/")) {
          finalUrl = `${serverOrigin}${safeUrl}`;
        } else {
          finalUrl = `${serverOrigin}/${safeUrl.replace(/^\.?\//, "")}`;
        }
      }

      if (!finalUrl) {
        return false;
      }

      console.log("Opening invoice:", finalUrl);

      window.open(
        finalUrl,
        "_blank",
        "noopener,noreferrer"
      );

      return true;
    };

    const directPdfUrl =
      findPdfUrlInObject(orderData) ||
      findPdfUrlInObject(orderData?.invoice) ||
      findPdfUrlInObject(orderData?.data) ||
      findPdfUrlInObject(orderData?.formattedForWeb) ||
      findPdfUrlInObject(orderData?.shipmentDetails) ||
      orderData?.shipmentDetails?.actions?.invoiceUrl ||
      orderData?.shipmentDetails?.actions?.invoiceDownloadUrl ||
      orderData?.shipmentDetails?.actions?.downloadInvoiceUrl;

    if (directPdfUrl && openPdfWindow(directPdfUrl)) {
      toast.success("Invoice opened in a new tab.");
      return;
    }

    try {
      const listing = new Listing();
      const res = await listing.DownloadOrderInvoice(orderId);
      const responseData = res?.data;

      const pdfUrlFromApi =
        res?.invoiceUrl ||
        res?.awsUrl ||
        res?.pdfUrl ||
        res?.downloadUrl ||
        res?.fileUrl ||
        res?.signedUrl ||
        res?.url ||
        responseData?.pdfUrl ||
        responseData?.downloadUrl ||
        responseData?.invoiceUrl ||
        responseData?.awsUrl ||
        responseData?.fileUrl ||
        responseData?.signedUrl ||
        responseData?.url ||
        responseData?.data?.pdfUrl ||
        responseData?.data?.downloadUrl ||
        responseData?.data?.invoiceUrl ||
        responseData?.data?.awsUrl ||
        responseData?.data?.fileUrl ||
        responseData?.data?.signedUrl ||
        responseData?.data?.url ||
        findPdfUrlInObject(responseData);
      if (pdfUrlFromApi && openPdfWindow(pdfUrlFromApi)) {
        toast.success("Invoice opened in a new tab.");
        return;
      }

      toast.error("Invoice PDF URL is not available right nowwww.");
    } catch (error) {
      console.warn("Invoice download failed:", error);

      const pdfUrlFromError =
        error?.response?.data?.pdfUrl ||
        error?.response?.data?.downloadUrl ||
        error?.response?.data?.invoiceUrl ||
        error?.response?.data?.awsUrl ||
        error?.response?.data?.fileUrl ||
        error?.response?.data?.signedUrl ||
        error?.response?.data?.url ||
        findPdfUrlInObject(error?.response?.data) ||
        findPdfUrlInObject(error?.data);

      if (pdfUrlFromError && openPdfWindow(pdfUrlFromError)) {
        toast.success("Invoice opened in a new tab.");
        return;
      }

      const msg = extractErrorMessage(error);
      toast.error(msg || "Invoice PDF URL is not available right now catch.");
    }
  };

  const [isCancellingShipment, setIsCancellingShipment] = useState(false);
  const [cancelAlert, setCancelAlert] = useState(null); // { type: 'success' | 'warning', message: string }

  const handleCancelOrderShipment = async () => {
    const awbNo = orderData.shipmentDetails?.trackingId || orderData?.tracking_number || orderData?.awbNumber;
    if (!awbNo) {
      toast.error("No valid tracking number found for cancellation.");
      return;
    }

    try {
      setIsCancellingShipment(true);
      setCancelAlert(null);

      const listing = new Listing();
      const res = await listing.cancelWaybill({ AWBNo: awbNo });
      const data = res?.data || {};

      const isError = data.IsError === true || data.status === false || data.error === true;
      const backendMessage = data.message || data.Message || data.error_message || "";

      if (!isError && (data.IsError === false || data.status === true || data.success === true)) {
        const successMsg = `Your registered shipment ${awbNo} has been cancelled successfully`;
        setCancelAlert({
          type: "success",
          message: successMsg,
        });
        toast.success(successMsg);

        setOrderData((prev) => ({
          ...prev,
          orderHeader: {
            ...prev.orderHeader,
            status: "Cancelled",
          },
          shipmentDetails: {
            ...prev.shipmentDetails,
            status: "Cancelled",
          },
        }));
      } else {
        const warningMsg = backendMessage || "Waybill Number has been already cancelled.";
        setCancelAlert({
          type: "warning",
          message: warningMsg,
        });
        toast.error(warningMsg);
      }
    } catch (err) {
      console.error("Cancel order shipment error:", err);
      const data = err?.response?.data || {};
      const backendMessage = data.message || data.Message || err?.message || "Failed to cancel shipment";

      setCancelAlert({
        type: "warning",
        message: backendMessage,
      });
      toast.error(backendMessage);
    } finally {
      setIsCancellingShipment(false);
    }
  };

  const handleTrackShipment = () => {
    const trackingId = orderData.shipmentDetails?.trackingId || "1234567890";
    if (trackingId && trackingId !== "1234567890") {
      router.push?.(`/shipment/track/${encodeURIComponent(trackingId)}?courier=${encodeURIComponent(orderData.shipmentDetails?.courierPartner || "")}`);
    } else {
      alert(`Tracking Shipment #${trackingId} via ${orderData.shipmentDetails?.courierPartner}`);
    }
  };



  const normalizedShipmentStatus = String(shipment?.status || header?.status || "")
    .trim()
    .toLowerCase();

  const statusToStepIndex = {
    order_placed: 0,
    orderplaced: 0,
    placed: 0,
    confirmed: 1,
    shipped: 2,
    out_for_delivery: 3,
    outfordelivery: 3,
    out_for_delivery_pending: 3,
    delivered: 4,
  };


  const currentStatusStepIndex = (() => {
    if (!normalizedShipmentStatus) return 0;

    const exactMatch = statusToStepIndex[normalizedShipmentStatus];
    if (typeof exactMatch === "number") return exactMatch;

    if (normalizedShipmentStatus.includes("confirm")) return 1;
    if (normalizedShipmentStatus.includes("ship")) return 2;
    if (normalizedShipmentStatus.includes("out") || normalizedShipmentStatus.includes("delivery")) return 3;
    if (normalizedShipmentStatus.includes("deliver")) return 4;
    return 0;
  })();

  const hasKnownStatusStep = (() => {
    if (!normalizedShipmentStatus) return false;
    return (
      statusToStepIndex[normalizedShipmentStatus] !== undefined ||
      normalizedShipmentStatus.includes("confirm") ||
      normalizedShipmentStatus.includes("ship") ||
      normalizedShipmentStatus.includes("out") ||
      normalizedShipmentStatus.includes("delivery") ||
      normalizedShipmentStatus.includes("deliver")
    );
  })();

  const activeTrackingStepIndex = (() => {
    if (hasKnownStatusStep) {
      return Math.min(currentStatusStepIndex, stepper.length - 1);
    }

    const firstIncomplete = stepper.findIndex((item) => !item.completed);

    if (firstIncomplete === -1) {
      return Math.max(stepper.length - 1, 0);
    }

    return firstIncomplete;
  })();

  const carMarkerLeft = stepper.length
    ? (() => {
      if (normalizedShipmentStatus === "delivered") {
        return `${((stepper.length - 1 + 0.96) / stepper.length) * 100}%`;
      }

      const baseIndex = Math.min(currentStatusStepIndex, stepper.length - 1);
      const betweenOffset = normalizedShipmentStatus === "placed" || normalizedShipmentStatus === "order_placed" || normalizedShipmentStatus === "orderplaced"
        ? 0.32
        : normalizedShipmentStatus.includes("confirm")
          ? 0.56
          : normalizedShipmentStatus.includes("ship")
            ? 0.0
            : normalizedShipmentStatus.includes("out") || normalizedShipmentStatus.includes("delivery")
              ? 0.88
              : 0.96;

      return `${((baseIndex + betweenOffset) / stepper.length) * 100}%`;
    })()
    : "50%";

  return (
    <div className="min-h-screen bg-[#f8fafc] py-6 sm:py-8 px-3 sm:px-6 lg:px-8 text-gray-800 font-sans">
      <div className="max-w-[1430px] mx-auto space-y-5 sm:space-y-6">

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
              <div className="relative z-10">
                <div
                  className="absolute z-30 pointer-events-none"
                  style={{
                    left: carMarkerLeft,
                    top: "52px",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="w-8 h-8 shadow-sm flex items-center justify-center">
                    <img
                      src="/car-marker.png"
                      alt="Current shipment position"

                    />
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2 relative z-10 pt-8">
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
                              className={`absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-[2px] ${isCompleted ? "bg-[#22c55e]" : "bg-gray-200"
                                }`}
                            />
                          )}

                          {/* Connecting Line (right side) */}
                          {!isLast && (
                            <div
                              className={`absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[2px] ${stepper[idx + 1]?.completed ? "bg-[#22c55e]" : "bg-gray-200"
                                }`}
                            />
                          )}

                          {/* ICON CIRCLE BADGE */}
                          <div
                            className={`relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
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
                            className={`text-xs sm:text-sm font-bold transition-colors ${isCompleted ? "text-gray-900" : "text-gray-400"
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
                    onClick={() => handleBuyAgain(prod)}
                    className="flex-1 sm:flex-none border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold px-5 py-2.5 rounded-lg text-sm transition-all active:scale-95 text-center"
                  >
                    Buy Again
                  </button>

                  <button
                    type="button"
                    onClick={() => handleWriteReviewForProduct(prod)}
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

              <div className="flex items-center gap-3 flex-wrap">
                {String(shipment?.status || header?.status || "").toLowerCase() !== "delivered" && (
                  <button
                    type="button"
                    onClick={handleCancelOrderShipment}
                    disabled={isCancellingShipment || String(shipment?.status || "").toLowerCase() === "cancelled"}
                    className="border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-bold px-4 py-2 rounded-lg text-sm transition-all inline-flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCancellingShipment ? (
                      <>
                        <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                        Cancelling...
                      </>
                    ) : (
                      "Cancel Order Shipment"
                    )}
                  </button>
                )}

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

            {/* ALERT CARD FOR SHIPMENT CANCELLATION */}
            {cancelAlert && (
              <div
                className={`p-4 rounded-xl border shadow-xs flex items-center justify-between gap-3 ${cancelAlert.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-amber-50 border-amber-200 text-amber-900"
                  }`}
              >
                <div className="flex items-center gap-3">
                  {cancelAlert.type === "success" ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <HiCheck className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                      <HiOutlineExclamationTriangle className="w-4 h-4" />
                    </div>
                  )}
                  <p className="text-sm font-semibold">{cancelAlert.message}</p>
                </div>
                <button
                  onClick={() => setCancelAlert(null)}
                  className="text-xs font-bold text-gray-400 hover:text-gray-600"
                >
                  &times;
                </button>
              </div>
            )}


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
                  {shipment.deliveredOn || "--"}
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
                      {estDelivery.estShipping || "--"}
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
                      {estDelivery.actualDelivery || "--"}
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
                  <Link
                    href="/contact"
                    className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline inline-block mt-0.5"
                  >
                    Contact Support
                  </Link>
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
