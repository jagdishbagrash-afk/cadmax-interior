"use client";

import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../common/AdminLayout";
import Listing from "@/pages/api/Listing";
import ConfirmModal from "@/components/ConfirmModal";
import Popup from "@/pages/common/Popup";
import toast from "react-hot-toast";
import moment from "moment";
import ShippingLabel from "@/components/shipping-label/ShippingLabel";
import { exportShippingLabelPdf } from "@/components/shipping-label/exportShippingLabelPdf";
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
    FiDownload,
    FiMoreHorizontal,
} from "react-icons/fi";
import Link from "next/link";

export default function Index() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [statusMap, setStatusMap] = useState({});

    // DIRECT PDF DOWNLOAD STATE & REF
    const [downloadingOrderId, setDownloadingOrderId] = useState(null);
    const [activeLabelOrder, setActiveLabelOrder] = useState(null);
    const activeLabelRef = useRef(null);

    const buildLabelDataForOrder = (order) => {
        if (!order) return null;
        const address = order.addressId || order.shippingAddress || order.address || {};
        const dataShipment = order.shipment || {};
        const formattedWeb = order.formattedForWeb || {};

        const resolvedAwb =
            dataShipment?.awbNumber ||
            dataShipment?.trackingNumber ||
            order?.tracking_number ||
            order?.trackingNumber ||
            order?.awbNumber ||
            order?.awb_number ||
            order?.trackingId ||
            formattedWeb?.shipmentDetails?.trackingId ||
            order?.labelData?.trackingNumber ||
            order?.labelData?.waybillNo ||
            "N/A";

        const items = Array.isArray(order.product)
            ? order.product.map((p) => ({
                name: p.name || p.title || "Item",
                qty: p.quantity || p.qty || 1,
                price: p.price || 0,
                sku: p.sku || "",
            }))
            : [];

        return {
            orderId: order.orderId || order._id || "",
            orderNumber: order.orderId || order._id || "",
            paymentId: order.PaymentId || order.paymentId || "",
            paymentMethod: order.paymentMethod || "ONLINE",
            shippingStatus: dataShipment?.shippingStatus || order.shipping_status || order.status || "shipped",
            courierName: dataShipment?.courierPartner || order.courier_name || "BLUE_DART",
            trackingNumber: resolvedAwb,
            labelData: {
                bookingDate: order.createdAt ? moment(order.createdAt).format("DD/MM/YYYY") : "",
                serviceType: "Surface / Express",
                carrier: {
                    provider: "BLUE_DART",
                    blueDart: {
                        customerCode: "000049",
                        productCode: "A",
                        subProductCode: "P",
                        originArea: "DEL",
                        destinationArea: address.city || "JAI",
                        destinationLocation: address.city || "JAIPUR",
                    },
                },
                shipTo: {
                    name: order.name || address.name || "Customer",
                    phone: order.mobile || address.mobile || address.phone || "",
                    address1: address.street_address || address.address1 || address.address || "",
                    city: address.city || "",
                    state: address.state || "",
                    pincode: address.pincode || "",
                    fullAddress: [
                        address.street_address || address.address1 || address.address,
                        address.city,
                        address.state,
                        address.pincode ? `- ${address.pincode}` : "",
                        "India",
                    ].filter(Boolean).join(", "),
                },
                shipFrom: {
                    name: "CADMAX ATELIER",
                    phone: "9876543210",
                    fullAddress: "CADMAX Atelier HQ, Industrial Area, Jaipur, Rajasthan - 302020, India",
                    city: "Jaipur",
                    state: "Rajasthan",
                    pincode: "302020",
                },
                items: items,
                package: {
                    weight: "1.5 kg",
                    dimensions: "30 x 20 x 15 cm",
                    totalAmount: order.amount || 0,
                },
                ...(order.labelData || {}),
            },
        };
    };

    const handleDirectDownloadPdf = async (order) => {
        try {
            setDownloadingOrderId(order._id);
            setActiveLabelOrder(order);
            const toastId = toast.loading("Generating PDF label...");

            await new Promise((res) => setTimeout(res, 350));

            if (!activeLabelRef.current) {
                toast.error("Label element not ready", { id: toastId });
                return;
            }

            await exportShippingLabelPdf({
                element: activeLabelRef.current,
                fileName: `shipment-label-${order.orderId || order._id}.pdf`,
            });

            toast.success("Shipment label downloaded successfully!", { id: toastId });
        } catch (err) {
            console.error("Direct PDF download error:", err);
            toast.error("Failed to generate PDF label. Please try again.");
        } finally {
            setDownloadingOrderId(null);
        }
    };

    // PAGINATION
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // SIDEBAR STATE
    const [activeNav, setActiveNav] = useState("All Orders");
    const [expandedMenus, setExpandedMenus] = useState({
        orders: true,
        shipments: false,
        returns: false,
        other: false,
    });

    // ✅ Fetch Orders
    const fetchData = async () => {
        try {
            const main = new Listing();
            const response = await main.adminGetOrders();
            if (response?.data?.data) {
                setData(response.data.data);
                setFilteredData(response.data.data);
            } else {
                setData([]);
                setFilteredData([]);
            }
        } catch (error) {
            console.log("Error:", error);
            setData([]);
            setFilteredData([]);
        }
    };

    // ✅ Status Change
    const handleChange = (id, value) => {
        setStatusMap((prev) => ({
            ...prev,
            [id]: value,
        }));
        handleStatusChange(id, value);
    };

    const handleStatusChange = async (id, value) => {
        try {
            const main = new Listing();
            const response = await main.updateOrderStatus(id, {
                status: value,
            });
            if (response?.data?.status) {
                toast.success(response?.data?.message);
                fetchData();
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error) {
            console.log("Error:", error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    };

    // 🔍 SEARCH
    useEffect(() => {
        const result = data.filter((order) => {
            const query = search.toLowerCase();
            return (
                order?.name?.toLowerCase()?.includes(query) ||
                order?.mobile?.toLowerCase()?.includes(query) ||
                order?.address?.toLowerCase()?.includes(query) ||
                order?.status?.toLowerCase()?.includes(query) ||
                order?.orderId?.toLowerCase()?.includes(query)
            );
        });
        setFilteredData(result);
        setCurrentPage(1);
    }, [search, data]);

    useEffect(() => {
        fetchData();
    }, []);

    // ✅ PAGINATION LOGIC
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage]);

    // ─── STATS ─────────────────────────────────────────────
    const stats = [
        { label: "All Orders", count: data.length, color: "bg-gray-100 text-gray-700" },
        { label: "Pending", count: data.filter((o) => o.status === "pending").length, color: "bg-yellow-100 text-yellow-700" },
        { label: "Confirmed", count: data.filter((o) => o.status === "confirmed").length, color: "bg-blue-100 text-blue-700" },
        { label: "Processing", count: data.filter((o) => o.status === "processing").length, color: "bg-indigo-100 text-indigo-700" },
        { label: "Ready to Ship", count: data.filter((o) => o.status === "ready_to_ship").length, color: "bg-cyan-100 text-cyan-700" },
        { label: "Shipped", count: data.filter((o) => o.status === "shipped").length, color: "bg-purple-100 text-purple-700" },
        { label: "Delivered", count: data.filter((o) => o.status === "delivered").length, color: "bg-green-100 text-green-700" },
        { label: "Cancelled", count: data.filter((o) => o.status === "cancelled").length, color: "bg-red-100 text-red-700" },
    ];

    // ─── SIDEBAR NAV ITEMS ────────────────────────────────
    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: FiHome, section: "main" },
    ];

    const orderItems = [
        { id: "All Orders", label: "All Orders", count: data.length },
        { id: "Pending", label: "Pending", count: data.filter((o) => o.status === "pending").length },
        { id: "Confirmed", label: "Confirmed", count: data.filter((o) => o.status === "confirmed").length },
        { id: "Processing", label: "Processing", count: data.filter((o) => o.status === "processing").length },
        { id: "Ready to Ship", label: "Ready to Ship", count: data.filter((o) => o.status === "ready_to_ship").length },
        { id: "Shipped", label: "Shipped", count: data.filter((o) => o.status === "shipped").length },
        { id: "Delivered", label: "Delivered", count: data.filter((o) => o.status === "delivered").length },
        { id: "Cancelled", label: "Cancelled", count: data.filter((o) => o.status === "cancelled").length },
    ];

    const shipmentItems = [
        { id: "All Shipments", label: "All Shipments", count: 215 },
        { id: "Pending Pickup", label: "Pending Pickup" },
        { id: "In Transit", label: "In Transit" },
        { id: "Out for Delivery", label: "Out for Delivery" },
        { id: "Delivered", label: "Delivered" },
        { id: "Failed Delivery", label: "Failed Delivery" },
        { id: "RTO", label: "RTO" },
    ];

    const returnItems = [
        { id: "Return Requests", label: "Return Requests" },
        { id: "Awaiting Pickup", label: "Awaiting Pickup" },
        { id: "Returned", label: "Returned" },
        { id: "Refunded", label: "Refunded" },
    ];

    const otherItems = [
        { id: "Payments", label: "Payments" },
        { id: "Customers", label: "Customers" },
        { id: "Products", label: "Products" },
        { id: "Reports", label: "Reports" },
        { id: "Settings", label: "Settings" },
    ];

    // ─── RENDER ─────────────────────────────────────────────
    return (
        <AdminLayout page={"Order List"}>
            <div className="p-5">
                {/* ─── SIDEBAR ───────────────────────────────────── */}
                

                {/* ─── MAIN CONTENT ────────────────────────────── */}
                <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F5F7FA]">
                    {/* Top Bar */}
                    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Order Management</h2>
                            <p className="text-xs text-gray-500">Manage all customer orders and track their progress</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <FiSearch className="w-5 h-5 text-gray-500" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <FiMoreHorizontal className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                    </header>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {/* ─── STATS ROW ─────────────────────────── */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className={`${stat.color} rounded-xl px-3 py-2.5 text-center transition-all hover:scale-[1.02] cursor-default`}
                                >
                                    <p className="text-xl font-bold">{stat.count}</p>
                                    <p className="text-[10px] uppercase tracking-wide font-medium opacity-80">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* ─── TABLE CARD ────────────────────────── */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Table Header with Search */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-gray-100">
                                <div>
                                    <h3 className="text-base font-bold text-gray-800">Orders</h3>
                                    <p className="text-xs text-gray-400">Showing {filteredData.length} orders</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search order..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="pl-9 pr-4 py-2 h-[40px] w-full sm:w-[240px] border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-black/10 focus:border-black/30 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ─── TABLE ──────────────────────────── */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-[#FAFBFC] border-b border-gray-200">
                                        <tr>
                                            {[
                                                "ORDER ID",
                                                "CUSTOMER",
                                                "ITEMS",
                                                "PAYMENT",
                                                "AMOUNT",
                                                "DATE",
                                                "STATUS",
                                                "AWB / TRACKING",
                                                "ACTIONS",
                                            ].map((head) => (
                                                <th
                                                    key={head}
                                                    className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap"
                                                >
                                                    {head}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData?.length > 0 ? (
                                            paginatedData.map((order, idx) => {
                                                const currentStatus = statusMap[order._id] || order.status || "pending";
                                                const isShipped = currentStatus === "shipped";
                                                const isDelivered = currentStatus === "delivered";
                                                const isCancelled = currentStatus === "cancelled";
                                                const isConfirmed = currentStatus === "confirmed";
                                                const isPending = currentStatus === "pending";
                                                const isProcessing = currentStatus === "processing";

                                                const resolvedAwb =
                                                    order?.awbNumber ||
                                                    order?.trackingNumber ||
                                                    order?.tracking_number ||
                                                    order?.awb_number ||
                                                    order?.trackingId ||
                                                    order?.shipment?.awbNumber ||
                                                    order?.shipment?.trackingNumber ||
                                                    order?.formattedForWeb?.shipmentDetails?.trackingId ||
                                                    order?.labelData?.trackingNumber ||
                                                    order?.labelData?.waybillNo ||
                                                    order?.shipping_response?.AWBNo ||
                                                    order?.shipping_response?.awbNumber ||
                                                    order?.shipping_meta?.trackingNumber ||
                                                    order?.awb ||
                                                    null;

                                                const resolvedCourier =
                                                    order?.courierPartner ||
                                                    order?.courier_name ||
                                                    order?.courierPartner ||
                                                    order?.shipment?.courierPartner ||
                                                    order?.formattedForWeb?.shipmentDetails?.courierPartner ||
                                                    order?.shipment?.carrier ||
                                                    order?.courier ||
                                                    "BLUE_DART";

                                                // Sample product items for display
                                                const sampleItems = order?.product
                                                    ? Array.isArray(order.product)
                                                        ? order.product.slice(0, 2).map((p) => p?.name || "Item")
                                                        : [order.product?.name || "Item"]
                                                    : ["Premium Sofa", "Coffee Table"];

                                                return (
                                                    <tr
                                                        key={order._id}
                                                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                                                    >
                                                        {/* ORDER ID */}
                                                        <td className="px-4 py-3.5">
                                                            <span className="font-mono text-xs font-semibold text-gray-800">
                                                                {order?.orderId || "ORD-XXXX"}
                                                            </span>
                                                        </td>

                                                        {/* CUSTOMER */}
                                                        <td className="px-4 py-3.5">
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-gray-800 text-sm">
                                                                    {order?.name || "N/A"}
                                                                </span>
                                                                <span className="text-[10px] text-gray-400">
                                                                    {order?.mobile || ""}
                                                                </span>
                                                            </div>
                                                        </td>

                                                        {/* ITEMS */}
                                                        <td className="px-4 py-3.5">
                                                            <div className="flex flex-col">
                                                                {sampleItems.slice(0, 2).map((item, i) => (
                                                                    <span key={i} className="text-xs text-gray-700">
                                                                        • {item}
                                                                    </span>
                                                                ))}
                                                                {sampleItems.length > 2 && (
                                                                    <span className="text-[10px] text-gray-400">
                                                                        +{sampleItems.length - 2} more
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>

                                                        {/* PAYMENT */}
                                                        <td className="px-4 py-3.5">
                                                            <span className="text-xs font-medium text-gray-700">
                                                                {order?.paymentMethod || "COD"}
                                                            </span>
                                                            <span className="block text-[10px] text-gray-400">
                                                                {order?.paymentStatus || "Pending"}
                                                            </span>
                                                        </td>

                                                        {/* AMOUNT */}
                                                        <td className="px-4 py-3.5">
                                                            <span className="font-bold text-gray-800">
                                                                ₹{order?.amount || 0}
                                                            </span>
                                                        </td>

                                                        {/* DATE */}
                                                        <td className="px-4 py-3.5">
                                                            <span className="text-xs text-gray-600 whitespace-nowrap">
                                                                {order?.createdAt
                                                                    ? moment(order.createdAt).format("DD MMM YYYY")
                                                                    : "N/A"}
                                                            </span>
                                                        </td>

                                                        {/* STATUS */}
                                                        <td className="px-4 py-3.5">
                                                            <select
                                                                value={currentStatus}
                                                                onChange={(e) => handleChange(order._id, e.target.value)}
                                                                className={`
                                                                    px-3 py-1.5 rounded-full text-[10px] font-semibold border outline-none
                                                                    cursor-pointer transition-all uppercase tracking-wide
                                                                    ${isPending
                                                                        ? "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                                                                        : ""
                                                                    }
                                                                    ${isConfirmed
                                                                        ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                                                        : ""
                                                                    }
                                                                    ${isProcessing
                                                                        ? "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                                                                        : ""
                                                                    }
                                                                    ${isShipped
                                                                        ? "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                                                                        : ""
                                                                    }
                                                                    ${isDelivered
                                                                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                                                        : ""
                                                                    }
                                                                    ${isCancelled
                                                                        ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                                                        : ""
                                                                    }
                                                                `}
                                                            >
                                                                {isPending && <option value="pending">Pending</option>}
                                                                <option value="confirmed">Approved</option>
                                                                <option value="cancelled">Rejected</option>
                                                            </select>
                                                        </td>

                                                        {/* AWB / TRACKING */}
                                                        <td className="px-4 py-3.5">
                                                            {resolvedAwb ? (
                                                                <div className="flex flex-col">
                                                                    <span className="font-mono text-xs font-semibold text-gray-800">
                                                                        {resolvedAwb}
                                                                    </span>
                                                                    <span className="text-[10px] text-gray-500 font-medium">
                                                                        {resolvedCourier}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-[10px] text-gray-300">—</span>
                                                            )}
                                                        </td>

                                                        {/* ACTIONS */}
                                                        <td className="px-4 py-3.5">
                                                            <div className="flex items-center gap-1">
                                                                <Link
                                                                    href={`/admin/order/${order._id}`}
                                                                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                                                                    title="View Details"
                                                                >
                                                                    <FiEye className="w-4 h-4" />
                                                                </Link>
                                                                {resolvedAwb && (
                                                                    <button
                                                                        onClick={() => handleDirectDownloadPdf(order)}
                                                                        disabled={downloadingOrderId === order._id}
                                                                        className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors text-blue-600 hover:text-blue-700 disabled:opacity-50"
                                                                        title="Download Shipment Label PDF"
                                                                    >
                                                                        <FiDownload className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={9} className="text-center py-16 text-gray-400 text-sm">
                                                    No orders found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* ─── PAGINATION ──────────────────────── */}
                            {totalPages > 1 && (
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3.5 border-t border-gray-100 bg-white">
                                    <p className="text-xs text-gray-500">
                                        Showing{" "}
                                        <span className="font-semibold text-gray-700">
                                            {(currentPage - 1) * itemsPerPage + 1}
                                        </span>{" "}
                                        to{" "}
                                        <span className="font-semibold text-gray-700">
                                            {Math.min(currentPage * itemsPerPage, filteredData.length)}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-semibold text-gray-700">{filteredData.length}</span>{" "}
                                        orders
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage((p) => p - 1)}
                                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                        >
                                            Prev
                                        </button>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`
                                                    w-8 h-8 rounded-lg text-xs font-semibold transition-all
                                                    ${currentPage === i + 1
                                                        ? "bg-black text-white"
                                                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                                    }
                                                `}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage((p) => p + 1)}
                                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* HIDDEN OFFSCREEN SHIPPING LABEL FOR DIRECT PDF GENERATION */}
            <div style={{ position: "fixed", top: "-10000px", left: "-10000px", zIndex: -1000, pointerEvents: "none" }}>
                {activeLabelOrder && (
                    <ShippingLabel ref={activeLabelRef} data={buildLabelDataForOrder(activeLabelOrder)} />
                )}
            </div>
        </AdminLayout>
    );
}
