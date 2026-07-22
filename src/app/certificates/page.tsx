import type { Metadata } from "next";
import Image from "next/image";
import PageBanner from "@/components/ui/PageBanner";
import SectionHeading from "@/components/ui/SectionHeading";

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

function FramedCard({
  file,
  name,
  year,
}: {
  file: string;
  name: string;
  year?: string;
}) {
  return (
    <div className="flex flex-col">
      {/* wooden frame */}
      <div className="border-[14px] border-[#a9795b] shadow-[inset_0_0_6px_rgba(0,0,0,0.4),0_6px_18px_rgba(0,0,0,0.15)]">
        {/* white matte */}
        <div className="bg-white p-6 flex items-center justify-center h-72">
          <div className="relative h-full w-full">
            <Image src={file} alt={name} fill className="object-contain" sizes="(max-width: 640px) 100vw, 25vw" />
          </div>
        </div>
      </div>
      <div className="mt-5 mx-4 pb-3 border-b border-slate-300 text-center">
        <h3 className="text-xl font-bold text-slate-800 leading-snug">{name}</h3>
        {year && <p className="mt-1 text-xl font-bold text-slate-800">Year : {year}</p>}
      </div>
    </div>
  );
}

export default function CertificatesPage() {
  return (
    <>
      <PageBanner title="Certificate" />

      {/* Certificates */}
      <section className="py-20">
        <div className="mx-auto max-w-[1500px] px-4">
          <SectionHeading title="CERTIFICATES" />
          <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {certificates.map((c) => (
              <FramedCard key={c.file} file={c.file} name={c.name} />
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="pb-20">
        <div className="mx-auto max-w-[1500px] px-4">
          <SectionHeading title="AWARDS" />
          <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {awards.map((a, i) => (
              <FramedCard key={`${a.file}-${i}`} file={a.file} name={a.name} year={a.year} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}