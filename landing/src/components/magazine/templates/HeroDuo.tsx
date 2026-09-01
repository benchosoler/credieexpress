import React from "react";
import type { ProductoStrapi } from "../../../lib/strapi-types";
import type { MagazinePage } from "../types";

interface SlotProps {
  producto: ProductoStrapi | null;
  slotId: string;
  label: string;
  size: "hero" | "large" | "medium" | "small" | "corner";
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
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <div
      className={`rounded-lg relative transition-all h-full ${
        isDragOver
          ? "border-cyan-DEFAULT bg-cyan-DEFAULT/4"
          : producto
            ? "bg-transparent"
            : "border-[1.5px] border-dashed border-[#E8EDF2] flex items-center justify-center"
      } ${isAssigning ? "!border-cyan-DEFAULT !border-solid bg-cyan-DEFAULT/6 animate-[pulse-border_1.5s_infinite] cursor-pointer hover:bg-cyan-DEFAULT/10" : ""}`}
      onDrop={(e) => onDrop(e, slotId)}
      onDragOver={(e) => onDragOver(e, slotId)}
      onDragLeave={onDragLeave}
      onClick={handleClick}
    >
      {producto ? (
        <div className="h-full flex flex-col p-3 relative">
          <div className="flex-1 flex items-center justify-center overflow-hidden min-h-0">
            {producto.imagen?.url ? (
              <img
                src={
                  producto.imagen.formats?.medium?.url ||
                  producto.imagen.formats?.small?.url ||
                  producto.imagen.url
                }
                alt={producto.nombre}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-[#CBD5E1] text-[10px]">Sin imagen</div>
            )}
          </div>
          <div className="pt-2">
            <h3 className="font-['Syne',sans-serif] font-bold text-[12px] text-[#1A1A2E] m-0 mb-[3px] pb-[3px] border-b-[2px] border-cyan-DEFAULT inline-block leading-[1.2]">
              {producto.nombre}
            </h3>
            {producto.descripcion && (
              <p className="text-[8px] text-[#64748B] m-[3px] 0 leading-[1.4] line-clamp-2 overflow-hidden">
                {producto.descripcion}
              </p>
            )}
            {producto.precio && (
              <div className="font-['Syne',sans-serif] font-bold text-[14px] text-cyan-DEFAULT mt-1">
                {new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  maximumFractionDigits: 0,
                }).format(producto.precio)}
              </div>
            )}
            <div className="text-[7px] text-[#00C853] font-bold tracking-[0.3px] mt-0.5">
              Envio incluido
            </div>
          </div>
          <button
            className="absolute top-[6px] right-[6px] bg-white/90 border border-[#E8EDF2] rounded-full w-[22px] h-[22px] flex items-center justify-center cursor-pointer text-[#94A3B8] transition-all opacity-0 hover:bg-[#EF4444] hover:border-[#EF4444] hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(slotId);
            }}
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
        <div className="pointer-events-none flex items-center justify-center">
          <span
            className={`text-[9px] ${isAssigning ? "text-cyan-DEFAULT font-bold" : "text-[#CBD5E1] font-medium"}`}
          >
            {isAssigning ? "Click para colocar" : label}
          </span>
        </div>
      )}
    </div>
  );
}

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
    console.log(
      "Slot clicked:",
      slotId,
      "assigningProductId:",
      assigningProductId,
      "slot value:",
      page.slots[slotId],
    );
    if (assigningProductId && !page.slots[slotId]) {
      const producto = selectedProductos.find(
        (p) => p.documentId === assigningProductId,
      );
      console.log("Found producto:", producto);
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
    <div className="w-full h-full relative bg-white flex flex-col font-['DM_Sans',system-ui,sans-serif]">
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 595 842"
        fill="none"
      >
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
      </svg>

      <div className="px-9 pt-7 pb-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 bg-gradient-to-br from-[#1E90FF] to-[#00C853] rounded flex items-center justify-center text-white text-[9px] font-bold font-['Syne',sans-serif]">
            CE
          </span>
          <span className="font-['Syne',sans-serif] font-bold text-[13px] text-[#1A1A2E] tracking-[1px]">
            CREDIEXPRESS
          </span>
        </div>
        <div className="h-[2px] bg-gradient-to-r from-cyan-DEFAULT to-transparent mt-2"></div>
      </div>

      <div className="flex-1 px-9 pt-4 relative z-10 min-h-0">
        <ProductSlot
          producto={page.slots["hero"] || null}
          slotId="hero"
          label="Producto Principal"
          size="hero"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onRemove={handleRemove}
          isDragOver={dragOverSlot === "hero"}
          onClick={() => handleSlotClick("hero")}
          isAssigning={assigningProductId !== null && !page.slots["hero"]}
        />
      </div>

      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#E8EDF2] to-transparent mx-9 relative z-10"></div>

      <div className="flex-1 px-9 pt-4 pb-0 flex gap-5 relative z-10 min-h-0">
        <ProductSlot
          producto={page.slots["secondary1"] || null}
          slotId="secondary1"
          label="Producto Secundario 1"
          size="medium"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onRemove={handleRemove}
          isDragOver={dragOverSlot === "secondary1"}
          onClick={() => handleSlotClick("secondary1")}
          isAssigning={assigningProductId !== null && !page.slots["secondary1"]}
        />
        <ProductSlot
          producto={page.slots["secondary2"] || null}
          slotId="secondary2"
          label="Producto Secundario 2"
          size="medium"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onRemove={handleRemove}
          isDragOver={dragOverSlot === "secondary2"}
          onClick={() => handleSlotClick("secondary2")}
          isAssigning={assigningProductId !== null && !page.slots["secondary2"]}
        />
      </div>

      <div className="px-9 py-3 pb-5 flex justify-between text-[8px] text-[#94A3B8] tracking-[0.5px] relative z-10">
        <span>crediexpress.com.ar</span>
        <span>11-6466-5339</span>
      </div>

      <style>{`
        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 0 2px rgba(0, 180, 216, 0.15); }
          50% { box-shadow: 0 0 0 4px rgba(0, 180, 216, 0.08); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(0, 180, 216, 0.15); }
          50% { box-shadow: 0 0 0 6px rgba(0, 180, 216, 0.08); }
        }
      `}</style>
    </div>
  );
}
