import Link from "next/link";
import { useRef, useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import { useReactToPrint } from "react-to-print";
import Listing from "@/pages/api/Listing";
import ShippingLabel from "@/components/shipping-label/ShippingLabel";
import { exportShippingLabelPdf } from "@/components/shipping-label/exportShippingLabelPdf";
import {
  extractCarrier,
  extractOrderAndShipment,
  extractStatus,
  extractTrackingEvents,
  extractTrackingNumber,
  extractUpdatedAt,
  formatShipmentStatus,
  unwrapApiData,
} from "@/components/shipmentUtils";

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-medium text-gray-900">
        {value || "N/A"}
      </p>
    </div>
  );
}

function DetailLine({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm text-gray-800">
        {value || "N/A"}
      </p>
    </div>
  );
}

function formatDisplayDate(value, format = "DD MMM YYYY, hh:mm A") {
  if (!value) {
    return "";
  }

  return moment(value).isValid() ? moment(value).format(format) : String(value);
}

function formatBoolLike(value) {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return value;
}

export default function TrackingStatusView({
  title,
  description,
  responseData,
  loading,
  error,
  backHref = "/orders",
  orderId = "",
  onRefresh = null,
}) {
  const [isActing, setIsActing] = useState(false);
  const [isLabelOpen, setIsLabelOpen] = useState(false);
  const [isExportingLabel, setIsExportingLabel] = useState(false);
  const labelRef = useRef(null);

  const payload = unwrapApiData(responseData);
  const { order, shipment } = extractOrderAndShipment(payload);
  const trackingNumber = extractTrackingNumber(payload, shipment, order);
  const status = extractStatus(payload, shipment, order);
  const updatedAt = extractUpdatedAt(payload, shipment, order);
  const carrier = extractCarrier(payload, shipment, order) || "DHL";
  const events = extractTrackingEvents(payload);
  const liveTracking = payload?.liveTracking || shipment?.liveTracking || order?.liveTracking || {};
  const serviceability =
    payload?.serviceability || shipment?.serviceability || order?.serviceability || {};
  const shipmentManagement =
    payload?.shipmentManagement ||
    shipment?.shipmentManagement ||
    order?.shipmentManagement ||
    {};
  const labelReprint =
    payload?.labelReprint || shipment?.labelReprint || order?.labelReprint || {};
  const labelData =
    payload?.labelData ||
    shipment?.labelData ||
    order?.labelData ||
    labelReprint?.labelData ||
    null;
  const estimatedDelivery =
    payload?.estimatedDelivery ||
    shipment?.estimatedDelivery ||
    order?.estimatedDelivery ||
    liveTracking?.estimatedDelivery ||
    "";
  const transitEstimate =
    payload?.transitEstimate ||
    shipment?.transitEstimate ||
    order?.transitEstimate ||
    liveTracking?.transitEstimate ||
    "";
  const shippingTimelineRaw =
    payload?.shippingTimeline ||
    shipment?.shippingTimeline ||
    order?.shippingTimeline ||
    [];
  const shippingTimeline = Array.isArray(shippingTimelineRaw)
    ? shippingTimelineRaw
    : [];
  const currentLocation =
    liveTracking?.currentLocation ||
    liveTracking?.location ||
    liveTracking?.currentHub ||
    liveTracking?.hub ||
    "";
  const liveStatus =
    liveTracking?.status ||
    liveTracking?.currentStatus ||
    liveTracking?.shipmentStatus ||
    status;
  const labelPreviewData =
    labelData && typeof labelData === "object"
      ? {
          trackingNumber,
          orderNumber:
            order?.orderNumber ||
            order?.orderId ||
            shipment?.orderNumber ||
            payload?.orderNumber ||
            "",
          courierName: carrier,
          labelData,
        }
      : null;
  const publicTrackingHref = trackingNumber
    ? (() => {
        const query = carrier
          ? `?courier=${encodeURIComponent(carrier)}`
          : "";
        return `/shipment/track/${encodeURIComponent(trackingNumber)}${query}`;
      })()
    : "";
  const printTitle = `shipping-label-${trackingNumber || orderId || "preview"}`;
  const canCancel = Boolean(shipmentManagement?.canCancelShipment);
  const canDispatch = Boolean(shipmentManagement?.canMarkDispatched);
  const canUpdateDelivery = Boolean(shipmentManagement?.canUpdateDeliveryStatus);
  const shippingDetailItems = [
    {
      label: "Serviceable",
      value: formatBoolLike(serviceability?.serviceable),
    },
    {
      label: "Serviceability Message",
      value: serviceability?.message || serviceability?.status,
    },
    {
      label: "Shipment Management",
      value: Object.keys(shipmentManagement).length
        ? Object.entries(shipmentManagement)
            .map(([key, value]) => `${key}: ${formatBoolLike(value)}`)
            .join(" | ")
        : "",
    },
    {
      label: "Reprint Available",
      value: formatBoolLike(labelReprint?.enabled ?? labelReprint?.available),
    },
    {
      label: "Ship To",
      value: labelData?.shipTo?.fullAddress,
    },
    {
      label: "Ship From",
      value: labelData?.shipFrom?.fullAddress,
    },
  ].filter((item) => item.value !== undefined && item.value !== null && item.value !== "");

  const handlePrintLabel = useReactToPrint({
    contentRef: labelRef,
    documentTitle: printTitle,
    pageStyle:
      "@page { size: A4 portrait; margin: 10mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }",
  });

  const refreshShipmentDetails = async () => {
    if (!orderId || typeof onRefresh !== "function") {
      return;
    }

    return onRefresh();
  };

  const handleShipmentAction = async (action) => {
    if (!orderId || isActing) {
      return;
    }

    setIsActing(true);

    try {
      const main = new Listing();

      if (action === "refresh") {
        await main.RefreshOrderShipment(orderId);
        toast.success("Shipment details refreshed");
      }

      if (action === "cancel") {
        await main.CancelOrderShipment(orderId);
        toast.success("Shipment cancelled");
      }

      if (action === "dispatch") {
        await main.DispatchOrderShipment(orderId);
        toast.success("Shipment marked as dispatched");
      }

      if (action === "delivery-status") {
        await main.UpdateOrderDeliveryStatus(orderId, {
          status: "delivered",
        });
        toast.success("Delivery status updated");
      }

      await refreshShipmentDetails();
    } catch (actionError) {
      toast.error(
        actionError?.response?.data?.message || "Unable to update shipment."
      );
    } finally {
      setIsActing(false);
    }
  };

  const handleExportLabel = async () => {
    if (!labelRef.current || isExportingLabel) {
      return;
    }

    try {
      setIsExportingLabel(true);
      await exportShippingLabelPdf({
        element: labelRef.current,
        fileName: `${trackingNumber || orderId || "shipping-label"}.pdf`,
      });
    } finally {
      setIsExportingLabel(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Loading tracking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <p className="text-sm text-red-700">{error}</p>
          <Link
            href={backHref}
            className="mt-4 inline-flex rounded-md border border-black px-4 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="border-b border-gray-100 pb-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">
            Shipment Tracking
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            {description}
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <SummaryCard
            label="Tracking Number"
            value={trackingNumber}
          />
          <SummaryCard
            label="Current Status"
            value={formatShipmentStatus(status)}
          />
          <SummaryCard label="Carrier" value={carrier} />
          <SummaryCard
            label="Last Updated"
            value={updatedAt ? moment(updatedAt).format("DD MMM YYYY, hh:mm A") : "N/A"}
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <SummaryCard
            label="Live Status"
            value={formatShipmentStatus(liveStatus)}
          />
          <SummaryCard
            label="Current Location"
            value={currentLocation || "Location unavailable"}
          />
          <SummaryCard
            label="Estimated Delivery"
            value={
              estimatedDelivery
                ? formatDisplayDate(estimatedDelivery, "DD MMM YYYY")
                : "Not available"
            }
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SummaryCard
            label="Transit Estimate"
            value={transitEstimate || "Not available"}
          />
          <SummaryCard
            label="Serviceability"
            value={
              serviceability?.status ||
              serviceability?.message ||
              serviceability?.serviceable ||
              "Not available"
            }
          />
          <SummaryCard
            label="Service Type"
            value={labelData?.serviceType || shipment?.serviceType || "N/A"}
          />
        </div>

        {shippingTimeline.length > 0 ? (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Delivery Timeline
            </h2>
            <div className="mt-4 space-y-3">
              {shippingTimeline.map((item, index) => {
                const stepLabel =
                  item?.label || item?.title || item?.status || `Step ${index + 1}`;
                const stepTime =
                  item?.timestamp || item?.date || item?.updatedAt || item?.createdAt;
                const stepDescription =
                  item?.description || item?.details || item?.location || "";

                return (
                  <div
                    key={`${stepLabel}-${index}`}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatShipmentStatus(stepLabel)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {stepTime
                          ? formatDisplayDate(stepTime)
                          : "Time unavailable"}
                      </p>
                    </div>
                    {stepDescription ? (
                      <p className="mt-1 text-sm text-gray-600">
                        {stepDescription}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">
            Shipment Details
          </h2>
          <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {shippingDetailItems.map((item) => (
                <DetailLine key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          </div>
          <details className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-gray-900">
              View full shipment response
            </summary>
            <pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-words text-xs text-gray-700">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </details>
          <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <DetailLine label="Label Data Available" value={labelPreviewData ? "Yes" : "No"} />
              <DetailLine
                label="Label Reprint Status"
                value={
                  labelReprint?.status ||
                  labelReprint?.message ||
                  (labelPreviewData ? "Ready" : "Unavailable")
                }
              />
              <DetailLine
                label="Timeline Entries"
                value={shippingTimeline.length ? String(shippingTimeline.length) : "0"}
              />
            </div>
          </div>
        </div>

        {events.length > 0 ? (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Tracking History
            </h2>
            <div className="mt-4 space-y-4">
              {events.map((event, index) => {
                const eventStatus =
                  event?.status ??
                  event?.description ??
                  event?.details ??
                  `Update ${index + 1}`;
                const eventLocation =
                  event?.location ??
                  event?.city ??
                  event?.hub ??
                  event?.facility ??
                  "";
                const eventTime =
                  event?.timestamp ??
                  event?.date ??
                  event?.createdAt ??
                  event?.updatedAt ??
                  null;

                return (
                  <div
                    key={`${eventStatus}-${index}`}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatShipmentStatus(eventStatus)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {eventTime
                          ? formatDisplayDate(eventTime)
                          : "Time unavailable"}
                      </p>
                    </div>
                    {eventLocation ? (
                      <p className="mt-2 text-sm text-gray-600">{eventLocation}</p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              No detailed tracking checkpoints are available yet.
            </p>
          </div>
        )}

        {/* <details className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-gray-900">
            View raw tracking response
          </summary>
          <pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-words text-xs text-gray-700">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </details> */}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={backHref}
            className="inline-flex rounded-md border border-black px-4 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
          >
            Back
          </Link>
          {trackingNumber ? (
            <Link
              href={publicTrackingHref}
              className="inline-flex rounded-md bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Open Public Tracking
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => handleShipmentAction("refresh")}
            disabled={isActing || !orderId}
            className="inline-flex rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Refresh Shipment
          </button>
          {labelPreviewData ? (
            <button
              type="button"
              onClick={() => setIsLabelOpen(true)}
              className="inline-flex rounded-md border border-black px-4 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
            >
              Reprint Label
            </button>
          ) : null}
          {canCancel ? (
            <button
              type="button"
              onClick={() => handleShipmentAction("cancel")}
              disabled={isActing}
              className="inline-flex rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel Shipment
            </button>
          ) : null}
          {canDispatch ? (
            <button
              type="button"
              onClick={() => handleShipmentAction("dispatch")}
              disabled={isActing}
              className="inline-flex rounded-md border border-black px-4 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Mark Dispatched
            </button>
          ) : null}
          {canUpdateDelivery ? (
            <button
              type="button"
              onClick={() => handleShipmentAction("delivery-status")}
              disabled={isActing}
              className="inline-flex rounded-md bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Update Delivery Status
            </button>
          ) : null}
        </div>
      </div>

      {isLabelOpen && labelPreviewData ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
          <div className="w-full max-w-6xl rounded-2xl bg-white p-4 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Reprint Shipment Label
                </h2>
                <p className="text-sm text-gray-500">
                  Uses existing label data from the shipment details response.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handlePrintLabel}
                  className="inline-flex rounded-md border border-black px-4 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
                >
                  Print
                </button>
                <button
                  type="button"
                  onClick={handleExportLabel}
                  disabled={isExportingLabel}
                  className="inline-flex rounded-md bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isExportingLabel ? "Exporting..." : "Export PDF"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsLabelOpen(false)}
                  className="inline-flex rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="mt-4 max-h-[80vh] overflow-auto rounded-xl border border-gray-200 bg-gray-50 p-4">
              <ShippingLabel ref={labelRef} data={labelPreviewData} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
