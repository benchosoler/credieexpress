#!/usr/bin/env node
// Bulk-load productos.ndjson into Strapi v5.
//
// Usage:
//   1. Start Strapi locally: cd strapi && PORT=1338 npm run develop
//   2. Run:                  STRAPI_TOKEN=xxx node load-productos.mjs
//
// Env vars:
//   STRAPI_URL   Base URL of the Strapi instance (default: http://localhost:1338)
//   STRAPI_TOKEN Strapi API token with create permission on producto/subcategoria (required)

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1338';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

if (!STRAPI_TOKEN) {
  console.error('ERROR: STRAPI_TOKEN environment variable is required.');
  console.error('Usage: STRAPI_TOKEN=xxx node load-productos.mjs');
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const NDJSON_PATH = join(__dirname, 'productos.ndjson');

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${STRAPI_TOKEN}`,
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchAllSubcategorias() {
  const url = `${STRAPI_URL}/api/subcategorias?pagination[pageSize]=100`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Failed to fetch subcategorias: ${res.status} ${res.statusText} - ${body}`);
  }
  const json = await res.json();
  const items = json.data || [];

  const bySlug = new Map();
  const byNombre = new Map();
  for (const item of items) {
    const attrs = item.attributes ? item.attributes : item; // support both v4-shaped and flattened v5 payloads
    const documentId = item.documentId || item.id;
    if (attrs.slug) bySlug.set(attrs.slug, documentId);
    if (attrs.nombre) byNombre.set(attrs.nombre, documentId);
  }
  return { bySlug, byNombre };
}

async function createSubcategoria(nombre) {
  const res = await fetch(`${STRAPI_URL}/api/subcategorias`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ data: { nombre, activo: true } }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Failed to create subcategoria "${nombre}": ${res.status} ${res.statusText} - ${JSON.stringify(json)}`);
  }
  const documentId = json.data?.documentId || json.data?.id;
  if (!documentId) {
    throw new Error(`Subcategoria "${nombre}" created but no documentId returned: ${JSON.stringify(json)}`);
  }
  return documentId;
}

async function createProducto(record) {
  const { subcategoria, ...rest } = record;
  const res = await fetch(`${STRAPI_URL}/api/productos`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ data: rest }),
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, statusText: res.statusText, body: json };
}

async function main() {
  console.log(`Strapi URL: ${STRAPI_URL}`);
  console.log('Fetching existing subcategorias...');
  const { byNombre } = await fetchAllSubcategorias();
  console.log(`Found ${byNombre.size} existing subcategorias.`);

  const raw = readFileSync(NDJSON_PATH, 'utf8');
  const lines = raw.split('\n').filter((l) => l.trim().length > 0);
  console.log(`Loaded ${lines.length} records from productos.ndjson.`);

  const subcategoriaCache = new Map(byNombre); // nombre -> documentId, extended with newly created ones
  const errors = [];
  let created = 0;
  let failed = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let record;
    try {
      record = JSON.parse(line);
    } catch (e) {
      failed++;
      errors.push({ line: i + 1, nombre: '(unparseable line)', error: e.message });
      console.log(`[${i + 1}/${lines.length}] FAILED to parse line: ${e.message}`);
      continue;
    }

    const subNombre = record.subcategoria;
    let subDocumentId = null;

    try {
      if (subNombre) {
        if (subcategoriaCache.has(subNombre)) {
          subDocumentId = subcategoriaCache.get(subNombre);
        } else {
          console.log(`  Subcategoria "${subNombre}" not found. Creating it...`);
          subDocumentId = await createSubcategoria(subNombre);
          subcategoriaCache.set(subNombre, subDocumentId);
        }
      }

      const data = {
        nombre: record.nombre,
        slug: record.slug,
        descripcion: record.descripcion,
        descripcionCorta: record.descripcionCorta,
        precio: record.precio,
        categoria: record.categoria,
        fichaTecnica: record.fichaTecnica,
        imagenUrl: record.imagenUrl,
        destacado: record.destacado,
        activo: record.activo,
      };
      if (subDocumentId) {
        data.subcategorias = { connect: [{ documentId: subDocumentId }] };
      }

      const result = await createProducto(data);
      if (result.ok) {
        created++;
        console.log(`[${i + 1}/${lines.length}] OK - ${record.nombre}`);
      } else {
        failed++;
        errors.push({ line: i + 1, nombre: record.nombre, status: result.status, response: result.body });
        console.log(`[${i + 1}/${lines.length}] FAILED (${result.status}) - ${record.nombre}`);
      }
    } catch (e) {
      failed++;
      errors.push({ line: i + 1, nombre: record.nombre, error: e.message });
      console.log(`[${i + 1}/${lines.length}] FAILED - ${record.nombre}: ${e.message}`);
    }

    await sleep(100);
  }

  console.log('\n--- Summary ---');
  console.log(`Created: ${created}`);
  console.log(`Failed:  ${failed}`);
  if (errors.length > 0) {
    console.log('\n--- Errors ---');
    for (const err of errors) {
      console.log(`- ${err.nombre}: ${err.error || `HTTP ${err.status}`} ${err.response ? JSON.stringify(err.response) : ''}`);
    }
  }
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
