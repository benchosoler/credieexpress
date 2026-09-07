import type { DragEvent, ReactNode } from "react";
import type { ProductoStrapi } from "../../lib/strapi-types";
import type { TemplateSlot } from "./types";
import { getImageUrl, formatPrecio } from "../../lib/strapi";
import { shortDescription } from "./shortDescription";

export type MagazineCardVariant = "card" | "feature" | "corner";

interface MagazineCardProps {
  producto: ProductoStrapi | null;
  slotId: string;
  label: string;
  /** Reuses the existing `TemplateSlot.size` union to drive card density. */
  density: TemplateSlot["size"];
  /** `"card"` (image + text stacked, used by most templates), `"feature"`
   * (large centered layout, used by `fullFeature`), or `"corner"` (compact
   * name+price row with no description/shipping, used by `showcase`'s
   * corner slots). */
  variant?: MagazineCardVariant;
  /** `"short"` (default) resolves through `shortDescription()`; `"full"`
   * always renders the complete `descripcion`, ignoring
   * `descripcionCorta` — required by `fullFeature`. Ignored by the
   * `corner` variant, which never renders a description. */
  descriptionMode?: "short" | "full";
  /** Shows the product's `categoria` as a badge. Ignored by the `corner`
   * variant, which has no room for it. */
  showCategoria?: boolean;
  /** Optional 1-based position badge rendered in the card's top-left
   * corner (e.g. `grid6`'s catalog-index numbering). Renders nothing when
   * omitted. */
  indexBadge?: number;
  /** Renders the price as a colored pill instead of plain text — a
   * stronger price treatment for templates that want it. Defaults to the
   * plain style. */
  priceEmphasis?: boolean;
  /** Forces the image wrapper's aspect ratio so templates can give
   * products a distinct frame (e.g. a square crop vs. a tall portrait
   * crop). Omit to keep the default flexible (fill-available) sizing. */
  imageAspect?: "square" | "wide" | "tall";
  /** Decorative accent rendered directly under the title (e.g.
   * `fullFeature`'s gradient underline bar). Renders nothing when
   * omitted — templates that don't need one simply don't pass it. */
  titleAccent?: ReactNode;
  /** Icon rendered before the "Envio incluido" text. Renders nothing
   * when omitted. */
  shippingIcon?: ReactNode;
  /** Icon rendered above the empty-state label. Renders nothing when
   * omitted. */
  emptyIcon?: ReactNode;
  /** Icon rendered instead of the default "Sin imagen" text when the
   * product has no resolvable image. Renders the default text when
   * omitted. */
  imagePlaceholder?: ReactNode;
  /** Pixel size of the remove-button icon; the button itself scales via
   * CSS per variant/density. Defaults to 14 (the card-variant size). */
  removeIconSize?: number;
  /** Overrides the description's default `-webkit-line-clamp`. Omit to
   * keep each variant's own CSS default (2 lines for `card`, unset for
   * `feature`). `grid6`'s taller text column affords 3 legible lines at
   * `TYPE_PT.description` — see design.md's `descripcionCorta` budget.
   * Ignored by the `corner` variant, which never renders a description. */
  descriptionLines?: number;
  onDrop: (e: DragEvent, slotId: string) => void;
  onDragOver: (e: DragEvent, slotId: string) => void;
  onDragLeave: () => void;
  onRemove: (slotId: string) => void;
  isDragOver: boolean;
  onClick?: () => void;
  isAssigning?: boolean;
}

/**
 * Owns one product cell: the drag/drop target, the empty placeholder, and
 * the filled product presentation (image, title, description, price,
 * shipping note, remove button). Shared by every template so image
 * resolution and price formatting stay consistent across the magazine —
 * see "Shared Rendering Primitives" in the magazine-page-templates spec.
 *
 * Visual rules live in `magazine.css` scoped under `.magazine-sheet`, not
 * here, so two templates never restyle each other's cells.
 */
export default function MagazineCard({
  producto,
  slotId,
  label,
  density,
  variant = "card",
  descriptionMode = "short",
  showCategoria = false,
  indexBadge,
  priceEmphasis = false,
  imageAspect,
  titleAccent,
  shippingIcon,
  emptyIcon,
  imagePlaceholder,
  removeIconSize = 14,
  descriptionLines,
  onDrop,
  onDragOver,
  onDragLeave,
  onRemove,
  isDragOver,
  onClick,
  isAssigning = false,
}: MagazineCardProps) {
  const isFeature = variant === "feature";
  const isCorner = variant === "corner";
  const stateClass = isDragOver
    ? "is-drag-over"
    : producto
      ? "is-filled"
      : "is-empty";

  const description =
    producto && !isCorner
      ? descriptionMode === "full"
        ? producto.descripcion || ""
        : shortDescription(producto)
      : "";

  return (
    <div
      className={`magazine-card ${isFeature ? "magazine-card--feature" : ""} ${isCorner ? "magazine-card--corner" : ""} ${stateClass} ${isAssigning ? "is-assigning" : ""}`}
      data-density={density}
      onDrop={(e) => onDrop(e, slotId)}
      onDragOver={(e) => onDragOver(e, slotId)}
      onDragLeave={onDragLeave}
      onClick={onClick}
    >
      {indexBadge !== undefined && (
        <span className="magazine-card-index-badge">{indexBadge}</span>
      )}
      {producto ? (
        <div className="magazine-card-content">
          <div
            className="magazine-card-image-wrap"
            style={
              imageAspect
                ? {
                    aspectRatio:
                      imageAspect === "square"
                        ? "1 / 1"
                        : imageAspect === "wide"
                          ? "16 / 9"
                          : "3 / 4",
                    flex: "none",
                  }
                : undefined
            }
          >
            {getImageUrl(producto.imagen, producto.imagenUrl) ? (
              <img
                src={getImageUrl(producto.imagen, producto.imagenUrl)}
                alt={producto.nombre}
                className="magazine-card-image"
              />
            ) : (
              <div className="magazine-card-placeholder">
                {imagePlaceholder ?? "Sin imagen"}
              </div>
            )}
          </div>
          <div className="magazine-card-text">
            {!isCorner && showCategoria && producto.categoria && (
              <span className="magazine-card-badge">{producto.categoria}</span>
            )}
            <h3 className="magazine-card-title">{producto.nombre}</h3>
            {titleAccent}
            {description && (
              <p
                className="magazine-card-desc"
                style={
                  descriptionLines !== undefined
                    ? { WebkitLineClamp: descriptionLines }
                    : undefined
                }
              >
                {description}
              </p>
            )}
            <div
              className={`magazine-card-price ${priceEmphasis ? "is-emphasis" : ""}`}
            >
              {formatPrecio(producto.precio)}
            </div>
            {!isCorner && (
              <div className="magazine-card-shipping">
                {shippingIcon}
                Envio incluido
              </div>
            )}
          </div>
          <button
            className="magazine-card-remove no-print"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(slotId);
            }}
            title="Quitar producto"
          >
            <svg
              width={removeIconSize}
              height={removeIconSize}
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M3 3l8 8M11 3l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      ) : (
        <div className="magazine-card-empty">
          {emptyIcon}
          <span className="magazine-card-empty-label">
            {isAssigning ? "Click para colocar" : label}
          </span>
        </div>
      )}
    </div>
  );
}
