import type { ProductoStrapi } from "../../../lib/strapi-types";
import type { MagazinePage } from "../types";
import MagazineCard from "../MagazineCard";
import { useSlotDnd } from "../useSlotDnd";
import {
  GeometricDots,
  AccentLine,
  ConcentricCircles,
} from "../DecorativeElements";

interface Grid4Props {
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
];

/**
 * A true equal-cell 2x2 grid: 4 products, all cells the same width and
 * height (equal `fr` tracks on both axes). Deliberately a separate
 * template from `dynamicQuad`, whose `1.2fr 1fr` / `1fr 1.2fr` asymmetric
 * tracks stay untouched — see "Additive Template Registry" in the
 * magazine-page-templates spec.
 */
export default function Grid4({
  page,
  selectedProductos,
  onAssignProduct,
  assigningProductId,
  onStartAssigning,
  pages = [],
}: Grid4Props) {
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
    <div className="template-grid4">
      <svg className="template-bg-svg" viewBox="0 0 595 842" fill="none">
        <rect width="595" height="842" fill="white" />
        <GeometricDots
          x={500}
          y={60}
          rows={3}
          cols={5}
          spacing={11}
          dotSize={1.3}
          color="var(--brand-turquesa)"
          opacity={0.14}
        />
        <AccentLine
          x1={40}
          y1={40}
          x2={95}
          y2={40}
          color="var(--brand-azul)"
          width={2}
          opacity={0.28}
        />
        <ConcentricCircles
          x={30}
          y={800}
          maxRadius={70}
          count={4}
          color="var(--brand-verde)"
          opacity={0.1}
        />
      </svg>

      <div className="template-header">
        <div className="header-brand">
          <span className="brand-initials gradient-brand">CE</span>
          <span className="brand-name">CREDIEXPRESS</span>
        </div>
        <div className="header-line"></div>
      </div>

      <div className="grid4-grid">
        {CELLS.map(({ id, label }, idx) => (
          <MagazineCard
            key={id}
            producto={page.slots[id] || null}
            slotId={id}
            label={label}
            density="medium"
            indexBadge={idx + 1}
            showCategoria
            priceEmphasis
            imageAspect="square"
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
        .template-grid4 {
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
        .grid4-grid {
          flex: 1;
          padding: 5.65mm 12.71mm 0; /* 16px 36px */
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 5.65mm; /* 16px */
          min-height: 0;
          position: relative;
          z-index: 1;
        }
        .grid4-grid .magazine-card.is-filled {
          border: 0.35mm solid var(--brand-gris-medio);
        }
      `}</style>
    </div>
  );
}
