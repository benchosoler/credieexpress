import type { DragEvent, ReactNode } from "react";
import type { ProductoStrapi } from "../../lib/strapi-types";
import type { TemplateSlot } from "./types";
import { getImageUrl, formatPrecio } from "../../lib/strapi";
import { shortDescription } from "./shortDescription";

export type MagazineCardVariant = "card" | "feature";

interface MagazineCardProps {
  producto: ProductoStrapi | null;
  slotId: string;
  label: string;
  /** Reuses the existing `TemplateSlot.size` union to drive card density. */
  density: TemplateSlot["size"];
  /** `"card"` (image + text stacked, used by most templates) or
   * `"feature"` (large centered layout, used by `fullFeature`). */
  variant?: MagazineCardVariant;
  /** `"short"` (default) resolves through `shortDescription()`; `"full"`
   * always renders the complete `descripcion`, ignoring
   * `descripcionCorta` — required by `fullFeature`. */
  descriptionMode?: "short" | "full";
  /** `feature` variant only: shows the product's `categoria` as a badge. */
  showCategoria?: boolean;
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
  /** Pixel size of the remove-button icon; the button itself scales via
   * CSS per variant/density. Defaults to 14 (the card-variant size). */
  removeIconSize?: number;
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
  titleAccent,
  shippingIcon,
  emptyIcon,
  removeIconSize = 14,
  onDrop,
  onDragOver,
  onDragLeave,
  onRemove,
  isDragOver,
  onClick,
  isAssigning = false,
}: MagazineCardProps) {
  const isFeature = variant === "feature";
  const stateClass = isDragOver
    ? "is-drag-over"
    : producto
      ? "is-filled"
      : "is-empty";

  const description = producto
    ? descriptionMode === "full"
      ? producto.descripcion || ""
      : shortDescription(producto)
    : "";

  return (
    <div
      className={`magazine-card ${isFeature ? "magazine-card--feature" : ""} ${stateClass} ${isAssigning ? "is-assigning" : ""}`}
      data-density={density}
      onDrop={(e) => onDrop(e, slotId)}
      onDragOver={(e) => onDragOver(e, slotId)}
      onDragLeave={onDragLeave}
      onClick={onClick}
    >
      {producto ? (
        <div className="magazine-card-content">
          <div className="magazine-card-image-wrap">
            {getImageUrl(producto.imagen) ? (
              <img
                src={getImageUrl(producto.imagen)}
                alt={producto.nombre}
                className="magazine-card-image"
              />
            ) : (
              <div className="magazine-card-placeholder">Sin imagen</div>
            )}
          </div>
          <div className="magazine-card-text">
            {isFeature && showCategoria && producto.categoria && (
              <span className="magazine-card-badge">{producto.categoria}</span>
            )}
            <h3 className="magazine-card-title">{producto.nombre}</h3>
            {titleAccent}
            {description && <p className="magazine-card-desc">{description}</p>}
            <div className="magazine-card-price">
              {formatPrecio(producto.precio)}
            </div>
            <div className="magazine-card-shipping">
              {shippingIcon}
              Envio incluido
            </div>
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
