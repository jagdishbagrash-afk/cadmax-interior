import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/pages/common/Layout";
import ShipmentLabelPreview from "@/components/shipping-label/ShipmentLabelPreview";
import { mockShippingLabelData } from "@/components/shipping-label/mockShippingLabelData";
import { mapShipmentStateToLabelData } from "@/components/shipping-label/mapShipmentStateToLabelData";
import Listing from "@/pages/api/Listing";
import { extractOrderAndShipment, unwrapApiData } from "@/components/shipmentUtils";

function getQueryValue(value) {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
}

export default function ShipmentLabelPreviewPage() {
  const router = useRouter();
  const [labelData, setLabelData] = useState(mockShippingLabelData);
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
      const resolveShipToAddress = async (addressId) => {
        if (!addressId) {
          return null;
        }

        try {
          const main = new Listing();
          const addressResponse = await main.AddressList();
          const addresses = addressResponse?.data?.data?.addresses;

          if (!Array.isArray(addresses)) {
            return null;
          }

          return addresses.find((item) => item?._id === addressId) || null;
        } catch (error) {
          return null;
        }
      };

      const storedState =
        typeof window !== "undefined"
          ? sessionStorage.getItem("latestShipmentState")
          : null;

      if (storedState) {
        try {
          const parsedState = JSON.parse(storedState);

          if (!orderId || parsedState?.orderId === orderId) {
            const shipToAddress = await resolveShipToAddress(
              parsedState?.order?.addressId
            );
            const mappedData = mapShipmentStateToLabelData({
              ...parsedState,
              shipToAddress,
            });

            if (isMounted && mappedData?.trackingNumber) {
              setLabelData(mappedData);
            }
          }
        } catch (error) {
          console.error("Failed to read latest shipment state for label", error);
        }
      }

      if (!orderId) {
        return;
      }

      try {
        setLoading(true);
        const main = new Listing();
        const response = await main.GetOrderShipment(orderId);
        const { order, shipment, trackingNumber } = extractOrderAndShipment(
          unwrapApiData(response)
        );
        const shipToAddress = await resolveShipToAddress(order?.addressId);
        const mappedData = mapShipmentStateToLabelData({
          order,
          shipment,
          trackingNumber,
          shipToAddress,
        });

        if (!isMounted) {
          return;
        }

        setLabelData(mappedData);
      } catch (error) {
        console.error("Failed to fetch shipment label data", error);
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
        data={labelData}
        loading={loading}
        title="Shipment Label Preview"
        description="Compact courier slip preview for print. When opened from an order, this page uses the latest shipment data from API or session state."
      />
    </Layout>
  );
}
