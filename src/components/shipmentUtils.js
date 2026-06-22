const TRACKING_NUMBER_KEYS = [
  "tracking_number",
  "trackingNumber",
  "awb_number",
  "awbNumber",
  "waybill",
  "waybillNumber",
];

const STATUS_KEYS = [
  "status",
  "shipment_status",
  "shipmentStatus",
  "tracking_status",
  "trackingStatus",
  "current_status",
  "currentStatus",
  "latest_status",
  "latestStatus",
];

const CARRIER_KEYS = [
  "carrier_name",
  "carrierName",
  "carrier",
  "provider",
  "courier_name",
  "courierName",
  "courier",
  "shipping_provider",
  "shippingProvider",
];

export function unwrapApiData(responseOrPayload) {
  if (!responseOrPayload) {
    return null;
  }

  if (
    typeof responseOrPayload === "object" &&
    "data" in responseOrPayload
  ) {
    return responseOrPayload.data?.data ?? responseOrPayload.data ?? null;
  }

  return responseOrPayload;
}

function readFirstValue(source, keys) {
  if (!source || typeof source !== "object") {
    return null;
  }

  for (const key of keys) {
    const value = source[key];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return null;
}

export function extractTrackingNumber(...sources) {
  for (const source of sources) {
    const value = readFirstValue(source, TRACKING_NUMBER_KEYS);

    if (value) {
      return String(value);
    }
  }

  return null;
}

export function extractStatus(...sources) {
  for (const source of sources) {
    const value = readFirstValue(source, STATUS_KEYS);

    if (value) {
      return String(value);
    }
  }

  return null;
}

export function extractCarrier(...sources) {
  for (const source of sources) {
    const value = readFirstValue(source, CARRIER_KEYS);

    if (value) {
      return String(value);
    }
  }

  return null;
}

export function formatShipmentStatus(status) {
  if (!status) {
    return "Pending";
  }

  return String(status)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function extractOrderAndShipment(responseOrPayload) {
  const payload = unwrapApiData(responseOrPayload);
  const order = payload?.order ?? null;
  const shipment = payload?.shipment ?? payload?.shipment_details ?? null;
  const trackingNumber = extractTrackingNumber(
    payload,
    order,
    shipment
  );
  const status = extractStatus(payload, shipment, order);

  return {
    payload,
    order,
    shipment,
    trackingNumber,
    status,
  };
}

export function extractTrackingEvents(responseOrPayload) {
  const payload = unwrapApiData(responseOrPayload);

  const candidates = [
    payload?.events,
    payload?.checkpoints,
    payload?.history,
    payload?.tracking?.events,
    payload?.tracking?.checkpoints,
    payload?.shipment?.events,
    payload?.shipment?.checkpoints,
    payload?.shipment?.history,
  ];

  return candidates.find(Array.isArray) ?? [];
}

export function extractUpdatedAt(...sources) {
  for (const source of sources) {
    const value =
      source?.updatedAt ??
      source?.updated_at ??
      source?.last_updated_at ??
      source?.lastUpdatedAt ??
      source?.timestamp ??
      null;

    if (value) {
      return value;
    }
  }

  return null;
}
