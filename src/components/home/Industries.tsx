
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  RadioTower, Building2, Plane, Zap, Fuel, Mountain, Wheat, ScrollText,
} from "lucide-react";
import { industries } from "@/data/industries";

const iconMap: Record<string, React.ElementType> = {
  RadioTower, Building2, Plane, Zap, Fuel, Mountain, Wheat, ScrollText,
};

// backgrounds that rotate — add/remove paths to match your images
const backgrounds = [
  "/images/applications/aviationaa.jpg",
//   "/images/applications/mining.png",
  "/images/applications/energy.jpg",
  "/images/applications/agriculture.png",
  "/images/applications/cement-plant.jpg",
  "/images/applications/power-plant.jpg",
  "/images/applications/steel-plant.jpg",
  "/images/applications/oil_gas.jpg",
];

const ROTATE_MS = 5000; // change image every 5s — set 30000 for 30s

export default function Industries() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((i) => (i + 1) % backgrounds.length),
      ROTATE_MS
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Rotating backgrounds — stacked, crossfade via opacity */}
      {backgrounds.map((bg, i) => (
        <div
          key={bg}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === active ? 1 : 0 }}
        >
          <Image
            src={bg}
            alt=""
            fill
            sizes="100vw"
            quality={65}
            loading={i === 0 ? "eager" : "lazy"}
            className="object-cover object-center"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative mx-auto max-w-[1500px] px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white">
          Industries We Serve
        </h2>
        <p className="mt-5 text-white font-semibold text-lg">
          We are Technology Leaders In countless Industries
        </p>
        <p className="mt-1 text-slate-200">
          Don&apos;t see one you identify with here? Contact us today and tell
          us about your project!
        </p>

        <div className="mt-14 grid gap-8 grid-cols-2 md:grid-cols-4 xl:grid-cols-8">
          {industries.map((ind) => {
            const Icon = iconMap[ind.icon] ?? Zap;
            return (
              <div key={ind.name} className="flex flex-col items-center gap-4 group">
                <span className="h-32 w-32 rounded-full border-2 border-white flex items-center justify-center transition-colors group-hover:bg-white">
                  <Icon
                    className="h-12 w-12 text-white transition-colors group-hover:text-slate-900"
                    strokeWidth={1.5}
                  />
                </span>
                <h3 className="font-bold text-white leading-tight">{ind.name}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}