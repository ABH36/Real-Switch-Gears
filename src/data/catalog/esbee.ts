import type { CatalogCategory, ProductDetail } from "../brands";
import productsJson from "./esbee.products.json";

export const esbeeCatalog: CatalogCategory[] = [
  {
    name: "Industrial",
    sections: [
      {
        heading: "Industrial",
        items: [
          { name: "Smart Solutions", slug: "industrial-smart-solutions" },
          { name: "Panel LED Indicators", slug: "panel-led-indicators" },
          { name: "Push Button Switches", slug: "push-button-switches" },
          { name: "Enclosures and PB Stations", slug: "enclosures-pb-stations" },
          { name: "Sockets", slug: "sockets" },
          { name: "Tower Lights", slug: "tower-lights" },
          { name: "Signaling and Audio Devices", slug: "signaling-audio-devices" },
          { name: "Limit Switches", slug: "limit-switches" },
          { name: "Lighting Solutions", slug: "industrial-lighting-solutions" },
          { name: "Relay Boards", slug: "relay-boards" },
        ],
      },
    ],
  },
  {
    name: "White Goods",
    sections: [
      {
        heading: "White Goods",
        items: [
          { name: "Door/Lid Switches", slug: "door-lid-switches" },
          { name: "Appliance Lighting Solutions", slug: "appliance-lighting-solutions" },
          { name: "PCBAs", slug: "pcbas" },
        ],
      },
    ],
  },
  {
    name: "Automobile",
    sections: [
      {
        heading: "Automobile",
        items: [
          { name: "Emergency Switches", slug: "emergency-switches" },
          { name: "Automobile Lighting Solutions", slug: "automobile-lighting-solutions" },
          { name: "Emergency Audio Solutions", slug: "emergency-audio-solutions" },
        ],
      },
    ],
  },
  {
    name: "Elevators / Escalators",
    sections: [
      {
        heading: "Elevators / Escalators",
        items: [
          { name: "Pit Control Devices", slug: "pit-control-devices" },
          { name: "Car Top Devices", slug: "car-top-devices" },
          { name: "Under Car Devices", slug: "under-car-devices" },
          { name: "Elevator Lighting Solutions", slug: "elevator-lighting-solutions" },
          { name: "Customised Solutions", slug: "elevator-customised-solutions" },
          { name: "Auxiliary Controls", slug: "elevator-auxiliary-controls" },
          { name: "Accessories", slug: "elevator-accessories" },
        ],
      },
    ],
  },
  {
    name: "Crane Industry",
    sections: [
      {
        heading: "Crane Industry",
        items: [
          { name: "Single Speed Crane Pendants", slug: "single-speed-crane-pendants" },
          { name: "Double Speed Crane Pendants", slug: "double-speed-crane-pendants" },
          { name: "Wireless Solutions", slug: "crane-wireless-solutions" },
          { name: "Safety Systems", slug: "crane-safety-systems" },
          { name: "Signaling and Lighting Devices", slug: "crane-signaling-lighting-devices" },
          { name: "Auxiliary Controls - Pendants", slug: "auxiliary-controls-pendants" },
        ],
      },
    ],
  },
];

export const esbeeProducts: ProductDetail[] = Array.isArray(productsJson)
  ? (productsJson as ProductDetail[])
  : [];