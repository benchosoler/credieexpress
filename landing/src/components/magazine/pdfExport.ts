import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import type { MagazinePage } from "./types";
import { SHEET } from "./sheet";

// CSS px per mm at the standard 96 DPI used by browsers/html2canvas.
const CSS_PX_PER_MM = 96 / 25.4;
const CAPTURE_WIDTH_PX = Math.round(SHEET.widthMm * CSS_PX_PER_MM);
const CAPTURE_HEIGHT_PX = Math.round(SHEET.heightMm * CSS_PX_PER_MM);

export async function generatePDF(pages: MagazinePage[]): Promise<void> {
  const now = new Date();
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const fileName = `CrediExpress_Revista_${monthNames[now.getMonth()]}${now.getFullYear()}.pdf`;

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = SHEET.widthMm;
  const pageHeight = SHEET.heightMm;

  // Pin screen zoom to 1 for the whole export so raster capture is always
  // taken at true size, independent of whatever zoom level the user left
  // the preview at. Restored afterwards regardless of outcome.
  const canvasEl = document.querySelector<HTMLElement>(".magazine-canvas");
  const previousZoom =
    canvasEl?.style.getPropertyValue("--magazine-zoom") ?? "";
  canvasEl?.style.setProperty("--magazine-zoom", "1");

  try {
    // Buscar todas las páginas renderizadas en el DOM
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const element = document.getElementById(`magazine-page-${page.id}`);

      if (!element) {
        console.warn(`Page element not found: magazine-page-${page.id}`);
        continue;
      }

      if (i > 0) {
        pdf.addPage();
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#FFFFFF",
        logging: false,
        width: CAPTURE_WIDTH_PX,
        height: CAPTURE_HEIGHT_PX,
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
    }
  } finally {
    if (canvasEl) {
      if (previousZoom) {
        canvasEl.style.setProperty("--magazine-zoom", previousZoom);
      } else {
        canvasEl.style.removeProperty("--magazine-zoom");
      }
    }
  }

  pdf.save(fileName);
}
