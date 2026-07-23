import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { brands } from "@/data/brands";
import SectionHeading from "@/components/ui/SectionHeading";

export default function BrandsGrid() {
  return (
    <section className="py-20 bg-brand-gradient-soft">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Our Portfolio"
          title="Brands We Represent"
          subtitle="Authorised distributorship of India's most trusted electrical and industrial brands."
        />

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <div
              key={brand.slug}
              className="group relative transition-transform duration-300 hover:-translate-y-2"
            >
              {/* soft glow on hover */}
              <div className="absolute -inset-2 -z-10 rounded-[2.5rem] bg-linear-to-br from-blue-600/0 to-teal-500/0 opacity-0 blur-lg transition-opacity duration-300 group-hover:from-blue-600/20 group-hover:to-teal-500/20 group-hover:opacity-100" />

              <div className="relative overflow-hidden rounded-t-[200px] rounded-b-[10px] shadow-[0_10px_30px_rgba(15,50,80,0.08)] ring-2 ring-transparent transition-all duration-300 group-hover:shadow-[0_20px_45px_rgba(15,50,80,0.16)] group-hover:ring-teal-500">
                <Link href={`/products/${brand.slug}`}>
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    width={800}
                    height={1000}
                    className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </Link>

                {/* content overlay on lower part of image */}
                <div className="absolute inset-x-0 bottom-5 px-4 text-center">
                  <h2 className="flex min-h-[52px] items-center justify-center text-xl font-bold leading-snug text-slate-800 md:text-2xl">
                    {brand.tagline}
                  </h2>

                  <Link
                    href={`/products/${brand.slug}`}
                    className="group/btn mt-2.5 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-[5px] text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                  >
                    Read More<span className="sr-only"> about {brand.name}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </Link>

                  <p className="mt-3.5 leading-relaxed text-slate-600">{brand.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
