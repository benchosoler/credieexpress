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
// Screen zoom is UI-only state. It lives under its own localStorage key so
// no print or export path can ever read it from `pages`.
const ZOOM_STORAGE_KEY = "crediexpress-magazine-ui-zoom";
const ZOOM_STEPS = [0.5, 0.75, 1, 1.5] as const;
const DEFAULT_ZOOM: (typeof ZOOM_STEPS)[number] = 0.75;

const VALID_TEMPLATE_TYPES = new Set(TEMPLATE_DEFINITIONS.map((d) => d.type));

/** Unrecognized persisted template types fall back to heroDuo instead of
 * failing to render (e.g. a template removed after localStorage was
 * written). */
function sanitizePages(pages: MagazinePage[]): MagazinePage[] {
  return pages.map((p) =>
    VALID_TEMPLATE_TYPES.has(p.templateType)
      ? p
      : { ...p, templateType: "heroDuo" as TemplateType },
  );
}

/** `selectedIds` may still be present in a payload saved by an older build
 * that tracked it — it is ignored on read rather than rejected, so an old
 * payload restores cleanly instead of crashing. */
function loadState(): { pages: MagazinePage[] } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.pages) parsed.pages = sanitizePages(parsed.pages);
      return parsed;
    }
  } catch {}
  return null;
}

function saveState(pages: MagazinePage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ pages }));
  } catch {}
}

function loadZoom(): (typeof ZOOM_STEPS)[number] {
  try {
    const raw = localStorage.getItem(ZOOM_STORAGE_KEY);
    const parsed = raw ? Number(raw) : NaN;
    if ((ZOOM_STEPS as readonly number[]).includes(parsed)) {
      return parsed as (typeof ZOOM_STEPS)[number];
    }
  } catch {}
  return DEFAULT_ZOOM;
}

function saveZoom(zoom: number) {
  try {
    localStorage.setItem(ZOOM_STORAGE_KEY, String(zoom));
  } catch {}
}

function genId(): string {
  // crypto.randomUUID exige secure context (https, localhost, 127.0.0.1).
  // En el dev server de Astro con --host se accede por IP y no está disponible.
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  ) {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // versión 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // variante 10
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(
      "",
    );
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
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
        id: genId(),
        templateType: "heroDuo" as TemplateType,
        slots: Object.fromEntries(
          TEMPLATE_DEFINITIONS[0].slots.map((s) => [s.id, null]),
        ),
      },
    ];
  });

  const [assigningProductId, setAssigningProductId] = useState<string | null>(
    null,
  );

  const [isExporting, setIsExporting] = useState(false);

  const [zoom, setZoom] = useState<(typeof ZOOM_STEPS)[number]>(() =>
    loadZoom(),
  );

  const startAssigning = useCallback((docId: string | null) => {
    setAssigningProductId(docId);
  }, []);

  const cancelAssigning = useCallback(() => {
    setAssigningProductId(null);
  }, []);

  const addPage = useCallback((templateType: TemplateType = "heroDuo") => {
    const def = TEMPLATE_DEFINITIONS.find((d) => d.type === templateType)!;
    const newPage: MagazinePage = {
      id: genId(),
      templateType,
      slots: Object.fromEntries(def.slots.map((s) => [s.id, null])),
    };
    setPages((prev) => [...prev, newPage]);
  }, []);

  const removePage = useCallback((pageId: string) => {
    setPages((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((p) => p.id !== pageId);
    });
  }, []);

  /**
   * Switching a sheet's template remaps its placed products by SLOT ORDER,
   * not by slot id — slot ids never overlap between template types (e.g.
   * `hero`/`secondary1`/`secondary2` vs `topLeft`/`topRight`), so matching
   * by id silently dropped every product on every switch. When the target
   * template has fewer slots than the source has filled, the user is
   * warned with the exact drop count and must confirm before anything
   * changes; cancelling leaves the original template and all products
   * untouched.
   */
  const changeTemplate = useCallback(
    (pageId: string, templateType: TemplateType) => {
      const page = pages.find((p) => p.id === pageId);
      if (!page) return;

      const targetDef = TEMPLATE_DEFINITIONS.find(
        (d) => d.type === templateType,
      )!;
      const sourceDef = TEMPLATE_DEFINITIONS.find(
        (d) => d.type === page.templateType,
      )!;

      const filledInOrder = sourceDef.slots
        .map((s) => page.slots[s.id])
        .filter((producto): producto is ProductoStrapi => producto != null);

      const droppedCount = Math.max(
        0,
        filledInOrder.length - targetDef.slots.length,
      );

      if (droppedCount > 0) {
        const confirmed = window.confirm(
          `Cambiar a "${targetDef.name}" tiene menos espacios: se perderá${
            droppedCount === 1 ? "" : "n"
          } ${droppedCount} producto${droppedCount === 1 ? "" : "s"}. ¿Continuar?`,
        );
        if (!confirmed) return;
      }

      const newSlots: MagazinePage["slots"] = Object.fromEntries(
        targetDef.slots.map((slot, idx) => [
          slot.id,
          filledInOrder[idx] ?? null,
        ]),
      );

      setPages((prev) =>
        prev.map((p) =>
          p.id === pageId ? { ...p, templateType, slots: newSlots } : p,
        ),
      );
    },
    [pages],
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
      await generatePDF(pages);
    } catch (e) {
      console.error("Error generating PDF:", e);
      alert("Error al generar el PDF. Revisa la consola para mas detalles.");
    } finally {
      setIsExporting(false);
    }
  }, [pages]);

  const assigningProduct = assigningProductId
    ? productos.find((p) => p.documentId === assigningProductId)
    : null;

  React.useEffect(() => {
    saveState(pages);
  }, [pages]);

  React.useEffect(() => {
    saveZoom(zoom);
  }, [zoom]);

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
    <div className="magazine-root mt-14 h-[calc(100vh-3.5rem)] flex flex-col bg-[#F0F2F5] font-['DM_Sans',system-ui,sans-serif]">
      <div className="no-print flex items-center justify-between px-5 py-2.5 bg-white border-b border-[#E8EDF2] min-h-[52px] gap-4">
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
            {pages.reduce(
              (acc, page) =>
                acc +
                Object.values(page.slots).filter((s) => s !== null).length,
              0,
            )}{" "}
            producto
            {pages.reduce(
              (acc, page) =>
                acc +
                Object.values(page.slots).filter((s) => s !== null).length,
              0,
            ) !== 1
              ? "s"
              : ""}{" "}
            en revista
          </span>
          <div
            className="flex items-center gap-1 bg-[#F7F8FA] border border-[#E8EDF2] rounded-lg p-0.5"
            role="group"
            aria-label="Zoom de vista previa"
          >
            {ZOOM_STEPS.map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => setZoom(step)}
                aria-pressed={zoom === step}
                className={`px-2 py-1 rounded-md text-[0.72rem] font-bold cursor-pointer transition-all ${
                  zoom === step
                    ? "bg-white text-[#1A202C] shadow-sm"
                    : "bg-transparent text-[#94A3B8] hover:text-[#4A5568]"
                }`}
              >
                {Math.round(step * 100)}%
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              setPages([
                {
                  id: genId(),
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
            className="flex items-center gap-2 px-5 py-2 bg-azul text-white border-none rounded-lg text-[0.85rem] font-bold cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-azul-dark hover:-translate-y-0.5 hover:shadow-lg hover:shadow-azul/30"
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

      <div className="magazine-shell flex flex-1 overflow-hidden">
        <div className="no-print w-80 flex-shrink-0 border-r border-[#E8EDF2] bg-white overflow-y-auto">
          <ProductSelector
            productos={productos}
            categorias={categorias}
            assigningId={assigningProductId}
            onStartAssigning={startAssigning}
            pages={pages}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden bg-[#F0F2F5]">
          <div className="no-print px-6 py-3 bg-white border-b border-[#E8EDF2] flex items-center justify-between flex-shrink-0">
            <h2 className="font-['Syne',sans-serif] text-base font-bold text-[#1A202C] m-0">
              Vista previa
            </h2>
            <div>
              {assigningProduct ? (
                <span className="flex items-center gap-1 text-[#007A8C] bg-cyan/10 px-2.5 py-1.5 rounded font-medium text-[0.78rem]">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="flex-shrink-0"
                  >
                    <path
                      d="M7 2v10M2 7h10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Colocando:{" "}
                  <strong className="text-[#00606E]">
                    {assigningProduct.nombre}
                  </strong>{" "}
                  — Click en cualquier espacio vacío o ESC para cancelar
                </span>
              ) : (
                <span className="text-[0.78rem] text-[#94A3B8]">
                  Click en un producto para colocarlo en cualquier plantilla
                  (productos en azul ya están en la revista)
                </span>
              )}
            </div>
          </div>

          <div
            className="magazine-canvas flex-1 overflow-y-auto overflow-x-hidden p-8 flex flex-col justify-start items-center gap-8"
            style={{ "--magazine-zoom": zoom } as React.CSSProperties}
          >
            {pages.map((page) => {
              const pageDef = TEMPLATE_DEFINITIONS.find(
                (d) => d.type === page.templateType,
              )!;
              return (
                <div
                  key={page.id}
                  className="magazine-sheet-holder relative w-full"
                >
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
