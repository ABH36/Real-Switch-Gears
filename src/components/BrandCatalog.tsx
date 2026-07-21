"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CatalogCategory } from "@/data/brands";

export default function BrandCatalog({
  catalog,
  brandSlug,
}: {
  catalog: CatalogCategory[];
  brandSlug: string;
}) {
  const [active, setActive] = useState(0);
  const current = catalog[active];

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-10 items-start">
      {/* Category selector — horizontal scroll on mobile/tablet, stacked list on desktop */}
      <div
        className="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                   lg:mx-0 lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-0 lg:px-0 lg:sticky lg:top-24"
      >
        {catalog.map((cat, i) => (
          <button
            key={cat.name}
            onClick={() => setActive(i)}
            className={`shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-colors lg:w-full lg:whitespace-normal lg:rounded-xl lg:px-5 lg:py-3.5 lg:text-left ${
              i === active
                ? "bg-brand-gradient text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-8 min-w-0">
        {current.sections.length === 0 && (
          <p className="text-slate-500">Product details coming soon.</p>
        )}

        {current.sections.map((section) => (
          <div key={section.heading}>
            <h3 className="text-sm font-bold uppercase tracking-wide text-[#1268b3]">
              {section.heading}
            </h3>
            <div className="mt-3 h-px bg-slate-200" />

            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {section.items.map((item) => (
                <li key={item.name}>
                  <Link
                    href={
                      item.slug
                        ? `/products/${brandSlug}/${item.slug}`
                        : `/products/${brandSlug}`
                    }
                    className="group flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-[#1268b3] transition-colors"
                  >
                    <span className="font-medium">{item.name}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-[#1268b3] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
