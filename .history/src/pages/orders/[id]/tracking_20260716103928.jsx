import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/pages/common/Layout";
import Listing from "@/pages/api/Listing";
import TrackingStatusView from "@/components/TrackingStatusView";

function getQueryValue(value) {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
}

export default function OrderTrackingPage() {
  const router = useRouter();
  const [shipmentData, setShipmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const orderId = useMemo(
    () => getQueryValue(router.query.id),
    [router.query.id]
  );

  useEffect(() => {
    if (!router.isReady || !orderId) {
      return;
    }

    let isMounted = true;

    const fetchTracking = async () => {
      try {
        setLoading(true);
        setError("");

        const main = new Listing();
        const response = await main.GetOrderShipment(orderId);

        if (!isMounted) {
          return;
        }

        setShipmentData(response);
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

    fetchTracking();

    return () => {
      isMounted = false;
    };
  }, [orderId, router.isReady]);

  return (
    <Layout>
      <TrackingStatusView
        title={`Track Order ${orderId || ""}`.trim()}
        description="This view uses the authenticated order tracking endpoint to fetch the latest shipment updates."
        responseData={shipmentData}
        loading={loading}
        error={error}
        backHref="/orders"
        orderId={orderId}
      />
    </Layout>
  );
}
