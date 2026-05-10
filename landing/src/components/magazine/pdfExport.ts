import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import type { MagazinePage } from "./types";

export async function generatePDF(
  pages: MagazinePage[],
  allProductos: any[]
): Promise<void> {
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

  const pageWidth = 210;
  const pageHeight = 297;

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
      allowTaint: true,
      backgroundColor: "#FFFFFF",
      logging: false,
      width: 595,
      height: 842,
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
  }

  pdf.save(fileName);
}
