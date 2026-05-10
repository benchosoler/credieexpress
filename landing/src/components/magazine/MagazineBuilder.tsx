import React, { useState, useCallback, useRef } from "react";
import type { ProductoStrapi } from "../../lib/strapi-types";
import type { TemplateType, MagazinePage } from "./types";
import { TEMPLATE_DEFINITIONS } from "./types";
import ProductSelector from "./ProductSelector";
import PageManager from "./PageManager";
import TemplatePreview from "./TemplatePreview";
import { generatePDF } from "./pdfExport";

interface MagazineBuilderProps {
  productos: ProductoStrapi[];
  categorias: string[];
}

const STORAGE_KEY = "crediexpress-magazine-builder";

function loadState(): { pages: MagazinePage[]; selectedIds: string[] } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveState(pages: MagazinePage[], selectedIds: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ pages, selectedIds }));
  } catch {}
}

export default function MagazineBuilder({
  productos,
  categorias,
}: MagazineBuilderProps) {
  const saved = useRef(loadState());

  const [pages, setPages] = useState<MagazinePage[]>(() => {
    if (saved.current?.pages?.length) return saved.current.pages;
    return [
      {
        id: crypto.randomUUID(),
        templateType: "heroDuo" as TemplateType,
        slots: Object.fromEntries(
          TEMPLATE_DEFINITIONS[0].slots.map((s) => [s.id, null]),
        ),
      },
    ];
  });

  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    return saved.current?.selectedIds || [];
  });

  const [assigningProductId, setAssigningProductId] = useState<string | null>(
    null,
  );

  const [isExporting, setIsExporting] = useState(false);

  const selectedProductos = productos.filter((p) =>
    selectedIds.includes(p.documentId),
  );

  const toggleProduct = useCallback((docId: string) => {
    setSelectedIds((prev) => {
      const next = prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId];
      return next;
    });
  }, []);

  const startAssigning = useCallback((docId: string | null) => {
    setAssigningProductId(docId);
  }, []);

  const cancelAssigning = useCallback(() => {
    setAssigningProductId(null);
  }, []);

  const addPage = useCallback((templateType: TemplateType = "heroDuo") => {
    const def = TEMPLATE_DEFINITIONS.find((d) => d.type === templateType)!;
    const newPage: MagazinePage = {
      id: crypto.randomUUID(),
      templateType,
      slots: Object.fromEntries(def.slots.map((s) => [s.id, null])),
    };
    setPages((prev) => [...prev, newPage]);
  }, []);

  const removePage = useCallback(
    (pageId: string) => {
      setPages((prev) => {
        if (prev.length <= 1) return prev;
        return prev.filter((p) => p.id !== pageId);
      });
    },
    [],
  );

  const changeTemplate = useCallback(
    (pageId: string, templateType: TemplateType) => {
      const def = TEMPLATE_DEFINITIONS.find((d) => d.type === templateType)!;
      setPages((prev) =>
        prev.map((p) => {
          if (p.id !== pageId) return p;
          return {
            ...p,
            templateType,
            slots: Object.fromEntries(
              def.slots.map((s) => [s.id, p.slots[s.id] ?? null]),
            ),
          };
        }),
      );
    },
    [],
  );

  const assignProduct = useCallback(
    (pageId: string, slotId: string, producto: ProductoStrapi | null) => {
      setPages((prev) =>
        prev.map((p) => {
          if (p.id !== pageId) return p;
          return { ...p, slots: { ...p.slots, [slotId]: producto } };
        }),
      );
    },
    [],
  );

  const reorderPages = useCallback((fromIndex: number, toIndex: number) => {
    setPages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      await generatePDF(pages, productos);
    } catch (e) {
      console.error("Error generating PDF:", e);
      alert("Error al generar el PDF. Revisa la consola para mas detalles.");
    } finally {
      setIsExporting(false);
    }
  }, [pages, productos]);

  const assigningProduct = assigningProductId
    ? productos.find((p) => p.documentId === assigningProductId)
    : null;

  React.useEffect(() => {
    saveState(pages, selectedIds);
  }, [pages, selectedIds]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && assigningProductId) {
        cancelAssigning();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [assigningProductId, cancelAssigning]);

  return (
    <div className="mt-14 h-[calc(100vh-3.5rem)] flex flex-col bg-[#F0F2F5] font-['DM_Sans',system-ui,sans-serif]">
      <div className="flex items-center justify-between px-5 py-2.5 bg-white border-b border-[#E8EDF2] min-h-[52px] gap-4">
        <div className="flex-1 min-w-0">
          <PageManager
            pages={pages}
            onAddPage={addPage}
            onRemovePage={removePage}
            onChangeTemplate={changeTemplate}
            onReorder={reorderPages}
          />
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <span className="text-[0.8rem] text-[#4A5568] font-medium">
            {pages.reduce((acc, page) => acc + Object.values(page.slots).filter((s) => s !== null).length, 0)} producto
            {pages.reduce((acc, page) => acc + Object.values(page.slots).filter((s) => s !== null).length, 0) !== 1 ? "s" : ""} en revista
          </span>
          <button
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              setPages([
                {
                  id: crypto.randomUUID(),
                  templateType: "heroDuo" as TemplateType,
                  slots: Object.fromEntries(
                    TEMPLATE_DEFINITIONS[0].slots.map((s) => [s.id, null]),
                  ),
                },
              ]);
              setAssigningProductId(null);
            }}
            title="Reiniciar revista"
            className="flex items-center justify-center p-2 bg-transparent border border-[#E8EDF2] rounded-lg text-[#94A3B8] cursor-pointer transition-all hover:bg-[#F7F8FA] hover:text-[#EF4444] hover:border-[#EF4444]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 4h12M4 4v9h8V4M6 4V2h4v2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || pages.length === 0}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-br from-cyan-DEFAULT to-cyan-dark text-white border-none rounded-lg text-[0.85rem] font-bold cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-dark hover:to-cyan-darker hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-DEFAULT/30"
          >
            {isExporting ? (
              <>
                <span className="w-[14px] h-[14px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 2v8m0 0l-3-3m3 3l3-3M3 12h10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Descargar PDF
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 flex-shrink-0 border-r border-[#E8EDF2] bg-white overflow-y-auto">
          <ProductSelector
            productos={productos}
            categorias={categorias}
            selectedIds={selectedIds}
            onToggle={toggleProduct}
            assigningId={assigningProductId}
            onStartAssigning={startAssigning}
            pages={pages}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden bg-[#F0F2F5]">
          <div className="px-6 py-3 bg-white border-b border-[#E8EDF2] flex items-center justify-between flex-shrink-0">
            <h2 className="font-['Syne',sans-serif] text-base font-bold text-[#1A202C] m-0">Vista previa</h2>
            <div className="preview-info">
              {assigningProduct ? (
                <span className="flex items-center gap-1 text-[#007A8C] bg-cyan-DEFAULT/8 px-2.5 py-1.5 rounded font-medium text-[0.78rem]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
                    <path
                      d="M7 2v10M2 7h10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Colocando: <strong className="text-[#00606E]">{assigningProduct.nombre}</strong> — Click en cualquier espacio vacío o ESC para cancelar
                </span>
              ) : (
                <span className="text-[0.78rem] text-[#94A3B8]">Click en un producto para colocarlo en cualquier plantilla (productos en azul ya están en la revista)</span>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 flex flex-col justify-start items-center gap-8">
            {pages.map((page) => {
              const pageDef = TEMPLATE_DEFINITIONS.find(
                (d) => d.type === page.templateType,
              )!;
              return (
                <div key={page.id} className="relative">
                  <TemplatePreview
                    page={page}
                    templateDef={pageDef}
                    selectedProductos={productos}
                    onAssignProduct={assignProduct}
                    assigningProductId={assigningProductId}
                    onStartAssigning={startAssigning}
                    pages={pages}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
