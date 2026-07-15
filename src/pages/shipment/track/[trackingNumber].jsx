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

export default function PublicTrackingPage() {
  const router = useRouter();
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const trackingNumber = useMemo(
    () => getQueryValue(router.query.trackingNumber),
    [router.query.trackingNumber]
  );
  const courier = useMemo(
    () => getQueryValue(router.query.courier),
    [router.query.courier]
  );

  useEffect(() => {
    if (!router.isReady || !trackingNumber) {
      return;
    }

    let isMounted = true;

    const fetchTracking = async () => {
      try {
        setLoading(true);
        setError("");

        const main = new Listing();
        const response = await main.GetPublicShipmentTracking(
          trackingNumber,
          courier || undefined
        );

        if (!isMounted) {
          return;
        }

        setTrackingData(response);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(
          err?.response?.data?.message ||
            "Unable to fetch public tracking details for this shipment."
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
  }, [courier, router.isReady, trackingNumber]);

  return (
    <Layout>
      <TrackingStatusView
        title={`Tracking ${trackingNumber || ""}`.trim()}
        description="This public tracking page uses the tracking number returned from payment verification."
        responseData={trackingData}
        loading={loading}
        error={error}
        backHref="/orders"
      />
    </Layout>
  );
}
