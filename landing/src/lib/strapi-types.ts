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

export interface ProductoStrapi {
  id: number;
  documentId: string;
  nombre: string;
  slug: string;
  precio: number | null;
  descripcion: string | null;
  categoria: string | null;
  imagen: StrapiImagen | null;
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
