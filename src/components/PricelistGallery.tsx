"use client";

import { useState } from "react";
import Image from "next/image";

type PricelistItem = { title: string; cover: string; pdf?: string };
type BrandTab = { id: string; name: string; logo: string; items: PricelistItem[] };

// realswitchgears.com's own PDF hosting has been down (509, bandwidth
// exceeded) since ~July 2026. Where a current price list could be found —
// via the brand's own site or another verified authorised dealer, never an
// unverified re-upload — it was downloaded, compressed, and re-hosted on our
// own Cloudinary account below, so customers never see a third party's
// domain or branding in the address bar. The handful still on PDF_BASE have
// no public source anywhere (confidential dealer pricing, or the brand
// simply doesn't publish one) and stay pointed at the dead link.
const PDF_BASE = "https://realswitchgears.com/img/pricelist";

const tabs: BrandTab[] = [
  {
    id: "lt",
    name: "Lauritz Knudsen",
    logo: "/images/clients/lauritz_knudsen.svg",
    items: [
      { title: "Agri Price List", cover: "/images/pricelist/lt/Agri-Price-List.jpg", pdf: "https://res.cloudinary.com/aokdwbfg/image/upload/v1785328200/pricelist/lt__agri.pdf" },
      { title: "ESP Price List", cover: "/images/pricelist/lt/ESP-Price-List.jpg", pdf: "https://res.cloudinary.com/aokdwbfg/image/upload/v1785328204/pricelist/lt__esp.pdf" },
      { title: "Retail Products Price list", cover: "/images/pricelist/lt/Retail-Products-Price-List.jpg", pdf: "https://res.cloudinary.com/aokdwbfg/image/upload/v1785328208/pricelist/lt__retail.pdf" },
      { title: "Panel Accessories Price List", cover: "/images/pricelist/lt/Panel-Accessories.jpg", pdf: "https://res.cloudinary.com/aokdwbfg/image/upload/v1785328207/pricelist/lt__panel-accessories.pdf" },
      { title: "AU Solution Price List", cover: "/images/pricelist/lt/AU-Solution-Price-List.jpg", pdf: "https://res.cloudinary.com/aokdwbfg/image/upload/v1785328202/pricelist/lt__au-solution.pdf" },
      { title: "EXORA Price List", cover: "/images/pricelist/lt/Exora-Price-List.jpg", pdf: "https://res.cloudinary.com/aokdwbfg/image/upload/v1785328205/pricelist/lt__exora.pdf" },
    ],
  },
  {
    id: "polycab",
    name: "Polycab",
    logo: "/images/clients/polycab.svg",
    items: [
      { title: "Polycab Armoured Cables", cover: "/images/pricelist/polycab/Armoured-Cables.jpg", pdf: "https://res.cloudinary.com/aokdwbfg/image/upload/v1785328209/pricelist/polycab__armoured-flexible.pdf" },
      { title: "Polycab Flexible Cables", cover: "/images/pricelist/polycab/Flexible-Cables.jpg", pdf: "https://res.cloudinary.com/aokdwbfg/image/upload/v1785328209/pricelist/polycab__armoured-flexible.pdf" },
      { title: "Polycab Industrial Cables", cover: "/images/pricelist/polycab/Flexible-Cables.jpg" },
      { title: "Polycab LDC LP No. 12", cover: "/images/pricelist/polycab/Flexible-Cables.jpg", pdf: "https://res.cloudinary.com/aokdwbfg/image/upload/v1785328211/pricelist/polycab__ldc-pcc.pdf" },
      { title: "Polycab PCC LP No. 04", cover: "/images/pricelist/polycab/Armoured-Cables.jpg", pdf: "https://res.cloudinary.com/aokdwbfg/image/upload/v1785328211/pricelist/polycab__ldc-pcc.pdf" },
    ],
  },
  {
    id: "salzer",
    name: "Salzer",
    logo: "/images/clients/salzer.svg",
    items: [
      { title: "Salzer Direct Price List", cover: "/images/pricelist/salzer/Salzer-Direct.png", pdf: "https://res.cloudinary.com/aokdwbfg/image/upload/v1785328212/pricelist/salzer__direct.pdf" },
      // No public source exists for L&T-channel Salzer pricing anywhere — it's
      // confidential dealer pricing, not something any manufacturer or
      // reseller publishes. Left on the dead realswitchgears.com link.
      { title: "Salzer L&T Price List", cover: "/images/pricelist/salzer/Salzer-LT.jpg", pdf: `${PDF_BASE}/2026/SALZER L&T Price List .pdf` },
    ],
  },
  {
    id: "gic",
    name: "GIC",
    logo: "/images/clients/gic.svg",
    items: [
      { title: "GIC Direct Price List", cover: "/images/pricelist/gic/GIC-Direct-Price-List.jpg", pdf: "https://res.cloudinary.com/aokdwbfg/image/upload/v1785328198/pricelist/gic__direct.pdf" },
      { title: "GIC L&T Price List", cover: "/images/pricelist/gic/GIC-LT.jpg", pdf: "https://res.cloudinary.com/aokdwbfg/image/upload/v1785328199/pricelist/gic__lt.pdf" },
    ],
  },
  {
    id: "esbee",
    name: "Esbee",
    logo: "/images/clients/esbee.svg",
    items: [
      { title: "Esbee Direct Price List", cover: "/images/pricelist/esbee/Esbee-Direct.jpg", pdf: "https://res.cloudinary.com/aokdwbfg/image/upload/v1785328196/pricelist/esbee__direct.pdf" },
      { title: "Esbee L&T Price List", cover: "/images/pricelist/esbee/Esbee-LT.jpg", pdf: "https://res.cloudinary.com/aokdwbfg/image/upload/v1785328197/pricelist/esbee__lt.pdf" },
    ],
  },
  {
    id: "newtek",
    name: "Newtek",
    logo: "/images/clients/newtek_electricals.svg",
    items: [
      // Newtek doesn't publish price lists anywhere public (their own site
      // says "enquire for price"); these three still point at the dead link.
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
      // No public Connectwell price list found (only product catalogues);
      // these four still point at the dead link.
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
      { title: "Braco Price List 2026", cover: "/images/pricelist/braco/Braco-Pricelist.jpg", pdf: "https://res.cloudinary.com/aokdwbfg/image/upload/v1785328194/pricelist/braco__national.pdf" },
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
