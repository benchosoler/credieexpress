import type { ProductoStrapi, StrapiResponse, CategoriaNode, SubcategoriaNode } from "./strapi-types";

import config from '../strapi-config.json';
const STRAPI_URL = config.strapiUrl || 'http://localhost:1337';

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
    `${STRAPI_URL}/api/productos?filters[slug][$eq]=${slug}&populate[imagenes]=true&populate[subcategorias]=true&populate[fichaTecnica]=true&populate[imagen]=true`,
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

  // External URLs (Wikimedia, etc.) — return as-is
  if (url.startsWith("http")) return url;

  // Relative URLs (e.g. /uploads/...) — return as-is so the browser requests
  // them from the landing origin. The Astro dev server proxies /uploads/* to
  // Strapi, so this works regardless of where the user accesses the page from
  // (Tailscale IP, localhost, production domain, etc.).
  if (url.startsWith("/")) return url;

  return `${STRAPI_URL}${url}`;
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

// ─── New catalog fetchers (catalog-ui-redesign) ────────────────────

export async function getCategorias(): Promise<CategoriaNode[]> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/categorias?filters[activo][$eq]=true&populate=subcategorias&sort=orden:asc`,
    );
    if (!response.ok) return [];
    const json = await response.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function getSubcategorias(): Promise<SubcategoriaNode[]> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/subcategorias?filters[activo][$eq]=true&sort=orden:asc`,
    );
    if (!response.ok) return [];
    const json = await response.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function getProductosBySubcategoria(
  subSlug: string,
  limit?: number,
): Promise<ProductoStrapi[]> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/productos?filters[subcategorias][slug][$eq]=${subSlug}&filters[activo][$eq]=true&populate[subcategorias][populate][categoria]=true&populate[imagenes]=true&populate[imagen]=true&pagination[pageSize]=${limit ?? 100}&sort=nombre:asc`,
    );
    if (!response.ok) return [];
    const json = await response.json();
    return json.data || [];
  } catch {
    return [];
  }
}

/**
 * Converts Strapi v5 richtext blocks to an HTML string.
 * Strips dangerous tags to prevent XSS.
 */
export function renderBlocks(blocks: unknown): string {
  if (!Array.isArray(blocks)) return "";

  const BLOCK_RENDERERS: Record<string, (node: any) => string> = {
    paragraph: (node: any) => {
      const text = renderInline(node.children);
      return `<p>${text}</p>`;
    },
    heading: (node: any) => {
      const level = Math.min(Math.max(node.level || 1, 1), 6);
      const text = renderInline(node.children);
      return `<h${level}>${text}</h${level}>`;
    },
    list: (node: any) => {
      const tag = node.format === "ordered" ? "ol" : "ul";
      const items = (node.children || [])
        .map((item: any) => {
          const text = renderInline(
            item.children?.flatMap((c: any) =>
              c.type === "list" ? c.children || [] : [c],
            ) || [],
          );
          return `<li>${text}</li>`;
        })
        .join("");
      return `<${tag}>${items}</${tag}>`;
    },
    quote: (node: any) => {
      const text = renderInline(node.children);
      return `<blockquote>${text}</blockquote>`;
    },
    code: (node: any) => {
      const text = (node.children || [])
        .map((c: any) => escapeHtml(c.text || ""))
        .join("\n");
      return `<pre><code>${text}</code></pre>`;
    },
    image: (node: any) => {
      const img = node.image || {};
      const url = escapeHtml(img.url || "");
      const alt = escapeHtml(img.alternativeText || img.name || "");
      return `<img src="${url}" alt="${alt}" loading="lazy" />`;
    },
  };

  function renderInline(children: any[]): string {
    if (!children) return "";
    return children
      .map((child: any) => {
        if (child.type === "text") {
          let text = escapeHtml(child.text || "");
          if (child.bold) text = `<strong>${text}</strong>`;
          if (child.italic) text = `<em>${text}</em>`;
          if (child.underline) text = `<u>${text}</u>`;
          if (child.strikethrough) text = `<s>${text}</s>`;
          if (child.code) text = `<code>${text}</code>`;
          return text;
        }
        if (child.type === "link") {
          const url = escapeHtml(child.url || "");
          const text = renderInline(child.children || []);
          return `<a href="${url}" target="_blank" rel="noopener">${text}</a>`;
        }
        return "";
      })
      .join("");
  }

  return blocks
    .map((block: any) => {
      const renderer = BLOCK_RENDERERS[block.type];
      return renderer ? renderer(block) : "";
    })
    .join("\n");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
