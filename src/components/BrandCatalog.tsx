"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { CatalogCategory } from "@/data/brands";
import { cn, slugify } from "@/lib/utils";

function findFirstLeaf(categories: CatalogCategory[]): CatalogCategory | undefined {
  for (const c of categories) {
    if (c.sections) return c;
    if (c.children) {
      const leaf = findFirstLeaf(c.children);
      if (leaf) return leaf;
    }
  }
  return undefined;
}

export default function BrandCatalog({
  catalog,
  brandSlug,
}: {
  catalog: CatalogCategory[];
  brandSlug: string;
}) {
  const [active, setActive] = useState<CatalogCategory | undefined>(() => findFirstLeaf(catalog));
  const hasGroups = catalog.some((c) => c.children);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-10 items-start">
      {/* Category selector */}
      {hasGroups ? (
        // Nested nav (e.g. Polycab's Consumer / Industries groups) — always a
        // vertical tree, at every breakpoint, since horizontal scroll pills
        // can't represent nesting.
        <nav className="flex flex-col gap-1 lg:sticky lg:top-24">
          {catalog.map((cat) => (
            <CategoryTree key={cat.name} category={cat} active={active} onSelect={setActive} depth={0} />
          ))}
        </nav>
      ) : (
        // Flat leaf-only nav (every other brand) — unchanged: horizontal
        // scroll pills on mobile/tablet, stacked list on desktop.
        <div
          className="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                     lg:mx-0 lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-0 lg:px-0 lg:sticky lg:top-24"
        >
          {catalog.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActive(cat)}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-colors lg:w-full lg:whitespace-normal lg:rounded-xl lg:px-5 lg:py-3.5 lg:text-left",
                active === cat
                  ? "bg-brand-gradient text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="space-y-8 min-w-0">
        {!active || (active.sections?.length ?? 0) === 0 ? (
          <p className="text-slate-500">Product details coming soon.</p>
        ) : (
          active.sections!.map((section) => (
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
                          ? `/products/${brandSlug}/${slugify(section.heading)}/${item.slug}`
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
          ))
        )}
      </div>
    </div>
  );
}

function CategoryTree({
  category,
  active,
  onSelect,
  depth,
}: {
  category: CatalogCategory;
  active: CatalogCategory | undefined;
  onSelect: (c: CatalogCategory) => void;
  depth: number;
}) {
  const hasChildren = (category.children?.length ?? 0) > 0;
  const hasSections = (category.sections?.length ?? 0) > 0;
  const [open, setOpen] = useState(true);
  const indent = { paddingLeft: `${16 + depth * 16}px` };

  // pure leaf (e.g. "House Wire") — just a select button
  if (!hasChildren) {
    return (
      <button
        onClick={() => onSelect(category)}
        style={indent}
        className={cn(
          "w-full rounded-xl py-2.5 pr-4 text-left text-sm font-semibold transition-colors",
          active === category
            ? "bg-brand-gradient text-white shadow-sm"
            : "text-slate-700 hover:bg-slate-100"
        )}
      >
        {category.name}
      </button>
    );
  }

  // pure group (e.g. "Consumer") — no products of its own, just a toggle header
  if (!hasSections) {
    return (
      <div>
        <button
          onClick={() => setOpen((o) => !o)}
          style={indent}
          className="flex w-full items-center justify-between rounded-xl py-2.5 pr-4 text-left text-sm font-bold uppercase tracking-wide text-slate-500 hover:bg-slate-50"
        >
          <span className="truncate">{category.name}</span>
          <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 transition-transform", open && "rotate-180")} />
        </button>
        {open && (
          <div className="flex flex-col gap-1">
            {category.children!.map((child) => (
              <CategoryTree key={child.name} category={child} active={active} onSelect={onSelect} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // mixed (e.g. "Cables by Type" — has its own direct sections plus a further "Others" group):
  // selectable row for its own products, with a separate toggle to expand the nested children.
  return (
    <div>
      <div className="flex items-center" style={indent}>
        <button
          onClick={() => onSelect(category)}
          className={cn(
            "flex-1 min-w-0 rounded-xl py-2.5 text-left text-sm font-semibold transition-colors",
            active === category
              ? "bg-brand-gradient text-white shadow-sm"
              : "text-slate-700 hover:bg-slate-100"
          )}
        >
          <span className="truncate block pr-2">{category.name}</span>
        </button>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={`Toggle ${category.name} subcategories`}
          className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-1">
          {category.children!.map((child) => (
            <CategoryTree key={child.name} category={child} active={active} onSelect={onSelect} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
