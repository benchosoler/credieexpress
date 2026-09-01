# Design: Printable A4 Magazine Module

## Technical Approach

One numeric source (`sheet.ts`) publishes A4 geometry as CSS custom properties on each sheet root. `MagazineSheet` owns the physical page (mm box, chrome bands, footer QR, export id); templates own only their grid; `MagazineCard` owns a product cell. Screen zoom is one custom property consumed by exactly one `transform`, structurally unreachable from print. Delivered as six slices; native print lands first, dedup follows.

## Architecture Decisions

### D1 — A4 geometry: mm authored in TS, published as CSS vars

| Option | Tradeoff | Verdict |
|---|---|---|
| `mm` units + `sheet.ts` constants → CSS vars on sheet root | Real physical units; one TS source; plain `.css` files and `<style>` blocks both read the vars | **Chosen** |
| px at a fixed scale factor | Keeps today's numbers but re-encodes the 595px lie; every print bug returns | Rejected |
| CSS vars only, no TS | `pdfExport.ts` and slot math need the numbers in JS | Rejected |

`@page { size: A4; margin: 0 }` uses the **symbolic** keyword, so no number is duplicated outside `sheet.ts`.

**Retrofit rule (mechanical, not eyeballed).** Today's sheet is 595px ≡ 210mm, so `LEGACY_PX_TO_MM = 210/595 = 0.35294`. Every hardcoded px inside the five templates is multiplied by it. Vertical check: `297/842 = 0.35273` — a 0.06% divergence, far below print resolution. This preserves the tuned layouts exactly instead of "retrofit with visual check", and closes proposal risk #2.

**Type scale (pt, print-real).** `productTitle 11 / price 12 / description 9 / meta 8`. `MIN_BODY_PT = 9`, absolute floor `8`. Today's 7px description = 7pt printed, below the floor; it rises to 9pt.

**`descripcionCorta` budget.** A `grid6` cell gives an 82mm text column: at 9pt DM Sans ≈ 51 chars/line × ~4 available lines ≈ **200 chars**. So geometry supports 200, not 160. Recommendation: **ship 160** — it fits with 20% headroom, `-webkit-line-clamp: 3` is the visual backstop, and raising to 200 later is trivial while lowering is not.

### D2 — Zoom: one var, one transform, on a non-breaking wrapper

`transform: scale(var(--magazine-zoom))` with `transform-origin: top center` on `.sheet-zoom`, which wraps the fixed-mm `.magazine-sheet`. `break-after: page` lives on the **outer** `.magazine-sheet-holder`, never on the transformed element. Layout gap from scaling is absorbed by `margin-bottom: calc((var(--magazine-zoom) - 1) * var(--sheet-h))`.

Under `@media print`: `:root { --magazine-zoom: 1 }` **and** `.sheet-zoom { transform: none; margin: 0 }`. Because the transform is removed before print layout, it never coexists with the page break — the known `transform` × `page-break` containing-block conflict cannot occur. Zoom is UI-only state persisted under a separate `ui.zoom` key, never inside `pages`, so no print or export path can read it. Steps 50/75/100/150%; **default 75%**, which renders 157.5mm ≈ 595px and reproduces today's on-screen size exactly.

Rejected: CSS `zoom` (leaks into print unless reset, inconsistent layout semantics); scaling the mm constants themselves (per-zoom rounding drift, print must reconstruct originals).

### D3 — `pdfExport.ts`: keep working, de-emphasise, do not upgrade

Native print now produces vector text at device resolution; the raster path cannot match it without replacing the pipeline. Native print becomes the primary action; PDF export stays as the offline escape hatch with three minimal changes:

1. `width`/`height` derive from `SHEET` (793.7 × 1122.5 CSS px). At `scale: 2` this is 1587×2245 over 210mm = **192 DPI**, up from 144 — a free gain from the mm migration.
2. Before capture, pin `--magazine-zoom: 1` on the container and restore after. This makes zoom-independence a **guarantee**, not a bet on html2canvas ancestor-transform semantics.
3. `allowTaint: false` (it contradicts `useCORS: true`; today a single non-CORS Strapi image throws `SecurityError` and kills the whole export). Errors now name the failing page and point at native print.

Not doing: 300 DPI, CMYK, vector text, `jsPDF.html()`.

### D4 — Shared primitives, and the collision they fix

**Verified defect:** template `<style>` blocks are unscoped **global** CSS. `.slot-title` is 11px in `AsymmetricTrio.tsx:417` but 10px in `DynamicQuad.tsx:438`; `.slot-desc` 8px vs 7px; `.slot-content` padding 12px vs 10px. All magazine pages render simultaneously, so the last-mounted template silently restyles every earlier page. Every shared rule moves to `magazine.css` scoped under `.magazine-sheet`; each template keeps only its own grid rules under a template root class.

`MagazineCard` takes a `density` prop typed as the existing `TemplateSlot.size` union — this finally gives that dead field a consumer instead of inventing a parallel type.

**`DecorativeElements.tsx`: adopted, not deleted.** Its coordinates live in an SVG `viewBox`, which is unit-agnostic and auto-scales to whatever mm box contains it — it needs **zero** retrofit. Its `595/842` literals are renamed `DECOR_VIEWBOX` in `sheet.ts` and documented as a decorative coordinate space that is deliberately *not* the sheet size. That resolves the sixth `595x842` declaration by naming it rather than converting it.

### D5 — Brand tokens: generated from Tailwind, zero duplication

Templates use raw `<style>` blocks that Tailwind classes cannot reach. A ~15-line inline `tailwindcss/plugin` in `tailwind.config.mjs` emits `theme('colors')` as `--brand-*` custom properties via `addBase`. `tailwind.config.mjs` stays the single definition; utilities and opacity modifiers (`shadow-azul/30`, `MagazineBuilder.tsx:234`) keep working site-wide. Verified reachable on `/revista`: `@astrojs/tailwind` `applyBaseStyles` injects the base layer on every page, which is also why utilities already work there without `global.css`.

Rejected: hand-written `:root` hex (recreates the drift being removed); `azul: "var(--brand-azul)"` in the config (breaks `/30` opacity modifiers across the whole site).

### D6 — Print stylesheet placement

`landing/src/styles/magazine-print.css` + `magazine.css`, both imported from `RevistaLayout.astro` frontmatter (build-time `<head>`, no FOUC, and print CSS can reach `.revista-nav`, which the React tree does not own). `global.css` stays unimported — pulling it in would drag its font `@import` and unrelated utilities onto `/revista`.

Tailwind `print:` variants rejected: they cannot express `@page`, `print-color-adjust`, or override arbitrary values like `h-[calc(100vh-3.5rem)]` cleanly.

Clipping is neutralised by adding **semantic marker classes** beside the existing Tailwind ones: `.magazine-root` (`MagazineBuilder.tsx:188`), `.magazine-shell` (`:259`), `.magazine-canvas` (`:294`). `.no-print` goes on `.revista-nav`, the toolbar (`:189`), the sidebar (`:260`), the preview header (`:273`), card remove buttons, and the zoom control. Empty slots print blank: `.magazine-card--empty { border: none }`, label hidden.

```css
@page { size: A4; margin: 0; }
@media print {
  :root { --magazine-zoom: 1; }
  .no-print { display: none !important; }
  .magazine-root, .magazine-shell, .magazine-canvas {
    height: auto; overflow: visible; display: block; margin: 0; padding: 0; gap: 0;
  }
  .sheet-zoom { transform: none; margin: 0; }
  .magazine-sheet-holder { break-after: page; break-inside: avoid; }
  .magazine-sheet-holder:last-child { break-after: auto; }
  .magazine-sheet { box-shadow: none; border-radius: 0; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
```

## Data Flow

```
Strapi ──build──> revista.astro ──> RevistaLayout ──> MagazineBuilder
                                          │                  │
                          magazine.css + magazine-print.css  │ pages + ui.zoom
                                                             ▼
                                                     TemplatePreview
                                                             ▼
                        MagazineSheet  (sheet.ts vars · chrome · footer QR · export id)
                                                             ▼
                              Grid4 / Grid6 / heroDuo … (grid rules only)
                                                             ▼
                        MagazineCard ──> getImageUrl · formatPrecio · shortDescription
                                                             │
                            window.print() ──┬──────────────┘
                            generatePDF()  ──┘  (zoom pinned to 1)
```

## File Changes

| File | Action | Description |
|---|---|---|
| `strapi/src/api/producto/content-types/producto/schema.json` | Modify | Optional `descripcionCorta` (`string`, `maxLength: 160`) |
| `landing/src/lib/strapi-types.ts` | Modify | `descripcionCorta: string \| null` on `ProductoStrapi` |
| `landing/src/components/magazine/sheet.ts` | Create | mm geometry, chrome bands, `BLEED`/`CROP_MARKS` (0/false), type scale, `LEGACY_PX_TO_MM`, `DECOR_VIEWBOX`, `sheetCssVars()` |
| `.../magazine/MagazineSheet.tsx` | Create | Sheet frame: vars, header, footer + QR placeholder, decor layer, `id="magazine-page-{id}"` |
| `.../magazine/MagazineCard.tsx` | Create | Shared slot: image, title, description fallback, price, states |
| `.../magazine/useSlotDnd.ts` | Create | One hook replacing five handler copies |
| `.../magazine/shortDescription.ts` | Create | `descripcionCorta` → word-boundary-truncated `descripcion` → nothing |
| `landing/src/styles/magazine.css` | Create | Shared rules scoped under `.magazine-sheet` |
| `landing/src/styles/magazine-print.css` | Create | `@page` + `@media print` |
| `.../magazine/templates/Grid4.tsx`, `Grid6.tsx` | Create | 2×2 (~90×126mm) and 2×3 (~90×82mm) |
| `.../magazine/templates/*.tsx` (5) | Modify | Drop local `ProductSlot`, handlers, styles, `595x842`; apply `LEGACY_PX_TO_MM` |
| `.../magazine/TemplatePreview.tsx` | Modify | Render `MagazineSheet`; drop the redundant fixed-size wrapper and dead `transform-origin-top-center` |
| `.../magazine/DecorativeElements.tsx` | Modify | Adopted; literals → `DECOR_VIEWBOX` |
| `.../magazine/types.ts` | Modify | `grid4`/`grid6` + slot definitions |
| `.../magazine/pdfExport.ts` | Modify | Geometry from `sheet.ts`; pin zoom; `allowTaint: false` |
| `.../magazine/MagazineBuilder.tsx` | Modify | Zoom control, print action, marker classes, ordinal `changeTemplate` + confirmation, unknown-template fallback |
| `.../magazine/ProductSelector.tsx`, `PageManager.tsx` | Modify | `draggable` inversion, drop-path duplication, dead `cyan-DEFAULT`/opacity classes |
| `landing/src/layouts/RevistaLayout.astro` | Modify | Import both stylesheets; `.no-print` on nav |
| `landing/tailwind.config.mjs` | Modify | Plugin emitting `--brand-*` from `theme('colors')` |

**Not needed** (proposal listed these): `lib/strapi.ts` and `pages/revista.astro`. `fetchTodosProductos` (`strapi.ts:152-163`) uses no `fields` allowlist, so `descripcionCorta` flows automatically.

## Interfaces / Contracts

```ts
// sheet.ts — the only place these numbers exist
export const SHEET = { widthMm: 210, heightMm: 297 } as const;
export const CHROME = { headerMm: 25, footerMm: 15, sideMarginMm: 12, gapMm: 5 } as const;
export const BLEED = { mm: 0 } as const;          // named now → print-shop upgrade is additive
export const CROP_MARKS = false;
export const LEGACY_PX_TO_MM = SHEET.widthMm / 595;
export const DECOR_VIEWBOX = { w: 595, h: 842 } as const; // decorative space, NOT the sheet
export const TYPE_PT = { productTitle: 11, price: 12, description: 9, meta: 8 } as const;
export const MIN_BODY_PT = 9;
```

## Testing Strategy

No test runner exists in either subproject; do not introduce one in this change.

| Layer | What | How |
|---|---|---|
| Types | Props, `TemplateType`, `ProductoStrapi` | `npm run check` (astro check) |
| Lint | Dead classes, unused state | `npm run lint` |
| Build | Static output | `npm run build --prefix landing` |
| Print (manual) | Exactly N pages, no chrome, no clipping; identical at every zoom step | Browser print preview at 50/75/100/150% |
| Print (manual) | Physical 210×297mm; description ≥ 9pt legible | Print one `grid6` sheet, measure with a ruler |
| Export (manual) | PDF matches print geometry; non-CORS image degrades gracefully | Export at 150% zoom, compare |
| Data (manual) | Products without `descripcionCorta` save and render | Strapi admin + `/revista` |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary. `window.print()` is a browser API, not a subprocess. `/revista` remains unauthenticated and `noindex`; that pre-existing posture is explicitly out of scope.

## Migration / Rollout

No data migration. `descripcionCorta` is nullable; Strapi v5 adds the SQLite column on boot (restart required). Six slices, each independently revertable:

| PR | Content | Est. changed | Depends on |
|---|---|---|---|
| 0 | `descripcionCorta` schema + type | ~50 | — |
| 1 | `sheet.ts` + `MagazineSheet` frame + both stylesheets + zoom + `TemplatePreview` rewire + remove five `595x842` | ~550 | — |
| 2 | `MagazineCard` + `useSlotDnd` + retrofit `heroDuo`, `asymmetricTrio`, `fullFeature` | ~600 | 1 |
| 3 | Retrofit `dynamicQuad`, `showcase` + adopt `DecorativeElements` | ~600 | 2 |
| 4 | `grid4`, `grid6`, footer QR | ~350 | 0, 2 |
| 5 | Editor fixes | ~250 | 2 |

**Slice plan restructured — the proposal's 5 slices are not feasible.** Its slice 1 (extract + retrofit all five) measures ~2,000 changed lines (≈640 added primitives, ≈1,150 deleted from templates), 2.5× the 800 budget. Extraction and retrofit **must** split, and the retrofit must itself split in two.

Ordering also changed: PR 1 wires `MagazineSheet` as a pass-through frame, so **native A4 print works before any template is retrofitted**. This turns the "add unused primitives" PR into an autonomous, user-visible deliverable and front-loads the headline outcome. PR 4 is cheap only because PRs 1–3 land first — the dedup is what makes two new templates ~350 lines instead of ~1,000.

Rollback: revert per slice. Dropping the two stylesheet imports restores today's print behaviour; removing `grid4`/`grid6` from `TEMPLATE_DEFINITIONS` makes persisted pages fall back to `heroDuo`.

## Open Questions

- [ ] `descripcionCorta` `maxLength`: geometry supports 200 chars; design recommends shipping 160. Confirm before PR 0 — raising later is cheap, lowering is not.
- [ ] Print destination stays office printing. `BLEED`/`CROP_MARKS` are named and zeroed so a print-shop change is additive.
- [ ] QR encodes the catalog URL; the origin is not configurable today. Hardcode `https://crediexpress.com.ar` or read `PUBLIC_SITE_URL`?
