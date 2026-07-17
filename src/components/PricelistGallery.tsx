"use client";

import { useState } from "react";
import Image from "next/image";

type PricelistItem = { title: string; cover: string; pdf?: string };
type BrandTab = { id: string; name: string; logo: string; items: PricelistItem[] };

const tabs: BrandTab[] = [
  {
    id: "lt",
    name: "Lauritz Knudsen",
    logo: "/images/clients/lauritz_knudsen.svg",
    items: [
      { title: "Agri Price List", cover: "/images/pricelist/lt/Agri-Price-List.jpg" },
      { title: "Agri Flat Cable Price List", cover: "/images/pricelist/lt/Agri-Flat-Cable-Price-List.jpg" },
      { title: "ESP Price List", cover: "/images/pricelist/lt/ESP-Price-List.jpg" },
      { title: "Retail Products Price list", cover: "/images/pricelist/lt/Retail-Products-Price-List.jpg" },
      { title: "Panel Accessories Price List", cover: "/images/pricelist/lt/Panel-Accessories.jpg" },
      { title: "AU Solution Price List", cover: "/images/pricelist/lt/AU-Solution-Price-List.jpg" },
      { title: "EXORA Price List", cover: "/images/pricelist/lt/Exora-Price-List.jpg" },
    ],
  },
  {
    id: "polycab",
    name: "Polycab",
    logo: "/images/clients/polycab.svg",
    items: [
      { title: "Armoured Cables Price List", cover: "/images/pricelist/polycab/Armoured-Cables.jpg" },
      { title: "Flexible Cables Price List", cover: "/images/pricelist/polycab/Flexible-Cables.jpg" },
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
          {current.items.map((p) => (
            <a key={p.cover} href={p.pdf ?? p.cover} target="_blank" rel="noopener noreferrer" className="group rounded-lg overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.09)] hover:-translate-y-1 transition-transform bg-white flex flex-col">
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