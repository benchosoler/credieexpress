import type { ProductoStrapi } from "../../../lib/strapi-types";
import type { MagazinePage } from "../types";
import MagazineCard from "../MagazineCard";
import { useSlotDnd } from "../useSlotDnd";

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
      <div className="template-header">
        <div className="header-brand">
          <span className="brand-initials gradient-brand">CE</span>
          <span className="brand-name">CREDIEXPRESS</span>
        </div>
        <div className="header-line"></div>
      </div>

      <div className="grid6-grid">
        {CELLS.map(({ id, label }) => (
          <MagazineCard
            key={id}
            producto={page.slots[id] || null}
            slotId={id}
            label={label}
            density="small"
            descriptionLines={3}
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
        .grid6-grid {
          flex: 1;
          padding: 5.65mm 12.71mm 0; /* 16px 36px */
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr 1fr;
          gap: 4.24mm; /* 12px */
          min-height: 0;
        }
      `}</style>
    </div>
  );
}
