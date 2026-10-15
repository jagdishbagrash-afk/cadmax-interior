import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import Listing from "@/pages/api/Listing";

const CANCELLABLE_STATUSES = new Set([
  "requested",
  "under_review",
  "approved",
  "pickup_scheduled",
]);

function responseData(response) {
  return response?.data?.data || response?.data || {};
}

export default function CustomerReturnRequestDialog({ request, onClose, onCancelled }) {
  const requestId = request?.returnId || request?._id || request?.id;
  const [details, setDetails] = useState(request);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadDetails = async () => {
      if (!requestId) return;
      setLoading(true);
      setError("");
      try {
        const listing = new Listing();
        const response = await listing.getReturnRequest(requestId);
        const payload = responseData(response);
        if (active) setDetails(payload.returnRequest || payload);
      } catch (loadError) {
        console.error("Failed to load return request details:", loadError);
        if (active) {
          setError(
            loadError?.response?.data?.message ||
            "Unable to load the latest request details."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    loadDetails();
    return () => {
      active = false;
    };
  }, [requestId]);

  const status = String(details?.status || "").toLowerCase();
  const canCancel = CANCELLABLE_STATUSES.has(status);

  const handleCancel = async () => {
    if (!requestId || !canCancel) return;
    setCancelling(true);
    setError("");
    try {
      const listing = new Listing();
      const response = await listing.cancelReturnRequest(requestId);
      const payload = responseData(response);
      if (response?.data?.success === false) {
        throw new Error(response.data.message || "Unable to cancel this request.");
      }
      setDetails(payload.returnRequest || payload);
      toast.success(response?.data?.message || "Return request cancelled.");
      await onCancelled?.();
    } catch (cancelError) {
      console.error("Failed to cancel return request:", cancelError);
      const message =
        cancelError?.response?.data?.message ||
        cancelError?.message ||
        "Unable to cancel this request.";
      setError(message);
      toast.error(message);
    } finally {
      setCancelling(false);
    }
  };

  const images = Array.isArray(details?.supportingImages) ? details.supportingImages : [];
  const pickup = details?.pickupAddress || {};

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-return-title"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between border-b border-gray-100 p-5 sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              {details?.returnId || "Return request"}
            </p>
            <h2 id="customer-return-title" className="mt-1 text-xl font-extrabold text-gray-900">
              Request status
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close request details"
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
          >
            <FaTimes />
          </button>
        </header>
        <div className="space-y-5 p-5 sm:p-6">
          {loading && <p className="text-sm text-gray-500">Refreshing request details...</p>}
          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Current status</p>
            <p className="mt-1 text-lg font-extrabold capitalize text-gray-900">
              {String(details?.status || "Unknown").replace(/[_-]+/g, " ")}
            </p>
            <p className="mt-2 text-sm text-gray-700">
              {(details?.requestType || "return")} · {details?.productTitle || details?.product?.title || "Product"}
            </p>
          </div>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-gray-500">Reason</dt>
              <dd className="mt-1 text-gray-900">{details?.reason || "—"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-500">Requested</dt>
              <dd className="mt-1 text-gray-900">
                {details?.requestedAt
                  ? new Date(details.requestedAt).toLocaleString("en-IN")
                  : "—"}
              </dd>
            </div>
          </dl>
          {details?.comments && (
            <div>
              <p className="text-sm font-semibold text-gray-500">Comments</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-gray-900">{details.comments}</p>
            </div>
          )}
          {(pickup.fullAddress || pickup.address) && (
            <div>
              <p className="text-sm font-semibold text-gray-500">Pickup address</p>
              <p className="mt-1 text-sm text-gray-900">
                {[pickup.name, pickup.fullAddress || pickup.address, pickup.phone]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          )}
          {images.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-gray-500">Supporting images</p>
              <div className="flex flex-wrap gap-2">
                {images.map((image, index) => (
                  <a
                    key={image.key || image.url || index}
                    href={image.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-blue-700 underline"
                  >
                    Image {index + 1}
                  </a>
                ))}
              </div>
            </div>
          )}
          {details?.adminNote && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm font-bold text-blue-900">Update from our team</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-blue-800">{details.adminNote}</p>
            </div>
          )}
          {details?.rejectionReason && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <p className="text-sm font-bold text-red-900">Reason declined</p>
              <p className="mt-1 text-sm text-red-800">{details.rejectionReason}</p>
            </div>
          )}
          {details?.reverseShipment?.awbNumber && (
            <p className="text-sm text-gray-700">
              Pickup tracking: <strong>{details.reverseShipment.awbNumber}</strong>
              {details.reverseShipment.trackingStatus
                ? ` · ${details.reverseShipment.trackingStatus}`
                : ""}
            </p>
          )}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            {canCancel && (
              <button
                type="button"
                disabled={cancelling}
                onClick={handleCancel}
                className="rounded-xl border border-red-200 px-5 py-3 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-60"
              >
                {cancelling ? "Cancelling..." : "Cancel request"}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
