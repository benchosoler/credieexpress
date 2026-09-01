import React from "react";
import type { ProductoStrapi } from "../../../lib/strapi-types";
import type { MagazinePage } from "../types";

interface SlotProps {
  producto: ProductoStrapi | null;
  slotId: string;
  label: string;
  onDrop: (e: React.DragEvent, slotId: string) => void;
  onDragOver: (e: React.DragEvent, slotId: string) => void;
  onDragLeave: () => void;
  onRemove: (slotId: string) => void;
  isDragOver: boolean;
  onClick?: () => void;
  isAssigning?: boolean;
}

function ProductSlot({
  producto,
  slotId,
  label,
  onDrop,
  onDragOver,
  onDragLeave,
  onRemove,
  isDragOver,
  onClick,
  isAssigning = false,
}: SlotProps) {
  return (
    <div
      className={`slot-area ${isDragOver ? "drag-over" : ""} ${producto ? "filled" : "empty"} ${isAssigning ? "assigning" : ""}`}
      onDrop={(e) => onDrop(e, slotId)}
      onDragOver={(e) => onDragOver(e, slotId)}
      onDragLeave={onDragLeave}
      onClick={onClick}
    >
      {producto ? (
        <div className="slot-content">
          <div className="slot-image-wrap">
            {producto.imagen?.url ? (
              <img
                src={
                  producto.imagen.formats?.medium?.url ||
                  producto.imagen.formats?.small?.url ||
                  producto.imagen.url
                }
                alt={producto.nombre}
                className="slot-image"
              />
            ) : (
              <div className="slot-placeholder">Sin imagen</div>
            )}
          </div>
          <div className="slot-text">
            <h3 className="slot-title">{producto.nombre}</h3>
            {producto.descripcion && (
              <p className="slot-desc">{producto.descripcion}</p>
            )}
            {producto.precio && (
              <div className="slot-price">
                {new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  maximumFractionDigits: 0,
                }).format(producto.precio)}
              </div>
            )}
            <div className="slot-shipping">Envio incluido</div>
          </div>
          <button
            className="slot-remove"
            onClick={() => onRemove(slotId)}
            title="Quitar producto"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
        <div className="slot-empty">
          <span className="slot-empty-label">
            {isAssigning ? "Click para colocar" : label}
          </span>
        </div>
      )}
    </div>
  );
}

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
  const [dragOverSlot, setDragOverSlot] = React.useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    setDragOverSlot(slotId);
  };

  const handleDragLeave = () => setDragOverSlot(null);

  const handleDrop = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    setDragOverSlot(null);
    const docId = e.dataTransfer.getData("text/plain");
    const producto = selectedProductos.find((p) => p.documentId === docId);
    if (producto) onAssignProduct(page.id, slotId, producto);
  };

  const handleRemove = (slotId: string) => {
    onAssignProduct(page.id, slotId, null);
  };

  const handleSlotClick = (slotId: string) => {
    if (assigningProductId && !page.slots[slotId]) {
      const producto = selectedProductos.find(
        (p) => p.documentId === assigningProductId,
      );
      if (producto) {
        // Remover de otras ubicaciones si ya está en la revista
        pages.forEach((p) => {
          Object.entries(p.slots).forEach(([sid, prod]) => {
            if (prod && (prod as any).documentId === assigningProductId) {
              onAssignProduct(p.id, sid, null);
            }
          });
        });
        onAssignProduct(page.id, slotId, producto);
        onStartAssigning?.(null);
      }
    }
  };

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
      </svg>

      <div className="template-header">
        <div className="header-brand">
          <span className="brand-initials">CE</span>
          <span className="brand-name">CREDIEXPRESS</span>
        </div>
        <div className="header-line"></div>
      </div>

      <div className="main-content">
        <div className="left-column">
          <ProductSlot
            producto={page.slots["large"] || null}
            slotId="large"
            label="Producto Grande"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onRemove={handleRemove}
            isDragOver={dragOverSlot === "large"}
            onClick={() => handleSlotClick("large")}
            isAssigning={assigningProductId !== null && !page.slots["large"]}
          />
        </div>
        <div className="right-column">
          <ProductSlot
            producto={page.slots["topRight"] || null}
            slotId="topRight"
            label="Arriba Derecha"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onRemove={handleRemove}
            isDragOver={dragOverSlot === "topRight"}
            onClick={() => handleSlotClick("topRight")}
            isAssigning={assigningProductId !== null && !page.slots["topRight"]}
          />
          <ProductSlot
            producto={page.slots["bottomRight"] || null}
            slotId="bottomRight"
            label="Abajo Derecha"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onRemove={handleRemove}
            isDragOver={dragOverSlot === "bottomRight"}
            onClick={() => handleSlotClick("bottomRight")}
            isAssigning={
              assigningProductId !== null && !page.slots["bottomRight"]
            }
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
        .template-header {
          padding: 28px 36px 12px;
          position: relative;
          z-index: 1;
        }
        .header-brand {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .brand-initials {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #1E90FF, #00C853);
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 9px;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
        }
        .brand-name {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 13px;
          color: #1A1A2E;
          letter-spacing: 1px;
        }
        .header-line {
          height: 2px;
          background: linear-gradient(90deg, #00B4D8, transparent);
          margin-top: 8px;
        }
        .main-content {
          flex: 1;
          padding: 16px 36px 0;
          display: flex;
          gap: 20px;
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
          gap: 16px;
          min-height: 0;
        }
        .template-footer {
          padding: 12px 36px 20px;
          display: flex;
          justify-content: space-between;
          font-size: 8px;
          color: #94A3B8;
          letter-spacing: 0.5px;
          position: relative;
          z-index: 1;
        }
        .slot-area {
          border-radius: 8px;
          position: relative;
          transition: all 0.2s;
          height: 100%;
        }
        .right-column .slot-area {
          flex: 1;
        }
        .slot-area.filled {
          background: transparent;
        }
        .slot-area.empty {
          border: 1.5px dashed #E8EDF2;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .slot-area.assigning {
          border-color: #00B4D8;
          border-style: solid;
          background: rgba(0, 180, 216, 0.06);
          animation: pulse-border 1.5s infinite;
        }
        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 0 2px rgba(0, 180, 216, 0.15); }
          50% { box-shadow: 0 0 0 4px rgba(0, 180, 216, 0.08); }
        }
        .slot-area.drag-over {
          border-color: #00B4D8;
          background: rgba(0, 180, 216, 0.04);
        }
        .slot-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 12px;
          position: relative;
        }
        .slot-image-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          min-height: 0;
        }
        .slot-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        .slot-placeholder {
          color: #CBD5E1;
          font-size: 10px;
        }
        .slot-text {
          padding-top: 8px;
        }
        .slot-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 11px;
          color: #1A1A2E;
          margin: 0 0 3px;
          padding-bottom: 3px;
          border-bottom: 2px solid #00B4D8;
          display: inline-block;
          line-height: 1.2;
        }
        .slot-desc {
          font-size: 8px;
          color: #64748B;
          margin: 3px 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .slot-price {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 13px;
          color: #00B4D8;
          margin-top: 4px;
        }
        .slot-shipping {
          font-size: 7px;
          color: #00C853;
          font-weight: 600;
          letter-spacing: 0.3px;
          margin-top: 2px;
        }
        .slot-remove {
          position: absolute;
          top: 6px;
          right: 6px;
          background: rgba(255,255,255,0.9);
          border: 1px solid #E8EDF2;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #94A3B8;
          transition: all 0.15s;
          opacity: 0;
        }
        .slot-content:hover .slot-remove {
          opacity: 1;
        }
        .slot-remove:hover {
          background: #EF4444;
          border-color: #EF4444;
          color: white;
        }
        .slot-empty-label {
          font-size: 9px;
          color: #CBD5E1;
          font-weight: 500;
        }
        .slot-area.assigning .slot-empty-label {
          color: #00B4D8;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
