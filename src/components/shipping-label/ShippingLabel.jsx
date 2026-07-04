import React, { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import styles from "./ShippingLabel.module.css";
import {
  formatCurrency,
  formatDimensions,
  formatDisplayDate,
  formatFullAddress,
  formatWeight,
  getItems,
  hasVisibleValue,
  safeNumber,
  safeBool,
  safeText,
} from "./shippingLabelUtils";

function AddressSection({ title, name, address, phone }) {
  const addressLines = address ? [address] : [];

  return (
    <div className={styles.addressSection}>
      <p className={styles.sectionTitle}>{title}</p>
      {name ? <p className={styles.addressName}>{name}</p> : null}
      {addressLines.map((line, index) => (
        <p key={`${title}-${index}`} className={styles.addressLine}>
          {line}
        </p>
      ))}
      {phone ? <p className={styles.addressLine}>Phone: {phone}</p> : null}
    </div>
  );
}

function DetailMetric({ label, value }) {
  if (!value) {
    return null;
  }

  return (
    <div className={styles.metricCell}>
      <p className={styles.metricLabel}>{label}</p>
      <p className={styles.metricValue}>{value}</p>
    </div>
  );
}

function ItemsTable({ items }) {
  const normalizedItems = getItems(items);

  return (
    <table className={styles.itemsTable}>
      <thead>
        <tr>
          <th style={{ width: "12%" }}>S. No.</th>
          <th style={{ width: "24%" }}>Item SKU</th>
          <th>Item Description</th>
          <th style={{ width: "14%" }}>Quantity</th>
        </tr>
      </thead>
      <tbody>
        {normalizedItems.map((item, index) => (
          <tr key={item.id}>
            <td>{index + 1}</td>
            <td>{item.sku}</td>
            <td>{item.name}</td>
            <td>{item.quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function shouldRenderMetaValue(value, alwaysShow = false) {
  if (alwaysShow) {
    return true;
  }

  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) && value !== 0;
  }

  if (typeof value === "string") {
    const normalized = value.trim();

    return Boolean(normalized) && normalized !== "0";
  }

  return false;
}

function BlueDartMetaTable({ rows }) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }

  return (
    <div className={styles.carrierMetaSection}>
      <p className={styles.carrierMetaTitle}>BLUE DART META</p>
      <table className={styles.carrierMetaTable}>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td className={styles.carrierMetaLabel}>{row.label}</td>
              <td className={styles.carrierMetaValue}>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const ShippingLabel = forwardRef(function ShippingLabel(
  { data, showPrice = true, className = "" },
  ref
) {
  const shipmentData = data || {};
  const labelData = shipmentData.labelData || {};
  const shipTo = labelData.shipTo || {};
  const shipFrom = labelData.shipFrom || {};
  const payment = labelData.payment || {};
  const packageData = labelData.package || {};
  const carrier = labelData.carrier || {};
  const carrierProvider = safeText(carrier.provider);
  const blueDart = carrier.blueDart || {};
  const trackingNumber = safeText(shipmentData.trackingNumber);
  const bookingDate = formatDisplayDate(labelData.bookingDate);
  const courierName = safeText(shipmentData.courierName);
  const serviceType = safeText(labelData.serviceType);
  const orderReferenceNumber = safeText(shipmentData.orderNumber);
  const origin = safeText(labelData.origin);
  const destination = safeText(labelData.destination);
  const shipToName = safeText(shipTo.name);
  const shipToAddress = formatFullAddress(shipTo);
  const shipToPhone = safeText(shipTo.phone);
  const shipFromName = safeText(shipFrom.name);
  const shipFromAddress = formatFullAddress(shipFrom);
  const shipFromPhone = safeText(shipFrom.phone);
  const currency = safeText(payment.currency) || "INR";
  const orderValue = formatCurrency(payment.orderValue, currency);
  const codAmount = formatCurrency(payment.codAmount, currency);
  const weight = formatWeight(packageData.weightKg);
  const dimensions = formatDimensions(packageData.dimensionsCm);
  const pieceCount = hasVisibleValue(packageData.pieceCount)
    ? String(safeNumber(packageData.pieceCount))
    : "";
  const paymentBanner = orderValue ? `ORDER VALUE ${orderValue}` : "";
  const metricItems = [
    {
      label: `Order Value (${currency})`,
      value: orderValue,
    },
    {
      label: `COD Amount (${currency})`,
      value: codAmount,
    },
    {
      label: "Dimensions (cm)",
      value: dimensions,
    },
    {
      label: "Weight (kg)",
      value: weight,
    },
    {
      label: "Pieces",
      value: pieceCount,
    },
  ].filter((item) => item.value);

  const isBlueDart = carrierProvider.toUpperCase() === "BLUE_DART";
  const blueDartMetaRows = isBlueDart
    ? [
        { label: "Area Location", value: safeText(blueDart.areaLocation) },
        { label: "Cluster Code", value: safeText(blueDart.clusterCode) },
        { label: "Origin Area", value: safeText(blueDart.originArea) },
        {
          label: "Destination Area",
          value: safeText(blueDart.destinationArea),
        },
        { label: "Product Code", value: safeText(blueDart.productCode) },
        {
          label: "Sub Product Code",
          value: safeText(blueDart.subProductCode),
        },
        { label: "Product Type", value: safeText(blueDart.productType) },
        { label: "Pack Type", value: safeText(blueDart.packType) },
        { label: "Pickup Time", value: safeText(blueDart.pickupTime) },
        { label: "API Type", value: safeText(blueDart.apiType) },
        { label: "Sender", value: safeText(blueDart.sender) },
        { label: "Vendor Code", value: safeText(blueDart.vendorCode) },
        { label: "Customer Code", value: safeText(blueDart.customerCode) },
        {
          label: "Register Pickup",
          value: safeBool(blueDart.registerPickup),
          alwaysShow: true,
        },
      ]
        .filter((row) =>
          shouldRenderMetaValue(row.value, row.alwaysShow === true)
        )
        .map(({ label, value }) => ({ label, value }))
    : [];
  const labelClassName = `${styles.label}${className ? ` ${className}` : ""}`;

  return (
    <section ref={ref} className={labelClassName} aria-label="Shipping label">
      <div className={styles.topBar}>
        <div>
          <p className={styles.brandName}>{courierName}</p>
          <p className={styles.serviceLine}>{serviceType}</p>
        </div>
        <div className={styles.topBarMeta}>
          <p>BKG. Date - {bookingDate}</p>
          <p>Tracking - {trackingNumber}</p>
        </div>
      </div>

      <div className={styles.barcodeSection}>
        <div className={styles.barcodeMain}>
          <div className={styles.fakeBarcode} aria-hidden="true" />
          <p className={styles.barcodeTracking}>{trackingNumber}</p>
        </div>
        <div className={styles.qrSide}>
          <div className={styles.qrFrame}>
            {trackingNumber ? (
              <QRCodeSVG
                value={trackingNumber}
                size={82}
                level="M"
                bgColor="#FFFFFF"
                fgColor="#111111"
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className={styles.routeRow}>
        <span>ORG: {origin}</span>
        <span>DST: {destination}</span>
      </div>

      {isBlueDart ? <BlueDartMetaTable rows={blueDartMetaRows} /> : null}

      <div className={styles.addressGrid}>
        <div className={styles.addressCell}>
          <AddressSection
            title="SHIP TO:"
            name={shipToName}
            address={shipToAddress}
            phone={shipToPhone}
          />
        </div>
        <div className={styles.addressCell}>
          <AddressSection
            title="SHIP FROM:"
            name={shipFromName}
            address={shipFromAddress}
            phone={shipFromPhone}
          />
        </div>
      </div>

      <div className={styles.paymentSection}>
        {showPrice ? (
          <>
            {paymentBanner ? (
              <p className={styles.codBannerInline}>{paymentBanner}</p>
            ) : null}
            {metricItems.length ? (
              <div className={styles.metricsGrid}>
                {metricItems.map((item) => (
                  <DetailMetric
                    key={item.label}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <div className={styles.priceHidden}>Price hidden for label preview</div>
        )}
      </div>

      <div className={styles.referenceSection}>
        <div className={styles.referenceBarcode}>
          <div className={styles.fakeBarcodeSmall} aria-hidden="true" />
        </div>
        <p className={styles.referenceLabel}>ORDER REFERENCE</p>
        <p className={styles.referenceValue}>{orderReferenceNumber}</p>
      </div>

      <div className={styles.itemsSection}>
        <ItemsTable items={labelData.items} />
      </div>

      <div className={styles.footerSection}>
        {shipFromName ? <p className={styles.footerCompany}>{shipFromName}</p> : null}
        {shipFromAddress ? (
          <p className={styles.footerAddress}>{shipFromAddress}</p>
        ) : null}
      </div>
    </section>
  );
});

export default ShippingLabel;
