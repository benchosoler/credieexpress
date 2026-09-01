import { useState, type DragEvent } from "react";
import type { ProductoStrapi } from "../../lib/strapi-types";
import type { MagazinePage } from "./types";

interface UseSlotDndOptions {
  page: MagazinePage;
  selectedProductos: ProductoStrapi[];
  onAssignProduct: (
    pageId: string,
    slotId: string,
    producto: ProductoStrapi | null,
  ) => void;
  assigningProductId?: string | null;
  onStartAssigning?: (docId: string | null) => void;
  /** Every page in the magazine, used for the cross-page dedup sweep. */
  pages?: MagazinePage[];
}

export interface SlotDndHandlers {
  dragOverSlot: string | null;
  handleDragOver: (e: DragEvent, slotId: string) => void;
  handleDragLeave: () => void;
  handleDrop: (e: DragEvent, slotId: string) => void;
  handleRemove: (slotId: string) => void;
  handleSlotClick: (slotId: string) => void;
  /** True when a click-to-assign is pending and this slot is still empty. */
  isAssigning: (slotId: string) => boolean;
}

/**
 * Shared drag/drop/click-to-assign handlers for a magazine page's product
 * slots, replacing the five near-identical copies of
 * `handleDragOver`/`handleDragLeave`/`handleDrop`/`handleRemove`/
 * `handleSlotClick` that used to live in each template.
 *
 * Both the drop path and the click-to-assign path route through
 * `placeProduct`, which performs the same dedup sweep the original
 * `handleSlotClick` did: it removes the product from every slot on every
 * page before placing it in the target slot. This guarantees dragging a
 * placed product MOVES it instead of duplicating it — the drop path
 * previously skipped this sweep entirely.
 */
export function useSlotDnd({
  page,
  selectedProductos,
  onAssignProduct,
  assigningProductId = null,
  onStartAssigning,
  pages = [],
}: UseSlotDndOptions): SlotDndHandlers {
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);

  const placeProduct = (slotId: string, producto: ProductoStrapi) => {
    pages.forEach((p) => {
      Object.entries(p.slots).forEach(([sid, prod]) => {
        if (prod && prod.documentId === producto.documentId) {
          onAssignProduct(p.id, sid, null);
        }
      });
    });
    onAssignProduct(page.id, slotId, producto);
  };

  const handleDragOver = (e: DragEvent, slotId: string) => {
    e.preventDefault();
    setDragOverSlot(slotId);
  };

  const handleDragLeave = () => setDragOverSlot(null);

  const handleDrop = (e: DragEvent, slotId: string) => {
    e.preventDefault();
    setDragOverSlot(null);
    const docId = e.dataTransfer.getData("text/plain");
    const producto = selectedProductos.find((p) => p.documentId === docId);
    if (producto) placeProduct(slotId, producto);
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
        placeProduct(slotId, producto);
        onStartAssigning?.(null);
      }
    }
  };

  const isAssigning = (slotId: string) =>
    assigningProductId !== null &&
    assigningProductId !== undefined &&
    !page.slots[slotId];

  return {
    dragOverSlot,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemove,
    handleSlotClick,
    isAssigning,
  };
}
