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

export default function Index() {
  const { Razorpay } = useRazorpay();

  const router = useRouter();
  const { user } = useRole();

  const RAZOPAY_KEY = process.env.NEXT_PUBLIC_RAZOPAY_KEY;

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);

  const [data, setData] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    addressId: "",
  });

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
            color: "#F37254",
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

  // SAVE ORDER
  const handleSubmit = async (response) => {
    try {
      setLoading(true);

      const main = new Listing();

      const productData = [
        {
          id: product?.productId,
          price: product?.price,
          discount_amount: product?.discount_amount,
          final_amount: product?.final_amount,
          quantity: product?.quantity,
          total: finalTotal,
          variant: product?.variant,
        },
      ];

      const res = await main.AddOrder({
        name: formData.name,
        mobile: formData.mobile,
        addressId: formData.addressId,
        product: productData,

        subtotal,
        discountAmount: discountTotal,
        amount: finalTotal,

        PaymentId: response.razorpay_payment_id,
      });

      if (res?.data?.status) {
        await savePaymentDetails(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          "success",
          res?.data?.data?._id
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
    Orderdatas
  ) => {
    try {
      const main = new Listing();

      const response = await main.PaymentSave({
        order_id: orderId,
        payment_id: paymentId,
        currency: "INR",
        product_name: [product?.name],
        amount: finalTotal,
        type: "product",
        payment_status,
        OrderID: Orderdatas,
      });

      if (response?.data?.status) {
        localStorage.removeItem("buyNowItem");

        toast.success(response.data.message);

        router.push("/success");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Payment save failed");
    }
  };

  return (
    <Layout>
      <Banner Slider1={BannerImages} />

      <section className="w-full bg-white py-12 md:py-20 lg:py-24 text-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">

            {/* LEFT COLUMN – Shipping Form */}
            <div className="w-full lg:w-5/12">
              <div className="bg-[#F9F9F9] border border-gray-200 shadow-sm">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-2xl font-semibold">
                    Shipping Details
                  </h2>
                </div>

                <form
                  className="p-6"
                  onSubmit={handlePaymentCreateSubmit}
                >
                  <div className="space-y-6">

                    {/* NAME */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-3 outline-none"
                        required
                      />
                    </div>

                    {/* MOBILE */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Mobile Number
                      </label>

                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        maxLength={10}
                        className="w-full border border-gray-300 px-4 py-3 outline-none"
                        required
                      />
                    </div>

                    {/* ADDRESS */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">
                          Address
                        </label>

                        <Link
                          href="/address"
                          className="text-sm text-blue-600 underline"
                        >
                          + Add New Address
                        </Link>
                      </div>

                      <select
                        name="addressId"
                        value={formData.addressId}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-4 py-3 outline-none"
                        required
                      >
                        <option value="">
                          Select Address
                        </option>

                        {data?.map((item) => (
                          <option
                            key={item._id}
                            value={item._id}
                          >
                            {`${item.street_address}, ${item.city}, ${item.state}, ${item.country} - ${item.pincode}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 mt-8 font-bold transition
                    ${
                      loading
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    {loading ? "Processing..." : "Pay Now"}
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT COLUMN – Product Summary */}
            <div className="w-full lg:w-7/12">
              <div className="border border-gray-200 p-6">

                <h2 className="text-2xl font-semibold border-b pb-4 mb-6">
                  Product Summary
                </h2>

                {product && (
                  <div className="flex gap-5 items-start">

                    {/* IMAGE */}
                    <div className="w-28 h-28 border bg-gray-100 overflow-hidden flex-shrink-0">
                      <img
                        src={
                          product?.images?.[0] ||
                          "/placeholder.png"
                        }
                        alt={product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* DETAILS */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        {product?.name}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Variant: {product?.variant}
                      </p>

                      {/* ---- NEW: Price Section ---- */}
                      {product?.selectedPriceSection?.title && (
                        <p className="text-sm text-gray-500">
                          Category: {product.selectedPriceSection.title}
                        </p>
                      )}

                      {/* ---- NEW: Selected Size ---- */}
                      {product?.selectedSize?.title && (
                        <p className="text-sm text-gray-500">
                          Size: {product.selectedSize.title}
                        </p>
                      )}

                      <p className="text-sm text-gray-500">
                        Quantity: {product?.quantity}
                      </p>

                      {/* PRICE DISPLAY */}
                      <div className="mt-3 space-y-1">

                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 line-through text-sm">
                            {formatMultiPrice(subtotal, "INR")}
                          </span>

                         
                        </div>

                        <div className="text-2xl font-bold">
                          {formatPrice(finalTotal, "INR")}
                        </div>

                      </div>
                    </div>
                  </div>
                )}

                {/* FINAL TOTAL */}
                <div className="border-t mt-8 pt-6 space-y-3">
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-lg font-semibold">
                      Final Amount
                    </span>

                    <span className="text-2xl font-bold">
                      {formatPrice(finalTotal, "INR")}
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
}