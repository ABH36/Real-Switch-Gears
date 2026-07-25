"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Menu, Plus, Minus, X } from "lucide-react";
import { brandNav } from "@/data/brand-nav";
import { site } from "@/data/site";
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

// Same idea, for the mobile menu's per-brand drill-down tree.
const MobileBrandTree = dynamic(() => import("./MobileBrandTree"), {
  ssr: false,
  loading: () => <p className="py-2 pl-4 text-sm text-slate-400">Loading…</p>,
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
  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set());
  const pathname = usePathname();

  const toggleBrand = (slug: string) =>
    setExpandedBrands((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });

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
    <>
      {/* Mobile-only logo — NOT sticky, so it scrolls up out of view naturally */}
      <div className="md:hidden flex items-center justify-center px-3 pt-3 pb-1">
        <Link href="/" onClick={() => setMobileOpen(false)}>
          <Image
            src="/images/logo/real_switchgear.png"
            alt={site.name}
            width={600}
            height={182}
            className="h-20 w-auto"
            loading="eager"
            fetchPriority="high"
          />
        </Link>
      </div>

      <div className="sticky top-0 z-50 px-3 md:px-8 pt-2 pb-5">
        <header className="bg-brand-gradient rounded-full shadow-lg mx-auto max-w-[1600px] relative flex items-center h-[55px]">
          <nav className="hidden md:flex flex-1 items-center justify-center gap-2">
            {navLinks.slice(0, 2).map((l) => (
              <NavItem key={l.href} {...l} active={pathname === l.href} />
            ))}

            {/* Products trigger — CLICK to toggle */}
            <button
              ref={triggerRef}
              onClick={() => setMenuOpen((o) => !o)}
              className={cn(
                "flex items-center gap-1 px-5 text-[15px] font-semibold hover:text-yellow-200",
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
            className="hidden md:flex absolute right-0 top-0 h-[55px] w-[170px] items-center justify-center bg-[#db2516] hover:opacity-90 text-white font-normal text-base rounded-full transition-opacity border-2"
          >
            Get A Quote
          </Link>

          {/* Mobile bar */}
          <div className="md:hidden flex w-full items-center justify-between px-4">
            <Link
              href="/quote"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center rounded-full bg-[#db2516] px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Get A Quote
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
          <nav className="md:hidden mt-2 mx-auto max-w-7xl bg-white rounded-3xl shadow-xl px-6 py-4 max-h-[70vh] overflow-y-auto">
            {navLinks.slice(0, 2).map((l) => (
              <MobileItem key={l.href} {...l} onClick={() => setMobileOpen(false)} />
            ))}
            <button
              className="w-full flex items-center justify-between py-3 font-semibold text-slate-800 border-b border-slate-100"
              onClick={() => setBrandsOpen(!brandsOpen)}
            >
              Products
              {brandsOpen ? (
                <Minus className="h-4 w-4 shrink-0 text-red-600" />
              ) : (
                <Plus className="h-4 w-4 shrink-0 text-[#1268b3]" />
              )}
            </button>
            {brandsOpen && (
              <div className="pl-2">
                {navBrands.map((b) => {
                  const isOpen = expandedBrands.has(b.slug);
                  return (
                    <div key={b.slug} className="border-b border-slate-50 last:border-none">
                      <button
                        onClick={() => toggleBrand(b.slug)}
                        className="flex w-full items-center justify-between py-2.5 pl-2 text-left text-sm font-semibold text-slate-700"
                      >
                        <span>{b.name}</span>
                        {isOpen ? (
                          <Minus className="h-3.5 w-3.5 shrink-0 text-red-600" />
                        ) : (
                          <Plus className="h-3.5 w-3.5 shrink-0 text-[#1268b3]" />
                        )}
                      </button>
                      {isOpen && (
                        <MobileBrandTree
                          brandSlug={b.slug}
                          onNavigate={() => setMobileOpen(false)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {navLinks.slice(2).map((l) => (
              <MobileItem key={l.href} {...l} onClick={() => setMobileOpen(false)} />
            ))}
            <Link
              href="/quote"
              className="mt-4 block text-center bg-red-600  text-white font-bold py-3 rounded-full"
              onClick={() => setMobileOpen(false)}
            >
              Get A Quote
            </Link>
          </nav>
        )}
      </div>
    </>
  );
}


function NavItem({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "px-5 text-[15px] font-semibold text-white hover:text-yellow-200 transition-colors",
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