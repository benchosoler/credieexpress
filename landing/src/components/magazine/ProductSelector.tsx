import React, { useState, useMemo } from "react";
import type { ProductoStrapi } from "../../lib/strapi-types";

interface ProductSelectorProps {
  productos: ProductoStrapi[];
  categorias: string[];
  assigningId?: string | null;
  onStartAssigning?: (docId: string | null) => void;
  pages?: any[];
}

function getImageUrl(producto: ProductoStrapi): string {
  if (!producto.imagen) return "";
  const fmt = producto.imagen.formats;
  const url = fmt?.small?.url || fmt?.thumbnail?.url || producto.imagen.url;
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return url;
}

export default function ProductSelector({
  productos,
  categorias,
  assigningId,
  onStartAssigning,
  pages = [],
}: ProductSelectorProps) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return productos.filter((p) => {
      const matchSearch =
        !search ||
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        (p.descripcion &&
          p.descripcion.toLowerCase().includes(search.toLowerCase()));
      const matchCat = catFilter === "all" || p.categoria === catFilter;
      return matchSearch && matchCat;
    });
  }, [productos, search, catFilter]);

  return (
    <div className="flex flex-col h-full font-['DM_Sans',sans-serif]">
      <div className="px-4 pb-2.5 pt-4 flex items-center justify-between border-b border-[#F0F2F5]">
        <h3 className="font-['Syne',sans-serif] text-[0.95rem] font-bold m-0 text-[#1A202C]">
          Productos
        </h3>
        <span className="bg-[#F0F2F5] text-[#4A5568] text-[0.72rem] font-bold px-2 py-[0.15rem] rounded-[10px]">
          {productos.length}
        </span>
      </div>

      <div className="px-3 py-2.5 flex flex-col gap-1.5 border-b border-[#F0F2F5]">
        <div className="relative flex items-center">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="absolute left-2.5 pointer-events-none"
          >
            <circle cx="6" cy="6" r="4.5" stroke="#94A3B8" strokeWidth="1.5" />
            <path
              d="M9.5 9.5L12.5 12.5"
              stroke="#94A3B8"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-2.5 py-[0.45rem] border border-[#E8EDF2] rounded-lg text-[0.8rem] font-['DM_Sans',sans-serif] outline-none transition-colors focus:border-cyan-DEFAULT"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="px-2.5 py-1 border border-[#E8EDF2] rounded-lg text-[0.8rem] font-['DM_Sans',sans-serif] bg-white outline-none cursor-pointer transition-colors focus:border-cyan-DEFAULT"
        >
          <option value="all">Todas las categorias</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-[#94A3B8] text-[0.85rem]">
            <p>No se encontraron productos</p>
          </div>
        ) : (
          <>
            {assigningId && (
              <div className="flex items-center gap-2 px-3 py-2.5 mx-2 my-2 bg-cyan-DEFAULT/8 border border-cyan-DEFAULT rounded-lg text-[#007A8C] text-[0.78rem]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <path
                    d="M8 3v10M3 8h10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="flex-1 font-medium">
                  Click en un espacio vacío para colocar{" "}
                  <strong>
                    {filtered.find((p) => p.documentId === assigningId)?.nombre}
                  </strong>
                </span>
                <button
                  onClick={() => onStartAssigning?.(null)}
                  className="px-2.5 py-1 bg-white border border-cyan-DEFAULT rounded text-[#00B4D8] text-[0.72rem] font-bold cursor-pointer transition-all hover:bg-cyan-DEFAULT hover:text-white"
                >
                  Cancelar
                </button>
              </div>
            )}
            {filtered.map((producto) => {
              const isAssigning = assigningId === producto.documentId;
              const isInMagazine = pages.some((page) =>
                Object.values(page.slots || {}).some(
                  (slot) =>
                    slot && (slot as any).documentId === producto.documentId,
                ),
              );
              const imgUrl = getImageUrl(producto);
              return (
                <div
                  key={producto.documentId}
                  className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-all border-[3px] border-transparent mb-1 select-none ${
                    isAssigning
                      ? "border-cyan-DEFAULT shadow-[0_0_0_3px_rgba(0,180,216,0.15)] animate-[pulse_1.5s_infinite]"
                      : isInMagazine
                        ? "border-cyan-DEFAULT bg-cyan-DEFAULT/4"
                        : "hover:bg-[#F7F8FA]"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isAssigning) {
                      onStartAssigning?.(null);
                    } else {
                      onStartAssigning?.(producto.documentId);
                    }
                  }}
                  draggable={isInMagazine}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", producto.documentId);
                    e.dataTransfer.effectAllowed = "copy";
                  }}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F0F2F5] flex-shrink-0 relative flex items-center justify-center">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={producto.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="no-image">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="14"
                            height="14"
                            rx="2"
                            stroke="#CBD5E1"
                            strokeWidth="1.5"
                          />
                          <circle cx="7.5" cy="8" r="1.5" fill="#CBD5E1" />
                          <path
                            d="M3 14l4-4 3 3 3-3 4 4"
                            stroke="#CBD5E1"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                    )}
                    {isInMagazine && (
                      <div className="absolute inset-0 bg-cyan-DEFAULT/85 flex items-center justify-center">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M3 8.5L6.5 12L13 5"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-[0.85rem] truncate">
                      {producto.nombre}
                    </span>
                    {producto.categoria && (
                      <span className="block text-[0.75rem] text-[#64748B]">
                        {producto.categoria}
                      </span>
                    )}
                    {producto.precio && (
                      <span className="block text-[0.75rem] text-[#00B4D8] font-semibold">
                        {new Intl.NumberFormat("es-AR", {
                          style: "currency",
                          currency: "ARS",
                          maximumFractionDigits: 0,
                        }).format(producto.precio)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
