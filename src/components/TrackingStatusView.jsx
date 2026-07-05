import Link from "next/link";
import moment from "moment";
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

export default function TrackingStatusView({
  title,
  description,
  responseData,
  loading,
  error,
  backHref = "/orders",
}) {
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

  const payload = unwrapApiData(responseData);
  const { order, shipment } = extractOrderAndShipment(payload);
  const trackingNumber = extractTrackingNumber(payload, shipment, order);
  const status = extractStatus(payload, shipment, order);
  const updatedAt = extractUpdatedAt(payload, shipment, order);
  const carrier = extractCarrier(payload, shipment, order) || "DHL";
  const events = extractTrackingEvents(payload);
  const publicTrackingHref = trackingNumber
    ? (() => {
        const query = carrier
          ? `?courier=${encodeURIComponent(carrier)}`
          : "";
        return `/shipment/track/${encodeURIComponent(trackingNumber)}${query}`;
      })()
    : "";

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
                          ? moment(eventTime).format("DD MMM YYYY, hh:mm A")
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

        <details className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-gray-900">
            View raw tracking response
          </summary>
          <pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-words text-xs text-gray-700">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </details>

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
        </div>
      </div>
    </div>
  );
}
