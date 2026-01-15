import React, { useEffect, useState } from "react";
import Layout from "../common/Layout";
import Listing from "../api/Listing";
import DateComponent from "@/components/DateComponent";
import Image from "next/image";
import { formatMultiPrice } from "@/components/ValueDataHook";

const STATUS_COLORS = {
  pending: "text-orange-500",
  confirmed: "text-blue-500",
  shipped: "text-purple-500",
  delivered: "text-green-600",
  cancelled: "text-red-500",
};
const STATUSES = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function Index() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("all");
  const [activeOrder, setActiveOrder] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const main = new Listing();
      const response = await main.userGetOrders();
      setOrders(response?.data?.data || []);
    } catch (err) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleOrder = (id) => {
    setActiveOrder(activeOrder === id ? null : id);
  };

  const filteredOrders =
    status === "all" ? orders : orders.filter((o) => o.status === status);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">My Orders</h1>

        <div className="flex flex-wrap gap-2 mb-8">
          {STATUSES && STATUSES?.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-4 py-2 text-sm border rounded-full transition cursor-pointer
                ${
                  status === s
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-black hover:bg-black hover:text-white"
                }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {loading && <p className="text-gray-500">Loading orders...</p>}

        {!loading && filteredOrders && filteredOrders?.length === 0 && (
          <p className="text-gray-500">No orders found.</p>
        )}

        <div className="space-y-4">
          {filteredOrders && filteredOrders?.map((order) => {
            const firstItem = order.product[0];
            const image = firstItem?.id?.variants?.find(
              (v) => v.color === firstItem.variant
            )?.images?.[0];
            console.log("firstItem", firstItem);

            return (
              <div
                key={order?._id}
                className="border border-gray-200 rounded-lg bg-white"
              >
                {/* COLLAPSED CARD */}
                <button
                  onClick={() => toggleOrder(order?._id)}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition cursor-pointer"
                >
                  {/* Image */}
                  <Image
                    height={300}
                    width={300}
                    src={image}
                    alt={firstItem?.id?.title}
                    className="w-16 h-16 object-cover rounded border"
                  />

                  {/* Info */}
                  <div className="flex-1">
                    <p className="text-sm font-medium capitalize">{firstItem?.id?.title}</p>
                    <p className="text-xs text-gray-500">
                     {order?.product?.length} item(s)
                    </p>
                    <p className="text-xs text-gray-400">
                      Order #{order?._id}
                    </p>
                  </div>

                  {/* Price & Status */}
                  <div className="text-right">
                    <p className="font-semibold text-black">{formatMultiPrice(order?.amount, "INR")}</p>
                    <p
                      className={`text-xs font-medium ${
                        STATUS_COLORS[order?.status]
                      }`}
                    >
                      {order?.status.toUpperCase()}
                    </p>
                  </div>
                </button>

                {/* EXPANDED DETAILS */}
                {activeOrder === order?._id && (
                  <div className="border-t border-gray-200 p-4 space-y-4 bg-gray-50">
                    {/* Products */}
                    <div className="space-y-3">
                      {order?.product && order?.product?.map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <Image
                            height={200}
                            width={200}
                            src={
                              item?.id?.variants?.find(
                                (v) => v.color === item.variant
                              )?.images?.[0]
                            }
                            className="w-12 h-12 object-cover rounded border"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium capitalize">
                              {item?.id?.title}
                            </p>
                            <p className={`text-xs text-gray-500 capitalize`}>
                              {item?.variant} • {formatMultiPrice(item?.price, "INR")} × {item?.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-medium">{formatMultiPrice(item?.total, "INR")}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start text-sm gap-2">
                    {/* Address */}
                    <div className="max-w-[75%]">
                        <p className="font-medium whitespace-nowrap">
                        Delivery:
                        </p>
                        <p className="text-gray-600 line-clamp-2">
                        {order?.address}
                        </p>
                    </div>

                    {/* Date */}
                    <p className="font-medium whitespace-nowrap">
                        Placed on
                        <p className="text-gray-600 line-clamp-2">
                        <DateComponent item={order?.createdAt}/>
                        </p> 
                    </p>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
