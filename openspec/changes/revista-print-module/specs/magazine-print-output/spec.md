# Magazine Print Output Specification

## Purpose

Defines physical print behavior for `/revista`: exact A4 page geometry, print-only chrome suppression, page-break control per sheet, and color fidelity, independent of on-screen zoom.

## Requirements

### Requirement: A4 Sheet Geometry

Each magazine sheet MUST render as a physical page of exactly 210mm x 297mm when printed, derived from a single geometry source, not per-template pixel approximations.

#### Scenario: Printed sheet dimensions

- GIVEN a magazine page open on `/revista`
- WHEN the user prints the page
- THEN the resulting printed page measures 210mm x 297mm

#### Scenario: Geometry is template-independent

- GIVEN sheets using `grid4`, `grid6`, `dynamicQuad`, or any other template
- WHEN each is printed
- THEN all sheets share the identical 210mm x 297mm physical size

### Requirement: One Physical Page Per Sheet

Printing `/revista` MUST produce exactly one physical page per magazine sheet: no blank interleaved pages, and no sheet split across two pages.

#### Scenario: N sheets produce N pages, including beyond one viewport

- GIVEN a magazine with N sheets, where N exceeds the number of sheets visible in one browser viewport
- WHEN the document is printed
- THEN the print output contains exactly N pages
- AND no page is blank
- AND no sheet's content is split across two pages

#### Scenario: Single-sheet magazine

- GIVEN a magazine with exactly 1 sheet
- WHEN printed
- THEN the print output contains exactly 1 page

### Requirement: Admin Chrome Suppressed on Print

All authoring/navigation chrome MUST be absent from print output.

#### Scenario: Chrome hidden

- GIVEN the `/revista` builder is open with the fixed navigation, the toolbar (Reiniciar/Descargar PDF), the product rail, and the preview header all visible on screen
- WHEN the page is printed
- THEN none of the navigation, toolbar, product rail, or preview header appear in the printed output
- AND only sheet content is printed

### Requirement: Screen Zoom Is Display-Only

The zoom control MUST change on-screen preview size only and MUST NOT alter printed geometry.

#### Scenario: Zoom does not affect print output

- GIVEN a magazine sheet displayed at a non-100% zoom level
- WHEN the user prints without resetting zoom
- THEN the printed page geometry is identical to printing the same magazine at 100% zoom

### Requirement: Color Fidelity on Print

Background colors, gradients, and decorative SVG elements MUST render in print output matching their on-screen appearance, and the sheet's base background MUST be white.

#### Scenario: Backgrounds and gradients survive print

- GIVEN a sheet containing a background color, a gradient, and a decorative SVG
- WHEN printed
- THEN the printed page reproduces the background color, gradient, and SVG as shown on screen
- AND the sheet's base background is white

### Requirement: PDF Export Regression Guard

`pdfExport.ts` MUST continue producing one A4 page per sheet after the sheet geometry changes to real mm-based dimensions.

#### Scenario: PDF export page count unaffected by geometry change

- GIVEN a magazine with N sheets
- WHEN the user exports via the existing "Descargar PDF" action
- THEN the exported PDF contains exactly N pages, each sized as an A4 page
