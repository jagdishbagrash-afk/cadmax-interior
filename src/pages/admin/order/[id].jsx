"use client";

import React, { useState } from "react";
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

export default function OrderDetailsPage() {
    // ─── STATE ───────────────────────────────────────────────
    const [activeNav, setActiveNav] = useState("All Orders");
    const [expandedMenus, setExpandedMenus] = useState({
        orders: true,
        shipments: false,
        returns: false,
        other: false,
    });

    // ─── SIDEBAR NAV ITEMS ──────────────────────────────────
    const orderItems = [
        { id: "All Orders", label: "All Orders", count: 233 },
        { id: "Pending", label: "Pending", count: 32 },
        { id: "Confirmed", label: "Confirmed", count: 26 },
        { id: "Processing", label: "Processing", count: 15 },
        { id: "Ready to Ship", label: "Ready to Ship", count: 8 },
        { id: "Completed", label: "Completed", count: 120 },
        { id: "Cancelled", label: "Cancelled", count: 22 },
    ];

    const shipmentItems = [
        { id: "Pending Shipment", label: "Pending Shipment" },
        { id: "Shipment Created", label: "Shipment Created" },
        { id: "Pickup Scheduled", label: "Pickup Scheduled" },
        { id: "Picked Up", label: "Picked Up" },
        { id: "In Transit", label: "In Transit" },
        { id: "Out for Delivery", label: "Out for Delivery" },
        { id: "Failed Delivery", label: "Failed Delivery" },
        { id: "RTO", label: "RTO" },
    ];

    const returnItems = [
        { id: "Return Requests", label: "Return Requests" },
        { id: "Approved", label: "Approved" },
        { id: "Pickup Scheduled", label: "Pickup Scheduled" },
        { id: "Returned", label: "Returned" },
        { id: "Replacement", label: "Replacement" },
        { id: "Refunded", label: "Refunded" },
    ];

    const otherItems = [
        { id: "Payments", label: "Payments" },
        { id: "Customers", label: "Customers" },
        { id: "Products", label: "Products" },
        { id: "Reports", label: "Reports" },
        { id: "Settings", label: "Settings" },
    ];

    // ─── TIMELINE DATA ──────────────────────────────────────
    const timeline = [
        { status: "Order Placed", date: "24 Jul 2026, 11:30 AM", active: true },
        { status: "Payment Success", date: "24 Jul 2026, 11:31 AM", active: true },
        { status: "Order Confirmed", date: "24 Jul 2026, 11:35 AM", active: true },
        { status: "Shipment Created", date: "24 Jul 2026, 03:20 PM", active: true },
        { status: "Picked Up", date: "25 Jul 2026, 10:15 AM", active: true },
        { status: "In Transit", date: "25 Jul 2026, 02:45 PM", active: true },
        { status: "Out for Delivery", date: "Expected: 27 Jul 2026", active: false },
        { status: "Delivered", date: "Expected: 27 Jul 2026", active: false },
    ];

    // ─── RENDER ─────────────────────────────────────────────
    return (
        <AdminLayout >

                {/* ─── SIDEBAR ───────────────────────────────────── */}
                {/* ─── MAIN CONTENT ────────────────────────────── */}
                <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F5F7FA]">
                    {/* Top Bar */}
                    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
                                <FiArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">Order Details</h2>
                                <p className="text-xs text-gray-500">ORD-B10CBC4B • 24 Jul 2026</p>
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
                                    {/* Order ID */}
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Order ID</p>
                                        <p className="text-sm font-bold text-gray-800 mt-1 font-mono">ORD-B10CBC4B</p>
                                    </div>
                                    {/* Order Date */}
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Order Date</p>
                                        <p className="text-sm font-medium text-gray-700 mt-1">24 Jul 2026, 11:30 AM</p>
                                    </div>
                                    {/* Customer */}
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Customer</p>
                                        <p className="text-sm font-medium text-gray-700 mt-1">Ramchandra</p>
                                        <p className="text-xs text-gray-400">9521343393</p>
                                    </div>
                                    {/* Payment */}
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Payment</p>
                                        <p className="text-sm font-medium text-gray-700 mt-1">PAY-7YH8J9K2L</p>
                                        <p className="text-xs text-gray-400">Website</p>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Status</span>
                                        <span className="px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase border border-purple-200">
                                            SHIPPED
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
                                                R
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">Ramchandra</p>
                                                <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                                                    <FiPhone className="w-3.5 h-3.5" />
                                                    9521343393
                                                </p>
                                                <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                                    <FiMail className="w-3.5 h-3.5" />
                                                    ramchandra@gmail.com
                                                </p>
                                                <p className="text-sm text-gray-600 mt-2">
                                                    123, Main Street, Near City Center,<br />
                                                    Mumbai, Maharashtra - 400001
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ─── ORDER ITEMS ──────────────── */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <FiPackage className="w-4 h-4 text-gray-400" />
                                            Order Items
                                        </h3>

                                        <div className="space-y-4">
                                            {/* Item 1 */}
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <div className="flex-1">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold">
                                                            IMG
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-800 text-sm">testing bed</p>
                                                            <p className="text-xs text-gray-500">Blue • Category: with side table</p>
                                                            <p className="text-xs text-gray-500">Size: King • Quantity: 1</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right sm:text-left">
                                                    <p className="text-sm font-bold text-gray-800">$10,800.00</p>
                                                    <p className="text-xs text-green-600">10% discount applied</p>
                                                </div>
                                            </div>

                                            {/* Item 2 */}
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <div className="flex-1">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold">
                                                            IMG
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-800 text-sm">Premium Sofa</p>
                                                            <p className="text-xs text-gray-500">3 Seater + Grey • Category: Living Room</p>
                                                            <p className="text-xs text-gray-500">Quantity: 2</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right sm:text-left">
                                                    <p className="text-sm font-bold text-gray-800">$12,000.00</p>
                                                    <p className="text-xs text-green-600">5% discount applied</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Totals */}
                                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-1.5">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Subtotal</span>
                                                <span className="font-medium text-gray-700">$22,800.00</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Discount</span>
                                                <span className="font-medium text-green-600">-$1,680.00</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Delivery Charges</span>
                                                <span className="font-medium text-gray-700">$0.00 (Free)</span>
                                            </div>
                                            <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                                                <span className="text-gray-800">Total Amount</span>
                                                <span className="text-gray-900">$21,120.00</span>
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
                                                <p className="text-sm font-medium text-gray-700 mt-1">Blue Dart</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">AWB Number</p>
                                                <p className="text-sm font-medium text-gray-700 mt-1 font-mono">12345678901</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Tracking Number</p>
                                                <p className="text-sm font-medium text-gray-700 mt-1 font-mono">12345678901</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Estimated Delivery</p>
                                                <p className="text-sm font-medium text-gray-700 mt-1">27 Jul 2026</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Service Type</p>
                                                <p className="text-sm font-medium text-gray-700 mt-1">Surface</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Pickup Date</p>
                                                <p className="text-sm font-medium text-gray-700 mt-1">25 Jul 2026, 10:00 AM</p>
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
                                                <p className="text-sm font-medium text-gray-700 mt-1">Online Payment</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Transaction ID</p>
                                                <p className="text-sm font-medium text-gray-700 mt-1 font-mono">TXN-7YH8J9K2L</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Payment Date</p>
                                                <p className="text-sm font-medium text-gray-700 mt-1">24 Jul 2026, 11:31 AM</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Payment Status</p>
                                                <span className="inline-block mt-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200">
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
                                                <span className="text-sm font-medium text-gray-700">Shipment Created</span>
                                                <span className="text-xs text-gray-500">24 Jul 2026, 03:20 PM</span>
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
                                                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200">
                                                    In Transit
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">
                                                Your shipment has left the origin hub and is on the way to the destination.
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Last Updated: 25 Jul 2026, 02:45 PM
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
                                <div className="relative pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                                    {timeline.map((item, idx) => (
                                        <div key={idx} className="relative">
                                            <div className={`
                                            absolute -left-8 top-1.5 w-4 h-4 rounded-full border-2
                                            ${item.active
                                                    ? "bg-green-500 border-green-500"
                                                    : "bg-gray-200 border-gray-300"
                                                }
                                        `} />
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                                <span className={`
                                                text-sm font-medium
                                                ${item.active ? "text-gray-800" : "text-gray-400"}
                                            `}>
                                                    {item.status}
                                                </span>
                                                <span className={`
                                                text-xs
                                                ${item.active ? "text-gray-500" : "text-gray-400"}
                                            `}>
                                                    {item.date}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>


        </AdminLayout>

    );
}