"use client";

import { useState } from "react";
import Link from "next/link";
import { Link2 } from "lucide-react";
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
    <div className="grid gap-10 lg:grid-cols-[320px_1fr] items-start">
      {/* Sidebar tabs */}
      <div className="space-y-5">
        {catalog.map((cat, i) => (
          <button
            key={cat.name}
            onClick={() => setActive(i)}
            className={`w-full rounded-full px-6 py-5 text-lg font-semibold text-center transition-all shadow-[0_0_30px_rgba(0,0,0,0.08)] ${
              i === active
                ? "bg-brand-gradient text-white"
                : "bg-white text-slate-800 hover:text-teal-700"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-10">
        {current.sections.length === 0 && (
          <p className="text-lg text-slate-500">Product details coming soon.</p>
        )}

        {current.sections.map((section) => (
          <div key={section.heading}>
            <h3 className="text-xl md:text-2xl font-extrabold uppercase tracking-wide text-[#1268b3]">
              {section.heading}
            </h3>

            <ul className="mt-5 grid gap-x-12 gap-y-4 md:grid-cols-2">
              {section.items.map((item) => (
                <li key={item.name}>
                  <Link
                    href={
                      item.slug
                        ? `/brands/${brandSlug}/${item.slug}`
                        : `/brands/${brandSlug}`
                    }
                    className="flex items-start gap-3 text-lg font-semibold text-slate-800 hover:text-teal-700"
                  >
                    <Link2 className="mt-1 h-5 w-5 shrink-0 text-slate-700" />
                    <span>{item.name}</span>
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