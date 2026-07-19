import Link from "next/link";
import { FaCircle } from "react-icons/fa";
import {
  extractCarrier,
  extractEstimatedDelivery,
  extractLiveTracking,
  extractReferenceNumber,
  extractStatus,
  extractStatusInformation,
  extractTrackingPending,
  extractTokenNumber,
  extractTrackingNumber,
  extractTransitEstimate,
  formatShipmentStatus,
} from "@/components/shipmentUtils";

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-sm text-gray-800 break-words">
        {value || "-"}
      </p>
    </div>
  );
}

export default function ShipmentCard({
  title = "Shipment",
  shipment,
  order,
  trackingNumber: trackingNumberProp = "",
  carrier: carrierProp = "",
  status: statusProp = "",
  loading = false,
  error = "",
  emptyMessage = "Shipment details are not available yet.",
  trackingHref = "",
  onRefresh = null,
}) {
  if (loading) {
    return (
      <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-500">Loading shipment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  const trackingNumber =
    trackingNumberProp || extractTrackingNumber(order, shipment);
  const status = statusProp || extractStatus(shipment, order);
  const carrier =
    carrierProp || extractCarrier(shipment, order) || "DHL";
  const shipmentId =
    shipment?._id ?? shipment?.shipment_id ?? shipment?.shipmentId ?? null;
  const referenceNumber = extractReferenceNumber(shipment, order);
  const tokenNumber = extractTokenNumber(shipment, order);
  const statusInformation = extractStatusInformation(shipment, order);
  const trackingPending = extractTrackingPending(shipment, order);
  const liveTracking = extractLiveTracking(shipment, order);
  const estimatedDelivery = extractEstimatedDelivery(shipment, order);
  const transitEstimate = extractTransitEstimate(shipment, order);
  const liveLocation =
    liveTracking?.currentLocation ||
    liveTracking?.location ||
    liveTracking?.currentHub ||
    "";
  const liveTimeline = Array.isArray(liveTracking?.timeline)
    ? liveTracking.timeline
    : Array.isArray(liveTracking?.events)
    ? liveTracking.events
    : [];
  const isFailureState = /failed|unauthorized|error|denied/i.test(
    `${status || ""} ${statusInformation || ""}`
  );

  if (!shipment && !trackingNumber) {
    return (
      <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
            {title}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-gray-900">
            {formatShipmentStatus(status || "created")}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {typeof onRefresh === "function" ? (
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
            >
              Refresh
            </button>
          ) : null}
          {trackingHref && trackingNumber ? (
            <Link
              href={trackingHref}
              className="inline-flex items-center justify-center rounded-md border border-black px-4 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
            >
              Track Shipment
            </Link>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DetailItem label="Tracking Number" value={trackingNumber} />
        <DetailItem label="Carrier" value={carrier} />
        <DetailItem label="Shipment ID" value={shipmentId} />
        <DetailItem
          label="Current Status"
          value={formatShipmentStatus(status || "created")}
        />
        <DetailItem label="Reference No" value={referenceNumber} />
        <DetailItem label="Token No" value={tokenNumber} />
      </div>

      {trackingPending ? (
        <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-start gap-2">
            <FaCircle size={9} className="mt-1 text-yellow-500 animate-pulse" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">
                Tracking will be available after pickup
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <DetailItem
                  label="Estimated Delivery"
                  value={estimatedDelivery || transitEstimate.estimatedDelivery || "-"}
                />
                <DetailItem
                  label="Expected POD"
                  value={transitEstimate.estimatedPod || "-"}
                />
                <DetailItem
                  label="Origin City"
                  value={transitEstimate.originCity || "-"}
                />
                <DetailItem
                  label="Destination City"
                  value={transitEstimate.destinationCity || "-"}
                />
                <DetailItem
                  label="Service Center"
                  value={transitEstimate.serviceCenter || "-"}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {!trackingPending && (Object.keys(liveTracking || {}).length > 0 || liveTimeline.length > 0) ? (
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem
              label="Live Status"
              value={formatShipmentStatus(
                liveTracking?.status ||
                  liveTracking?.currentStatus ||
                  liveTracking?.shipmentStatus ||
                  status
              )}
            />
            <DetailItem
              label="Package Location"
              value={liveLocation || "-"}
            />
            <DetailItem
              label="Estimated Delivery"
              value={estimatedDelivery || "-"}
            />
          </div>

          {liveTimeline.length > 0 ? (
            <div className="mt-3 space-y-2">
              {liveTimeline.slice(0, 3).map((item, index) => {
                const stepLabel =
                  item?.label || item?.title || item?.status || `Update ${index + 1}`;
                const stepDescription =
                  item?.description || item?.details || item?.location || "";

                return (
                  <div
                    key={`${stepLabel}-${index}`}
                    className="rounded-md border border-gray-200 bg-white px-3 py-2"
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {formatShipmentStatus(stepLabel)}
                    </p>
                    {stepDescription ? (
                      <p className="mt-1 text-xs text-gray-600">{stepDescription}</p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}

      {statusInformation ? (
        <div
          className={`mt-4 rounded-lg p-3 ${
            isFailureState
              ? "border border-red-200 bg-red-50"
              : "border border-gray-100 bg-gray-50"
          }`}
        >
          <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
            Carrier Response
          </p>
          <p
            className={`mt-1 break-words text-sm ${
              isFailureState ? "text-red-700" : "text-gray-800"
            }`}
          >
            {statusInformation}
          </p>
        </div>
      ) : null}

      
    </div>
  );
}
