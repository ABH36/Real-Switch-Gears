import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, CheckCircle2, Compass, MapPin, Target, Users } from "lucide-react";
import { brands } from "@/data/brands";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Serving India's electrical industry since 2000. Real Switchgears & Cables Pvt. Ltd. is a trusted authorised distributor and stockist for L&T Switchgear, Polycab, Salzer, GIC, Esbee, and Braco.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us | Real Switchgears & Cables Pvt. Ltd.",
    description:
      "Serving India's electrical industry since 2000 as a trusted authorised distributor and stockist for leading switchgear, cable, and control-device brands.",
    url: "/about",
  },
};

const aboutParas = [
  "REAL SWITCHGEARS & CABLES PRIVATE LIMITED has been serving the market since 2000, with our products reaching customers across India. We are among the leading authorised distributors of Polycab and leading authorised dealers & stockists of L&T Switchgear — two of the most trusted and quality-focused electrical brands in the country.",
  "We provide efficient Polycab wires & cables and L&T switchgear for modern-day applications, backed by time-tested technical expertise, hands-on experience, and a team of qualified professionals. REAL SWITCHGEARS is also a leading authorised stockist for brands including L&T Switchgear, Polycab, Salzer, GIC, Esbee, and Braco.",
  "We are committed to staying on the leading edge of technology, offering quality, branded products that meet the complex and expanding needs of our customers with the help of our principals. REAL SWITCHGEARS competes on product quality and performance, reliability of supply, timely delivery, customer service, and price — established with the sole objective of serving our customers with outstanding industrial electrical and electronic products, including Low Voltage Products, Meters, Relays, Wires & Cables, Rotary Switches, Contactors, Terminal Connectors, Cable Ducts, Digital & Analog Panel Meters, Transducers, Timers, Monitoring Devices, Push Button Actuators & Contact Blocks, LED Indicators, Power Capacitors, Plugs & Sockets, Terminal Lugs, Gland Accessories, Circuit Breakers, Changeover Switches, and more.",
];

const stats = [
  { icon: Award, value: "25+", label: "Years in Business" },
  { icon: Users, value: `${brands.length}`, label: "Principal Brands" },
  { icon: MapPin, value: "Pan-India", label: "Product Reach" },
  { icon: CheckCircle2, value: "Authorised", label: "Distributor & Stockist" },
];

const visionList = [
  "Market products & services that ensure customer satisfaction and appreciation.",
  "Create & maintain a friendly environment that ensures involvement & commitment in everything we do.",
  "Exercise industry leadership by establishing a shared purpose, optimizing work processes, developing people, and utilizing the most current tools & technologies.",
];

const missionList = [
  "Be the absolute best electrical service provider in the market we serve, offering customers a one-stop solution for their entire electrical power distribution needs.",
  "Foster positive business partnerships with our vendors and supplier community, built on trust and mutual respect.",
  "Recognize the need for continuous improvement in a dynamically changing business environment, to keep meeting the needs of our customers.",
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#eaf5fb] via-[#f4fafd] to-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-16 grid md:grid-cols-2 gap-8 md:gap-14 items-center">
          <div className="order-2 md:order-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#1268b3]">About Us</p>
            <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 leading-tight text-balance">
              Real Switchgears &amp; Cables Pvt. Ltd.
            </h1>
            <p className="mt-4 text-slate-600 leading-relaxed max-w-md">
              Serving India&apos;s electrical industry since 2000 as a trusted authorised distributor and
              stockist for leading switchgear, cable, and control-device brands.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 bg-brand-gradient text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
              >
                Get A Quote <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-slate-300 text-slate-700 font-semibold px-6 py-3 rounded-full hover:border-[#1268b3] hover:text-[#1268b3] transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="order-1 md:order-2 flex justify-center">
            <div className="w-full max-w-md rounded-2xl bg-white p-3 shadow-[0_8px_30px_rgba(15,50,80,0.08)]">
              <Image
                src="/images/about/1.jpeg"
                alt="Real Switchgears & Cables Pvt. Ltd. storefront"
                width={700}
                height={520}
                className="w-full h-auto rounded-xl object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 md:py-12 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 md:p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-gradient">
                <Icon className="h-5 w-5 text-white" />
              </span>
              <div className="min-w-0">
                <p className="text-base sm:text-lg font-extrabold text-slate-800 leading-tight">{value}</p>
                <p className="text-xs text-slate-500 leading-tight">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Company */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">About the Company</h2>
          <div className="mt-5 space-y-4 text-slate-600 leading-relaxed max-w-4xl">
            {aboutParas.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-7 md:p-8 shadow-[0_2px_20px_rgba(15,50,80,0.06)]">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient">
              <Target className="h-6 w-6 text-white" />
            </span>
            <h3 className="mt-5 text-xl font-extrabold text-slate-800">Our Vision</h3>
            <ul className="mt-4 space-y-3">
              {visionList.map((item, i) => (
                <li key={i} className="flex gap-2.5 text-slate-600 leading-relaxed text-[15px]">
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-[#1268b3]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-7 md:p-8 shadow-[0_2px_20px_rgba(15,50,80,0.06)]">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient">
              <Compass className="h-6 w-6 text-white" />
            </span>
            <h3 className="mt-5 text-xl font-extrabold text-slate-800">Our Mission</h3>
            <ul className="mt-4 space-y-3">
              {missionList.map((item, i) => (
                <li key={i} className="flex gap-2.5 text-slate-600 leading-relaxed text-[15px]">
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-[#1268b3]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Brands we represent */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">Brands We Represent</h2>
          <p className="mt-2 text-slate-500 text-sm">Tap a brand to browse its full product range.</p>

          <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {brands.map((b) => (
              <Link
                key={b.slug}
                href={`/products/${b.slug}`}
                className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 h-24 hover:border-[#1268b3] hover:shadow-[0_8px_24px_rgba(15,50,80,0.08)] transition-all"
              >
                <div className="relative h-full w-full">
                  <Image src={b.logo} alt={b.name} fill className="object-contain" sizes="200px" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
