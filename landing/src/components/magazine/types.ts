import type { ProductoStrapi } from "../../lib/strapi-types";

export type TemplateType =
  | "heroDuo"
  | "asymmetricTrio"
  | "fullFeature"
  | "dynamicQuad"
  | "showcase"
  | "grid4"
  | "grid6";

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
  {
    type: "grid4",
    name: "Grilla 4",
    description: "4 productos en grilla 2x2 de celdas iguales",
    slots: [
      { id: "cell1", label: "Celda 1", size: "medium" },
      { id: "cell2", label: "Celda 2", size: "medium" },
      { id: "cell3", label: "Celda 3", size: "medium" },
      { id: "cell4", label: "Celda 4", size: "medium" },
    ],
  },
  {
    type: "grid6",
    name: "Grilla 6",
    description: "6 productos en grilla 2x3",
    slots: [
      { id: "cell1", label: "Celda 1", size: "small" },
      { id: "cell2", label: "Celda 2", size: "small" },
      { id: "cell3", label: "Celda 3", size: "small" },
      { id: "cell4", label: "Celda 4", size: "small" },
      { id: "cell5", label: "Celda 5", size: "small" },
      { id: "cell6", label: "Celda 6", size: "small" },
    ],
  },
];
