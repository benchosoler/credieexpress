import React from "react";
import type { ProductoStrapi } from "../../lib/strapi-types";
import type { MagazinePage, TemplateDefinition } from "./types";
import MagazineSheet from "./MagazineSheet";
import HeroDuo from "./templates/HeroDuo";
import AsymmetricTrio from "./templates/AsymmetricTrio";
import FullFeature from "./templates/FullFeature";
import DynamicQuad from "./templates/DynamicQuad";
import Showcase from "./templates/Showcase";

interface TemplatePreviewProps {
  page: MagazinePage;
  templateDef: TemplateDefinition;
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

const TEMPLATES: Record<
  string,
  React.ComponentType<{
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
  }>
> = {
  heroDuo: HeroDuo,
  asymmetricTrio: AsymmetricTrio,
  fullFeature: FullFeature,
  dynamicQuad: DynamicQuad,
  showcase: Showcase,
};

export default function TemplatePreview({
  page,
  templateDef,
  selectedProductos,
  onAssignProduct,
  assigningProductId,
  onStartAssigning,
  pages,
}: TemplatePreviewProps) {
  const TemplateComponent = TEMPLATES[page.templateType];

  if (!TemplateComponent) return null;

  return (
    <div className="flex justify-center w-full">
      <div className="sheet-zoom">
        <MagazineSheet id={page.id}>
          <TemplateComponent
            page={page}
            selectedProductos={selectedProductos}
            onAssignProduct={onAssignProduct}
            assigningProductId={assigningProductId}
            onStartAssigning={onStartAssigning}
            pages={pages}
          />
        </MagazineSheet>
      </div>
    </div>
  );
}
