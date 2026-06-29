export const COMPANY_FOOTER_ADDRESS =
  "Ashish Vihar, RBI Colony, Vidhyadhar Nagar, Railway Colony, Jagatpura, Jaipur, Rajasthan 302017";

export function getDisplayValue(value, fallback = "N/A") {
  if (value === undefined || value === null) {
    return fallback;
  }

  const normalizedValue = String(value).trim();

  return normalizedValue ? normalizedValue : fallback;
}

export function formatDisplayDate(value) {
  if (!value) {
    return "N/A";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return getDisplayValue(value);
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

export function formatCurrency(value, currency = "INR") {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "N/A";
  }

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (error) {
    return `${value.toFixed(2)} ${getDisplayValue(currency, "INR")}`;
  }
}

export function formatDimensions(packageDetails) {
  if (!packageDetails) {
    return "N/A";
  }

  const { lengthCm, widthCm, heightCm } = packageDetails;
  const values = [lengthCm, widthCm, heightCm];

  if (values.some((value) => typeof value !== "number" || Number.isNaN(value))) {
    return "N/A";
  }

  return `${lengthCm} x ${widthCm} x ${heightCm} cm`;
}

export function formatWeight(weightKg) {
  if (typeof weightKg !== "number" || Number.isNaN(weightKg)) {
    return "N/A";
  }

  return `${weightKg} kg`;
}

export function formatFullAddress(address) {
  if (!address) {
    return "N/A";
  }

  const parts = [
    address.addressLine1,
    address.addressLine2,
    [address.city, address.state].filter(Boolean).join(", "),
    [address.pincode, address.country].filter(Boolean).join(", "),
  ]
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter(Boolean);

  return parts.length ? parts.join(", ") : "N/A";
}

export function formatContactLine(address) {
  if (!address) {
    return "N/A";
  }

  const parts = [address.name, address.phone]
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter(Boolean);

  return parts.length ? parts.join(" | ") : "N/A";
}

export function getCodHeading(payment) {
  if (!payment?.isCod) {
    return null;
  }

  const amount = formatCurrency(payment?.codAmount, payment?.currency || "INR");

  if (amount === "N/A") {
    return "COLLECT CASH OF N/A INR";
  }

  return `COLLECT CASH OF ${amount.replace(/\s?INR$/, "").trim()} INR`;
}

export function getItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  return items.map((item, index) => ({
    id: `${item?.sku || item?.name || "item"}-${index}`,
    sku: getDisplayValue(item?.sku),
    name: getDisplayValue(item?.name),
    quantity:
      typeof item?.quantity === "number" && !Number.isNaN(item.quantity)
        ? item.quantity
        : "N/A",
  }));
}
