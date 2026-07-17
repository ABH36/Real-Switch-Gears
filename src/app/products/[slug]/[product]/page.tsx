// import type { Metadata } from "next";
// import Image from "next/image";
// import Link from "next/link";
// import { notFound } from "next/navigation";
// import { FileDown, Zap } from "lucide-react";
// import PageBanner from "@/components/ui/PageBanner";
// import { brands, getBrand } from "@/data/brands";

// export function generateStaticParams() {
//   return brands.flatMap((b) => [
//     ...(b.products ?? []).map((p) => ({ slug: b.slug, product: p.slug })),
//     ...(b.catalog ?? []).flatMap((cat) =>
//       cat.sections.flatMap((s) =>
//         s.items.filter((i) => i.slug).map((i) => ({ slug: b.slug, product: i.slug! }))
//       )
//     ),
//   ]);
// }

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ slug: string; product: string }>;
// }): Promise<Metadata> {
//   const { slug, product } = await params;
//   const brand = getBrand(slug);
//   const prod = brand?.products?.find((p) => p.slug === product);
//   return {
//     title: `${prod?.name ?? "Product"} | ${brand?.name ?? ""} | Real Switchgears`,
//     description: prod?.overview?.[0]?.slice(0, 155),
//   };
// }

// export default async function ProductPage({
//   params,
// }: {
//   params: Promise<{ slug: string; product: string }>;
// }) {
//   const { slug, product } = await params;
//   const brand = getBrand(slug);
//   if (!brand) notFound();

//   const prod = brand.products?.find((p) => p.slug === product);

//   /* ---------- Fallback: catalog item without detail data yet ---------- */
//   if (!prod) {
//     let fallback: { name: string; category: string } | null = null;
//     for (const cat of brand.catalog ?? []) {
//       for (const s of cat.sections) {
//         const hit = s.items.find((i) => i.slug === product);
//         if (hit) fallback = { name: hit.name, category: s.heading };
//       }
//     }
//     if (!fallback) notFound();

//     return (
//       <>
//         <PageBanner title={fallback.name} />
//         <section className="py-20 text-center">
//           <div className="mx-auto max-w-3xl px-4">
//             <p className="text-slate-500 font-semibold">{fallback.category}</p>
//             <h2 className="mt-3 text-3xl font-extrabold text-slate-800">
//               {fallback.name}
//             </h2>
//             <p className="mt-6 text-slate-600 text-lg">
//               Detailed specifications coming soon. Contact us for pricing and
//               availability.
//             </p>
//             <Link
//               href="/quote"
//               className="mt-8 inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-full transition-colors"
//             >
//               Enquire Now
//             </Link>
//           </div>
//         </section>
//       </>
//     );
//   }

//   /* ---------- Full product detail page ---------- */
//   return (
//     <>
//       <PageBanner title={prod.name} />

//       <section className="py-16">
//         <div className="mx-auto max-w-7xl px-4">
//           {/* breadcrumb */}
//           <p className="text-slate-500 font-semibold">
//             <Link href="/" className="hover:text-teal-700">Home</Link>
//             <span className="mx-2">/</span>
//             <Link href={`/products/${brand.slug}`} className="hover:text-teal-700">
//               {brand.name}
//             </Link>
//             <span className="mx-2">/</span>
//             <span>{prod.category}</span>
//             <span className="mx-2">/</span>
//             <span className="text-slate-800">{prod.name}</span>
//           </p>

//           <div className="mt-10 grid gap-12 lg:grid-cols-2 items-start">
//             {/* image + actions */}
//             <div>
//               {prod.image && (
//                 <Image
//                   src={prod.image}
//                   alt={prod.name}
//                   width={800}
//                   height={600}
//                   className="w-full h-auto rounded-2xl bg-white shadow-[0_0_40px_rgba(0,0,0,0.09)]"
//                 />
//               )}
//               <div className="mt-6 flex flex-wrap gap-4">
//                 {prod.catalogue && (
//                   <a
//                     href={prod.catalogue}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="inline-flex items-center gap-2 bg-brand-gradient text-white font-semibold px-7 py-3 rounded-full hover:opacity-90"
//                   >
//                     <FileDown className="h-5 w-5" />
//                     Catalogue
//                   </a>
//                 )}

//                 <Link
//                   href="/quote"
//                   className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold px-7 py-3 rounded-full transition-colors"
//                 >
//                   Enquire Now
//                 </Link>
//               </div>
//             </div>

//             {/* overview */}
//             <div>
//               <h2 className="text-3xl font-extrabold text-slate-800">Overview</h2>
//               <div className="mt-5 space-y-4 text-slate-600 leading-relaxed text-justify">
//                 {prod.overview.map((p, i) => (
//                   <p key={i}>{p}</p>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* features */}
//           {prod.features && prod.features.length > 0 && (
//             <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//               {prod.features.map((f, i) => (
//                 <div
//                   key={`${f.title ?? "feature"}-${i}`}
//                   className="bg-white rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.09)]"
//                 >
//                   <span className="h-12 w-12 rounded-full bg-brand-gradient flex items-center justify-center">
//                     <Zap className="h-6 w-6 text-white" />
//                   </span>
//                   <h3 className="mt-4 text-xl font-bold text-slate-800">{f.title}</h3>
//                   <p className="mt-2 text-slate-600">{f.text}</p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>
//     </>
//   );
// }




import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, FileDown } from "lucide-react";
import { brands, getBrand } from "@/data/brands";

export function generateStaticParams() {
  return brands.flatMap((b) => [
    ...(b.products ?? []).map((p) => ({ slug: b.slug, product: p.slug })),
    ...(b.catalog ?? []).flatMap((cat) =>
      cat.sections.flatMap((s) =>
        s.items.filter((i) => i.slug).map((i) => ({ slug: b.slug, product: i.slug! }))
      )
    ),
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; product: string }>;
}): Promise<Metadata> {
  const { slug, product } = await params;
  const brand = getBrand(slug);
  const prod = brand?.products?.find((p) => p.slug === product);
  return {
    title: `${prod?.name ?? "Product"} | ${brand?.name ?? ""} | Real Switchgears`,
    description: prod?.overview?.[0]?.slice(0, 155),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; product: string }>;
}) {
  const { slug, product } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  const prod = brand.products?.find((p) => p.slug === product);

  /* ---------- Fallback: catalog item without detail data yet ---------- */
  if (!prod) {
    let fallback: { name: string; category: string } | null = null;
    for (const cat of brand.catalog ?? []) {
      for (const s of cat.sections) {
        const hit = s.items.find((i) => i.slug === product);
        if (hit) fallback = { name: hit.name, category: s.heading };
      }
    }
    if (!fallback) notFound();

    return (
      <>
        <Breadcrumb
          brand={brand.name}
          brandSlug={brand.slug}
          category={fallback.category}
          name={fallback.name}
        />
        <section className="bg-gradient-to-r from-[#cfe6f5] to-[#eaf5fb] py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800">
              {fallback.name}
            </h1>
            <Link
              href="/quote"
              className="mt-8 inline-flex items-center gap-2 bg-[#1268b3] hover:bg-[#0d5798] text-white font-semibold px-7 py-3.5 rounded-lg transition-colors"
            >
              Enquire Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
        <section className="py-16 text-center">
          <p className="text-slate-600 text-lg">
            Detailed specifications coming soon. Contact us for pricing and
            availability.
          </p>
        </section>
      </>
    );
  }

  /* ---------- Full product detail page (LK-style) ---------- */
  return (
    <>
      <Breadcrumb
        brand={brand.name}
        brandSlug={brand.slug}
        category={prod.category}
        name={prod.name}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#bfe0f3] via-[#dceffa] to-[#eef7fc]">
        <div className="mx-auto max-w-[1500px] px-4 grid md:grid-cols-2 items-center gap-10 min-h-[440px] py-12">
          {/* dark blue blob behind title */}
          <div className="absolute -left-40 top-1/2 -translate-y-1/2 h-[560px] w-[720px] rounded-full bg-[#3b7ea1]/90 hidden md:block" />
          <div className="relative z-10 md:pl-24">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 md:text-white">
              {prod.name}
            </h1>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 bg-white text-[#1268b3] font-semibold px-7 py-3.5 rounded-lg border border-[#1268b3] hover:bg-[#1268b3] hover:text-white transition-colors"
              >
                Enquire Now <ArrowRight className="h-4 w-4" />
              </Link>
              {prod.catalogue && (
                <a href={prod.catalogue} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#1268b3] hover:bg-[#0d5798] text-white font-semibold px-7 py-3.5 rounded-lg transition-colors">
                  <FileDown className="h-4 w-4" /> Catalogue
                </a>
              )}
            </div>
          </div>

          {prod.image && (
            <div className="relative z-10 flex justify-center">
              <Image
                src={prod.image}
                alt={prod.name}
                width={640}
                height={640}
                className="w-full max-w-[480px] h-auto object-contain drop-shadow-2xl"
                priority
              />
            </div>
          )}
        </div>
      </section>

      {/* Overview */}
      <section className="py-16">
        <div className="mx-auto max-w-[1500px] px-4">
          <h2 className="text-4xl font-extrabold text-[#1268b3]">Overview</h2>
          <div className="mt-6 space-y-4 text-lg text-slate-700 leading-relaxed max-w-5xl">
            {prod.overview.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      {prod.benefits && prod.benefits.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="mx-auto max-w-[1500px] px-4 grid gap-12 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-4xl font-extrabold text-[#1268b3]">Benefits</h2>
              <ul className="mt-8 space-y-5 list-disc pl-6 text-lg text-slate-700 leading-relaxed">
                {prod.benefits.map((b, i) => (
                  <li key={i}>{b}</li>
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
              />
            )}
          </div>
        </section>
      )}

      {/* Features */}
      {prod.features && prod.features.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-[1500px] px-4 grid gap-12 md:grid-cols-2 items-center">
            {prod.featuresImage && (
              <Image
                src={prod.featuresImage}
                alt={`${prod.name} features`}
                width={700}
                height={500}
                className="w-full h-auto rounded-2xl object-cover order-2 md:order-1"
              />
            )}
            <div className={prod.featuresImage ? "order-1 md:order-2" : "md:col-span-2"}>
              <h2 className="text-4xl font-extrabold text-[#1268b3]">Features</h2>
              <ul className="mt-8 space-y-5 list-disc pl-6 text-lg text-slate-700 leading-relaxed">
                {prod.features.map((f, i) => (
                  <li key={`${f.title ?? "feature"}-${i}`}>
                    <span className="font-bold text-slate-900">{f.title}</span>
                    {f.text && <> — {f.text}</>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
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
      <p className="mx-auto max-w-[1500px] px-4 py-4 text-slate-600 font-medium">
        <Link href="/" className="hover:text-[#1268b3]">Home</Link>
        <span className="mx-2">›</span>
        <Link href={`/products/${brandSlug}`} className="hover:text-[#1268b3]">
          {brand}
        </Link>
        <span className="mx-2">›</span>
        <span>{category}</span>
        <span className="mx-2">›</span>
        <span className="text-slate-400">{name}</span>
      </p>
    </div>
  );
}