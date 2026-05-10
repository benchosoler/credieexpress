import type { ProductoStrapi } from "../../lib/strapi-types";

export type TemplateType =
  | "heroDuo"
  | "asymmetricTrio"
  | "fullFeature"
  | "dynamicQuad"
  | "showcase";

export interface TemplateSlot {
  id: string;
  label: string;
  size: "hero" | "large" | "medium" | "small" | "corner";
}

export interface MagazinePage {
  id: string;
  templateType: TemplateType;
  slots: Record<string, ProductoStrapi | null>;
}

export interface TemplateDefinition {
  type: TemplateType;
  name: string;
  description: string;
  slots: TemplateSlot[];
}

export const TEMPLATE_DEFINITIONS: TemplateDefinition[] = [
  {
    type: "heroDuo",
    name: "Hero + Duo",
    description: "1 producto principal arriba, 2 abajo",
    slots: [
      { id: "hero", label: "Producto Principal", size: "hero" },
      { id: "secondary1", label: "Producto Secundario 1", size: "medium" },
      { id: "secondary2", label: "Producto Secundario 2", size: "medium" },
    ],
  },
  {
    type: "asymmetricTrio",
    name: "Trio Asimetrico",
    description: "1 grande a la izquierda, 2 apilados a la derecha",
    slots: [
      { id: "large", label: "Producto Grande", size: "large" },
      { id: "topRight", label: "Arriba Derecha", size: "medium" },
      { id: "bottomRight", label: "Abajo Derecha", size: "medium" },
    ],
  },
  {
    type: "fullFeature",
    name: "Pagina Completa",
    description: "Un solo producto a pagina completa",
    slots: [{ id: "featured", label: "Producto Destacado", size: "hero" }],
  },
  {
    type: "dynamicQuad",
    name: "Quad Dinamico",
    description: "4 productos en layout escalonado",
    slots: [
      { id: "topLeft", label: "Arriba Izquierda", size: "large" },
      { id: "topRight", label: "Arriba Derecha", size: "medium" },
      { id: "bottomLeft", label: "Abajo Izquierda", size: "medium" },
      { id: "bottomRight", label: "Abajo Derecha", size: "medium" },
    ],
  },
  {
    type: "showcase",
    name: "Vitrina",
    description: "1 producto central, 3 en las esquinas",
    slots: [
      { id: "center", label: "Producto Central", size: "hero" },
      { id: "corner1", label: "Esquina 1", size: "small" },
      { id: "corner2", label: "Esquina 2", size: "small" },
      { id: "corner3", label: "Esquina 3", size: "small" },
    ],
  },
];
