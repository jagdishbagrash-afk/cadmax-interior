import {
  extractCarrier,
  extractReferenceNumber,
  extractTrackingNumber,
} from "@/components/shipmentUtils";
import { COMPANY_FOOTER_ADDRESS } from "./shippingLabelUtils";

function normalizeToString(value) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
}

function getPincodeFromText(text) {
  const match = String(text || "").match(/\b\d{6}\b/);

  return match ? match[0] : "N/A";
}

function getCountryFromText(text) {
  return /india/i.test(String(text || "")) ? "India" : "N/A";
}

function parseAddressFromText(text) {
  const cleaned = normalizeToString(text);

  if (!cleaned) {
    return {
      streetAddress: "N/A",
      city: "N/A",
      state: "N/A",
      country: "N/A",
      pincode: "N/A",
    };
  }

  const parts = cleaned
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const pincode = getPincodeFromText(cleaned);
  const country = getCountryFromText(cleaned);
  const city = parts.length >= 2 ? parts[parts.length - 3] || "N/A" : "N/A";
  const state = parts.length >= 2 ? parts[parts.length - 2] || "N/A" : "N/A";
  const streetAddress = parts.slice(0, Math.max(parts.length - 2, 1)).join(", ");

  return {
    streetAddress: streetAddress || cleaned,
    city: normalizeToString(city) || "N/A",
    state: normalizeToString(state) || "N/A",
    country,
    pincode,
  };
}

function buildShipTo(order, addressRecord) {
  const fullAddress = normalizeToString(order?.address);
  const parsed = parseAddressFromText(fullAddress);

  const street =
    normalizeToString(addressRecord?.street_address) ||
    normalizeToString(addressRecord?.streetAddress) ||
    parsed.streetAddress;

  return {
    name: order?.name || "N/A",
    phone: order?.mobile || "N/A",
    addressLine1: street || "N/A",
    city: normalizeToString(addressRecord?.city) || parsed.city,
    state: normalizeToString(addressRecord?.state) || parsed.state,
    country: normalizeToString(addressRecord?.country) || parsed.country,
    pincode:
      normalizeToString(addressRecord?.pincode) ||
      normalizeToString(order?.pincode) ||
      parsed.pincode,
  };
}

function buildShipFrom() {
  return {
    name: "Dispatch Desk",
    companyName: "Cadmax Interior",
    phone: "N/A",
    addressLine1: COMPANY_FOOTER_ADDRESS,
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    pincode: "302017",
  };
}

function buildItems(order) {
  if (!Array.isArray(order?.product)) {
    return [];
  }

  return order.product.map((item, index) => ({
    sku:
      item?.sku ||
      item?.productSku ||
      item?.variant ||
      item?.variantTitle ||
      `ITEM-${index + 1}`,
    name:
      item?.name ||
      item?.title ||
      item?.product_name ||
      item?.productTitle ||
      "N/A",
    quantity:
      typeof item?.quantity === "number" && !Number.isNaN(item.quantity)
        ? item.quantity
        : 1,
  }));
}

export function mapShipmentStateToLabelData({
  order,
  shipment,
  trackingNumber,
  shipToAddress,
}) {
  const resolvedTrackingNumber =
    trackingNumber ||
    extractTrackingNumber(shipment, order) ||
    "";
  const courierName = extractCarrier(shipment, order) || order?.courier_name || "BLUE_DART";
  const parsedAmount = Number.parseFloat(order?.amount);
  const orderValue =
    typeof order?.amount === "number" && !Number.isNaN(order.amount)
      ? order.amount
      : Number.isFinite(parsedAmount)
        ? parsedAmount
        : undefined;
  const paymentMode = String(
    order?.paymentMode || order?.payment_mode || order?.paymentType || ""
  ).toUpperCase();
  const isCod =
    paymentMode.includes("COD") ||
    String(order?.courier_name || "").toUpperCase().includes("COD");

  return {
    trackingNumber: resolvedTrackingNumber,
    orderReferenceNumber:
      order?.orderId ||
      extractReferenceNumber(shipment, order) ||
      order?._id ||
      "N/A",
    bookingDate: order?.createdAt || order?.updatedAt || undefined,
    courierName,
    serviceType: isCod ? "Dart Plus COD" : "Standard Shipping",
    shipTo: buildShipTo(order, shipToAddress),
    shipFrom: buildShipFrom(),
    payment: {
      isCod,
      orderValue,
      codAmount: isCod ? orderValue : undefined,
      currency: "INR",
    },
    packageDetails: {
      weightKg: order?.weightKg,
      lengthCm: order?.lengthCm,
      widthCm: order?.widthCm,
      heightCm: order?.heightCm,
    },
    items: buildItems(order),
  };
}
