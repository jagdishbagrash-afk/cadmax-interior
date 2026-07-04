export const COMPANY_FOOTER_ADDRESS =
  "Ashish Vihar, RBI Colony, Vidhyadhar Nagar, Railway Colony, Jagatpura, Jaipur, Rajasthan 302017";

export function safeText(value) {
  if (value === undefined || value === null) {
    return "";
  }

  const normalizedValue = String(value).trim();

  if (!normalizedValue) {
    return "";
  }

  const lowerValue = normalizedValue.toLowerCase();

  if (lowerValue === "null" || lowerValue === "undefined" || lowerValue === "n/a") {
    return "";
  }

  return normalizedValue;
}

export function safeNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalizedValue = value.replace(/,/g, "").trim();

    if (!normalizedValue) {
      return 0;
    }

    const parsedValue = Number.parseFloat(normalizedValue);

    return Number.isFinite(parsedValue) ? parsedValue : 0;
  }

  return 0;
}

export function safeBool(value) {
  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return "";
    }

    return value === 0 ? "No" : "Yes";
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();

    if (!normalizedValue) {
      return "";
    }

    if (["true", "yes", "y", "1"].includes(normalizedValue)) {
      return "Yes";
    }

    if (["false", "no", "n", "0"].includes(normalizedValue)) {
      return "No";
    }

    return "";
  }

  return "";
}

export function hasVisibleValue(value) {
  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  return safeText(value) !== "";
}

export function getDisplayValue(value, fallback = "") {
  const normalizedValue = safeText(value);

  return normalizedValue || fallback;
}

export function formatDisplayDate(value) {
  const normalizedValue = safeText(value);

  if (!normalizedValue) {
    return "";
  }

  const parsedDate = new Date(normalizedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return normalizedValue;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

export function formatCurrency(value, currency = "INR") {
  if (!hasVisibleValue(value)) {
    return "";
  }

  const normalizedCurrency = safeText(currency) || "INR";
  const amount = safeNumber(value);

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: normalizedCurrency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    return `${amount.toFixed(2)} ${normalizedCurrency}`;
  }
}

export function joinAddressLines(...lines) {
  return lines
    .map((line) => safeText(line))
    .filter(Boolean)
    .join(", ");
}

export function formatDimensions(dimensionsCm) {
  if (!dimensionsCm || typeof dimensionsCm !== "object") {
    return "";
  }

  const length =
    dimensionsCm.length ?? dimensionsCm.lengthCm ?? dimensionsCm.l;
  const breadth =
    dimensionsCm.breadth ??
    dimensionsCm.width ??
    dimensionsCm.widthCm ??
    dimensionsCm.b;
  const height =
    dimensionsCm.height ?? dimensionsCm.heightCm ?? dimensionsCm.h;
  const values = [length, breadth, height];

  if (!values.some(hasVisibleValue)) {
    return "";
  }

  return values
    .map((value) => (hasVisibleValue(value) ? safeNumber(value) : ""))
    .join(" x ")
    .trim()
    ? `${values
        .map((value) => (hasVisibleValue(value) ? safeNumber(value) : ""))
        .join(" x ")} cm`
    : "";
}

export function formatWeight(weightKg) {
  if (!hasVisibleValue(weightKg)) {
    return "";
  }

  return `${safeNumber(weightKg)} kg`;
}

export function formatFullAddress(address) {
  if (!address) {
    return "";
  }

  return (
    safeText(address.fullAddress) ||
    joinAddressLines(
      address.addressLine1,
      address.addressLine2,
      joinAddressLines(address.city, address.state),
      joinAddressLines(address.pincode, address.country)
    )
  );
}

export function formatContactLine(address) {
  if (!address) {
    return "";
  }

  return joinAddressLines(address.name, address.phone);
}

export function getCodHeading(payment) {
  if (!hasVisibleValue(payment?.codAmount)) {
    return "";
  }

  const amount = formatCurrency(payment?.codAmount, payment?.currency || "INR");

  return amount ? `COLLECT CASH OF ${amount}` : "";
}

export function getItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  return items.map((item, index) => ({
    id: `${safeText(item?.sku) || safeText(item?.description) || "item"}-${index}`,
    sku: safeText(item?.sku),
    name: safeText(item?.description ?? item?.name),
    quantity: hasVisibleValue(item?.quantity) ? safeNumber(item.quantity) : "",
  }));
}

export function hasRenderableShipmentLabelData(data) {
  if (!data || typeof data !== "object") {
    return false;
  }

  const labelData = data.labelData || {};
  const itemCount = Array.isArray(labelData.items) ? labelData.items.length : 0;

  return [
    data.courierName,
    data.trackingNumber,
    data.orderNumber,
    labelData.bookingDate,
    labelData.origin,
    labelData.destination,
    labelData.serviceType,
    labelData.shipTo?.name,
    labelData.shipTo?.fullAddress,
    labelData.shipFrom?.name,
    labelData.shipFrom?.fullAddress,
    labelData.payment?.orderValue,
    labelData.payment?.codAmount,
    labelData.package?.weightKg,
    itemCount > 0 ? itemCount : null,
  ].some(hasVisibleValue);
}
