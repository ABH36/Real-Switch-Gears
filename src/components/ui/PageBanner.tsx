import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export default function PageBanner({
  title,
  image,
  icon: Icon,
}: {
  title: string;
  image?: string;
  icon?: LucideIcon;
}) {
  return (
    <section
      className="relative overflow-hidden bg-brand-gradient bg-cover bg-center py-24 md:py-32"
      style={image ? { backgroundImage: `url(${image})` } : undefined}
    >
      {/* dark wash for text contrast — heavier when a photo sits behind it */}
      <div
        className={
          image
            ? "absolute inset-0 bg-slate-900/60"
            : "absolute inset-0 bg-linear-to-b from-slate-900/45 via-slate-900/25 to-slate-900/55"
        }
      />

      {/* subtle dot-grid texture */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* soft glow accents */}
      <div className="pointer-events-none absolute -top-20 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-red-500/25 blur-3xl" />

      {/* large faded watermark icon */}
      {Icon && (
        <Icon
          strokeWidth={1}
          className="pointer-events-none absolute -right-6 -bottom-12 h-52 w-52 text-white/10 md:-right-4 md:-bottom-16 md:h-72 md:w-72"
        />
      )}

      <div className="relative mx-auto max-w-7xl px-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-sm md:text-6xl">
          {title}
        </h1>
        <div className="mt-6 flex items-center justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-wide ring-1 ring-white/25 backdrop-blur-sm md:text-sm">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-slate-200 transition-colors hover:text-white"
            >
              <Home className="h-3.5 w-3.5" /> Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-white">{title}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
