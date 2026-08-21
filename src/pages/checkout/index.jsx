import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/cartSlice";
import toast from "react-hot-toast";
import {
  FiPlus,
  FiMinus,
  FiTag,
  FiLock,
  FiRotateCcw,
  FiTruck,
  FiHeadphones,
  FiChevronRight,
  FiTrash2,
  FiCreditCard,
  FiMapPin,
  FiUser,
  FiPhone,
  FiClock,
} from "react-icons/fi";
import { BiRupee } from "react-icons/bi";
import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
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

export default function Index() {
  const { Razorpay } = useRazorpay();
  const [data, setData] = useState([]);
  const RAZOPAY_KEY = process.env.NEXT_PUBLIC_RAZOPAY_KEY;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [transitTimeResponse, setTransitTimeResponse] = useState(null);
  const [transitTimeLoading, setTransitTimeLoading] = useState(false);

  const cartItems = record?.items || [];
  const isCOD = paymentMethod === "COD";

  const dispatch = useDispatch();
  const { user } = useRole();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    mobile: user?.phone ? String(user.phone) : "",
    addressId: "",
  });

  const selectedAddress = data.find(
    (item) => item._id === formData.addressId
  );

  const selectedAddressText = selectedAddress
    ? `${selectedAddress.street_address}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country} - ${selectedAddress.pincode} (${selectedAddress.addressType})`
    : "";

  useEffect(() => {
    if (!router.isReady) return;

    const queryValue =
      router.query.paymentMethod ||
      router.query.payment_method ||
      "";

    const method =
      String(Array.isArray(queryValue) ? queryValue[0] : queryValue)
        .trim()
        .toUpperCase() === "COD"
        ? "COD"
        : "ONLINE";

    setPaymentMethod(method);
  }, [
    router.isReady,
    router.query.paymentMethod,
    router.query.payment_method,
  ]);

  const buildOrderProducts = () =>
    cartItems.map((item) => ({
      id: item.productId,
      sku: item.sku || item.productId,
      title: item.title || item.name,
      name: item.title || item.name,
      price: item.finalPrice,
      originalPrice: item.originalPrice,
      discount: item.discountAmount,
      quantity: item.quantity,
      total: item.finalPrice * item.quantity,
      variant: item.variant,
      variantTitle: item.variantTitle,
      priceSection: item.priceSection,
      priceSectionTitle: item.priceSection?.title,
      dimensions: item.dimensions || item.product?.dimensions,
      product: item.product || null,
    }));

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user?.name || "",
        mobile: user?.phone ? String(user.phone) : "",
      }));
    }
  }, [user]);

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

  // COD ORDER - Save order without Razorpay payment
  const handleCODSubmit = async () => {
    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      const products = cartItems.map((item) => ({
        id: item.productId,
        price: item.finalPrice,
        originalPrice: item.originalPrice,
        discount: item.discountAmount,
        quantity: item.quantity,
        total: item.finalPrice * item.quantity,
        variant: item.variant,
        variantTitle: item.variantTitle,
        priceSection: item.priceSection,
        priceSectionTitle: item.priceSection?.title,
      }));

      const totalAmount = record?.summary?.subtotal || 0;
      const main = new Listing();

      const res = await main.AddOrder({
        name: formData?.name,
        mobile: formData?.mobile,
        addressId: formData?.addressId,
        address: selectedAddressText,
        product: products,
        amount: totalAmount,
        paymentMethod: "COD",
        PaymentId: "",
      });

      if (res?.data?.status) {
        toast.success("Order placed successfully! Pay on delivery.");
        dispatch(clearCart());
        await FetchCart();

        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            "latestShipmentState",
            JSON.stringify({
              orderId: res?.data?.data?._id || null,
              trackingNumber: "",
              order: {
                name: formData?.name,
                mobile: formData?.mobile,
                address: selectedAddressText,
                amount: totalAmount,
                product: buildOrderProducts(),
              },
              shipment: null,
              shipToAddress: selectedAddress || null,
              paymentMethod: "COD",
            })
          );
        }

        const query = new URLSearchParams();
        const orderId = res?.data?.data?._id;

        if (orderId) {
          query.set("orderId", orderId);
        }

        router.push(
          query.toString() ? `/success?${query.toString()}` : "/success"
        );
      } else {
        toast.error(res?.data?.message || "Failed to place order");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (item) => {
    try {
      const main = new Listing();
      const response = await main.UpdateTocart({
        productId: item.productId,
        variant: item.variant,
        quantity: 0,
        priceSectionTitle: item.priceSection?.title,
      });

      if (response?.data?.status) {
        await FetchCart();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove item");
    }
  };

  const handlePaymentCreateSubmit = async (e) => {
    e.preventDefault();

    if (String(formData.mobile).length !== 10) {
      toast.error("Mobile number must be exactly 10 digits");
      return;
    }

    if (!formData.addressId) {
      toast.error("Please select an address");
      return;
    }

    const totalAmount = record?.summary?.subtotal || 0;

    if (totalAmount === 0) {
      toast.error("Cart is empty");
      return;
    }

    // COD flow - place order directly without Razorpay
    if (paymentMethod === "COD") {
      await handleCODSubmit();
      return;
    }

    setLoading(true);
    const main = new Listing();
    try {
      if (paymentMethod === "COD") {
        await handleSubmit(null, { paymentMethod: "COD" });
        return;
      }

      const res = await main.AddPaymentCreate({
        amount: totalAmount,
        currency: "INR",
        receipt: "receipt#1",
      });

      if (res && res.data && res.data.orderId) {
        const options = {
          key: RAZOPAY_KEY,
          amount: Math.round(totalAmount * 100),
          currency: "INR",
          name: "Cadmaxatelier",
          description: "Payment for services",
          order_id: res.data.orderId,
          handler: function (response) {
            handleSubmit(response);
          },
          prefill: {
            name: formData.name,
            email: user?.email || "customer@example.com",
            contact: formData.mobile,
          },
          theme: {
            color: "#F37254",
          },
        };

        const rzp = new Razorpay(options);
        rzp.on("payment.failed", function () {
          router.push(`/cancel`);
        });
        rzp.open();
      } else {
        toast.error(res.data.message || "Failed to create order");
      }
    } catch (error) {
      toast.error("Error creating order");
      console.error("Order creation error:", error);
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
    if (typeof window === "undefined") {
      return;
    }

    const { order, shipment, trackingNumber } = extractOrderAndShipment(
      responsePayload
    );

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

  const handleSubmit = async (response, options = {}) => {
    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const activePaymentMethod = options.paymentMethod || paymentMethod;
      const products = cartItems.map((item) => ({
        id: item.productId,
        price: item.finalPrice,
        originalPrice: item.originalPrice,
        discount: item.discountAmount,
        quantity: item.quantity,
        total: item.finalPrice * item.quantity,
        variant: item.variant,
        variantTitle: item.variantTitle,
        priceSection: item.priceSection,
        priceSectionTitle: item.priceSection?.title,
      }));

      const totalAmount = record?.summary?.subtotal || 0;

      const main = new Listing();
      const res = await main.AddOrder({
        name: formData?.name,
        mobile: formData?.mobile,
        addressId: formData?.addressId,
        address: selectedAddressText,
        product: products,
        amount: totalAmount,
        paymentMethod: "ONLINE",
        PaymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
      });

      if (res?.data?.status) {
        toast.success(res?.data?.message);
        const createdOrderId = res?.data?.data?._id;
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
        toast.error(res?.data?.message || "Failed to place order");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const savePaymentDetails = async (
    orderId,
    paymentId,
    payment_status,
    Orderdatas,
    options = {}
  ) => {
    setLoading(true);

    try {
      const totalAmount = record?.summary?.subtotal || 0;
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

      const payload = {
        OrderID: Orderdatas,
        amount: totalAmount,
        currency: "INR",
        payment_status,
        payment_method: paymentMethod,
        type: "product",
      };

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

      if (paymentMethod === "COD") {
        payload.order_id = `COD-${Orderdatas}`;
        payload.payment_id = `COD-PAYMENT-${Orderdatas}`;
        payload.payment_status = "pending";
        payload.cod_amount = totalAmount;
        payload.collectable_amount = totalAmount;

        console.log("COD VERIFY PAYMENT PAYLOAD", payload);
      } else {
        console.log("VERIFY PAYMENT PAYLOAD", payload);
      }

      const main = new Listing();
      const response = await main.PaymentSave(payload);

      const fallbackOrder = {
        name: formData?.name || "",
        mobile: formData?.mobile || "",
        addressId: formData?.addressId || "",
        address: selectedAddressText || "",
        amount: totalAmount || 0,
        product: buildOrderProducts(),
      };

      if (response?.data?.status) {
        const { order, shipment, trackingNumber } =
          extractOrderAndShipment(response);

        const finalOrder = {
          ...fallbackOrder,
          ...(order || {}),
          name: formData?.name || order?.name || "",
          mobile: formData?.mobile || order?.mobile || "",
          addressId:
            formData?.addressId || order?.addressId || "",
          address:
            selectedAddressText || order?.address || "",
          amount:
            totalAmount || order?.amount || 0,
          product: buildOrderProducts(),
        };

        persistLatestShipmentState({
          responsePayload: response,
          orderId: Orderdatas || order?._id || null,
          fallbackOrder: finalOrder,
          fallbackShipment: shipment || null,
          fallbackTrackingNumber: trackingNumber || "",
        });

        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            "latestShipmentState",
            JSON.stringify({
              orderId: Orderdatas || order?._id || null,
              trackingNumber: trackingNumber || "",
              order: finalOrder,
              shipment: shipment || null,
              shipToAddress: selectedAddress || null,
              paymentMethod,
            })
          );
        }

        toast.success(
          response?.data?.message ||
          "Order and shipment created successfully"
        );

        dispatch(clearCart());
        await FetchCart();

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

        toast.error(
          response?.data?.message ||
          "Order placed successfully, but shipment creation is pending."
        );

        dispatch(clearCart());
        await FetchCart();

        goToSuccessPage({
          orderId: Orderdatas || null,
          responsePayload: response,
        });
      }
    } catch (error) {
      console.error(
        "PAYMENT SAVE ERROR:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };
  const FetchCart = async () => {
    try {
      const main = new Listing();
      const response = await main.CartGet();
      console.log("Cart API response", response);

      if (response?.data?.data) {
        const cart = response.data.data;

        const transformedItems = cart.items.map((item) => {
          const product = item.product;

          // ----- 1. Determine variant -----
          let selectedVariant = item.selectedVariant;
          let variantObj = null;

          if (selectedVariant && product.variants) {
            variantObj = product.variants.find((v) => v.color === selectedVariant);
          }
          if (!variantObj && product.variants && product.variants.length > 0) {
            variantObj = product.variants[0];
            selectedVariant = variantObj.color;
          }

          // ----- 2. Determine price section and size -----
          let selectedSize = item.selectedSize;
          let priceSection = null;
          let sizeObj = null;

          // Check if product has price sections
          const hasPriceSections = product.product_price_section && product.product_price_section.length > 0;

          if (hasPriceSections) {
            // ---------------------------------------------------
            // CASE A: Product has price sections
            // ---------------------------------------------------
            // Try to use the price section from cart item (if provided)
            if (item.priceSection?.title) {
              const foundSection = product.product_price_section.find(
                (s) => s.title === item.priceSection.title
              );
              if (foundSection) {
                // Extract price from section (with or without sizes)
                if (foundSection.sizes && foundSection.sizes.length > 0) {
                  // Has sizes: find matching size or take first
                  const sizeMatch = foundSection.sizes.find(
                    (s) => s.title === item.selectedSize
                  );
                  sizeObj = sizeMatch || foundSection.sizes[0];
                  selectedSize = sizeObj.title;
                } else {
                  // No sizes: use section's own prices
                  sizeObj = {
                    amount: foundSection.amount,
                    discount_amount: foundSection.discount_amount,
                    final_amount: foundSection.final_amount,
                  };
                  selectedSize = null; // no size to display
                }
                priceSection = { title: foundSection.title };
              }
            }

            // If still not found, fallback to first section
            if (!sizeObj) {
              const firstSection = product.product_price_section[0];
              if (firstSection) {
                if (firstSection.sizes && firstSection.sizes.length > 0) {
                  sizeObj = firstSection.sizes[0];
                  selectedSize = sizeObj.title;
                } else {
                  sizeObj = {
                    amount: firstSection.amount,
                    discount_amount: firstSection.discount_amount,
                    final_amount: firstSection.final_amount,
                  };
                  selectedSize = null;
                }
                priceSection = { title: firstSection.title };
              }
            }
          }

          // ---------------------------------------------------
          // CASE B: No price sections – use product-level prices
          // ---------------------------------------------------
          if (!sizeObj) {
            // Use product top-level amount, discount_amount, final_amount
            sizeObj = {
              amount: product.amount || 0,
              discount_amount: product.discount_amount || 0,
              final_amount: product.final_amount || product.amount || 0,
            };
            priceSection = null;
            selectedSize = null;
          }

          // ----- 3. Extract prices -----
          const originalPrice = sizeObj?.amount || 0;
          const discountAmount = sizeObj?.discount_amount || 0;
          const finalPrice = sizeObj?.final_amount || originalPrice;

          // ----- 4. Images from variant -----
          const images = variantObj?.images || [];

          // ----- 5. Build flattened item -----
          return {
            ...item,
            productId: product._id,
            title: product.title,
            slug: product.slug,
            label_category: product?.label_category,
            label_size: product?.label_size,
            variant: selectedVariant,
            variantTitle: variantObj?.title,
            selectedSize: selectedSize,
            priceSection: priceSection,
            priceSectionTitle: priceSection?.title,
            originalPrice: originalPrice,
            finalPrice: finalPrice,
            discountAmount: discountAmount,
            images: images,
            availableStock: item.availableStock,
            maxStock: item.availableStock,
            itemSubtotal: item.itemSubtotal,
            itemOriginalSubtotal: item.itemOriginalSubtotal,
            itemDiscountAmount: item.itemDiscountAmount,
            isOutOfStock: item.isOutOfStock,
            stock_status: item.stock_status,
          };
        });

        setRecord({
          ...cart,
          items: transformedItems,
        });
      } else {
        setRecord(null);
      }
    } catch (error) {
      console.error("FetchCart error:", error);
      setRecord(null);
    }
  };

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
      console.error(
        "TRANSIT TIME FETCH ERROR:",
        err?.response?.data || err?.message
      );
      setTransitTimeResponse(null);
    } finally {
      setTransitTimeLoading(false);
    }
  };

  useEffect(() => {
    fetchAddress();
    FetchCart();
  }, []);

  useEffect(() => {
    fetchTransitTime(selectedAddress, isCOD);
  }, [formData.addressId, paymentMethod]);

  useEffect(() => {
    if (!user) return;
    if (user.role !== "customer") {
      toast.error("Only customer can access this page");
      router.push("/");
    }
  }, [user]);

  const handleQtyChange = async (item, type) => {
    try {
      const main = new Listing();
      const newQty = type === "increase" ? item.quantity + 1 : item.quantity - 1;

      if (newQty < 1) {
        await handleRemove(item);
        return;
      }

      const response = await main.UpdateTocart({
        productId: item.productId,
        variant: item.variant,
        quantity: newQty,
        priceSectionTitle: item.priceSection?.title,
      });

      if (response?.data?.status) {
        await FetchCart();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update quantity");
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + ((item.originalPrice || 0) * (item.quantity || 0)), 0);
  const totalDiscount = cartItems.reduce((sum, item) => {
    const perUnitDiscount = ((item.originalPrice || 0) * (item.discountAmount || 0)) / 100;
    return sum + (perUnitDiscount * (item.quantity || 0));
  }, 0);
  const grandTotal = subtotal - totalDiscount;

  const trustFeatures = [
    { icon: FiLock, label: "Secure Checkout", desc: "256-bit encrypted" },
    { icon: FiRotateCcw, label: "Easy Returns", desc: "30-day return policy" },
    { icon: FiTruck, label: "Fast Delivery", desc: "Pan India shipping" },
    { icon: FiHeadphones, label: "24/7 Support", desc: "Dedicated assistance" },
  ];

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

  return (
    <Layout>
      <Banner Slider1={BannerImages} />
      <section className="w-full bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 md:py-16 lg:py-20 text-black antialiased">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* LEFT COLUMN: FORM */}
            <div className="w-full lg:w-6/12">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100/80 lg:sticky lg:top-24 overflow-hidden transition-all duration-300 hover:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.15)]">
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-7">
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                    <FiMapPin className="w-6 h-6 text-amber-400" />
                    Shipping Details
                  </h2>
                  <p className="text-gray-300 mt-1.5 text-sm">
                    Please enter your delivery information.
                  </p>
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
                          pattern="[0-9]{10}"
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-black transition-all duration-200 focus:border-black focus:bg-white focus:ring-0 outline-none placeholder:text-gray-400"
                          required
                        />
                      </div>
                    </div>

                    {/* ADDRESS SELECTION */}
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
                              {`${item.street_address}, ${item.city}, ${item.state}, ${item.country} - ${item.pincode} (${item.addressType})`}
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

                    {/* PAYMENT METHOD - modern toggle buttons */}
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

                  <button
                    type="submit"
                    disabled={loading || cartItems.length === 0}
                    className={`w-full mt-8 py-5 px-6 rounded-2xl font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 group ${loading || cartItems.length === 0
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
                        <FiChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY */}
            <div className="w-full lg:w-6/12">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* ---------- ORDER SUMMARY HEADING ---------- */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-black flex items-center gap-3">
                      <FiTruck className="w-6 h-6 text-amber-400" />
                      Order Summary
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {cartItems?.length || 0}{" "}
                      {cartItems?.length === 1 ? "Item" : "Items"} in your cart
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-sm font-bold text-gray-700">
                    {cartItems?.length || 0}
                  </div>
                </div>

                {cartItems?.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl shadow-xl border border-gray-100/80">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <FiTruck size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">Your cart is empty</p>
                    <Link
                      href="/"
                      className="mt-6 inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-900 transition-all duration-200"
                    >
                      Continue Shopping
                      <FiChevronRight size={16} />
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* ---------- PRODUCT CARDS ---------- */}
                    <div className="space-y-4">
                      {cartItems.map((item, idx) => {
                        const originalPrice = item.originalPrice || 0;
                        const finalPrice = item.finalPrice || 0;
                        const discount = item.discountAmount || 0;
                        const productImage = item.images?.[0] || "/no-image.png";

                        return (
                          <div
                            key={item.productId || idx}
                            className="group relative bg-white rounded-2xl border-2 border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 p-5"
                          >
                            {/* Remove Button */}
                            <button
                              type="button"
                              onClick={() => handleRemove(item)}
                              className="absolute -top-2 -right-2 z-10 w-8 h-8 rounded-full bg-white border-2 border-gray-200 shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-all opacity-0 group-hover:opacity-100"
                              title="Remove Item"
                            >
                              <FiTrash2 size={14} />
                            </button>

                            <div className="flex gap-5">
                              {/* Product Image */}
                              <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                                <Image
                                  src={productImage}
                                  fill
                                  alt={item.title}
                                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>

                              {/* Product Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2">
                                      {item.title}
                                    </h3>

                                    {item.variant && (
                                      <p className="text-xs text-gray-500 mt-1.5 font-medium">
                                        Color:{" "}
                                        <span className="text-gray-700">{item.variant}</span>
                                      </p>
                                    )}

                                    {item.priceSection?.title && (
                                      <p className="text-xs text-gray-500 font-medium">
                                        {item?.label_category}:{" "}
                                        <span className="text-gray-700">
                                          {item.priceSection.title}
                                        </span>
                                      </p>
                                    )}

                                    {item?.selectedSize && (
                                      <p className="text-xs text-gray-500 font-medium">
                                        {item?.label_size}:{" "}
                                        <span className="text-gray-700">
                                          {item?.selectedSize}
                                        </span>
                                      </p>
                                    )}
                                  </div>

                                  {/* Price */}
                                  <div className="text-right flex-shrink-0">
                                    <p className="text-base font-bold text-black">
                                      {formatPrice(finalPrice * item.quantity)}
                                    </p>
                                    {discount > 0 && (
                                      <p className="text-xs text-gray-400 line-through mt-0.5">
                                        {formatPrice(originalPrice * item.quantity)}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleQtyChange(item, "decrease")}
                                      className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-gray-200 hover:bg-gray-100 transition disabled:opacity-30"
                                      disabled={item.quantity === 1}
                                    >
                                      <FiMinus size={12} />
                                    </button>
                                    <span className="text-sm font-semibold text-gray-900 w-8 text-center select-none">
                                      {item.quantity}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleQtyChange(item, "increase")}
                                      className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-gray-200 hover:bg-gray-100 transition"
                                    >
                                      <FiPlus size={12} />
                                    </button>
                                    {item.maxStock && (
                                      <span className="text-[10px] text-gray-400 ml-1">
                                        Max: {item.maxStock}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* ---------- COUPON SECTION ---------- */}
                    <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-5 transition-all duration-300 hover:border-gray-300 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center flex-shrink-0">
                          <FiTag size={18} className="text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            Have a coupon code?
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Add your coupon for extra savings
                          </p>
                        </div>
                        <button
                          type="button"
                          className="flex items-center gap-1.5 text-sm font-semibold text-black hover:text-gray-600 transition-colors px-4 py-2 rounded-xl border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
                        >
                          Apply Coupon
                          <FiChevronRight size={14} />
                        </button>
                      </div>
                    </div>

                    {/* ---------- PRICE SUMMARY CARD ---------- */}
                    <div className="rounded-2xl border-2 border-gray-200 bg-white shadow-lg overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                          Price Summary
                        </h3>
                      </div>
                      <div className="px-6 py-5 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium text-black">
                            {formatPrice(subtotal)}
                          </span>
                        </div>
                        {totalDiscount > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Discount</span>
                            <span className="font-medium text-emerald-600">
                              - {formatPrice(totalDiscount)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* ---------- GRAND TOTAL ---------- */}
                      <div className="mx-6 mb-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 flex items-center justify-between shadow-xl">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                            Grand Total
                          </p>
                          <p className="text-lg md:text-xl font-bold text-white mt-0.5 tracking-tight">
                            {formatPrice(grandTotal)}
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white"
                          >
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                            <line x1="1" y1="10" x2="23" y2="10" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* ---------- TRUST BADGES ---------- */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {trustFeatures.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                          <div
                            key={i}
                            className="flex flex-col items-center text-center p-4 rounded-2xl border-2 border-gray-100 bg-white hover:border-gray-200 hover:shadow-md transition-all duration-200"
                          >
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                              <Icon size={18} className="text-gray-700" />
                            </div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-800">
                              {feature.label}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {feature.desc}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}