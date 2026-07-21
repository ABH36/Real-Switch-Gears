"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { CheckCircle2, FileDown, Search } from "lucide-react";
import type { ProductVariant } from "@/data/brands";

export default function VariantTabs({ variants }: { variants: ProductVariant[] }) {
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const v = variants[active];

  const filtered = useMemo(() => {
    if (!query.trim()) return variants.map((variant, i) => ({ variant, i }));
    const q = query.trim().toLowerCase();
    return variants
      .map((variant, i) => ({ variant, i }))
      .filter(({ variant }) => variant.name.toLowerCase().includes(q));
  }, [variants, query]);

  return (
    <section className="py-12 md:py-16 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">Models</h2>
            <p className="mt-1 text-sm text-slate-500">
              {variants.length} model{variants.length !== 1 ? "s" : ""} available
            </p>
          </div>

          {variants.length > 8 && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search models..."
                className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1268b3]/30 focus:border-[#1268b3]"
              />
            </div>
          )}
        </div>

        {/* Tabs — horizontally scrollable strip, works the same on mobile & desktop */}
        <div className="mt-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filtered.length === 0 ? (
              <p className="py-2.5 text-sm text-slate-500">No models match &ldquo;{query}&rdquo;.</p>
            ) : (
              filtered.map(({ variant, i }) => (
                <button
                  key={variant.name}
                  onClick={() => setActive(i)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    i === active
                      ? "bg-brand-gradient text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-[#1268b3] hover:text-[#1268b3]"
                  }`}
                >
                  {variant.name}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Panel */}
        <div className="mt-4 rounded-2xl bg-white p-6 md:p-8 shadow-[0_2px_20px_rgba(15,50,80,0.06)]">
          <h3 className="text-xl font-extrabold text-slate-800 text-balance">{v.name}</h3>
          <span className="mt-2 block h-1 w-10 rounded-full bg-brand-gradient" />

          <div className="mt-7 grid gap-8 md:grid-cols-2 items-start">
            <div>
              {v.description && <p className="text-slate-600 leading-relaxed mb-5">{v.description}</p>}
              {v.features && v.features.length > 0 && (
                <>
                  <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">Product Features</h4>
                  <ul className="mt-4 space-y-2.5">
                    {v.features.map((f, i) => (
                      <li key={i} className="flex gap-2.5 text-slate-700 leading-relaxed text-[15px]">
                        <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-[#1268b3]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {(v.image || v.catalogue) && (
              <div className="flex flex-col items-center gap-5">
                {v.image && (
                  <div className="w-full max-w-xs rounded-xl bg-slate-50 p-5">
                    <Image
                      src={v.image}
                      alt={v.name}
                      width={480}
                      height={480}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                )}
                {v.catalogue && (
                  <a
                    href={v.catalogue}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-slate-300 text-slate-700 font-semibold px-5 py-2.5 text-sm rounded-full hover:border-[#1268b3] hover:text-[#1268b3] transition-colors"
                  >
                    <FileDown className="h-4 w-4" /> Download Catalogue
                  </a>
                )}
              </div>
            )}
          </div>

          {v.technicalImages && v.technicalImages.length > 0 && (
            <div className="mt-9 pt-7 border-t border-slate-100">
              <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">Technical Data</h4>
              <div className="mt-4 flex flex-wrap gap-4">
                {v.technicalImages.map((src, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 bg-white p-3">
                    <Image
                      src={src}
                      alt={`${v.name} technical data ${i + 1}`}
                      width={700}
                      height={300}
                      className="h-auto w-full max-w-[480px] object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {v.specTable && v.specTable.rows.length > 0 && (
            <div className="mt-9 pt-7 border-t border-slate-100">
              <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">Technical Details</h4>
              <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#1268b3] text-white">
                      {v.specTable.headers.map((h, i) => (
                        <th key={i} className="px-3.5 py-2.5 text-left font-semibold whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {v.specTable.rows.map((row, ri) => (
                      <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-3.5 py-2.5 whitespace-nowrap text-slate-700">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
