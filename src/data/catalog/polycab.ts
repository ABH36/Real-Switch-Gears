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
  "Cables by Type — Others",
  "Solar Cables",
  "Cables by Standards — Indian Standards (IS)",
  "Cables by Standards — International Standards",
];

// The catalog nav tree is scraped and written directly by scripts/scrape-polycab.mjs — a
// product can be sighted under several categories (e.g. a cable listed under both "Cables by
// Type" and "Manufacturing industries > Healthcare"), and every sighting is kept here, each
// pointing at the one canonical product record in polycabProducts.
const rawCatalog: CatalogCategory[] = Array.isArray(catalogJson) ? (catalogJson as CatalogCategory[]) : [];
const byCategoryName = new Map(rawCatalog.map((c) => [c.name, c]));
const known = new Set(CATEGORY_ORDER);

// "Cables by Type" has its own direct sections (LV Power Cable, ...) plus a further "Others"
// submenu on the real site (/cables/types/others), scraped into its own synthetic category —
// nested here as a child group so the node is both selectable (its 6 direct sections) and
// expandable (Others' 11 sub-types).
const cablesByTypeBase = byCategoryName.get("Cables by Type");
const cablesByTypeOthers = byCategoryName.get("Cables by Type — Others");
const cablesByType: CatalogCategory | undefined = cablesByTypeBase
  ? { ...cablesByTypeBase, children: cablesByTypeOthers ? [{ name: "Others", sections: cablesByTypeOthers.sections }] : undefined }
  : undefined;

// "Cables by Standards" (/cables/standards) — like Others, each of the two standard groups is
// itself a submenu of individual codes (IS 694, UL 1072, ...), scraped into two synthetic
// categories and nested here the same way.
const standardsGroups = [
  { name: "Indian Standards (IS)", source: byCategoryName.get("Cables by Standards — Indian Standards (IS)") },
  { name: "International Standards", source: byCategoryName.get("Cables by Standards — International Standards") },
]
  .filter((g) => g.source)
  .map((g) => ({ name: g.name, sections: g.source!.sections }));

// Grouped to mirror Polycab's own site nav (Consumer / Industries, each
// with their own sub-groupings) instead of one flat list of categories.
// Any category scraped outside CATEGORY_ORDER — i.e. not accounted for
// below — is still appended as its own top-level entry so nothing silently
// disappears if a future re-scrape adds something new.
export const polycabCatalog: CatalogCategory[] = [
  {
    name: "Consumer",
    children: ["House Wire"].map((c) => byCategoryName.get(c)).filter((c): c is CatalogCategory => !!c),
  },
  {
    name: "Industries",
    children: [
      {
        name: "Cables by Application",
        children: [
          "Building infrastructure",
          "Energy and Power Grid",
          "Manufacturing industries",
          "Mobility infrastructure",
        ]
          .map((c) => byCategoryName.get(c))
          .filter((c): c is CatalogCategory => !!c),
      },
      cablesByType,
      standardsGroups.length > 0 ? { name: "Cables by Standards", children: standardsGroups } : undefined,
      {
        name: "Renewables",
        children: ["Solar Cables"].map((c) => byCategoryName.get(c)).filter((c): c is CatalogCategory => !!c),
      },
    ].filter((c): c is CatalogCategory => !!c),
  },
  ...rawCatalog.filter((c) => !known.has(c.name)),
].filter((c) => (c.children ? c.children.length > 0 : true));
