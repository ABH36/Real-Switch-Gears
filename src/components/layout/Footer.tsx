import Link from "next/link";
import Image from "next/image";
import { site } from "@/data/site";
import { brands } from "@/data/brands";

export default function Footer() {
  return (
    <footer className="bg-[linear-gradient(180deg,#03a099_0%,#006db1_100%)] text-center text-white">
      <div className="mx-auto max-w-7xl px-4 pt-4 pb-4">
        <Link href="/" className="inline-block">
          <Image
            src="/images/logo/real_switchgear_white.png"
            alt={site.name}
            width={500}
            height={80}
            className="mx-auto h-20 w-auto"
          />
        </Link>

        <div className="mt-8 grid gap-10 md:grid-cols-3">
          <div>
            <h6 className="text-lg font-semibold">Email</h6>
            <a href={`mailto:${site.email}`} className="mt-2.5 block text-[#f5f5f5]">
              {site.email}
            </a>
          </div>
          <div>
            <h6 className="text-lg font-semibold">Shop Address</h6>
            <p className="mt-2.5 text-[#f5f5f5]">{site.address}</p>
          </div>
          <div>
            <h6 className="text-lg font-semibold">Contact</h6>
            <a href={site.phoneHref} className="mt-2.5 block text-[#f5f5f5]">
              {site.phone}
            </a>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="relative inline-block pb-2.5 text-xl font-semibold">
            Brands
            <span className="absolute inset-x-0 bottom-0 mx-auto h-0.5 w-6 bg-white" />
          </h3>
          <div className="mt-4 grid grid-cols-2 items-center justify-items-center gap-x-4 gap-y-6 rounded-3xl bg-[#f5f5f5] px-4 py-8 sm:grid-cols-3 sm:gap-y-8 lg:flex lg:flex-wrap lg:justify-evenly lg:gap-y-4 lg:rounded-full lg:px-4 lg:py-3">
            {brands.map((b) => (
              <Link
                key={b.slug}
                href={`/products/${b.slug}`}
                className="relative h-[55px] w-[90px] lg:h-[67px] lg:w-[100px]"
              >
                <Image
                  src={b.logo}
                  alt={b.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 90px, 100px"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#006db1] py-[15px] text-sm">
        <p>
          © {new Date().getFullYear()} {site.name} All rights reserved. Powered by{" "}
          <a
            href="https://www.bdminfotech.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 inline-block align-middle"
          >
            <Image
              src="/images/logo/bdm-logo.png"
              alt="BDM"
              width={90}
              height={24}
              className="inline h-6 w-auto"
            />
          </a>
        </p>
      </div>
    </footer>
  );
}
