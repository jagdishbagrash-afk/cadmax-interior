import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { formatMultiPrice } from "@/components/ValueDataHook";
import { clearCart, removeItem } from "@/redux/cartSlice";
import toast from "react-hot-toast";
import { FaRegTrashCan } from "react-icons/fa6";
import Layout from "../common/Layout";

export default function Index() {
  const cartItemsRedux = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const totalPrice = cartItemsRedux.reduce((sum, item) => {
    return sum + Number(item?.price * item?.quantity);
  }, 0);

  // FORM STATE (Only 3 inputs)
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
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

  const handleSubmit = () => {
    if (!formData.name || !formData.mobile || !formData.address) {
      toast.error("Please fill all fields");
      return;
    }

    console.log("Form Submitted:", formData);
    toast.success("Submitted in console");

    dispatch(clearCart());
  };

  return (
    <Layout>
      <div className="w-full bg-white py-[50px] md:py-[70px] lg:py-[100px] text-black">
        <div className="mx-auto container px-4">
          <div className="flex flex-wrap -mx-4">
            {/* LEFT FORM */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="bg-[#F4F4F4] border border-gray-300">
                <div className="px-4 pt-4 pb-4 border-b border-gray-300">
                  <h2 className="font-normal text-3xl text-black">
                    Your Details
                  </h2>
                </div>

                <form className="px-4 py-6" onSubmit={handleSubmit}>
                  {/* NAME */}
                  <div className="mb-5">
                    <label className="text-base text-black mb-2 uppercase block">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border border-gray-400 px-3 py-2 w-full text-black focus:outline-none"
                      required
                    />
                  </div>

                  {/* MOBILE */}
                  <div className="mb-5">
                    <label className="text-base text-black mb-2 uppercase block">
                      Mobile *
                    </label>
                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="border border-gray-400 px-3 py-2 w-full text-black focus:outline-none"
                      required
                    />
                  </div>

                  {/* ADDRESS */}
                  <div className="mb-5">
                    <label className="text-base text-black mb-2 uppercase block">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="border border-gray-400 px-3 py-2 w-full text-black focus:outline-none h-24"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-black text-white w-full py-3 mt-3 uppercase tracking-wide"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT CART */}
            <div className="w-full lg:w-6/12 px-4 mt-6 lg:mt-0">
              <div className="pt-4 pb-4 border-b border-gray-300">
                <h2 className="font-normal text-3xl text-black">
                  Your Items
                </h2>
              </div>

              <table className="w-full mt-3">
                <thead>
                  <tr className="border-b border-gray-300">
                    <td></td>
                    <td className="py-3 text-black uppercase">Product</td>
                    <td className="py-3 text-center text-black uppercase">
                      QTY
                    </td>
                    <td className="py-3 text-right text-black uppercase">
                      Amount
                    </td>
                  </tr>
                </thead>

                <tbody>
                  {cartItemsRedux?.map((item, index) => (
                    <tr key={index} className="border-b border-gray-300">
                      <td className="py-3">
                        <button
                          className="text-red-600"
                          onClick={() => handleRemove(item.id)}
                        >
                          <FaRegTrashCan size={14} />
                        </button>
                      </td>

                      <td className="py-3">
                        <div className="flex items-center">
                          <div className="bg-gray-200 w-[70px]">
                            <Image
                              src={item?.imgUrl[0]}
                              width={588}
                              height={240}
                              alt={item?.name}
                              className="object-cover"
                            />
                          </div>
                          <div className="pl-2 font-medium text-black capitalize">
                            {item?.name}
                          </div>
                        </div>
                      </td>

                      <td className="text-center text-black">
                        {item?.quantity}
                      </td>

                      <td className="text-right font-medium text-black">
                        {formatMultiPrice(item?.price, "INR")}
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr className="border-b border-gray-300">
                    <td
                      colSpan={3}
                      className="py-3 font-normal text-xl text-black"
                    >
                      Total
                    </td>
                    <td className="py-3 text-right font-medium text-black">
                      {formatMultiPrice(totalPrice, "INR")}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
