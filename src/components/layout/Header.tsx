
// "use client";

// import { useRef, useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { ArrowLeft, ChevronDown, ChevronRight, Menu, X, MoveRight } from "lucide-react";
// import { brands, type Brand } from "@/data/brands";
// import { cn } from "@/lib/utils";

// const navLinks = [
//   { label: "Home", href: "/" },
//   { label: "About Us", href: "/about" },
//   { label: "Certificates", href: "/certificates" },
//   { label: "Pricelist", href: "/pricelist" },
//   { label: "Contact Us", href: "/contact" },
// ];

// const navBrands = brands.filter((b) => b.slug !== "connectwell");

// export default function Header() {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [brandsOpen, setBrandsOpen] = useState(false);
//   const pathname = usePathname();

//   const [menuOpen, setMenuOpen] = useState(false);
//   const [activeBrand, setActiveBrand] = useState<Brand | null>(null);
//   const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const openMenu = () => {
//     if (closeTimer.current) clearTimeout(closeTimer.current);
//     setMenuOpen(true);
//   };

//   const closeMenuSoon = () => {
//     if (closeTimer.current) clearTimeout(closeTimer.current);
//     closeTimer.current = setTimeout(() => {
//       setMenuOpen(false);
//       setActiveBrand(null);
//     }, 250);
//   };

//   return (
//     <div className="sticky top-0 z-50 px-3 md:px-8 pt-2 pb-3">
//       <header
//         className="bg-brand-gradient rounded-full shadow-lg mx-auto max-w-[1600px] relative flex items-center"
//         onMouseEnter={() => {
//           if (closeTimer.current) clearTimeout(closeTimer.current);
//         }}
//       >
//         <nav className="hidden md:flex flex-1 items-center justify-center gap-2 py-1">
//           {navLinks.slice(0, 2).map((l) => (
//             <NavItem key={l.href} {...l} active={pathname === l.href} />
//           ))}

//           {/* ===== Products trigger ===== */}
//           <div onMouseEnter={openMenu} onMouseLeave={closeMenuSoon}>
//             <button className="flex items-center gap-1 px-5 py-4 font-semibold text-white hover:text-yellow-200">
//               Products{" "}
//               <ChevronDown
//                 className={cn("h-4 w-4 transition-transform", menuOpen && "rotate-180")}
//               />
//             </button>
//           </div>
//           {/* ===== end trigger ===== */}

//           {navLinks.slice(2).map((l) => (
//             <NavItem key={l.href} {...l} active={pathname === l.href} />
//           ))}
//         </nav>

//         <Link
//           href="/quote"
//           className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-10 py-5 rounded-full ring-4 ring-white transition-colors"
//         >
//           Get A Quote
//         </Link>

//         {/* Mobile bar */}
//         <div className="md:hidden flex w-full items-center justify-between px-5 py-3">
//           <Link href="/" className="font-extrabold text-white">
//             REAL SWITCHGEARS
//           </Link>
//           <button
//             onClick={() => setMobileOpen(!mobileOpen)}
//             aria-label="Toggle menu"
//             className="text-white"
//           >
//             {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//           </button>
//         </div>

//         {/* ===== Dropdown panel: centered on header, clamped to viewport ===== */}
//         {menuOpen && (
//           <div
//             onMouseEnter={openMenu}
//             onMouseLeave={closeMenuSoon}
//             className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-full mt-1 w-[min(1000px,94vw)] items-start z-[100]"
//           >
//             {/* Pane 1: brand list */}
//             <ul className="bg-white rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-[220px] shrink-0 py-2">
//               {navBrands.map((b) => (
//                 <li key={b.slug}>
//                   <Link
//                     href={`/products/${b.slug}`}
//                     onMouseEnter={() => setActiveBrand(b.catalog?.length ? b : null)}
//                     className={cn(
//                       "group/item flex items-center justify-between px-4 py-2.5 text-sm font-bold border-b border-slate-100 last:border-0",
//                       activeBrand?.slug === b.slug
//                         ? "text-red-600"
//                         : "text-slate-800 hover:text-red-600"
//                     )}
//                   >
//                     <span className="flex items-center">
//                       <span className="w-0 overflow-hidden opacity-0 group-hover/item:w-5 group-hover/item:opacity-100 transition-all duration-300">
//                         <MoveRight className="h-4 w-4 text-red-600" />
//                       </span>
//                       {b.name}
//                     </span>
//                     {b.catalog && b.catalog.length > 0 && (
//                       <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
//                     )}
//                   </Link>
//                 </li>
//               ))}
//             </ul>

//             {/* Unified mega panel (LK-style drill-down) */}
//             {activeBrand && <MegaPanel key={activeBrand.slug} brand={activeBrand} />}
//           </div>
//         )}
//       </header>

//       {/* Mobile menu */}
//       {mobileOpen && (
//         <nav className="md:hidden mt-2 mx-auto max-w-7xl bg-white rounded-3xl shadow-xl px-6 py-4">
//           {navLinks.slice(0, 2).map((l) => (
//             <MobileItem key={l.href} {...l} onClick={() => setMobileOpen(false)} />
//           ))}
//           <button
//             className="w-full flex items-center justify-between py-3 font-semibold text-slate-800 border-b border-slate-100"
//             onClick={() => setBrandsOpen(!brandsOpen)}
//           >
//             Products
//             <ChevronDown
//               className={cn("h-4 w-4 transition-transform", brandsOpen && "rotate-180")}
//             />
//           </button>
//           {brandsOpen &&
//             navBrands.map((b) => (
//               <Link
//                 key={b.slug}
//                 href={`/products/${b.slug}`}
//                 className="block py-2 pl-4 text-sm text-slate-600"
//                 onClick={() => setMobileOpen(false)}
//               >
//                 {b.name}
//               </Link>
//             ))}
//           {navLinks.slice(2).map((l) => (
//             <MobileItem key={l.href} {...l} onClick={() => setMobileOpen(false)} />
//           ))}
//           <Link
//             href="/quote"
//             className="mt-4 block text-center bg-red-600 text-white font-bold py-3 rounded-full"
//             onClick={() => setMobileOpen(false)}
//           >
//             Get A Quote
//           </Link>
//         </nav>
//       )}
//     </div>
//   );
// }

// /* LK-style unified mega panel:
//    left = categories (grey highlight on active)
//    right = drill-down: section list → click section → its items + back arrow */
// function MegaPanel({ brand }: { brand: Brand }) {
//   const catalog = brand.catalog!;
//   const [activeCat, setActiveCat] = useState(0);
//   const [drillSection, setDrillSection] = useState<number | null>(null);

//   const category = catalog[activeCat];
//   const section = drillSection !== null ? category.sections[drillSection] : null;

//   const selectCat = (i: number) => {
//     setActiveCat(i);
//     setDrillSection(null);
//   };

//   return (
//     <div className="flex flex-1 min-w-0 bg-white rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.15)] h-[420px] overflow-hidden ml-1">
//       {/* Left: categories */}
//       <ul className="w-[220px] shrink-0 py-3 px-2 overflow-y-auto border-r border-slate-100">
//         {catalog.map((cat, i) => (
//           <li key={cat.name}>
//             <button
//               onMouseEnter={() => selectCat(i)}
//               onClick={() => selectCat(i)}
//               className={cn(
//                 "w-full flex items-center justify-between text-left rounded-lg px-3 py-2 text-sm font-bold transition-colors",
//                 i === activeCat
//                   ? "bg-slate-100 text-slate-900"
//                   : "text-slate-700 hover:bg-slate-50"
//               )}
//             >
//               <span className="truncate">{cat.name}</span>
//               <ChevronRight
//                 className={cn(
//                   "h-3.5 w-3.5 shrink-0 ml-1",
//                   i === activeCat ? "text-red-600" : "text-slate-300"
//                 )}
//               />
//             </button>
//           </li>
//         ))}
//       </ul>

//       {/* Right: drill-down area */}
//       <div className="flex-1 min-w-0 py-4 px-5 overflow-y-auto">
//         {!section ? (
//           <>
//             {/* Level A: category header + its sections */}
//             <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-900 border-b border-slate-200 pb-2">
//               {category.name}
//             </h3>
//             <ul className="mt-2">
//               <li>
//                 <Link
//                   href={`/products/${brand.slug}`}
//                   className="block px-2.5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
//                 >
//                   All {category.name}
//                 </Link>
//               </li>
//               {category.sections.map((s, i) => (
//                 <li key={s.heading}>
//                   <button
//                     onClick={() => setDrillSection(i)}
//                     className="w-full flex items-center justify-between text-left px-2.5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 rounded-lg"
//                   >
//                     <span className="truncate">{s.heading}</span>
//                     <ChevronRight className="h-3.5 w-3.5 shrink-0 ml-1 text-slate-400" />
//                   </button>
//                 </li>
//               ))}
//               {category.sections.length === 0 && (
//                 <li className="px-2.5 py-2 text-sm text-slate-500">Products coming soon.</li>
//               )}
//             </ul>
//           </>
//         ) : (
//           <>
//             {/* Level B: section items + back */}
//             <button
//               onClick={() => setDrillSection(null)}
//               className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-slate-900 border-b border-slate-200 pb-2 w-full text-left hover:text-red-600"
//             >
//               <ArrowLeft className="h-4 w-4 shrink-0 text-[#1268b3]" />
//               <span className="truncate">{section.heading}</span>
//             </button>
//             <ul className="mt-2">
//               {section.items.map((item) => (
//                 <li key={item.name}>
//                   <Link
//                     href={
//                       item.slug
//                         ? `/products/${brand.slug}/${item.slug}`
//                         : `/products/${brand.slug}`
//                     }
//                     className="block px-2.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-red-600 rounded-lg"
//                   >
//                     {item.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// function NavItem({ label, href, active }: { label: string; href: string; active: boolean }) {
//   return (
//     <Link
//       href={href}
//       className={cn(
//         "px-5 py-4 font-semibold text-white hover:text-yellow-200 transition-colors",
//         active && "text-yellow-200"
//       )}
//     >
//       {label}
//     </Link>
//   );
// }

// function MobileItem({ label, href, onClick }: { label: string; href: string; onClick: () => void }) {
//   return (
//     <Link
//       href={href}
//       className="block py-3 font-semibold text-slate-800 border-b border-slate-100"
//       onClick={onClick}
//     >
//       {label}
//     </Link>
//   );
// }



"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { brands, type Brand } from "@/data/brands";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Certificates", href: "/certificates" },
  { label: "Pricelist", href: "/pricelist" },
  { label: "Contact Us", href: "/contact" },
];

const navBrands = brands.filter((b) => b.slug !== "connectwell");

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeBrand, setActiveBrand] = useState<Brand>(navBrands[0]);
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
                      onClick={() => setActiveBrand(b)}
                      className={cn(
                        "w-full flex items-center justify-between text-left rounded-xl px-5 py-3.5 font-bold transition-colors",
                        activeBrand.slug === b.slug
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      {b.name}
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 shrink-0",
                          activeBrand.slug === b.slug ? "text-red-600" : "text-slate-300"
                        )}
                      />
                    </button>
                  </li>
                ))}
              </ul>

              {/* Right: active brand's catalog drill-down */}
              <BrandDrilldown
                key={activeBrand.slug}
                brand={activeBrand}
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

/* Right side of the panel: category list → sections → items, LK drill-down style */
function BrandDrilldown({
  brand,
  onNavigate,
}: {
  brand: Brand;
  onNavigate: () => void;
}) {
  const catalog = brand.catalog ?? [];
  const [activeCat, setActiveCat] = useState(0);
  const [drillSection, setDrillSection] = useState<number | null>(null);

  // brand without catalog → simple panel with link
  if (catalog.length === 0) {
    return (
      <div className="flex-1 min-w-0 flex flex-col items-start justify-center px-10">
        <h3 className="text-xl font-extrabold uppercase tracking-wide text-slate-900">
          {brand.name}
        </h3>
        <p className="mt-3 text-slate-600">{brand.description}</p>
        <Link
          href={`/products/${brand.slug}`}
          onClick={onNavigate}
          className="mt-6 inline-block bg-brand-gradient text-white font-semibold px-7 py-2.5 rounded-full hover:opacity-90"
        >
          View {brand.name}
        </Link>
      </div>
    );
  }

  const category = catalog[Math.min(activeCat, catalog.length - 1)];
  const section = drillSection !== null ? category.sections[drillSection] : null;

  const selectCat = (i: number) => {
    setActiveCat(i);
    setDrillSection(null);
  };

  return (
    <div className="flex flex-1 min-w-0">
      {/* Categories */}
      <ul className="w-[300px] shrink-0 px-3 border-r border-slate-100 overflow-y-auto">
        {catalog.map((cat, i) => (
          <li key={cat.name}>
            <button
              onClick={() => selectCat(i)}
              className={cn(
                "w-full flex items-center justify-between text-left rounded-xl px-4 py-3 font-semibold transition-colors",
                i === activeCat
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-700 hover:bg-slate-50"
              )}
            >
              <span className="truncate">{cat.name}</span>
              <ChevronRight
                className={cn(
                  "h-4 w-4 shrink-0 ml-1",
                  i === activeCat ? "text-red-600" : "text-slate-300"
                )}
              />
            </button>
          </li>
        ))}
      </ul>

      {/* Drill-down */}
      <div className="flex-1 min-w-0 px-6 overflow-y-auto">
        {!section ? (
          <>
            <h3 className="text-base font-extrabold uppercase tracking-wide text-slate-900 border-b border-slate-200 pb-3">
              {category.name}
            </h3>
            <ul className="mt-2">
              <li>
                <Link
                  href={`/products/${brand.slug}`}
                  onClick={onNavigate}
                  className="block px-3 py-2.5 font-bold text-[#1268b3] underline underline-offset-4 hover:bg-slate-50 rounded-lg"
                >
                  All {category.name}
                </Link>
              </li>
              {category.sections.map((s, i) => (
                <li key={s.heading}>
                  <button
                    onClick={() => setDrillSection(i)}
                    className="w-full flex items-center justify-between text-left px-3 py-2.5 font-semibold text-slate-800 hover:bg-slate-100 rounded-lg"
                  >
                    <span className="truncate">{s.heading}</span>
                    <ChevronRight className="h-4 w-4 shrink-0 ml-1 text-slate-400" />
                  </button>
                </li>
              ))}
              {category.sections.length === 0 && (
                <li className="px-3 py-2.5 text-slate-500">Products coming soon.</li>
              )}
            </ul>
          </>
        ) : (
          <>
            <button
              onClick={() => setDrillSection(null)}
              className="flex items-center gap-2 text-base font-extrabold uppercase tracking-wide text-slate-900 border-b border-slate-200 pb-3 w-full text-left hover:text-red-600"
            >
              <ArrowLeft className="h-5 w-5 shrink-0 text-[#1268b3]" />
              <span className="truncate">{section.heading}</span>
            </button>
            <ul className="mt-2">
              <li>
                <Link
                  href={`/products/${brand.slug}`}
                  onClick={onNavigate}
                  className="block px-3 py-2.5 font-bold text-[#1268b3] underline underline-offset-4 hover:bg-slate-50 rounded-lg"
                >
                  All {section.heading}
                </Link>
              </li>
              {section.items.map((item) => (
                <li key={item.name}>
                  <Link
                    href={
                      item.slug
                        ? `/products/${brand.slug}/${item.slug}`
                        : `/products/${brand.slug}`
                    }
                    onClick={onNavigate}
                    className="block px-3 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 hover:text-red-600 rounded-lg"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
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