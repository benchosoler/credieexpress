# Magazine Page Templates Specification

## Purpose

Defines the template registry, the new `grid4` and `grid6` layouts, preservation of existing template layouts, shared sheet/card rendering primitives, the sheet-footer QR, and the short-description fallback rendering used by grid templates.

## Requirements

### Requirement: Additive Template Registry

New template types MUST be added to the existing template registry without altering any existing template's defined behavior.

#### Scenario: Adding grid4/grid6 does not change dynamicQuad

- GIVEN the `dynamicQuad` template with its asymmetric column tracks (`1.2fr 1fr` / `1fr 1.2fr`)
- WHEN `grid4` and `grid6` are added to the template registry
- THEN `dynamicQuad`'s track sizing remains unchanged

### Requirement: grid4 Layout

`grid4` MUST render exactly 4 product cells in a 2x2 layout with equal-size cells (equal fr tracks on both axes).

#### Scenario: Four equal cells

- GIVEN a sheet using the `grid4` template
- WHEN rendered
- THEN exactly 4 cells are shown, arranged 2 columns x 2 rows, all of equal width and equal height

### Requirement: grid6 Layout

`grid6` MUST render exactly 6 product cells in a 2x3 layout.

#### Scenario: Six cells

- GIVEN a sheet using the `grid6` template
- WHEN rendered
- THEN exactly 6 cells are shown, arranged 2 columns x 3 rows

### Requirement: Unknown Persisted Template Fallback

When a magazine page restored from the `crediexpress-magazine-builder` localStorage key references a template type unknown to the current registry, the system MUST fall back to `heroDuo` rather than failing to render.

#### Scenario: Unknown template type on restore

- GIVEN a persisted page with `templateType` set to a value not present in the current template registry
- WHEN the builder restores state from localStorage
- THEN the page renders using `heroDuo`
- AND no error is thrown

### Requirement: One QR Per Sheet In Shared Footer

Each sheet MUST show exactly one QR placeholder, located in the shared sheet footer, encoding the catalog URL. It MUST NOT appear once per product and MUST NOT encode a per-product URL.

#### Scenario: Single sheet-level QR

- GIVEN a sheet with any template and any number of placed products
- WHEN rendered
- THEN exactly one QR placeholder is shown, in the sheet footer, encoding the catalog URL
- AND no QR placeholder appears inside any individual product cell

### Requirement: Shared Rendering Primitives

All templates MUST render product price and image using one shared implementation rather than per-template duplicated formatting logic, so formatting stays consistent across templates.

#### Scenario: Consistent price/image formatting across templates

- GIVEN the same product placed on a `grid4` sheet and on a `dynamicQuad` sheet
- WHEN both are rendered
- THEN the displayed price format and resolved image are identical between the two templates

### Requirement: Template Styling Is Sheet-Scoped

A template's styling MUST affect only its own sheet. Rendering a sheet MUST NOT alter the appearance of any other sheet in the same magazine, regardless of how many sheets are present, which templates they use, or the order in which they were added.

#### Scenario: Two templates sharing a class name do not restyle each other

- GIVEN a magazine containing one `asymmetricTrio` sheet and one `dynamicQuad` sheet
- WHEN both sheets are rendered together
- THEN each sheet's product titles and descriptions keep that sheet's own type sizes and spacing
- AND neither sheet's appearance changes compared to rendering it alone

#### Scenario: Sheet order does not change appearance

- GIVEN a magazine with sheets using at least three different templates
- WHEN the sheets are reordered
- THEN every sheet renders identically before and after the reorder

### Requirement: Short-Description Rendering Fallback (grid4/grid6)

For templates that render a short description (`grid4`, `grid6`), the cell MUST render `descripcionCorta` when present; when it is empty or null, it MUST render `descripcion` truncated to the cell's text budget; when both are empty or null, it MUST render no text and reserve no blank block.

#### Scenario: descripcionCorta present

- GIVEN a product with a non-empty `descripcionCorta`
- WHEN placed in a `grid4` or `grid6` cell
- THEN the cell displays `descripcionCorta`

#### Scenario: descripcionCorta empty, descripcion present (common case)

- GIVEN a product with an empty or null `descripcionCorta` and a non-empty `descripcion`
- WHEN placed in a `grid4` or `grid6` cell
- THEN the cell displays `descripcion` truncated to fit the cell's text budget

#### Scenario: Both descripcionCorta and descripcion empty

- GIVEN a product with both `descripcionCorta` and `descripcion` empty or null
- WHEN placed in a `grid4` or `grid6` cell
- THEN no description text is rendered
- AND no blank space is reserved for it, matching the existing null-`precio` no-gap behavior

### Requirement: fullFeature Ignores descripcionCorta

The `fullFeature` template MUST continue rendering the full `descripcion` regardless of whether `descripcionCorta` is present.

#### Scenario: fullFeature always uses the full description

- GIVEN a product with a non-empty `descripcionCorta` and a non-empty `descripcion`
- WHEN placed in a `fullFeature` sheet
- THEN the sheet renders `descripcion` in full, not `descripcionCorta`
