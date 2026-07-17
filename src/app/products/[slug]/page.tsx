// import type { Metadata } from "next";
// import Image from "next/image";
// import Link from "next/link";
// import { notFound } from "next/navigation";
// import { brands, getBrand } from "@/data/brands";
// import PageBanner from "@/components/ui/PageBanner";

// export function generateStaticParams() {
//   return brands.map((b) => ({ slug: b.slug }));
// }

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }): Promise<Metadata> {
//   const { slug } = await params;
//   const brand = getBrand(slug);
//   return { title: `${brand?.name ?? "Brand"} | Real Switchgears & Cables Pvt. Ltd.` };
// }

// export default async function BrandPage({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   const { slug } = await params;
//   const brand = getBrand(slug);
//   if (!brand) notFound();

//   return (
//     <>
//       <PageBanner title={brand.name} />

//       <section className="py-20">
//         <div className="mx-auto max-w-7xl px-4 grid gap-12 md:grid-cols-2 items-center">
//           <Image
//             src={brand.image}
//             alt={brand.name}
//             width={800}
//             height={800}
//             className="w-full h-auto rounded-3xl bg-white shadow-[0_0_40px_rgba(0,0,0,0.09)]"
//           />
//           <div>
//             <div className="relative h-16 w-48">
//               <Image src={brand.logo} alt={`${brand.name} logo`} fill className="object-contain object-left" />
//             </div>
//             <h2 className="mt-6 text-3xl md:text-4xl font-extrabold text-slate-800">
//               {brand.tagline}
//             </h2>
//             <p className="mt-6 text-slate-600 leading-relaxed text-lg">
//               {brand.description}
//             </p>
//             <Link
//               href="/quote"
//               className="mt-8 inline-block bg-brand-gradient text-white font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
//             >
//               Get A Quote
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Other brands */}
//       <section className="py-16 bg-brand-gradient-soft">
//         <div className="mx-auto max-w-7xl px-4">
//           <h3 className="text-2xl font-bold text-slate-800 text-center">Other Brands</h3>
//           <div className="mt-8 flex flex-wrap justify-center gap-4">
//             {brands
//               .filter((b) => b.slug !== slug)
//               .map((b) => (
//                 <Link
//                   key={b.slug}
//                   href={`/brands/${b.slug}`}
//                   className="bg-white px-6 py-3 rounded-full font-semibold text-slate-700 shadow-sm hover:text-teal-700 hover:shadow-md transition-all"
//                 >
//                   {b.name}
//                 </Link>
//               ))}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }



import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageBanner from "@/components/ui/PageBanner";
import SectionHeading from "@/components/ui/SectionHeading";
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

  return (
    <>
      <PageBanner title={title} />

      <section className="py-16">
        <div className="mx-auto max-w-[1500px] px-4">
          <SectionHeading title={title.toUpperCase()} />
          <div className="mt-14">
            {brand.catalog && brand.catalog.length > 0 ? (
              <BrandCatalog catalog={brand.catalog} brandSlug={brand.slug} />
            ) : (
              <p className="text-center text-slate-600 text-lg">
                {brand.description}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}