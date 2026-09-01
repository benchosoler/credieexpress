import type { CSSProperties } from "react";

/**
 * Single geometry source for the printable A4 magazine sheet.
 *
 * All physical dimensions live here, authored in millimeters, and are
 * published as CSS custom properties via `sheetCssVars()`. Plain `.css`
 * files and each template's raw `<style>` block read those variables
 * instead of re-declaring pixel approximations of A4.
 *
 * `@page { size: A4; margin: 0 }` uses the symbolic `A4` keyword, so no
 * number from this file needs to be duplicated there.
 */

/** Physical A4 sheet size in millimeters. */
export const SHEET = { widthMm: 210, heightMm: 297 } as const;

/** Chrome bands reserved around the sheet content, in millimeters. */
export const CHROME = {
  headerMm: 25,
  footerMm: 15,
  sideMarginMm: 12,
  gapMm: 5,
} as const;

/**
 * Print bleed, in millimeters. Named and zeroed today (office printing).
 * Kept as a named constant so a future print-shop upgrade is additive
 * instead of a rewrite.
 */
export const BLEED = { mm: 0 } as const;

/** Crop marks are off today; named so enabling them later is additive. */
export const CROP_MARKS = false;

/**
 * Legacy retrofit factor: today's sheet was authored as 595x842 CSS px
 * (PDF points misused as px), which maps 1:1 to 210mm width. Multiplying
 * any hardcoded px value from the five legacy templates by this factor
 * converts it to millimeters mechanically, preserving the tuned layout
 * instead of re-eyeballing it.
 *
 * Vertical check: 297 / 842 = 0.35273, a 0.06% divergence from this
 * width-derived factor — far below print resolution.
 */
export const LEGACY_PX_TO_MM = SHEET.widthMm / 595;

/**
 * Coordinate space used by decorative SVG elements (DecorativeElements.tsx
 * and each template's own background decoration). This is a `viewBox`,
 * which is unit-agnostic and auto-scales to whatever mm box contains it —
 * it is deliberately NOT the sheet size and needs no retrofit.
 */
export const DECOR_VIEWBOX = { w: 595, h: 842 } as const;

/** Print-real type scale, in points. */
export const TYPE_PT = {
  productTitle: 11,
  price: 12,
  description: 9,
  meta: 8,
} as const;

/** Absolute floor for body text size, in points. */
export const MIN_BODY_PT = 9;

/**
 * Publishes the sheet geometry as CSS custom properties on the sheet root.
 * Consumed by `MagazineSheet` and read from `magazine.css` /
 * `magazine-print.css` so there is exactly one numeric source.
 */
export function sheetCssVars(): CSSProperties {
  return {
    "--sheet-w": `${SHEET.widthMm}mm`,
    "--sheet-h": `${SHEET.heightMm}mm`,
    "--chrome-header": `${CHROME.headerMm}mm`,
    "--chrome-footer": `${CHROME.footerMm}mm`,
    "--chrome-side": `${CHROME.sideMarginMm}mm`,
    "--chrome-gap": `${CHROME.gapMm}mm`,
    "--sheet-bleed": `${BLEED.mm}mm`,
  } as CSSProperties;
}
