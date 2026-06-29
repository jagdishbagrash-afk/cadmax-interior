import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportShippingLabelPdf({
  element,
  fileName = "shipping-label.pdf",
}) {
  if (!element) {
    throw new Error("Shipping label element is required for PDF export.");
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const imageData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: canvas.width >= canvas.height ? "landscape" : "portrait",
    unit: "mm",
    format: "a4",
  });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imageRatio = canvas.width / canvas.height;
  let renderWidth = pageWidth - 12;
  let renderHeight = renderWidth / imageRatio;

  if (renderHeight > pageHeight - 12) {
    renderHeight = pageHeight - 12;
    renderWidth = renderHeight * imageRatio;
  }

  const x = (pageWidth - renderWidth) / 2;
  const y = (pageHeight - renderHeight) / 2;

  pdf.addImage(imageData, "PNG", x, y, renderWidth, renderHeight, undefined, "FAST");
  pdf.save(fileName);
}
