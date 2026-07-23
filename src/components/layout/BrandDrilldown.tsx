"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { brands } from "@/data/brands";
import { cn } from "@/lib/utils";

// Loaded only when the desktop "Products" menu is opened — pulls in every
// brand's full catalog/product JSON, so it must never be part of the
// initial bundle shipped with every page (see Header.tsx).
export default function BrandDrilldown({
  brandSlug,
  onNavigate,
}: {
  brandSlug: string;
  onNavigate: () => void;
}) {
  const brand = brands.find((b) => b.slug === brandSlug);
  const [activeCat, setActiveCat] = useState(0);
  const [drillSection, setDrillSection] = useState<number | null>(null);

  if (!brand) return null;

  const catalog = brand.catalog ?? [];

  // brand without catalog → simple panel with link
  if (catalog.length === 0) {
    return (
      <div className="flex-1 min-w-0 flex flex-col items-start justify-center px-10">
        <h3 className="text-xl font-extrabold uppercase tracking-wide text-slate-900">
          {brand.name}
        </h3>
        <p className="mt-3 text-slate-600">{brand.description}</p>
        <Link
          href={`/products/${brand.slug}`}
          onClick={onNavigate}
          className="mt-6 inline-block bg-brand-gradient text-white font-semibold px-7 py-2.5 rounded-full hover:opacity-90"
        >
          View {brand.name}
        </Link>
      </div>
    );
  }

  const category = catalog[Math.min(activeCat, catalog.length - 1)];
  const section = drillSection !== null ? category.sections[drillSection] : null;

  const selectCat = (i: number) => {
    setActiveCat(i);
    setDrillSection(null);
  };

  return (
    <div className="flex flex-1 min-w-0">
      {/* Categories */}
      <ul className="w-[300px] shrink-0 px-3 border-r border-slate-100 overflow-y-auto">
        {catalog.map((cat, i) => (
          <li key={cat.name}>
            <button
              onClick={() => selectCat(i)}
              className={cn(
                "w-full flex items-center justify-between text-left rounded-xl px-4 py-3 font-semibold transition-colors",
                i === activeCat
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-700 hover:bg-slate-50"
              )}
            >
              <span className="truncate">{cat.name}</span>
              <ChevronRight
                className={cn(
                  "h-4 w-4 shrink-0 ml-1",
                  i === activeCat ? "text-red-600" : "text-slate-300"
                )}
              />
            </button>
          </li>
        ))}
      </ul>

      {/* Drill-down */}
      <div className="flex-1 min-w-0 px-6 overflow-y-auto">
        {!section ? (
          <>
            <h3 className="text-base font-extrabold uppercase tracking-wide text-slate-900 border-b border-slate-200 pb-3">
              {category.name}
            </h3>
            <ul className="mt-2">
              <li>
                <Link
                  href={`/products/${brand.slug}`}
                  onClick={onNavigate}
                  className="block px-3 py-2.5 font-bold text-[#1268b3] underline underline-offset-4 hover:bg-slate-50 rounded-lg"
                >
                  All {category.name}
                </Link>
              </li>
              {category.sections.map((s, i) => (
                <li key={s.heading}>
                  <button
                    onClick={() => setDrillSection(i)}
                    className="w-full flex items-center justify-between text-left px-3 py-2.5 font-semibold text-slate-800 hover:bg-slate-100 rounded-lg"
                  >
                    <span className="truncate">{s.heading}</span>
                    <ChevronRight className="h-4 w-4 shrink-0 ml-1 text-slate-400" />
                  </button>
                </li>
              ))}
              {category.sections.length === 0 && (
                <li className="px-3 py-2.5 text-slate-500">Products coming soon.</li>
              )}
            </ul>
          </>
        ) : (
          <>
            <button
              onClick={() => setDrillSection(null)}
              className="flex items-center gap-2 text-base font-extrabold uppercase tracking-wide text-slate-900 border-b border-slate-200 pb-3 w-full text-left hover:text-red-600"
            >
              <ArrowLeft className="h-5 w-5 shrink-0 text-[#1268b3]" />
              <span className="truncate">{section.heading}</span>
            </button>
            <ul className="mt-2">
              <li>
                <Link
                  href={`/products/${brand.slug}`}
                  onClick={onNavigate}
                  className="block px-3 py-2.5 font-bold text-[#1268b3] underline underline-offset-4 hover:bg-slate-50 rounded-lg"
                >
                  All {section.heading}
                </Link>
              </li>
              {section.items.map((item) => (
                <li key={item.name}>
                  <Link
                    href={
                      item.slug
                        ? `/products/${brand.slug}/${item.slug}`
                        : `/products/${brand.slug}`
                    }
                    onClick={onNavigate}
                    className="block px-3 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 hover:text-red-600 rounded-lg"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
