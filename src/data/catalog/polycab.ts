import type { CatalogCategory, ProductDetail } from "../brands";
import productsJson from "./polycab.products.json";

export const polycabProducts: ProductDetail[] = Array.isArray(productsJson)
  ? (productsJson as ProductDetail[])
  : [];

// top-level nav order — anything scraped outside this list is appended at the end
const CATEGORY_ORDER = [
  "Wires",
  "Fans",
  "Lighting",
  "Switches and Accessories",
  "Water Heaters",
  "Switchgear",
  "Cables by Type",
];

function buildCatalog(products: ProductDetail[]): CatalogCategory[] {
  const categories = new Map<string, Map<string, { name: string; slug?: string }[]>>();

  for (const p of products) {
    const heading = p.family ?? p.category;
    if (!categories.has(p.category)) categories.set(p.category, new Map());
    const sections = categories.get(p.category)!;
    if (!sections.has(heading)) sections.set(heading, []);
    sections.get(heading)!.push({ name: p.name, slug: p.slug });
  }

  const order = [
    ...CATEGORY_ORDER.filter((c) => categories.has(c)),
    ...[...categories.keys()].filter((c) => !CATEGORY_ORDER.includes(c)),
  ];

  return order.map((name) => ({
    name,
    sections: [...categories.get(name)!.entries()].map(([heading, items]) => ({
      heading,
      items,
    })),
  }));
}

export const polycabCatalog: CatalogCategory[] = buildCatalog(polycabProducts);
