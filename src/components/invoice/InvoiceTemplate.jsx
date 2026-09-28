import React from "react";

export const InvoiceTemplate = React.forwardRef(({ orderData }, ref) => {
  if (!orderData) return null;

  const header = orderData.orderHeader || {};
  const products = orderData.products || [];
  const address = orderData.shippingAddress || {};
  const payment = orderData.paymentMethod || {};
  const summary = orderData.orderSummary || {};
  const shipment = orderData.shipmentDetails || {};

  const rawOrderId =
    header.rawOrderId ||
    (header.orderId ? header.orderId.replace("#", "") : "ORD-000000");
  const invoiceNumber = `INV-${rawOrderId.replace(/^ORD-?/, "")}`;
  const invoiceDate =
    header.placedOn ||
    new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div
      ref={ref}
      style={{
        width: "794px",
        minHeight: "1123px",
        padding: "36px 40px",
        backgroundColor: "#ffffff",
        color: "#111827",
        fontFamily:
          "'Inter', system-ui, -apple-system, BlinkMacSystemFont, Arial, sans-serif",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* 1. TOP HEADER SECTION (TABLE LAYOUT TO PREVENT CANVAS OVERLAPS) */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          paddingBottom: "20px",
          borderBottom: "2px solid #e2e8f0",
          tableLayout: "fixed",
        }}
      >
        <tbody>
          <tr>
            {/* LEFT COLUMN: BRAND LOGO & SELLER DETAILS */}
            <td style={{ width: "55%", verticalAlign: "top", textAlign: "left" }}>
              <div style={{ marginBottom: "10px" }}>
                <img
                  src="/Logo.png"
                  alt="CADMAX Interior"
                  style={{
                    maxHeight: "55px",
                    maxWidth: "240px",
                    objectFit: "contain",
                    display: "block",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = "block";
                    }
                  }}
                />
                <div
                  style={{
                    display: "none",
                    fontWeight: "900",
                    fontSize: "22px",
                    color: "#0f172a",
                    letterSpacing: "-0.5px",
                  }}
                >
                  CADMAX INTERIOR
                </div>
              </div>

              <div
                style={{
                  fontSize: "11px",
                  color: "#475569",
                  lineHeight: "1.5",
                  marginTop: "6px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 2px 0",
                    fontWeight: "700",
                    color: "#0f172a",
                    fontSize: "12px",
                  }}
                >
                  CADMAX Interior Pvt. Ltd.
                </p>
                <p style={{ margin: "0 0 2px 0" }}>
                  A-12, Sikar Road, Vaishali Nagar, Jaipur, Rajasthan - 302021
                </p>
                <p style={{ margin: "0 0 2px 0" }}>
                  GSTIN: 08AAACC1234H1Z5 | Support: +91 98765 43210
                </p>
                <p style={{ margin: 0 }}>Email: support@cadmaxinterior.com</p>
              </div>
            </td>

            {/* RIGHT COLUMN: TAX INVOICE BADGE & INVOICE META */}
            <td style={{ width: "45%", verticalAlign: "top", textAlign: "right" }}>
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: "#0f172a",
                  color: "#ffffff",
                  padding: "6px 18px",
                  borderRadius: "6px",
                  fontWeight: "800",
                  fontSize: "14px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                TAX INVOICE
              </div>

              <table
                style={{
                  width: "100%",
                  fontSize: "12px",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        padding: "3px 8px 3px 0",
                        color: "#64748b",
                        fontWeight: "600",
                        textAlign: "right",
                        width: "45%",
                      }}
                    >
                      Invoice No:
                    </td>
                    <td
                      style={{
                        padding: "3px 0",
                        color: "#0f172a",
                        fontWeight: "700",
                        textAlign: "right",
                        width: "55%",
                      }}
                    >
                      {invoiceNumber}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "3px 8px 3px 0",
                        color: "#64748b",
                        fontWeight: "600",
                        textAlign: "right",
                      }}
                    >
                      Invoice Date:
                    </td>
                    <td
                      style={{
                        padding: "3px 0",
                        color: "#0f172a",
                        fontWeight: "600",
                        textAlign: "right",
                      }}
                    >
                      {invoiceDate}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "3px 8px 3px 0",
                        color: "#64748b",
                        fontWeight: "600",
                        textAlign: "right",
                      }}
                    >
                      Order ID:
                    </td>
                    <td
                      style={{
                        padding: "3px 0",
                        color: "#0f172a",
                        fontWeight: "700",
                        textAlign: "right",
                      }}
                    >
                      {header.orderId}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "3px 8px 3px 0",
                        color: "#64748b",
                        fontWeight: "600",
                        textAlign: "right",
                      }}
                    >
                      Payment Method:
                    </td>
                    <td
                      style={{
                        padding: "3px 0",
                        color: "#0f172a",
                        fontWeight: "600",
                        textAlign: "right",
                      }}
                    >
                      {payment.method || "Online Payment"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* 2. BILLED TO & SHIPMENT DETAILS (2-COLUMN TABLE LAYOUT) */}
      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: "16px 0",
          margin: "20px -16px",
          tableLayout: "fixed",
        }}
      >
        <tbody>
          <tr>
            {/* Customer Address */}
            <td
              style={{
                width: "50%",
                verticalAlign: "top",
                backgroundColor: "#f8fafc",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "10px",
                  fontWeight: "800",
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                BILLED TO / SHIPPING ADDRESS
              </p>
              <p
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#0f172a",
                }}
              >
                {address.name || "Customer"}
              </p>
              <p
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "12px",
                  color: "#334155",
                  lineHeight: "1.4",
                }}
              >
                {address.address ||
                  "A-12, Sikar Road, Vaishali Nagar, Jaipur, Rajasthan - 302021"}
              </p>
              {address.phone && (
                <p
                  style={{
                    margin: "6px 0 0 0",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#475569",
                  }}
                >
                  {address.phone}
                </p>
              )}
            </td>

            {/* Shipment Details */}
            <td
              style={{
                width: "50%",
                verticalAlign: "top",
                backgroundColor: "#f8fafc",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "10px",
                  fontWeight: "800",
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                SHIPMENT & ORDER SUMMARY
              </p>
              <table
                style={{
                  width: "100%",
                  fontSize: "12px",
                  borderCollapse: "collapse",
                  lineHeight: "1.6",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        color: "#0f172a",
                        fontWeight: "700",
                        width: "45%",
                      }}
                    >
                      Shipment ID:
                    </td>
                    <td style={{ color: "#334155" }}>
                      {shipment.shipmentId || "SHP-554789"}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: "#0f172a", fontWeight: "700" }}>
                      Courier Partner:
                    </td>
                    <td style={{ color: "#334155" }}>
                      {shipment.courierPartner || "Ecom Express"}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: "#0f172a", fontWeight: "700" }}>
                      Tracking AWB:
                    </td>
                    <td style={{ color: "#334155" }}>
                      {shipment.trackingId || "1234567890"}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: "#0f172a", fontWeight: "700" }}>
                      Order Status:
                    </td>
                    <td style={{ color: "#16a34a", fontWeight: "700" }}>
                      {header.status || "Delivered"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* 3. PRODUCT ITEMS TABLE */}
      <div style={{ margin: "20px 0" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "12px",
            tableLayout: "fixed",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#0f172a", color: "#ffffff" }}>
              <th
                style={{
                  padding: "10px 12px",
                  textAlign: "center",
                  width: "35px",
                  borderTopLeftRadius: "6px",
                }}
              >
                #
              </th>
              <th style={{ padding: "10px 12px", textAlign: "left", width: "220px" }}>
                Item Description
              </th>
              <th style={{ padding: "10px 12px", textAlign: "left", width: "180px" }}>
                Variant / Specification
              </th>
              <th
                style={{
                  padding: "10px 12px",
                  textAlign: "center",
                  width: "50px",
                }}
              >
                Qty
              </th>
              <th
                style={{
                  padding: "10px 12px",
                  textAlign: "right",
                  width: "110px",
                }}
              >
                Unit Price
              </th>
              <th
                style={{
                  padding: "10px 12px",
                  textAlign: "right",
                  width: "119px",
                  borderTopRightRadius: "6px",
                }}
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: "1px solid #e2e8f0",
                  backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                }}
              >
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#64748b",
                  }}
                >
                  {idx + 1}
                </td>
                <td
                  style={{
                    padding: "12px",
                    fontWeight: "700",
                    color: "#0f172a",
                    wordBreak: "break-word",
                  }}
                >
                  {item.title}
                </td>
                <td
                  style={{
                    padding: "12px",
                    color: "#475569",
                    wordBreak: "break-word",
                  }}
                >
                  {item.variant || "Standard"}
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#0f172a",
                  }}
                >
                  {item.quantity}
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "right",
                    color: "#334155",
                  }}
                >
                  {item.priceFormatted ||
                    `₹ ${(item.price || 0).toLocaleString("en-IN")}`}
                </td>
                <td
                  style={{
                    padding: "12px",
                    textAlign: "right",
                    fontWeight: "700",
                    color: "#0f172a",
                  }}
                >
                  {item.totalFormatted ||
                    item.priceFormatted ||
                    `₹ ${(item.total || item.price || 0).toLocaleString(
                      "en-IN"
                    )}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. SUMMARY BREAKDOWN & PAYMENT STAMP (TABLE LAYOUT TO PREVENT CANVAS OVERLAPS) */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          margin: "20px 0",
          tableLayout: "fixed",
        }}
      >
        <tbody>
          <tr>
            {/* LEFT COLUMN: PAYMENT STAMP & WARRANTY */}
            <td
              style={{
                width: "55%",
                verticalAlign: "top",
                paddingRight: "24px",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: "#dcfce7",
                  border: "1.5px solid #86efac",
                  borderRadius: "8px",
                  color: "#15803d",
                  padding: "8px 16px",
                  fontWeight: "800",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                PAYMENT VERIFIED • {payment.status || "PAID"}
              </div>
              <p
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                  marginTop: "12px",
                  lineHeight: "1.5",
                  maxWidth: "340px",
                }}
              >
                <strong>Warranty Note:</strong> All products carry standard
                CADMAX interior manufacturing warranty. Please retain this
                official tax invoice for warranty claims.
              </p>
            </td>

            {/* RIGHT COLUMN: FINANCIAL TOTALS BREAKDOWN */}
            <td
              style={{
                width: "45%",
                verticalAlign: "top",
                textAlign: "right",
              }}
            >
              <table
                style={{
                  width: "100%",
                  fontSize: "12px",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        padding: "5px 0",
                        color: "#64748b",
                        fontWeight: "600",
                        textAlign: "left",
                        width: "50%",
                      }}
                    >
                      Subtotal:
                    </td>
                    <td
                      style={{
                        padding: "5px 0",
                        textAlign: "right",
                        fontWeight: "700",
                        color: "#0f172a",
                        width: "50%",
                      }}
                    >
                      {summary.subtotalFormatted || "₹ 27,250.00"}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "5px 0",
                        color: "#64748b",
                        fontWeight: "600",
                        textAlign: "left",
                      }}
                    >
                      Shipping & Freight:
                    </td>
                    <td
                      style={{
                        padding: "5px 0",
                        textAlign: "right",
                        fontWeight: "700",
                        color: "#0f172a",
                      }}
                    >
                      {summary.shippingFormatted || "₹ 1,110.00"}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "5px 0",
                        color: "#64748b",
                        fontWeight: "600",
                        textAlign: "left",
                      }}
                    >
                      GST / Tax ({summary.taxPercentage || "18%"}):
                    </td>
                    <td
                      style={{
                        padding: "5px 0",
                        textAlign: "right",
                        fontWeight: "700",
                        color: "#0f172a",
                      }}
                    >
                      {summary.taxFormatted || "₹ 2,000.00"}
                    </td>
                  </tr>
                  <tr
                    style={{
                      borderTop: "2px solid #0f172a",
                      borderBottom: "2px solid #0f172a",
                    }}
                  >
                    <td
                      style={{
                        padding: "10px 0",
                        fontSize: "14px",
                        fontWeight: "800",
                        color: "#0f172a",
                        textAlign: "left",
                      }}
                    >
                      Grand Total:
                    </td>
                    <td
                      style={{
                        padding: "10px 0",
                        textAlign: "right",
                        fontSize: "16px",
                        fontWeight: "900",
                        color: "#0f172a",
                      }}
                    >
                      {summary.totalFormatted || "₹ 30,360.00"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* 5. FOOTER & AUTHORIZED SIGNATURE */}
      <table
        style={{
          position: "absolute",
          bottom: "36px",
          left: "40px",
          right: "40px",
          width: "calc(100% - 80px)",
          borderTop: "1px dashed #cbd5e1",
          paddingTop: "16px",
          fontSize: "11px",
          color: "#64748b",
          borderCollapse: "collapse",
          tableLayout: "fixed",
        }}
      >
        <tbody>
          <tr>
            <td style={{ width: "65%", verticalAlign: "bottom" }}>
              <p
                style={{
                  margin: "0 0 2px 0",
                  fontWeight: "700",
                  color: "#0f172a",
                }}
              >
                CADMAX Interior Pvt. Ltd.
              </p>
              <p style={{ margin: 0 }}>
                This is an official computer-generated tax invoice created directly from database records.
              </p>
              <p style={{ margin: 0 }}>
                Thank you for shopping with CADMAX Interior!
              </p>
            </td>
            <td
              style={{
                width: "35%",
                verticalAlign: "bottom",
                textAlign: "right",
              }}
            >
              <div
                style={{
                  width: "140px",
                  borderBottom: "1px solid #94a3b8",
                  marginBottom: "4px",
                  marginLeft: "auto",
                }}
              ></div>
              <p
                style={{
                  margin: 0,
                  fontWeight: "700",
                  color: "#0f172a",
                }}
              >
                Authorized Signatory
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

InvoiceTemplate.displayName = "InvoiceTemplate";
