import React, { useCallback, useEffect, useState } from "react";
import Listing from "@/pages/api/Listing";
import toast from "react-hot-toast";

const RETURN_STATUSES = [
  "requested",
  "under_review",
  "approved",
  "rejected",
  "pickup_scheduled",
  "picked_up",
  "in_transit",
  "received",
  "quality_check",
  "refund_initiated",
  "refund_completed",
  "replacement_created",
  "replacement_shipped",
  "replacement_delivered",
  "cancelled",
  "completed",
];

function unwrapResponse(response) {
  return response?.data?.data || response?.data || {};
}

export default function AdminReturnDetailsModal({ returnId, onClose, onUpdated }) {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [provider, setProvider] = useState("");
  const [awbNumber, setAwbNumber] = useState("");
  const [pickupRequestId, setPickupRequestId] = useState("");
  const [trackingStatus, setTrackingStatus] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [paymentId, setPaymentId] = useState("");

  const loadDetails = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const listing = new Listing();
      const response = await listing.adminGetReturnDetails(returnId);
      const payload = unwrapResponse(response);
      setRequest(payload.returnRequest || payload);
      setStatus(payload.returnRequest?.status || payload.status || "");
      setAdminNote(payload.returnRequest?.adminNote || payload.adminNote || "");
      setPaymentId(
        payload.returnRequest?.refund?.paymentId ||
        payload.refund?.paymentId ||
        payload.order?.payment_id ||
        payload.order?.paymentId ||
        ""
      );
    } catch (loadError) {
      console.error("Failed to load return request:", loadError);
      setError(
        loadError?.response?.data?.message ||
        loadError?.message ||
        "Failed to load request details."
      );
    } finally {
      setLoading(false);
    }
  }, [returnId]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  const runAction = async (actionName, handler, successMessage) => {
    setAction(actionName);
    setError("");
    try {
      const response = await handler(new Listing());
      if (response?.data?.success === false) {
        throw new Error(response.data.message || "The request could not be updated.");
      }
      toast.success(response?.data?.message || successMessage);
      await loadDetails();
      await onUpdated?.();
    } catch (actionError) {
      console.error(`Failed to ${actionName} return request:`, actionError);
      const message =
        actionError?.response?.data?.message ||
        actionError?.message ||
        `Failed to ${actionName} request.`;
      setError(message);
      toast.error(message);
    } finally {
      setAction("");
    }
  };

  const submitStatus = (event) => {
    event.preventDefault();
    runAction(
      "update status",
      (listing) => listing.adminUpdateReturnStatus(returnId, { status, adminNote }),
      "Request status updated."
    );
  };

  const submitRejection = (event) => {
    event.preventDefault();
    if (!rejectionReason.trim()) {
      setError("Enter a rejection reason.");
      return;
    }
    runAction(
      "reject",
      (listing) => listing.adminRejectReturn(returnId, { rejectionReason: rejectionReason.trim() }),
      "Request rejected."
    );
  };

  const submitReverseShipment = (event) => {
    event.preventDefault();
    runAction(
      "create reverse shipment",
      (listing) => listing.adminCreateReverseShipment(returnId, {
        provider,
        awbNumber,
        pickupRequestId,
        trackingStatus,
      }),
      "Reverse shipment details saved."
    );
  };

  const submitRefund = (event) => {
    event.preventDefault();
    runAction(
      "initiate refund",
      (listing) => listing.adminInitiateReturnRefund(returnId, {
        amount: Number(refundAmount),
        paymentId,
      }),
      "Refund initiation requested."
    );
  };

  const requestType = request?.requestType || request?.type || "return";
  const requestStatus = String(request?.status || "").toLowerCase();
  const canApprove = requestStatus === "requested" || requestStatus === "under_review";
  const canReject = canApprove;
  const canCreateReverseShipment =
    requestStatus === "approved" || requestStatus === "pickup_scheduled";
  const canRefund =
    requestType === "return" && requestStatus === "quality_check";
  const canCreateReplacement =
    requestType === "replacement" &&
    (requestStatus === "approved" || requestStatus === "quality_check");
  const customer = request?.customer || request?.user || {};
  const order = request?.order || {};
  const pickup = request?.pickupAddress || {};
  const images = Array.isArray(request?.supportingImages) ? request.supportingImages : [];

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-return-title"
        className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-gray-100 p-5 sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              {request?.returnId || returnId}
            </p>
            <h2 id="admin-return-title" className="mt-1 text-xl font-extrabold text-gray-900">
              Return request details
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close request details"
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
          >
            ×
          </button>
        </header>

        <div className="space-y-6 p-5 sm:p-6">
          {loading && <p className="text-sm text-gray-500">Loading request details...</p>}
          {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {request && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Order", request.orderNumber || order.orderNumber || order.orderId || "—"],
                  ["Product", request.productTitle || request.product?.title || "—"],
                  ["Customer", customer.name || customer.fullName || "—"],
                  ["Phone", customer.phone || customer.mobile || "—"],
                  ["Request", requestType],
                  ["Quantity", request.quantity || "—"],
                  ["Reason", request.reason || "—"],
                  ["Status", request.status || "—"],
                  ["Requested", request.requestedAt ? new Date(request.requestedAt).toLocaleString("en-IN") : "—"],
                  ["Delivered", request.deliveredAt ? new Date(request.deliveredAt).toLocaleString("en-IN") : "—"],
                  ["Eligible until", request.eligibleUntil ? new Date(request.eligibleUntil).toLocaleString("en-IN") : "—"],
                  ["Address", [pickup.name, pickup.fullAddress, pickup.phone].filter(Boolean).join(", ") || "—"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-gray-50 p-3">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">{label}</p>
                    <p className="mt-1 break-words text-sm font-semibold capitalize text-gray-900">{value}</p>
                  </div>
                ))}
              </div>

              {request.comments && (
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Customer comments</h3>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{request.comments}</p>
                </div>
              )}
              {images.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-bold text-gray-800">Supporting images</h3>
                  <div className="flex flex-wrap gap-3">
                    {images.map((image, index) => (
                      <a
                        key={image.key || image.url || index}
                        href={image.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-blue-700 underline"
                      >
                        Image {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {request.refund && (
                <div className="rounded-xl border border-purple-100 bg-purple-50 p-4 text-sm text-purple-900">
                  Refund: {request.refund.status || "—"} · Amount: {request.refund.amount ?? "—"} · Payment: {request.refund.paymentId || "—"}
                </div>
              )}
              {request.reverseShipment && (
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
                  Reverse shipment: {request.reverseShipment.provider || "—"} · AWB: {request.reverseShipment.awbNumber || "—"} · {request.reverseShipment.trackingStatus || "—"}
                </div>
              )}

              <div className="grid gap-4 lg:grid-cols-2">
                <form onSubmit={submitStatus} className="space-y-3 rounded-xl border border-gray-200 p-4">
                  <h3 className="text-sm font-bold text-gray-900">Update status</h3>
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    {RETURN_STATUSES.map((item) => (
                      <option key={item} value={item}>{item.replace(/_/g, " ")}</option>
                    ))}
                  </select>
                  <textarea
                    value={adminNote}
                    onChange={(event) => setAdminNote(event.target.value)}
                    rows={2}
                    maxLength={1000}
                    placeholder="Admin note (optional)"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={Boolean(action)}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                  >
                    {action === "update status" ? "Saving..." : "Save status"}
                  </button>
                </form>

                {canApprove && (
                  <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                    <h3 className="text-sm font-bold text-gray-900">Review decision</h3>
                    <p className="text-xs text-gray-600">Approve the request or provide a required reason to reject it.</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={Boolean(action)}
                        onClick={() => runAction(
                          "approve",
                          (listing) => listing.adminApproveReturn(returnId, { adminNote }),
                          "Request approved."
                        )}
                        className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                      >
                        {action === "approve" ? "Approving..." : "Approve"}
                      </button>
                    </div>
                    <form onSubmit={submitRejection} className="space-y-2">
                      <textarea
                        value={rejectionReason}
                        onChange={(event) => setRejectionReason(event.target.value)}
                        required
                        rows={2}
                        placeholder="Rejection reason"
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      />
                      <button
                        type="submit"
                        disabled={Boolean(action)}
                        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-bold text-red-700 disabled:opacity-50"
                      >
                        {action === "reject" ? "Rejecting..." : "Reject"}
                      </button>
                    </form>
                  </div>
                )}

                {canCreateReverseShipment && (
                  <form onSubmit={submitReverseShipment} className="space-y-3 rounded-xl border border-gray-200 p-4">
                    <h3 className="text-sm font-bold text-gray-900">Reverse pickup</h3>
                    <input value={provider} onChange={(event) => setProvider(event.target.value)} required placeholder="Courier provider" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                    <input value={awbNumber} onChange={(event) => setAwbNumber(event.target.value)} placeholder="AWB number" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                    <input value={pickupRequestId} onChange={(event) => setPickupRequestId(event.target.value)} placeholder="Pickup request ID" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                    <input value={trackingStatus} onChange={(event) => setTrackingStatus(event.target.value)} placeholder="Tracking status" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                    <button type="submit" disabled={Boolean(action)} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
                      Save reverse pickup
                    </button>
                  </form>
                )}

                {canRefund && (
                  <form onSubmit={submitRefund} className="space-y-3 rounded-xl border border-purple-200 bg-purple-50/40 p-4">
                    <h3 className="text-sm font-bold text-gray-900">Initiate refund</h3>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      required
                      value={refundAmount}
                      onChange={(event) => setRefundAmount(event.target.value)}
                      placeholder="Refund amount"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                    <input
                      required
                      value={paymentId}
                      onChange={(event) => setPaymentId(event.target.value)}
                      placeholder="Original payment ID"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                    <p className="text-xs text-purple-900">
                      The server must confirm payment-provider completion before marking the refund complete.
                    </p>
                    <button type="submit" disabled={Boolean(action)} className="rounded-lg bg-purple-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
                      Initiate refund
                    </button>
                  </form>
                )}

                {canCreateReplacement && (
                  <div className="space-y-3 rounded-xl border border-blue-200 bg-blue-50/40 p-4">
                    <h3 className="text-sm font-bold text-gray-900">Create replacement order</h3>
                    <p className="text-xs text-gray-600">The server will create a no-charge replacement linked to this request.</p>
                    <button
                      type="button"
                      disabled={Boolean(action)}
                      onClick={() => runAction(
                        "create replacement",
                        (listing) => listing.adminCreateReplacementOrder(returnId),
                        "Replacement order created."
                      )}
                      className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                    >
                      Create replacement order
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
