import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportInvoicePdf({
  element,
  fileName = "invoice.pdf",
}) {
  if (!element) {
    throw new Error("Invoice element is required for PDF export.");
  }

  // Ensure logo and any remote/local images are completely loaded before capturing
  const images = element.querySelectorAll("img");
  await Promise.all(
    Array.from(images).map((img) => {
      if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    })
  );

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    logging: false,
    windowWidth: 800,
    letterRendering: true,
  });

  const imageData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imageRatio = canvas.width / canvas.height;

  let renderWidth = pageWidth;
  let renderHeight = renderWidth / imageRatio;

  if (renderHeight > pageHeight) {
    renderHeight = pageHeight;
    renderWidth = renderHeight * imageRatio;
  }

  const x = (pageWidth - renderWidth) / 2;
  const y = 0;

  pdf.addImage(imageData, "PNG", x, y, renderWidth, renderHeight, undefined, "FAST");
  pdf.save(fileName);
}
