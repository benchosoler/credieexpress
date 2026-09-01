import type { ReactNode } from "react";
import { sheetCssVars } from "./sheet";

/** Production catalog domain, used when `PUBLIC_SITE_URL` is not set. */
const CATALOG_URL_FALLBACK = "https://crediexpress.com.ar";

/**
 * Resolves the URL the sheet-footer QR would encode. Every sheet shows
 * exactly one — this is the catalog URL, never a per-product
 * `/productos/{slug}` link — see "One QR Per Sheet In Shared Footer" in
 * the magazine-page-templates spec.
 */
function resolveCatalogUrl(): string {
  const configured = import.meta.env.PUBLIC_SITE_URL;
  return configured && configured.length > 0
    ? configured
    : CATALOG_URL_FALLBACK;
}

interface MagazineSheetProps {
  /** Magazine page id. Rendered as `id="magazine-page-{id}"` for pdfExport. */
  id: string;
  /** Template content. Fills the sheet — MagazineSheet is a pass-through
   * frame in this slice; templates keep their own internal header/footer
   * until they are retrofitted. */
  children: ReactNode;
  /** Reserved for the retrofit PRs that move each template's own branding
   * header out of the template and into the shared frame. Unused today. */
  header?: ReactNode;
}

/**
 * Owns the physical A4 page: the mm-accurate box, the export id, a
 * reserved decor layer, and the sheet footer's single QR placeholder.
 *
 * The QR is rendered here — never passed in by a template — so "exactly
 * one QR per sheet, never per product" holds structurally: no template
 * can accidentally render zero, duplicate, or per-card QR placeholders.
 */
export default function MagazineSheet({
  id,
  children,
  header,
}: MagazineSheetProps) {
  const catalogUrl = resolveCatalogUrl();

  return (
    <div
      className="magazine-sheet"
      style={sheetCssVars()}
      id={`magazine-page-${id}`}
    >
      <div className="magazine-sheet-decor" aria-hidden="true" />
      {header && <div className="magazine-sheet-header">{header}</div>}
      <div className="magazine-sheet-content">{children}</div>
      <div className="magazine-sheet-footer">
        <span className="magazine-sheet-footer-qr-url">{catalogUrl}</span>
        <div
          className="magazine-sheet-footer-qr"
          role="img"
          aria-label={`Codigo QR (marcador) al catalogo: ${catalogUrl}`}
          title={catalogUrl}
        >
          <span className="magazine-sheet-footer-qr-label" aria-hidden="true">
            QR
          </span>
        </div>
      </div>
    </div>
  );
}
