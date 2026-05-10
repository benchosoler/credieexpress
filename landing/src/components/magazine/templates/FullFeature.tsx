import React from "react";
import type { ProductoStrapi } from "../../../lib/strapi-types";
import type { MagazinePage } from "../types";

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
  const [dragOver, setDragOver] = React.useState(false);
  const producto = page.slots["featured"] as ProductoStrapi | null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const docId = e.dataTransfer.getData("text/plain");
    const prod = selectedProductos.find((p) => p.documentId === docId);
    if (prod) onAssignProduct(page.id, "featured", prod);
  };

  const handleRemove = () => onAssignProduct(page.id, "featured", null);

  const handleSlotClick = () => {
    if (assigningProductId && !page.slots["featured"]) {
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
        onAssignProduct(page.id, "featured", producto);
        onStartAssigning?.(null);
      }
    }
  };

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
          <span className="brand-initials">CE</span>
          <span className="brand-name">CREDIEXPRESS</span>
        </div>
        <div className="header-line"></div>
      </div>

      <div
        className={`featured-area ${dragOver ? "drag-over" : ""} ${producto ? "filled" : "empty"} ${assigningProductId && !producto ? "assigning" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleSlotClick}
      >
        {producto ? (
          <div className="featured-content">
            <div className="featured-image-section">
              {producto.imagen?.url ? (
                <img
                  src={
                    producto.imagen.formats?.large?.url ||
                    producto.imagen.formats?.medium?.url ||
                    producto.imagen.url
                  }
                  alt={producto.nombre}
                  className="featured-image"
                />
              ) : (
                <div className="featured-placeholder">Sin imagen</div>
              )}
            </div>
            <div className="featured-info">
              <div className="featured-category">
                {producto.categoria && (
                  <span className="category-badge">{producto.categoria}</span>
                )}
              </div>
              <h2 className="featured-title">{producto.nombre}</h2>
              <div className="featured-title-line"></div>
              {producto.descripcion && (
                <p className="featured-description">{producto.descripcion}</p>
              )}
              {producto.precio && (
                <div className="featured-price">
                  {new Intl.NumberFormat("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    maximumFractionDigits: 0,
                  }).format(producto.precio)}
                </div>
              )}
              <div className="featured-shipping">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M1 6h4l1-3h4v6H2V6z"
                    stroke="#00C853"
                    strokeWidth="1"
                    strokeLinejoin="round"
                  />
                  <circle cx="3.5" cy="9" r="1" fill="#00C853" />
                  <circle cx="8.5" cy="9" r="1" fill="#00C853" />
                </svg>
                Envio incluido
              </div>
            </div>
            <button
              className="featured-remove"
              onClick={handleRemove}
              title="Quitar producto"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="featured-empty">
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
            <span className="featured-empty-label">
              {assigningProductId ? "Click para colocar" : "Arrastra un producto aqui"}
            </span>
          </div>
        )}
      </div>

      <div className="template-footer">
        <span>crediexpress.com.ar</span>
        <span>11-6466-5339</span>
      </div>

      <style>{`
        .template-full-feature {
          width: 595px;
          height: 842px;
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
        .featured-area {
          flex: 1;
          padding: 24px 48px;
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 0;
        }
        .featured-area.empty {
          border: 2px dashed #E8EDF2;
          border-radius: 12px;
          margin: 12px 36px;
          cursor: pointer;
        }
        .featured-area.assigning {
          border-color: #00B4D8;
          border-style: solid;
          background: rgba(0, 180, 216, 0.06);
          animation: pulse-border 1.5s infinite;
        }
        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 0 3px rgba(0, 180, 216, 0.15); }
          50% { box-shadow: 0 0 0 5px rgba(0, 180, 216, 0.08); }
        }
        .featured-area.drag-over {
          border-color: #00B4D8;
          background: rgba(0, 180, 216, 0.03);
        }
        .featured-content {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .featured-image-section {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 0;
        }
        .featured-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        .featured-placeholder {
          color: #CBD5E1;
          font-size: 12px;
        }
        .featured-info {
          text-align: center;
          padding: 16px 0 8px;
        }
        .category-badge {
          display: inline-block;
          padding: 3px 12px;
          background: rgba(0, 180, 216, 0.08);
          color: #00B4D8;
          font-size: 8px;
          font-weight: 600;
          border-radius: 12px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .featured-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 22px;
          color: #1A1A2E;
          margin: 10px 0 6px;
          line-height: 1.2;
        }
        .featured-title-line {
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #00B4D8, #0096C7);
          margin: 0 auto 12px;
          border-radius: 2px;
        }
        .featured-description {
          font-size: 10px;
          color: #64748B;
          line-height: 1.6;
          max-width: 400px;
          margin: 0 auto 12px;
        }
        .featured-price {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 28px;
          color: #00B4D8;
          margin-bottom: 6px;
        }
        .featured-shipping {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 9px;
          color: #00C853;
          font-weight: 600;
          letter-spacing: 0.3px;
        }
        .featured-remove {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255,255,255,0.9);
          border: 1px solid #E8EDF2;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #94A3B8;
          transition: all 0.15s;
          opacity: 0;
        }
        .featured-content:hover .featured-remove {
          opacity: 1;
        }
        .featured-remove:hover {
          background: #EF4444;
          border-color: #EF4444;
          color: white;
        }
        .featured-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: #CBD5E1;
        }
        .featured-empty-label {
          font-size: 10px;
          font-weight: 500;
        }
        .featured-area.assigning .featured-empty-label {
          color: #00B4D8;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
