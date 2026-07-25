import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, ChevronRight, FileDown } from "lucide-react";
import {
  brands,
  collectSections,
  findCatalogItem,
  getBrand,
  getProductCategorySlug,
  type ProductDetail,
} from "@/data/brands";
import VariantTabs from "@/components/VariantTabs";

export function generateStaticParams() {
  return brands.flatMap((b) => {
    const slugs = new Set<string>();
    for (const p of b.products ?? []) slugs.add(p.slug);
    for (const s of collectSections(b.catalog ?? [])) for (const i of s.items) if (i.slug) slugs.add(i.slug);

    return Array.from(slugs).map((product) => ({
      slug: b.slug,
      category: getProductCategorySlug(b, product),
      product,
    }));
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; category: string; product: string }>;
}): Promise<Metadata> {
  const { slug, category, product } = await params;
  const brand = getBrand(slug);
  if (!brand) return { title: "Product" };

  const prod = brand.products?.find((p) => p.slug === product);
  const canonical = `/products/${brand.slug}/${category}/${product}`;

  if (prod) {
    const description =
      prod.overview?.[0]?.slice(0, 155) ??
      `${prod.name} from ${brand.name} — authorised distributor Real Switchgears & Cables Pvt. Ltd.`;
    return {
      title: prod.name,
      description,
      alternates: { canonical },
      openGraph: {
        title: `${prod.name} | ${brand.name}`,
        description,
        url: canonical,
        images: prod.image ? [{ url: prod.image, alt: prod.name }] : undefined,
      },
    };
  }

  const hit = findCatalogItem(brand.catalog ?? [], product);
  if (!hit) return { title: "Product" };

  const description = `${hit.name} from ${brand.name} — authorised distributor Real Switchgears & Cables Pvt. Ltd.`;
  return {
    title: hit.name,
    description,
    alternates: { canonical },
    openGraph: { title: `${hit.name} | ${brand.name}`, description, url: canonical },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; category: string; product: string }>;
}) {
  const { slug, category, product } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  const prod = brand.products?.find((p) => p.slug === product);

  /* ---------- Fallback: catalog item without detail data yet ---------- */
  if (!prod) {
    const hit = findCatalogItem(brand.catalog ?? [], product);
    const fallback = hit ? { name: hit.name, category: hit.heading } : null;
    if (!fallback) notFound();

    return (
      <>
        <BreadcrumbJsonLd
          brand={brand.name}
          brandSlug={brand.slug}
          category={category}
          name={fallback.name}
          slug={product}
        />
        <Breadcrumb brand={brand.name} brandSlug={brand.slug} category={fallback.category} name={fallback.name} />
        <section className="bg-gradient-to-br from-[#eaf5fb] to-white py-14 md:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#1268b3]">{fallback.category}</p>
            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-800 text-balance">{fallback.name}</h1>
            <p className="mt-5 text-slate-600">
              Detailed specifications coming soon. Contact us for pricing and availability.
            </p>
            <Link
              href="/quote"
              className="mt-8 inline-flex items-center gap-2 bg-brand-gradient text-white font-semibold px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
            >
              Enquire Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </>
    );
  }

  /* ---------- Full product detail page ---------- */
  return (
    <>
      <BreadcrumbJsonLd
        brand={brand.name}
        brandSlug={brand.slug}
        category={category}
        name={prod.name}
        slug={product}
      />
      <ProductJsonLd brand={brand.name} product={prod} slug={product} brandSlug={brand.slug} category={category} />
      <Breadcrumb brand={brand.name} brandSlug={brand.slug} category={prod.category} name={prod.name} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#eaf5fb] via-[#f4fafd] to-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-16 grid md:grid-cols-2 gap-8 md:gap-14 items-center">
          <div className="order-2 md:order-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#1268b3]">{prod.category}</p>
            <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 leading-tight text-balance">
              {prod.name}
            </h1>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 bg-brand-gradient text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
              >
                Enquire Now <ArrowRight className="h-4 w-4" />
              </Link>
              {prod.catalogue && (
                <a
                  href={prod.catalogue}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-slate-300 text-slate-700 font-semibold px-6 py-3 rounded-full hover:border-[#1268b3] hover:text-[#1268b3] transition-colors"
                >
                  <FileDown className="h-4 w-4" /> Catalogue
                </a>
              )}
            </div>
          </div>

          {prod.image && (
            <div className="order-1 md:order-2 flex justify-center">
              <div className="w-full max-w-xs sm:max-w-sm rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(15,50,80,0.08)]">
                <Image
                  src={prod.image}
                  alt={prod.name}
                  width={480}
                  height={480}
                  className="w-full h-auto object-contain"
                  sizes="(max-width: 400px) 100vw, 384px"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Overview */}
      {prod.overview.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">Overview</h2>
            <div className="mt-5 space-y-4 text-slate-600 leading-relaxed max-w-4xl">
              {prod.overview.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      {prod.benefits && prod.benefits.length > 0 && (
        <section className="py-12 md:py-16 bg-slate-50">
          <div className="mx-auto max-w-6xl px-4 grid gap-10 md:grid-cols-2 items-center">
            <div className={prod.benefitsImage ? "" : "md:col-span-2"}>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">Benefits</h2>
              <ul className={`mt-6 gap-x-8 gap-y-3.5 ${prod.benefitsImage ? "" : "sm:grid sm:grid-cols-2"} grid`}>
                {prod.benefits.map((b, i) => (
                  <li key={i} className="flex gap-3 text-slate-700 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-[#1268b3]" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            {prod.benefitsImage && (
              <Image
                src={prod.benefitsImage}
                alt={`${prod.name} benefits`}
                width={700}
                height={500}
                className="w-full h-auto rounded-2xl object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>
        </section>
      )}

      {/* Features */}
      {prod.features && prod.features.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-4 grid gap-10 md:grid-cols-2 items-center">
            {prod.featuresImage && (
              <Image
                src={prod.featuresImage}
                alt={`${prod.name} features`}
                width={700}
                height={500}
                className="w-full h-auto rounded-2xl object-cover order-2 md:order-1"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
            <div className={prod.featuresImage ? "order-1 md:order-2" : "md:col-span-2"}>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">Features</h2>
              <ul className={`mt-6 gap-x-8 gap-y-3.5 ${prod.featuresImage ? "" : "sm:grid sm:grid-cols-2"} grid`}>
                {prod.features.map((f, i) => (
                  <li key={`${f.title ?? "feature"}-${i}`} className="flex gap-3 text-slate-700 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-[#1268b3]" />
                    <span>
                      <span className="font-semibold text-slate-900">{f.title}</span>
                      {f.text && <> — {f.text}</>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {prod.variants && prod.variants.length > 0 && <VariantTabs variants={prod.variants} />}
    </>
  );
}

function Breadcrumb({
  brand,
  brandSlug,
  category,
  name,
}: {
  brand: string;
  brandSlug: string;
  category: string;
  name: string;
}) {
  return (
    <div className="bg-white border-b border-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-3.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <p className="flex items-center gap-1.5 whitespace-nowrap text-sm text-slate-500">
          <Link href="/" className="hover:text-[#1268b3] transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <Link href={`/products/${brandSlug}`} className="hover:text-[#1268b3] transition-colors">
            {brand}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span>{category}</span>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="text-slate-800 font-medium">{name}</span>
        </p>
      </div>
    </div>
  );
}

function BreadcrumbJsonLd({
  brand,
  brandSlug,
  category,
  name,
  slug,
}: {
  brand: string;
  brandSlug: string;
  category: string;
  name: string;
  slug: string;
}) {
  const base = "https://realswitchgears.com";
  const items = [
    { name: "Home", url: base },
    { name: brand, url: `${base}/products/${brandSlug}` },
    { name, url: `${base}/products/${brandSlug}/${category}/${slug}` },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: item.url,
          })),
        }),
      }}
    />
  );
}

function ProductJsonLd({
  brand,
  brandSlug,
  category,
  product,
  slug,
}: {
  brand: string;
  brandSlug: string;
  category: string;
  product: ProductDetail;
  slug: string;
}) {
  const base = "https://realswitchgears.com";
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          category: product.category,
          description: product.overview?.[0],
          image: product.image ? `${base}${product.image}` : undefined,
          url: `${base}/products/${brandSlug}/${category}/${slug}`,
          brand: { "@type": "Brand", name: brand },
        }),
      }}
    />
  );
}
