"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { brands, getProductCategorySlug, type Brand, type CatalogCategory } from "@/data/brands";

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
  const [openPaths, setOpenPaths] = useState<Set<string>>(new Set());

  if (!brand) return null;
  const catalog = brand.catalog ?? [];

  const togglePath = (path: string) =>
    setOpenPaths((prev) => {
      const next = new Set(prev);
      next.has(path) ? next.delete(path) : next.add(path);
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

      {catalog.map((cat, i) => (
        <CategoryNode
          key={cat.name}
          category={cat}
          path={String(i)}
          brand={brand}
          openPaths={openPaths}
          togglePath={togglePath}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}

// A node is either a group (renders its `children` recursively, one level
// deeper each time — this is what lets Polycab's Industries > Cables by
// Application > Building infrastructure nest arbitrarily) or a leaf (renders
// its `sections`, same as every other brand always has).
function CategoryNode({
  category,
  path,
  brand,
  openPaths,
  togglePath,
  onNavigate,
}: {
  category: CatalogCategory;
  path: string;
  brand: Brand;
  openPaths: Set<string>;
  togglePath: (path: string) => void;
  onNavigate: () => void;
}) {
  const isOpen = openPaths.has(path);

  return (
    <div className="border-t border-slate-100">
      <button
        onClick={() => togglePath(path)}
        className="flex w-full items-center justify-between py-2.5 text-left text-sm font-semibold text-slate-800"
      >
        <span className="truncate pr-2">{category.name}</span>
        {isOpen ? (
          <Minus className="h-3.5 w-3.5 shrink-0 text-red-600" />
        ) : (
          <Plus className="h-3.5 w-3.5 shrink-0 text-[#1268b3]" />
        )}
      </button>

      {isOpen && (
        <div className="pl-3 pb-1">
          {category.children?.map((child, i) => (
            <CategoryNode
              key={child.name}
              category={child}
              path={`${path}-${i}`}
              brand={brand}
              openPaths={openPaths}
              togglePath={togglePath}
              onNavigate={onNavigate}
            />
          ))}

          {category.sections?.map((sec, si) => {
            const secPath = `${path}-s${si}`;
            const isSecOpen = openPaths.has(secPath);
            return (
              <div key={sec.heading}>
                <button
                  onClick={() => togglePath(secPath)}
                  className="flex w-full items-center justify-between py-2 text-left text-[13px] font-semibold text-slate-600"
                >
                  <span className="truncate pr-2">{sec.heading}</span>
                  {isSecOpen ? (
                    <Minus className="h-3 w-3 shrink-0 text-red-600" />
                  ) : (
                    <Plus className="h-3 w-3 shrink-0 text-[#1268b3]" />
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
}
