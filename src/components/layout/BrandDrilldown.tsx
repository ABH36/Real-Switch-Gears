"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { brands, getProductCategorySlug, type CatalogCategory } from "@/data/brands";
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
  // Index path through nested `.children` — [0] alone is "the Nth top-level
  // category selected"; longer paths drill into groups like Polycab's
  // Industries > Cables by Application. Independent from `drillSection`,
  // which is always relative to whichever leaf category `path` resolves to.
  const [path, setPath] = useState<number[]>([0]);
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

  let node: CatalogCategory = catalog[Math.min(path[0], catalog.length - 1)];
  for (let i = 1; i < path.length; i++) {
    if (!node.children?.length) break;
    node = node.children[Math.min(path[i], node.children.length - 1)];
  }
  const section = drillSection !== null ? (node.sections?.[drillSection] ?? null) : null;

  const selectTopCat = (i: number) => {
    setPath([i]);
    setDrillSection(null);
  };
  const drillInto = (i: number) => {
    setPath([...path, i]);
    setDrillSection(null);
  };
  const goBack = () => {
    if (drillSection !== null) setDrillSection(null);
    else if (path.length > 1) setPath(path.slice(0, -1));
  };
  const canGoBack = drillSection !== null || path.length > 1;

  return (
    <div className="flex flex-1 min-w-0">
      {/* Top-level categories */}
      <ul className="drilldown-scroll w-[300px] shrink-0 px-3 border-r border-slate-100 overflow-y-auto">
        {catalog.map((cat, i) => (
          <li key={cat.name}>
            <button
              onClick={() => selectTopCat(i)}
              className={cn(
                "w-full flex items-center justify-between text-left rounded-xl px-4 py-3 font-semibold transition-colors",
                path[0] === i
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-700 hover:bg-slate-50"
              )}
            >
              <span className="truncate">{cat.name}</span>
              <ChevronRight
                className={cn(
                  "h-4 w-4 shrink-0 ml-1",
                  path[0] === i ? "text-red-600" : "text-slate-300"
                )}
              />
            </button>
          </li>
        ))}
      </ul>

      {/* Drill-down */}
      <div className="drilldown-scroll flex-1 min-w-0 px-6 overflow-y-auto">
        {canGoBack ? (
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-base font-extrabold uppercase tracking-wide text-slate-900 border-b border-slate-200 pb-3 w-full text-left hover:text-red-600"
          >
            <ArrowLeft className="h-5 w-5 shrink-0 text-[#1268b3]" />
            <span className="truncate">{section ? section.heading : node.name}</span>
          </button>
        ) : (
          <h3 className="text-base font-extrabold uppercase tracking-wide text-slate-900 border-b border-slate-200 pb-3">
            {node.name}
          </h3>
        )}

        <ul className="mt-2">
          {!section && (
            <li>
              <Link
                href={`/products/${brand.slug}`}
                onClick={onNavigate}
                className="block px-3 py-2.5 font-bold text-[#1268b3] underline underline-offset-4 hover:bg-slate-50 rounded-lg"
              >
                All {node.name}
              </Link>
            </li>
          )}

          {!section &&
            node.children?.map((child, i) => (
              <li key={child.name}>
                <button
                  onClick={() => drillInto(i)}
                  className="w-full flex items-center justify-between text-left px-3 py-2.5 font-semibold text-slate-800 hover:bg-slate-100 rounded-lg"
                >
                  <span className="truncate">{child.name}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 ml-1 text-slate-400" />
                </button>
              </li>
            ))}

          {!section &&
            node.sections?.map((s, i) => (
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

          {!section && !node.children?.length && node.sections?.length === 0 && (
            <li className="px-3 py-2.5 text-slate-500">Products coming soon.</li>
          )}

          {section && (
            <>
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
                        ? `/products/${brand.slug}/${getProductCategorySlug(brand, item.slug)}/${item.slug}`
                        : `/products/${brand.slug}`
                    }
                    onClick={onNavigate}
                    className="block px-3 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 hover:text-red-600 rounded-lg"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
