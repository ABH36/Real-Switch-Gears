// import Link from "next/link";
// import { BadgeCheck, Award, Building, Boxes } from "lucide-react";
// import { site } from "@/data/site";

// const highlights = [
//   { icon: BadgeCheck, label: "Quality Assurance" },
//   { icon: Award, label: "Expertise & Experience" },
//   { icon: Building, label: "Established Market Presence" },
//   { icon: Boxes, label: "Leading Authorized Distributor & Stockist" },
// ];

// export default function AboutSection() {
//   return (
//     <section className="py-20 bg-white">
//       <div className="mx-auto max-w-7xl px-4 grid gap-12 md:grid-cols-2 items-center">
//         {/* Left: experience badge + highlights */}
//         <div className="relative">
//           <div className="bg-slate-900 text-white rounded-2xl p-10 inline-block">
//             <span className="text-6xl font-extrabold text-red-500">
//               {site.yearsExperience}
//             </span>
//             <span className="block mt-2 text-lg font-semibold uppercase tracking-wide">
//               Years of Experience
//             </span>
//           </div>
//           <ul className="mt-8 space-y-4">
//             {highlights.map(({ icon: Icon, label }) => (
//               <li key={label} className="flex items-center gap-3">
//                 <span className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
//                   <Icon className="h-5 w-5 text-red-600" />
//                 </span>
//                 <span className="font-semibold text-slate-700">{label}</span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Right: intro text */}
//         <div>
//           <p className="text-red-600 font-bold uppercase tracking-widest text-sm">
//             Who We Are
//           </p>
//           <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900">
//             Welcome to {site.name}
//           </h2>
//           <p className="mt-5 text-slate-600 leading-relaxed">
//             We are a leading authorised distributor and stockist of Lauritz
//             Knudsen (L&T Switchgears) and Polycab — among the most trusted and
//             quality-driven electrical brands in India. Serving the market since{" "}
//             {site.established}, our products reach customers across the
//             country.
//           </p>
//           <Link
//             href="/about"
//             className="mt-8 inline-block bg-red-600 hover:bg-red-700 text-white font-bold uppercase text-sm px-6 py-3 rounded transition-colors"
//           >
//             Read More
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }



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
        <section className="py-20 bg-white">
            <div className="mx-auto max-w-7xl px-4">
                {/* Row 1: shop photo + intro */}
                <div className="grid gap-12 md:grid-cols-2 items-center">
                    <Image
                        src="/images/about/1.jpg"
                        alt="Real Switchgears shop"
                        width={700}
                        height={520}
                        className="rounded-3xl object-cover w-full"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div>
                        <p className="text-slate-500 text-lg">Who we are</p>
                        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold leading-snug">
                            <span className="text-red-600">Welcome to</span>{" "}
                            <span className="text-slate-800">{site.name}</span>
                        </h1>
                        <p className="mt-6 text-slate-700 leading-relaxed text-justify font-medium">
                            LEADING AUTHORISED DISTRIBUTOR & STOCKIST OF LAURTIZ KNUDSEN (L&T
                            SWITCHGEARS) & POLYCAB — one of the most branded and quality
                            electrical goods in India.
                        </p>
                        <Link href="/about" className="mt-8 inline-flex items-center gap-3 group">
                            <span className="h-12 w-12 rounded-full border-2 border-red-600 flex items-center justify-center">
                                <ArrowRight className="h-5 w-5 text-red-600 transition-transform group-hover:translate-x-0.5" />
                            </span>
                            <span className="font-bold text-red-600 uppercase tracking-wide">
                                Read More
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Row 2: 25+ years + highlights + image */}
                <div className="mt-20 grid gap-10 md:grid-cols-3 items-center">
                    <div>
                        <span className="text-7xl font-extrabold text-slate-800">
                            {site.yearsExperience}
                        </span>
                        <span className="block mt-2 text-3xl font-bold text-slate-800">
                            Years Of Experience
                        </span>
                    </div>
                    <ul className="space-y-5">
                        {highlights.map(({ icon: Icon, label }) => (
                            <li key={label} className="flex items-center gap-3">
                                <Icon className="h-6 w-6 text-slate-800 shrink-0" />
                                <span className="font-bold text-slate-800 text-lg">{label}</span>
                            </li>
                        ))}
                    </ul>
                    <Image
                        src="/images/about/about_us_2.png"
                        alt="Electrical components"
                        width={600}
                        height={400}
                        className="rounded-3xl object-cover w-full"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>
            </div>
        </section>
    );
}