import type { ProductoStrapi } from "../../../lib/strapi-types";
import type { MagazinePage } from "../types";
import MagazineCard from "../MagazineCard";
import { useSlotDnd } from "../useSlotDnd";
import { CornerDecoration } from "../DecorativeElements";

interface AsymmetricTrioProps {
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

export default function AsymmetricTrio({
  page,
  selectedProductos,
  onAssignProduct,
  assigningProductId,
  onStartAssigning,
  pages = [],
}: AsymmetricTrioProps) {
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
    <div className="template-asymmetric-trio">
      <svg className="template-bg-svg" viewBox="0 0 595 842" fill="none">
        <rect width="595" height="842" fill="white" />
        <circle cx="560" cy="420" r="160" fill="#00B4D8" opacity="0.03" />
        <circle cx="560" cy="420" r="110" fill="#00B4D8" opacity="0.02" />
        <circle cx="35" cy="120" r="70" fill="#0096C7" opacity="0.04" />
        <circle cx="35" cy="120" r="40" fill="#0096C7" opacity="0.03" />
        <line
          x1="40"
          y1="38"
          x2="90"
          y2="38"
          stroke="#00B4D8"
          strokeWidth="2"
          opacity="0.3"
          strokeLinecap="round"
        />
        <line
          x1="40"
          y1="44"
          x2="65"
          y2="44"
          stroke="#00B4D8"
          strokeWidth="1.5"
          opacity="0.2"
          strokeLinecap="round"
        />
        <rect
          x="550"
          y="770"
          width="20"
          height="20"
          rx="2"
          fill="#00B4D8"
          opacity="0.06"
          transform="rotate(45 560 780)"
        />
        {[0, 1, 2, 3].map((i) => (
          <circle
            key={`d-${i}`}
            cx={40 + i * 10}
            cy="800"
            r="1"
            fill="#0096C7"
            opacity="0.12"
          />
        ))}
        <path
          d="M0 300 Q150 290 297 300 Q445 310 595 300"
          stroke="#00B4D8"
          strokeWidth="0.5"
          opacity="0.06"
        />
        {/* Asymmetric-trio signature: a corner anchor on the side
         * opposite the existing top-left brand mark. */}
        <CornerDecoration
          position="top-right"
          size={90}
          color="var(--brand-verde)"
        />
      </svg>

      <div className="template-header">
        <div className="header-brand">
          <span className="brand-initials gradient-brand">CE</span>
          <span className="brand-name">CREDIEXPRESS</span>
        </div>
        <div className="header-line"></div>
      </div>

      <div className="main-content">
        <div className="left-column">
          <MagazineCard
            producto={page.slots["large"] || null}
            slotId="large"
            label="Producto Grande"
            density="large"
            showCategoria
            priceEmphasis
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onRemove={handleRemove}
            isDragOver={dragOverSlot === "large"}
            onClick={() => handleSlotClick("large")}
            isAssigning={isAssigning("large")}
          />
        </div>
        <div className="right-column">
          <MagazineCard
            producto={page.slots["topRight"] || null}
            slotId="topRight"
            label="Arriba Derecha"
            density="medium"
            imageAspect="wide"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onRemove={handleRemove}
            isDragOver={dragOverSlot === "topRight"}
            onClick={() => handleSlotClick("topRight")}
            isAssigning={isAssigning("topRight")}
          />
          <MagazineCard
            producto={page.slots["bottomRight"] || null}
            slotId="bottomRight"
            label="Abajo Derecha"
            density="medium"
            imageAspect="wide"
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
        .template-asymmetric-trio {
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
        .main-content {
          flex: 1;
          padding: 5.65mm 12.71mm 0; /* 16px 36px */
          display: flex;
          gap: 7.06mm; /* 20px */
          position: relative;
          z-index: 1;
          min-height: 0;
        }
        .left-column {
          flex: 1.3;
          min-height: 0;
        }
        .right-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 5.65mm; /* 16px */
          min-height: 0;
        }
        .right-column .magazine-card {
          flex: 1;
        }
      `}</style>
    </div>
  );
}
