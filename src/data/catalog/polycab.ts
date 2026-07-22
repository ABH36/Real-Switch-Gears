import type { CatalogCategory, ProductDetail } from "../brands";
import productsJson from "./polycab.products.json";
import catalogJson from "./polycab.catalog.json";

export const polycabProducts: ProductDetail[] = Array.isArray(productsJson)
  ? (productsJson as ProductDetail[])
  : [];

// top-level nav order — anything scraped outside this list is appended at the end
const CATEGORY_ORDER = [
  "House Wire",
  "Building infrastructure",
  "Energy and Power Grid",
  "Manufacturing industries",
  "Mobility infrastructure",
  "Cables by Type",
  "Solar Cables",
];

// The catalog nav tree is scraped and written directly by scripts/scrape-polycab.mjs — a
// product can be sighted under several categories (e.g. a cable listed under both "Cables by
// Type" and "Manufacturing industries > Healthcare"), and every sighting is kept here, each
// pointing at the one canonical product record in polycabProducts. Reordered to match the
// site's own nav order; anything scraped outside CATEGORY_ORDER is appended at the end.
const rawCatalog: CatalogCategory[] = Array.isArray(catalogJson) ? (catalogJson as CatalogCategory[]) : [];
const byCategoryName = new Map(rawCatalog.map((c) => [c.name, c]));

export const polycabCatalog: CatalogCategory[] = [
  ...CATEGORY_ORDER.filter((c) => byCategoryName.has(c)).map((c) => byCategoryName.get(c)!),
  ...rawCatalog.filter((c) => !CATEGORY_ORDER.includes(c.name)),
];
