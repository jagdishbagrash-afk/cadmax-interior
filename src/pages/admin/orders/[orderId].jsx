"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AdminLayout from "../../admin/common/AdminLayout";
import Listing from "@/pages/api/Listing";
import ConfirmModal from "@/components/ConfirmModal";
import Popup from "@/pages/common/Popup";
import toast from "react-hot-toast";
import moment from "moment";
import {
  HiOutlineArrowLeft,
  HiOutlineMapPin,
  HiOutlineCreditCard,
  HiOutlineTruck,
  HiOutlineUser,
  HiOutlineClipboardDocumentCheck,
  HiOutlineClock,
  HiOutlineArrowPath,
  HiOutlineEye,
} from "react-icons/hi2";
import { FaCheck, FaTimes, FaBox, FaUserShield } from "react-icons/fa";
import { MdClose, MdRefresh } from "react-icons/md";

function maskPhone(phone) {
  if (!phone) return "N/A";
  const str = String(phone);
  if (str.length <= 2) return str;
  return str.slice(0, -2) + "XX";
}

function SectionCard({ title, icon, iconBg, children, action }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg || "bg-black/5 text-black"}`}
          >
            {icon}
          </div>
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
        </div>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function InfoRow({ label, value, mono }) {
  return (
    <div className="flex items-start gap-4 py-2">
      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 w-40 flex-shrink-0 pt-0.5">
        {label}
      </p>
      <p
        className={`text-sm text-gray-800 flex-1 break-words ${
          mono ? "font-mono" : ""
        }`}
      >
        {value || "-"}
      </p>
    </div>
  );
}

export default function AdminOrderDetailsPage() {
  const router = useRouter();
  const { orderId } = router.query || {};

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [rawData, setRawData] = useState(null);

  const [approveOpen, setApproveOpen] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);

  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);

  const [retryLoading, setRetryLoading] = useState(false);

  const fetchDetails = useCallback(async () => {
    if (!orderId) return;
    try {
      setLoading(true);
      const main = new Listing();
      const res = await main.adminGetOrderDetails(orderId);
      console.log("[ADMIN_ORDER_DETAILS] raw response:", res);
      const payload = res?.data?.data || res?.data || {};
      setRawData(res?.data || {});
      setOrder(payload);
    } catch (error) {
      console.error("[ADMIN_ORDER_DETAILS] fetch error:", error);
      toast.error(error?.response?.data?.message || "Failed to load order details");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (router.isReady && orderId) {
      fetchDetails();
    }
  }, [router.isReady, orderId, fetchDetails]);

  const approvalBadge = useMemo(() => {
    const status = order?.admin_approval_status;
    const map = {
      pending_approval: {
        label: "Pending Approval",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      approved: {
        label: "Approved",
        color: "bg-green-100 text-green-800 border-green-200",
      },
      rejected: {
        label: "Rejected",
        color: "bg-red-100 text-red-800 border-red-200",
      },
    };
    return map[status] || map.pending_approval;
  }, [order?.admin_approval_status]);

  const orderStatusBadge = useMemo(() => {
    const s = order?.status;
    const map = {
      pending: "bg-gray-100 text-gray-700 border-gray-200",
      confirmed: "bg-blue-100 text-blue-700 border-blue-200",
      shipped: "bg-purple-100 text-purple-700 border-purple-200",
      delivered: "bg-green-100 text-green-700 border-green-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    };
    return map[s] || "bg-gray-100 text-gray-700 border-gray-200";
  }, [order?.status]);

  const products = useMemo(() => {
    const raw = order?.items || order?.products || order?.product || [];
    return Array.isArray(raw) ? raw : [];
  }, [order]);

  const grandTotal = useMemo(() => {
    if (order?.amount != null) return order.amount;
    return products.reduce((sum, p) => sum + (Number(p?.total) || Number(p?.price) * Number(p?.quantity) || 0), 0);
  }, [order, products]);

  const customerInfo = useMemo(() => {
    const addr = order?.addressId || order?.shippingAddress || order?.address || {};
    return {
      name: order?.customerName || order?.customer?.name || order?.name,
      email: order?.customerEmail || order?.customer?.email || order?.email,
      phone: order?.customerPhone || order?.customer?.mobile || order?.mobile,
      street: addr?.street_address || addr?.street || addr?.address1 || order?.address,
      city: addr?.city,
      state: addr?.state,
      country: addr?.country,
      pincode: addr?.pincode || addr?.zip || addr?.postalCode,
    };
  }, [order]);

  const shippingAddressStr = useMemo(() => {
    const parts = [
      customerInfo.street,
      customerInfo.city,
      customerInfo.state,
      customerInfo.country,
      customerInfo.pincode ? `- ${customerInfo.pincode}` : null,
    ].filter(Boolean);
    return parts.length ? parts.join(", ") : null;
  }, [customerInfo]);

  const paymentInfo = useMemo(() => {
    const p = order?.payment || order?.paymentInfo || order?.payments?.[0] || {};
    return {
      method: order?.payment_method || p?.method || p?.paymentMethod || (order?.razorpay_order_id ? "Online (Razorpay)" : "N/A"),
      amount: p?.amount != null ? p.amount : order?.amount,
      transactionId:
        p?.razorpay_payment_id ||
        p?.transactionId ||
        p?.txnId ||
        order?.razorpay_payment_id,
      razorpayOrderId: p?.razorpay_order_id || order?.razorpay_order_id,
      signature: p?.razorpay_signature || order?.razorpay_signature,
      status: p?.status || order?.payment_status || (order?.razorpay_payment_id ? "Paid" : order?.payment_method === "COD" ? "Pending (COD)" : "Unknown"),
    };
  }, [order]);

  const shipmentInfo = useMemo(() => {
    const s = order?.shipment || {};
    const label = s?.labelData || order?.labelData || {};
    return {
      trackingNumber:
        s?.trackingNumber ||
        s?.trackingNo ||
        order?.trackingNumber ||
        label?.trackingNumber,
      courier: s?.carrier || s?.courier || label?.carrier || s?.courierPartner || "Blue Dart",
      labelData: label,
      formattedForWeb:
        s?.formattedForWeb ||
        order?.formattedForWeb ||
        s?.trackingEvents ||
        [],
      timeline: s?.timeline || s?.shippingTimeline || s?.events || order?.shippingTimeline || [],
      createdAt: s?.createdAt || s?.shippedAt || s?.bookedAt,
    };
  }, [order]);

  const auditInfo = useMemo(() => {
    const a = order?.approvalAudit || order?.audit || {};
    const status = order?.admin_approval_status;
    return {
      status,
      approverName:
        a?.approvedBy?.name ||
        a?.approverName ||
        a?.actorName ||
        (status === "approved" ? order?.updatedBy : null),
      approverEmail: a?.approvedBy?.email || a?.approverEmail,
      approverRole: a?.approvedBy?.role || a?.approverRole || "Admin",
      approvedAt:
        a?.approvedAt ||
        a?.actionAt ||
        (status === "approved" ? order?.approvedAt || order?.updatedAt : null),
      rejectorName:
        a?.rejectedBy?.name ||
        a?.rejectorName ||
        a?.actorName ||
        (status === "rejected" ? order?.updatedBy : null),
      rejectorEmail: a?.rejectedBy?.email || a?.rejectorEmail,
      rejectedAt:
        a?.rejectedAt ||
        a?.actionAt ||
        (status === "rejected" ? order?.rejectedAt || order?.updatedAt : null),
      reason: a?.reason || order?.rejectionReason || a?.note || "",
    };
  }, [order]);

  const handleApprove = async () => {
    if (!orderId) return;
    try {
      setApproveLoading(true);
      const main = new Listing();
      const res = await main.adminApproveOrder(orderId);
      const payload = res?.data?.data || res?.data || {};
      const trackingNumber =
        payload?.shipment?.trackingNumber ||
        payload?.trackingNumber ||
        payload?.shipment?.trackingNo;

      if (res?.data?.status !== false) {
        if (trackingNumber) {
          toast.success(`✅ Approved! Tracking: ${trackingNumber}`);
        } else {
          toast(
            "⚠️ Order approved but courier API failed — click Retry Shipment below.",
            { icon: "⚠️", duration: 5000 }
          );
        }
        setApproveOpen(false);
        fetchDetails();
      } else {
        toast.error(res?.data?.message || "Approval failed");
      }
    } catch (error) {
      console.error("[ADMIN_DETAILS_APPROVE] error:", error);
      toast.error(error?.response?.data?.message || "Approval failed");
    } finally {
      setApproveLoading(false);
    }
  };

  const handleReject = async () => {
    if (!orderId) return;
    const trimmed = rejectReason.trim();
    if (!trimmed) {
      toast.error("Please enter a rejection reason");
      return;
    }
    try {
      setRejectLoading(true);
      const main = new Listing();
      const res = await main.adminRejectOrder(orderId, { reason: trimmed });
      if (res?.data?.status !== false) {
        toast.success("❌ Rejected. Stock restored.");
        setRejectOpen(false);
        setRejectReason("");
        fetchDetails();
      } else {
        toast.error(res?.data?.message || "Rejection failed");
      }
    } catch (error) {
      console.error("[ADMIN_DETAILS_REJECT] error:", error);
      toast.error(error?.response?.data?.message || "Rejection failed");
    } finally {
      setRejectLoading(false);
    }
  };

  const handleRetryShipment = async () => {
    if (!orderId) return;
    try {
      setRetryLoading(true);
      const main = new Listing();
      const res = await main.adminApproveOrder(orderId);
      const payload = res?.data?.data || res?.data || {};
      const trackingNumber =
        payload?.shipment?.trackingNumber ||
        payload?.trackingNumber ||
        payload?.shipment?.trackingNo;

      if (res?.data?.status !== false) {
        if (trackingNumber) {
          toast.success(`✅ Shipment created! Tracking: ${trackingNumber}`);
        } else {
          toast.error("Courier API still failing. Please try again later.");
        }
        fetchDetails();
      } else {
        toast.error(res?.data?.message || "Retry failed");
      }
    } catch (error) {
      console.error("[ADMIN_RETRY_SHIPMENT] error:", error);
      toast.error(error?.response?.data?.message || "Retry failed");
    } finally {
      setRetryLoading(false);
    }
  };

  const shipmentMissingWarning = useMemo(() => {
    if (order?.admin_approval_status !== "approved") return false;
    return !shipmentInfo.trackingNumber;
  }, [order?.admin_approval_status, shipmentInfo.trackingNumber]);

  const getProductImage = (item) => {
    const variant = item?.variant || item?.selectedVariant || {};
    const variantImages = variant?.images || [];
    const productImages = item?.id?.images || item?.product?.images || item?.images || [];
    return variantImages?.[0] || productImages?.[0] || productImages?.thumbnail || null;
  };

  const getVariantTitle = (item) => {
    return (
      item?.variantTitle ||
      item?.variant ||
      item?.selectedVariant?.title ||
      item?.selectedVariant?.color ||
      item?.priceSectionTitle ||
      "-"
    );
  };

  if (loading && !order) {
    return (
      <AdminLayout page="Order Details">
        <div className="px-4 py-10">
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <p className="text-gray-500 text-sm">Loading order details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!loading && !order) {
    return (
      <AdminLayout page="Order Details">
        <div className="px-4 py-10">
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <p className="text-gray-500 text-sm mb-4">
              Unable to load order details for {orderId || "this order"}.
            </p>
            <Link
              href="/admin/order"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white text-sm font-semibold hover:bg-gray-800 transition"
            >
              <HiOutlineArrowLeft /> Back to Orders
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout page="Order Details">
      <div className="px-4 py-4 space-y-5 max-w-[1200px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            href="/admin/order"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black transition-colors w-fit"
          >
            <HiOutlineArrowLeft />
            Back to Orders List
          </Link>
          <button
            onClick={fetchDetails}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition w-fit sm:w-auto ml-auto"
          >
            <MdRefresh size={16} />
            Refresh
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  Order ID
                </p>
                <h1 className="text-2xl font-extrabold text-gray-900 mt-1">
                  {order?.orderId || orderId || "N/A"}
                </h1>
              </div>
              <div className="h-10 w-px bg-gray-200 hidden sm:block" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  Placed On
                </p>
                <p className="text-sm font-bold text-gray-800 mt-1">
                  {order?.createdAt
                    ? moment(order.createdAt).format("DD MMM YYYY, hh:mm A")
                    : "-"}
                </p>
              </div>
              <div className="h-10 w-px bg-gray-200 hidden sm:block" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  Grand Total
                </p>
                <p className="text-xl font-extrabold text-green-600 mt-1">
                  ₹{Number(grandTotal || 0).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <span
                className={`inline-block px-4 py-2 rounded-full text-xs font-bold border ${approvalBadge.color}`}
              >
                {approvalBadge.label}
              </span>
              <span
                className={`inline-block px-4 py-2 rounded-full text-xs font-bold border capitalize ${orderStatusBadge}`}
              >
                {order?.status || "pending"}
              </span>
            </div>
          </div>
        </div>

        <SectionCard
          title="Approval Status & Actions"
          icon={<HiOutlineClipboardDocumentCheck className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-700"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
            <div className="flex items-start gap-4 flex-1">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  order?.admin_approval_status === "approved"
                    ? "bg-green-100 text-green-700"
                    : order?.admin_approval_status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order?.admin_approval_status === "approved" ? (
                  <FaCheck size={20} />
                ) : order?.admin_approval_status === "rejected" ? (
                  <FaTimes size={20} />
                ) : (
                  <HiOutlineClock className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h4 className="text-lg font-bold text-gray-900 capitalize">
                    {approvalBadge.label}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {order?.admin_approval_status === "pending_approval" &&
                    "This order is awaiting admin approval. Approve it to create shipment and generate tracking ID, or reject to restore stock."}
                  {order?.admin_approval_status === "approved" &&
                    "This order has been approved. Shipment should be created and tracking ID generated."}
                  {order?.admin_approval_status === "rejected" &&
                    "This order has been rejected. Stock has been restored."}
                </p>
                {shipmentMissingWarning && (
                  <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <p className="text-sm font-medium text-amber-800">
                        ⚠️ Order approved but courier API failed — shipment not yet created.
                      </p>
                      <button
                        onClick={handleRetryShipment}
                        disabled={retryLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-all disabled:opacity-50 flex-shrink-0"
                      >
                        {retryLoading ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                            Retrying...
                          </>
                        ) : (
                          <>
                            <HiOutlineArrowPath className="w-4 h-4" />
                            Retry Shipment
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {order?.admin_approval_status === "pending_approval" && (
              <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto">
                <button
                  onClick={() => setApproveOpen(true)}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-all shadow-sm"
                >
                  <FaCheck size={14} />
                  Approve Order
                </button>
                <button
                  onClick={() => {
                    setRejectReason("");
                    setRejectOpen(true);
                  }}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all shadow-sm"
                >
                  <FaTimes size={14} />
                  Reject Order
                </button>
              </div>
            )}
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SectionCard
            title="Customer Information"
            icon={<HiOutlineUser className="w-5 h-5" />}
            iconBg="bg-blue-50 text-blue-700"
          >
            <div className="divide-y divide-gray-100">
              <InfoRow label="Name" value={customerInfo.name} />
              <InfoRow label="Email" value={customerInfo.email} />
              <InfoRow
                label="Phone"
                value={
                  customerInfo.phone ? (
                    <span className="inline-flex items-center gap-2">
                      {maskPhone(customerInfo.phone)}
                      <span className="text-xs text-gray-400 font-normal">
                        (masked)
                      </span>
                    </span>
                  ) : null
                }
              />
            </div>
            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                  <HiOutlineMapPin className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Shipping Address
                  </p>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {shippingAddressStr || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Payment Information"
            icon={<HiOutlineCreditCard className="w-5 h-5" />}
            iconBg="bg-emerald-50 text-emerald-700"
          >
            <div className="divide-y divide-gray-100">
              <InfoRow label="Method" value={paymentInfo.method} />
              <InfoRow
                label="Amount"
                value={
                  paymentInfo.amount != null
                    ? `₹${Number(paymentInfo.amount).toLocaleString("en-IN")}`
                    : null
                }
              />
              <InfoRow
                label="Transaction ID"
                value={paymentInfo.transactionId}
                mono
              />
              {paymentInfo.razorpayOrderId && (
                <InfoRow
                  label="Razorpay Order"
                  value={paymentInfo.razorpayOrderId}
                  mono
                />
              )}
              <InfoRow label="Status" value={paymentInfo.status} />
            </div>
          </SectionCard>
        </div>

        <SectionCard
          title="Products"
          icon={<FaBox className="w-4 h-4" />}
          iconBg="bg-purple-50 text-purple-700"
        >
          <div className="overflow-x-auto -mx-2">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {["Product", "Variant", "Qty", "Unit Price", "Line Total"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((item, idx) => {
                    const unitPrice =
                      Number(item?.price) ||
                      Number(item?.unitPrice) ||
                      (Number(item?.total) / (Number(item?.quantity) || 1)) ||
                      0;
                    const lineTotal =
                      Number(item?.total) ||
                      unitPrice * (Number(item?.quantity) || 1);
                    const img = getProductImage(item);
                    const title =
                      item?.id?.title ||
                      item?.product?.title ||
                      item?.title ||
                      `Product ${idx + 1}`;

                    return (
                      <tr
                        key={item?.id?._id || item?._id || idx}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex-shrink-0">
                              {img ? (
                                <img
                                  src={img}
                                  alt={title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                  <FaBox />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-gray-900 truncate max-w-[320px]">
                                {title}
                              </p>
                              {item?.priceSectionTitle && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {item.priceSectionTitle}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap">
                          {getVariantTitle(item)}
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-gray-800">
                          × {item?.quantity || 1}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap">
                          ₹{Number(unitPrice).toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">
                          ₹{Number(lineTotal).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-sm text-gray-500"
                    >
                      No products available
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-900">
                  <td
                    colSpan={4}
                    className="px-4 py-4 text-right text-base font-bold text-gray-900"
                  >
                    Grand Total
                  </td>
                  <td className="px-4 py-4 text-right text-xl font-extrabold text-green-600 whitespace-nowrap">
                    ₹{Number(grandTotal || 0).toLocaleString("en-IN")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </SectionCard>

        <SectionCard
          title="Shipment & Tracking"
          icon={<HiOutlineTruck className="w-5 h-5" />}
          iconBg="bg-sky-50 text-sky-700"
          action={
            shipmentInfo.trackingNumber ? (
              <Link
                href={`/shipment/track/${encodeURIComponent(
                  shipmentInfo.trackingNumber
                )}?courier=${encodeURIComponent(shipmentInfo.courier || "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                <HiOutlineEye className="w-3.5 h-3.5" />
                Public Tracking
              </Link>
            ) : null
          }
        >
          {shipmentInfo.trackingNumber ||
          shipmentInfo.timeline?.length > 0 ||
          shipmentInfo.formattedForWeb?.length > 0 ? (
            <div className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Tracking No.
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-1 font-mono break-all">
                    {shipmentInfo.trackingNumber || "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Courier
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {shipmentInfo.courier}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Booked At
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">
                    {shipmentInfo.createdAt
                      ? moment(shipmentInfo.createdAt).format("DD MMM YYYY, hh:mm A")
                      : "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Label Ref.
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mt-1 font-mono break-all">
                    {shipmentInfo.labelData?.waybillNo ||
                      shipmentInfo.labelData?.customerCode ||
                      "-"}
                  </p>
                </div>
              </div>

              {(shipmentInfo.timeline?.length > 0 ||
                shipmentInfo.formattedForWeb?.length > 0) && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Shipment Timeline
                  </p>
                  <div className="space-y-2">
                    {(shipmentInfo.timeline.length > 0
                      ? shipmentInfo.timeline
                      : shipmentInfo.formattedForWeb
                    ).map((evt, idx) => {
                      const label =
                        evt?.label ||
                        evt?.title ||
                        evt?.status ||
                        evt?.event ||
                        `Update ${idx + 1}`;
                      const location =
                        evt?.location ||
                        evt?.city ||
                        evt?.hub ||
                        evt?.description ||
                        "";
                      const time =
                        evt?.timestamp ||
                        evt?.date ||
                        evt?.time ||
                        evt?.createdAt ||
                        evt?.updatedAt;
                      const done = evt?.completed ?? evt?.status !== "pending";
                      return (
                        <div
                          key={`evt-${idx}`}
                          className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              done
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {done ? (
                              <FaCheck size={12} />
                            ) : (
                              <HiOutlineClock className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 justify-between">
                              <p className="text-sm font-bold text-gray-900">
                                {label}
                              </p>
                              {time && (
                                <p className="text-xs text-gray-500 whitespace-nowrap">
                                  {moment(time).isValid()
                                    ? moment(time).format("DD MMM YYYY, hh:mm A")
                                    : String(time)}
                                </p>
                              )}
                            </div>
                            {location && (
                              <p className="text-xs text-gray-600 mt-1">
                                {location}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-10 text-center">
              {order?.admin_approval_status === "pending_approval" ? (
                <>
                  <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                    <HiOutlineClock className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    Shipment not yet created
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Approve this order to generate shipment and tracking ID.
                  </p>
                </>
              ) : shipmentMissingWarning ? (
                <>
                  <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                    <HiOutlineArrowPath className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    Shipment creation failed
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Retry courier API by clicking the button above.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-3">
                    <HiOutlineTruck className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-gray-600">
                    No shipment data available.
                  </p>
                </>
              )}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Approval Audit"
          icon={<FaUserShield className="w-4 h-4" />}
          iconBg="bg-rose-50 text-rose-700"
        >
          {auditInfo.status === "approved" || auditInfo.status === "rejected" ? (
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div
                className={`px-6 py-4 ${
                  auditInfo.status === "approved" ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      auditInfo.status === "approved"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {auditInfo.status === "approved" ? (
                      <FaCheck size={18} />
                    ) : (
                      <FaTimes size={18} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 capitalize">
                      {auditInfo.status} by{" "}
                      <span>
                        {auditInfo.status === "approved"
                          ? auditInfo.approverName || "System Admin"
                          : auditInfo.rejectorName || "System Admin"}
                      </span>
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Role: {auditInfo.status === "approved"
                        ? auditInfo.approverRole || "Admin"
                        : "Admin"}
                      {auditInfo.status === "approved" && auditInfo.approverEmail
                        ? ` • ${auditInfo.approverEmail}`
                        : auditInfo.status === "rejected" && auditInfo.rejectorEmail
                        ? ` • ${auditInfo.rejectorEmail}`
                        : ""}
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Action At
                    </p>
                    <p className="text-xs font-semibold text-gray-800 mt-0.5">
                      {auditInfo.status === "approved" && auditInfo.approvedAt
                        ? moment(auditInfo.approvedAt).format("DD MMM YYYY, hh:mm A")
                        : auditInfo.status === "rejected" && auditInfo.rejectedAt
                        ? moment(auditInfo.rejectedAt).format("DD MMM YYYY, hh:mm A")
                        : order?.updatedAt
                        ? moment(order.updatedAt).format("DD MMM YYYY, hh:mm A")
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
              {auditInfo.reason && (
                <div className="px-6 py-4 border-t border-gray-100">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Reason / Note
                  </p>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {auditInfo.reason}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-10 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center mb-3">
                <HiOutlineClock className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-gray-800">
                Awaiting admin action
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Audit record will appear here once the order is approved or rejected.
              </p>
            </div>
          )}
        </SectionCard>

        <div className="h-8" />
      </div>

      <ConfirmModal
        isOpen={approveOpen}
        onClose={() => !approveLoading && setApproveOpen(false)}
        onConfirm={handleApprove}
        title={`Approve Order ${order?.orderId || orderId || ""}?`}
        message="This will create the shipment & generate tracking ID."
        confirmText="Approve"
        cancelText="Cancel"
        confirmClassName="bg-green-600 hover:bg-green-700"
        loading={approveLoading}
      />

      {rejectOpen && (
        <Popup
          isOpen={rejectOpen}
          onClose={() => !rejectLoading && setRejectOpen(false)}
          size="max-w-[720px]"
        >
          <div className="w-full rounded-xl bg-white">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Reject Order {order?.orderId || orderId || ""}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Stock will be restored after rejection.
                </p>
              </div>
              <button
                onClick={() => !rejectLoading && setRejectOpen(false)}
                disabled={rejectLoading}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <MdClose size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={5}
                  placeholder="Enter the reason for rejecting this order (required for audit trail)..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 resize-none"
                  disabled={rejectLoading}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => !rejectLoading && setRejectOpen(false)}
                  disabled={rejectLoading}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={rejectLoading}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-all shadow-sm disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {rejectLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <FaTimes size={12} />
                      Confirm Reject
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </Popup>
      )}
    </AdminLayout>
  );
}
