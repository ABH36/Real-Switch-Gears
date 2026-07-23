"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { brandNav } from "@/data/brand-nav";
import { cn } from "@/lib/utils";

// The full per-brand catalog (~1.5MB of product JSON) only loads once the
// user actually opens the desktop mega-menu, instead of shipping with
// every page's initial JS.
const BrandDrilldown = dynamic(() => import("./BrandDrilldown"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
      Loading…
    </div>
  ),
});

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Certificates", href: "/certificates" },
  { label: "Pricelist", href: "/pricelist" },
  { label: "Contact Us", href: "/contact" },
];

const navBrands = brandNav.filter((b) => b.slug !== "connectwell");

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeBrandSlug, setActiveBrandSlug] = useState(navBrands[0].slug);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // close on outside click / Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="sticky top-0 z-50 px-3 md:px-8 pt-2 pb-3">
      <header className="bg-brand-gradient rounded-full shadow-lg mx-auto max-w-[1600px] relative flex items-center">
        <nav className="hidden md:flex flex-1 items-center justify-center gap-2 py-1">
          {navLinks.slice(0, 2).map((l) => (
            <NavItem key={l.href} {...l} active={pathname === l.href} />
          ))}

          {/* Products trigger — CLICK to toggle */}
          <button
            ref={triggerRef}
            onClick={() => setMenuOpen((o) => !o)}
            className={cn(
              "flex items-center gap-1 px-5 py-4 font-semibold hover:text-yellow-200",
              menuOpen ? "text-yellow-200" : "text-white"
            )}
          >
            Products{" "}
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", menuOpen && "rotate-180")}
            />
          </button>

          {navLinks.slice(2).map((l) => (
            <NavItem key={l.href} {...l} active={pathname === l.href} />
          ))}
        </nav>

        <Link
          href="/quote"
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-10 py-5 rounded-full ring-4 ring-white transition-colors"
        >
          Get A Quote
        </Link>

        {/* Mobile bar */}
        <div className="md:hidden flex w-full items-center justify-between px-5 py-3">
          <Link href="/" className="font-extrabold text-white">
            REAL SWITCHGEARS
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            className="text-white"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* ===== LK-style unified panel ===== */}
        {menuOpen && (
          <div
            ref={panelRef}
            className="hidden md:block absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[min(1100px,94vw)] bg-white rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.25)] z-[100] overflow-hidden"
          >
            <div className="flex items-center justify-between px-8 pt-6">
              <h2 className="text-2xl font-extrabold text-slate-900">Products</h2>
              <button
                onClick={closeMenu}
                aria-label="Close products menu"
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-stretch px-4 pb-6 pt-4 h-[440px]">
              {/* Left: brand list — click to switch */}
              <ul className="w-[300px] shrink-0 pr-3 border-r border-slate-100 overflow-y-auto">
                {navBrands.map((b) => (
                  <li key={b.slug}>
                    <button
                      onClick={() => setActiveBrandSlug(b.slug)}
                      className={cn(
                        "w-full flex items-center justify-between text-left rounded-xl px-5 py-3.5 font-bold transition-colors",
                        activeBrandSlug === b.slug
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      {b.name}
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 shrink-0",
                          activeBrandSlug === b.slug ? "text-red-600" : "text-slate-300"
                        )}
                      />
                    </button>
                  </li>
                ))}
              </ul>

              {/* Right: active brand's catalog drill-down */}
              <BrandDrilldown
                key={activeBrandSlug}
                brandSlug={activeBrandSlug}
                onNavigate={closeMenu}
              />
            </div>
          </div>
        )}
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden mt-2 mx-auto max-w-7xl bg-white rounded-3xl shadow-xl px-6 py-4">
          {navLinks.slice(0, 2).map((l) => (
            <MobileItem key={l.href} {...l} onClick={() => setMobileOpen(false)} />
          ))}
          <button
            className="w-full flex items-center justify-between py-3 font-semibold text-slate-800 border-b border-slate-100"
            onClick={() => setBrandsOpen(!brandsOpen)}
          >
            Products
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", brandsOpen && "rotate-180")}
            />
          </button>
          {brandsOpen &&
            navBrands.map((b) => (
              <Link
                key={b.slug}
                href={`/products/${b.slug}`}
                className="block py-2 pl-4 text-sm text-slate-600"
                onClick={() => setMobileOpen(false)}
              >
                {b.name}
              </Link>
            ))}
          {navLinks.slice(2).map((l) => (
            <MobileItem key={l.href} {...l} onClick={() => setMobileOpen(false)} />
          ))}
          <Link
            href="/quote"
            className="mt-4 block text-center bg-red-600 text-white font-bold py-3 rounded-full"
            onClick={() => setMobileOpen(false)}
          >
            Get A Quote
          </Link>
        </nav>
      )}
    </div>
  );
}


function NavItem({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "px-5 py-4 font-semibold text-white hover:text-yellow-200 transition-colors",
        active && "text-yellow-200"
      )}
    >
      {label}
    </Link>
  );
}

function MobileItem({ label, href, onClick }: { label: string; href: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      className="block py-3 font-semibold text-slate-800 border-b border-slate-100"
      onClick={onClick}
    >
      {label}
    </Link>
  );
}