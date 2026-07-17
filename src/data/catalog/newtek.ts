import type { CatalogCategory, ProductDetail } from "../brands";
import productsJson from "./newtek.products.json";

export const newtekCatalog: CatalogCategory[] = [
  {
    name: "Current Transformer Nylon Casing",
    sections: [
      {
        heading: "Metering Type CT'S",
        items: [
          { name: "Window Type CT'S (Bus Bar)", slug: "window-type-cts-bus-bar" },
          { name: "WPL Type", slug: "wpl-type" },
          { name: "Round ID Type CT'S", slug: "round-id-type-cts" },
        ],
      },
      {
        heading: "Protection Type CT'S",
        items: [
          { name: "Nylon Casing - Protective Type Bus Bar", slug: "nylon-casing-protective-type-bus-bar" },
        ],
      },
    ],
  },
  {
    name: "Current Transformer Resin Cast",
    sections: [
      {
        heading: "Resin Cast CT'S",
        items: [
          { name: "Resin Cast - WPL", slug: "resin-cast-wpl" },
          { name: "Resin Cast - Bus Bar", slug: "resin-cast-bus-bar" },
          { name: "Resin Cast - Round ID", slug: "resin-cast-round-id" },
        ],
      },
    ],
  },
  {
    name: "Digital Energy Meters",
    sections: [
      {
        heading: "Digital Energy Meters",
        items: [
          { name: "Digital Meter", slug: "digital-meter" },
          { name: "Multifunction Meter", slug: "multifunction-meter" },
          { name: "Power Meter", slug: "power-meter" },
        ],
      },
    ],
  },
  {
    name: "Control Transformer",
    sections: [
      {
        heading: "Control Transformer",
        items: [
          { name: "Control Transformer Three Phase Tape Insulated", slug: "control-transformer-three-phase" },
          { name: "Control Transformer Single Phase Tape Insulated", slug: "control-transformer-single-phase" },
        ],
      },
    ],
  },
  {
    name: "MV Current & Potential Transformers",
    sections: [
      {
        heading: "MV Current & Potential Transformers",
        items: [
          { name: "MV Potential Transformers", slug: "mv-potential-transformers" },
          { name: "MV Current Transformers", slug: "mv-current-transformers" },
        ],
      },
    ],
  },
  {
    name: "Split Core Current Transformers",
    sections: [
      {
        heading: "Split Core Current Transformers",
        items: [
          { name: "Split Core Current Transformers", slug: "split-core-current-transformers" },
        ],
      },
    ],
  },
];

export const newtekProducts: ProductDetail[] = Array.isArray(productsJson)
  ? (productsJson as ProductDetail[])
  : [];