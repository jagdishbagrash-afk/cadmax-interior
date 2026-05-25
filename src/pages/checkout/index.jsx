import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { formatMultiPrice } from "@/components/ValueDataHook";
import { incrementQty, decrementQty, clearCart, removeItem } from "@/redux/cartSlice";
import toast from "react-hot-toast";
import { FiPlus, FiMinus } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import Layout from "../common/Layout";
import Listing from "../api/Listing";
import { useRouter } from "next/router";
import { useRole } from "@/context/RoleContext";
import Banner from "@/components/Banner";
import BannerImages from "../../Assets/Images/Frame18.jpg"
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import Link from "next/link";

export default function Index() {
  const { error, isLoading, Razorpay } = useRazorpay();

  const FetchGetCart = async () => {
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

  const [data, setData] = useState([]);
  const RAZOPAY_KEY = process.env.NEXT_PUBLIC_RAZOPAY_KEY;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState([])

  const cartItems = record?.items || [];

  const dispatch = useDispatch();
  const { user } = useRole();


  const totalPrice = record?.summary?.finalAmount;

  const itemNames = cartItems.map((item) => item.name);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    mobile: user?.phone ? String(user.phone) : "",  // ✅ FIX
    address: "",
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

      const productId = item.productId || item.product?._id;
      const variant = item.variant || item.selectedVariant;

      const response = await main.RemoveCart(productId, variant);

      if (response?.data?.status) {
        toast.success(response.data.message);

        // ✅ refresh cart
        FetchCart();
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to remove item"
      );
    }
  };


  const handlePaymentCreateSubmit = async (e) => {
    e.preventDefault();
   if (String(formData.mobile).length !== 10) {
  toast.error("Mobile number must be exactly 10 digits");
  return;
}

    if (totalPrice === 0) {
      toast.error("Amount can't be 0!");
      return;
    }

    setLoading(true);
    const main = new Listing();
    try {
      const res = await main.AddPaymentCreate({
        "amount": totalPrice,
        "currency": "INR",
        "receipt": "receipt#1"
      });
      if (res && res.data && res.data.orderId) {
        const options = {
          key: RAZOPAY_KEY,
          amount: totalPrice,
          currency: "INR",
          name: "Cadmaxatelier",
          description: "Payment for services",
          order_id: res.data.orderId,
          handler: function (response) {
            localStorage.setItem("response", JSON.stringify(response));
            handleSubmit(response);
            toast.success("Payment Successful");
          },
          prefill: {
            name: "Customer Name",
            email: "customer@example.com",
            contact: "1234567890",
          },
          notes: {
            address: "Razorpay Corporate Office",
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
            savePaymentDetails(orderId, paymentId, "failed");
            router.push(`/cancel`);
            // Pass 'failed'
          } else {
            console.error("Failed to retrieve Razorpay order or payment ID");
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
    if (loading) { return; }
    setLoading(true);
    try {
      // const products = cartItemsRedux.map((item) => ({
      //   id: item?.product?._id,
      //   price: item?.price,
      //   quantity: item?.quantity,
      //   total: item?.price * item?.quantity,
      //   variant: item?.selectedVariant,
      // }));

      const products = cartItems.map((item) => ({
  id: item?.productId || item?._id,
  price: item?.unitPrice,
  quantity: item?.quantity,
  total: item?.unitPrice * item?.quantity,
  variant: item?.variant,
}));
      const main = new Listing();
      const res = await main.AddOrder({
        name: formData?.name,
        mobile: formData?.mobile,
        address: formData?.address,
        product: products,
        amount: totalPrice,
        PaymentId: response.razorpay_payment_id
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
        toast.success(res?.data?.message);


      } else {
        toast.error(res?.data?.message || "Failed to place order");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "An unknown error occured");
    } finally {
      setLoading(false);
    }
  };


  const savePaymentDetails = async (orderId, paymentId, payment_status, Orderdatas) => {
    setLoading(true);
    try {
      const main = new Listing();

      const response = await main.PaymentSave({
        "order_id": orderId,
        "payment_id": paymentId,
        "currency": "INR",
        "product_name": itemNames,
        "amount": totalPrice,
        "type": "product",
        "payment_status": payment_status,
        "OrderID": Orderdatas,
      });
      if (response?.data?.status) {
        toast.success(response.data.message);
        router.push(`/success`);
        dispatch(clearCart());
        FetchGetCart();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };


  console.log("|record", record)

  const FetchCart = async () => {
    try {
      const main = new Listing();
      const response = await main.CartGet();
      if (response?.data?.data) {
        setRecord(response.data.data);
      } else {
        setData([]);
      }

    } catch (error) {
      console.log(error);
      setData([]);
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

      const newQty =
        type === "increase"
          ? item.quantity + 1
          : item.quantity - 1;

      // ⛔ safety
      if (newQty < 1) return;

      const response = await main.UpdateTocart({
        productId: item.productId || item.product?._id,
        variant: item.variant || item.selectedVariant,
        quantity: newQty,
      });

      if (response?.data?.status) {
        toast.success(response.data.message);

        // ✅ refresh cart
        FetchCart();
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update quantity"
      );
    }
  };




  return (
    <Layout>
      <Banner Slider1={BannerImages} />
      <section className="w-full bg-white py-12 md:py-20 lg:py-24 text-black antialiased">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* LEFT COLUMN: FORM */}
            <div className="w-full lg:w-5/12">
              <div className="bg-[#F9F9F9] rounded-sm border border-gray-200 shadow-sm">
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
                        placeholder="+91 98765 43210"
                        autoComplete="tel"
                        value={formData.mobile}
                        onChange={handleChange}
                        maxLength={10}   // 👈 extra safety
                        pattern="[0-9]{10}" // 👈 exactly 10 digits
                        className="w-full border border-gray-300 px-4 py-3 text-black transition focus:border-black focus:ring-1 focus:ring-black outline-none"
                        required
                      />
                    </div>

                    {/* ADDRESS */}
                    {/* <div>
                        <label htmlFor="address" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                          Full Address *
                        </label>
                        <textarea
                          id="address"
                          name="address"
                          placeholder="House No, Street, Landmark, City, Pincode"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full border border-gray-300 px-4 py-3 text-black transition focus:border-black focus:ring-1 focus:ring-black outline-none h-32 resize-none"
                          required
                        />
                      </div> */}


                    <div>
                      <div className="flex justify-between items-center  text-center mt-2 ">
                        <label
                          htmlFor="address"
                          className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2"
                        >
                          Address *
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

                      {/* 👉 If no address */}

                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 mt-8 font-bold uppercase tracking-widest transition duration-300 
                      ${loading
                        ? "bg-gray-300 cursor-not-allowed text-gray-500"
                        : "cursor-pointer bg-black text-white hover:bg-gray-800 active:scale-[0.98]"}`}
                  >
                    {loading ? "Processing..." : "Proceed"}
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT COLUMN: CART SUMMARY */}
            <div className="w-full lg:w-7/12">
              <div className="sticky top-10">
                <h2 className="text-2xl font-semibold border-b border-gray-200 pb-5 mb-4">
                  Order Summary ({cartItems?.length || 0})
                </h2>
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
                      {record?.items?.map((item) => (
                        <tr key={item.id} className="group">
                          <td className="py-4">
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => handleRemove(item)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                title="Remove Item"
                              >
                                <FaRegTrashCan size={16} />
                              </button>
                              <div className="relative h-16 w-16 flex-shrink-0 bg-gray-50 border border-gray-100">
                                <Image
                                  src={item?.images[0]}
                                  fill
                                  alt={item?.name}
                                  className="object-contain p-1"
                                />
                              </div>
                              <span className="font-medium text-sm text-gray-900 line-clamp-2">
                                {item?.name}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleQtyChange(item, "decrease")}
                              className="px-2 py-1 hover:bg-gray-100 disabled:opacity-30 transition"
                              disabled={item.quantity === 1}
                            >
                              <FiMinus size={12} />
                            </button>

                            <span className="px-2 text-sm font-semibold w-8">
                              {item?.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleQtyChange(item, "increase")}
                              className="px-2 py-1 hover:bg-gray-100 transition"
                            >
                              <FiPlus size={12} />
                            </button>
                          </td>

                          <td className="py-4 text-right font-semibold text-gray-900">
                            {formatMultiPrice(item.unitPrice * item.quantity, "INR")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-black">
                        <td colSpan={2} className="py-6 text-lg font-bold">Total Amount</td>
                        <td className="py-6 text-right text-xl font-extrabold text-black">
                          {formatMultiPrice(record?.summary?.finalAmount, "INR")}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
}