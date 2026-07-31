"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

type PricelistItem = { title: string; cover: string; pdf?: string };
type BrandTab = { id: string; name: string; logo: string; items: PricelistItem[] };

// realswitchgears.com's own PDF hosting went down (509, bandwidth exceeded)
// in ~July 2026. Every price list below was downloaded — from the brand's
// own site, a verified authorised dealer, or supplied directly — and
// re-hosted on our own Cloudinary account, so customers never see a third
// party's domain or branding in the address bar.
const tabs: BrandTab[] = [
  {
    id: "lt",
    name: "Lauritz Knudsen",
    logo: "/images/clients/lauritz_knudsen.svg",
    items: [
      { title: "Agri Price List", cover: "/images/pricelist/lt/Agri-Price-List.jpg", pdf: "/pricelist/files/lt__agri.pdf" },
      { title: "ESP Price List", cover: "/images/pricelist/lt/ESP-Price-List.jpg", pdf: "/pricelist/files/lt__esp.pdf" },
      { title: "Retail Products Price list", cover: "/images/pricelist/lt/Retail-Products-Price-List.jpg", pdf: "/pricelist/files/lt__retail.pdf" },
      { title: "Panel Accessories Price List", cover: "/images/pricelist/lt/Panel-Accessories.jpg", pdf: "/pricelist/files/lt__panel-accessories.pdf" },
      { title: "AU Solution Price List", cover: "/images/pricelist/lt/AU-Solution-Price-List.jpg", pdf: "/pricelist/files/lt__au-solution.pdf" },
      { title: "EXORA Price List", cover: "/images/pricelist/lt/Exora-Price-List.jpg", pdf: "/pricelist/files/lt__exora.pdf" },
    ],
  },
  {
    id: "polycab",
    name: "Polycab",
    logo: "/images/clients/polycab.svg",
    items: [
      { title: "Polycab Armoured Cables", cover: "/images/pricelist/polycab/Armoured-Cables.jpg", pdf: "/pricelist/files/polycab__armoured.pdf" },
      { title: "Polycab Flexible Cables", cover: "/images/pricelist/polycab/Flexible-Cables.jpg", pdf: "/pricelist/files/polycab__flexible.pdf" },
      { title: "Polycab LDC LP No. 12", cover: "/images/pricelist/polycab/Flexible-Cables.jpg", pdf: "/pricelist/files/polycab__ldc.pdf" },
      { title: "Polycab PCC LP No. 04", cover: "/images/pricelist/polycab/Armoured-Cables.jpg", pdf: "/pricelist/files/polycab__pcc.pdf" },
    ],
  },
  {
    id: "salzer",
    name: "Salzer",
    logo: "/images/clients/salzer.svg",
    items: [
      { title: "Salzer Direct Price List", cover: "/images/pricelist/salzer/Salzer-Direct.png", pdf: "/pricelist/files/salzer__direct.pdf" },
      { title: "Salzer L&T Price List", cover: "/images/pricelist/salzer/Salzer-LT.jpg", pdf: "/pricelist/files/salzer__lt.pdf" },
    ],
  },
  {
    id: "gic",
    name: "GIC",
    logo: "/images/clients/gic.svg",
    items: [
      { title: "GIC Direct Price List", cover: "/images/pricelist/gic/GIC-Direct-Price-List.jpg", pdf: "/pricelist/files/gic__direct.pdf" },
      { title: "GIC L&T Price List", cover: "/images/pricelist/gic/GIC-LT.jpg", pdf: "/pricelist/files/gic__lt.pdf" },
    ],
  },
  {
    id: "esbee",
    name: "Esbee",
    logo: "/images/clients/esbee.svg",
    items: [
      { title: "Esbee Direct Price List", cover: "/images/pricelist/esbee/Esbee-Direct.jpg", pdf: "/pricelist/files/esbee__direct.pdf" },
      { title: "Esbee L&T Price List", cover: "/images/pricelist/esbee/Esbee-LT.jpg", pdf: "/pricelist/files/esbee__lt.pdf" },
    ],
  },
  {
    id: "newtek",
    name: "Newtek",
    logo: "/images/clients/newtek_electricals.svg",
    items: [
      // All three supplied directly and re-hosted on Cloudinary.
      { title: "Newtek Resin Cast Price List", cover: "/images/pricelist/newtek/NEWTEK-Resin-Cast-REV.jpg", pdf: "/pricelist/files/newtek__resin-cast.pdf" },
      { title: "Newtek Split Core CT Price List", cover: "/images/pricelist/newtek/Split-Core-CT.jpg", pdf: "/pricelist/files/newtek__split-core-ct.pdf" },
      { title: "Newtek Nylon Casing Price List", cover: "/images/pricelist/newtek/Nylon-Casing-Revise.jpg", pdf: "/pricelist/files/newtek__nylon-casing.pdf" },
    ],
  },
  {
    id: "connectwell",
    name: "Connectwell",
    logo: "/images/clients/connectwell.svg",
    items: [
      // All four supplied directly and re-hosted on Cloudinary.
      { title: "Connectwell Single Page Price List", cover: "/images/pricelist/connectwell/Connectwell-Pricelist.png", pdf: "/pricelist/files/connectwell__single-page.pdf" },
      { title: "Connectwell Terminal Blocks (4N) Price List", cover: "/images/pricelist/connectwell/Connectwell-Pricelist.png", pdf: "/pricelist/files/connectwell__4n-terminal-blocks.pdf" },
      { title: "Connectwell Pipe & Glands (4T) Price List", cover: "/images/pricelist/connectwell/Connectwell-Pricelist.png", pdf: "/pricelist/files/connectwell__4t-pipe-glands.pdf" },
      { title: "Connectwell Terminal Blocks Price List", cover: "/images/pricelist/connectwell/Connectwell-Pricelist.png", pdf: "/pricelist/files/connectwell__terminal.pdf" },
    ],
  },
  {
    id: "braco",
    name: "Braco",
    logo: "/images/clients/braco.svg",
    items: [
      { title: "Braco Price List 2026", cover: "/images/pricelist/braco/Braco-Pricelist.jpg", pdf: "/pricelist/files/braco__national.pdf" },
    ],
  },
];

export default function PricelistGallery() {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active)!;

  return (
    <section className="py-6">
      <div className="mx-auto max-w-7xl px-4">
        {/* Brand logo tabs — 4-col grid on mobile so every brand is visible
            without scrolling; single scrollable line from sm: up where
            there's enough width. */}
        <div className="grid grid-cols-4 items-end justify-items-center gap-x-2 gap-y-5 border-b border-slate-200 pb-4 sm:flex sm:flex-nowrap sm:justify-center sm:gap-x-8 sm:gap-y-0 sm:overflow-x-auto sm:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className="flex shrink-0 flex-col items-center gap-3 pb-2 sm:pb-4 relative"
            >
              <Image
                src={tab.logo}
                alt={tab.name}
                width={400}
                height={80}
                className="h-9 w-auto max-w-full object-contain sm:h-14 sm:max-w-none md:h-20"
              />
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
            <Reveal key={`${p.cover}-${i}`} delay={Math.min(i * 80, 320)} y={24}>
              <a
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
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
