import type { Metadata } from "next";
import PageBanner from "@/components/ui/PageBanner";
import SectionHeading from "@/components/ui/SectionHeading";
import CertificateGallery from "@/components/certificates/CertificateGallery";
import { Award, BadgeCheck, CalendarClock, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Certificates & Awards",
  description:
    "Authorised distributor certificates and achievement awards from L&T, Polycab, Salzer, GIC, Esbee, Bharat Bijlee, and Connectwell, held by Real Switchgears & Cables Pvt. Ltd.",
  alternates: { canonical: "/certificates" },
  openGraph: {
    title: "Certificates & Awards | Real Switchgears & Cables Pvt. Ltd.",
    description:
      "Authorised distributor certificates and achievement awards from our principal electrical brands.",
    url: "/certificates",
  },
};

const certificates = [
  { name: "L&T", file: "/images/certificate/l_t.png" },
  { name: "Polycab", file: "/images/certificate/polycab.png" },
  { name: "Salzer", file: "/images/certificate/salzer.png" },
  { name: "Crisil SME Rating", file: "/images/certificate/crisil_sme_rating.jpg" },
  { name: "Esbee", file: "/images/certificate/esbee.png" },
  { name: "GIC", file: "/images/certificate/gic.png" },
  { name: "Newtek", file: "/images/certificate/newtek.png" },
  { name: "Bharat Bijlee", file: "/images/certificate/bharat_bijlee.jpg" },
  { name: "Connectwell", file: "/images/certificate/connectwell.png" },
];

const awards = [
  { name: "Lauritz Knudsen Growth Award CY23 LV Vertical", year: "", file: "/images/certificate/l&t-certificate-2023.png" },
  { name: "L&T Achievement Awards", year: "2023", file: "/images/certificate/L_T_AWARD_2023.png" },
  { name: "L&T Highest Growth Awards", year: "2022", file: "/images/certificate/l&t_aword_2022.png" },
  { name: "L&T Highest Growth Awards", year: "2022", file: "/images/certificate/LTHighestGrowthAwardsYear_2022.png" },
  { name: "L&T Best Performance Awards", year: "2020-21", file: "/images/certificate/l&t-award.png" },
  { name: "Polycab Achievement Awards", year: "2018-19", file: "/images/certificate/polycab_achievement_award.jpg" },
  { name: "L&T Achievement Awards", year: "2018-19", file: "/images/certificate/l&t_award_18_19.jpg" },
  { name: "L&T Achievement Awards", year: "2017-18", file: "/images/certificate/l&t_award_17_18.jpg" },
  { name: "L&T Achievement Awards", year: "2015-16", file: "/images/certificate/l&t_award_15_16.jpg" },
  { name: "L&T Achievement Awards", year: "2011-12", file: "/images/certificate/l&t_award_11_12.jpg" },
];

const stats = [
  { icon: ShieldCheck, label: "Authorised Brand Certifications", value: `${certificates.length}` },
  { icon: Award, label: "Achievement Awards Won", value: `${awards.length}+` },
  { icon: CalendarClock, label: "Years of Trusted Partnership", value: "15+" },
];

export default function CertificatesPage() {
  return (
    <>
      <PageBanner title="Certificate" icon={BadgeCheck} />

      {/* Stats strip */}
      <section className="relative -mt-12 z-10 px-4">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.12)] ring-1 ring-slate-100"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white">
                <Icon className="h-7 w-7" />
              </span>
              <div>
                <p className="text-2xl font-extrabold text-slate-800">{value}</p>
                <p className="text-sm font-medium leading-snug text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certificates */}
      <section className="py-20">
        <div className="mx-auto max-w-[1500px] px-4">
          <SectionHeading
            eyebrow="Authorised Distributor"
            title="Our Certificates"
            subtitle="Official authorisation certificates from India's leading electrical brands — your assurance of genuine products and trusted service."
          />
          <div className="mt-14">
            <CertificateGallery items={certificates} variant="certificate" />
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="relative overflow-hidden bg-slate-50 py-20">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-linear-to-br from-sky-200/50 to-teal-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-linear-to-br from-red-200/40 to-orange-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-[1500px] px-4">
          <SectionHeading
            eyebrow="Recognised Excellence"
            title="Our Awards"
            subtitle="Honoured by our principal brands for outstanding growth, performance, and long-standing partnership."
          />
          <div className="mt-14">
            <CertificateGallery items={awards} variant="award" />
          </div>
        </div>
      </section>
    </>
  );
}
