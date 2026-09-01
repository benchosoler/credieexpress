import React, { useState } from "react";
import type { TemplateType, MagazinePage } from "./types";
import { TEMPLATE_DEFINITIONS } from "./types";

interface PageManagerProps {
  pages: MagazinePage[];
  onAddPage: (type: TemplateType) => void;
  onRemovePage: (id: string) => void;
  onChangeTemplate: (pageId: string, type: TemplateType) => void;
  onReorder: (from: number, to: number) => void;
}

export default function PageManager({
  pages,
  onAddPage,
  onRemovePage,
  onChangeTemplate,
  onReorder,
}: PageManagerProps) {
  const [showTemplatePicker, setShowTemplatePicker] = useState<string | null>(
    null,
  );
  const [showAddDropdown, setShowAddDropdown] = useState(false);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        showTemplatePicker &&
        !target.closest(".template-picker") &&
        !target.closest(".tab-change-btn")
      ) {
        setShowTemplatePicker(null);
      }
      if (showAddDropdown && !target.closest(".add-page-wrapper")) {
        setShowAddDropdown(false);
      }
    };
    if (showTemplatePicker || showAddDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showTemplatePicker, showAddDropdown]);

  return (
    <div className="flex items-center font-['DM_Sans',sans-serif]">
      <div
        className="flex items-center gap-1 overflow-x-auto pb-[2px] overflow-visible"
        style={{ overflow: "visible" }}
      >
        {pages.map((page, idx) => {
          const def = TEMPLATE_DEFINITIONS.find(
            (d) => d.type === page.templateType,
          )!;
          const filledSlots = Object.values(page.slots).filter(
            (s) => s !== null,
          ).length;
          const totalSlots = def.slots.length;
          return (
            <div
              key={page.id}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg cursor-pointer text-[0.78rem] transition-all bg-[#F7F8FA] border border-[#E8EDF2] relative whitespace-nowrap hover:border-[#CBD5E1]"
            >
              <span className="w-[18px] h-[18px] rounded bg-[#E8EDF2] flex items-center justify-center text-[0.68rem] font-bold text-[#4A5568]">
                {idx + 1}
              </span>
              <span className="font-medium text-[#1A202C]">{def.name}</span>
              <span className="text-[0.65rem] font-bold text-[#94A3B8] bg-[#F0F2F5] px-[0.35rem] py-[0.1rem] rounded">
                {filledSlots}/{totalSlots}
              </span>
              <button
                className="bg-none border-none cursor-pointer p-[0.1rem] text-[#94A3B8] flex items-center transition-colors hover:text-[#1A202C]"
                title="Cambiar plantilla"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTemplatePicker(
                    showTemplatePicker === page.id ? null : page.id,
                  );
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 4l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {pages.length > 1 && (
                <button
                  className="bg-none border-none cursor-pointer p-[0.1rem] text-[#94A3B8] text-[0.8rem] font-bold transition-colors hover:text-[#EF4444]"
                  title="Eliminar pagina"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemovePage(page.id);
                  }}
                >
                  x
                </button>
              )}
              {idx > 0 && (
                <button
                  className="bg-none border-none cursor-pointer p-[0.1rem] text-[#94A3B8] flex items-center transition-colors hover:text-[#1A202C]"
                  title="Mover arriba"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReorder(idx, idx - 1);
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 2L2 5h6L5 2z" fill="currentColor" />
                  </svg>
                </button>
              )}
              {idx < pages.length - 1 && (
                <button
                  className="bg-none border-none cursor-pointer p-[0.1rem] text-[#94A3B8] flex items-center transition-colors hover:text-[#1A202C]"
                  title="Mover abajo"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReorder(idx, idx + 1);
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 8L2 5h6L5 8z" fill="currentColor" />
                  </svg>
                </button>
              )}

              {showTemplatePicker === page.id && (
                <div className="absolute top-full left-0 z-[999] mt-[0.3rem] bg-white border border-[#E8EDF2] rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.15)] p-1 min-w-[180px] animate-[fadeIn_0.15s_ease-out]">
                  {TEMPLATE_DEFINITIONS.map((def) => (
                    <div
                      key={def.type}
                      className={`p-2.5 rounded-lg cursor-pointer flex flex-col gap-[0.1rem] transition-colors hover:bg-[#F7F8FA] ${page.templateType === def.type ? "bg-cyan-DEFAULT/8" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onChangeTemplate(page.id, def.type);
                        setShowTemplatePicker(null);
                      }}
                    >
                      <span className="text-[0.78rem] font-bold text-[#1A202C]">
                        {def.name}
                      </span>
                      <span className="text-[0.68rem] text-[#94A3B8]">
                        {def.description}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <div className="relative ml-1">
          <button
            className="flex items-center gap-1 px-2.5 py-1.5 border border-dashed border-[#CBD5E1] rounded-lg bg-transparent cursor-pointer text-[0.78rem] text-[#94A3B8] font-['DM_Sans',sans-serif] transition-all whitespace-nowrap hover:border-cyan-DEFAULT hover:text-cyan-DEFAULT"
            onClick={() => setShowAddDropdown(!showAddDropdown)}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 2v10M2 7h10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Agregar pagina
          </button>
          {showAddDropdown && (
            <div className="absolute top-full left-0 z-[999] mt-[0.3rem] bg-white border border-[#E8EDF2] rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.15)] p-1 min-w-[200px] animate-[fadeIn_0.15s_ease-out]">
              {TEMPLATE_DEFINITIONS.map((def) => (
                <div
                  key={def.type}
                  className="p-2.5 rounded-lg cursor-pointer flex flex-col gap-[0.1rem] transition-colors hover:bg-[#F7F8FA]"
                  onClick={() => {
                    onAddPage(def.type);
                    setShowAddDropdown(false);
                  }}
                >
                  <span className="text-[0.78rem] font-bold text-[#1A202C]">
                    {def.name}
                  </span>
                  <span className="text-[0.68rem] text-[#94A3B8]">
                    {def.description}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
