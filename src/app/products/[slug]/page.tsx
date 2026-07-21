import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import BrandCatalog from "@/components/BrandCatalog";
import { brands, getBrand } from "@/data/brands";

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrand(slug);
  return {
    title: `${brand?.pageTitle ?? brand?.name ?? "Brand"} | Real Switchgears & Cables Pvt. Ltd.`,
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  const title = brand.pageTitle ?? brand.name;
  const featured = (brand.products ?? []).filter((p) => p.image).slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#eaf5fb] via-[#f4fafd] to-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-16 grid md:grid-cols-2 gap-8 md:gap-14 items-center">
          <div className="order-2 md:order-1">
            <div className="relative h-12 w-40">
              <Image src={brand.logo} alt={`${brand.name} logo`} fill className="object-contain object-left" />
            </div>
            <h1 className="mt-5 text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 leading-tight text-balance">
              {brand.tagline}
            </h1>
            <p className="mt-4 text-slate-600 leading-relaxed max-w-md">{brand.description}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 bg-brand-gradient text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
              >
                Get A Quote <ArrowRight className="h-4 w-4" />
              </Link>
              {featured.length > 0 && (
                <a
                  href="#products"
                  className="inline-flex items-center gap-2 border border-slate-300 text-slate-700 font-semibold px-6 py-3 rounded-full hover:border-[#1268b3] hover:text-[#1268b3] transition-colors"
                >
                  View Products
                </a>
              )}
            </div>
          </div>

          <div className="order-1 md:order-2 flex justify-center">
            <div className="w-full max-w-xs sm:max-w-sm rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(15,50,80,0.08)]">
              <Image
                src={brand.image}
                alt={brand.name}
                width={480}
                height={480}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured products — real product photography, not filler */}
      {featured.length > 0 && (
        <section id="products" className="py-12 md:py-16 scroll-mt-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">Featured Products</h2>
              <p className="text-sm text-slate-500">{brand.products?.length ?? 0} products available</p>
            </div>

            <div className="mt-7 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {featured.map((p) => (
                <Link
                  key={p.slug}
                  href={`/products/${brand.slug}/${p.slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-4 hover:border-[#1268b3] hover:shadow-[0_8px_24px_rgba(15,50,80,0.08)] transition-all"
                >
                  <div className="aspect-square rounded-xl bg-slate-50 p-4 flex items-center justify-center overflow-hidden">
                    <Image
                      src={p.image!}
                      alt={p.name}
                      width={220}
                      height={220}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#1268b3] truncate">
                    {p.category}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800 leading-snug line-clamp-2">{p.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Full catalog */}
      <section className={`py-12 md:py-16 ${featured.length > 0 ? "bg-slate-50" : ""}`}>
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">
            {featured.length > 0 ? "Browse Full Catalog" : "Products"}
          </h2>
          <div className="mt-8">
            {brand.catalog && brand.catalog.length > 0 ? (
              <BrandCatalog catalog={brand.catalog} brandSlug={brand.slug} />
            ) : (
              <p className="text-slate-600">{brand.description}</p>
            )}
          </div>
        </div>
      </section>

      {/* Other brands */}
      <section className="py-12 md:py-16 bg-brand-gradient-soft">
        <div className="mx-auto max-w-6xl px-4">
          <h3 className="text-xl font-bold text-slate-800 text-center">Other Brands We Carry</h3>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {brands
              .filter((b) => b.slug !== slug)
              .map((b) => (
                <Link
                  key={b.slug}
                  href={`/products/${b.slug}`}
                  className="bg-white px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 shadow-sm hover:text-[#1268b3] hover:shadow-md transition-all"
                >
                  {b.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
