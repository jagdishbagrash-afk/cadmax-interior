import React, { useEffect, useState } from "react";
import Layout from "../common/Layout";
import Listing from "../api/Listing";
import DateComponent from "@/components/DateComponent";
import Image from "next/image";
import { formatMultiPrice } from "@/components/ValueDataHook";
import { FaChevronDown, FaSearch, FaCircle, FaBox, FaTruck, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ShipmentCard from "@/components/ShipmentCard";
import {
  extractCarrier,
  extractOrderAndShipment,
} from "@/components/shipmentUtils";

const STATUS_CONFIG = {
  pending: { color: "text-yellow-700 bg-yellow-50 border-yellow-200", label: "Pending", icon: FaClock },
  confirmed: { color: "text-blue-700 bg-blue-50 border-blue-200", label: "Confirmed", icon: FaCircle },
  shipped: { color: "text-purple-700 bg-purple-50 border-purple-200", label: "Shipped", icon: FaTruck },
  delivered: { color: "text-green-700 bg-green-50 border-green-200", label: "Delivered", icon: FaBox },
  cancelled: { color: "text-red-700 bg-red-50 border-red-200", label: "Cancelled", icon: FaCircle },
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
    if (!normalizedId || shipmentLoadingMap[normalizedId]) return;

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
      const message = err?.response?.data?.message || "Unable to fetch shipment details.";
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
    if (!normalizedId || shipmentLoadingMap[normalizedId]) return;

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
      const message = err?.response?.data?.message || "Unable to refresh shipment details.";
      setShipmentErrorMap((prev) => ({ ...prev, [normalizedId]: message }));
    } finally {
      setShipmentLoadingMap((prev) => ({ ...prev, [normalizedId]: false }));
    }
  };

  const handleToggleOrder = (orderId, order) => {
    const normalizedId = String(orderId || "");
    if (!normalizedId) return;

    const willOpen = activeOrder !== normalizedId;
    setActiveOrder(willOpen ? normalizedId : null);

    if (willOpen && !shipmentMap[normalizedId]) {
      fetchShipmentForOrder(normalizedId, order);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10 bg-white min-h-screen font-sans text-gray-800">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-light tracking-tight">My Orders</h1>
          <div className="relative flex items-center w-full md:w-auto border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-orange-400 focus-within:border-transparent transition-all">
            <div className="pl-3 text-gray-400"><FaSearch size={14} /></div>
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 text-sm outline-none w-full md:w-72 bg-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="pr-3 text-xs text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 gap-1 md:gap-4 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Result count */}
        <p className="text-sm text-gray-500 mb-5">
          <span className="font-semibold text-gray-700">{filteredOrders.length}</span> orders found
          {searchQuery && <span> for “<span className="italic">{searchQuery}</span>”</span>}
        </p>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-400 border-t-transparent"></div>
            <p className="mt-4 text-gray-500">Loading your orders…</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-300 rounded-2xl bg-gray-50">
            <p className="text-gray-500">No orders match your criteria.</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveTab("All"); }}
              className="text-orange-600 text-sm hover:underline mt-2"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              const isOpen = activeOrder === order?._id;
              const statusKey = order?.status?.toLowerCase() || "pending";
              const statusStyle = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
              const StatusIcon = statusStyle.icon || FaCircle;
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
                  )}${trackingCourier ? `?courier=${encodeURIComponent(trackingCourier)}` : ""}`
                : "";

              return (
                <div
                  key={order?._id}
                  className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {/* Status Bar */}
                  <div className={`px-4 py-1.5 text-xs font-semibold uppercase flex items-center gap-2 border-b ${statusStyle.color}`}>
                    <StatusIcon size={10} className="animate-pulse" />
                    Status: {statusStyle.label}
                  </div>

                  {/* Order Header (clickable) */}
                  <div
                    onClick={() => handleToggleOrder(order?._id, order)}
                    className="bg-gray-50 px-4 py-3 flex flex-wrap items-center justify-between gap-y-3 text-sm text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex flex-wrap gap-6 md:gap-10">
                      <div>
                        <p className="uppercase text-xs font-bold text-gray-400">Order Placed</p>
                        <p className="text-sm font-medium text-gray-800">
                          <DateComponent item={order?.createdAt} />
                        </p>
                      </div>
                      <div>
                        <p className="uppercase text-xs font-bold text-gray-400">
                          {order?.paymentMethod === "COD" ? "Payment Method" : "Total Paid"}
                        </p>
                        <p className={`text-sm font-bold ${order?.paymentMethod === "COD" ? "text-amber-600" : "text-gray-800"}`}>
                          {order?.paymentMethod === "COD"
                            ? "Cash on Delivery"
                            : formatMultiPrice(order?.amount, "INR")}
                        </p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="uppercase text-xs font-bold text-gray-400">Order #</p>
                        <p className="text-sm font-mono text-gray-700">{order?.orderId}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Link
                        href={`/orders/${order?.orderId || order?._id}`}
                        className="text-sm text-orange-600 hover:underline font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Details
                      </Link>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <FaChevronDown size={12} className="text-gray-400" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Expandable Content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="bg-white overflow-hidden"
                      >
                        <div className="p-5 border-t border-gray-100 space-y-6">
                          {/* Items */}
                          {order?.product?.map((item, idx) => {
                            const selectedVariant = item?.id?.variants?.find(
                              (v) =>
                                v.title?.toLowerCase().trim() === item.variant?.toLowerCase().trim() ||
                                v.color?.toLowerCase().trim() === item.variant?.toLowerCase().trim()
                            );
                            const variantImg = selectedVariant?.images?.[0];

                            return (
                              <div
                                key={idx}
                                className="flex flex-col sm:flex-row gap-4 pb-4 border-b last:border-0 last:pb-0"
                              >
                                <div className="flex gap-4 flex-1">
                                  <div className="w-20 h-20 relative flex-shrink-0 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden">
                                    <Image
                                      src={variantImg || "/placeholder.png"}
                                      alt={item?.id?.title || "Product"}
                                      fill
                                      className="object-contain p-1"
                                    />
                                  </div>
                                  <Link
                                    href={`/product/details/${item?.id?.slug}`}
                                    className="flex-1 space-y-0.5"
                                  >
                                    <p className="text-sm font-medium text-gray-800 hover:underline line-clamp-2">
                                      {item?.id?.title}
                                    </p>
                                    <p className="text-xs text-gray-500 uppercase font-medium">
                                      {item.priceSectionTitle && `Section: ${item.priceSectionTitle}`}
                                    </p>
                                    <p className="text-xs text-gray-500">Variant: {item.variant}</p>
                                    <p className="text-sm font-bold text-gray-800">
                                      {formatMultiPrice(item?.total, "INR")}
                                    </p>
                                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                  </Link>
                                </div>
                                {/* Optional action buttons – uncomment if needed */}
                                {/* <div className="flex flex-col gap-2 sm:w-36">
                                  <button className="text-sm py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                    Ask Question
                                  </button>
                                  <button className="text-sm py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                    Write Review
                                  </button>
                                </div> */}
                              </div>
                            );
                          })}

                          {/* Shipping Address */}
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                              <FaMapMarkerAlt className="text-orange-500" /> Shipping Address
                            </p>
                            <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                              {order?.addressId?.street_address}, {order?.addressId?.city},{" "}
                              {order?.addressId?.state}, {order?.addressId?.country} -{" "}
                              {order?.addressId?.pincode}
                            </p>
                            <p className="text-sm text-gray-700 mt-1">
                              <span className="font-medium">{order?.name}</span> | {order?.mobile}
                            </p>
                          </div>

                          {/* Shipment Card */}
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

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3 pt-1">
                            <Link
                              href={orderTrackingHref}
                              className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                            >
                              Track by Order
                            </Link>
                            {publicTrackingHref && (
                              <Link
                                href={publicTrackingHref}
                                className="inline-flex items-center rounded-lg border border-green-600 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 transition"
                              >
                                Public Tracking
                              </Link>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Footer when collapsed */}
                  {!isOpen && (
                    <div className="px-4 py-2 bg-white flex justify-between items-center text-xs text-gray-400 border-t border-gray-100">
                      <span>{order?.product?.length} items in this order</span>
                      <button
                        onClick={() => handleToggleOrder(order?._id, order)}
                        className="text-orange-600 hover:underline font-medium"
                      >
                        Show items
                      </button>
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