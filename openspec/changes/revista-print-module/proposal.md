# Proposal: Printable A4 Magazine Module

## Intent

`/revista` composes product pages but cannot produce a printed magazine. Verified: zero occurrences of `@page`, `@media print`, `page-break-*` or `print-color-adjust` in `landing/`, so printing emits admin chrome and only the first viewport (`h-[calc(100vh-3.5rem)]` + `overflow-hidden`). The "A4" sheet is `595x842px` — PDF points used as CSS px, ~75% of physical A4. No 6-product template, no equal-cell 4-product template, no QR. Brand hex, fonts and `formatPrecio`/`getImageUrl` are re-declared ~6 times each, so two more templates would add ~1,000 duplicated lines. Four editor defects make placement lossy.

## Sheet Geometry (derived — `sdd-design` works from these numbers)

A4 = 210 x 297mm. Sheet chrome: header ~25mm, footer ~15mm (footer carries the sheet QR). Side margins 12mm each, inter-cell gap 5mm.

| Template | Columns | Rows | Cell size |
|---|---|---|---|
| `grid4` | 2 | 2 | ~90 x 126mm |
| `grid6` | 2 | 3 | ~90 x 82mm |

`grid6` cell height = `(297 - 25 - 15 - 2x5) / 3 ≈ 82mm`; width = `(210 - 24 - 5) / 2 = 90.5mm`. A ~90 x 82mm cell holds a short description at 9-10pt over 3-4 legible lines, so `grid6` **does** carry a description.

## Scope

### In Scope
- Real `210mm x 297mm` sheets, single source of truth; screen-only zoom that never scales print output.
- Print stylesheet: `@page { size: A4; margin: 0 }`, `@media print` hides all admin chrome, `page-break-after: always` + `break-inside: avoid` per sheet, white background, `print-color-adjust: exact`.
- New templates `grid4` (equal 2x2) and `grid6` (2x3). `dynamicQuad` keeps its asymmetric look.
- **Strapi (narrow)**: add optional `descripcionCorta` (`string`, `maxLength: 160`) to `strapi/src/api/producto/content-types/producto/schema.json`, matching the schema's existing camelCase Spanish convention (`fichaTecnica`, `imagenUrl`). Nullable and optional — no existing product breaks, no data migration. Surface it in `ProductoStrapi` (`landing/src/lib/strapi-types.ts`) and return it from the `/revista` fetch (`lib/strapi.ts`, `pages/revista.astro`).
- Short-description rendering rule: `grid4`/`grid6` render `descripcionCorta` when present; when empty, fall back to `descripcion` truncated to the cell budget; when both are empty, render nothing (no blank reserved block). `fullFeature` keeps using the full `descripcion` and ignores `descripcionCorta`.
- One QR placeholder **per sheet**, in the shared sheet footer, encoding the catalog URL.
- Shared magazine primitives: sheet chrome + product card; import `formatPrecio`/`getImageUrl` from `lib/strapi.ts`; Tailwind brand tokens replace hardcoded hex.
- Template switch: ordinal slot remap plus a confirmation prompt that **states how many products will be dropped**; no silent loss.
- Fix: 16 dead `cyan-DEFAULT` classes + invalid opacity modifiers; inverted `draggable={isInMagazine}` and drop-path duplication; dead `selectedIds`/`onToggle` state.
- Keep `pdfExport.ts` functional.

### Out of Scope
| Non-goal | Reason |
|---|---|
| 300 DPI, CMYK, bleed, crop marks | **Deferred, not settled** — print destination undecided. Assume office printing for now; the mm single-source geometry MUST NOT foreclose adding bleed/crop marks later without a rewrite |
| Auth on `/revista` | Separate security change; site is static today |
| Any Strapi change beyond `descripcionCorta` | Keep the schema delta minimal |
| Migrating magazine to `imagenes[]`/`subcategorias` | Requires a wider `revista.astro` populate change; follow-up |
| Per-product QR | Superseded by Decision 3 below |
| Product rail virtualization | `pageSize=500` is acceptable |
| Real QR encoding library | Placeholder first; library choice deferred |
| localStorage schema versioning | Deferred unless template ids break restore |

### Decision overriding the original brief
The original request asked for "un marcador de posición para un código QR **por producto**". After reviewing the density tradeoff the user chose **one QR per sheet, in the footer, pointing to the full catalog**. This is a deliberate change of mind, not a missed requirement. Consequence: `producto.slug` is not used by the magazine.

## Capabilities

### New Capabilities
- `magazine-print-output`: A4 geometry, screen zoom, print stylesheet, page breaks, color fidelity.
- `magazine-page-templates`: template registry, `grid4`, `grid6`, shared sheet/card primitives, sheet-footer QR, short-description fallback.
- `magazine-editor`: product placement, drag-and-drop, template switching with confirmation, selection state.
- `producto-short-description`: optional `descripcionCorta` field, its API surfacing, and its fallback semantics.

### Modified Capabilities
- None (`openspec/specs/` is empty; this bootstraps it).

## Approach

Define sheet geometry once (mm constants + CSS vars); `TemplatePreview` and all templates consume it, removing the five independent `595x842` declarations. Zoom is a screen-only wrapper transform, excluded under `@media print`. Keep the mm constants and the chrome bands as named values so a later bleed/crop-mark upgrade is an additive change.

The QR lives in `MagazineSheet`'s footer, not in `MagazineCard` — one instance per page regardless of template. Add `grid4`/`grid6` as new `TemplateType` values in `TEMPLATE_DEFINITIONS` (additive, so `dynamicQuad` and persisted localStorage pages survive). Extract `MagazineCard` + `MagazineSheet` first so both new templates and the retrofit of the existing five share one implementation. Remap `changeTemplate` (`MagazineBuilder.tsx:117-134`) by slot order rather than slot id, and confirm before dropping the overflow.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `strapi/src/api/producto/content-types/producto/schema.json` | Modified | Optional `descripcionCorta` |
| `landing/src/lib/strapi-types.ts`, `lib/strapi.ts`, `pages/revista.astro` | Modified | Surface and fetch `descripcionCorta` |
| `landing/src/components/magazine/types.ts` | Modified | New template types, slot definitions |
| `landing/src/components/magazine/` (shared) | New | `sheet.ts`, `MagazineCard`, `MagazineSheet` (incl. footer QR) |
| `landing/src/components/magazine/templates/*.tsx` | Modified | Consume shared primitives and tokens |
| `.../templates/Grid4.tsx`, `Grid6.tsx` | New | 2x2 and 2x3 layouts |
| `landing/src/styles/` | New | Print stylesheet |
| `landing/src/layouts/RevistaLayout.astro` | Modified | Import print styles, mark chrome `no-print` |
| `MagazineBuilder.tsx`, `ProductSelector.tsx`, `PageManager.tsx` | Modified | Zoom control, switch confirmation, bug fixes |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Exceeds 800-line review budget | High | Slice: (0) `descripcionCorta` end-to-end, (1) shared primitives + tokens + retrofit, (2) A4 + print CSS + zoom, (3) `grid4`/`grid6` + footer QR, (4) editor fixes |
| Retrofitting 5 templates to `mm` breaks layouts | Med | Preserve aspect ratio; retrofit template-by-template with visual check |
| `html2canvas` export drifts from new mm geometry | Med | Derive the px snapshot size from the mm constant |
| Print destination changes to a print shop | Med | Keep margins/chrome as named constants so bleed is additive |
| Restored localStorage pages hit unknown template type | Low | Fall back to `heroDuo` instead of crashing |

## Rollback Plan

Additive by construction; revert per slice. `descripcionCorta` is optional, so reverting it leaves existing products valid and templates fall back to `descripcion`. Dropping the print stylesheet import and `no-print` markers restores today's print behavior. Removing `grid4`/`grid6` from `TEMPLATE_DEFINITIONS` hides them (persisted pages fall back to `heroDuo`). Reverting shared primitives restores per-template code. `pdfExport.ts` is untouched and remains the escape hatch.

## Dependencies

- None. The QR placeholder adds no package; a real encoder is deferred.

## Success Criteria

- [ ] Printing `/revista` yields one A4 page per sheet, no admin chrome, no clipping.
- [ ] Printed sheet measures 210mm x 297mm; screen zoom does not alter it.
- [ ] `grid4` renders 4 equal ~90x126mm cells, `grid6` renders 6 ~90x82mm cells, `dynamicQuad` unchanged.
- [ ] `grid4`/`grid6` cells show `descripcionCorta`, fall back to truncated `descripcion`, and render nothing when both are empty.
- [ ] Products with no `descripcionCorta` still save and render; no migration was required.
- [ ] Each sheet shows exactly one footer QR placeholder bound to the catalog URL.
- [ ] Zero `formatPrecio`/`getImageUrl` copies and zero brand hex literals in `magazine/`.
- [ ] Rail drag places without duplicating; a template switch that would drop products asks first and reports the count.
- [ ] `npm run build --prefix landing` succeeds.
