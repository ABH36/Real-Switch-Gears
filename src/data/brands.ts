export type CatalogItem = { name: string; slug?: string }; // slug links to product page
export type CatalogSection = { heading: string; items: CatalogItem[] };
export type CatalogCategory = { name: string; sections: CatalogSection[] };


import { lkCatalog, lkProducts } from "./catalog/lauritz-knudsen";
import { salzerCatalog, salzerProducts } from "./catalog/salzer";
import { bracoCatalog, bracoProducts } from "./catalog/braco";
import { gicCatalog, gicProducts } from "./catalog/gic";
import { newtekCatalog, newtekProducts } from "./catalog/newtek";
import { esbeeCatalog, esbeeProducts } from "./catalog/esbee";

export type ProductDetail = {
  slug: string;
  name: string;
  category: string;
  image?: string;          // hero product image
  overview: string[];      // paragraphs
  benefits?: string[];     // bullet points
  benefitsImage?: string;  // optional image beside benefits
  features?: { title: string; text: string }[];
  featuresImage?: string;  // optional image beside features
  catalogue?: string;      // PDF path
};

export type Brand = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  logo: string;
  pageTitle?: string; // e.g. "Lauritz & Knudsen" (banner differs from nav name)
  catalog?: CatalogCategory[];
  products?: ProductDetail[];
};

export const brands: Brand[] = [
  {
    slug: "lauritz-knudsen",
    name: "Lauritz Knudsen",
    tagline: "Low-Voltage Switchgears",
    description:
      "Low-voltage switchgear solutions engineered for safe and efficient power control.",
    image: "/images/brands/lauritz_knudsen.png",
    logo: "/images/clients/lauritz_knudsen.svg",
    pageTitle: "Lauritz & Knudsen",
    catalog: lkCatalog,
    products: lkProducts,
  },
  {
    slug: "polycab",
    name: "Polycab",
    tagline: "Wires & Cables",
    description:
      "High-quality, durable wires and cables for every wiring requirement.",
    image: "/images/brands/polycab.png",
    logo: "/images/clients/polycab.svg",
  },
  {
    slug: "salzer",
    name: "Salzer",
    tagline: "Rotary & Load Break Switches",
    description:
      "Rotary and load break switches for safe, reliable power control.",
    image: "/images/brands/salzer.png",
    logo: "/images/clients/salzer.svg",
    catalog: salzerCatalog,
    products: salzerProducts,
  },
{
    slug: "gic",
    name: "GIC",
    tagline: "Digital Timer & Monitoring Devices",
    description:
      "Digital timers and monitoring devices offering precise control and dependable performance.",
    image: "/images/brands/gic.png",
    logo: "/images/clients/gic.svg",
    catalog: gicCatalog,
    products: gicProducts,
  },
 {
    slug: "braco",
    name: "Braco",
    tagline: "Lugs & Glands Accessories",
    description:
      "Lugs and gland accessories that ensure secure, reliable electrical connections.",
    image: "/images/brands/braco.png",
    logo: "/images/clients/braco.svg",
    catalog: bracoCatalog,
    products: bracoProducts,
  },
 {
    slug: "newtek",
    name: "Newtek",
    tagline: "Current Transformers",
    description:
      "Window and split-core current transformers for precise current measurement.",
    image: "/images/brands/newtek.png",
    logo: "/images/clients/newtek_electricals.svg",
    catalog: newtekCatalog,
    products: newtekProducts,
  },
  {
    slug: "esbee",
    name: "Esbee",
    tagline: "Tower Light & Limit Switches",
    description:
      "Tower lights and limit switches delivering clear signalling and precise control.",
    image: "/images/brands/esbee.png",
    logo: "/images/clients/esbee.svg",
    catalog: esbeeCatalog,
    products: esbeeProducts,
  },
  {
    slug: "connectwell",
    name: "Connectwell",
    tagline: "Terminal Blocks & Connectors",
    description:
      "Interface modules, DIN rail sockets and connectors for versatile connectivity.",
    image: "/images/brands/connectwell.png",
    logo: "/images/clients/connectwell.svg",
  },
];

export const getBrand = (slug: string) => brands.find((b) => b.slug === slug);