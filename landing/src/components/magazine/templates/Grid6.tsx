import type { ProductoStrapi } from "../../../lib/strapi-types";
import type { MagazinePage } from "../types";
import MagazineCard from "../MagazineCard";
import { useSlotDnd } from "../useSlotDnd";
import { AccentLine, GeometricDots } from "../DecorativeElements";

interface Grid6Props {
  page: MagazinePage;
  selectedProductos: ProductoStrapi[];
  onAssignProduct: (
    pageId: string,
    slotId: string,
    producto: ProductoStrapi | null,
  ) => void;
  assigningProductId?: string | null;
  onStartAssigning?: (docId: string | null) => void;
  pages?: MagazinePage[];
}

const CELLS = [
  { id: "cell1", label: "Celda 1" },
  { id: "cell2", label: "Celda 2" },
  { id: "cell3", label: "Celda 3" },
  { id: "cell4", label: "Celda 4" },
  { id: "cell5", label: "Celda 5" },
  { id: "cell6", label: "Celda 6" },
];

/**
 * 2x3 grid of 6 product cells (~90x82mm each). Wider text column than the
 * standard 2-line clamp assumes, so cells here render 3 lines of
 * description (`descriptionLines={3}`) — see the `descripcionCorta`
 * budget in design.md: 160 chars at 9pt fits ~3 lines with headroom.
 */
export default function Grid6({
  page,
  selectedProductos,
  onAssignProduct,
  assigningProductId,
  onStartAssigning,
  pages = [],
}: Grid6Props) {
  const {
    dragOverSlot,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemove,
    handleSlotClick,
    isAssigning,
  } = useSlotDnd({
    page,
    selectedProductos,
    onAssignProduct,
    assigningProductId,
    onStartAssigning,
    pages,
  });

  return (
    <div className="template-grid6">
      <svg className="template-bg-svg" viewBox="0 0 595 842" fill="none">
        <rect width="595" height="842" fill="white" />
        <AccentLine
          x1={40}
          y1={40}
          x2={80}
          y2={40}
          color="var(--brand-cyan)"
          width={1.5}
          opacity={0.25}
        />
        <GeometricDots
          x={525}
          y={805}
          rows={2}
          cols={4}
          spacing={9}
          dotSize={1}
          color="var(--brand-cyan)"
          opacity={0.12}
        />
      </svg>

      <div className="template-header">
        <div className="header-brand">
          <span className="brand-initials gradient-brand">CE</span>
          <span className="brand-name">CREDIEXPRESS</span>
        </div>
        <div className="header-line"></div>
      </div>

      <div className="grid6-grid">
        {CELLS.map(({ id, label }, idx) => (
          <MagazineCard
            key={id}
            producto={page.slots[id] || null}
            slotId={id}
            label={label}
            density="small"
            descriptionLines={3}
            indexBadge={idx + 1}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onRemove={handleRemove}
            isDragOver={dragOverSlot === id}
            onClick={() => handleSlotClick(id)}
            isAssigning={isAssigning(id)}
          />
        ))}
      </div>

      <div className="template-footer">
        <span>crediexpress.com.ar</span>
        <span>11-6466-5339</span>
      </div>

      <style>{`
        .template-grid6 {
          width: 100%;
          height: 100%;
          position: relative;
          background: white;
          display: flex;
          flex-direction: column;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .template-bg-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }
        .grid6-grid {
          flex: 1;
          padding: 5.65mm 12.71mm 0; /* 16px 36px */
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr 1fr;
          gap: 4.24mm; /* 12px */
          min-height: 0;
          position: relative;
          z-index: 1;
        }
        /*
         * Restrained zebra tint for rhythm across the dense 6-cell grid —
         * a light background wash, not a border or extra chrome, so it
         * doesn't compete with the tight 9pt description text.
         */
        .grid6-grid > .magazine-card:nth-child(even).is-filled {
          background: color-mix(in srgb, var(--brand-cyan) 4%, white);
        }
      `}</style>
    </div>
  );
}
