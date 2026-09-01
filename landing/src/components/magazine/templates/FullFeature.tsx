import type { ProductoStrapi } from "../../../lib/strapi-types";
import type { MagazinePage } from "../types";
import MagazineCard from "../MagazineCard";
import { useSlotDnd } from "../useSlotDnd";

interface FullFeatureProps {
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

export default function FullFeature({
  page,
  selectedProductos,
  onAssignProduct,
  assigningProductId,
  onStartAssigning,
  pages = [],
}: FullFeatureProps) {
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
    <div className="template-full-feature">
      <svg className="template-bg-svg" viewBox="0 0 595 842" fill="none">
        <rect width="595" height="842" fill="white" />
        <circle cx="297" cy="380" r="200" fill="#00B4D8" opacity="0.025" />
        <circle cx="297" cy="380" r="140" fill="#00B4D8" opacity="0.02" />
        <circle cx="297" cy="380" r="80" fill="#00B4D8" opacity="0.015" />
        <circle cx="560" cy="80" r="60" fill="#0096C7" opacity="0.04" />
        <circle cx="35" cy="760" r="80" fill="#0096C7" opacity="0.03" />
        <line
          x1="40"
          y1="38"
          x2="100"
          y2="38"
          stroke="#00B4D8"
          strokeWidth="2"
          opacity="0.3"
          strokeLinecap="round"
        />
        <line
          x1="40"
          y1="44"
          x2="75"
          y2="44"
          stroke="#00B4D8"
          strokeWidth="1.5"
          opacity="0.2"
          strokeLinecap="round"
        />
        <line
          x1="495"
          y1="804"
          x2="555"
          y2="804"
          stroke="#0096C7"
          strokeWidth="2"
          opacity="0.3"
          strokeLinecap="round"
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <circle
            key={`d-${i}`}
            cx={520 + i * 12}
            cy="760"
            r="1.2"
            fill="#00B4D8"
            opacity="0.15"
          />
        ))}
        <path
          d="M0 600 Q297 590 595 600"
          stroke="#00B4D8"
          strokeWidth="0.5"
          opacity="0.06"
        />
        <path
          d="M0 200 Q297 210 595 200"
          stroke="#0096C7"
          strokeWidth="0.5"
          opacity="0.05"
        />
      </svg>

      <div className="template-header">
        <div className="header-brand">
          <span className="brand-initials gradient-brand">CE</span>
          <span className="brand-name">CREDIEXPRESS</span>
        </div>
        <div className="header-line"></div>
      </div>

      <div className="featured-area">
        <MagazineCard
          producto={page.slots["featured"] || null}
          slotId="featured"
          label="Arrastra un producto aqui"
          density="hero"
          variant="feature"
          descriptionMode="full"
          showCategoria
          removeIconSize={16}
          titleAccent={<div className="magazine-card-title-line" />}
          shippingIcon={
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M1 6h4l1-3h4v6H2V6z"
                stroke="var(--brand-verde)"
                strokeWidth="1"
                strokeLinejoin="round"
              />
              <circle cx="3.5" cy="9" r="1" fill="var(--brand-verde)" />
              <circle cx="8.5" cy="9" r="1" fill="var(--brand-verde)" />
            </svg>
          }
          emptyIcon={
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect
                x="4"
                y="4"
                width="24"
                height="24"
                rx="4"
                stroke="#CBD5E1"
                strokeWidth="1.5"
              />
              <circle cx="12" cy="14" r="2" fill="#CBD5E1" />
              <path
                d="M4 24l6-6 4 4 4-4 10 10"
                stroke="#CBD5E1"
                strokeWidth="1.5"
              />
            </svg>
          }
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onRemove={handleRemove}
          isDragOver={dragOverSlot === "featured"}
          onClick={() => handleSlotClick("featured")}
          isAssigning={isAssigning("featured")}
        />
      </div>

      <div className="template-footer">
        <span>crediexpress.com.ar</span>
        <span>11-6466-5339</span>
      </div>

      <style>{`
        .template-full-feature {
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
        .featured-area {
          flex: 1;
          padding: 8.47mm 16.94mm; /* 24px 48px */
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 0;
        }
        .featured-area .magazine-card {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
}
