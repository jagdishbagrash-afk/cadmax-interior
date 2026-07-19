import React, { forwardRef, useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import { QRCodeSVG } from "qrcode.react";
import styles from "./ShippingLabel.module.css";
import {
  COMPANY_FOOTER_ADDRESS,
  formatCurrency,
  formatDimensions,
  formatDisplayDate,
  formatFullAddress,
  formatWeight,
  getItems,
  hasVisibleValue,
  maskSensitivePhone,
  safeNumber,
  safeText,
} from "./shippingLabelUtils";

const PUBLIC_TRACKING_BASE_URL = "https://cadmaxatelier.com";
const DEFAULT_SHIP_FROM_SENDER = "CADMAX";
const DEFAULT_BLUE_DART_CUSTOMER_CODE = "000049";
const DEFAULT_BLUE_DART_PRODUCT_CODE = "A";
const DEFAULT_BLUE_DART_SUB_PRODUCT_CODE = "P";
const DEFAULT_BLUE_DART_PRODUCT_TYPE = "1";
const DEFAULT_BLUE_DART_PACK_TYPE = "L";

function TrackingBarcode({ trackingNumber }) {
  const content = safeText(trackingNumber);
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) {
      return;
    }

    if (!content) {
      svgRef.current.innerHTML = "";
      return;
    }

    try {
      JsBarcode(svgRef.current, content, {
        format: "CODE128",
        width: 2,
        height: 62,
        margin: 8,
        displayValue: false,
        lineColor: "#111111",
        background: "#ffffff",
      });
    } catch (error) {
      svgRef.current.innerHTML = "";
    }
  }, [content]);

  if (!content) {
    return null;
  }

  return (
    <svg
      ref={svgRef}
      className={styles.barcodeSvg}
      role="img"
      preserveAspectRatio="xMidYMid meet"
      aria-label={`Barcode for tracking ${content}`}
    />
  );
}

function AddressSection({
  title,
  name,
  address,
  phone,
  extraLines = [],
  renderAddressBeforeExtra = false,
  renderPhoneBeforeExtra = false,
  addGapBetweenExtraLines = false,
}) {
  const addressLines = address ? [address] : [];
  const normalizedExtraLines = Array.isArray(extraLines)
    ? extraLines.filter(Boolean)
    : [];
  const leadingExtraLines = renderAddressBeforeExtra ? [] : normalizedExtraLines;
  const trailingExtraLines = renderAddressBeforeExtra ? normalizedExtraLines : [];

  return (
    <div className={styles.addressSection}>
      <p className={styles.sectionTitle}>{title}</p>
      {name ? <p className={styles.addressName}>{name}</p> : null}
      {leadingExtraLines.map((line, index) => (
        <p key={`${title}-${index}`} className={styles.addressLine}>
          {line}
        </p>
      ))}
      {addressLines.map((line, index) => (
        <p key={`${title}-address-${index}`} className={styles.addressLine}>
          {line}
        </p>
      ))}
      {phone && renderPhoneBeforeExtra ? (
        <p className={styles.addressLine}>Phone: {phone}</p>
      ) : null}
      {trailingExtraLines.map((line, index) => (
        <p
          key={`${title}-extra-${index}`}
          className={`${styles.addressLine}${
            addGapBetweenExtraLines ? ` ${styles.addressLineSpaced}` : ""
          }`}
        >
          {line}
        </p>
      ))}
      {phone && !renderPhoneBeforeExtra ? (
        <p className={styles.addressLine}>Phone: {phone}</p>
      ) : null}
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

function getPublicTrackingUrl(
  trackingNumber,
  courierName,
  { includeCourier = true } = {}
) {
  const normalizedTracking = safeText(trackingNumber);

  if (!normalizedTracking) {
    return "";
  }

  const trackingUrl = new URL(
    `/shipment/track/${encodeURIComponent(normalizedTracking)}`,
    PUBLIC_TRACKING_BASE_URL
  );
  const normalizedCourier = safeText(courierName);

  if (includeCourier && normalizedCourier) {
    trackingUrl.searchParams.set("courier", normalizedCourier);
  }

  return trackingUrl.toString();
}

function formatCustomerCode(value) {
  const normalizedValue = safeText(value);
  const digitsOnly = normalizedValue.replace(/\D/g, "");

  if (digitsOnly) {
    return digitsOnly.slice(-6).padStart(6, "0");
  }

  return DEFAULT_BLUE_DART_CUSTOMER_CODE;
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
  const trackingQrValue = getPublicTrackingUrl(
    trackingNumber,
    shipmentData.courierName
  );
  const bookingDate = formatDisplayDate(labelData.bookingDate);
  const courierName = safeText(shipmentData.courierName);
  const serviceType = safeText(labelData.serviceType);
  const orderReferenceNumber = safeText(shipmentData.orderNumber);
  const origin = safeText(labelData.origin);
  const shipToName = safeText(shipTo.name);
  const shipToAddress = formatFullAddress(shipTo);
  const shipToPhone = maskSensitivePhone(shipTo.phone);
  const shipFromName = safeText(shipFrom.name);
  const shipFromAddress = COMPANY_FOOTER_ADDRESS;
  const shipFromPhone = maskSensitivePhone(shipFrom.phone);
  const currency = safeText(payment.currency) || "INR";
  const orderValue = formatCurrency(payment.orderValue, currency);
  const codAmount = formatCurrency(payment.codAmount, currency);
  const weight = formatWeight(packageData.weightKg);
  const dimensions = formatDimensions(packageData.dimensionsCm);
  const pieceCount = hasVisibleValue(packageData.pieceCount)
    ? String(safeNumber(packageData.pieceCount))
    : "";
  const codValue = hasVisibleValue(payment.codAmount) ? safeNumber(payment.codAmount) : 0;
  const codHeading = codValue > 0 ? `COLLECT CASH OF ${formatCurrency(codValue, currency)}` : "";
  const paymentBanner =
    codHeading || (orderValue ? `ORDER VALUE ${orderValue}` : "");
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
  const originArea = safeText(blueDart.originArea);
  const routeOrigin = isBlueDart ? originArea || origin : origin;

  const blueDartProductCode =
    safeText(blueDart.productCode) || DEFAULT_BLUE_DART_PRODUCT_CODE;
  const blueDartSubProductCode =
    safeText(blueDart.subProductCode) || DEFAULT_BLUE_DART_SUB_PRODUCT_CODE;
  const blueDartProductType =
    safeText(blueDart.productType) || DEFAULT_BLUE_DART_PRODUCT_TYPE;
  const blueDartPackType =
    safeText(blueDart.packType) || DEFAULT_BLUE_DART_PACK_TYPE;
  const blueDartApiType = safeText(blueDart.apiType);
  const blueDartSender = safeText(blueDart.sender) || DEFAULT_SHIP_FROM_SENDER;
  const blueDartCustomerCode = formatCustomerCode(blueDart.customerCode);

  const shipFromExtraLines = [
    shouldRenderMetaValue(blueDartCustomerCode, true)
      ? `C/CODE: ${blueDartCustomerCode}`
      : "",
    shouldRenderMetaValue(blueDartSender, true)
      ? `SENDER: ${blueDartSender}`
      : "",
    shouldRenderMetaValue(blueDartProductCode, true)
      ? `PRODUCT CODE: ${blueDartProductCode}`
      : "",
    shouldRenderMetaValue(blueDartSubProductCode, true)
      ? `SUB PRODUCT CODE: ${blueDartSubProductCode}`
      : "",
    shouldRenderMetaValue(blueDartProductType, true)
      ? `PRODUCT TYPE: ${blueDartProductType}`
      : "",
    shouldRenderMetaValue(blueDartPackType, true)
      ? `PACK TYPE: ${blueDartPackType}`
      : "",
    shouldRenderMetaValue(blueDartApiType)
      ? `API TYPE: ${blueDartApiType}`
      : "",
  ].filter(Boolean);
  const returnToSource =
    labelData.rto || labelData.returnTo || labelData.returnAddress || {};
  const returnToName = safeText(returnToSource?.name) || shipFromName;
  const returnToAddress = formatFullAddress(returnToSource) || shipFromAddress;
  const returnToPhone =
    maskSensitivePhone(returnToSource?.phone) || shipFromPhone;
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
          <TrackingBarcode
            trackingNumber={trackingNumber}
          />
          <p className={styles.barcodeTracking}>{trackingNumber}</p>
        </div>
        <div className={styles.qrSide}>
          <div className={styles.qrFrame}>
            {trackingNumber ? (
              <QRCodeSVG
                value={trackingQrValue || trackingNumber}
                size={82}
                level="H"
                bgColor="#FFFFFF"
                fgColor="#111111"
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className={styles.routeRow}>
        <span>ORG: {routeOrigin}</span>
        <span>DST: JAI/JVN/JVN</span>
      </div>

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
            extraLines={shipFromExtraLines}
            renderAddressBeforeExtra
            renderPhoneBeforeExtra
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
        <p className={styles.rtoLabel}>If Undelivered Return To:</p>
        {returnToName ? <p className={styles.footerCompany}>{returnToName}</p> : null}
        <p className={styles.footerAddress}>{returnToAddress}</p>
        {returnToPhone ? (
          <p className={styles.footerAddress}>Phone: {returnToPhone}</p>
        ) : null}
      </div>
    </section>
  );
});

export default ShippingLabel;
