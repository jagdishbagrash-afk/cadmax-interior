import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/pages/common/Layout";
import ShipmentLabelPreview from "@/components/shipping-label/ShipmentLabelPreview";
import Listing from "@/pages/api/Listing";
import { unwrapApiData } from "@/components/shipmentUtils";

function getQueryValue(value) {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
}

function normalizeShipmentDetailsResponse(payload) {
  console.log("[normalizeShipmentDetailsResponse] full payload:", payload);
  
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const preferNonEmpty = (value, fallback) => {
    if (value === undefined || value === null) {
      return fallback;
    }

    if (typeof value === "string") {
      const normalized = value.trim();
      return normalized ? normalized : fallback;
    }

    return value;
  };

  const order = payload.order && typeof payload.order === "object"
    ? payload.order
    : payload;
  const labelData =
    order?.labelData && typeof order.labelData === "object"
      ? order.labelData
      : payload?.labelData && typeof payload.labelData === "object"
        ? payload.labelData
        : {};
  const shipmentResponse =
    payload?.shipment ||
    payload?.shipmentResponse ||
    order?.shipmentResponse ||
    null;
  const generateResult =
    shipmentResponse?.GenerateWayBillResult ||
    shipmentResponse?.generateWayBillResult ||
    shipmentResponse?.shipmentResponse?.GenerateWayBillResult ||
    null;
  const carrier = labelData?.carrier && typeof labelData.carrier === "object"
    ? labelData.carrier
    : {};
  const blueDart =
    carrier?.blueDart && typeof carrier.blueDart === "object"
      ? carrier.blueDart
      : {};
  const enrichedCarrier =
    carrier?.provider === "BLUE_DART"
      ? {
          ...carrier,
          blueDart: {
            ...blueDart,
            originArea: preferNonEmpty(blueDart.originArea, generateResult?.OriginArea),
            clusterCode: preferNonEmpty(blueDart.clusterCode, generateResult?.ClusterCode),
            destinationArea: preferNonEmpty(
              blueDart.destinationArea,
              generateResult?.DestinationArea
            ),
            destinationLocation: preferNonEmpty(
              blueDart.destinationLocation,
              generateResult?.DestinationLocation
            ),
          },
        }
      : carrier;
  const enrichedLabelData =
    enrichedCarrier && Object.keys(enrichedCarrier).length
      ? { ...labelData, carrier: enrichedCarrier }
      : labelData;

  return {
    orderId: order?.orderId || payload?.orderId || "",
    orderNumber: order?.orderNumber || payload?.orderNumber || "",
    paymentId: order?.paymentId || payload?.paymentId || "",
    paymentMethod: order?.paymentMethod || payload?.paymentMethod || order?.payment_mode || payload?.payment_mode || "",
    shippingStatus: order?.shippingStatus || payload?.shippingStatus || "",
    courierName: order?.courierName || payload?.courierName || "",
    trackingNumber:
      payload?.trackingNumber || order?.trackingNumber || "",
    labelData: enrichedLabelData,
    shipmentResponse,
  };
}

function hasNormalizedLabelData(payload) {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const labelData = payload.labelData || {};

  return Boolean(
    payload.trackingNumber ||
      payload.orderNumber ||
      payload.courierName ||
      labelData.bookingDate ||
      labelData.serviceType ||
      labelData.shipTo?.fullAddress ||
      labelData.shipFrom?.fullAddress ||
      (Array.isArray(labelData.items) && labelData.items.length > 0)
  );
}

export default function ShipmentLabelPreviewPage() {
  const router = useRouter();
  const [shipmentData, setShipmentData] = useState(null);
  const [loading, setLoading] = useState(false);

  const orderId = useMemo(
    () => getQueryValue(router.query.orderId),
    [router.query.orderId]
  );

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    let isMounted = true;

    const hydrateLabelData = async () => {
      const storedState =
        typeof window !== "undefined"
          ? sessionStorage.getItem("latestShipmentState")
          : null;

      if (storedState) {
        try {
          const parsedState = JSON.parse(storedState);
          const matchesOrder = !orderId || parsedState?.orderId === orderId;
          const normalizedStoredState = normalizeShipmentDetailsResponse(
            parsedState
          );

          if (
            matchesOrder &&
            hasNormalizedLabelData(normalizedStoredState) &&
            isMounted
          ) {
            setShipmentData(normalizedStoredState);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error("Failed to read shipment label state", error);
        }
      }

      if (!orderId) {
        if (isMounted) {
          setShipmentData(null);
        }
        return;
      }

      try {
        setLoading(true);
        const main = new Listing();
        const response = await main.GetOrderShipment(orderId);
        const nextShipmentData = normalizeShipmentDetailsResponse(
          unwrapApiData(response)
        );

        if (!isMounted) {
          return;
        }

        setShipmentData(nextShipmentData);
      } catch (error) {
        console.error("Failed to fetch shipment label data", error);
        if (isMounted) {
          setShipmentData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    hydrateLabelData();

    return () => {
      isMounted = false;
    };
  }, [orderId, router.isReady]);

  return (
    <Layout>
      <ShipmentLabelPreview
        data={shipmentData}
        loading={loading}
        title="Shipment Label Preview"
        description="Compact courier slip preview for print. This page renders the normalized shipment label data returned by the shipment details API."
      />
    </Layout>
  );
}
