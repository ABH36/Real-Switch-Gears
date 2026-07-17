import type { CatalogCategory, ProductDetail } from "../brands";
import productsJson from "./gic.products.json";

export const gicCatalog: CatalogCategory[] = [
  {
    name: "Human Machine Interface (HMI)",
    sections: [
      {
        heading: "Human Machine Interface (HMI)",
        items: [
          { name: '4.3" TFT Display', slug: "hmi-4-3-inch-tft-display" },
          { name: '7" TFT Display', slug: "hmi-7-inch-tft-display" },
          { name: '10.1" TFT Display', slug: "hmi-10-1-inch-tft-display" },
        ],
      },
    ],
  },
  {
    name: "Programmable Logic Controller",
    sections: [
      {
        heading: "Programmable Logic Controller",
        items: [
          { name: "PL100", slug: "plc-pl100" },
          { name: "Genie - NX", slug: "smart-relay-genie-nx" },
          { name: "Genie Pro", slug: "genie-pro" },
        ],
      },
    ],
  },
  {
    name: "Power Supply",
    sections: [
      {
        heading: "Power Supply",
        items: [
          { name: "Modular Power Supply", slug: "modular-power-supply" },
          { name: "DIN Rail Power Supply", slug: "din-rail-power-supply" },
          { name: "Panel Mount Power Supply", slug: "panel-mount-power-supply" },
        ],
      },
    ],
  },
  {
    name: "Gateways & Converters",
    sections: [
      {
        heading: "Gateways & Converters",
        items: [
          { name: "Protocol Converter", slug: "protocol-converter" },
          { name: "Interface Converters", slug: "interface-converters" },
          { name: "Signal Transducers", slug: "signal-transducers" },
        ],
      },
    ],
  },
  {
    name: "GSM Controller",
    sections: [
      {
        heading: "GSM Controller",
        items: [{ name: "GSM Controller", slug: "gsm-controller" }],
      },
    ],
  },
  {
    name: "Interface Relays",
    sections: [
      {
        heading: "Interface Relays",
        items: [
          { name: "Slim Relays", slug: "slim-relays" },
          { name: "Isolated Relay Module", slug: "isolated-relay-module" },
        ],
      },
    ],
  },
  {
    name: "Temperature Controller",
    sections: [
      {
        heading: "Temperature Controller",
        items: [
          { name: "48×48 mm PID Temperature Controller", slug: "pid-temperature-controller-48x48" },
          { name: "72×72 mm PID Temperature Controller", slug: "pid-temperature-controller-72x72" },
          { name: "96×96 mm PID Temperature Controller", slug: "pid-temperature-controller-96x96" },
        ],
      },
    ],
  },
  {
    name: "Process Indicator",
    sections: [
      {
        heading: "Process Indicator",
        items: [{ name: "Process Indicator", slug: "process-indicator" }],
      },
    ],
  },
  {
    name: "Monitoring Devices",
    sections: [
      {
        heading: "Monitoring Devices",
        items: [
          { name: "Voltage Monitoring", slug: "voltage-monitoring" },
          { name: "Current Monitoring Relay", slug: "current-monitoring-relay" },
          { name: "Earth Leakage Monitoring", slug: "earth-leakage-monitoring" },
          { name: "PTC Thermistor Relays", slug: "ptc-thermistor-relays" },
          { name: "Liquid Level Monitoring Relays", slug: "liquid-level-monitoring-relays" },
          { name: "Insulation Monitoring Relays", slug: "insulation-monitoring-relays" },
        ],
      },
    ],
  },
  {
    name: "Timers",
    sections: [
      {
        heading: "Timers",
        items: [
          { name: "Electronic Timer", slug: "electronic-timer" },
          { name: "Digital Timer", slug: "digital-timer" },
          { name: "Brown Out Timers", slug: "brown-out-timers" },
        ],
      },
    ],
  },
  {
    name: "Time Switches",
    sections: [
      {
        heading: "Time Switches",
        items: [
          { name: "Analog Time Switch", slug: "analog-time-switch" },
          { name: "Digital Time Switch", slug: "digital-time-switch" },
          { name: "Astronomical Time Switches", slug: "astronomical-time-switches" },
        ],
      },
    ],
  },
  {
    name: "Hour Meters & Counters",
    sections: [
      {
        heading: "Hour Meters & Counters",
        items: [
          { name: "Digital Hour Meter & Counter", slug: "digital-hour-meter-counter" },
          { name: "Digital Hour Meter", slug: "digital-hour-meter" },
          { name: "Digital Pulse Counters", slug: "digital-pulse-counters" },
          { name: "Electromechanical Hour Meter", slug: "electromechanical-hour-meter" },
          { name: "Impulse Counter", slug: "impulse-counter" },
          { name: "Electromechanical Pulse Counter", slug: "electromechanical-pulse-counter" },
        ],
      },
    ],
  },
  {
    name: "Phase Indicator",
    sections: [
      {
        heading: "Phase Indicator",
        items: [{ name: "Phase Indicator", slug: "phase-indicator" }],
      },
    ],
  },
  {
    name: "Alarm Annunciators",
    sections: [
      {
        heading: "Alarm Annunciators",
        items: [{ name: "Alarm Annunciators", slug: "alarm-annunciators" }],
      },
    ],
  },
];

export const gicProducts: ProductDetail[] = productsJson as ProductDetail[];