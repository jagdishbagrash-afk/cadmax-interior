"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
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
    FiAlertCircle,
} from "react-icons/fi";
import AdminLayout from "../common/AdminLayout";
import { useRouter } from "next/router";
import Listing from "@/pages/api/Listing";
import toast from "react-hot-toast";
import moment from "moment";
import ShippingLabel from "@/components/shipping-label/ShippingLabel";
import { exportShippingLabelPdf } from "@/components/shipping-label/exportShippingLabelPdf";
import { useReactToPrint } from "react-to-print";

export default function OrderDetailsPage() {
    const router = useRouter();
    const id = router.query.id;
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ─── STATE FOR STATUS UPDATE MODAL & TRANSIT ─────────────
    const [showModal, setShowModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalAction, setModalAction] = useState(""); // "approve", "cancel", "hold", "note"
    const [pincodeEstDelivery, setPincodeEstDelivery] = useState(null);
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
    const labelRef = useRef(null);

    // ─── BLUE DART WAYBILL CANCEL & EXTRA TIMELINE STATE ──────
    const [extraTimelineEvents, setExtraTimelineEvents] = useState([]);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [isCancellingWaybill, setIsCancellingWaybill] = useState(false);


    const fetchData = async (id) => {
        try {
            setLoading(true);
            const main = new Listing();
            const response = await main.orderId(id);
            console.log("responsessss", response);
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

    // ─── PINCODE-BASED TRANSIT TIME FETCH ────────────────────
    useEffect(() => {
        if (!project) return;

        const currentEst =
            project?.formattedForWeb?.estimatedDeliveryInformation?.estDelivery ||
            project?.formattedForWeb?.estimatedDeliveryInformation?.expectedDateDelivery ||
            project?.delivered_at ||
            project?.shipment?.estDelivery;

        if (currentEst) return;

        const extractPincode = (projectObj) => {
            if (!projectObj) return null;
            const addr = projectObj.addressId || projectObj.shippingAddress || projectObj.address || {};
            const direct = addr.pincode || addr.zip || addr.postalCode || projectObj.pincode;
            if (direct && /^\d{4,10}$/.test(String(direct).trim())) return String(direct).trim();

            const fullStr = [
                addr.street_address,
                addr.address1,
                addr.street,
                addr.address,
                addr.city,
                addr.state,
                projectObj.address,
            ].filter(Boolean).join(" ");

            const match = fullStr.match(/\b\d{6}\b/);
            return match ? match[0] : null;
        };

        const targetPincode = extractPincode(project);
        if (targetPincode && /^\d{4,10}$/.test(targetPincode)) {
            const fetchTransitTime = async () => {
                try {
                    const main = new Listing();
                    const res = await main.GetTransitTimeByPincode({ toPincode: targetPincode });
                    const resData = res?.data?.data || res?.data || {};
                    const est =
                        resData.expectedDateDelivery ||
                        resData.transitEstimate?.expectedDateDelivery ||
                        resData.estDelivery;
                    if (est) {
                        setPincodeEstDelivery(est);
                    }
                } catch (err) {
                    console.warn("Pincode transit time fetch notice:", err?.message);
                }
            };
            fetchTransitTime();
        }
    }, [project]);

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
            "on-hold": "bg-orange-100 text-orange-700 border-orange-200",
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

    // ─── STATUS UPDATE LOGIC ────────────────────────────────
    const openModal = (action) => {
        setModalAction(action);
        // Pre‑select status based on action
        let defaultStatus = "";
        let defaultNote = "";
        switch (action) {
            case "approve":
                defaultStatus = "confirmed";
                defaultNote = "Order approved.";
                break;
            case "cancel":
                defaultStatus = "cancelled";
                defaultNote = "Order cancelled.";
                break;
            case "hold":
                defaultStatus = "on-hold";
                defaultNote = "Order placed on hold.";
                break;
            case "note":
                defaultStatus = project?.status || "pending";
                defaultNote = "";
                break;
            default:
                defaultStatus = project?.status || "pending";
                defaultNote = "";
        }
        setSelectedStatus(defaultStatus);
        setNote(defaultNote);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedStatus("");
        setNote("");
        setModalAction("");
        setIsSubmitting(false);
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

    // ─── DYNAMIC SHIPPING LABEL GENERATION & PDF EXPORT ───────
    const normalizedLabelData = useMemo(() => {
        if (!project) return null;
        const address = project.addressId || project.shippingAddress || project.address || {};
        const dataShipment = project.shipment || {};
        const formattedWeb = project.formattedForWeb || {};

        const resolvedAwb =
            dataShipment?.awbNumber ||
            dataShipment?.trackingNumber ||
            project?.tracking_number ||
            project?.trackingNumber ||
            project?.awbNumber ||
            project?.awb_number ||
            project?.trackingId ||
            formattedWeb?.shipmentDetails?.trackingId ||
            project?.labelData?.trackingNumber ||
            project?.labelData?.waybillNo ||
            "N/A";

        const items = Array.isArray(project.product)
            ? project.product.map((p) => ({
                name: p.name || p.title || "Item",
                qty: p.quantity || p.qty || 1,
                price: p.price || 0,
                sku: p.sku || "",
            }))
            : [];

        return {
            orderId: project.orderId || project._id || "",
            orderNumber: project.orderId || project._id || "",
            paymentId: project.PaymentId || project.paymentId || "",
            paymentMethod: project.paymentMethod || "ONLINE",
            shippingStatus: dataShipment?.shippingStatus || project.shipping_status || project.status || "shipped",
            courierName: dataShipment?.courierPartner || project.courier_name || "BLUE_DART",
            trackingNumber: resolvedAwb,
            labelData: {
                bookingDate: project.createdAt ? new Date(project.createdAt).toLocaleDateString("en-IN") : "",
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
                    name: project.name || address.name || "Customer",
                    phone: project.mobile || address.mobile || address.phone || "",
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
                    totalAmount: project.amount || 0,
                },
                ...(project.labelData || {}),
            },
        };
    }, [project]);

    const triggerPrint = useReactToPrint({
        contentRef: labelRef,
        documentTitle: `shipment-label-${project?.orderId || "order"}`,
        pageStyle: "@page { size: A4 portrait; margin: 10mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }",
    });

    const handlePrintLabel = () => {
        if (!labelRef.current) {
            toast.error("Label element not ready for printing.");
            return;
        }
        triggerPrint();
    };

    const handleDownloadLabel = async () => {
        if (!labelRef.current || isDownloadingPdf) return;
        try {
            setIsDownloadingPdf(true);
            const toastId = toast.loading("Generating shipment label PDF...");
            await exportShippingLabelPdf({
                element: labelRef.current,
                fileName: `shipment-label-${project?.orderId || "order"}.pdf`,
            });
            toast.success("Shipment label PDF downloaded successfully!", { id: toastId });
        } catch (err) {
            console.error("PDF download error:", err);
            toast.error("Failed to generate PDF label. Please try again.");
        } finally {
            setIsDownloadingPdf(false);
        }
    };




    const handleStatusUpdate = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        if (!selectedStatus) {
            toast.error("Please select a status.");
            return;
        }
        if (!project?.orderId) {
            toast.error("Order ID missing.");
            return;
        }
        setIsSubmitting(true);

        try {
            const main = new Listing();
            const response = await main.updateOrderStatus(id, {
                status: selectedStatus,
                note: note
            });
            console.log("response", response)
            if (response?.data?.status) {
                toast.success(response?.data?.message);
                fetchData(id);
                closeModal();
            } else {
                toast.error(response?.data?.message);
            }

        } catch (err) {
            console.error("Error updating status:", err);

            toast.error("err?.response?.data?.message" || "Something went wrong");
        }

        setIsSubmitting(false);
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
        courier_name = "BLUE_DART",
        shipping_timeline = [],
        addressId,
        userId,
        paymentMethod = "ONLINE",
        dispatched_at,
        delivered_at,
    } = project;

    const user = userId || {};
    const address = addressId || {};

    // ─── RESOLVE SHIPMENT DETAILS WITH HIERARCHY ─────────────
    const dataShipment = project?.shipment || {};
    const formattedWeb = project?.formattedForWeb || {};
    const rawShipmentDetails = formattedWeb?.shipmentDetails || {};
    const rawEstDelivery = formattedWeb?.estimatedDeliveryInformation || {};

    const resolvedAwbNumber =
        dataShipment?.awbNumber ||
        dataShipment?.trackingNumber ||
        project?.tracking_number ||
        project?.trackingNumber ||
        project?.awbNumber ||
        project?.awb_number ||
        project?.trackingId ||
        formattedWeb?.shipmentDetails?.trackingId ||
        rawShipmentDetails?.trackingId ||
        dataShipment?.trackingNo ||
        project?.labelData?.trackingNumber ||
        project?.labelData?.waybillNo ||
        project?.shipping_response?.AWBNo ||
        project?.shipping_response?.awbNumber ||
        "N/A";

    const resolvedCourierName =
        dataShipment?.courierPartner ||
        project?.courier_name ||
        project?.courierPartner ||
        formattedWeb?.shipmentDetails?.courierPartner ||
        rawShipmentDetails?.courierPartner ||
        dataShipment?.courierName ||
        dataShipment?.carrier ||
        dataShipment?.courier ||
        courier_name ||
        "BLUE_DART";

    const resolvedShippingStatus =
        dataShipment?.shippingStatus ||
        project?.shipping_status ||
        rawShipmentDetails?.status ||
        dataShipment?.status ||
        shipping_status ||
        status ||
        "pending";

    const resolvedDispatchDate =
        dataShipment?.dispatchDate ||
        formattedWeb?.shipmentDetails?.shippedOn ||
        rawShipmentDetails?.shippedOn ||
        dispatched_at ||
        dataShipment?.shippedOn ||
        dataShipment?.createdAt ||
        createdAt ||
        null;

    const resolvedDeliveryDate =
        formattedWeb?.estimatedDeliveryInformation?.estDelivery ||
        rawEstDelivery?.estDelivery ||
        rawEstDelivery?.expectedDateDelivery ||
        delivered_at ||
        dataShipment?.estDelivery ||
        pincodeEstDelivery ||
        null;

    const isOrderApproved =
        project?.admin_approval_status === "approved" ||
        status === "confirmed" ||
        status === "approved" ||
        status === "shipped" ||
        status === "delivered" ||
        resolvedShippingStatus === "shipment_created" ||
        (resolvedAwbNumber && resolvedAwbNumber !== "N/A");

    // Calculate totals
    const subtotal = product.reduce((sum, p) => sum + (p.total || p.price * p.quantity || 0), 0);
    const discountTotal = product.reduce((sum, p) => sum + ((p.originalPrice - p.price) * p.quantity || 0), 0);
    const deliveryCharges = 0;
    const finalTotal = amount || subtotal;

    // Build timeline
    const baseTimelineItems =
        formattedWeb?.stepperTimeline?.length > 0
            ? formattedWeb.stepperTimeline.map((item) => ({
                status: item.title || item.status,
                message: item.description || item.message || "",
                date: item.timestamp || "--",
                active: item.completed ?? true,
            }))
            : dataShipment?.syncedTransit?.liveTracking?.events?.length > 0
            ? dataShipment.syncedTransit.liveTracking.events.map((item) => ({
                status: item.status || item.title || item.event,
                message: item.description || item.location || "",
                date: item.timestamp || item.date || item.time || "--",
                active: true,
            }))
            : shipping_timeline.length > 0
            ? shipping_timeline.map((item) => ({
                status: item.status,
                message: item.message || "",
                date: formatDate(item.date) || item.date,
                active: true,
            }))
            : [
                { status: "Order Placed", date: formatDate(createdAt), active: true },
                { status: "Payment Success", date: formatDate(createdAt), active: true },
                { status: "Shipped", date: formatDate(resolvedDispatchDate), active: !!resolvedDispatchDate && resolvedDispatchDate !== "N/A" },
                { status: "Delivered", date: formatDate(resolvedDeliveryDate), active: !!resolvedDeliveryDate && resolvedDeliveryDate !== "N/A" },
            ].filter(item => item.date !== "N/A");

    const timelineItems = [...baseTimelineItems, ...extraTimelineEvents];

    const handleConfirmCancelWaybill = async () => {
        if (!resolvedAwbNumber || resolvedAwbNumber === "N/A") {
            toast.error("Invalid AWB Number");
            return;
        }

        try {
            setIsCancellingWaybill(true);
            const main = new Listing();
            const response = await main.cancelWaybill({ AWBNo: resolvedAwbNumber });
            const msg = response?.data?.message || response?.data?.Message || "Waybill cancelled successfully.";

            if (response?.data?.status === false || response?.data?.error) {
                toast.error(msg);
            } else {
                toast.success(msg);
            }

            // Dynamically update status
            setProject((prev) => ({
                ...prev,
                status: "cancelled",
                shipping_status: "cancelled",
                shipment: {
                    ...(prev?.shipment || {}),
                    shippingStatus: "cancelled",
                    status: "cancelled",
                },
            }));

            // Append response message to Order Timeline
            setExtraTimelineEvents((prev) => [
                ...prev,
                {
                    status: "BlueDart Waybill Cancelled",
                    message: msg,
                    date: moment().format("DD MMM YYYY, hh:mm A"),
                    active: true,
                },
            ]);

            setCancelModalOpen(false);
        } catch (error) {
            console.error("Cancel waybill error:", error);
            const errMessage = error?.response?.data?.message || error?.message || "Failed to cancel waybill";
            toast.error(errMessage);
        } finally {
            setIsCancellingWaybill(false);
        }
    };


    // ─── RENDER ───────────────────────────────────────────────
    return (
        <AdminLayout>
            <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F5F7FA]">
                {/* Top Bar */}


                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto ">
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
                    <div className="mt-3  space-y-6">

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
                                    <button
                                        onClick={() => openModal("edit")}
                                        className="px-4 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                                    >
                                        <FiEdit className="w-3.5 h-3.5" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => openModal("cancel")}
                                        className="px-4 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-200 hover:bg-red-100 transition-colors flex items-center gap-1.5"
                                    >
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
                                            <p className="text-sm font-medium text-gray-700 mt-1">{resolvedCourierName}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">AWB Number</p>
                                            <p className="text-sm font-medium text-gray-700 mt-1 font-mono">{resolvedAwbNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Shipping Status</p>
                                            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(resolvedShippingStatus)}`}>
                                                {resolvedShippingStatus}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Dispatch Date</p>
                                            <p className="text-sm font-medium text-gray-700 mt-1">{resolvedDispatchDate ? formatDate(resolvedDispatchDate) : "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Delivery Date</p>
                                            <p className="text-sm font-medium text-gray-700 mt-1">{resolvedDeliveryDate ? formatDate(resolvedDeliveryDate) : "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Last Updated</p>
                                            <p className="text-sm font-medium text-gray-700 mt-1">{formatDate(updatedAt)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* ─── AWB CANCELLATION SECTION ──────── */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                                        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                            <FiXCircle className="w-4 h-4 text-red-500" />
                                            AWB Cancellation
                                        </h3>
                                        <span className="text-xs text-gray-400 font-medium">Carrier: {resolvedCourierName}</span>
                                    </div>

                                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Waybill / Tracking Number</p>
                                            <p className="text-sm font-bold font-mono text-gray-900 mt-0.5">{resolvedAwbNumber}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {status === "cancelled" || resolvedShippingStatus === "cancelled"
                                                    ? "This shipment/waybill has been marked as cancelled."
                                                    : "Cancel BlueDart waybill directly via carrier API."}
                                            </p>
                                        </div>

                                        {resolvedAwbNumber && resolvedAwbNumber !== "N/A" && (
                                            <button
                                                onClick={() => setCancelModalOpen(true)}
                                                disabled={status === "cancelled" || resolvedShippingStatus === "cancelled" || isCancellingWaybill}
                                                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 flex-shrink-0"
                                            >
                                                <FiXCircle className="w-4 h-4" />
                                                {status === "cancelled" || resolvedShippingStatus === "cancelled" ? "Waybill Cancelled" : "Cancel BlueDart Waybill"}
                                            </button>
                                        )}
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
                                            <button
                                                onClick={handlePrintLabel}
                                                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                                            >
                                                <FiPrinter className="w-3.5 h-3.5" />
                                                Print Label
                                            </button>
                                            <button
                                                onClick={handleDownloadLabel}
                                                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                                            >
                                                <FiDownload className="w-3.5 h-3.5" />
                                                Download Label
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => openModal("cancel")}
                                            className="w-full px-3 py-2 rounded-xl border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
                                        >
                                            <FiXCircle className="w-3.5 h-3.5" />
                                            Cancel Order
                                        </button>
                                        <button
                                            onClick={() => openModal("note")}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                                        >
                                            <FiPlus className="w-3.5 h-3.5" />
                                            Add Order Note
                                        </button>
                                    </div>
                                </div>

                                {/* ─── ADMIN ACTIONS ────────────── */}
                                {!isOrderApproved && (
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <FiClipboard className="w-4 h-4 text-gray-400" />
                                            Admin Actions
                                        </h3>
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => openModal("approve")}
                                                className="w-full px-4 py-2.5 rounded-xl bg-green-50 text-green-700 text-sm font-medium border border-green-200 hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <FiCheckCircle className="w-4 h-4" />
                                                Approve Order
                                            </button>
                                            <button
                                                onClick={() => openModal("cancel")}
                                                className="w-full px-4 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <FiXCircle className="w-4 h-4" />
                                                Cancel Order
                                            </button>
                                            <button
                                                onClick={() => openModal("hold")}
                                                className="w-full px-4 py-2.5 rounded-xl bg-yellow-50 text-yellow-700 text-sm font-medium border border-yellow-200 hover:bg-yellow-100 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <FiClock className="w-4 h-4" />
                                                Hold Order
                                            </button>
                                            <button
                                                onClick={() => openModal("note")}
                                                className="w-full px-4 py-2.5 rounded-xl bg-blue-50 text-blue-700 text-sm font-medium border border-blue-200 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <FiMessageSquare className="w-4 h-4" />
                                                Add Order Note
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* ─── ORDER TIMELINE ──────────────── */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <FiClock className="w-4 h-4 text-gray-400" />
                                        Order Timeline
                                    </h3>
                                    <div className="space-y-3">
                                        {timelineItems?.length > 0 ? (
                                            timelineItems.map((evt, idx) => (
                                                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                    <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${String(evt.status || "").toLowerCase().includes("cancel") ? "bg-red-500" : evt.active ? "bg-green-500" : "bg-gray-300"}`} />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className="text-xs font-bold text-gray-800">{evt.status}</p>
                                                            <span className="text-[10px] text-gray-400">{evt.date}</span>
                                                        </div>
                                                        {evt.message && (
                                                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">{evt.message}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-gray-400">No timeline events recorded.</p>
                                        )}
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
                                            {status === "on-hold" && "Order is on hold."}
                                            {!["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "on-hold"].includes(status) && "Status update pending."}
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

                    </div>
                </div>
            </div>

            {/* ─── BLUE DART WAYBILL CANCEL MODAL ─── */}
            {cancelModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
                        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <FiXCircle className="w-5 h-5 text-red-500" />
                                Cancel BlueDart Waybill
                            </h3>
                            <button
                                onClick={() => !isCancellingWaybill && setCancelModalOpen(false)}
                                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <FiXCircle className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        
                        <p className="text-sm text-gray-600 leading-relaxed mb-6">
                            Are you sure you want to cancel BlueDart Waybill <span className="font-mono font-bold text-gray-900">{resolvedAwbNumber}</span> for order <span className="font-bold text-gray-900">{orderId || id}</span>? This will submit a cancellation request to the BlueDart API.
                        </p>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => !isCancellingWaybill && setCancelModalOpen(false)}
                                disabled={isCancellingWaybill}
                                className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmCancelWaybill}
                                disabled={isCancellingWaybill}
                                className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
                            >
                                {isCancellingWaybill ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                                        Cancelling...
                                    </>
                                ) : (
                                    "Confirm Cancellation"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── STATUS UPDATE MODAL ────────────────────────── */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-800">
                                {modalAction === "approve" && "Approve Order"}
                                {modalAction === "cancel" && "Cancel Order"}
                                {modalAction === "hold" && "Hold Order"}
                                {modalAction === "note" && "Add Order Note"}
                                {modalAction === "edit" && "Update Order Status"}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <FiXCircle className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Status Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Order Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="on-hold">On Hold</option>
                                </select>
                            </div>

                            {/* Note Textarea */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Note (optional)
                                </label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Add a note about this status change..."
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleStatusUpdate}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Status"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* HIDDEN SHIPPING LABEL FOR DIRECT PRINT/DOWNLOAD */}
            <div style={{ position: "fixed", top: "-10000px", left: "-10000px", zIndex: -1000, pointerEvents: "none" }}>
                {normalizedLabelData && <ShippingLabel ref={labelRef} data={normalizedLabelData} />}
            </div>
        </AdminLayout>
    );
}