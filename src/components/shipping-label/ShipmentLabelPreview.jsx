import React, { useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import ShippingLabel from "./ShippingLabel";
import { exportShippingLabelPdf } from "./exportShippingLabelPdf";
import { getDisplayValue } from "./shippingLabelUtils";
import styles from "./ShippingLabel.module.css";

function buildExportFileName(trackingNumber) {
  const safeTrackingNumber = getDisplayValue(trackingNumber, "shipment-label")
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${safeTrackingNumber || "shipment-label"}.pdf`;
}

export default function ShipmentLabelPreview({
  data,
  loading = false,
  showPriceDefault = true,
  title = "Shipment Label Preview",
  description = "Preview the fixed-layout shipment label before printing or exporting it as PDF.",
  onPrint,
  onExportPdf,
}) {
  const labelRef = useRef(null);
  const [showPrice, setShowPrice] = useState(showPriceDefault);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const isReady = Boolean(data?.trackingNumber);
  const printTitle = useMemo(
    () => `shipping-label-${data?.trackingNumber || "preview"}`,
    [data?.trackingNumber]
  );
  const exportFileName = useMemo(
    () => buildExportFileName(data?.trackingNumber),
    [data?.trackingNumber]
  );

  const handlePrint = useReactToPrint({
    contentRef: labelRef,
    documentTitle: printTitle,
    pageStyle:
      "@page { size: A4 portrait; margin: 10mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }",
  });

  const onClickPrint = async () => {
    await handlePrint();

    if (typeof onPrint === "function") {
      onPrint();
    }
  };

  const onClickExportPdf = async () => {
    if (!labelRef.current || isExportingPdf) {
      return;
    }

    try {
      setIsExportingPdf(true);
      await exportShippingLabelPdf({
        element: labelRef.current,
        fileName: exportFileName,
      });

      if (typeof onExportPdf === "function") {
        onExportPdf();
      }
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <section className={styles.page}>
      <div className={styles.pageInner}>
        <div className={styles.metaCard}>
          <h2 className={styles.metaTitle}>{title}</h2>
          <p className={styles.metaText}>{description}</p>
        </div>

        {loading ? (
          <div className={styles.stateCard}>
            <h3 className={styles.stateTitle}>Loading Shipment Label</h3>
            <p className={styles.stateText}>
              Shipment data is loading. The label will render once the tracking
              number and shipment details are available.
            </p>
          </div>
        ) : null}

        {!loading && !isReady ? (
          <div className={styles.stateCard}>
            <h3 className={styles.stateTitle}>No Tracking Data Available</h3>
            <p className={styles.stateText}>
              Shipment label preview stays hidden until a tracking number is
              available from the API. Pass a populated `ShippingLabelData`
              object to render the final label.
            </p>
          </div>
        ) : null}

        {!loading && isReady ? (
          <div className={styles.previewPanel}>
            <div className={styles.toolbar}>
              <div className={styles.toolbarGroup}>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={showPrice}
                    onChange={(event) => setShowPrice(event.target.checked)}
                  />
                  Show price details
                </label>
              </div>

              <div className={styles.toolbarGroup}>
                <button
                  type="button"
                  className={`${styles.button} ${styles.buttonSecondary}`}
                  onClick={onClickPrint}
                >
                  Print
                </button>
                <button
                  type="button"
                  className={styles.button}
                  onClick={onClickExportPdf}
                  disabled={isExportingPdf}
                >
                  {isExportingPdf ? "Exporting..." : "Export PDF"}
                </button>
              </div>
            </div>

            <div className={styles.previewCanvas}>
              <ShippingLabel ref={labelRef} data={data} showPrice={showPrice} />
            </div>

            <p className={styles.previewHint}>
              API note: `trackingNumber`, address blocks, payment details,
              package details, and items should come from your shipment/order API
              once booking succeeds.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
