import React from "react";
import type { ProductoStrapi } from "../../../lib/strapi-types";
import type { MagazinePage } from "../types";
import MagazineCard from "../MagazineCard";
import { useSlotDnd } from "../useSlotDnd";
import { GradientCircle, ConcentricCircles } from "../DecorativeElements";

interface HeroDuoProps {
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

export default function HeroDuo({
  page,
  selectedProductos,
  onAssignProduct,
  assigningProductId,
  onStartAssigning,
  pages = [],
}: HeroDuoProps) {
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
    <div className="template-hero-duo">
      <svg className="template-bg-svg" viewBox="0 0 595 842" fill="none">
        <rect width="595" height="842" fill="white" />
        <circle cx="520" cy="80" r="120" fill="#00B4D8" opacity="0.04" />
        <circle cx="520" cy="80" r="80" fill="#00B4D8" opacity="0.03" />
        <circle cx="520" cy="80" r="40" fill="#00B4D8" opacity="0.05" />
        <circle cx="75" cy="760" r="90" fill="#0096C7" opacity="0.03" />
        <circle cx="75" cy="760" r="55" fill="#0096C7" opacity="0.04" />
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
        <line
          x1="520"
          y1="798"
          x2="555"
          y2="798"
          stroke="#0096C7"
          strokeWidth="1.5"
          opacity="0.2"
          strokeLinecap="round"
        />
        {[0, 1, 2].map((i) => (
          <React.Fragment key={`dots-${i}`}>
            <circle
              cx={500 + i * 14}
              cy="750"
              r="1.2"
              fill="#00B4D8"
              opacity="0.15"
            />
            <circle
              cx={500 + i * 14}
              cy="762"
              r="1.2"
              fill="#00B4D8"
              opacity="0.15"
            />
          </React.Fragment>
        ))}
        <path
          d="M0 420 Q297 410 595 420"
          stroke="#00B4D8"
          strokeWidth="0.5"
          opacity="0.08"
        />
        {/* Hero/duo signature: a soft glow behind the hero slot and
         * concentric rings anchoring the secondary row. */}
        <GradientCircle
          id="hero-duo-glow"
          cx={297}
          cy={230}
          r={180}
          color1="var(--brand-azul)"
          color2="var(--brand-turquesa)"
          opacity={0.12}
        />
        <ConcentricCircles
          x={297}
          y={700}
          maxRadius={90}
          count={3}
          color="var(--brand-verde)"
          opacity={0.08}
        />
      </svg>

      <div className="template-header">
        <div className="header-brand">
          <span className="brand-initials gradient-brand">CE</span>
          <span className="brand-name">CREDIEXPRESS</span>
        </div>
        <div className="header-line"></div>
      </div>

      <div className="hero-slot-wrap">
        <MagazineCard
          producto={page.slots["hero"] || null}
          slotId="hero"
          label="Producto Principal"
          density="hero"
          showCategoria
          priceEmphasis
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onRemove={handleRemove}
          isDragOver={dragOverSlot === "hero"}
          onClick={() => handleSlotClick("hero")}
          isAssigning={isAssigning("hero")}
        />
      </div>

      <div className="hero-divider"></div>

      <div className="secondary-row">
        <MagazineCard
          producto={page.slots["secondary1"] || null}
          slotId="secondary1"
          label="Producto Secundario 1"
          density="medium"
          imageAspect="square"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onRemove={handleRemove}
          isDragOver={dragOverSlot === "secondary1"}
          onClick={() => handleSlotClick("secondary1")}
          isAssigning={isAssigning("secondary1")}
        />
        <MagazineCard
          producto={page.slots["secondary2"] || null}
          slotId="secondary2"
          label="Producto Secundario 2"
          density="medium"
          imageAspect="square"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onRemove={handleRemove}
          isDragOver={dragOverSlot === "secondary2"}
          onClick={() => handleSlotClick("secondary2")}
          isAssigning={isAssigning("secondary2")}
        />
      </div>

      <div className="template-footer">
        <span>crediexpress.com.ar</span>
        <span>11-6466-5339</span>
      </div>

      <style>{`
        .template-hero-duo {
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
        .hero-slot-wrap {
          flex: 1;
          padding: 5.65mm 12.71mm 0; /* 16px 36px */
          position: relative;
          z-index: 1;
          min-height: 0;
        }
        .hero-divider {
          height: 0.35mm; /* 1px */
          background: linear-gradient(90deg, transparent, #E8EDF2, transparent);
          margin: 0 12.71mm; /* 36px */
          position: relative;
          z-index: 1;
        }
        .secondary-row {
          flex: 1;
          padding: 5.65mm 12.71mm 0; /* 16px 36px */
          display: flex;
          gap: 7.06mm; /* 20px */
          position: relative;
          z-index: 1;
          min-height: 0;
        }
        .secondary-row .magazine-card {
          flex: 1;
        }
      `}</style>
    </div>
  );
}
