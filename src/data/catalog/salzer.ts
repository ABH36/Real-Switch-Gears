import type { CatalogCategory, ProductDetail } from "../brands";
import productsJson from "./salzer.products.json";

export const salzerCatalog: CatalogCategory[] = [
  {
    name: "Industrial Components",
    sections: [
      {
        heading: "Industrial Components",
        items: [
          { name: "Cable Ducts / Wire Ducts", slug: "cable-wire-ducts" },
          { name: "Cam Operated Rotary Switches", slug: "cam-operated-rotary-switches" },
          { name: "Photovoltaic Isolators & Changeovers", slug: "photovoltaic-isolators-changeovers" },
          { name: "General Purpose Relays", slug: "general-purpose-relays" },
          { name: "Load Break Isolators & Changeovers", slug: "load-break-isolators-changeovers" },
          { name: "Sensors", slug: "sensors" },
          { name: "Limit & Foot Switches", slug: "limit-foot-switches" },
          { name: "Rotary Limit Switches", slug: "rotary-limit-switches" },
          { name: "Terminal Connectors", slug: "terminal-connectors" },
          { name: "Customised Control Panels", slug: "customised-control-panels" },
          { name: "Industrial Plug & Socket", slug: "industrial-plug-socket" },
        ],
      },
    ],
  },
  {
    name: "Motor Control Products",
    sections: [
      {
        heading: "Motor Control Products",
        items: [
          { name: "Contactors & Overload Relays", slug: "contactors-overload-relays" },
          { name: "Motor Protection Circuit Breaker (MPCB)", slug: "motor-protection-circuit-breaker-mpcb" },
        ],
      },
    ],
  },
  {
    name: "Transformers",
    sections: [
      {
        heading: "Transformers",
        items: [
          { name: "CT's & Rogowski Coils", slug: "ct-rogowski-coils" },
          { name: "Inductors, Chokes & Filters", slug: "inductors-chokes-filters" },
          { name: "Single Phase Toroidal Transformers", slug: "single-phase-toroidal-transformers" },
          { name: "Three Phase Dry Type Transformers", slug: "three-phase-dry-type-transformers" },
        ],
      },
    ],
  },
  {
    name: "Automotive Products",
    sections: [
      {
        heading: "Automotive Products",
        items: [{ name: "EV Chargers", slug: "ev-chargers" }],
      },
    ],
  },
  {
    name: "Building Segment",
    sections: [
      {
        heading: "Building Segment",
        items: [
          { name: "Automatic Source Changeover with Current Limiter", slug: "automatic-source-changeover-current-limiter" },
          { name: "Distribution Boards", slug: "distribution-boards" },
          { name: "Miniature Circuit Breakers (MCB)", slug: "miniature-circuit-breakers-mcb" },
          { name: "Modular Switches & Speciality", slug: "modular-switches-speciality" },
          { name: "Wifi Smart Switches", slug: "wifi-smart-switches" },
          { name: "Movement Sensors", slug: "movement-sensors" },
          { name: "Remote Switches", slug: "remote-switches" },
          { name: "Single Phase Motor Starters", slug: "single-phase-motor-starters" },
          { name: "House Wires", slug: "house-wires" },
        ],
      },
    ],
  },
  {
    name: "Copper Segment",
    sections: [
      {
        heading: "Copper Segment",
        items: [
          { name: "Industrial Wires & Cables", slug: "industrial-wires-cables" },
          { name: "Flexible Busbars & Wire Harness", slug: "flexible-busbars-wire-harness" },
          { name: "Enamelled Copper Wire", slug: "enamelled-copper-wire" },
          { name: "Bunched Copper Conductors", slug: "bunched-copper-conductors" },
          { name: "Tinned Copper Wires", slug: "tinned-copper-wires" },
          { name: "LAN / CCTV Cables", slug: "lan-cctv-cables" },
        ],
      },
    ],
  },
  {
    name: "Energy Segment",
    sections: [
      {
        heading: "Energy Segment",
        items: [
          { name: "Energy Savers & Panels", slug: "energy-savers-panels" },
          { name: "Street Light Controllers", slug: "street-light-controllers" },
        ],
      },
    ],
  },
];

export const salzerProducts: ProductDetail[] = productsJson as ProductDetail[];