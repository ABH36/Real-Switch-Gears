


import Link from "next/link";
import Image from "next/image";
import { brands } from "@/data/brands";
import SectionHeading from "@/components/ui/SectionHeading";

export default function BrandsGrid() {
  return (
    <section className="py-20 bg-brand-gradient-soft">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading title="Brands" />

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <div key={brand.slug} className="group">
              {/* image_box */}
              <div className="relative rounded-t-[999px] overflow-hidden border-2 border-transparent group-hover:border-teal-600 transition-colors duration-300">
                <Link href={`/products/${brand.slug}`}>
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    width={800}
                    height={1000}
                    className="w-full h-auto"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </Link>

                {/* content_inner — absolute overlay on lower part of image */}
                <div className="absolute inset-x-0 bottom-0 px-6 pb-8 text-center">
                  <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug">
                    {brand.tagline}
                  </h2>

                  <div className="relative mt-4 flex justify-center">
                    <span className="absolute inset-x-[-1.5rem] top-1/2 h-[2px] bg-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Link
                      href={`/products/${brand.slug}`}
                      className="relative z-10 bg-brand-gradient text-white font-semibold px-7 py-2 rounded-full hover:opacity-90 transition-opacity"
                    >
                      Read More
                    </Link>
                  </div>

                  <p className="mt-4 text-slate-600 leading-relaxed">
                    {brand.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}