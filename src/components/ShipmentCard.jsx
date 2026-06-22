import Link from "next/link";
import {
  extractCarrier,
  extractReferenceNumber,
  extractStatus,
  extractStatusInformation,
  extractTokenNumber,
  extractTrackingNumber,
  formatShipmentStatus,
} from "@/components/shipmentUtils";

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-sm text-gray-800 break-words">
        {value || "N/A"}
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

        {trackingHref && trackingNumber ? (
          <Link
            href={trackingHref}
            className="inline-flex items-center justify-center rounded-md border border-black px-4 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
          >
            Track Shipment
          </Link>
        ) : null}
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

      {statusInformation ? (
        <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
            Carrier Response
          </p>
          <p className="mt-1 text-sm text-gray-800 break-words">
            {statusInformation}
          </p>
        </div>
      ) : null}

      
    </div>
  );
}


