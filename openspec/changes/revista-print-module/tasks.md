# Tasks: Printable A4 Magazine Module

## Review Workload Forecast

| PR | Content | Est. changed lines | 800-line budget risk | Depends on |
|---|---|---|---|---|
| 0 | `descripcionCorta` schema + type | ~50 | Low | — |
| 1 | `sheet.ts` + `MagazineSheet` + stylesheets + zoom + `TemplatePreview` rewire + remove five `595x842` | ~550 | Medium (69% of budget) | — |
| 2 | `MagazineCard` + `useSlotDnd` + retrofit `heroDuo`, `asymmetricTrio`, `fullFeature` | ~600 (estimate, not a measurement) | Medium-High — if retrofit runs heavier than estimated this can breach; split per-template if the running diff passes ~700 | 1 |
| 3 | Retrofit `dynamicQuad`, `showcase` + adopt `DecorativeElements` | ~600 (estimate, not a measurement) | Medium-High — same caveat as PR2 | 2 |
| 4 | `grid4`, `grid6`, footer QR | ~350 | Low | 0, 2 |
| 5 | Editor fixes | ~250 | Low | 2 |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
800-line budget risk: Medium-High (PR2, PR3 are estimates — the proposal's original single-slice retrofit measured ~2000 lines before being split; monitor actual diff and split further if trending over budget)

Branch order (linear, satisfies all dependencies): tracker ← PR0 ← PR1 ← PR2 ← PR3 ← PR4 ← PR5. `delivery_strategy: auto-chain` → proceed with this order without asking.

### Suggested Work Units

| Unit | Goal | PR | Focused test command | Runtime harness | Rollback boundary |
|---|---|---|---|---|---|
| 1 | `descripcionCorta` end-to-end | 0 | `npm run check --prefix landing` | Strapi admin save + restart | Remove field from schema.json + type |
| 2 | Native A4 print works | 1 | `npm run build --prefix landing` | Browser print preview at 4 zoom steps | Remove stylesheet imports + `.no-print` |
| 3 | Shared primitives, 3 templates retrofitted | 2 | `npm run lint --prefix landing` | Render mixed magazine, visual check | Revert per-template diff |
| 4 | Remaining 2 templates + decor | 3 | `npm run lint --prefix landing` | Render mixed magazine, visual check | Revert per-template diff |
| 5 | New templates + QR | 4 | `npm run build --prefix landing` | Place 6 products on `grid6`, print | Remove from `TEMPLATE_DEFINITIONS` |
| 6 | Editor correctness | 5 | `npm run lint --prefix landing` | Drag, switch template, cancel confirm | Revert per-file diff |

## PR 0 — `descripcionCorta` schema + type

- [x] 0.1 Add `descripcionCorta` (`string`, `maxLength: 160`, nullable, optional) to `strapi/src/api/producto/content-types/producto/schema.json` — *Optional, Nullable Field*
- [ ] 0.2 Restart the Strapi dev server so SQLite adds the nullable column (no migration script) — **MANUAL, not run**: no Strapi dev server is running in this environment; requires a human to restart it.
- [x] 0.3 Add `descripcionCorta: string | null` to `ProductoStrapi` in `landing/src/lib/strapi-types.ts` — *Field Surfaced Through API and Types*
- [ ] 0.4 Manual: save an existing product in Strapi admin without setting `descripcionCorta` — *Existing product without descripcionCorta still saves* — **MANUAL, not run**: requires the Strapi admin UI.
- [ ] 0.5 Manual: create a new product leaving `descripcionCorta` blank — *New product can omit descripcionCorta* — **MANUAL, not run**: requires the Strapi admin UI.
- [ ] 0.6 Manual: set `descripcionCorta`, run `npm run build --prefix landing`, confirm the fetched product includes it (no `lib/strapi.ts`/`revista.astro` change needed — `fetchTodosProductos` has no `fields` allowlist) — *Field present in fetched product data* — **MANUAL, not run**: requires a live Strapi instance with real data; `npm run build` alone (no Strapi running) was verified to succeed structurally in PR1, see below.
- [x] 0.7 Run `npm run check --prefix landing` — 0 errors, 0 warnings, 50 hints.

## PR 1 — Sheet geometry, print stylesheet, zoom (native print works before any template retrofit)

- [x] 1.1 Create `landing/src/components/magazine/sheet.ts`: `SHEET`, `CHROME`, `BLEED`, `CROP_MARKS`, `LEGACY_PX_TO_MM`, `DECOR_VIEWBOX`, `TYPE_PT`, `MIN_BODY_PT`, `sheetCssVars()`
- [x] 1.2 Create `MagazineSheet.tsx`: mm-box frame consuming the vars, header, footer with QR placeholder slot, decor layer, `id="magazine-page-{id}"` — footer/header are structural, pass-through, and empty in this slice (see Deviations in apply-progress)
- [x] 1.3 Create `landing/src/styles/magazine.css`: shared rules scoped under `.magazine-sheet`
- [x] 1.4 Create `landing/src/styles/magazine-print.css` with `@page { size: A4; margin: 0 }` and the `@media print` block (zoom reset, `.no-print`, marker classes, `break-after: page`, `print-color-adjust: exact`) — *A4 Sheet Geometry, Admin Chrome Suppressed*
- [x] 1.5 Modify `RevistaLayout.astro`: import both stylesheets in frontmatter; add `.no-print` to `.revista-nav`
- [x] 1.6 Modify `tailwind.config.mjs`: add a plugin emitting `--brand-*` from `theme('colors')` via `addBase`
- [x] 1.7 Modify `MagazineBuilder.tsx`: zoom control (50/75/100/150%, default 75%) driving `.sheet-zoom { transform: scale(var(--magazine-zoom)) }`; persist under a separate `ui.zoom` key, never inside `pages`; add `.magazine-root`/`.magazine-shell`/`.magazine-canvas` marker classes and `.no-print` on toolbar/sidebar/preview header/zoom control — per-card remove buttons live inside each template (retrofit PR2/3), not touched here; see Deviations
- [x] 1.8 Add unknown-persisted-template fallback to the `pages` restore path in `MagazineBuilder.tsx`: unrecognized `templateType` → `heroDuo`, no throw — *Unknown Persisted Template Fallback*
- [x] 1.9 Modify `TemplatePreview.tsx`: render through `MagazineSheet`; drop the fixed `595x842` wrapper and the dead `transform-origin-top-center` class
- [x] 1.10 Remove the five independent `595x842` declarations across templates/`TemplatePreview` (structural only; grid retrofit is PR2/3)
- [x] 1.11 Modify `pdfExport.ts`: derive width/height from `SHEET`; pin `--magazine-zoom: 1` before capture, restore after; `allowTaint: false`; remove unused `allProductos` param
- [ ] 1.12 Manual: print at each zoom step (50/75/100/150%) — geometry identical at every step — *Screen Zoom Is Display-Only* — **MANUAL, not run**: requires a browser print preview.
- [ ] 1.13 Manual: print preview shows N pages for N sheets, no blank pages, no split sheet, no chrome — *One Physical Page Per Sheet, Admin Chrome Suppressed* — **MANUAL, not run**: requires a browser print preview.
- [ ] 1.14 Manual: print one sheet, measure with a physical ruler — 210x297mm — *A4 Sheet Geometry* — **MANUAL, not run**: requires physical printing.
- [ ] 1.15 Manual: sheet with background/gradient/decorative SVG prints matching on-screen, white base — *Color Fidelity* — **MANUAL, not run**: requires a browser print preview.
- [ ] 1.16 Manual: "Descargar PDF" on N sheets produces N A4 pages — *PDF Export Regression Guard* — **MANUAL, not run**: requires a browser session with Strapi data.
- [ ] 1.17 Run `npm run check`, `npm run lint`, `npm run build --prefix landing` — **PARTIAL**: `npm run check` (0 errors/0 warnings/49 hints) and `npm run build` both passed. `npm run lint` was intentionally NOT run — it is `eslint --fix` and mutates the working tree (per explicit environment instruction). Used `npx eslint <changed files>` (no `--fix`) instead: only pre-existing issues remain (5x `no-explicit-any` in template `handleSlotClick`, 1x pre-existing unused `selectedProductos`/`templateDef` in `MagazineBuilder.tsx`/`TemplatePreview.tsx`), all verified present before this change via `git stash`.

## PR 2 — `MagazineCard` + `useSlotDnd` + retrofit `heroDuo`, `asymmetricTrio`, `fullFeature`

- [x] 2.1 Create `MagazineCard.tsx`: image via `getImageUrl`, `formatPrecio`, description via `shortDescription.ts`, `density` prop typed as `TemplateSlot.size`, no reserved blank block when price/description is null — supports a `variant: "card" | "feature"` for the two established layouts (grid-style cards vs `fullFeature`'s large single cell); `formatPrecio` now renders "Consultar precio" instead of the old blank-when-null gap, per its documented behavior
- [x] 2.2 Create `shortDescription.ts`: `descripcionCorta` → word-boundary-truncated `descripcion` → empty string — *Short-Description Rendering Fallback*
- [x] 2.3 Create `useSlotDnd.ts`: one hook replacing per-template handlers, including the dedup sweep `handleSlotClick` performs (`HeroDuo.tsx:165-171`) so drop paths cannot duplicate — *Dragging a Placed Product Moves It*
- [x] 2.4 Retrofit `HeroDuo.tsx`: consume `MagazineCard`/`useSlotDnd`; apply `LEGACY_PX_TO_MM` to remaining layout spacing (header/footer/hero-slot/secondary-row, now shared with AsymmetricTrio/FullFeature via `magazine.css`); move `.slot-title`/`.slot-desc`/`.slot-content` rules into `magazine.css` under `.magazine-sheet` using `TYPE_PT`. Dead `cyan-DEFAULT`/opacity classes (old lines 39, 42, 66, 75, 105, 258) were removed as a side effect of replacing the whole `ProductSlot` implementation with `MagazineCard` — deliberate PR5 remediation of the same bug class elsewhere (`ProductSelector.tsx`, `PageManager.tsx`, `MagazineBuilder.tsx`) is untouched
- [x] 2.5 Retrofit `AsymmetricTrio.tsx`: same treatment; dropped its local `.slot-title`/`.slot-desc`/`.slot-content` `<style>` block (`:417`, `:426-428`, `:389-395`) now superseded by `magazine.css`; also dropped its local `.template-header`/`.header-brand`/`.brand-initials`/`.brand-name`/`.header-line`/`.template-footer` block, consolidated into `magazine.css` (the ".gradient-brand ... consolidate it" instruction — the repeated CE-badge gradient now lives in one shared `.magazine-sheet .gradient-brand` rule)
- [x] 2.6 Retrofit `FullFeature.tsx`: same treatment via `MagazineCard`'s `variant="feature"` + `descriptionMode="full"`; keeps rendering full `descripcion` regardless of `descripcionCorta` — *fullFeature Ignores descripcionCorta*. **Correction**: an earlier revision of this task wrongly dropped three decorative elements (the `.featured-title-line` gradient bar, the shipping SVG icon, the custom 32x32 empty-state icon) reasoning that "the spec doesn't require them" — that reasoning was inverted (a spec states what MUST hold, not an allowlist of what may survive deletion) and was caught in review before merge. All three are restored via new `MagazineCard` slots (`titleAccent`, `shippingIcon`, `emptyIcon`, `removeIconSize`), converted to `TYPE_PT`/`LEGACY_PX_TO_MM`/`--brand-*` like everything else, scoped under `.magazine-sheet`. `HeroDuo`/`AsymmetricTrio` were audited for the same class of loss — see apply-progress; no equivalent element was found dropped in either.
- [ ] 2.7 Manual: mixed magazine with `asymmetricTrio` + `heroDuo` sheets — each keeps its own type sizes regardless of order — *Template Styling Is Sheet-Scoped* (partial; full cross-check lands in PR3) — **MANUAL, not run**: requires a browser to render `/revista` with a live Strapi instance.
- [ ] 2.8 Run `npm run check`, `npm run lint`, `npm run build --prefix landing` — **PARTIAL**: `npm run check` (0 errors/0 warnings/39 hints across 44 files) and `npm run build` both pass. `npm run lint` intentionally NOT run (it's `eslint --fix`, mutates the tree per explicit environment instruction). Used `npx eslint <changed files>` instead (no `--fix`): 0 errors, 0 warnings on all 6 new/changed PR2 files after two manual prettier-formatting fixes (a wrapped ternary and a multi-line `<svg>` tag).

## PR 3 — Retrofit `dynamicQuad`, `showcase` + adopt `DecorativeElements`

- [ ] 3.1 Retrofit `DynamicQuad.tsx`: consume `MagazineCard`/`useSlotDnd`; apply `LEGACY_PX_TO_MM`; remove its local `.slot-title` (10px, `:438`)/`.slot-desc` (7px, `:447-449`)/`.slot-content` (12px padding) `<style>` block in favor of the shared `magazine.css` rules from PR2
- [ ] 3.2 Retrofit `Showcase.tsx`: same treatment
- [ ] 3.3 Modify `DecorativeElements.tsx`: rename its `595`/`842` literals to `DECOR_VIEWBOX` from `sheet.ts` (SVG `viewBox` is unit-agnostic; no other retrofit needed)
- [ ] 3.4 Manual: magazine with one `asymmetricTrio` sheet and one `dynamicQuad` sheet — each keeps its own title/description type size and spacing regardless of render order — *Template Styling Is Sheet-Scoped*
- [ ] 3.5 Manual: reorder sheets across at least three templates — every sheet renders identically before/after reorder — *Sheet order does not change appearance*
- [ ] 3.6 Run `npm run check`, `npm run lint`, `npm run build --prefix landing`

## PR 4 — `grid4`, `grid6`, footer QR

- [ ] 4.1 Modify `types.ts`: add `grid4`/`grid6` to `TemplateType` and `TEMPLATE_DEFINITIONS` with slot definitions (additive) — *Additive Template Registry*
- [ ] 4.2 Create `templates/Grid4.tsx`: 2x2, equal fr tracks both axes, 4 `MagazineCard` slots (~90x126mm) — *grid4 Layout*
- [ ] 4.3 Create `templates/Grid6.tsx`: 2x3, 6 `MagazineCard` slots (~90x82mm), description enabled — *grid6 Layout, descripcionCorta present/empty scenarios*
- [ ] 4.4 Wire the footer QR into `MagazineSheet.tsx`: exactly one per sheet, encoding the catalog URL, never per-card — *One QR Per Sheet In Shared Footer*
- [ ] 4.5 Resolve QR origin from `import.meta.env.PUBLIC_SITE_URL` with hardcoded fallback `https://crediexpress.com.ar`
- [ ] 4.6 Manual: adding `grid4`/`grid6` does not change `dynamicQuad`'s `1.2fr 1fr` track sizing — *Adding grid4/grid6 does not change dynamicQuad*
- [ ] 4.7 Manual: product with empty `descripcionCorta` and empty `descripcion` in a `grid6` cell renders no text and no reserved blank block — *Both descripcionCorta and descripcion empty*
- [ ] 4.8 Manual: sheet with any template/product count shows exactly one footer QR, none inside a card
- [ ] 4.9 Run `npm run check`, `npm run lint`, `npm run build --prefix landing`

## PR 5 — Editor fixes

- [ ] 5.1 Fix inverted `draggable={isInMagazine}` at `ProductSelector.tsx:143` → `draggable={!isInMagazine}` — *Rail Products Are Draggable When Unplaced*
- [ ] 5.2 Remove dead `selectedIds`/`onToggle` state (`ProductSelector.tsx:26-27`, `MagazineBuilder.tsx:76-78,304`); confirm not persisted to localStorage — *No Unused Selection State Persisted*
- [ ] 5.3 Fix dead `cyan-DEFAULT` classes and invalid `/8`, `/4`, `/6` opacity modifiers: `ProductSelector.tsx:72,78,97,111,130,132,179`, `PageManager.tsx:130,149`, `MagazineBuilder.tsx:277` → `bg-cyan` + a valid Tailwind opacity value — *Selection Highlight Visibility*
- [ ] 5.4 Rework `changeTemplate` (`MagazineBuilder.tsx:117-134`): remap by slot order, not slot id; show a confirmation stating the exact drop count before applying a switch to a smaller template — *Template Switch Remaps By Slot Order With Loss Confirmation*
- [ ] 5.5 Manual: 3 filled slots `[P1,P2,P3]` switch to a 3+-slot template — same order preserved
- [ ] 5.6 Manual: 3 filled slots switch to a 2-slot template — confirmation states "1 product will be dropped"; cancel keeps original template and all 3 products
- [ ] 5.7 Manual: drag a product placed in slot A onto empty slot B — appears once in B, A empties (regression check on PR2's `useSlotDnd`) — *Dragging a Placed Product Moves It*
- [ ] 5.8 Run `npm run check`, `npm run lint`, `npm run build --prefix landing`
