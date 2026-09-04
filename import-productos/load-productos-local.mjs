#!/usr/bin/env node
// Local bulk import for productos.ndjson using Strapi's Document Service.
//
// Use this when you do not want to mint an API token: it boots the Strapi app
// in-process and writes through the same Document Service the admin panel uses,
// so lifecycles, document ids and publish state all behave normally.
//
// The Strapi dev server must be STOPPED before running this — SQLite allows one
// writer, and a running `strapi develop` holds the database.
//
//   cd strapi
//   node ../import-productos/load-productos-local.mjs
//
// It is idempotent: products whose slug already exists are skipped, so a second
// run adds nothing. For a token-based import against a remote instance, use
// load-productos.mjs instead.

import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, resolve } from "node:path";
import { createRequire } from "node:module";

// This script lives outside the Strapi app, so a bare `@strapi/strapi` import
// would resolve against import-productos/ and fail. Resolve it from the Strapi
// project directory (the cwd this is meant to run from) instead.
const requireFromCwd = createRequire(join(process.cwd(), "package.json"));
const { createStrapi } = await import(
  pathToFileURL(requireFromCwd.resolve("@strapi/strapi")).href
);

const __dirname = dirname(fileURLToPath(import.meta.url));
const NDJSON_PATH = join(__dirname, "productos.ndjson");

// The four granular subcategorias this catalogue introduces all belong under the
// same parent as the existing flat "Heladeras" and "Freezers" entries, which are
// linked to "Electrodomésticos". Mirroring that avoids guessing a new parent.
const PARENT_CATEGORIA_NOMBRE = "Electrodomésticos";

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const app = await createStrapi().load();

  const records = readFileSync(NDJSON_PATH, "utf8")
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l));

  console.log(`Loaded ${records.length} records from productos.ndjson`);

  const parent = (
    await app.documents("api::categoria.categoria").findMany({
      filters: { nombre: PARENT_CATEGORIA_NOMBRE },
    })
  )[0];
  if (!parent) {
    throw new Error(`Parent categoria "${PARENT_CATEGORIA_NOMBRE}" not found`);
  }

  const existingSubs = await app
    .documents("api::subcategoria.subcategoria")
    .findMany({ pagination: { pageSize: 200 } });
  const subByNombre = new Map(existingSubs.map((s) => [s.nombre, s.documentId]));

  const existingProds = await app
    .documents("api::producto.producto")
    .findMany({ fields: ["slug"], pagination: { pageSize: 500 } });
  const existingSlugs = new Set(existingProds.map((p) => p.slug));

  let created = 0;
  let skipped = 0;
  let subsCreated = 0;
  const errors = [];

  for (const [i, rec] of records.entries()) {
    const tag = `[${i + 1}/${records.length}]`;
    try {
      if (existingSlugs.has(rec.slug)) {
        skipped++;
        console.log(`${tag} SKIP (slug exists) - ${rec.nombre}`);
        continue;
      }

      let subId = subByNombre.get(rec.subcategoria);
      if (!subId) {
        const sub = await app
          .documents("api::subcategoria.subcategoria")
          .create({
            data: {
              nombre: rec.subcategoria,
              slug: slugify(rec.subcategoria),
              activo: true,
              categoria: parent.documentId,
            },
            status: "published",
          });
        subId = sub.documentId;
        subByNombre.set(rec.subcategoria, subId);
        subsCreated++;
        console.log(`      + subcategoria "${rec.subcategoria}"`);
      }

      const { subcategoria, ...fields } = rec;
      await app.documents("api::producto.producto").create({
        data: { ...fields, subcategorias: [subId] },
        status: "published",
      });
      existingSlugs.add(rec.slug);
      created++;
      console.log(`${tag} OK - ${rec.nombre}`);
    } catch (e) {
      errors.push({ nombre: rec.nombre, error: e.message });
      console.log(`${tag} FAILED - ${rec.nombre}: ${e.message}`);
    }
  }

  console.log("\n--- Summary ---");
  console.log(`Created:            ${created}`);
  console.log(`Skipped (existing): ${skipped}`);
  console.log(`Subcategorias new:  ${subsCreated}`);
  console.log(`Failed:             ${errors.length}`);
  for (const e of errors) console.log(`  - ${e.nombre}: ${e.error}`);

  await app.destroy();
  process.exit(errors.length ? 1 : 0);
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
