import {
  extractCarrier,
  extractReferenceNumber,
  extractTrackingNumber,
} from "@/components/shipmentUtils";
import { COMPANY_FOOTER_ADDRESS } from "./shippingLabelUtils";

const DEFAULT_SHIP_FROM = {
  name: "Dispatch Desk",
  companyName: "Cadmax Interior",
  phone: "N/A",
  addressLine1: COMPANY_FOOTER_ADDRESS,
  city: "Jaipur",
  state: "Rajasthan",
  country: "India",
  pincode: "302017",
};

function normalizeToString(value) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
}

function toNumber(value) {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.replace(/,/g, "").trim();

  if (!normalized) {
    return undefined;
  }

  const parsed = Number.parseFloat(normalized);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function getFirstNonEmpty(...values) {
  for (const value of values) {
    if (value === undefined || value === null) {
      continue;
    }

    if (typeof value === "string") {
      const normalized = value.trim();

      if (normalized) {
        return normalized;
      }

      continue;
    }

    return value;
  }

  return undefined;
}

function pickFirstValue(source, keys) {
  if (!source || typeof source !== "object") {
    return undefined;
  }

  for (const key of keys) {
    const value = source[key];

    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }

  const nestedCandidates = [
    source.GenerateWayBillResult,
    source.generateWayBillResult,
    source.shipmentResponse,
    source.shipmentRequest,
    source.requestPayload,
    source.requestBody,
    source.request,
    source.shipTo,
    source.shipFrom,
    source.shipper,
    source.consignee,
    source.address,
  ];

  for (const candidate of nestedCandidates) {
    const value = pickFirstValue(candidate, keys);

    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
}

function getPincodeFromText(text) {
  const match = String(text || "").match(/\b\d{6}\b/);

  return match ? match[0] : "N/A";
}

function getCountryFromText(text) {
  if (!text) {
    return "N/A";
  }

  if (/india/i.test(String(text))) {
    return "India";
  }

  if (/^\s*IN\s*$/i.test(String(text))) {
    return "India";
  }

  return "N/A";
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

function extractNestedProduct(item) {
  return (
    item?.product ||
    item?.productData ||
    item?.productDetails ||
    null
  );
}

function parseBlueDartDate(value) {
  if (!value) {
    return undefined;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value.toISOString();
  }

  const normalized = normalizeToString(value);
  const match = normalized.match(/\/Date\((\d+)(?:[+-]\d{4})?\)\//);

  if (match) {
    const timestamp = Number.parseInt(match[1], 10);

    if (Number.isFinite(timestamp)) {
      return new Date(timestamp).toISOString();
    }
  }

  const parsedDate = new Date(normalized);

  return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate.toISOString();
}

function parseDimensionsText(value) {
  const normalized = normalizeToString(value);

  if (!normalized) {
    return null;
  }

  const matches = normalized.match(/\d+(?:\.\d+)?/g);

  if (!matches || matches.length < 3) {
    return null;
  }

  const [lengthCm, widthCm, heightCm] = matches
    .slice(0, 3)
    .map((item) => Number.parseFloat(item));

  if ([lengthCm, widthCm, heightCm].some((item) => !Number.isFinite(item))) {
    return null;
  }

  return { lengthCm, widthCm, heightCm };
}

function buildShipTo(order, addressRecord) {
  const fullAddress = normalizeToString(
    getFirstNonEmpty(
      addressRecord?.street_address,
      addressRecord?.streetAddress,
      order?.address,
      order?.shippingAddress,
      order?.shipping_address,
      order?.deliveryAddress
    )
  );
  const parsed = parseAddressFromText(fullAddress);

  const street = getFirstNonEmpty(
    addressRecord?.street_address,
    addressRecord?.streetAddress,
    order?.addressLine1,
    order?.address1,
    parsed.streetAddress
  );
  const addressLine2 = getFirstNonEmpty(
    addressRecord?.address2,
    addressRecord?.addressLine2,
    order?.addressLine2,
    order?.address2
  );

  return {
    name:
      getFirstNonEmpty(
        order?.name,
        order?.customerName,
        order?.fullName,
        order?.shippingName
      ) || "N/A",
    phone:
      getFirstNonEmpty(
        order?.mobile,
        order?.phone,
        order?.contactNumber,
        order?.shippingPhone
      ) || "N/A",
    addressLine1: street || "N/A",
    addressLine2: addressLine2 || undefined,
    city:
      getFirstNonEmpty(addressRecord?.city, order?.city, order?.shippingCity) ||
      parsed.city,
    state:
      getFirstNonEmpty(
        addressRecord?.state,
        order?.state,
        order?.shippingState
      ) || parsed.state,
    country:
      getFirstNonEmpty(
        addressRecord?.country,
        order?.country,
        order?.shippingCountry
      ) || parsed.country,
    pincode:
      getFirstNonEmpty(
        addressRecord?.pincode,
        order?.pincode,
        order?.postalCode,
        order?.shippingPincode
      ) ||
      parsed.pincode,
  };
}

function buildShipFrom(order, shipment) {
  const shipperSource = getFirstNonEmpty(
    shipment?.shipmentRequest,
    shipment?.requestPayload,
    shipment?.requestBody,
    shipment?.request,
    order?.shipmentRequest,
    order?.shipper,
    shipment?.shipper,
    shipment?.shipFrom
  );

  const city = getFirstNonEmpty(
    pickFirstValue(shipperSource, ["city", "shipperCity", "originCity"]),
    DEFAULT_SHIP_FROM.city
  );
  const country = getFirstNonEmpty(
    getCountryFromText(
      pickFirstValue(shipperSource, [
        "country",
        "countryCode",
        "shipperCountry",
        "shipperCountryCode",
      ])
    ),
    DEFAULT_SHIP_FROM.country
  );

  return {
    name:
      getFirstNonEmpty(
        pickFirstValue(shipperSource, [
          "contactName",
          "name",
          "shipperName",
          "senderName",
        ]),
        DEFAULT_SHIP_FROM.name
      ) || DEFAULT_SHIP_FROM.name,
    companyName:
      getFirstNonEmpty(
        pickFirstValue(shipperSource, [
          "companyName",
          "shipperCompany",
          "sellerName",
          "name",
        ]),
        DEFAULT_SHIP_FROM.companyName
      ) || DEFAULT_SHIP_FROM.companyName,
    phone:
      getFirstNonEmpty(
        pickFirstValue(shipperSource, [
          "phone",
          "mobile",
          "telephone",
          "shipperPhone",
          "shipperMobile",
          "shipperTelephone",
        ]),
        DEFAULT_SHIP_FROM.phone
      ) || DEFAULT_SHIP_FROM.phone,
    addressLine1:
      getFirstNonEmpty(
        pickFirstValue(shipperSource, [
          "address1",
          "addressLine1",
          "street_address",
          "streetAddress",
          "shipperAddress1",
        ]),
        DEFAULT_SHIP_FROM.addressLine1
      ) || DEFAULT_SHIP_FROM.addressLine1,
    addressLine2: getFirstNonEmpty(
      pickFirstValue(shipperSource, [
        "address2",
        "addressLine2",
        "shipperAddress2",
      ]),
      undefined
    ),
    city,
    state:
      getFirstNonEmpty(
        pickFirstValue(shipperSource, ["state", "shipperState"]),
        DEFAULT_SHIP_FROM.state
      ) || DEFAULT_SHIP_FROM.state,
    country,
    pincode:
      getFirstNonEmpty(
        pickFirstValue(shipperSource, [
          "pincode",
          "postalCode",
          "zipCode",
          "shipperPincode",
        ]),
        DEFAULT_SHIP_FROM.pincode
      ) || DEFAULT_SHIP_FROM.pincode,
  };
}

function buildItems(order) {
  const items = order?.product || order?.products || order?.items;

  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item, index) => {
    const nestedProduct = extractNestedProduct(item);

    return {
      sku:
        getFirstNonEmpty(
          item?.sku,
          item?.productSku,
          item?.productId,
          item?.id,
          nestedProduct?._id,
          item?.variant,
          item?.variantTitle
        ) || `ITEM-${index + 1}`,
      name:
        getFirstNonEmpty(
          item?.name,
          item?.title,
          item?.product_name,
          item?.productTitle,
          item?.priceSectionTitle,
          nestedProduct?.title,
          nestedProduct?.name
        ) || "N/A",
      quantity: toNumber(item?.quantity) || 1,
    };
  });
}

function resolveOrderValue(order) {
  return getFirstNonEmpty(
    toNumber(order?.cod_amount),
    toNumber(order?.collectable_amount),
    toNumber(order?.amount),
    toNumber(order?.totalAmount),
    toNumber(order?.subtotal),
    toNumber(order?.total),
    toNumber(order?.final_amount),
    toNumber(order?.finalAmount)
  );
}

function resolveBookingDate(order, shipment) {
  return getFirstNonEmpty(
    parseBlueDartDate(
      pickFirstValue(shipment, [
        "ShipmentPickupDate",
        "pickupDate",
        "bookingDate",
        "createdAt",
      ])
    ),
    parseBlueDartDate(order?.createdAt),
    parseBlueDartDate(order?.updatedAt)
  );
}

function resolvePackageDetails(order, shipment) {
  const itemList = order?.product || order?.products || order?.items || [];
  const dimensionsFromText = parseDimensionsText(
    getFirstNonEmpty(
      order?.dimensions,
      pickFirstValue(shipment, ["dimensions", "packageDimensions"]),
      ...itemList.flatMap((item) => {
        const nestedProduct = extractNestedProduct(item);

        return [item?.dimensions, nestedProduct?.dimensions];
      })
    )
  );

  return {
    weightKg: getFirstNonEmpty(
      toNumber(order?.weightKg),
      toNumber(order?.weight),
      toNumber(pickFirstValue(shipment, ["weightKg", "weight", "pieceWeight"]))
    ),
    lengthCm: getFirstNonEmpty(
      toNumber(order?.lengthCm),
      toNumber(order?.length),
      dimensionsFromText?.lengthCm
    ),
    widthCm: getFirstNonEmpty(
      toNumber(order?.widthCm),
      toNumber(order?.width),
      toNumber(order?.breadthCm),
      toNumber(order?.breadth),
      dimensionsFromText?.widthCm
    ),
    heightCm: getFirstNonEmpty(
      toNumber(order?.heightCm),
      toNumber(order?.height),
      dimensionsFromText?.heightCm
    ),
  };
}

function buildRouteData(shipment, shipFrom, shipTo) {
  const originCode =
    getFirstNonEmpty(
      pickFirstValue(shipment, ["OriginArea", "originArea", "originCode"]),
      shipFrom?.city,
      shipFrom?.state,
      shipFrom?.pincode
    ) || "N/A";
  const destinationCode =
    getFirstNonEmpty(
      pickFirstValue(shipment, [
        "DestinationArea",
        "destinationArea",
        "DestinationLocation",
        "destinationLocation",
      ]),
      shipTo?.city,
      shipTo?.state,
      shipTo?.pincode
    ) || "N/A";

  return {
    originCode: String(originCode),
    destinationCode: String(destinationCode),
  };
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
  const shipTo = buildShipTo(order, shipToAddress);
  const shipFrom = buildShipFrom(order, shipment);
  const courierName =
    extractCarrier(shipment, order) ||
    order?.courier_name ||
    order?.courierName ||
    "BLUE_DART";
  const orderValue = resolveOrderValue(order);
  const paymentMode = String(
    order?.paymentMethod ||
      order?.PaymentMethod ||
      order?.payment_mode ||
      order?.paymentMode ||
      order?.paymentType ||
      order?.payment_type ||
      ""
  ).toUpperCase();
  const isCod =
    paymentMode.includes("COD") ||
    String(order?.courier_name || order?.courierName || "")
      .toUpperCase()
      .includes("COD");
  const route = buildRouteData(shipment, shipFrom, shipTo);
  const codAmount = isCod
    ? getFirstNonEmpty(
        toNumber(order?.cod_amount),
        toNumber(order?.collectable_amount),
        orderValue
      )
    : undefined;

  return {
    trackingNumber: resolvedTrackingNumber,
    orderReferenceNumber:
      order?.orderNumber ||
      order?.orderId ||
      extractReferenceNumber(shipment, order) ||
      order?._id ||
      "N/A",
    bookingDate: resolveBookingDate(order, shipment),
    courierName,
    serviceType: isCod ? "Dart Plus COD" : "Standard Shipping",
    shipTo,
    shipFrom,
    route,
    payment: {
      isCod,
      orderValue,
      codAmount,
      currency: "INR",
    },
    packageDetails: resolvePackageDetails(order, shipment),
    items: buildItems(order),
  };
}
