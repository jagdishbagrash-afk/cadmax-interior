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

export function extractLiveTracking(...sources) {
  for (const source of sources) {
    const payload = unwrapApiData(source);
    const value =
      payload?.liveTracking ??
      payload?.tracking ??
      payload?.trackingDetails ??
      payload?.shipment?.liveTracking ??
      payload?.order?.liveTracking ??
      null;

    if (value && typeof value === "object") {
      return value;
    }
  }

  return {};
}

export function extractTrackingPending(...sources) {
  for (const source of sources) {
    const payload = unwrapApiData(source);
    const value =
      payload?.trackingPending ??
      payload?.shipment?.trackingPending ??
      payload?.order?.trackingPending ??
      payload?.liveTracking?.trackingPending ??
      false;

    if (value === true) {
      return true;
    }
  }

  return false;
}

export function extractEstimatedDelivery(...sources) {
  for (const source of sources) {
    const payload = unwrapApiData(source);
    const value =
      payload?.estimatedDelivery ??
      payload?.shipment?.estimatedDelivery ??
      payload?.order?.estimatedDelivery ??
      payload?.liveTracking?.estimatedDelivery ??
      payload?.tracking?.estimatedDelivery ??
      null;

    if (value) {
      return value;
    }
  }

  return "";
}

export function extractTransitEstimate(...sources) {
  for (const source of sources) {
    const payload = unwrapApiData(source);
    const rawValue =
      payload?.transitEstimate ??
      payload?.shipment?.transitEstimate ??
      payload?.order?.transitEstimate ??
      payload?.GetDomesticTransitTimeForPinCodeandProductResult ??
      payload?.tracking?.transitEstimate ??
      null;

    if (rawValue && typeof rawValue === "object") {
      return {
        originCity:
          rawValue.originCity ??
          rawValue.CityDesc_Origin ??
          rawValue.cityDescOrigin ??
          "",
        destinationCity:
          rawValue.destinationCity ??
          rawValue.CityDesc_Destination ??
          rawValue.cityDescDestination ??
          "",
        serviceCenter:
          rawValue.serviceCenter ??
          rawValue.ServiceCenter ??
          "",
        estimatedDelivery:
          rawValue.estimatedDelivery ??
          rawValue.ExpectedDateDelivery ??
          "",
        estimatedPod:
          rawValue.expectedDatePod ??
          rawValue.ExpectedDatePOD ??
          "",
        area: rawValue.area ?? rawValue.Area ?? "",
        raw: rawValue,
      };
    }
  }

  return {
    originCity: "",
    destinationCity: "",
    serviceCenter: "",
    estimatedDelivery: "",
    estimatedPod: "",
    area: "",
    raw: null,
  };
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

export function extractCutoffInfo(...sources) {
  for (const source of sources) {
    const payload = unwrapApiData(source);
    const value =
      payload?.meta?.cutoff ??
      payload?.cutoff ??
      payload?.shipment?.meta?.cutoff ??
      payload?.order?.meta?.cutoff ??
      null;

    if (value && typeof value === "object") {
      return {
        rule: value.rule ?? "",
        isAfterCutoff: Boolean(value.isAfterCutoff),
        baseDateIso: value.baseDateIso ?? "",
        resolvedPickupDateIso: value.resolvedPickupDateIso ?? "",
      };
    }
  }

  return {
    rule: "",
    isAfterCutoff: false,
    baseDateIso: "",
    resolvedPickupDateIso: "",
  };
}

export function extractTransitError(...sources) {
  for (const source of sources) {
    const payload = unwrapApiData(source);
    const bdResult =
      payload?.GetDomesticTransitTimeForPinCodeandProductResult ??
      payload?.shipment?.GetDomesticTransitTimeForPinCodeandProductResult ??
      payload?.order?.GetDomesticTransitTimeForPinCodeandProductResult ??
      null;

    if (bdResult && bdResult.IsError === true) {
      return {
        hasError: true,
        message: bdResult.ErrorMessage || "Unable to estimate delivery time",
      };
    }
  }

  return { hasError: false, message: "" };
}

export function buildTransitDisplay(transitTimeResponse) {
  const payload = unwrapApiData(transitTimeResponse);
  const bdResult =
    payload?.GetDomesticTransitTimeForPinCodeandProductResult ?? {};
  const transitEstimate = payload?.transitEstimate ?? {};

  const transitError = extractTransitError(transitTimeResponse || {});
  const cutoffInfo = extractCutoffInfo(transitTimeResponse || {});
  const estimate = extractTransitEstimate(transitTimeResponse || {});

  const rawDeliveryDate =
    payload?.expectedDateDelivery ||
    bdResult.ExpectedDateDelivery ||
    transitEstimate.estimatedDelivery ||
    estimate.estimatedDelivery;

  const rawPodDate =
    payload?.expectedDatePOD ||
    bdResult.ExpectedDatePOD ||
    transitEstimate.estimatedPod ||
    estimate.estimatedPod;

  const deliveryDate = rawDeliveryDate || "";
  const podDate = rawPodDate || "";

  const originCity =
    estimate.originCity ||
    bdResult.CityDesc_Origin ||
    transitEstimate.originCity ||
    "";
  const destinationCity =
    estimate.destinationCity ||
    bdResult.CityDesc_Destination ||
    transitEstimate.destinationCity ||
    "";
  const serviceCenter =
    estimate.serviceCenter ||
    bdResult.ServiceCenter ||
    transitEstimate.serviceCenter ||
    "";
  const area = estimate.area || bdResult.Area || transitEstimate.area || "";

  return {
    deliveryDate,
    podDate,
    originCity,
    destinationCity,
    serviceCenter,
    area,
    isError: transitError.hasError,
    errorMessage: transitError.message,
    isAfterCutoff: cutoffInfo.isAfterCutoff,
    cutoffRule: cutoffInfo.rule,
    cutoffBaseDateIso: cutoffInfo.baseDateIso,
    cutoffResolvedPickupDateIso: cutoffInfo.resolvedPickupDateIso,
    rawPayload: payload,
  };
}

export function formatTransitDate(value) {
  if (!value) {
    return "";
  }

  const str = String(value).trim();

  if (/\d{2}-[A-Z]{3}-\d{2}/i.test(str)) {
    const parts = str.split("-");
    if (parts.length === 3) {
      const day = parts[0];
      const monthRaw = parts[1].toLowerCase();
      const yearSuffix = parts[2];
      const months = {
        jan: "Jan", feb: "Feb", mar: "Mar", apr: "Apr", may: "May", jun: "Jun",
        jul: "Jul", aug: "Aug", sep: "Sep", oct: "Oct", nov: "Nov", dec: "Dec",
      };
      const month = months[monthRaw] || monthRaw;
      const yearPrefix =
        Number(yearSuffix) <= 50 ? "20" : "19";
      return `${day} ${month} ${yearPrefix}${yearSuffix}`;
    }
  }

  try {
    const date = new Date(str);
    if (!Number.isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, "0");
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    }
  } catch (_) {
    // fall through
  }

  return str;
}

export function parseTransitDate(value) {
  if (!value) {
    return null;
  }

  const str = String(value).trim();

  if (/\d{2}-[A-Z]{3}-\d{2}/i.test(str)) {
    const parts = str.split("-");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const monthRaw = parts[1].toLowerCase();
      const yearSuffix = parts[2];
      const months = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
        jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
      };
      const monthIdx = months[monthRaw];
      if (monthIdx === undefined || Number.isNaN(day)) {
        return null;
      }
      const yearPrefix =
        Number(yearSuffix) <= 50 ? 2000 : 1900;
      const year = yearPrefix + Number(yearSuffix);
      return new Date(year, monthIdx, day);
    }
  }

  try {
    const date = new Date(str);
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  } catch (_) {
    // fall through
  }

  return null;
}

function formatDateParts(date) {
  if (!date || Number.isNaN(date.getTime())) {
    return null;
  }
  const day = date.getDate();
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return { day, month, year };
}

export function buildDeliveryDateRange(deliveryDateRaw, podDateRaw) {
  const deliveryDate = parseTransitDate(deliveryDateRaw);
  const podDate = parseTransitDate(podDateRaw);

  if (!deliveryDate) {
    const fallback = formatTransitDate(deliveryDateRaw);
    return fallback || "—";
  }

  let startDate = deliveryDate;
  let endDate = deliveryDate;

  if (podDate && Math.abs(podDate - deliveryDate) >= 86400000) {
    endDate = podDate;
    if (podDate < deliveryDate) {
      startDate = podDate;
      endDate = deliveryDate;
    }
  } else {
    const start = new Date(deliveryDate);
    start.setDate(start.getDate() - 1);
    const end = new Date(deliveryDate);
    end.setDate(end.getDate() + 1);
    startDate = start;
    endDate = end;
  }

  const startParts = formatDateParts(startDate);
  const endParts = formatDateParts(endDate);

  if (!startParts || !endParts) {
    return formatTransitDate(deliveryDateRaw) || "—";
  }

  if (
    startParts.year === endParts.year &&
    startParts.month === endParts.month &&
    startParts.day === endParts.day
  ) {
    return `${startParts.day} ${startParts.month} ${startParts.year}`;
  }

  if (startParts.year === endParts.year && startParts.month === endParts.month) {
    return `${startParts.day} ${startParts.month} – ${endParts.day} ${endParts.month} ${endParts.year}`;
  }

  if (startParts.year === endParts.year) {
    return `${startParts.day} ${startParts.month} – ${endParts.day} ${endParts.month} ${endParts.year}`;
  }

  return `${startParts.day} ${startParts.month} ${startParts.year} – ${endParts.day} ${endParts.month} ${endParts.year}`;
}
