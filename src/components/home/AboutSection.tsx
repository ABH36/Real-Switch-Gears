import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck, Briefcase, Building2, Handshake } from "lucide-react";
import { site } from "@/data/site";

const highlights = [
  { icon: BadgeCheck, label: "Quality Assurance" },
  { icon: Briefcase, label: "Expertise & Experience" },
  { icon: Building2, label: "Established Market Presence" },
  { icon: Handshake, label: "Leading Authorized Distributor & Stockist" },
];

export default function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28">
      {/* decorative backdrop */}
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-linear-to-br from-sky-100 to-teal-100 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-linear-to-br from-red-100 to-orange-100 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4">
        {/* Row 1: shop photo + intro */}
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative">
            <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-linear-to-br from-blue-600/15 to-teal-500/15 blur-lg" />
            <Image
              src="/images/about/1.jpg"
              alt="Real Switchgears shop"
              width={700}
              height={520}
              className="w-full rounded-3xl object-cover shadow-[0_20px_50px_rgba(15,50,80,0.15)]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* floating years-of-experience badge */}
            <div className="absolute -bottom-6 -right-4 flex items-center gap-4 rounded-2xl bg-white px-6 py-5 shadow-[0_15px_40px_rgba(15,50,80,0.18)] ring-1 ring-slate-100 sm:-right-6">
              <span className="text-4xl font-extrabold text-red-600">{site.yearsExperience}</span>
              <span className="max-w-[7rem] text-xs font-bold uppercase leading-snug tracking-wide text-slate-600">
                Years of Trusted Excellence
              </span>
            </div>
          </div>

          <div>
            <span className="inline-block rounded-full bg-red-50 px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-red-700">
              Who We Are
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-snug md:text-4xl">
              <span className="text-red-600">Welcome to</span>{" "}
              <span className="text-slate-800">{site.name}</span>
            </h1>
            <p className="mt-6 font-medium leading-relaxed text-slate-700">
              LEADING AUTHORISED DISTRIBUTOR & STOCKIST OF LAURTIZ KNUDSEN (L&T
              SWITCHGEARS) & POLYCAB — one of the most branded and quality
              electrical goods in India.
            </p>
            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-7 py-3.5 font-bold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              Read More<span className="sr-only"> about {site.name}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Row 2: highlights + image */}
        <div className="mt-24 grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 md:text-3xl">
              Why Businesses Choose Us
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {highlights.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="group flex items-start gap-4 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_12px_30px_rgba(15,50,80,0.1)]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="pt-1.5 font-bold leading-snug text-slate-800">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-linear-to-br from-teal-500/15 to-blue-600/15 blur-lg" />
            <Image
              src="/images/about/about_us_2.png"
              alt="Electrical components"
              width={600}
              height={400}
              className="w-full rounded-3xl object-cover shadow-[0_20px_50px_rgba(15,50,80,0.15)]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
