import type { ProductoStrapi } from "../../lib/strapi-types";

/** Default character budget used when a caller does not specify one. */
export const DEFAULT_DESCRIPTION_BUDGET = 160;

/**
 * Truncates `text` to `maxLength` characters at a word boundary, appending
 * an ellipsis only when it was actually cut. Returns `text` unchanged when
 * it already fits.
 */
function truncateAtWordBoundary(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  const safe = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;

  return `${safe}…`;
}

/**
 * Resolves the description text a product cell should render: prefer the
 * curated `descripcionCorta`; fall back to `descripcion` truncated to a
 * word boundary; otherwise return an empty string. Callers MUST render no
 * text and reserve no blank block when this returns "" — see
 * "Short-Description Rendering Fallback" in the magazine-page-templates
 * spec.
 */
export function shortDescription(
  producto: Pick<ProductoStrapi, "descripcionCorta" | "descripcion">,
  maxLength: number = DEFAULT_DESCRIPTION_BUDGET,
): string {
  if (producto.descripcionCorta) return producto.descripcionCorta;
  if (producto.descripcion)
    return truncateAtWordBoundary(producto.descripcion, maxLength);
  return "";
}
