const TRACKING_NUMBER_KEYS = [
  "tracking_number",
  "trackingNumber",
  "awb_number",
  "awbNumber",
  "AWBNo",
  "waybill",
  "waybillNumber",
];

const REFERENCE_NUMBER_KEYS = [
  "CCRCRDREF",
  "creditReference",
  "creditReferenceNo",
  "CreditReferenceNo",
  "orderNumber",
];

const TOKEN_NUMBER_KEYS = [
  "TokenNumber",
  "tokenNumber",
];

const STATUS_KEYS = [
  "shipping_status",
  "shipment_status",
  "shipmentStatus",
  "status",
  "shippingStatus",
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

  if (source.GenerateWayBillResult && typeof source.GenerateWayBillResult === "object") {
    return readFirstValue(source.GenerateWayBillResult, keys);
  }

  return null;
}

function buildErrorSummary(payload) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const rawErrorItems = [
    payload?.["error-response"],
    payload?.errorResponse,
    payload?.error?.["error-response"],
    payload?.error?.errorResponse,
  ].find(Array.isArray);

  const errorMessages = rawErrorItems
    ?.map((item) => item?.msg || item?.message || item?.title)
    .filter(Boolean);

  const title =
    payload?.error?.title ??
    payload?.title ??
    null;
  const status =
    payload?.error?.status ??
    payload?.status ??
    null;
  const message =
    payload?.error?.message ??
    payload?.message ??
    null;

  const summaryParts = [
    title ? String(title) : null,
    status ? `Code ${status}` : null,
    message ? String(message) : null,
    ...(errorMessages || []),
  ].filter(Boolean);

  return summaryParts.length ? summaryParts.join(" | ") : null;
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

  for (const source of sources) {
    const payload = unwrapApiData(source);

    if (payload?.success === false) {
      return "shipment_failed";
    }

    if (payload?.error || payload?.status >= 400) {
      return payload?.title ? String(payload.title) : "shipment_failed";
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

export function extractReferenceNumber(...sources) {
  for (const source of sources) {
    const value = readFirstValue(source, REFERENCE_NUMBER_KEYS);

    if (value) {
      return String(value);
    }
  }

  return null;
}

export function extractTokenNumber(...sources) {
  for (const source of sources) {
    const value = readFirstValue(source, TOKEN_NUMBER_KEYS);

    if (value) {
      return String(value);
    }
  }

  return null;
}

export function extractStatusInformation(...sources) {
  for (const source of sources) {
    const payload = unwrapApiData(source);
    const statusList =
      payload?.GenerateWayBillResult?.Status ??
      payload?.generateWayBillResult?.Status ??
      payload?.Status ??
      null;

    if (Array.isArray(statusList) && statusList.length > 0) {
      return statusList
        .map((item) => item?.StatusInformation || item?.StatusCode)
        .filter(Boolean)
        .join(" | ");
    }

    const errorSummary = buildErrorSummary(payload);

    if (errorSummary) {
      return errorSummary;
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
  const order =
    payload?.order ??
    (payload?.orderId || payload?.orderNumber ? payload : null);
  const shipment =
    payload?.shipment ??
    payload?.shipment_details ??
    payload?.shipmentResponse ??
    payload?.shipping_response ??
    null;
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
