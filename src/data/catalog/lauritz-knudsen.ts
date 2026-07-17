import type { CatalogCategory, ProductDetail } from "../brands";
import productsJson from "./lauritz-knudsen.products.json";


export const lkCatalog: CatalogCategory[]  = [
  {
    name: "LV IEC Panels",
    sections: [
      {
        heading: "PCC and MCC Panels",
        items: [
          { name: "T-ERA", slug: "t-era" },
          { name: "Ti", slug: "ti" },
          { name: "Enersys", slug: "enersys" },
        ],
      },
      {
        heading: "Sub-Main Distribution Board - SMDB",
        items: [{ name: "Enersys S", slug: "enersys-s" }],
      },
    ],
  },
  {
    name: "Power Distribution Products",
    sections: [
      {
        heading: "Air Circuit Breaker - ACB",
        items: [
          { name: "U-Power Omega", slug: "u-power-omega" },
          { name: "C-Power", slug: "c-power" },
        ],
      },
      {
        heading: "Moulded Case Circuit Breaker - MCCB",
        items: [
          { name: "DN", slug: "mccb-dn" },
          { name: "DU", slug: "mccb-du" },
          { name: "DY", slug: "mccb-dy" },
          { name: "DZ", slug: "mccb-dz" },
        ],
      },
      {
        heading: "Switch Disconnectors & Switch Disconnector Fuses - SDF",
        items: [{ name: "FN", slug: "sdf-fn" }],
      },
      {
        heading: "Busbar Trunking - BBT",
        items: [{ name: "S-Line", slug: "bbt-s-line" }],
      },
      {
        heading: "Change Over Switch - COS",
        items: [{ name: "C-Line", slug: "cos-c-line" }],
      },
    ],
  },
  {
    name: "Motor Management & Control",
    sections: [
      {
        heading: "Contactors",
        items: [
          { name: "MCX", slug: "contactor-mcx" },
          { name: "MNX", slug: "contactor-mnx" },
          { name: "MO", slug: "contactor-mo" },
          { name: "MO0", slug: "contactor-mo0" },
          { name: "MO C", slug: "contactor-mo-c" },
        ],
      },
      {
        heading: "Industrial Starter",
        items: [{ name: "MN Starter", slug: "mn-starter" }],
      },
      {
        heading: "Motor Protection Circuit Breaker",
        items: [{ name: "MOG", slug: "mpcb-mog" }],
      },
      {
        heading: "Electronic Motor Protection Relays",
        items: [{ name: "IMMR", slug: "immr" }],
      },
      {
        heading: "Over Load Relay - OLR",
        items: [
          { name: "MN Relay", slug: "olr-mn-relay" },
          { name: "RTO Relay", slug: "olr-rto-relay" },
          { name: "EOLR", slug: "olr-eolr" },
        ],
      },
    ],
  },
  {
    name: "Industrial Automation & Control",
    sections: [
      {
        heading: "AC Drive",
        items: [
          { name: "xD1000", slug: "ac-drive-xd1000" },
          { name: "xD2000", slug: "ac-drive-xd2000" },
          { name: "xD3000", slug: "ac-drive-xd3000" },
          { name: "xD4000", slug: "ac-drive-xd4000" },
          { name: "Sx2000", slug: "ac-drive-sx2000" },
          { name: "Fx2000", slug: "ac-drive-fx2000" },
          { name: "Hx2000", slug: "ac-drive-hx2000" },
          { name: "Nx2000", slug: "ac-drive-nx2000" },
          { name: "Nx2000+", slug: "ac-drive-nx2000-plus" },
        ],
      },
      {
        heading: "Soft Starters",
        items: [
          { name: "xS1000", slug: "soft-starter-xs1000" },
          { name: "xS2000", slug: "soft-starter-xs2000" },
          { name: "xS3000", slug: "soft-starter-xs3000" },
          { name: "xS4000", slug: "soft-starter-xs4000" },
        ],
      },
      {
        heading: "Programmable Logic Controller - PLC",
        items: [
          { name: "xP1000", slug: "plc-xp1000" },
          { name: "xP3000 and xP5000", slug: "plc-xp3000-xp5000" },
        ],
      },
      {
        heading: "Human-Machine Interface - HMI",
        items: [
          { name: "XT1000", slug: "hmi-xt1000" },
          { name: "xTE6000 and xTS6000", slug: "hmi-xte6000-xts6000" },
        ],
      },
      {
        heading: "Servo",
        items: [{ name: "M5", slug: "servo-m5" }],
      },
      {
        heading: "Gateways",
        items: [
          { name: "TG Gateways", slug: "tg-gateways" },
          { name: "MQ Gateways", slug: "mq-gateways" },
          { name: "XR Gateways", slug: "xr-gateways" },
        ],
      },
    ],
  },
  {
    name: "Energy Management Products",
    sections: [
      {
        heading: "Power Quality and Power Factor Correction",
        items: [
          { name: "Heavy Duty Capacitors", slug: "heavy-duty-capacitors" },
          { name: "Heavy - Gas Filled Capacitors", slug: "gas-filled-capacitors" },
          { name: "Ultra Heavy Capacitors", slug: "ultra-heavy-capacitors" },
        ],
      },
      {
        heading: "APFC Relays",
        items: [{ name: "ETASMART", slug: "apfc-etasmart" }],
      },
      {
        heading: "Digital Panel Meters",
        items: [{ name: "MFM", slug: "dpm-mfm" }],
      },
      {
        heading: "Tariff Meter",
        items: [
          { name: "EM101+", slug: "tariff-meter-em101-plus" },
          { name: "ER300P", slug: "tariff-meter-er300p" },
        ],
      },
    ],
  },
  {
    name: "MCB, RCCB & Distribution Boards",
    sections: [
      {
        heading: "Distribution Board - DB",
        items: [
          { name: "Exora.N", slug: "db-exora-n" },
          { name: "Tripper", slug: "db-tripper" },
        ],
      },
      {
        heading: "Miniature Circuit Breaker - MCB",
        items: [
          { name: "Exora", slug: "mcb-exora" },
          { name: "AU", slug: "mcb-au" },
          { name: "Tripper", slug: "mcb-tripper" },
        ],
      },
      {
        heading: "Residual Current Operated Circuit Breaker - RCBO",
        items: [{ name: "AU", slug: "rcbo-au" }],
      },
      {
        heading: "Residual Current Circuit Breaker - RCCB",
        items: [{ name: "Exora", slug: "rccb-exora" }],
      },
      {
        heading: "1Ph & 3Ph Automatic Changeover with Current Limiter - ACCL",
        items: [
          { name: "AU", slug: "accl-au" },
          { name: "Tripper", slug: "accl-tripper" },
        ],
      },
      {
        heading: "Surge Protective Devices - SPD",
        items: [{ name: "AU", slug: "spd-au" }],
      },
      {
        heading: "Modular Change Over",
        items: [{ name: "AU", slug: "modular-changeover-au" }],
      },
      {
        heading: "Modular Contactor",
        items: [{ name: "AU", slug: "modular-contactor-au" }],
      },
      {
        heading: "Isolators",
        items: [
          { name: "Exora", slug: "isolator-exora" },
          { name: "Tripper", slug: "isolator-tripper" },
        ],
      },
    ],
  },
  {
    name: "Switches & Accessories",
    sections: [
      {
        heading: "Modular Switches",
        items: [
          { name: "enGem", slug: "engem" },
          { name: "entice", slug: "entice" },
          { name: "Englaze", slug: "englaze" },
        ],
      },
      {
        heading: "Home Automation",
        items: [{ name: "enConnect", slug: "enconnect" }],
      },
    ],
  },
  {
    name: "Pump Starters and Controllers",
    sections: [
      {
        heading: "Starter",
        items: [{ name: "MK Starter", slug: "mk-starter" }],
      },
      {
        heading: "Controller",
        items: [
          { name: "MR-Gi Digital Single Phase Controller", slug: "mr-gi-controller" },
          { name: "MU-GS SMART Controller", slug: "mu-gs-smart-controller" },
        ],
      },
      {
        heading: "Solar Solutions",
        items: [{ name: "Solar Drive Controller", slug: "solar-drive-controller" }],
      },
      {
        heading: "Spares & Accessories",
        items: [
          { name: "M-POWER", slug: "m-power" },
          { name: "Box Capacitors", slug: "box-capacitors" },
          { name: "Cylindrical Capacitors", slug: "cylindrical-capacitors" },
        ],
      },
    ],
  },
  {
    name: "Panel Accessories",
    sections: [
      {
        heading: "Time Switches",
        items: [{ name: "FMQT", slug: "time-switch-fmqt" }],
      },
      {
        heading: "Timers",
        items: [{ name: "Micon 225", slug: "timer-micon-225" }],
      },
      {
        heading: "Monitoring Devices",
        items: [{ name: "Voltage Monitoring Relays", slug: "voltage-monitoring-relays" }],
      },
      {
        heading: "Push Buttons & Indicating Lamps",
        items: [{ name: "Gen Next Pro 22.5 mm", slug: "gen-next-pro" }],
      },
    ],
  },
];

// Fill product details incrementally — pages render a fallback until then.
// export const lkProducts: ProductDetail[] = [];

export const lkProducts: ProductDetail[] = productsJson as ProductDetail[];
