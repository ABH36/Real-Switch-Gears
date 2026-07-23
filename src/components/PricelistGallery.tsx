"use client";

import { useState } from "react";
import Image from "next/image";

type PricelistItem = { title: string; cover: string; pdf?: string };
type BrandTab = { id: string; name: string; logo: string; items: PricelistItem[] };

const PDF_BASE = "https://realswitchgears.com/img/pricelist";

const tabs: BrandTab[] = [
  {
    id: "lt",
    name: "Lauritz Knudsen",
    logo: "/images/clients/lauritz_knudsen.svg",
    items: [
      { title: "Agri Price List", cover: "/images/pricelist/lt/Agri-Price-List.jpg", pdf: `${PDF_BASE}/2026/Agri Price list 01-06-2026.pdf` },
      { title: "ESP Price List", cover: "/images/pricelist/lt/ESP-Price-List.jpg", pdf: `${PDF_BASE}/2026/ESP Price List 01-06-2026.pdf` },
      { title: "Retail Products Price list", cover: "/images/pricelist/lt/Retail-Products-Price-List.jpg", pdf: `${PDF_BASE}/2026/Retail Products Price list 01-06-2026.pdf` },
      { title: "Panel Accessories Price List", cover: "/images/pricelist/lt/Panel-Accessories.jpg", pdf: `${PDF_BASE}/2026/Panel Accessories Price List 01-06-2026.pdf` },
      { title: "AU Solution Price List", cover: "/images/pricelist/lt/AU-Solution-Price-List.jpg", pdf: `${PDF_BASE}/2026/AU Pricelist.pdf` },
      { title: "EXORA Price List", cover: "/images/pricelist/lt/Exora-Price-List.jpg", pdf: `${PDF_BASE}/2026/EXORA ESP Price List.pdf` },
    ],
  },
  {
    id: "polycab",
    name: "Polycab",
    logo: "/images/clients/polycab.svg",
    items: [
      { title: "Polycab Armoured Cables", cover: "/images/pricelist/polycab/Armoured-Cables.jpg", pdf: `${PDF_BASE}/2026/POLYCAB 02 Armoured Cables 29-04-2026 PCC LP No. 02 Dtd 29th April 2026.pdf` },
      { title: "Polycab Flexible Cables", cover: "/images/pricelist/polycab/Flexible-Cables.jpg", pdf: `${PDF_BASE}/2026/POLYCAB 03 Flexible Cables 21-05-2026 LDC LP No. 03 Dtd 21st May 2026.pdf` },
      { title: "Polycab Industrial Cables", cover: "/images/pricelist/polycab/Flexible-Cables.jpg" },
      { title: "Polycab LDC LP No. 12", cover: "/images/pricelist/polycab/Flexible-Cables.jpg", pdf: `${PDF_BASE}/2026/LDC LP No. 12 Dtd 4th February 2026.pdf` },
      { title: "Polycab PCC LP No. 04", cover: "/images/pricelist/polycab/Armoured-Cables.jpg", pdf: `${PDF_BASE}/2026/PCC LP No. 04 Dtd 13th January 2026.pdf` },
    ],
  },
  {
    id: "salzer",
    name: "Salzer",
    logo: "/images/clients/salzer.svg",
    items: [
      { title: "Salzer Direct Price List", cover: "/images/pricelist/salzer/Salzer-Direct.png", pdf: `${PDF_BASE}/2026/Salzer New Price List 04.06.26.pdf` },
      { title: "Salzer L&T Price List", cover: "/images/pricelist/salzer/Salzer-LT.jpg", pdf: `${PDF_BASE}/2026/SALZER L&T Price List .pdf` },
    ],
  },
  {
    id: "gic",
    name: "GIC",
    logo: "/images/clients/gic.svg",
    items: [
      { title: "GIC Direct Price List", cover: "/images/pricelist/gic/GIC-Direct-Price-List.jpg", pdf: `${PDF_BASE}/2026/GIC Direct Domestic_FY 2026 Price list Rev 0_02.05.2026.pdf` },
      { title: "GIC L&T Price List", cover: "/images/pricelist/gic/GIC-LT.jpg", pdf: `${PDF_BASE}/2026/GIC L&T Price List.pdf` },
    ],
  },
  {
    id: "esbee",
    name: "Esbee",
    logo: "/images/clients/esbee.svg",
    items: [
      { title: "Esbee Direct Price List", cover: "/images/pricelist/esbee/Esbee-Direct.jpg", pdf: `${PDF_BASE}/2026/Esbee Direct Price List 15-04-2026.pdf` },
      { title: "Esbee L&T Price List", cover: "/images/pricelist/esbee/Esbee-LT.jpg", pdf: `${PDF_BASE}/2026/ESBEE L&T Price List.pdf` },
    ],
  },
  {
    id: "newtek",
    name: "Newtek",
    logo: "/images/clients/newtek_electricals.svg",
    items: [
      { title: "Newtek Resin Cast Price List", cover: "/images/pricelist/newtek/NEWTEK-Resin-Cast-REV.jpg", pdf: `${PDF_BASE}/2026/NEWTEK RESIN CAST 01-04-2026.pdf` },
      { title: "Newtek Split Core CT Price List", cover: "/images/pricelist/newtek/Split-Core-CT.jpg", pdf: `${PDF_BASE}/split-core-price-list-24-05-2022.pdf` },
      { title: "Newtek Nylon Casing Price List", cover: "/images/pricelist/newtek/Nylon-Casing-Revise.jpg", pdf: `${PDF_BASE}/2026/NEWTEK New Nylon Price list 01-04-2026.pdf` },
    ],
  },
  {
    id: "connectwell",
    name: "Connectwell",
    logo: "/images/clients/connectwell.svg",
    items: [
      { title: "Connectwell Single Page Price List", cover: "/images/pricelist/connectwell/Connectwell-Pricelist.png", pdf: `${PDF_BASE}/2026/Connectwell-Single-PagePrice-List-10-04-2026.pdf` },
      { title: "Connectwell Terminal Blocks (4N) Price List", cover: "/images/pricelist/connectwell/Connectwell-Pricelist.png", pdf: `${PDF_BASE}/2026/Connectwell  CW Terminal Blocks 4N Price List 2026-27.pdf` },
      { title: "Connectwell Pipe & Glands (4T) Price List", cover: "/images/pricelist/connectwell/Connectwell-Pricelist.png", pdf: `${PDF_BASE}/2026/Controlwell-Price-List-(4T)-wef-10-Apr-26.pdf` },
      { title: "Connectwell Terminal Blocks Price List", cover: "/images/pricelist/connectwell/Connectwell-Pricelist.png", pdf: `${PDF_BASE}/2026/Connectwell  Terminal Price List  10-Apr-26.pdf` },
    ],
  },
  {
    id: "braco",
    name: "Braco",
    logo: "/images/clients/braco.svg",
    items: [
      { title: "Braco Price List 2026", cover: "/images/pricelist/braco/Braco-Pricelist.jpg", pdf: `${PDF_BASE}/2026/Braco-List-Price-01.01.2026.pdf` },
    ],
  },
];

export default function PricelistGallery() {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active)!;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Brand logo tabs */}
        <div className="flex flex-wrap items-end justify-center gap-x-12 gap-y-6 border-b border-slate-200 pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className="flex flex-col items-center gap-3 pb-4 relative"
            >
              <span className="relative h-14 w-36">
                <Image src={tab.logo} alt={tab.name} fill className="object-contain" sizes="144px" />
              </span>
              {/* active underline */}
              <span
                className={`absolute bottom-0 left-0 right-0 h-1 rounded-full transition-opacity ${
                  active === tab.id ? "bg-blue-700 opacity-100" : "opacity-0"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {current.items.map((p, i) => (
            <a
              key={`${p.cover}-${i}`}
              href={encodeURI(p.pdf ?? p.cover)}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-lg overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.09)] hover:-translate-y-1 transition-transform bg-white flex flex-col"
            >
              <Image
                src={p.cover}
                alt={p.title}
                width={500}
                height={700}
                className="w-full h-auto"
              />
              <div className="bg-[#1268b3] py-4 px-3 text-center mt-auto">
                <h3 className="text-white font-bold text-lg leading-snug">{p.title}</h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
