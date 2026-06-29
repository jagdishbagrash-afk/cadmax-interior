import React, { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import styles from "./ShippingLabel.module.css";
import {
  COMPANY_FOOTER_ADDRESS,
  formatCurrency,
  formatDimensions,
  formatDisplayDate,
  formatWeight,
  getCodHeading,
  getDisplayValue,
  getItems,
} from "./shippingLabelUtils";

function getAddressLines(address) {
  if (!address) {
    return ["N/A"];
  }

  const cityState = [address.city, address.state].filter(Boolean).join(" ");
  const countryPincode = [address.country, address.pincode].filter(Boolean).join(" - ");

  const lines = [
    address.addressLine1,
    address.addressLine2,
    cityState,
    countryPincode,
  ]
    .map((line) => (typeof line === "string" ? line.trim() : ""))
    .filter(Boolean);

  return lines.length ? lines : ["N/A"];
}

function getRouteCode(address) {
  const sourceText =
    address?.city || address?.state || address?.pincode || "N/A";

  const normalized = String(sourceText).replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  return normalized ? normalized.slice(0, 3) : "N/A";
}

function AddressSection({ title, address, companyName }) {
  const displayName =
    companyName || address?.companyName || address?.name || "N/A";
  const lines = getAddressLines(address);
  const phone = getDisplayValue(address?.phone);

  return (
    <div className={styles.addressSection}>
      <p className={styles.sectionTitle}>{title}</p>
      <p className={styles.addressName}>{getDisplayValue(displayName)}</p>
      {address?.name && companyName ? (
        <p className={styles.addressLine}>{getDisplayValue(address.name)}</p>
      ) : null}
      {lines.map((line, index) => (
        <p key={`${title}-${index}`} className={styles.addressLine}>
          {line}
        </p>
      ))}
      <p className={styles.addressLine}>Phone: {phone}</p>
    </div>
  );
}

function DetailMetric({ label, value }) {
  return (
    <div className={styles.metricCell}>
      <p className={styles.metricLabel}>{label}</p>
      <p className={styles.metricValue}>{getDisplayValue(value)}</p>
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
        {normalizedItems.length ? (
          normalizedItems.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.sku}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4}>N/A</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

const ShippingLabel = forwardRef(function ShippingLabel(
  { data, showPrice = true, className = "" },
  ref
) {
  const trackingNumber = getDisplayValue(data?.trackingNumber);
  const bookingDate = formatDisplayDate(data?.bookingDate);
  const courierName = getDisplayValue(data?.courierName, "Custom Courier");
  const serviceType = getDisplayValue(data?.serviceType);
  const orderReferenceNumber = getDisplayValue(data?.orderReferenceNumber);
  const weight = formatWeight(data?.packageDetails?.weightKg);
  const dimensions = formatDimensions(data?.packageDetails);
  const currency = data?.payment?.currency || "INR";
  const orderValue = formatCurrency(data?.payment?.orderValue, currency);
  const codAmount = formatCurrency(data?.payment?.codAmount, currency);
  const codHeading = showPrice ? getCodHeading(data?.payment) : null;
  const originCode = getRouteCode(data?.shipFrom);
  const destinationCode = getRouteCode(data?.shipTo);
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
            <QRCodeSVG
              value={trackingNumber === "N/A" ? "N/A" : trackingNumber}
              size={82}
              level="M"
              bgColor="#FFFFFF"
              fgColor="#111111"
            />
          </div>
        </div>
      </div>

      <div className={styles.routeRow}>
        <span>ORG: {originCode}</span>
        <span>DST: {destinationCode}</span>
      </div>

      <div className={styles.addressGrid}>
        <div className={styles.addressCell}>
          <AddressSection title="SHIP TO:" address={data?.shipTo} />
        </div>
        <div className={styles.addressCell}>
          <AddressSection
            title="SHIP FROM:"
            address={data?.shipFrom}
            companyName={data?.shipFrom?.companyName}
          />
        </div>
      </div>

      <div className={styles.paymentSection}>
        {showPrice ? (
          <>
            <p className={styles.codBannerInline}>
              {codHeading || `ORDER VALUE ${orderValue}`}
            </p>
            <div className={styles.metricsGrid}>
              <DetailMetric label="Order Value (INR)" value={orderValue} />
              <DetailMetric label="COD Amount (INR)" value={codAmount} />
              <DetailMetric label="Dimensions (cm)" value={dimensions} />
              <DetailMetric label="Weight (kg)" value={weight} />
            </div>
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
        <ItemsTable items={data?.items} />
      </div>

      <div className={styles.footerSection}>
        <p className={styles.footerCompany}>
          {getDisplayValue(data?.shipFrom?.companyName, "Cadmax Interior")}
        </p>
        <p className={styles.footerAddress}>{COMPANY_FOOTER_ADDRESS}</p>
      </div>
    </section>
  );
});

export default ShippingLabel;
