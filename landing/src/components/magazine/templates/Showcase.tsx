import type { ProductoStrapi } from "../../../lib/strapi-types";
import type { MagazinePage } from "../types";
import MagazineCard from "../MagazineCard";
import { useSlotDnd } from "../useSlotDnd";
import {
  AccentLine,
  GeometricDots,
  CornerDecoration,
} from "../DecorativeElements";

interface ShowcaseProps {
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

const cornerImagePlaceholder = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect
      x="2"
      y="2"
      width="12"
      height="12"
      rx="2"
      stroke="#CBD5E1"
      strokeWidth="1"
    />
    <circle cx="6" cy="7" r="1" fill="#CBD5E1" />
    <path d="M2 12l3-3 2 2 2-2 5 5" stroke="#CBD5E1" strokeWidth="1" />
  </svg>
);

export default function Showcase({
  page,
  selectedProductos,
  onAssignProduct,
  assigningProductId,
  onStartAssigning,
  pages = [],
}: ShowcaseProps) {
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
    <div className="template-showcase">
      <svg className="template-bg-svg" viewBox="0 0 595 842" fill="none">
        <rect width="595" height="842" fill="white" />
        <circle cx="297" cy="370" r="170" fill="#00B4D8" opacity="0.025" />
        <circle cx="297" cy="370" r="120" fill="#00B4D8" opacity="0.02" />
        <circle cx="560" cy="80" r="50" fill="#0096C7" opacity="0.04" />
        <circle cx="35" cy="760" r="60" fill="#0096C7" opacity="0.03" />
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
          rows={1}
          cols={4}
          spacing={10}
          dotSize={1}
          color="#00B4D8"
          opacity={0.15}
        />
        <path
          d="M0 421 Q297 411 595 421"
          stroke="#00B4D8"
          strokeWidth="0.5"
          opacity="0.06"
        />
        {/* Showcase signature: a corner anchor on the side opposite the
         * existing accent-line brand mark, distinguishing the "vitrina"
         * layout from dynamicQuad's shared accent-line/dots treatment. */}
        <CornerDecoration
          position="top-right"
          size={90}
          color="var(--brand-cyan)"
        />
      </svg>

      <div className="template-header">
        <div className="header-brand">
          <span className="brand-initials gradient-brand">CE</span>
          <span className="brand-name">CREDIEXPRESS</span>
        </div>
        <div className="header-line"></div>
      </div>

      <div className="showcase-layout">
        <div className="corner-top-left">
          <MagazineCard
            producto={page.slots["corner1"] || null}
            slotId="corner1"
            label="Esquina 1"
            density="small"
            variant="corner"
            removeIconSize={10}
            imagePlaceholder={cornerImagePlaceholder}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onRemove={handleRemove}
            isDragOver={dragOverSlot === "corner1"}
            onClick={() => handleSlotClick("corner1")}
            isAssigning={isAssigning("corner1")}
          />
        </div>
        <div className="corner-top-right">
          <MagazineCard
            producto={page.slots["corner2"] || null}
            slotId="corner2"
            label="Esquina 2"
            density="small"
            variant="corner"
            removeIconSize={10}
            imagePlaceholder={cornerImagePlaceholder}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onRemove={handleRemove}
            isDragOver={dragOverSlot === "corner2"}
            onClick={() => handleSlotClick("corner2")}
            isAssigning={isAssigning("corner2")}
          />
        </div>
        <div className="center-area">
          <MagazineCard
            producto={page.slots["center"] || null}
            slotId="center"
            label="Producto Central"
            density="hero"
            showCategoria
            priceEmphasis
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onRemove={handleRemove}
            isDragOver={dragOverSlot === "center"}
            onClick={() => handleSlotClick("center")}
            isAssigning={isAssigning("center")}
          />
        </div>
        <div className="corner-bottom">
          <MagazineCard
            producto={page.slots["corner3"] || null}
            slotId="corner3"
            label="Esquina 3"
            density="small"
            variant="corner"
            removeIconSize={10}
            imagePlaceholder={cornerImagePlaceholder}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onRemove={handleRemove}
            isDragOver={dragOverSlot === "corner3"}
            onClick={() => handleSlotClick("corner3")}
            isAssigning={isAssigning("corner3")}
          />
        </div>
      </div>

      <div className="template-footer">
        <span>crediexpress.com.ar</span>
        <span>11-6466-5339</span>
      </div>

      <style>{`
        .template-showcase {
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
        .showcase-layout {
          flex: 1;
          padding: 4.24mm 12.71mm 0; /* 12px 36px */
          position: relative;
          z-index: 1;
          min-height: 0;
          display: grid;
          grid-template-columns: 1fr 1.5fr 1fr;
          grid-template-rows: auto 1fr auto;
          gap: 4.24mm; /* 12px */
        }
        .corner-top-left {
          grid-column: 1;
          grid-row: 1;
        }
        .corner-top-right {
          grid-column: 3;
          grid-row: 1;
        }
        .center-area {
          grid-column: 1 / 4;
          grid-row: 2;
          min-height: 0;
        }
        .corner-bottom {
          grid-column: 2;
          grid-row: 3;
          justify-self: center;
          width: 100%;
          max-width: 63.53mm; /* 180px */
        }
      `}</style>
    </div>
  );
}
