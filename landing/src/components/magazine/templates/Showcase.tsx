import React from "react";
import type { ProductoStrapi } from "../../../lib/strapi-types";
import type { MagazinePage } from "../types";

interface CenterSlotProps {
  producto: ProductoStrapi | null;
  slotId: string;
  onDrop: (e: React.DragEvent, slotId: string) => void;
  onDragOver: (e: React.DragEvent, slotId: string) => void;
  onDragLeave: () => void;
  onRemove: (slotId: string) => void;
  isDragOver: boolean;
  onClick?: () => void;
  isAssigning?: boolean;
}

function CenterSlot({
  producto,
  slotId,
  onDrop,
  onDragOver,
  onDragLeave,
  onRemove,
  isDragOver,
  onClick,
  isAssigning = false,
}: CenterSlotProps) {
  return (
    <div
      className={`center-slot ${isDragOver ? "drag-over" : ""} ${producto ? "filled" : "empty"} ${isAssigning ? "assigning" : ""}`}
      onDrop={(e) => onDrop(e, slotId)}
      onDragOver={(e) => onDragOver(e, slotId)}
      onDragLeave={onDragLeave}
      onClick={onClick}
    >
      {producto ? (
        <div className="center-content">
          <div className="center-image-wrap">
            {producto.imagen?.url ? (
              <img
                src={
                  producto.imagen.formats?.large?.url ||
                  producto.imagen.formats?.medium?.url ||
                  producto.imagen.url
                }
                alt={producto.nombre}
                className="center-image"
              />
            ) : (
              <div className="center-placeholder">Sin imagen</div>
            )}
          </div>
          <div className="center-info">
            <h3 className="center-title">{producto.nombre}</h3>
            <div className="center-title-line"></div>
            {producto.descripcion && (
              <p className="center-desc">{producto.descripcion}</p>
            )}
            {producto.precio && (
              <div className="center-price">
                {new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  maximumFractionDigits: 0,
                }).format(producto.precio)}
              </div>
            )}
            <div className="center-shipping">Envio incluido</div>
          </div>
          <button
            className="center-remove"
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
        <div className="center-empty">
          <span className="center-empty-label">
            {isAssigning ? "Click para colocar" : "Producto Central"}
          </span>
        </div>
      )}
    </div>
  );
}

interface CornerSlotProps {
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

function CornerSlot({
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
}: CornerSlotProps) {
  return (
    <div
      className={`corner-slot ${isDragOver ? "drag-over" : ""} ${producto ? "filled" : "empty"} ${isAssigning ? "assigning" : ""}`}
      onDrop={(e) => onDrop(e, slotId)}
      onDragOver={(e) => onDragOver(e, slotId)}
      onDragLeave={onDragLeave}
      onClick={onClick}
    >
      {producto ? (
        <div className="corner-content">
          <div className="corner-image-wrap">
            {producto.imagen?.url ? (
              <img
                src={
                  producto.imagen.formats?.small?.url ||
                  producto.imagen.formats?.thumbnail?.url ||
                  producto.imagen.url
                }
                alt={producto.nombre}
                className="corner-image"
              />
            ) : (
              <div className="corner-placeholder">
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
                  <path
                    d="M2 12l3-3 2 2 2-2 5 5"
                    stroke="#CBD5E1"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="corner-info">
            <span className="corner-name">{producto.nombre}</span>
            {producto.precio && (
              <span className="corner-price">
                {new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  maximumFractionDigits: 0,
                }).format(producto.precio)}
              </span>
            )}
          </div>
          <button
            className="corner-remove"
            onClick={() => onRemove(slotId)}
            title="Quitar producto"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M2 2l6 6M8 2l-6 6"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      ) : (
        <div className="corner-empty">
          <span className="corner-empty-label">
            {isAssigning ? "Click para colocar" : label}
          </span>
        </div>
      )}
    </div>
  );
}

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

export default function Showcase({
  page,
  selectedProductos,
  onAssignProduct,
  assigningProductId,
  onStartAssigning,
  pages = [],
}: ShowcaseProps) {
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
    <div className="template-showcase">
      <svg className="template-bg-svg" viewBox="0 0 595 842" fill="none">
        <rect width="595" height="842" fill="white" />
        <circle cx="297" cy="370" r="170" fill="#00B4D8" opacity="0.025" />
        <circle cx="297" cy="370" r="120" fill="#00B4D8" opacity="0.02" />
        <circle cx="560" cy="80" r="50" fill="#0096C7" opacity="0.04" />
        <circle cx="35" cy="760" r="60" fill="#0096C7" opacity="0.03" />
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
        <line
          x1="505"
          y1="804"
          x2="555"
          y2="804"
          stroke="#0096C7"
          strokeWidth="2"
          opacity="0.3"
          strokeLinecap="round"
        />
        {[0, 1, 2, 3].map((i) => (
          <circle
            key={`d-${i}`}
            cx={520 + i * 10}
            cy="760"
            r="1"
            fill="#00B4D8"
            opacity="0.15"
          />
        ))}
        <path
          d="M0 421 Q297 411 595 421"
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

      <div className="showcase-layout">
        <div className="corner-top-left">
          <CornerSlot
            producto={page.slots["corner1"] || null}
            slotId="corner1"
            label="Esquina 1"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onRemove={handleRemove}
            isDragOver={dragOverSlot === "corner1"}
            onClick={() => handleSlotClick("corner1")}
            isAssigning={assigningProductId !== null && !page.slots["corner1"]}
          />
        </div>
        <div className="corner-top-right">
          <CornerSlot
            producto={page.slots["corner2"] || null}
            slotId="corner2"
            label="Esquina 2"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onRemove={handleRemove}
            isDragOver={dragOverSlot === "corner2"}
            onClick={() => handleSlotClick("corner2")}
            isAssigning={assigningProductId !== null && !page.slots["corner2"]}
          />
        </div>
        <div className="center-area">
          <CenterSlot
            producto={page.slots["center"] || null}
            slotId="center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onRemove={handleRemove}
            isDragOver={dragOverSlot === "center"}
            onClick={() => handleSlotClick("center")}
            isAssigning={assigningProductId !== null && !page.slots["center"]}
          />
        </div>
        <div className="corner-bottom">
          <CornerSlot
            producto={page.slots["corner3"] || null}
            slotId="corner3"
            label="Esquina 3"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onRemove={handleRemove}
            isDragOver={dragOverSlot === "corner3"}
            onClick={() => handleSlotClick("corner3")}
            isAssigning={assigningProductId !== null && !page.slots["corner3"]}
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
        .showcase-layout {
          flex: 1;
          padding: 12px 36px 0;
          position: relative;
          z-index: 1;
          min-height: 0;
          display: grid;
          grid-template-columns: 1fr 1.5fr 1fr;
          grid-template-rows: auto 1fr auto;
          gap: 12px;
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
          max-width: 180px;
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
        .center-slot {
          border-radius: 8px;
          position: relative;
          transition: all 0.2s;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .center-slot.filled { background: transparent; }
        .center-slot.empty {
          border: 1.5px dashed #E8EDF2;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .center-slot.assigning {
          border-color: #00B4D8;
          border-style: solid;
          background: rgba(0, 180, 216, 0.06);
          animation: pulse-border 1.5s infinite;
        }
        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 0 2px rgba(0, 180, 216, 0.15); }
          50% { box-shadow: 0 0 0 4px rgba(0, 180, 216, 0.08); }
        }
        .center-slot.drag-over {
          border-color: #00B4D8;
          background: rgba(0, 180, 216, 0.04);
        }
        .center-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 12px;
          position: relative;
        }
        .center-image-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          min-height: 0;
        }
        .center-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        .center-placeholder {
          color: #CBD5E1;
          font-size: 10px;
        }
        .center-info {
          text-align: center;
          padding-top: 8px;
        }
        .center-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14px;
          color: #1A1A2E;
          margin: 0 0 4px;
          padding-bottom: 4px;
          border-bottom: 2px solid #00B4D8;
          display: inline-block;
          line-height: 1.2;
        }
        .center-title-line { display: none; }
        .center-desc {
          font-size: 8px;
          color: #64748B;
          margin: 4px 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .center-price {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: #00B4D8;
          margin-top: 4px;
        }
        .center-shipping {
          font-size: 7px;
          color: #00C853;
          font-weight: 600;
          letter-spacing: 0.3px;
          margin-top: 2px;
        }
        .center-remove {
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
        .center-content:hover .center-remove { opacity: 1; }
        .center-remove:hover {
          background: #EF4444;
          border-color: #EF4444;
          color: white;
        }
        .center-empty-label {
          font-size: 9px;
          color: #CBD5E1;
          font-weight: 500;
        }
        .center-slot.assigning .center-empty-label {
          color: #00B4D8;
          font-weight: 600;
        }
        .corner-empty-label {
          font-size: 8px;
          color: #CBD5E1;
          font-weight: 500;
        }
        .corner-slot.assigning .corner-empty-label {
          color: #00B4D8;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
