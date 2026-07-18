"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, FileDown } from "lucide-react";
import type { ProductVariant } from "@/data/brands";

export default function VariantTabs({ variants }: { variants: ProductVariant[] }) {
  const [active, setActive] = useState(0);
  const v = variants[active];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-[1500px] px-4">
        <h2 className="text-4xl font-extrabold text-[#1268b3]">Models</h2>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap">
          {variants.map((variant, i) => (
            <button
              key={variant.name}
              onClick={() => setActive(i)}
              className={`px-5 py-3 text-sm font-bold border transition-colors ${
                i === active
                  ? "bg-white text-slate-800 border-slate-200 border-b-white -mb-px z-10"
                  : "bg-red-600 text-white border-red-600 hover:bg-red-700"
              }`}
            >
              {variant.name}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="border border-slate-200 bg-slate-50 p-8 md:p-10">
          <h3 className="text-2xl font-extrabold text-slate-800">{v.name}</h3>
          <span className="mt-2 block h-1 w-12 bg-red-600" />

          <div className="mt-8 grid gap-10 md:grid-cols-2 items-start">
            <div>
              {v.description && (
                <p className="text-slate-700 leading-relaxed mb-6">{v.description}</p>
              )}
              {v.features && v.features.length > 0 && (
                <>
                  <h4 className="text-xl font-bold text-slate-800">Product Feature</h4>
                  <span className="mt-2 block h-1 w-10 bg-red-600" />
                  <ul className="mt-5 space-y-3">
                    {v.features.map((f, i) => (
                      <li key={i} className="flex gap-3 text-slate-700 leading-relaxed">
                        <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-yellow-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {(v.image || v.catalogue) && (
              <div className="flex flex-col items-center gap-6">
                {v.image && (
                  <Image
                    src={v.image}
                    alt={v.name}
                    width={480}
                    height={480}
                    className="w-full max-w-[360px] h-auto object-contain"
                  />
                )}
                {v.catalogue && (
                  <a
                    href={v.catalogue}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-red-600 text-red-600 font-semibold px-6 py-2.5 text-sm hover:bg-red-600 hover:text-white transition-colors"
                  >
                    <FileDown className="h-4 w-4" /> Download Catalogue
                  </a>
                )}
              </div>
            )}
          </div>

          {v.technicalImages && v.technicalImages.length > 0 && (
            <div className="mt-10">
              <h4 className="text-xl font-bold text-slate-800">Technical Data</h4>
              <span className="mt-2 block h-1 w-10 bg-red-600" />
              <div className="mt-5 flex flex-wrap gap-6">
                {v.technicalImages.map((src, i) => (
                  <Image
                    key={i}
                    src={src}
                    alt={`${v.name} technical data ${i + 1}`}
                    width={700}
                    height={300}
                    className="h-auto w-full max-w-[520px] object-contain border border-slate-200 bg-white"
                  />
                ))}
              </div>
            </div>
          )}

          {v.specTable && v.specTable.rows.length > 0 && (
            <div className="mt-10">
              <h4 className="text-xl font-bold text-slate-800">Technical Details</h4>
              <span className="mt-2 block h-1 w-10 bg-red-600" />
              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#1268b3] text-white">
                      {v.specTable.headers.map((h, i) => (
                        <th key={i} className="px-3 py-2 text-left font-semibold whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {v.specTable.rows.map((row, ri) => (
                      <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-slate-100"}>
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-3 py-2 whitespace-nowrap text-slate-700 border-t border-slate-200">
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