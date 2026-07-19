import React, { useEffect, useState } from "react";
import Layout from "../common/Layout";
import Listing from "../api/Listing";
import DateComponent from "@/components/DateComponent";
import Image from "next/image";
import { formatMultiPrice } from "@/components/ValueDataHook";
import { FaChevronDown, FaSearch, FaCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ShipmentCard from "@/components/ShipmentCard";
import {
  extractCarrier,
  extractOrderAndShipment,
} from "@/components/shipmentUtils";

const STATUS_CONFIG = {
  pending: { color: "text-yellow-600 bg-yellow-50 border-yellow-200", label: "Pending" },
  confirmed: { color: "text-blue-600 bg-blue-50 border-blue-200", label: "Confirmed" },
  shipped: { color: "text-purple-600 bg-purple-50 border-purple-200", label: "Shipped" },
  delivered: { color: "text-green-600 bg-green-50 border-green-200", label: "Delivered" },
  cancelled: { color: "text-red-600 bg-red-50 border-red-200", label: "Cancelled" },
};

const TABS = ["All", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeOrder, setActiveOrder] = useState(null);
  const [shipmentMap, setShipmentMap] = useState({});
  const [shipmentLoadingMap, setShipmentLoadingMap] = useState({});
  const [shipmentErrorMap, setShipmentErrorMap] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const main = new Listing();
      const response = await main.userGetOrders();
      console.log(response)
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

  // const handleToggleOrder = (orderId) => {
  //   setActiveOrder((prev) => (prev === orderId ? null : orderId));
  // };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      activeTab === "All" ||
      order?.status?.toLowerCase() === activeTab.toLowerCase();

    const matchesSearch =
      order?._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order?.product?.some((p) =>
        p?.id?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesStatus && matchesSearch;
  });

  const fetchShipmentForOrder = async (orderId, fallbackOrder) => {
    const normalizedId = String(orderId || "");

    if (!normalizedId) {
      return;
    }

    if (shipmentLoadingMap[normalizedId]) {
      return;
    }

    setShipmentLoadingMap((prev) => ({ ...prev, [normalizedId]: true }));
    setShipmentErrorMap((prev) => ({ ...prev, [normalizedId]: "" }));

    try {
      const main = new Listing();
      const response = await main.GetOrderShipment(normalizedId);
      const { order, shipment, trackingNumber } = extractOrderAndShipment(response);

      setShipmentMap((prev) => ({
        ...prev,
        [normalizedId]: {
          order: order || fallbackOrder || null,
          shipment: shipment || null,
          trackingNumber: trackingNumber || "",
        },
      }));
    } catch (err) {
      const message =
        err?.response?.data?.message || "Unable to fetch shipment details.";
      setShipmentErrorMap((prev) => ({ ...prev, [normalizedId]: message }));
      setShipmentMap((prev) => ({
        ...prev,
        [normalizedId]: {
          order: fallbackOrder || null,
          shipment: null,
          trackingNumber: "",
        },
      }));
    } finally {
      setShipmentLoadingMap((prev) => ({ ...prev, [normalizedId]: false }));
    }
  };

  const refreshShipmentForOrder = async (orderId, fallbackOrder) => {
    const normalizedId = String(orderId || "");

    if (!normalizedId || shipmentLoadingMap[normalizedId]) {
      return;
    }

    setShipmentLoadingMap((prev) => ({ ...prev, [normalizedId]: true }));
    setShipmentErrorMap((prev) => ({ ...prev, [normalizedId]: "" }));

    try {
      const main = new Listing();
      await main.RefreshOrderShipment(normalizedId);
      const response = await main.GetOrderShipment(normalizedId);
      const { order, shipment, trackingNumber } = extractOrderAndShipment(response);

      setShipmentMap((prev) => ({
        ...prev,
        [normalizedId]: {
          order: order || fallbackOrder || null,
          shipment: shipment || null,
          trackingNumber: trackingNumber || "",
        },
      }));
    } catch (err) {
      const message =
        err?.response?.data?.message || "Unable to refresh shipment details.";
      setShipmentErrorMap((prev) => ({ ...prev, [normalizedId]: message }));
    } finally {
      setShipmentLoadingMap((prev) => ({ ...prev, [normalizedId]: false }));
    }
  };

  const handleToggleOrder = (orderId, order) => {
    const normalizedId = String(orderId || "");

    if (!normalizedId) {
      return;
    }

    const willOpen = activeOrder !== normalizedId;
    setActiveOrder(willOpen ? normalizedId : null);

    if (willOpen && !shipmentMap[normalizedId]) {
      fetchShipmentForOrder(normalizedId, order);
    }
  };



  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8 bg-white min-h-screen font-sans text-[#111]">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <h1 className="text-[28px] font-normal">My Orders</h1>
          <div className="relative flex items-center w-full md:w-auto border border-[#888c8c] rounded-md shadow-sm overflow-hidden focus-within:ring-1 focus-within:ring-[#e77600] focus-within:border-[#e77600]">
            <div className="pl-3 text-gray-400"><FaSearch size={13} /></div>
            <input
              type="text"
              placeholder="Search by Product name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 text-[13px] outline-none w-full md:w-72"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="pr-3 text-xs text-gray-400 hover:text-black"
              >Clear</button>
            )}
          </div>
        </div>

        <div className="flex border-b border-[#e7e7e7] mb-6 gap-6 overflow-x-auto no-scrollbar">
          {TABS?.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 mt-2 text-[14px] whitespace-nowrap border-b-2 transition-all ${activeTab === tab
                ? "border-[#e77600] text-[#c45500] font-bold"
                : "border-transparent text-[#565959] hover:text-[#007185]"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <p className="text-[14px] mb-4 text-gray-600">
          <span className="font-bold text-black">{filteredOrders?.length} orders</span> found
          {searchQuery && <span> for "<span className="italic">{searchQuery}</span>"</span>}
        </p>

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e77600]"></div>
          </div>
        ) : filteredOrders?.length === 0 ? (
          <div className="text-center py-20 border border-dashed rounded-lg bg-gray-50">
            <p className="text-gray-500">No orders found matching your criteria.</p>
            <button onClick={() => { setSearchQuery(""); setActiveTab("All") }} className="text-[#007185] text-sm hover:underline mt-2">Clear all filters</button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders?.map((order) => {
              const isOpen = activeOrder === order?._id;
              const statusStyle = STATUS_CONFIG[order?.status] || { color: "bg-gray-100", label: order.status };
              const shipmentState = shipmentMap[order?._id];
              const orderTrackingHref = `/orders/${order?._id}/tracking`;
              const trackingCourier = extractCarrier(
                shipmentState?.shipment,
                shipmentState?.order,
                order
              );
              const publicTrackingHref = shipmentState?.trackingNumber
                ? `/shipment/track/${encodeURIComponent(
                  shipmentState.trackingNumber
                )}${trackingCourier
                  ? `?courier=${encodeURIComponent(trackingCourier)}`
                  : ""
                }`
                : "";

              return (
                <div key={order?._id} className="border border-[#D5D9D9] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">

                  <div className={`px-4 py-1.5 text-[11px] font-bold uppercase flex items-center gap-2 border-b ${statusStyle.color}`}>
                    <FaCircle size={7} className="animate-pulse" />
                    Status: {statusStyle.label}
                  </div>

                  <div
                    onClick={() => handleToggleOrder(order?._id, order)}
                    className="bg-[#F0F2F2] px-4 py-3 flex flex-wrap items-center justify-between gap-y-3 text-[12px] text-[#565959] cursor-pointer"
                  >
                    <div className="flex gap-8 sm:gap-12">
                      <div>
                        <p className="uppercase text-[10px] font-bold text-gray-500">Order Placed</p>
                        <p className="text-[13px] text-[#111] font-medium"><DateComponent item={order?.createdAt} /></p>
                      </div>
                      <div>
                        <p className="uppercase text-[10px] font-bold text-gray-500">
                          {order?.paymentMethod === "COD" ? "Payment Method" : "Total Paid"}
                        </p>
                        <p className={`text-[13px] font-bold ${order?.paymentMethod === "COD" ? "text-amber-600" : "text-[#111]"}`}>
                          {order?.paymentMethod === "COD" ? "Cash on Delivery" : formatMultiPrice(order?.amount, "INR")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="uppercase text-[10px] font-bold text-gray-500">Order # {order?.orderId}</p>
                        <p className="text-[#007185] hover:underline">View details</p>
                      </div>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                        <FaChevronDown size={14} className="text-gray-400" />
                      </motion.div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-white"
                      >
                        <div className="p-5 border-t border-gray-100">
                          {order?.product?.map((item, idx) => {
                            const selectedVariant = item?.id?.variants?.find(
                              (v) =>
                                v.title?.toLowerCase().trim() ===
                                item.variant?.toLowerCase().trim() ||
                                v.color?.toLowerCase().trim() ===
                                item.variant?.toLowerCase().trim()
                            );


                            const variantImg = selectedVariant?.images?.[0];

                            return (
                              <div key={idx} className="flex flex-col md:flex-row gap-6 mb-6 last:mb-0 pb-6 last:pb-0 border-b last:border-0">
                                <div className="flex flex-1 gap-4">
                                  <div className="w-24 h-24 relative flex-shrink-0 border border-gray-100 rounded-md">
                                    <Image fill src={variantImg} alt="product" className="object-contain p-1" />
                                  </div>
                                  <Link href={`/product/details/${item?.id?.slug}`} className="flex-1">
                                    <p className="text-[#0000000] text-[15px] font-medium hover:underline cursor-pointer leading-snug">
                                      {item?.id?.title}
                                    </p>
                                    <p className="text-[12px] text-gray-500 mt-1 uppercase font-bold tracking-tight">section: {item.priceSectionTitle}</p>

                                    <p className="text-[12px] text-gray-500 mt-1 uppercase font-bold tracking-tight">Variant: {item.variant}</p>
                                    <p className="text-[14px] font-bold mt-2">{formatMultiPrice(item?.total, "INR")}</p>
                                    <p className="text-[12px] text-gray-400">Qty: {item.quantity}</p>
                                  </Link>
                                </div>

                                {/* <div className="flex flex-col gap-2 w-full md:w-[200px]">
                                  <button className="w-full text-[13px] py-1.5 border border-[#D5D9D9] rounded-lg hover:bg-gray-50 shadow-sm transition">
                                    Ask Product Question
                                  </button>
                                  <button className="w-full text-[13px] py-1.5 border border-[#D5D9D9] rounded-lg hover:bg-gray-50 shadow-sm transition">
                                    Write a review
                                  </button>
                                  <button className="w-full text-[13px] py-1.5 bg-[#FFD814] border border-[#FCD200] rounded-lg hover:bg-[#F7CA00] shadow-sm font-medium">
                                    Buy it again
                                  </button>
                                </div> */}
                              </div>
                            );
                          })}
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                              <p className="text-[12px] font-bold text-gray-500 uppercase mb-1">
                                Shipping Address
                              </p>

                              <p className="text-[13px] text-gray-700 leading-relaxed">
                                {order?.addressId?.street_address}, {order?.addressId?.city},{" "}
                                {order?.addressId?.state}, {order?.addressId?.country} -{" "}
                                {order?.addressId?.pincode}
                              </p>

                              <p className="text-[13px] text-gray-700 mt-2">
                                <span className="font-medium">{order?.name}</span> |{" "}
                                {order?.mobile}
                              </p>
                            </div>
                          </div>

                          <ShipmentCard
                            title="Shipment Details"
                            order={shipmentState?.order || order}
                            shipment={shipmentState?.shipment}
                            loading={shipmentLoadingMap[order?._id]}
                            error={shipmentErrorMap[order?._id]}
                            trackingHref={publicTrackingHref || orderTrackingHref}
                            onRefresh={() =>
                              refreshShipmentForOrder(order?._id, shipmentState?.order || order)
                            }
                            emptyMessage="Shipment details will appear after payment verification and carrier creation."
                          />

                          <div className="mt-4 flex flex-wrap gap-3">
                            <Link
                              href={orderTrackingHref}
                              className="inline-flex rounded-md border border-black px-4 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
                            >
                              Track By Order
                            </Link>
                            {publicTrackingHref ? (
                              <Link
                                href={publicTrackingHref}
                                className="inline-flex rounded-md border border-green-700 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-700 hover:text-white"
                              >
                                Public Tracking
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!isOpen && (
                    <div className="px-4 py-2 bg-white flex justify-between items-center text-[12px] text-gray-400">
                      <p>{order?.product?.length} items in this order</p>
                      <button className="text-[#007185] hover:underline">Show items</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
