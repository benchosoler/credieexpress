# Producto Short Description Specification

## Purpose

Defines the optional `descripcionCorta` field on `producto`: its Strapi schema shape, API/type surfacing to the landing site, and backward compatibility with existing products.

## Requirements

### Requirement: Optional, Nullable Field

`producto` MUST have an optional, nullable `descripcionCorta` string field (max length 160) that does not require a value.

#### Scenario: Existing product without descripcionCorta still saves

- GIVEN an existing product created before this field existed, with no value for `descripcionCorta`
- WHEN it is opened and saved in the Strapi admin without setting `descripcionCorta`
- THEN the save succeeds
- AND no data migration is required

#### Scenario: New product can omit descripcionCorta

- GIVEN a new product being created in Strapi admin
- WHEN the user leaves `descripcionCorta` blank and saves
- THEN the product saves successfully with `descripcionCorta` null or empty

### Requirement: Field Surfaced Through API and Types

`descripcionCorta` MUST be included in the `ProductoStrapi` type, returned by the Strapi fetch used for `/revista`, and available to `revista.astro` and its components.

#### Scenario: Field present in fetched product data

- GIVEN a product with a non-empty `descripcionCorta` in Strapi
- WHEN `/revista` fetches products at build time
- THEN the fetched product object includes the `descripcionCorta` value matching Strapi

#### Scenario: Field absent for products without a value

- GIVEN a product with no `descripcionCorta` value in Strapi
- WHEN `/revista` fetches products at build time
- THEN the fetched product object exposes `descripcionCorta` as null/undefined without breaking the fetch or the page render

### Requirement: No Data Migration Required

Deploying the `descripcionCorta` field MUST NOT require any backfill or migration of existing product records.

#### Scenario: Deploy with existing data unaffected

- GIVEN the current set of products in Strapi with no `descripcionCorta` values
- WHEN the schema change is deployed
- THEN all existing products remain valid and render on `/revista` exactly as before the deploy
