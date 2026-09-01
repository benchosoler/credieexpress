import type { ReactNode } from "react";
import { sheetCssVars } from "./sheet";

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
  /** QR placeholder slot, wired with real content in a later PR. Rendered
   * as an absolutely-positioned overlay so it never steals layout space
   * from `children` while it stays empty. */
  footer?: ReactNode;
}

/**
 * Owns the physical A4 page: the mm-accurate box, the export id, a
 * reserved decor layer, and the sheet-footer QR placeholder slot.
 *
 * Structurally a pass-through frame in PR1 — `children` still render their
 * own legacy header/footer/decoration. This lets native print work before
 * any template is retrofitted to consume shared primitives.
 */
export default function MagazineSheet({
  id,
  children,
  header,
  footer,
}: MagazineSheetProps) {
  return (
    <div
      className="magazine-sheet"
      style={sheetCssVars()}
      id={`magazine-page-${id}`}
    >
      <div className="magazine-sheet-decor" aria-hidden="true" />
      {header && <div className="magazine-sheet-header">{header}</div>}
      <div className="magazine-sheet-content">{children}</div>
      <div className="magazine-sheet-footer" aria-hidden="true">
        <div className="magazine-sheet-footer-qr">{footer}</div>
      </div>
    </div>
  );
}
