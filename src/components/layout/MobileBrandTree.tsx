"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { brands, getProductCategorySlug } from "@/data/brands";

// Loaded only when a brand row is expanded in the mobile menu — pulls in
// that brand's full catalog JSON, so it must never be part of the initial
// bundle shipped with every page (see Header.tsx / BrandDrilldown.tsx).
export default function MobileBrandTree({
  brandSlug,
  onNavigate,
}: {
  brandSlug: string;
  onNavigate: () => void;
}) {
  const brand = brands.find((b) => b.slug === brandSlug);
  const [openCats, setOpenCats] = useState<Set<number>>(new Set());
  const [openSecs, setOpenSecs] = useState<Set<string>>(new Set());

  if (!brand) return null;
  const catalog = brand.catalog ?? [];

  const toggleCat = (i: number) =>
    setOpenCats((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const toggleSec = (key: string) =>
    setOpenSecs((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  if (catalog.length === 0) {
    return (
      <Link
        href={`/products/${brand.slug}`}
        onClick={onNavigate}
        className="block py-2 pl-4 text-sm font-semibold text-[#1268b3]"
      >
        View {brand.name}
      </Link>
    );
  }

  return (
    <div className="pl-3">
      <Link
        href={`/products/${brand.slug}`}
        onClick={onNavigate}
        className="block py-2 text-sm font-bold text-[#1268b3] underline underline-offset-4"
      >
        View All {brand.name}
      </Link>

      {catalog.map((cat, ci) => {
        const isCatOpen = openCats.has(ci);
        return (
          <div key={cat.name} className="border-t border-slate-100">
            <button
              onClick={() => toggleCat(ci)}
              className="flex w-full items-center justify-between py-2.5 text-left text-sm font-semibold text-slate-800"
            >
              <span className="truncate pr-2">{cat.name}</span>
              {isCatOpen ? (
                <Minus className="h-3.5 w-3.5 shrink-0 text-red-600" />
              ) : (
                <Plus className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              )}
            </button>

            {isCatOpen && (
              <div className="pl-3 pb-1">
                {cat.sections.map((sec, si) => {
                  const key = `${ci}-${si}`;
                  const isSecOpen = openSecs.has(key);
                  return (
                    <div key={sec.heading}>
                      <button
                        onClick={() => toggleSec(key)}
                        className="flex w-full items-center justify-between py-2 text-left text-[13px] font-semibold text-slate-600"
                      >
                        <span className="truncate pr-2">{sec.heading}</span>
                        {isSecOpen ? (
                          <Minus className="h-3 w-3 shrink-0 text-red-600" />
                        ) : (
                          <Plus className="h-3 w-3 shrink-0 text-slate-300" />
                        )}
                      </button>

                      {isSecOpen && (
                        <ul className="pl-3 pb-1">
                          {sec.items.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={
                                  item.slug
                                    ? `/products/${brand.slug}/${getProductCategorySlug(brand, item.slug)}/${item.slug}`
                                    : `/products/${brand.slug}`
                                }
                                onClick={onNavigate}
                                className="block py-1.5 text-[13px] text-slate-500 hover:text-red-600"
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
