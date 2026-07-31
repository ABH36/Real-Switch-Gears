"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Award, Calendar, Eye, ShieldCheck, X } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

export type CertificateItem = {
  name: string;
  file: string;
  year?: string;
};

export default function CertificateGallery({
  items,
  variant = "certificate",
}: {
  items: CertificateItem[];
  variant?: "certificate" | "award";
}) {
  const [active, setActive] = useState<CertificateItem | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <>
      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <Reveal key={`${item.file}-${i}`} delay={Math.min((i % 4) * 90, 270)} y={24}>
            <button
              onClick={() => setActive(item)}
              className="group relative flex w-full flex-col rounded-2xl bg-white text-left ring-1 ring-slate-200 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(15,23,42,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              {/* top accent bar */}
              <div className="h-1.5 w-full shrink-0 bg-brand-gradient" />

              {/* year badge for awards */}
              {variant === "award" && item.year && (
                <span className="absolute right-3 top-5 z-10 inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                  <Calendar className="h-3 w-3" />
                  {item.year}
                </span>
              )}

              {/* image area */}
              <div className="relative h-56 w-full overflow-hidden bg-linear-to-br from-slate-50 to-slate-100 p-6 sm:h-60">
                <div className="relative h-full w-full transition-transform duration-500 group-hover:scale-[1.06]">
                  <Image
                    src={item.file}
                    alt={item.name}
                    fill
                    className="object-contain drop-shadow-sm"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                </div>

                {/* hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 transition-colors duration-300 group-hover:bg-slate-900/35">
                  <span className="flex translate-y-2 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <Eye className="h-4 w-4" /> View Full
                  </span>
                </div>
              </div>

              {/* label */}
              <div className="flex flex-1 items-center justify-center gap-2 border-t border-slate-100 px-5 py-4 text-center">
                {variant === "certificate" ? (
                  <ShieldCheck className="h-4 w-4 shrink-0 text-red-600" />
                ) : (
                  <Award className="h-4 w-4 shrink-0 text-red-600" />
                )}
                <h3 className="text-base font-bold leading-snug text-slate-800 sm:text-lg">
                  {item.name}
                </h3>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/85 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setActive(null)}
        >
          <button
            onClick={() => setActive(null)}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/30 transition-colors hover:bg-white hover:text-slate-900 sm:right-8 sm:top-8"
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="flex w-full max-w-4xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[65vh] w-full overflow-hidden rounded-2xl bg-white shadow-2xl">
              <Image
                src={active.file}
                alt={active.name}
                fill
                className="object-contain p-6"
                sizes="100vw"
              />
            </div>
            <p className="mt-5 flex items-center gap-2 text-center text-lg font-bold text-white">
              {active.name}
              {active.year && (
                <span className="rounded-full bg-red-600 px-3 py-1 text-sm">
                  {active.year}
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
