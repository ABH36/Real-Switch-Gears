"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef, type ReactNode, type MouseEvent } from "react";

// Magnetic primary CTA: the button leans a few px toward the cursor while
// hovered (capped so it never drifts far), on top of the lift + gradient
// sweep + glow driven by the .cta-magnetic / .cta-arrow classes in
// globals.css. Client-only because it needs mousemove coordinates.
export default function EnquireCta({
  href = "/quote",
  className = "",
  children = "Enquire Now",
}: {
  href?: string;
  className?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  function handleMove(e: MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    const mx = Math.max(-1, Math.min(1, dx)) * 8;
    const my = Math.max(-1, Math.min(1, dy)) * 6;
    el.style.setProperty("--mx", `${mx.toFixed(1)}px`);
    el.style.setProperty("--my", `${my.toFixed(1)}px`);
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", "0px");
    el.style.setProperty("--my", "0px");
  }

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`cta-magnetic inline-flex items-center gap-2 bg-brand-gradient text-white font-semibold rounded-full ${className}`}
    >
      {children}
      <ArrowRight className="h-4 w-4 cta-arrow" />
    </Link>
  );
}
