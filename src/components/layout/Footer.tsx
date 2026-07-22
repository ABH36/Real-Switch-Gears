

import Link from "next/link";
import Image from "next/image";
import { site } from "@/data/site";
import { brands } from "@/data/brands";

export default function Footer() {
  return (
    <footer className="bg-brand-gradient text-white">
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-8">
        <Link href="/">
          <Image
            src="/images/logo/real_switchgear_white.png"
            alt={site.name}
            width={340}
            height={90}
            className="h-20 w-auto"
          />
        </Link>

        <div className="mt-12 grid gap-10 md:grid-cols-3 text-center">
          <div>
            <h4 className="text-2xl font-bold">Email</h4>
            <a href={`mailto:${site.email}`} className="mt-4 block text-lg hover:underline">
              {site.email}
            </a>
          </div>
          <div>
            <h4 className="text-2xl font-bold">Shop Address</h4>
            <p className="mt-4 text-lg leading-relaxed">{site.address}</p>
          </div>
          <div>
            <h4 className="text-2xl font-bold">Contact</h4>
            <a href={site.phoneHref} className="mt-4 block text-lg hover:underline">
              {site.phone}
            </a>
          </div>
        </div>

        {/* Brands strip */}
        <div className="mt-14 text-center">
          <h4 className="text-2xl font-bold inline-block border-b-4 border-white/70 pb-2">
            Brands
          </h4>
          <div className="mt-8 bg-white rounded-4xl px-4 py-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {brands.map((b) => (
              <Link key={b.slug} href={`/products/${b.slug}`} className="relative h-12 w-28">
                <Image src={b.logo} alt={b.name} fill className="object-contain" sizes="112px" />
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-10 text-center">
          © {new Date().getFullYear()} {site.name} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
