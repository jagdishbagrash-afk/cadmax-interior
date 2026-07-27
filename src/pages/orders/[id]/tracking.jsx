import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/pages/common/Layout";
import Listing from "@/pages/api/Listing";
import TrackingStatusView from "@/components/TrackingStatusView";
import {
  extractTrackingPending,
  unwrapApiData,
  buildTransitDisplay,
  formatTransitDate,
} from "@/components/shipmentUtils";

function getQueryValue(value) {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
}

export default function OrderTrackingPage() {
  const router = useRouter();
  const [shipmentData, setShipmentData] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [transitTimeResponse, setTransitTimeResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const orderId = useMemo(
    () => getQueryValue(router.query.id),
    [router.query.id]
  );

  const fetchTracking = async (activeOrderId, options = {}) => {
    const targetOrderId = activeOrderId || orderId;
    const shouldRefresh = Boolean(options.refresh);

    if (!router.isReady || !targetOrderId) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const main = new Listing();
      if (shouldRefresh) {
        await main.RefreshOrderShipment(targetOrderId);
      }

      const [shipmentResponse, transitResponse] = await Promise.allSettled([
        main.GetOrderShipment(targetOrderId),
        main.GetTransitTimeByOrder(targetOrderId),
      ]);

      if (shipmentResponse.status === "fulfilled") {
        const shipmentPayload = unwrapApiData(shipmentResponse.value);
        const trackingPending = extractTrackingPending(shipmentPayload);

        setShipmentData(shipmentResponse.value);

        try {
          const trackingResponse = await main.GetOrderTracking(targetOrderId);
          setTrackingData(trackingResponse);
        } catch (trackingError) {
          if (!trackingPending) {
            setTrackingData(null);
          }
        }
      } else {
        throw shipmentResponse.reason;
      }

      if (transitResponse.status === "fulfilled") {
        setTransitTimeResponse(transitResponse.value);
      } else {
        console.error(
          "ORDER TRANSIT TIME FETCH ERROR:",
          transitResponse.reason?.response?.data || transitResponse.reason?.message
        );
        setTransitTimeResponse(null);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to fetch tracking details for this order."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!router.isReady || !orderId) {
      return;
    }

    let isMounted = true;

    const fetchInitialTracking = async () => {
      try {
        setLoading(true);
        setError("");

        const main = new Listing();

        const [shipmentResponse, transitResponse] = await Promise.allSettled([
          main.GetOrderShipment(orderId),
          main.GetTransitTimeByOrder(orderId),
        ]);

        let trackingPending = false;

        if (shipmentResponse.status === "fulfilled") {
          const shipmentPayload = unwrapApiData(shipmentResponse.value);
          trackingPending = extractTrackingPending(shipmentPayload);

          if (isMounted) {
            setShipmentData(shipmentResponse.value);
          }

          try {
            const trackingResp = await main.GetOrderTracking(orderId);
            if (isMounted) {
              setTrackingData(trackingResp);
            }
          } catch (trackingError) {
            if (isMounted && !trackingPending) {
              setTrackingData(null);
            }
          }
        } else if (isMounted) {
          throw shipmentResponse.reason;
        }

        if (transitResponse.status === "fulfilled" && isMounted) {
          setTransitTimeResponse(transitResponse.value);
        } else if (isMounted) {
          console.error(
            "ORDER TRANSIT TIME FETCH ERROR:",
            transitResponse.reason?.response?.data || transitResponse.reason?.message
          );
          setTransitTimeResponse(null);
        }
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(
          err?.response?.data?.message ||
            "Unable to fetch tracking details for this order."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInitialTracking();

    return () => {
      isMounted = false;
    };
  }, [orderId, router.isReady]);

  const etaDisplay = (() => {
    const display = buildTransitDisplay(transitTimeResponse);
    const deliveryFormatted = formatTransitDate(display.deliveryDate);
    const podFormatted = formatTransitDate(display.podDate);

    return {
      ...display,
      deliveryFormatted,
      podFormatted,
      deliveryByLabel:
        deliveryFormatted && !display.isError
          ? `Delivery by ${deliveryFormatted}`
          : "",
      podLabel:
        podFormatted && !display.isError
          ? `POD expected ${podFormatted}`
          : "",
      cutoffLabel: display.isAfterCutoff
        ? "Pickup scheduled next business day"
        : "",
      hasValidData: Boolean(
        transitTimeResponse &&
          !display.isError &&
          (deliveryFormatted || display.destinationCity)
      ),
    };
  })();

  return (
    <Layout>
      <TrackingStatusView
        title={`Track Order ${orderId || ""}`.trim()}
        description="This view uses the authenticated order tracking endpoint to fetch the latest shipment updates."
        responseData={shipmentData}
        trackingResponseData={trackingData}
        transitTimeResponse={transitTimeResponse}
        etaDisplay={etaDisplay}
        loading={loading}
        error={error}
        backHref="/orders"
        orderId={orderId}
        onRefresh={() => fetchTracking(orderId, { refresh: true })}
      />
    </Layout>
  );
}
