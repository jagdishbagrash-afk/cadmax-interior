import React, { useState, useEffect } from "react";
import { formatMultiPrice } from "@/components/ValueDataHook";
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
import { extractOrderAndShipment } from "@/components/shipmentUtils";
import { FiShield, FiTruck, FiAward, FiHeadphones, FiArrowRight, FiCreditCard } from "react-icons/fi";
import { BiRupee } from "react-icons/bi";

export default function Index() {
  const { Razorpay } = useRazorpay();

  const router = useRouter();
  const { user } = useRole();

  const RAZOPAY_KEY = process.env.NEXT_PUBLIC_RAZOPAY_KEY;

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);

  const [data, setData] = useState([]);

  const [paymentMethod, setPaymentMethod] = useState("ONLINE");

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    addressId: "",
  });
  const selectedAddress = data.find(
    (item) => item._id === formData.addressId
  );
  const selectedAddressText = selectedAddress
    ? `${selectedAddress.street_address}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country} - ${selectedAddress.pincode} (${selectedAddress.addressType})`
    : "";

  const buildOrderProducts = () => {
    if (!product) {
      return [];
    }

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

  // BUY NOW PRODUCT
  useEffect(() => {
    const item = JSON.parse(localStorage.getItem("buyNowItem"));
    console.log("item", item);

    if (!item) {
      router.push("/");
      return;
    }

    setProduct(item);
  }, []);

  // USER DATA
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user?.name || "",
        mobile: user?.phone ? String(user.phone) : "",
      }));
    }
  }, [user]);

  // ADDRESS LIST
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

  useEffect(() => {
    fetchAddress();
  }, []);

  // HANDLE CHANGE
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

  // PRICE CALCULATIONS
  const subtotal =
    (product?.originalPrice || 0) * (product?.quantity || 1);

  const discountTotal =
    (product?.discount_amount || 0) *
    (product?.quantity || 1);

  const finalTotal =
    (product?.final_amount || 0) *
    (product?.quantity || 1);

  // Calculate 10% discount on subtotal
  const additionalDiscount = subtotal * 0.1;

  // PAYMENT
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

    // COD flow - place order directly without Razorpay
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
          amount: finalTotal,
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

  // COD ORDER - Save order without Razorpay payment
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

      const orderId = res?.data?.data?._id;

      if (!orderId) {
        toast.error("Order ID not received");
        return;
      }

      // Online payment ki tarah next shipment API call
      await saveCODShipment(orderId);
    } catch (error) {
      console.error(
        "COD order error:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
        "COD order failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const saveCODShipment = async (orderId) => {
    try {
      const main = new Listing();

      const shippingProvider =
        process.env.NEXT_PUBLIC_SHIPPING_PROVIDER;

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

        shipping_provider:
          shippingProvider || undefined,
      });

      if (!response?.data?.status) {
        toast.error(
          response?.data?.message ||
          "Order created but shipment failed"
        );

        router.push(`/success?orderId=${orderId}`);
        return;
      }

      const {
        order,
        shipment,
        trackingNumber,
      } = extractOrderAndShipment(response);

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

      toast.success(
        "COD order and shipment created successfully"
      );

      const query = new URLSearchParams();

      query.set("orderId", orderId);

      if (trackingNumber) {
        query.set(
          "trackingNumber",
          trackingNumber
        );
      }

      router.push(
        `/success?${query.toString()}`
      );
    } catch (error) {
      console.error(
        "COD shipment error:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
        "Order created but shipment generation failed"
      );
    }
  };

  // SAVE ORDER (for Online Payment)
  const handleSubmit = async (response) => {
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

        paymentMethod: "ONLINE",
        PaymentId: response.razorpay_payment_id,
      });

      if (res?.data?.status) {
        await savePaymentDetails(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          "success",
          res?.data?.data?._id,
          {
            razorpaySignature: response.razorpay_signature,
            paymentMethod: "ONLINE",
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

  // SAVE PAYMENT
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

      console.log("VERIFY PAYMENT PAYLOAD", payload);

      const response = await main.VerifyPayment(payload);

      if (response?.data?.status) {
        const { order, shipment, trackingNumber } =
          extractOrderAndShipment(response);

        if (typeof window !== "undefined") {
          const fallbackOrder = {
            ...(order || {}),
            name: formData.name || order?.name,
            mobile: formData.mobile || order?.mobile,
            addressId: formData.addressId || order?.addressId,
            address: selectedAddressText || order?.address,
            amount: finalTotal || order?.amount,
            product: buildOrderProducts(),
          };

          sessionStorage.setItem(
            "latestShipmentState",
            JSON.stringify({
              orderId: Orderdatas || order?._id || null,
              trackingNumber,
              order: fallbackOrder,
              shipment,
              shipToAddress: selectedAddress || null,
            })
          );
        }

        localStorage.removeItem("buyNowItem");

        toast.success(response.data.message);

        const query = new URLSearchParams();

        if (Orderdatas || order?._id) {
          query.set("orderId", Orderdatas || order?._id);
        }

        if (trackingNumber) {
          query.set("trackingNumber", trackingNumber);
        }

        router.push(
          query.toString() ? `/success?${query.toString()}` : "/success"
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Payment save failed");
    }
  };

  const isCOD = paymentMethod === "COD";

  return (
    <Layout>
      <Banner Slider1={BannerImages} />

      <section className="w-full bg-gradient-to-b from-gray-50 to-white py-12 md:py-16 lg:py-20 text-black antialiased">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight text-black mb-4">
              Buy Now
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Complete your purchase instantly</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* LEFT COLUMN – Shipping Form */}
            <div className="w-full lg:w-5/12">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 lg:sticky lg:top-24 overflow-hidden">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-black to-gray-900 px-8 py-6">
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                    Shipping Details
                  </h2>
                  <p className="text-gray-300 mt-2 text-sm">
                    Enter your details to complete your order
                  </p>
                </div>

                <form className="p-8" onSubmit={handlePaymentCreateSubmit}>
                  <div className="space-y-6">
                    {/* NAME */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-3"
                      >
                        Full Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          placeholder="John Doe"
                          autoComplete="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-black transition-all duration-200 focus:border-black focus:bg-white focus:ring-0 outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* MOBILE */}
                    <div>
                      <label
                        htmlFor="mobile"
                        className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-3"
                      >
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
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
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-black transition-all duration-200 focus:border-black focus:bg-white focus:ring-0 outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* ADDRESS */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label
                          htmlFor="addressId"
                          className="block text-xs font-bold uppercase tracking-wider text-gray-700"
                        >
                          Select Address *
                        </label>
                        <Link
                          href="/address"
                          className="text-sm text-[#D4AF37] hover:text-black transition-colors duration-200 font-semibold flex items-center gap-1"
                        >
                          + Add New Address
                        </Link>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <select
                          id="addressId"
                          name="addressId"
                          value={formData.addressId || ""}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-black transition-all duration-200 focus:border-black focus:bg-white focus:ring-0 outline-none appearance-none cursor-pointer"
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
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
                        Payment Method *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          {isCOD ? (
                            <BiRupee className="w-5 h-5 text-gray-400" />
                          ) : (
                            <FiCreditCard className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <select
                          id="paymentMethod"
                          name="paymentMethod"
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-black transition-all duration-200 focus:border-black focus:bg-white focus:ring-0 outline-none appearance-none cursor-pointer"
                        >
                          <option value="ONLINE">Online Payment</option>
                          <option value="COD">Cash on Delivery (COD)</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {isCOD
                          ? "Pay with cash when your order is delivered."
                          : "Pay securely using our online payment gateway."
                        }
                      </p>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="mt-8 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
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
                        <span className={`text-sm font-bold ${isCOD ? "text-[#D4AF37]" : "text-green-600"}`}>
                          {isCOD ? "Pay on Delivery" : "Paid Online"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Secure Checkout Badge - hidden for COD */}
                  {!isCOD && (
                    <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200">
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
                    <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200">
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
                        ? "bg-gray-300 cursor-not-allowed text-gray-500"
                        : "bg-gradient-to-r from-black to-gray-900 text-white hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
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
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                  {/* Order Summary Header */}
                  <div className="bg-gradient-to-r from-black to-gray-900 px-8 py-6">
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                      Order Summary
                    </h2>
                    <p className="text-gray-300 mt-1 text-sm">
                      {product ? '1 item in your order' : 'Loading...'}
                    </p>
                  </div>

                  {product && (
                    <>
                      {/* Product Card */}
                      <div className="p-8">
                        <div className="flex gap-6">
                          {/* Product Image */}
                          <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden border-2 border-gray-100">
                            <img
                              src={
                                product?.images?.[0] ||
                                "/placeholder.png"
                              }
                              alt={product?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1">
                            <h3 className="font-bold text-black text-xl leading-tight mb-3">
                              {product?.name}
                            </h3>

                            {/* Variant Badge */}
                            {product?.variant && (
                              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full mb-3">
                                {product?.variant}
                              </span>
                            )}

                            {/* Size & Category */}
                            <div className="space-y-1 text-sm text-gray-600 mb-3">
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

                            {/* Price */}
                            <div className="space-y-1">
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
                              <span className="font-semibold text-green-600">-{formatPrice(additionalDiscount, "INR")}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Delivery Charges</span>
                            <span className="font-semibold text-green-600">FREE</span>
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
                            <span className={`text-sm font-bold ${isCOD ? "text-[#D4AF37]" : "text-green-600"}`}>
                              {isCOD ? "Payment Pending" : "Paid Online"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="px-8 py-6 bg-gradient-to-r from-black to-gray-900">
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
                    <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <FiAward className="w-6 h-6 text-black" />
                      </div>
                      <p className="text-xs font-bold text-black uppercase tracking-wide">Premium Quality</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <FiTruck className="w-6 h-6 text-black" />
                      </div>
                      <p className="text-xs font-bold text-black uppercase tracking-wide">Free Delivery</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <FiShield className="w-6 h-6 text-black" />
                      </div>
                      <p className="text-xs font-bold text-black uppercase tracking-wide">Warranty</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 text-center">
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
          <div className="mt-16 md:mt-20 pt-12 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FiShield className="w-8 h-8 text-black" />
                </div>
                <h3 className="font-bold text-black text-lg mb-2">Secure Payment</h3>
                <p className="text-sm text-gray-600">Protected by industry-standard encryption</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FiTruck className="w-8 h-8 text-black" />
                </div>
                <h3 className="font-bold text-black text-lg mb-2">Easy Returns</h3>
                <p className="text-sm text-gray-600">Hassle-free return policy within 7 days</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
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