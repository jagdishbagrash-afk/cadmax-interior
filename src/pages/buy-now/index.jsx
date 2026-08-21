import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Layout from "../common/Layout";
import Listing from "../api/Listing";
import { useRouter } from "next/router";
import { useRole } from "@/context/RoleContext";
import Banner from "@/components/Banner";
import BannerImages from "../../Assets/Images/Frame18.jpg";
import { useRazorpay } from "react-razorpay";
import Link from "next/link";
import { formatPrice } from "@/components/formatPrice";
import {
  extractOrderAndShipment,
  buildTransitDisplay,
  formatTransitDate,
  buildDeliveryDateRange,
} from "@/components/shipmentUtils";
import {
  FiShield,
  FiTruck,
  FiAward,
  FiHeadphones,
  FiArrowRight,
  FiCreditCard,
  FiMapPin,
  FiUser,
  FiPhone,
  FiClock,
} from "react-icons/fi";
import { BiRupee } from "react-icons/bi";
import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";

export default function Index() {
  const { Razorpay } = useRazorpay();
  const router = useRouter();
  const { user } = useRole();
  const RAZOPAY_KEY = process.env.NEXT_PUBLIC_RAZOPAY_KEY;

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [data, setData] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [transitTimeResponse, setTransitTimeResponse] = useState(null);
  const [transitTimeLoading, setTransitTimeLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    addressId: "",
  });

  const selectedAddress = data.find((item) => item._id === formData.addressId);
  const selectedAddressText = selectedAddress
    ? `${selectedAddress.street_address}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country} - ${selectedAddress.pincode} (${selectedAddress.addressType})`
    : "";

  // --- Effects (unchanged) ---
  useEffect(() => {
    const queryValue =
      router.query.paymentMethod || router.query.payment_method || "";
    const pm =
      String(Array.isArray(queryValue) ? queryValue[0] : queryValue)
        .trim()
        .toUpperCase() === "COD"
        ? "COD"
        : "ONLINE";
    setPaymentMethod(pm);
  }, [router.query.paymentMethod, router.query.payment_method]);

  const buildOrderProducts = () => {
    if (!product) return [];
    return [
      {
        id: product.productId || product.id,
        sku: product.productId || product.id,
        title: product.name,
        name: product.name,
        price: product.final_amount ?? product.price ?? 0,
        originalPrice: product.originalPrice ?? 0,
        discount: product.discount_amount ?? 0,
        quantity: product.quantity ?? 1,
        total:
          (product.final_amount ?? product.price ?? 0) * (product.quantity ?? 1),
        variant: product.variant,
        variantTitle: product.variant,
        priceSection: product.selectedPriceSection || null,
        priceSectionTitle: product.selectedPriceSection?.title || "",
        size: product.selectedSize?.title || "",
        dimensions: product.dimensions || product.product?.dimensions,
        product: product.product || null,
      },
    ];
  };

  useEffect(() => {
    const item = JSON.parse(localStorage.getItem("buyNowItem"));
    if (!item) {
      router.push("/");
      return;
    }
    setProduct(item);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user?.name || "",
        mobile: user?.phone ? String(user.phone) : "",
      }));
    }
  }, [user]);

  const fetchAddress = async () => {
    try {
      const main = new Listing();
      const response = await main.AddressList();
      if (response?.data?.data?.addresses) {
        setData(response.data.data.addresses);
      } else {
        setData([]);
      }
    } catch (error) {
      console.log(error);
      setData([]);
    }
  };

  const fetchTransitTime = async (targetAddress, isCodFlag) => {
    const toPincode = targetAddress?.pincode;
    if (!toPincode || String(toPincode).trim().length < 6) {
      setTransitTimeResponse(null);
      return;
    }
    setTransitTimeLoading(true);
    try {
      const main = new Listing();
      const response = await main.GetTransitTimeByPincode({
        toPincode: String(toPincode).trim(),
        fromPincode: "302001",
        isCod: Boolean(isCodFlag),
      });
      setTransitTimeResponse(response);
    } catch (err) {
      console.error("BUY-NOW TRANSIT TIME FETCH ERROR:", err?.response?.data || err?.message);
      setTransitTimeResponse(null);
    } finally {
      setTransitTimeLoading(false);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  useEffect(() => {
    fetchTransitTime(selectedAddress, isCOD);
  }, [formData.addressId, paymentMethod]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      if (value.length <= 10 && /^[0-9]*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const subtotal = (product?.originalPrice || 0) * (product?.quantity || 1);
  const discountTotal = (product?.discount_amount || 0) * (product?.quantity || 1);
  const finalTotal = (product?.final_amount || 0) * (product?.quantity || 1);
  const additionalDiscount = subtotal * 0.1;

  // --- Payment handlers (unchanged) ---
  const handlePaymentCreateSubmit = async (e) => {
    e.preventDefault();
    if (!product) {
      toast.error("Product not found");
      return;
    }
    if (String(formData.mobile).length !== 10) {
      toast.error("Mobile number must be exactly 10 digits");
      return;
    }
    if (paymentMethod === "COD") {
      await handleCODSubmit();
      return;
    }
    setLoading(true);
    try {
      const main = new Listing();
      const res = await main.AddPaymentCreate({
        amount: finalTotal,
        currency: "INR",
        receipt: "receipt#1",
      });
      if (res?.data?.orderId) {
        const options = {
          key: RAZOPAY_KEY,
          amount: Math.round(finalTotal * 100),
          currency: "INR",
          name: "Cadmaxatelier",
          description: "Product Payment",
          order_id: res.data.orderId,
          handler: function (response) {
            handleSubmit(response);
            toast.success("Payment Successful");
          },
          prefill: {
            name: formData.name,
            contact: formData.mobile,
          },
          theme: {
            color: "#D4AF37",
          },
        };
        const rzp = new Razorpay(options);
        rzp.on("payment.failed", function () {
          router.push("/cancel");
        });
        rzp.open();
      }
    } catch (error) {
      console.log(error);
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCODSubmit = async () => {
    try {
      setLoading(true);
      const main = new Listing();
      const productData = buildOrderProducts();
      const res = await main.AddOrder({
        name: formData.name,
        mobile: formData.mobile,
        addressId: formData.addressId,
        address: selectedAddressText,
        product: productData,
        subtotal,
        discountAmount: discountTotal,
        amount: finalTotal,
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        PaymentId: "",
      });
      if (!res?.data?.status) {
        toast.error(res?.data?.message || "COD order failed");
        return;
      }
      const orderId = res?.data?.data?.order?._id;
      if (!orderId) {
        toast.error("Order ID not received");
        return;
      }
      await saveCODShipment(orderId);
    } catch (error) {
      console.error("COD order error:", error?.response?.data || error);
      toast.error(error?.response?.data?.message || "COD order failed");
    } finally {
      setLoading(false);
    }
  };

  const saveCODShipment = async (orderId) => {
    try {
      const main = new Listing();
      const shippingProvider = process.env.NEXT_PUBLIC_SHIPPING_PROVIDER;
      const response = await main.VerifyPayment({
        order_id: `COD-${orderId}`,
        payment_id: "",
        currency: "INR",
        product_name: [product?.name],
        amount: finalTotal,
        type: "product",
        payment_method: "COD",
        paymentMethod: "COD",
        payment_status: "pending",
        PaymentStatus: "PENDING",
        cod_amount: finalTotal,
        collectable_amount: finalTotal,
        OrderID: orderId,
        shipping_provider: shippingProvider || undefined,
      });
      if (!response?.data?.status) {
        toast.error(response?.data?.message || "Order created but shipment failed");
        router.push(`/success?orderId=${orderId}`);
        return;
      }
      const { order, shipment, trackingNumber } = extractOrderAndShipment(response);
      const fallbackOrder = {
        ...(order || {}),
        name: formData.name,
        mobile: formData.mobile,
        addressId: formData.addressId,
        address: selectedAddressText,
        amount: finalTotal,
        product: buildOrderProducts(),
        paymentMethod: "COD",
        paymentStatus: "PENDING",
      };
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "latestShipmentState",
          JSON.stringify({
            orderId,
            trackingNumber: trackingNumber || "",
            order: fallbackOrder,
            shipment: shipment || null,
            shipToAddress: selectedAddress || null,
            paymentMethod: "COD",
          })
        );
      }
      localStorage.removeItem("buyNowItem");
      toast.success("COD order and shipment created successfully");
      const query = new URLSearchParams();
      query.set("orderId", orderId);
      if (trackingNumber) {
        query.set("trackingNumber", trackingNumber);
      }
      router.push(`/success?${query.toString()}`);
    } catch (error) {
      console.error("COD shipment error:", error?.response?.data || error);
      toast.error(error?.response?.data?.message || "Order created but shipment generation failed");
    }
  };

  const handleSubmit = async (response, options = {}) => {
    try {
      setLoading(true);
      const activePaymentMethod = options.paymentMethod || paymentMethod;
      const main = new Listing();
      const productData = buildOrderProducts();
      const res = await main.AddOrder({
        name: formData.name,
        mobile: formData.mobile,
        addressId: formData.addressId,
        address: selectedAddressText,
        product: productData,
        subtotal,
        discountAmount: discountTotal,
        amount: finalTotal,
        paymentMethod: activePaymentMethod,
        PaymentId: response?.razorpay_payment_id || "",
        orderId: response?.razorpay_order_id || "",
      });
      const createdOrderId = res?.data?.data?._id || res?.data?.data?.order?._id || null;
      if (!createdOrderId) {
        toast.error("Order creation failed: missing order ID");
        return;
      }
      if (res?.data?.status) {
        await savePaymentDetails(
          response?.razorpay_order_id,
          response?.razorpay_payment_id,
          "success",
          createdOrderId,
          {
            razorpaySignature: response?.razorpay_signature,
            paymentMethod: activePaymentMethod,
          }
        );
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Order failed");
    } finally {
      setLoading(false);
    }
  };

  const persistLatestShipmentState = ({
    responsePayload,
    orderId,
    fallbackOrder,
    fallbackShipment = null,
    fallbackTrackingNumber = "",
  }) => {
    if (typeof window === "undefined") return;
    const { order, shipment, trackingNumber } = extractOrderAndShipment(responsePayload);
    sessionStorage.setItem(
      "latestShipmentState",
      JSON.stringify({
        orderId: orderId || order?._id || null,
        trackingNumber: trackingNumber || fallbackTrackingNumber || "",
        order: fallbackOrder || order || null,
        shipment: shipment || fallbackShipment || null,
        shipToAddress: selectedAddress || null,
      })
    );
  };

  const goToSuccessPage = ({ orderId, responsePayload, fallbackTrackingNumber = "" }) => {
    const { order, trackingNumber } = extractOrderAndShipment(responsePayload);
    const query = new URLSearchParams();
    if (orderId || order?._id) {
      query.set("orderId", orderId || order?._id);
    }
    if (trackingNumber || fallbackTrackingNumber) {
      query.set("trackingNumber", trackingNumber || fallbackTrackingNumber);
    }
    router.push(query.toString() ? `/success?${query.toString()}` : "/success");
  };

  const savePaymentDetails = async (
    orderId,
    paymentId,
    payment_status,
    Orderdatas,
    options = {}
  ) => {
    try {
      const main = new Listing();
      const shippingProvider = process.env.NEXT_PUBLIC_SHIPPING_PROVIDER;
      const paymentMethod = options.paymentMethod || "ONLINE";
      const razorpaySignature = options.razorpaySignature || "";

      if (
        paymentMethod === "ONLINE" &&
        (!orderId || !paymentId || !razorpaySignature)
      ) {
        toast.error(
          "Payment verification failed because Razorpay payment details are incomplete."
        );
        return;
      }

      const payload = /** @type {any} */ ({
        OrderID: Orderdatas,
        amount: finalTotal,
        currency: "INR",
        payment_status,
        payment_method: paymentMethod,
        type: "product",
      });

      if (paymentMethod === "ONLINE") {
        payload.razorpay_order_id = orderId;
        payload.razorpay_payment_id = paymentId;
        payload.razorpay_signature = razorpaySignature;
        if (orderId) {
          payload.order_id = orderId;
        }
        if (paymentId) {
          payload.payment_id = paymentId;
        }
      }

      if (shippingProvider) {
        payload.shipping_provider = shippingProvider;
      }

      const response = await main.VerifyPayment(payload);
      const fallbackOrder = {
        name: formData.name || "",
        mobile: formData.mobile || "",
        addressId: formData.addressId || "",
        address: selectedAddressText || "",
        amount: finalTotal || 0,
        product: buildOrderProducts(),
      };

      if (response?.data?.status) {
        const { order, shipment, trackingNumber } = extractOrderAndShipment(response);
        persistLatestShipmentState({
          responsePayload: response,
          orderId: Orderdatas || order?._id || null,
          fallbackOrder: {
            ...fallbackOrder,
            ...(order || {}),
          },
          fallbackShipment: shipment,
          fallbackTrackingNumber: trackingNumber || "",
        });
        localStorage.removeItem("buyNowItem");
        toast.success(response.data.message);
        goToSuccessPage({
          orderId: Orderdatas || order?._id || null,
          responsePayload: response,
          fallbackTrackingNumber: trackingNumber || "",
        });
      } else {
        persistLatestShipmentState({
          responsePayload: response,
          orderId: Orderdatas || null,
          fallbackOrder,
        });
        localStorage.removeItem("buyNowItem");
        toast.error(
          response?.data?.message ||
          "Order placed successfully, but shipment creation is pending."
        );
        goToSuccessPage({
          orderId: Orderdatas || null,
          responsePayload: response,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Payment save failed");
    }
  };

  const isCOD = paymentMethod === "COD";

  const etaDisplay = (() => {
    const display = buildTransitDisplay(transitTimeResponse);
    const deliveryFormatted = formatTransitDate(display.deliveryDate);
    const podFormatted = formatTransitDate(display.podDate);
    const deliveryRange = buildDeliveryDateRange(display.deliveryDate, display.podDate);
    const deliveryPincode = selectedAddress?.pincode || "";

    let mainDeliveryText = "—";
    if (deliveryRange && deliveryRange !== "—") {
      mainDeliveryText = deliveryRange;
    } else if (deliveryFormatted) {
      mainDeliveryText = deliveryFormatted;
    }

    let deliveryByLabel = "";
    if (deliveryFormatted && !display.isError) {
      deliveryByLabel = `Delivery by ${deliveryFormatted}`;
    }

    let podLabel = "";
    if (podFormatted && !display.isError) {
      podLabel = `POD expected ${podFormatted}`;
    }

    let showCutoffChip = false;
    let cutoffLabel = "";
    if (display.isAfterCutoff && !display.isError) {
      showCutoffChip = true;
      cutoffLabel = "Pickup scheduled next business day";
    }

    return {
      ...display,
      deliveryFormatted,
      deliveryRange,
      podFormatted,
      deliveryPincode,
      mainDeliveryText,
      deliveryByLabel,
      podLabel,
      showCutoffChip,
      cutoffLabel,
      hasValidData: Boolean(
        transitTimeResponse && !display.isError && (deliveryFormatted || display.destinationCity)
      ),
    };
  })();

  // --- MODERN UI RENDER ---
  return (
    <Layout>
      <Banner Slider1={BannerImages} />

      <section className="w-full bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 md:py-16 lg:py-20 text-black antialiased">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-black mb-4">
              Buy Now
            </h1>
            <div className="w-24 h-1.5 bg-gradient-to-r from-[#D4AF37] to-amber-500 mx-auto mb-4 rounded-full"></div>
            <p className="text-gray-600 text-lg font-medium">Complete your purchase instantly</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* LEFT COLUMN – Shipping Form */}
            <div className="w-full lg:w-5/12">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100/80 lg:sticky lg:top-24 overflow-hidden transition-all duration-300 hover:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.15)]">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-7">
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                    <FiMapPin className="w-6 h-6 text-amber-400" />
                    Shipping Details
                  </h2>
                  <p className="text-gray-300 mt-1.5 text-sm">Enter your details to complete your order</p>
                </div>

                <form className="p-8" onSubmit={handlePaymentCreateSubmit}>
                  <div className="space-y-7">
                    {/* NAME */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2.5"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FiUser className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          placeholder="John Doe"
                          autoComplete="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-black transition-all duration-200 focus:border-black focus:bg-white focus:ring-0 outline-none placeholder:text-gray-400"
                          required
                        />
                      </div>
                    </div>

                    {/* MOBILE */}
                    <div>
                      <label
                        htmlFor="mobile"
                        className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2.5"
                      >
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FiPhone className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          id="mobile"
                          type="tel"
                          name="mobile"
                          placeholder="9876543210"
                          autoComplete="tel"
                          value={formData.mobile}
                          onChange={handleChange}
                          maxLength={10}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-black transition-all duration-200 focus:border-black focus:bg-white focus:ring-0 outline-none placeholder:text-gray-400"
                          required
                        />
                      </div>
                    </div>

                    {/* ADDRESS */}
                    <div>
                      <div className="flex justify-between items-center mb-2.5">
                        <label
                          htmlFor="addressId"
                          className="block text-xs font-semibold uppercase tracking-wider text-gray-600"
                        >
                          Select Address <span className="text-red-500">*</span>
                        </label>
                        <Link
                          href="/address"
                          className="text-sm text-[#D4AF37] hover:text-black transition-colors duration-200 font-semibold flex items-center gap-1.5"
                        >
                          + Add New Address
                        </Link>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FiMapPin className="w-5 h-5 text-gray-400" />
                        </div>
                        <select
                          id="addressId"
                          name="addressId"
                          value={formData.addressId || ""}
                          onChange={handleChange}
                          className="w-full pl-12 pr-10 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-black transition-all duration-200 focus:border-black focus:bg-white focus:ring-0 outline-none appearance-none cursor-pointer"
                          required
                        >
                          <option value="">Select Address</option>
                          {data?.map((item) => (
                            <option key={item._id} value={item._id}>
                              {`${item.street_address}, ${item.city}, ${item.state}, ${item.country} - ${item.pincode}`}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* PAYMENT METHOD */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2.5">
                        Payment Method <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("ONLINE")}
                          className={`flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl border-2 font-semibold transition-all duration-200 ${paymentMethod === "ONLINE"
                            ? "border-black bg-black text-white shadow-lg shadow-black/10"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                            }`}
                        >
                          <FaCreditCard className="w-5 h-5" />
                          <span>Online</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("COD")}
                          className={`flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl border-2 font-semibold transition-all duration-200 ${paymentMethod === "COD"
                            ? "border-black bg-black text-white shadow-lg shadow-black/10"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                            }`}
                        >
                          <FaMoneyBillWave className="w-5 h-5" />
                          <span>Cash on Delivery</span>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2.5">
                        {isCOD
                          ? "Pay with cash when your order is delivered."
                          : "Pay securely using our online payment gateway."}
                      </p>
                    </div>
                  </div>

                  {/* ESTIMATED DELIVERY CARD */}
                  {(etaDisplay.hasValidData || etaDisplay.isError || transitTimeLoading || formData.addressId) && (
                    <div className="mt-7">
                      {etaDisplay.isError ? (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                          <p className="text-sm font-medium text-amber-800">
                            {etaDisplay.errorMessage || "Unable to estimate delivery time"}
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 shadow-sm">
                          {transitTimeLoading ? (
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                                <svg className="w-6 h-6 animate-spin text-emerald-600" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-700">Calculating ETA…</p>
                              </div>
                            </div>
                          ) : etaDisplay.hasValidData ? (
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                <FiClock className="w-6 h-6 text-emerald-700" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                                  Estimated Delivery
                                </p>
                                <h3 className="text-xl font-bold text-emerald-900 leading-tight mt-1">
                                  {etaDisplay.mainDeliveryText}
                                </h3>
                                {etaDisplay.podLabel && (
                                  <p className="text-xs text-emerald-700 mt-1">{etaDisplay.podLabel}</p>
                                )}
                                {etaDisplay.showCutoffChip && (
                                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-600">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {etaDisplay.cutoffLabel}
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : formData.addressId ? null : (
                            <div className="rounded-2xl border-2 border-dashed border-gray-300 p-4">
                              <p className="text-sm text-gray-500 text-center">
                                Select an address to see estimated delivery time
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Payment Summary */}
                  <div className="mt-8 p-5 bg-gradient-to-br from-gray-50 to-gray-100/70 rounded-2xl border-2 border-gray-200/70">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-3">
                      Payment Summary
                    </h3>
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Payment Method</span>
                        <span className="text-sm font-bold text-black">
                          {isCOD ? "Cash on Delivery" : "Online Payment"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Payment Status</span>
                        <span className={`text-sm font-bold ${isCOD ? "text-amber-600" : "text-emerald-600"}`}>
                          {isCOD ? "Pay on Delivery" : "Payment Made Online"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Secure Checkout Badge - hidden for COD */}
                  {!isCOD && (
                    <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100/70 rounded-2xl border-2 border-gray-200/70">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                          <FiShield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-black text-lg mb-1">100% Secure payment</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Your information is protected with encrypted payment security. Shop with confidence.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* COD Info */}
                  {isCOD && (
                    <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100/70 rounded-2xl border-2 border-gray-200/70">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                          <BiRupee className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-black text-lg mb-1">Pay on Delivery</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            No online payment needed. Pay with cash when your order arrives at your doorstep.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pay Button */}
                  <button
                    type="submit"
                    disabled={loading || !product}
                    className={`w-full mt-8 py-5 px-6 rounded-2xl font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 group ${loading || !product
                      ? "bg-gray-200 cursor-not-allowed text-gray-500"
                      : "bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] hover:shadow-black/20"
                      }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        {isCOD ? "Place COD Order" : "Proceed to Payment"}
                        <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT COLUMN – Product Summary */}
            <div className="w-full lg:w-7/12">
              <div className="lg:sticky lg:top-24">
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100/80 overflow-hidden transition-all duration-300 hover:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.15)]">
                  {/* Order Summary Header */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-7">
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                      <FiTruck className="w-6 h-6 text-amber-400" />
                      Order Summary
                    </h2>
                    <p className="text-gray-300 mt-1.5 text-sm">
                      {product ? "1 item in your order" : "Loading..."}
                    </p>
                  </div>

                  {product && (
                    <>
                      {/* Product Card – UPDATED LAYOUT */}
                      <div className="p-8">
                        <div className="flex gap-6">
                          {/* Product Image */}
                          <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm">
                            <img
                              src={product?.images?.[0] || "/placeholder.png"}
                              alt={product?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            {/* Title + Price row */}
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-black text-xl leading-tight">
                                  {product?.name}
                                </h3>
                                {/* Variant Badge */}
                                {product?.variant && (
                                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full mt-2">
                                    {product?.variant}
                                  </span>
                                )}
                              </div>

                              <div className="text-right flex-shrink-0">
                                {discountTotal > 0 && (
                                  <p className="text-sm text-gray-400 line-through">
                                    {formatPrice(subtotal, "INR")}
                                  </p>
                                )}
                                <p className="text-2xl font-bold text-black">
                                  {formatPrice(finalTotal, "INR")}
                                </p>
                              </div>
                            </div>



                            {/* Size & Category */}
                            <div className="space-y-1 text-sm text-gray-600 mt-2">
                              {product?.selectedSize?.title && (
                                <p className="font-medium">
                                  Category: <span className="text-black">{product.selectedSize.title}</span>
                                </p>
                              )}
                              {product?.selectedPriceSection?.title && (
                                <p className="font-medium">
                                  Size: <span className="text-black">{product.selectedPriceSection.title}</span>
                                </p>
                              )}
                              <p className="font-medium">
                                Quantity: <span className="text-black">{product?.quantity}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      <div className="px-8 py-6 bg-gray-50 border-t-2 border-gray-100">
                        <div className="space-y-3">
                          {subtotal > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Price</span>
                              <span className="font-semibold text-black">{formatPrice(subtotal, "INR")}</span>
                            </div>
                          )}
                          {additionalDiscount > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Discount (10%)</span>
                              <span className="font-semibold text-emerald-600">-{formatPrice(additionalDiscount, "INR")}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Delivery Charges</span>
                            <span className="font-semibold text-emerald-600">FREE</span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Type & Status */}
                      <div className="px-8 py-4 border-t-2 border-gray-100 bg-white">
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Payment Type</span>
                            <span className="text-sm font-bold text-black">
                              {isCOD ? "Cash on Delivery" : "Online Payment"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Status</span>
                            <span className={`text-sm font-bold ${isCOD ? "text-amber-600" : "text-emerald-600"}`}>
                              {isCOD ? "Payment Pending" : "Payment Made Online"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="px-8 py-6 bg-gradient-to-r from-slate-900 to-slate-800">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-bold text-lg uppercase tracking-wide">Total Amount</span>
                          <span className="text-white font-black text-xl md:text-2xl">
                            {formatPrice(finalTotal, "INR")}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {!product && (
                    <div className="text-center py-16 px-8">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-lg mb-6">No product found</p>
                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-900 transition-all duration-200"
                      >
                        Continue Shopping
                        <FiArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Value Proposition */}
                {product && (
                  <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100/80 text-center transition-all duration-200 hover:shadow-2xl hover:-translate-y-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <FiAward className="w-6 h-6 text-black" />
                      </div>
                      <p className="text-xs font-bold text-black uppercase tracking-wide">Premium Quality</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100/80 text-center transition-all duration-200 hover:shadow-2xl hover:-translate-y-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <FiTruck className="w-6 h-6 text-black" />
                      </div>
                      <p className="text-xs font-bold text-black uppercase tracking-wide">Free Delivery</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100/80 text-center transition-all duration-200 hover:shadow-2xl hover:-translate-y-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <FiShield className="w-6 h-6 text-black" />
                      </div>
                      <p className="text-xs font-bold text-black uppercase tracking-wide">Warranty</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100/80 text-center transition-all duration-200 hover:shadow-2xl hover:-translate-y-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <FiHeadphones className="w-6 h-6 text-black" />
                      </div>
                      <p className="text-xs font-bold text-black uppercase tracking-wide">24/7 Support</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Trust Section */}
          <div className="mt-16 md:mt-20 pt-12 border-t border-gray-200/70">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-2xl transition-shadow duration-200">
                  <FiShield className="w-8 h-8 text-black" />
                </div>
                <h3 className="font-bold text-black text-lg mb-2">Secure Payment</h3>
                <p className="text-sm text-gray-600">Protected by industry-standard encryption</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-2xl transition-shadow duration-200">
                  <FiTruck className="w-8 h-8 text-black" />
                </div>
                <h3 className="font-bold text-black text-lg mb-2">Easy Returns</h3>
                <p className="text-sm text-gray-600">Hassle-free return policy within 7 days</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-2xl transition-shadow duration-200">
                  <FiAward className="w-8 h-8 text-black" />
                </div>
                <h3 className="font-bold text-black text-lg mb-2">Best Price Guarantee</h3>
                <p className="text-sm text-gray-600">We match prices for quality products</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}