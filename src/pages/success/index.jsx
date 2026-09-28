import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";
import { FiCreditCard } from "react-icons/fi";
import Listing from "../api/Listing";
import ShipmentCard from "@/components/ShipmentCard";
import {
  extractCarrier,
  extractOrderAndShipment,
  extractStatus,
  extractStatusInformation,
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
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
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

            if (parsedState?.paymentMethod === "COD") {
              setPaymentMethod("COD");
            }
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

        console.log("Success page raw shipment response", response);
        console.log("Success page parsed shipment state", {
          order,
          shipment,
          trackingNumber: responseTracking || trackingNumber,
        });

        if (!isMounted) {
          return;
        }

        setShipmentData({
          order,
          shipment,
          trackingNumber: responseTracking || trackingNumber,
        });

        if (order?.paymentMethod === "COD") {
          setPaymentMethod("COD");
        }
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

  useEffect(() => {
    if (!shipmentData.shipment && !shipmentData.trackingNumber) {
      return;
    }

    console.log("Success page shipment data", shipmentData);
  }, [shipmentData]);

  const shipmentStatus = extractStatus(
    shipmentData.shipment,
    shipmentData.order
  );
  const carrierResponse = extractStatusInformation(
    shipmentData.shipment,
    shipmentData.order,
    shipmentData.order?.shipping_response
  );
  const shipmentFailed =
    shipmentData.shipment?.success === false ||
    shipmentData.order?.shipping_status === "shipment_failed" ||
    /failed|unauthorized|error|denied/i.test(
      `${shipmentStatus || ""} ${carrierResponse || ""}`
    );
  const failureCode =
    shipmentData.shipment?.error?.status ??
    shipmentData.order?.shipping_response?.status ??
    null;
  const failureTitle =
    shipmentData.shipment?.error?.title ??
    shipmentData.order?.shipping_response?.title ??
    null;
  const debugPayload = {
    order: shipmentData.order,
    shipment: shipmentData.shipment,
    trackingNumber: shipmentData.trackingNumber,
  };

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
  const labelPreviewHref = orderId
    ? `/shipment/label-preview?orderId=${encodeURIComponent(orderId)}`
    : "/shipment/label-preview";

  const isCOD = paymentMethod === "COD";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-sm md:p-10">
        <div className="text-center">
          <FaCheckCircle className="mx-auto mb-6 h-20 w-20 text-green-600" />
          <h2 className="text-3xl font-bold text-black md:text-4xl">
            Order Placed Successfully
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 md:text-base">
            {isCOD
              ? "Your order has been placed. You can pay with cash when it arrives at your doorstep."
              : "Razorpay payment is verified and the shipment request is created."
            }
            Use the tracking details below to follow delivery progress.
          </p>
        </div>

        {/* Payment Method Card */}
        <div className={`mt-8 rounded-xl border-2 p-5 ${isCOD ? "border-amber-200 bg-amber-50" : "border-green-200 bg-green-50"}`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${isCOD ? "bg-amber-500" : "bg-green-500"}`}>
              {isCOD ? (
                <FaMoneyBillWave className="w-6 h-6 text-white" />
              ) : (
                <FiCreditCard className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Payment Method
              </p>
              <p className={`text-lg font-bold ${isCOD ? "text-amber-700" : "text-green-700"}`}>
                {isCOD ? "Cash on Delivery" : "Online Payment"}
              </p>
              <p className={`text-sm font-semibold ${isCOD ? "text-amber-600" : "text-green-600"}`}>
                {isCOD ? "Pay on Delivery" : "Payment Made Online"}
              </p>
            </div>
          </div>
        </div>

        {shipmentFailed ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-800">
              Shipment request failed at courier side
            </p>
            <p className="mt-2 text-sm text-red-700">
              {carrierResponse ||
                "The courier API rejected the shipment request, so no tracking number was generated yet."}
            </p>
            {failureTitle || failureCode ? (
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-red-700">
                {failureTitle || "Carrier Error"}
                {failureCode ? ` | Code ${failureCode}` : ""}
              </p>
            ) : null}
          </div>
        ) : null}

        <ShipmentCard
          title="Shipment Created"
          order={shipmentData.order}
          shipment={shipmentData.shipment}
          trackingNumber={shipmentData.trackingNumber}
          carrier={extractCarrier(shipmentData.shipment, shipmentData.order) || "BLUE_DART"}
          status={shipmentStatus}
          loading={loading}
          trackingHref={trackingHref}
          emptyMessage="Shipment details will appear here once the carrier accepts the request."
        />

        {/* <details className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 print:hidden">
          <summary className="cursor-pointer text-sm font-semibold text-gray-900">
            View shipment debug logs on page
          </summary>
          <pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-words text-xs text-gray-700">
            {JSON.stringify(debugPayload, null, 2)}
          </pre>
        </details> */}

        <div className="mt-8 flex flex-wrap justify-center gap-4 print:hidden">
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

          <Link
            href={labelPreviewHref}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-blue-700 px-6 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-700 hover:text-white"
          >
            Print Label
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