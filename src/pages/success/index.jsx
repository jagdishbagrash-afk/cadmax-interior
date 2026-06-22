import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaCheckCircle } from "react-icons/fa";
import Listing from "../api/Listing";
import ShipmentCard from "@/components/ShipmentCard";
import {
  extractCarrier,
  extractOrderAndShipment,
} from "@/components/shipmentUtils";

function getQueryValue(value) {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
}

export default function Index() {
  const router = useRouter();
  const [shipmentData, setShipmentData] = useState({
    order: null,
    shipment: null,
    trackingNumber: "",
  });
  const [loading, setLoading] = useState(true);

  const orderId = useMemo(
    () => getQueryValue(router.query.orderId),
    [router.query.orderId]
  );
  const trackingNumber = useMemo(
    () => getQueryValue(router.query.trackingNumber),
    [router.query.trackingNumber]
  );

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    let isMounted = true;

    const hydrateShipmentState = async () => {
      const storedState =
        typeof window !== "undefined"
          ? sessionStorage.getItem("latestShipmentState")
          : null;

      if (storedState) {
        try {
          const parsedState = JSON.parse(storedState);
          const matchesOrder = !orderId || parsedState?.orderId === orderId;
          const matchesTracking =
            !trackingNumber ||
            parsedState?.trackingNumber === trackingNumber;

          if (matchesOrder && matchesTracking && isMounted) {
            setShipmentData({
              order: parsedState?.order || null,
              shipment: parsedState?.shipment || null,
              trackingNumber:
                parsedState?.trackingNumber || trackingNumber,
            });
            setLoading(false);
          }
        } catch (error) {
          console.error("Failed to read shipment state", error);
        }
      }

      if (!orderId) {
        if (isMounted) {
          setLoading(false);
        }
        return;
      }

      try {
        const main = new Listing();
        const response = await main.GetOrderShipment(orderId);
        const { order, shipment, trackingNumber: responseTracking } =
          extractOrderAndShipment(response);

        if (!isMounted) {
          return;
        }

        setShipmentData({
          order,
          shipment,
          trackingNumber: responseTracking || trackingNumber,
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setShipmentData((prev) => ({
          ...prev,
          trackingNumber: prev.trackingNumber || trackingNumber,
        }));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    hydrateShipmentState();

    return () => {
      isMounted = false;
    };
  }, [orderId, router.isReady, trackingNumber]);

  const trackingHref = shipmentData.trackingNumber
    ? (() => {
        const courier = extractCarrier(
          shipmentData.shipment,
          shipmentData.order
        );
        const query = courier
          ? `?courier=${encodeURIComponent(courier)}`
          : "";

        return `/shipment/track/${encodeURIComponent(
          shipmentData.trackingNumber
        )}${query}`;
      })()
    : orderId
      ? `/orders/${orderId}/tracking`
      : "";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-sm md:p-10">
        <div className="text-center">
          <FaCheckCircle className="mx-auto mb-6 h-20 w-20 text-green-600" />
          <h2 className="text-3xl font-bold text-black md:text-4xl">
            Order Placed Successfully
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 md:text-base">
            Razorpay payment is verified and the shipment request is created.
            Use the tracking details below to follow delivery progress.
          </p>
        </div>

        <ShipmentCard
          title="Shipment Created"
          order={shipmentData.order}
          shipment={shipmentData.shipment}
          loading={loading}
          trackingHref={trackingHref}
          emptyMessage="Shipment details will appear here once the carrier accepts the request."
        />

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="rounded-full bg-black px-6 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Go to Home
          </Link>

          <Link
            href="/orders"
            className="rounded-full border border-black px-6 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
          >
            View Orders
          </Link>

          {trackingHref ? (
            <Link
              href={trackingHref}
              className="rounded-full border border-green-700 px-6 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-700 hover:text-white"
            >
              Track Shipment
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
