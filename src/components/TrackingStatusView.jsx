import Link from "next/link";
import { useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import {
  extractCarrier,
  extractEstimatedDelivery,
  extractLiveTracking,
  extractOrderAndShipment,
  extractStatus,
  extractTrackingPending,
  extractTrackingEvents,
  extractTrackingNumber,
  extractTransitEstimate,
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
        {value || "-"}
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

export default function TrackingStatusView({
  title,
  description,
  responseData,
  trackingResponseData = null,
  loading,
  error,
  backHref = "/orders",
  orderId = "",
  onRefresh = null,
}) {
  const [isActing, setIsActing] = useState(false);

  const payload = unwrapApiData(responseData);
  const trackingPayload = unwrapApiData(trackingResponseData);
  const { order, shipment } = extractOrderAndShipment(payload);
  const trackingNumber = extractTrackingNumber(payload, shipment, order);
  const status = extractStatus(payload, shipment, order);
  const updatedAt = extractUpdatedAt(payload, shipment, order);
  const carrier = extractCarrier(payload, shipment, order) || "DHL";
  const events = extractTrackingEvents(trackingPayload || payload);
  const liveTracking = extractLiveTracking(trackingPayload, payload, shipment, order);
  const trackingPending = extractTrackingPending(payload, trackingPayload, shipment, order);
  const estimatedDelivery = extractEstimatedDelivery(
    payload,
    trackingPayload,
    shipment,
    order
  );
  const transitEstimate = extractTransitEstimate(
    payload,
    trackingPayload,
    shipment,
    order
  );
  const shippingTimelineRaw =
    payload?.shippingTimeline ||
    trackingPayload?.shippingTimeline ||
    liveTracking?.timeline ||
    liveTracking?.events ||
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
  const publicTrackingHref = trackingNumber
    ? (() => {
        const query = carrier
          ? `?courier=${encodeURIComponent(carrier)}`
          : "";
        return `/shipment/track/${encodeURIComponent(trackingNumber)}${query}`;
      })()
    : "";
  const hasLiveTracking = Boolean(
    Object.keys(liveTracking || {}).length ||
      shippingTimeline.length ||
      currentLocation ||
      liveStatus
  );
  const compactDetailItems = [
    {
      label: "Estimated Delivery",
      value: estimatedDelivery
        ? formatDisplayDate(estimatedDelivery, "DD MMM YYYY")
        : "-",
    },
    {
      label: "Expected POD",
      value: transitEstimate.estimatedPod
        ? formatDisplayDate(transitEstimate.estimatedPod, "DD MMM YYYY")
        : "-",
    },
    {
      label: "Origin City",
      value: transitEstimate.originCity || "-",
    },
    {
      label: "Destination City",
      value: transitEstimate.destinationCity || "-",
    },
    {
      label: "Service Center",
      value: transitEstimate.serviceCenter || "-",
    },
  ];

  const handleRefresh = async () => {
    if (!orderId || isActing || typeof onRefresh !== "function") {
      return;
    }

    setIsActing(true);

    try {
      await onRefresh();
      toast.success("Shipment details refreshed");
    } catch (actionError) {
      toast.error(
        actionError?.response?.data?.message || "Unable to update shipment."
      );
    } finally {
      setIsActing(false);
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
            value={hasLiveTracking ? formatShipmentStatus(liveStatus) : "-"}
          />
          <SummaryCard
            label="Current Location"
            value={currentLocation || "-"}
          />
          <SummaryCard
            label="Estimated Delivery"
            value={
              estimatedDelivery
                ? formatDisplayDate(estimatedDelivery, "DD MMM YYYY")
                : "-"
            }
          />
        </div>

        <div className="mt-8">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                  Tracking & ETA
                </p>
                <p className="mt-1 text-sm text-gray-700">
                  {trackingPending
                    ? "Tracking will be available after pickup"
                    : hasLiveTracking
                    ? "Live shipment updates are available."
                    : "Tracking updates are not available yet."}
                </p>
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isActing || !orderId}
                className="inline-flex rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isActing ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {compactDetailItems.map((item) => (
                <SummaryCard key={item.label} label={item.label} value={item.value} />
              ))}
            </div>

            {(trackingPending || hasLiveTracking) && shippingTimeline.length > 0 ? (
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
                      className="rounded-lg border border-gray-200 bg-white p-3"
                    >
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-semibold text-gray-900">
                          {formatShipmentStatus(stepLabel)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {stepTime ? formatDisplayDate(stepTime) : "-"}
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
            ) : null}
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
        ) : !trackingPending ? (
          <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              No detailed tracking checkpoints are available yet.
            </p>
          </div>
        ) : null}

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
            onClick={handleRefresh}
            disabled={isActing || !orderId}
            className="inline-flex rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isActing ? "Refreshing..." : "Refresh Shipment"}
          </button>
        </div>
      </div>
    </div>
  );
}
