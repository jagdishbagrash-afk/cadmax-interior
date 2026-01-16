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
import BannerImages  from "../../Assets/Images/Frame18.jpg"
export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const cartItemsRedux = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const { user } = useRole();
  console.log("cartItemsRedux", cartItemsRedux);

  const totalPrice = cartItemsRedux.reduce((sum, item) => {
    return sum + Number(item?.price * item?.quantity);
  }, 0);

  // FORM STATE (Only 3 inputs)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    mobile: user?.phone || "",
    address: "",
  });

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

  const handleRemove = (id) => {
    dispatch(removeItem(id));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // console.log("Form Submitted:", formData);
    // toast.success("Submitted in console");
    if (!cartItemsRedux || cartItemsRedux.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if(loading){return;}
    setLoading(true);
    try {
      const products = cartItemsRedux.map((item) => ({
        id: item?.product?._id,
        price: item?.price,
        quantity: item?.quantity,
        total: item?.price * item?.quantity,
        variant: item?.selectedVariant,
      }));
      const main = new Listing();
      const res = await main.AddOrder({ 
        name: formData?.name, 
        mobile: formData?.mobile, 
        address: formData?.address, 
        product: products, 
        amount: totalPrice,
       });
      if (res?.data?.status) {
        toast.success(res?.data?.message);
        router.push("/");
        dispatch(clearCart());
      } else {
        toast.error(res?.data?.message || "Failed to place order");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "An unknown error occured");
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(!user){
      toast.error("Please login to continue");
      router.push("/login");
    }
  },[user])

  return (
    <Layout>
      <Banner Slider1={BannerImages}/>
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

              <form className="p-6" onSubmit={handleSubmit}>
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
                      className="w-full border border-gray-300 px-4 py-3 text-black transition focus:border-black focus:ring-1 focus:ring-black outline-none"
                      required
                    />
                  </div>

                  {/* ADDRESS */}
                  <div>
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
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading }
                  className={`w-full py-4 mt-8 font-bold uppercase tracking-widest transition duration-300 
                    ${loading 
                      ? "bg-gray-300 cursor-not-allowed text-gray-500" 
                      : "cursor-pointer bg-black text-white hover:bg-gray-800 active:scale-[0.98]"}`}
                >
                  {loading ? "Processing..." : "Complete Order"}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: CART SUMMARY */}
          <div className="w-full lg:w-7/12">
            <div className="sticky top-10">
              <h2 className="text-2xl font-semibold border-b border-gray-200 pb-5 mb-4">
                Order Summary ({cartItemsRedux?.length || 0})
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
                      {cartItemsRedux?.map((item) => (
                        <tr key={item.id} className="group">
                          <td className="py-4">
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => handleRemove(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                title="Remove Item"
                              >
                                <FaRegTrashCan size={16} />
                              </button>
                              <div className="relative h-16 w-16 flex-shrink-0 bg-gray-50 border border-gray-100">
                                <Image
                                  src={item?.imgUrl[0]}
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
                            <div className="inline-flex items-center border border-gray-200 rounded-sm">
                              <button
                                onClick={() => dispatch(decrementQty(item?.id))}
                                className="px-2 py-1 hover:bg-gray-100 disabled:opacity-30 transition"
                                disabled={item.quantity === 1}
                              >
                                <FiMinus size={12} />
                              </button>
                              <span className="px-2 text-sm font-semibold w-8">{item?.quantity}</span>
                              <button
                                onClick={() => dispatch(incrementQty(item?.id))}
                                className="px-2 py-1 hover:bg-gray-100 transition"
                              >
                                <FiPlus size={12} />
                              </button>
                            </div>
                          </td>

                          <td className="py-4 text-right font-semibold text-gray-900">
                            {formatMultiPrice(item.price * item.quantity, "INR")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-black">
                        <td colSpan={2} className="py-6 text-lg font-bold">Total Amount</td>
                        <td className="py-6 text-right text-xl font-extrabold text-black">
                          {formatMultiPrice(totalPrice, "INR")}
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
