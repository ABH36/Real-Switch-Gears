import Link from "next/link";
import Image from "next/image";
import { Handshake, Lightbulb, Mail, MapPin, MessageCircle, Phone, ShieldCheck, Users } from "lucide-react";
import { site } from "@/data/site";
import { brands } from "@/data/brands";

const trustBadges = [
  { icon: ShieldCheck, label: "Safe & Reliable" },
  { icon: Handshake, label: "Trusted Partner" },
  { icon: Lightbulb, label: "Innovative Solutions" },
  { icon: Users, label: "Customer Focused" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-gradient text-white">
      {/* decorative pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, transparent 0 60px, rgba(255,255,255,0.6) 60px 61px)",
          }}
        />
      </div>
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          {/* Logo + description + trust badges */}
          <div>
            <Link href="/">
              <Image
                src="/images/logo/real_switchgear_white.png"
                alt={site.name}
                width={340}
                height={54}
                className="h-16 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Delivering reliable, innovative and high-quality switchgear & cable
              solutions for a brighter tomorrow.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-start gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="text-xs font-semibold leading-tight text-white/85">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <FooterColumn icon={Mail} label="Email">
            <a href={`mailto:${site.email}`} className="hover:underline">
              {site.email}
            </a>
          </FooterColumn>

          <FooterColumn icon={MapPin} label="Shop Address">
            <p className="leading-relaxed">{site.address}</p>
          </FooterColumn>

          <FooterColumn icon={Phone} label="Contact">
            <a href={site.phoneHref} className="hover:underline">
              {site.phone}
            </a>
          </FooterColumn>

          {/* Quick actions */}
          <div>
            <h3 className="text-lg font-bold">Get In Touch</h3>
            <div className="mt-5 flex flex-col gap-3">
              <a
                href={site.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold ring-1 ring-white/25 transition-colors hover:bg-white hover:text-slate-900"
              >
                <Phone className="h-4 w-4" /> Call Now
              </a>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-slate-900 px-5 py-2.5 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        {/* Brands strip */}
        <div className="mt-14 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-teal-300">
            Our Trusted Brands
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 rounded-3xl bg-white px-4 py-5">
            {brands.map((b) => (
              <Link key={b.slug} href={`/products/${b.slug}`} className="relative h-12 w-28">
                <Image src={b.logo} alt={b.name} fill className="object-contain" sizes="112px" />
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-6 text-sm text-white/85 md:flex-row">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 font-semibold ring-1 ring-white/20">
            <ShieldCheck className="h-4 w-4" /> Authorised Distributor · {site.yearsExperience} Years
          </span>
          <p className="text-center">
            © {new Date().getFullYear()} {site.name} All rights reserved.
          </p>
          <span className="rounded-full bg-white/10 px-4 py-1.5 font-semibold ring-1 ring-white/20">
            Proudly Made in India
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <h3 className="mt-4 text-lg font-bold">{label}</h3>
      <div className="mt-3 text-sm text-white/80">{children}</div>
    </div>
  );
}
