import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/cartSlice";
import toast from "react-hot-toast";
import { FiPlus, FiMinus, FiTag, FiLock, FiRotateCcw, FiTruck, FiHeadphones, FiChevronRight, FiTrash2 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
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

export default function Index() {
  const { Razorpay } = useRazorpay();
  const [data, setData] = useState([]);
  const RAZOPAY_KEY = process.env.NEXT_PUBLIC_RAZOPAY_KEY;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState(null);

  const cartItems = record?.items || [];
  const dispatch = useDispatch();
  const { user } = useRole();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    mobile: user?.phone ? String(user.phone) : "",
    addressId: "",
  });

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

    setLoading(true);
    const main = new Listing();
    try {
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
        rzp.on("payment.failed", function (response) {
          const error = response.error;
          const orderId = error?.metadata?.order_id;
          const paymentId = error?.metadata?.payment_id;
          if (orderId && paymentId) {
            savePaymentDetails(orderId, paymentId, "failed", null);
            router.push(`/cancel`);
          }
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

  const handleSubmit = async (response) => {
    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (loading) return;
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
        product: products,
        amount: totalAmount,
        PaymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
      });

      if (res?.data?.status) {
        toast.success(res?.data?.message);
        const createdOrderId = res?.data?.data?._id;
        await savePaymentDetails(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          "success",
          createdOrderId
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

  const savePaymentDetails = async (orderId, paymentId, payment_status, Orderdatas) => {
    setLoading(true);
    try {
      const itemNames = cartItems
        .map((item) => `${item.title} (${item.variantTitle})`)
        .join(", ");
    const totalAmount = record?.summary?.subtotal || 0;

      const main = new Listing();
      const response = await main.PaymentSave({
        order_id: orderId,
        payment_id: paymentId,
        currency: "INR",
        product_name: itemNames,
        amount: totalAmount,
        type: "product",
        payment_status: payment_status,
        OrderID: Orderdatas,
      });

      if (response?.data?.status) {
        const { order, shipment, trackingNumber } =
          extractOrderAndShipment(response);

        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            "latestShipmentState",
            JSON.stringify({
              orderId: Orderdatas || order?._id || null,
              trackingNumber,
              order,
              shipment,
            })
          );
        }

        toast.success(response.data.message);
        dispatch(clearCart());
        await FetchCart();

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
      toast.error(error?.response?.data?.data?.message || "An error occurred");
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

  useEffect(() => {
    fetchAddress();
    FetchCart();
  }, []);

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

  const summary = record?.summary || {};
  const totalAmount = summary.subtotal || 0;

  // Compute derived values from cart items
  const subtotal = cartItems.reduce((sum, item) => sum + ((item.originalPrice || 0) * (item.quantity || 0)), 0);
  // discountAmount is a percentage (e.g. 10 means 10%), so calculate actual rupee discount
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

  return (
    <Layout>
      <Banner Slider1={BannerImages} />
      <section className="w-full bg-white py-12 md:py-20 lg:py-24 text-black antialiased">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* LEFT COLUMN: FORM */}
            <div className="w-full lg:w-6/12">
              <div className="bg-[#F9F9F9] rounded-sm border border-gray-200 shadow-sm lg:sticky lg:top-24">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Shipping Details
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Please enter your delivery information.
                  </p>
                </div>

                <form className="p-6" onSubmit={handlePaymentCreateSubmit}>
                  <div className="space-y-6">
                    {/* NAME */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-3 text-black transition focus:border-black focus:ring-1 focus:ring-black outline-none"
                        required
                      />
                    </div>

                    {/* MOBILE */}
                    <div>
                      <label
                        htmlFor="mobile"
                        className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2"
                      >
                        Mobile Number *
                      </label>
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
                        className="w-full border border-gray-300 px-4 py-3 text-black transition focus:border-black focus:ring-1 focus:ring-black outline-none"
                        required
                      />
                    </div>

                    {/* ADDRESS SELECTION */}
                    <div>
                      <div className="flex justify-between items-center text-center mt-2">
                        <label
                          htmlFor="addressId"
                          className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2"
                        >
                          Select Address *
                        </label>
                        <Link
                          href={"/address"}
                          className="mt-2 text-sm text-blue-600 underline mb-2"
                        >
                          + Add New Address
                        </Link>
                      </div>

                      <select
                        id="addressId"
                        name="addressId"
                        value={formData.addressId || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-3 text-black focus:border-black focus:ring-1 focus:ring-black outline-none"
                        required
                      >
                        <option value="">Select Address</option>
                        {data?.map((item) => (
                          <option key={item._id} value={item._id}>
                            {`${item.street_address}, ${item.city}, ${item.state}, ${item.country} - ${item.pincode} (${item.addressType})`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || cartItems.length === 0}
                    className={`w-full py-4 mt-8 font-bold uppercase tracking-widest transition duration-300 
                      ${
                        loading || cartItems.length === 0
                          ? "bg-gray-300 cursor-not-allowed text-gray-500"
                          : "cursor-pointer bg-black text-white hover:bg-gray-800 active:scale-[0.98]"
                      }`}
                  >
                    {loading ? "Processing..." : "Proceed to Payment"}
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY */}
            <div className="w-full lg:w-6/12">
              <div className="sticky top-10 space-y-6">
                {/* ---------- ORDER SUMMARY HEADING ---------- */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
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
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <FiTruck size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">Your cart is empty</p>
                    <Link
                      href="/"
                      className="mt-6 inline-flex items-center gap-2 bg-black text-white px-8 py-3 hover:bg-gray-800 transition"
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
                            className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-5"
                          >
                            {/* Remove Button */}
                            <button
                              type="button"
                              onClick={() => handleRemove(item)}
                              className="absolute -top-2 -right-2 z-10 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-all opacity-0 group-hover:opacity-100"
                              title="Remove Item"
                            >
                              <FiTrash2 size={12} />
                            </button>

                            <div className="flex gap-4 sm:gap-5">
                              {/* Product Image */}
                              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
                                <Image
                                  src={productImage}
                                  fill
                                  alt={item.title}
                                  className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>

                              {/* Product Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-sm sm:text-base text-gray-900 leading-snug line-clamp-2">
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
                                    <p className="text-sm sm:text-base font-bold text-gray-900">
                                      {formatPrice(finalPrice)}
                                    </p>
                                    {discount > 0 && (
                                      <p className="text-xs text-gray-400 line-through mt-0.5">
                                        {formatPrice(originalPrice)}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Quantity Controls + Line Total */}
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleQtyChange(item, "decrease")}
                                      className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100 transition disabled:opacity-30"
                                      disabled={item.quantity === 1}
                                    >
                                      <FiMinus size={11} />
                                    </button>
                                    <span className="text-sm font-semibold text-gray-900 w-8 text-center select-none">
                                      {item.quantity}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleQtyChange(item, "increase")}
                                      className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100 transition"
                                    >
                                      <FiPlus size={11} />
                                    </button>
                                    {item.maxStock && (
                                      <span className="text-[10px] text-gray-400 ml-1">
                                        Max: {item.maxStock}
                                      </span>
                                    )}
                                  </div>

                                  <div className="text-right">
                                    <span className="text-sm font-bold text-gray-900">
                                      {formatPrice(finalPrice * item.quantity)}
                                    </span>
                                    {discount > 0 && (
                                      <span className="text-[10px] text-gray-400 line-through block">
                                        {formatPrice(originalPrice * item.quantity)}
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
                    <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-5 transition-all duration-300 hover:border-gray-300 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
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
                          className="flex items-center gap-1.5 text-sm font-semibold text-black hover:text-gray-600 transition-colors px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
                        >
                          Apply Coupon
                          <FiChevronRight size={14} />
                        </button>
                      </div>
                    </div>

                    {/* ---------- PRICE SUMMARY CARD ---------- */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                      <div className="px-5 py-4 border-b border-gray-100">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                          Price Summary
                        </h3>
                      </div>
                      <div className="px-5 py-4 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium text-gray-900">
                            {formatPrice(subtotal)}
                          </span>
                        </div>
                        {totalDiscount > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Discount</span>
                            <span className="font-medium text-green-600">
                              - {formatPrice(totalDiscount)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* ---------- GRAND TOTAL ---------- */}
                      <div className="mx-5 mb-5 rounded-xl bg-gray-900 px-5 py-4 flex items-center justify-between shadow-lg">
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
                            className="flex flex-col items-center text-center p-3 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-200"
                          >
                            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                              <Icon size={16} className="text-gray-700" />
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
