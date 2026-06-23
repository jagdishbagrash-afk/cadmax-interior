import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/redux/cartSlice";
import toast from "react-hot-toast";
import { FiPlus, FiMinus } from "react-icons/fi";
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
    addressId: ""
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user?.name || "",
        mobile: user?.phone ? String(user.phone) : ""
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
        priceSectionTitle: item.priceSection?.title
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

    const totalAmount = record?.summary?.totalAmount || 0;
    
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
        receipt: "receipt#1"
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
          priceSectionTitle: item.priceSection?.title   // ✅ already included

      }));
      
      const totalAmount = record?.summary?.totalAmount || 0;
      
      const main = new Listing();
      const res = await main.AddOrder({
        name: formData?.name,
        mobile: formData?.mobile,
        addressId: formData?.addressId,
        product: products,
        amount: totalAmount,
        PaymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id
      });
      
      if (res?.data?.status) {
        toast.success(res?.data?.message);
        const orderId = res?.data?.data?._id;
        await savePaymentDetails(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          "success",
          orderId
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
      const itemNames = cartItems.map((item) => `${item.title} (${item.variantTitle})`).join(", ");
      const totalAmount = record?.summary?.totalAmount || 0;
      
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
        toast.success(response.data.message);
        dispatch(clearCart());
        await FetchCart();
        router.push(`/success`);
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
      console.log("response get", response);
      if (response?.data?.data) {
        setRecord(response.data.data);
      } else {
        setRecord(null);
      }
    } catch (error) {
      console.log(error);
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
        priceSectionTitle: item.priceSection?.title
      });
      
      if (response?.data?.status) {
        await FetchCart();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update quantity");
    }
  };

  const summary = record?.summary || {};
  const totalAmount = summary.totalAmount || 0;
  const subtotal = summary.subtotal || 0;
  const totalDiscount = summary.totalDiscount || 0;
  const cartDiscountAmount = summary.cartDiscountAmount || 0;
  const taxAmount = summary.taxAmount || 0;

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
                  <h2 className="text-2xl font-semibold tracking-tight">Shipping Details</h2>
                  <p className="text-sm text-gray-500 mt-1">Please enter your delivery information.</p>
                </div>

                <form className="p-6" onSubmit={handlePaymentCreateSubmit}>
                  <div className="space-y-6">
                    {/* NAME */}
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
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
                      <label htmlFor="mobile" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
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
                        <label htmlFor="addressId" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                          Select Address *
                        </label>
                        <Link href={"/address"} className="mt-2 text-sm text-blue-600 underline mb-2">
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
                      ${loading || cartItems.length === 0
                        ? "bg-gray-300 cursor-not-allowed text-gray-500"
                        : "cursor-pointer bg-black text-white hover:bg-gray-800 active:scale-[0.98]"}`}
                  >
                    {loading ? "Processing..." : "Proceed to Payment"}
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT COLUMN: CART SUMMARY */}
            <div className="w-full lg:w-6/12">
              <div className="sticky top-10">
                <h2 className="text-2xl font-semibold border-b border-gray-200 pb-5 mb-4">
                  Order Summary ({cartItems?.length || 0})
                </h2>
                
                {cartItems?.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Your cart is empty</p>
                    <Link href="/" className="mt-4 inline-block bg-black text-white px-6 py-3">
                      Continue Shopping
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="pb-3 text-left text-xs font-bold uppercase text-gray-400">Item</th>
                            <th className="pb-3 text-center text-xs font-bold uppercase text-gray-400">Qty</th>
                            <th className="pb-3 text-right text-xs font-bold uppercase text-gray-400">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {cartItems.map((item, idx) => {
                            const originalPrice = item?.originalPrice || item?.amount || 0;
                            const finalPrice = item?.finalPrice || item?.final_amount || 0;
                            const discount = item?.discountAmount || item?.discount_amount || 0;
                            const productImage = item?.images?.[0] || "/no-image.png";

                            return (
                              <tr key={item.productId || idx} className="group">
                                <td className="py-4">
                                  <div className="flex items-center gap-4">
                                    <button
                                      type="button"
                                      onClick={() => handleRemove(item)}
                                      className="text-gray-400 hover:text-red-500 transition-colors"
                                      title="Remove Item"
                                    >
                                      <FaRegTrashCan size={16} />
                                    </button>

                                    {/* IMAGE */}
                                    <div className="relative h-16 w-16 flex-shrink-0 bg-gray-50 border border-gray-100 rounded overflow-hidden">
                                      <Image
                                        src={productImage}
                                        fill
                                        alt={item?.title || item?.name}
                                        className="object-contain p-1"
                                      />
                                    </div>

                                    {/* TITLE + VARIANT INFO */}
                                    <div>
                                      <span className="font-medium text-sm text-gray-900 line-clamp-2 block">
                                        {item?.title || item?.name}
                                      </span>
                                      
                                      {item?.variant && (
                                        <span className="text-xs text-gray-500 block mt-1">
                                          Color: {item?.variant}
                                        </span>
                                      )}
                                      

                                      {item?.priceSection?.title && (
                                        <span className="text-xs text-green-600 block font-medium">
                                          Package: {item?.priceSection?.title}
                                        </span>
                                      )}

                                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <span className="text-sm font-bold text-black">
                                          {formatPrice(finalPrice)}
                                        </span>
                                        {discount > 0 && originalPrice > finalPrice && (
                                          <>
                                            <span className="text-xs text-gray-400 line-through">
                                              ₹{formatPrice(originalPrice)}
                                            </span>
                                            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                              {Math.round((discount / originalPrice) * 100)}% OFF
                                            </span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* QTY */}
                                <td className="py-4 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleQtyChange(item, "decrease")}
                                      className="p-1 hover:bg-gray-100 rounded transition disabled:opacity-30"
                                      disabled={item.quantity === 1}
                                    >
                                      <FiMinus size={12} />
                                    </button>
                                    <span className="text-sm font-semibold w-8 text-center">
                                      {item?.quantity}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleQtyChange(item, "increase")}
                                      className="p-1 hover:bg-gray-100 rounded transition"
                                    >
                                      <FiPlus size={12} />
                                    </button>
                                  </div>
                                  {item?.maxStock && (
                                    <div className="text-xs text-gray-400 mt-1">
                                      Max: {item.maxStock}
                                    </div>
                                  )}
                                </td>

                                {/* TOTAL */}
                                <td className="py-4 text-right">
                                  <div className="font-semibold text-gray-900">
                                    {formatPrice(finalPrice * item.quantity)}
                                  </div>
                                  {discount > 0 && (
                                    <div className="text-xs text-gray-400 line-through">
                                      {formatPrice(originalPrice * item.quantity)}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* ========== OLD PRICE SUMMARY - COMMENTED FOR REFERENCE ========== */}
                    {/*
                    <div className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold mb-4">Price Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">{formatPrice(subtotal)}</span>
                        </div>
                        {totalDiscount > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Product Discount</span>
                            <span>- {formatPrice(totalDiscount)}</span>
                          </div>
                        )}
                        {cartDiscountAmount > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Cart Discount ({summary.cartDiscount}%)</span>
                            <span>- {formatPrice(cartDiscountAmount)}</span>
                          </div>
                        )}
                        {taxAmount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Tax ({summary.tax}%)</span>
                            <span>+ {formatPrice(taxAmount)}</span>
                          </div>
                        )}
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total Amount</span>
                            <span className="text-black">{formatPrice(totalAmount)}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2 text-right">
                            Inclusive of all taxes
                          </p>
                        </div>
                      </div>
                    </div>
                    */}

                    {/* GRAND TOTAL CARD */}
                    <div className="mt-8 w-full rounded-lg bg-black px-5 py-4 flex items-center justify-between">
                      <h3 className="text-base md:text-lg font-semibold text-white tracking-wide">
                        GRAND TOTAL
                      </h3>
                      <span className="text-lg md:text-xl font-bold text-white">
                        ₹ {formatPrice(totalAmount)}
                      </span>
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