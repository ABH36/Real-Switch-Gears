import type { CatalogCategory, ProductDetail } from "../brands";
import productsJson from "./newtek.products.json";

export const newtekCatalog: CatalogCategory[] = [
  {
    name: "Current Transformers & Metering",
    sections: [
      {
        heading: "Current Transformers & Metering",
        items: [
          { name: "Current Transformer Nylon Casing", slug: "current-transformer-nylon-casing" },
          { name: "Current Transformer Resin Cast", slug: "current-transformer-resin-cast" },
          { name: "Digital Energy Meters", slug: "digital-energy-meters" },
          { name: "Control Transformer", slug: "control-transformer" },
          { name: "MV Current & Potential Transformers", slug: "mv-current-potential-transformers" },
          { name: "Split Core Current Transformers", slug: "split-core-current-transformers" },
        ],
      },
    ],
  },
];

export const newtekProducts: ProductDetail[] = productsJson as ProductDetail[];