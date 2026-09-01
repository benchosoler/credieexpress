import type { ProductoStrapi } from "../../../lib/strapi-types";
import type { MagazinePage } from "../types";
import MagazineCard from "../MagazineCard";
import { useSlotDnd } from "../useSlotDnd";
import { AccentLine, GeometricDots } from "../DecorativeElements";

interface DynamicQuadProps {
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

export default function DynamicQuad({
  page,
  selectedProductos,
  onAssignProduct,
  assigningProductId,
  onStartAssigning,
  pages = [],
}: DynamicQuadProps) {
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
    <div className="template-dynamic-quad">
      <svg className="template-bg-svg" viewBox="0 0 595 842" fill="none">
        <rect width="595" height="842" fill="white" />
        <circle cx="0" cy="0" r="100" fill="#00B4D8" opacity="0.03" />
        <circle cx="595" cy="842" r="100" fill="#0096C7" opacity="0.03" />
        <circle cx="297" cy="421" r="180" fill="#00B4D8" opacity="0.015" />
        <AccentLine
          x1={40}
          y1={38}
          x2={90}
          y2={38}
          color="#00B4D8"
          width={2}
          opacity={0.3}
        />
        <AccentLine
          x1={40}
          y1={44}
          x2={65}
          y2={44}
          color="#00B4D8"
          width={1.5}
          opacity={0.2}
        />
        <AccentLine
          x1={505}
          y1={804}
          x2={555}
          y2={804}
          color="#0096C7"
          width={2}
          opacity={0.3}
        />
        <GeometricDots
          x={520}
          y={760}
          rows={2}
          cols={3}
          spacing={12}
          dotSize={1.2}
          color="#00B4D8"
          opacity={0.15}
        />
        <path
          d="M0 421 Q297 411 595 421"
          stroke="#00B4D8"
          strokeWidth="0.5"
          opacity="0.06"
        />
        <path
          d="M297 0 Q307 421 297 842"
          stroke="#0096C7"
          strokeWidth="0.5"
          opacity="0.04"
        />
      </svg>

      <div className="template-header">
        <div className="header-brand">
          <span className="brand-initials gradient-brand">CE</span>
          <span className="brand-name">CREDIEXPRESS</span>
        </div>
        <div className="header-line"></div>
      </div>

      <div className="quad-grid">
        <div className="quad-tl">
          <MagazineCard
            producto={page.slots["topLeft"] || null}
            slotId="topLeft"
            label="Arriba Izquierda"
            density="large"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onRemove={handleRemove}
            isDragOver={dragOverSlot === "topLeft"}
            onClick={() => handleSlotClick("topLeft")}
            isAssigning={isAssigning("topLeft")}
          />
        </div>
        <div className="quad-tr">
          <MagazineCard
            producto={page.slots["topRight"] || null}
            slotId="topRight"
            label="Arriba Derecha"
            density="medium"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onRemove={handleRemove}
            isDragOver={dragOverSlot === "topRight"}
            onClick={() => handleSlotClick("topRight")}
            isAssigning={isAssigning("topRight")}
          />
        </div>
        <div className="quad-bl">
          <MagazineCard
            producto={page.slots["bottomLeft"] || null}
            slotId="bottomLeft"
            label="Abajo Izquierda"
            density="medium"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onRemove={handleRemove}
            isDragOver={dragOverSlot === "bottomLeft"}
            onClick={() => handleSlotClick("bottomLeft")}
            isAssigning={isAssigning("bottomLeft")}
          />
        </div>
        <div className="quad-br">
          <MagazineCard
            producto={page.slots["bottomRight"] || null}
            slotId="bottomRight"
            label="Abajo Derecha"
            density="medium"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onRemove={handleRemove}
            isDragOver={dragOverSlot === "bottomRight"}
            onClick={() => handleSlotClick("bottomRight")}
            isAssigning={isAssigning("bottomRight")}
          />
        </div>
      </div>

      <div className="template-footer">
        <span>crediexpress.com.ar</span>
        <span>11-6466-5339</span>
      </div>

      <style>{`
        .template-dynamic-quad {
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
        .quad-grid {
          flex: 1;
          padding: 5.65mm 12.71mm 0; /* 16px 36px */
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          grid-template-rows: 1fr 1.2fr;
          gap: 5.65mm; /* 16px */
          position: relative;
          z-index: 1;
          min-height: 0;
        }
        .quad-tl { grid-column: 1; grid-row: 1; }
        .quad-tr { grid-column: 2; grid-row: 1; }
        .quad-bl { grid-column: 1; grid-row: 2; }
        .quad-br { grid-column: 2; grid-row: 2; }
      `}</style>
    </div>
  );
}
