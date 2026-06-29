export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
}

export interface StrapiImagen {
  id: number;
  documentId: string;
  url: string;
  name: string;
  alternativeText: string | null;
  mime: string;
  size: number;
  formats?: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
}

export interface SubcategoriaNode {
  id: number;
  documentId: string;
  nombre: string;
  slug: string;
  orden: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriaNode {
  id: number;
  documentId: string;
  nombre: string;
  slug: string;
  imagenRef: string | null;
  orden: number;
  activo: boolean;
  subcategorias: SubcategoriaNode[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductoStrapi {
  id: number;
  documentId: string;
  nombre: string;
  slug: string;
  precio: number | null;
  descripcion: string | null;
  /** @deprecated use subcategorias relation. Maintained for migration compatibility. */
  categoria: string | null;
  /** @deprecated use imagenes (multiple). Maintained for migration compatibility. */
  imagen: StrapiImagen | null;
  imagenes: StrapiImagen[];
  subcategorias: SubcategoriaNode[];
  fichaTecnica: string | null;
  destacado: boolean;
  activo: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiPagination {
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: StrapiPagination;
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}
