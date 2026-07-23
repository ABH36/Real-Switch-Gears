export type BrandNavItem = { slug: string; name: string };

// Mirrors the slug/name of each entry in `brands` (see ./brands.ts), but
// without importing any catalog/product JSON — keeps the header's nav
// lightweight since every page renders it.
export const brandNav: BrandNavItem[] = [
  { slug: "lauritz-knudsen", name: "Lauritz Knudsen" },
  { slug: "polycab", name: "Polycab" },
  { slug: "salzer", name: "Salzer" },
  { slug: "gic", name: "GIC" },
  { slug: "braco", name: "Braco" },
  { slug: "newtek", name: "Newtek" },
  { slug: "esbee", name: "Esbee" },
  { slug: "connectwell", name: "Connectwell" },
];
