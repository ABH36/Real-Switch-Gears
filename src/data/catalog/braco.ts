import type { CatalogCategory, ProductDetail } from "../brands";
import productsJson from "./braco.products.json";

export const bracoCatalog: CatalogCategory[] = [
  {
    name: "Cable Glands",
    sections: [
      {
        heading: "Cable Glands",
        items: [
          { name: "Domestic Series", slug: "cable-glands-domestic-series" },
          { name: "Exports Series", slug: "cable-glands-exports-series" },
          { name: "Cable Glands Accessories", slug: "cable-glands-accessories" },
        ],
      },
    ],
  },
  {
    name: "Cable Terminals",
    sections: [
      {
        heading: "Cable Terminals",
        items: [
          { name: "Copper Terminals", slug: "copper-terminals" },
          { name: "Copper Cable Lugs", slug: "copper-cable-lugs" },
          { name: "Aluminium Cable Lugs", slug: "aluminium-cable-lugs" },
          { name: "Bimetallic Lugs", slug: "bimetallic-lugs" },
        ],
      },
    ],
  },
  {
    name: "Other Tools",
    sections: [
      {
        heading: "Other Tools",
        items: [
          { name: "Crimping Tools", slug: "crimping-tools" },
          { name: "Earthing Rods & Accessories", slug: "earthing-rods-accessories" },
          { name: "GI PVC Coated Flexible Conduit", slug: "gi-pvc-coated-flexible-conduit" },
          { name: "Tailor Made", slug: "tailor-made" },
        ],
      },
    ],
  },
];

export const bracoProducts: ProductDetail[] = productsJson as ProductDetail[];