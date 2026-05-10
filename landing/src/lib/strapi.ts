import type { ProductoStrapi, StrapiResponse } from "./strapi-types";

const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL || "http://localhost:1337";

interface FetchProductosParams {
  populate?: string;
  pagination?: { page: number; pageSize: number };
  sort?: string;
  filters?: Record<string, unknown>;
}

export async function fetchProductos(
  params: FetchProductosParams = {},
): Promise<StrapiResponse<ProductoStrapi>> {
  const searchParams = new URLSearchParams();

  if (params.populate) {
    searchParams.set("populate", params.populate);
  }

  if (params.pagination) {
    searchParams.set("pagination[page]", String(params.pagination.page));
    searchParams.set(
      "pagination[pageSize]",
      String(params.pagination.pageSize),
    );
  }

  if (params.sort) {
    searchParams.set("sort", params.sort);
  }

  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      searchParams.set(`filters[${key}]`, String(value));
    });
  }

  const response = await fetch(
    `${STRAPI_URL}/api/productos?${searchParams.toString()}`,
  );

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchProductoBySlug(
  slug: string,
): Promise<ProductoStrapi | null> {
  const response = await fetch(
    `${STRAPI_URL}/api/productos?filters[slug][$eq]=${slug}&populate=imagen`,
  );

  if (!response.ok) return null;

  try {
    const json = await response.json();
    return json.data?.[0] || null;
  } catch {
    return null;
  }
}

export async function fetchCategorias(): Promise<string[]> {
  const response = await fetch(`${STRAPI_URL}/api/productos/categorias`);

  if (!response.ok) return [];

  try {
    const json = await response.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export function getImageUrl(imagen: ProductoStrapi["imagen"]): string {
  if (!imagen) return "";

  const url =
    imagen.formats?.medium?.url || imagen.formats?.small?.url || imagen.url;

  if (!url) return "";

  if (url.startsWith("http")) return url;

  return url;
}

export function formatPrecio(precio: number | null): string {
  if (precio == null) return "Consultar precio";

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(precio);
}

export function getWhatsAppLink(
  producto: ProductoStrapi,
  phoneNumber: string = "5491164665339",
): string {
  const msg = `Hola! Me interesa consultar sobre el producto: *${producto.nombre}* (${producto.categoria || "General"}). ¿Pueden darme más información y opciones de financiación?`;
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
}

export async function fetchProductosDestacados(
  limit: number = 6,
): Promise<ProductoStrapi[]> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/productos?populate=imagen&filters[destacado][$eq]=true&filters[activo][$eq]=true&pagination[pageSize]=${limit}&sort=createdAt:desc`,
    );
    if (!response.ok) return [];
    const json = await response.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function fetchProductosAleatorios(
  limit: number = 6,
): Promise<ProductoStrapi[]> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/productos?populate=imagen&filters[activo][$eq]=true&pagination[pageSize]=100`,
    );
    if (!response.ok) return [];
    const json = await response.json();
    const productos = json.data || [];
    if (productos.length <= limit) return productos;
    const shuffled = [...productos].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
  } catch {
    return [];
  }
}

export async function fetchTodosProductos(): Promise<ProductoStrapi[]> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/productos?populate=imagen&filters[activo][$eq]=true&pagination[pageSize]=500&sort=createdAt:desc`,
    );
    if (!response.ok) return [];
    const json = await response.json();
    return json.data || [];
  } catch {
    return [];
  }
}
