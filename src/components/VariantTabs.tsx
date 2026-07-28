"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Expand, FileDown, Search, X } from "lucide-react";
import type { ProductVariant } from "@/data/brands";

export default function VariantTabs({ variants }: { variants: ProductVariant[] }) {
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const v = variants[active];

  const filtered = useMemo(() => {
    if (!query.trim()) return variants.map((variant, i) => ({ variant, i }));
    const q = query.trim().toLowerCase();
    return variants
      .map((variant, i) => ({ variant, i }))
      .filter(({ variant }) => variant.name.toLowerCase().includes(q));
  }, [variants, query]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  return (
    <section className="py-12 md:py-16 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-7 w-1.5 rounded-full bg-brand-gradient" />
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">Models</h2>
            </div>
            <p className="mt-1.5 pl-4 text-sm text-slate-500">
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
          <div className="flex gap-2.5 overflow-x-scroll pb-3 cursor-grab active:cursor-grabbing select-none
  [scrollbar-width:thin]
  [scrollbar-color:#1268b3_#e2e8f0]
  [&::-webkit-scrollbar]:h-2.5
  [&::-webkit-scrollbar]:block
  [&::-webkit-scrollbar-track]:bg-slate-200
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-[#1268b3]
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:hover:bg-[#0f5694]">
            {filtered.length === 0 ? (
              <p className="py-2.5 text-sm text-slate-500">No models match &ldquo;{query}&rdquo;.</p>
            ) : (
              filtered.map(({ variant, i }) => (
                <button
                  key={variant.name}
                  onClick={() => setActive(i)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${i === active
                    ? "bg-brand-gradient text-white shadow-md scale-[1.03]"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-[#1268b3] hover:text-[#1268b3] hover:shadow-sm"
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-extrabold text-slate-800 text-balance">{v.name}</h3>
              <span className="mt-2 block h-1 w-10 rounded-full bg-brand-gradient" />
            </div>
            {variants.length > 1 && (
              <span className="rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-500">
                Model {active + 1} of {variants.length}
              </span>
            )}
          </div>

          <div className="mt-7 grid gap-8 md:grid-cols-2 items-stretch">
            <div>
              {v.description && <p className="text-slate-600 leading-relaxed mb-5">{v.description}</p>}
              {v.features && v.features.length > 0 && (
                <>
                  <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">Product Features</h4>
                  <ul className="mt-4 space-y-3">
                    {v.features.map((f, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-slate-700 leading-relaxed text-[15px] -mx-2 rounded-lg px-2 py-1 transition-colors hover:bg-slate-50"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#1268b3]" />
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {(v.image || v.catalogue) && (
              <div className="flex flex-col items-center justify-center gap-5">
                {v.image && (
                  <button
                    type="button"
                    onClick={() => setLightbox({ src: v.image!, alt: v.name })}
                    className="group relative w-full max-w-xs overflow-hidden rounded-xl bg-slate-50 p-5 ring-1 ring-slate-100 transition-shadow hover:shadow-md"
                  >
                    <Image
                      src={v.image}
                      alt={v.name}
                      width={480}
                      height={480}
                      className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 400px) 100vw, 320px"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-slate-900/0 transition-colors duration-300 group-hover:bg-slate-900/10">
                      <span className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100">
                        <Expand className="h-3.5 w-3.5" /> View
                      </span>
                    </span>
                  </button>
                )}
                {v.catalogue && (
                  <a
                    href={v.catalogue}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-brand-gradient text-white font-semibold px-5 py-2.5 text-sm rounded-full shadow-sm hover:opacity-90 transition-opacity">
                    <FileDown className="h-4 w-4" /> Download Catalogue
                  </a>
                )}
              </div>
            )}
          </div>

          {v.technicalImages && v.technicalImages.length > 0 && (
            <div className="mt-9 pt-7 border-t border-slate-100">
              <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">Technical Data</h4>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {v.technicalImages.map((src, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setLightbox({ src, alt: `${v.name} technical data ${i + 1}` })}
                    className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-3 transition-shadow hover:shadow-md"
                  >
                    <Image
                      src={src}
                      alt={`${v.name} technical data ${i + 1}`}
                      width={700}
                      height={300}
                      className="h-auto w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 240px"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-slate-900/0 transition-colors duration-300 group-hover:bg-slate-900/10">
                      <Expand className="h-4 w-4 text-white opacity-0 drop-shadow transition-opacity duration-300 group-hover:opacity-100" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {v.specTable && v.specTable.rows.length > 0 && (
            <div className="mt-9 pt-7 border-t border-slate-100">
              <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">Technical Details</h4>
              <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 shadow-[0_2px_12px_rgba(15,50,80,0.05)]">
                <table className="min-w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-brand-gradient text-white">
                      {v.specTable.headers.map((h, i) => (
                        <th key={i} className="px-3.5 py-3 text-left font-semibold whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {v.specTable.rows.map((row, ri) => (
                      <tr
                        key={ri}
                        className={`transition-colors hover:bg-blue-50/60 ${ri % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
                      >
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

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/85 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/30 transition-colors hover:bg-white hover:text-slate-900 sm:right-8 sm:top-8"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="relative h-[75vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={lightbox.src} alt={lightbox.alt} fill className="object-contain p-6" sizes="100vw" />
          </div>
        </div>
      )}
    </section>
  );
}
