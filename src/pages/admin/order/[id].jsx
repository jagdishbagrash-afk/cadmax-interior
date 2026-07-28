"use client";

import React, { useEffect, useState } from "react";
import {
    FiHome,
    FiPackage,
    FiTruck,
    FiRefreshCw,
    FiCreditCard,
    FiUsers,
    FiGrid,
    FiBarChart2,
    FiSettings,
    FiChevronDown,
    FiChevronRight,
    FiSearch,
    FiEye,
    FiMoreHorizontal,
    FiArrowLeft,
    FiPrinter,
    FiDownload,
    FiXCircle,
    FiClock,
    FiCheckCircle,
    FiTruck as FiTruckIcon,
    FiMapPin,
    FiMail,
    FiPhone,
    FiCalendar,
    FiTag,
    FiDollarSign,
    FiPercent,
    FiBox,
    FiClipboard,
    FiPlus,
    FiMessageSquare,
    FiEdit,
    FiTrash2,
} from "react-icons/fi";
import AdminLayout from "../common/AdminLayout";
import { useRouter } from "next/router";
import Listing from "@/pages/api/Listing";

export default function OrderDetailsPage() {
    const router = useRouter();
    const id = router.query.id;
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async (id) => {
        try {
            setLoading(true);
            const main = new Listing();
            const response = await main.orderId(id);
            if (response?.data?.data) {
                setProject(response.data.data);
            } else {
                setError("Order not found");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Failed to load order details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchData(id);
    }, [id]);

    // ─── HELPERS ──────────────────────────────────────────────
    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusColor = (status) => {
        const map = {
            pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
            confirmed: "bg-blue-100 text-blue-700 border-blue-200",
            processing: "bg-indigo-100 text-indigo-700 border-indigo-200",
            shipped: "bg-purple-100 text-purple-700 border-purple-200",
            delivered: "bg-green-100 text-green-700 border-green-200",
            cancelled: "bg-red-100 text-red-700 border-red-200",
            "ready to ship": "bg-cyan-100 text-cyan-700 border-cyan-200",
        };
        return map[status?.toLowerCase()] || "bg-gray-100 text-gray-700 border-gray-200";
    };

    const getPaymentStatusColor = (status) => {
        const map = {
            paid: "bg-green-100 text-green-700 border-green-200",
            pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
            failed: "bg-red-100 text-red-700 border-red-200",
            refunded: "bg-gray-100 text-gray-700 border-gray-200",
        };
        return map[status?.toLowerCase()] || "bg-gray-100 text-gray-700 border-gray-200";
    };

    // ─── LOADING / ERROR ──────────────────────────────────────
    if (loading) {
        return (
            <AdminLayout>
                <div className="flex-1 flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading order details...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error || !project) {
        return (
            <AdminLayout>
                <div className="flex-1 flex items-center justify-center h-screen">
                    <div className="text-center">
                        <FiXCircle className="w-16 h-16 text-red-500 mx-auto" />
                        <p className="mt-4 text-gray-600">{error || "Order not found"}</p>
                        <button
                            onClick={() => router.push("/admin/orders")}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Back to Orders
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    // ─── DESTRUCTURE DATA ────────────────────────────────────
    const {
        orderId,
        name,
        mobile,
        product = [],
        status = "pending",
        amount = 0,
        PaymentId,
        createdAt,
        updatedAt,
        shipping_status = "pending",
        courier_name = "N/A",
        shipping_timeline = [],
        addressId,
        userId,
        paymentMethod = "ONLINE",
        dispatched_at,
        delivered_at,
    } = project;

    const user = userId || {};
    const address = addressId || {};

    // Calculate totals
    const subtotal = product.reduce((sum, p) => sum + (p.total || p.price * p.quantity || 0), 0);
    const discountTotal = product.reduce((sum, p) => sum + ((p.originalPrice - p.price) * p.quantity || 0), 0);
    const deliveryCharges = 0; // adjust if you have delivery fee field
    const finalTotal = amount || subtotal;

    // Build timeline from shipping_timeline or fallback
    const timelineItems = shipping_timeline.length > 0
        ? shipping_timeline.map((item) => ({
            status: item.status,
            date: formatDate(item.date) || item.date,
            active: true,
        }))
        : [
            { status: "Order Placed", date: formatDate(createdAt), active: true },
            { status: "Payment Success", date: formatDate(createdAt), active: true },
            { status: "Shipped", date: formatDate(dispatched_at), active: !!dispatched_at },
            { status: "Delivered", date: formatDate(delivered_at), active: !!delivered_at },
        ].filter(item => item.date !== "N/A");

    // ─── RENDER ───────────────────────────────────────────────
    return (
        <AdminLayout>
            <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F5F7FA]">
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push("/admin/orders")}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                        >
                            <FiArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Order Details</h2>
                            <p className="text-xs text-gray-500">
                                {orderId || "N/A"} • {formatDate(createdAt)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 rounded-xl text-sm font-medium bg-black text-white hover:bg-gray-800 transition-colors flex items-center gap-2">
                            <FiPrinter className="w-4 h-4" />
                            Print Invoice
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
                            <FiMoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-[1230px] mx-auto space-y-6">

                        {/* ─── ORDER SUMMARY CARD ──────────────── */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Order ID</p>
                                    <p className="text-sm font-bold text-gray-800 mt-1 font-mono">{orderId || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Order Date</p>
                                    <p className="text-sm font-medium text-gray-700 mt-1">{formatDate(createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Customer</p>
                                    <p className="text-sm font-medium text-gray-700 mt-1">{name || user.name || "N/A"}</p>
                                    <p className="text-xs text-gray-400">{mobile || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Payment</p>
                                    <p className="text-sm font-medium text-gray-700 mt-1">{PaymentId || "N/A"}</p>
                                    <p className="text-xs text-gray-400">{paymentMethod || "N/A"}</p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Status</span>
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase border ${getStatusColor(status)}`}>
                                        {status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="px-4 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                                        <FiEdit className="w-3.5 h-3.5" />
                                        Edit
                                    </button>
                                    <button className="px-4 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-200 hover:bg-red-100 transition-colors flex items-center gap-1.5">
                                        <FiXCircle className="w-3.5 h-3.5" />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ─── TWO COLUMN GRID ────────────────── */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* ─── LEFT COLUMN (2/3) ────────────── */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* ─── CUSTOMER & SHIPPING ──────── */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <FiMapPin className="w-4 h-4 text-gray-400" />
                                        Customer & Shipping Address
                                    </h3>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm">
                                            {name ? name.charAt(0).toUpperCase() : "U"}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{name || user.name || "N/A"}</p>
                                            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                                                <FiPhone className="w-3.5 h-3.5" />
                                                {mobile || "N/A"}
                                            </p>
                                            <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                                <FiMail className="w-3.5 h-3.5" />
                                                {user.email || "N/A"}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-2">
                                                {address.street_address || "N/A"}
                                                {address.city && `, ${address.city}`}
                                                {address.state && `, ${address.state}`}
                                                {address.pincode && ` - ${address.pincode}`}
                                                {address.country && `, ${address.country}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* ─── ORDER ITEMS ──────────────── */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <FiPackage className="w-4 h-4 text-gray-400" />
                                        Order Items ({product.length})
                                    </h3>

                                    <div className="space-y-4">
                                        {product.map((item, idx) => (
                                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <div className="flex-1">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold">
                                                            IMG
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-800 text-sm">{item.title || "Untitled"}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {item.variant || ""} • {item.variantTitle || ""}
                                                                {item.priceSectionTitle && ` • ${item.priceSectionTitle}`}
                                                            </p>
                                                            <p className="text-xs text-gray-500">Qty: {item.quantity || 1}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right sm:text-left">
                                                    <p className="text-sm font-bold text-gray-800">₹{item.total?.toFixed(2) || (item.price * item.quantity).toFixed(2)}</p>
                                                    {item.discount > 0 && (
                                                        <p className="text-xs text-green-600">{item.discount}% discount applied</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Totals */}
                                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-1.5">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Subtotal</span>
                                            <span className="font-medium text-gray-700">₹{subtotal.toFixed(2)}</span>
                                        </div>
                                        {discountTotal > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Discount</span>
                                                <span className="font-medium text-green-600">-₹{discountTotal.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Delivery Charges</span>
                                            <span className="font-medium text-gray-700">₹{deliveryCharges.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                                            <span className="text-gray-800">Total Amount</span>
                                            <span className="text-gray-900">₹{finalTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* ─── SHIPMENT INFORMATION ──────── */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <FiTruckIcon className="w-4 h-4 text-gray-400" />
                                        Shipment Information
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Courier Partner</p>
                                            <p className="text-sm font-medium text-gray-700 mt-1">{courier_name || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">AWB Number</p>
                                            <p className="text-sm font-medium text-gray-700 mt-1 font-mono">{project.awb_number || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Shipping Status</p>
                                            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(shipping_status)}`}>
                                                {shipping_status}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Dispatch Date</p>
                                            <p className="text-sm font-medium text-gray-700 mt-1">{formatDate(dispatched_at) || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Delivery Date</p>
                                            <p className="text-sm font-medium text-gray-700 mt-1">{formatDate(delivered_at) || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Last Updated</p>
                                            <p className="text-sm font-medium text-gray-700 mt-1">{formatDate(updatedAt)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* ─── PAYMENT INFORMATION ────────── */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <FiCreditCard className="w-4 h-4 text-gray-400" />
                                        Payment Information
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Payment Method</p>
                                            <p className="text-sm font-medium text-gray-700 mt-1">{paymentMethod || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Transaction ID</p>
                                            <p className="text-sm font-medium text-gray-700 mt-1 font-mono">{PaymentId || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Payment Date</p>
                                            <p className="text-sm font-medium text-gray-700 mt-1">{formatDate(createdAt)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Payment Status</p>
                                            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold border ${getPaymentStatusColor("paid")}`}>
                                                Paid
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ─── RIGHT COLUMN (1/3) ───────────── */}
                            <div className="space-y-6">

                                {/* ─── SHIPMENT TRACKING ────────── */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <FiTruck className="w-4 h-4 text-gray-400" />
                                        Shipment Tracking
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                            <span className="text-sm font-medium text-gray-700">Current Status</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(shipping_status)}`}>
                                                {shipping_status}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5">
                                                <FiPrinter className="w-3.5 h-3.5" />
                                                Print Label
                                            </button>
                                            <button className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5">
                                                <FiDownload className="w-3.5 h-3.5" />
                                                Download Label
                                            </button>
                                        </div>
                                        <button className="w-full px-3 py-2 rounded-xl border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5">
                                            <FiXCircle className="w-3.5 h-3.5" />
                                            Cancel Order
                                        </button>
                                        <button className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5">
                                            <FiPlus className="w-3.5 h-3.5" />
                                            Add Order Note
                                        </button>
                                    </div>
                                </div>

                                {/* ─── ADMIN ACTIONS ────────────── */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <FiClipboard className="w-4 h-4 text-gray-400" />
                                        Admin Actions
                                    </h3>
                                    <div className="space-y-2">
                                        <button className="w-full px-4 py-2.5 rounded-xl bg-green-50 text-green-700 text-sm font-medium border border-green-200 hover:bg-green-100 transition-colors flex items-center justify-center gap-2">
                                            <FiCheckCircle className="w-4 h-4" />
                                            Approve Order
                                        </button>
                                        <button className="w-full px-4 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                                            <FiXCircle className="w-4 h-4" />
                                            Cancel Order
                                        </button>
                                        <button className="w-full px-4 py-2.5 rounded-xl bg-yellow-50 text-yellow-700 text-sm font-medium border border-yellow-200 hover:bg-yellow-100 transition-colors flex items-center justify-center gap-2">
                                            <FiClock className="w-4 h-4" />
                                            Hold Order
                                        </button>
                                        <button className="w-full px-4 py-2.5 rounded-xl bg-blue-50 text-blue-700 text-sm font-medium border border-blue-200 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                                            <FiMessageSquare className="w-4 h-4" />
                                            Add Order Note
                                        </button>
                                    </div>
                                </div>

                                {/* ─── ORDER STATUS ──────────────── */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <FiTag className="w-4 h-4 text-gray-400" />
                                        Order Status
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-gray-700">Current Status:</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(status)}`}>
                                                {status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">
                                            {status === "pending" && "Order is pending confirmation."}
                                            {status === "confirmed" && "Order has been confirmed."}
                                            {status === "processing" && "Order is being processed."}
                                            {status === "shipped" && "Order has been shipped."}
                                            {status === "delivered" && "Order has been delivered."}
                                            {status === "cancelled" && "Order has been cancelled."}
                                            {!["pending","confirmed","processing","shipped","delivered","cancelled"].includes(status) && "Status update pending."}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Last Updated: {formatDate(updatedAt)}
                                        </p>
                                    </div>
                                </div>

                                {/* ─── VIEW INVOICE ──────────────── */}
                                <button className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-4 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-semibold text-gray-700">
                                    <FiEye className="w-4 h-4" />
                                    View Invoice / Download
                                </button>
                            </div>
                        </div>

                        {/* ─── ORDER TIMELINE ──────────────────── */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <FiClock className="w-4 h-4 text-gray-400" />
                                Order Timeline
                            </h3>
                            {timelineItems.length > 0 ? (
                                <div className="relative pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                                    {timelineItems.map((item, idx) => (
                                        <div key={idx} className="relative">
                                            <div className={`
                                                absolute -left-8 top-1.5 w-4 h-4 rounded-full border-2
                                                ${item.active ? "bg-green-500 border-green-500" : "bg-gray-200 border-gray-300"}
                                            `} />
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                                <span className={`text-sm font-medium ${item.active ? "text-gray-800" : "text-gray-400"}`}>
                                                    {item.status}
                                                </span>
                                                <span className={`text-xs ${item.active ? "text-gray-500" : "text-gray-400"}`}>
                                                    {item.date}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No timeline events available.</p>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}