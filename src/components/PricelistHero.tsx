


// import Image from "next/image";
// import Link from "next/link";
// import { ChevronRight, Home, FileText, Download } from "lucide-react";

// export default function PricelistHero() {
//   return (
//     <section className="relative overflow-hidden bg-gradient-to-br from-[#0a2b45] via-[#0c4a63] to-[#127f88] pb-14 pt-12 md:pb-20 md:pt-2">
//       {/* subtle dot-grid texture */}
//       <div
//         className="pointer-events-none absolute inset-0 opacity-20"
//         style={{
//           backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)",
//           backgroundSize: "24px 24px",
//         }}
//       />
//       {/* soft ambient glow */}
//       <div className="pointer-events-none absolute right-[6%] top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-cyan-400/20 blur-3xl" />

//       <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 md:grid-cols-2 md:px-8">
//         {/* Left: heading */}
//         <div className="text-center md:text-left">
//           {/* eyebrow badge */}
//           <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300 ring-1 ring-cyan-300/30">
//             <FileText className="h-3.5 w-3.5" />
//             Product Catalogue
//           </span>

//           <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-sm md:text-6xl">
//             Pricelist
//           </h1>
//           <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-cyan-300 to-teal-300 md:mx-0" />

//           <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-white/80 md:mx-0">
//             Browse and download our latest product pricelists by category and brand — always
//             up to date with current rates.
//           </p>

//           {/* quick feature row so the left side feels full */}
//           <div className="mx-auto mt-5 flex max-w-md flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-white/70 md:mx-0 md:justify-start">
//             <span className="inline-flex items-center gap-1.5">
//               <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" /> Verified brands
//             </span>
//             <span className="inline-flex items-center gap-1.5">
//               <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" /> Instant PDF download
//             </span>
//             <span className="inline-flex items-center gap-1.5">
//               <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" /> Updated monthly
//             </span>
//           </div>

//           {/* breadcrumb — tightened gap */}
//           <div className="mt-6 flex justify-center md:justify-start">
//             <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide ring-1 ring-white/25 backdrop-blur-sm md:text-sm">
//               <Link
//                 href="/"
//                 className="flex items-center gap-1.5 text-slate-200 transition-colors hover:text-white"
//               >
//                 <Home className="h-3.5 w-3.5" /> Home
//               </Link>
//               <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
//               <span className="text-cyan-300">Pricelist</span>
//             </span>
//           </div>
//         </div>

//         {/* Right: product podium */}
//         <div className="relative h-[280px] sm:h-[340px] md:h-[430px]">
//           {/* Glass Panel */}
//           <div className="absolute left-1/2 top-4 h-[82%] w-[86%] -translate-x-1/2 rounded-[40px] border border-white/15 bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-sm" />
//           {/* inner panel glow so it doesn't feel empty */}
//           <div className="pointer-events-none absolute left-1/2 top-[30%] h-40 w-40 -translate-x-1/2 rounded-full bg-cyan-300/20 blur-3xl" />

//           {/* Products */}
//           {/* Polycab */}
//           <div className="absolute bottom-[72px] left-[12%] z-20">
//             <Image
//               src="/images/pricelist/bannerimg/gwplus-tile-1563-x-1553-removebg-preview.png"
//               alt=""
//               width={180}
//               height={180}
//               className="w-[130px] rotate-[-6deg] drop-shadow-[0_18px_20px_rgba(0,0,0,.35)] md:w-[165px]"
//             />
//           </div>

//           {/* Main Isolator */}
//           <div className="absolute bottom-[70px] left-1/2 z-40 -translate-x-1/2">
//             <Image
//               src="/images/pricelist/bannerimg/solar-isolators-removebg-preview.png"
//               alt=""
//               width={320}
//               height={320}
//               className="w-[200px] drop-shadow-[0_25px_25px_rgba(0,0,0,.45)] md:w-[260px]"
//             />
//           </div>

//           {/* Relay */}
//           <div className="absolute bottom-[70px] right-[18%] z-30">
//             <Image
//               src="/images/pricelist/bannerimg/assets_9363b29032ef4e6598adee3414a78ba0_7b799b917f5e4474a50152d36d947ff2-removebg-preview.png"
//               alt=""
//               width={170}
//               height={170}
//               className="w-[110px] drop-shadow-[0_18px_20px_rgba(0,0,0,.35)] md:w-[145px]"
//             />
//           </div>

//           {/* Small Device */}
//           <div className="absolute bottom-[70px] right-[8%] z-10">
//             <Image
//               src="/images/pricelist/bannerimg/11-removebg-preview.png"
//               alt=""
//               width={160}
//               height={160}
//               className="w-[95px] drop-shadow-[0_15px_15px_rgba(0,0,0,.3)] md:w-[120px]"
//             />
//           </div>

//           {/* Platform */}
//           <div className="absolute bottom-7 left-1/2 h-[46px] w-[90%] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#3194c5] via-[#1a5f84] to-[#0c3550] shadow-[0_22px_40px_rgba(0,0,0,.45)]" />
//           {/* Platform Highlight */}
//           <div className="absolute bottom-[71px] left-1/2 h-2 w-[84%] -translate-x-1/2 rounded-full bg-white/25" />
//         </div>
//       </div>

//       {/* wave transition into the page background */}
//       <svg
//         className="absolute -bottom-px left-0 h-16 w-full text-white md:h-20"
//         viewBox="0 0 1440 100"
//         preserveAspectRatio="none"
//         aria-hidden="true"
//       >
//         <path d="M0,50 C360,110 1080,-10 1440,50 L1440,100 L0,100 Z" fill="currentColor" />
//       </svg>
//     </section>
//   );
// }



import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Home, FileText, Download } from "lucide-react";

export default function PricelistHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0a2b45] via-[#0c4a63] to-[#127f88] pb-14 pt-12 md:pb-20 md:pt-16">
      {/* subtle dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* soft ambient glow */}
      <div className="pointer-events-none absolute right-[6%] top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 md:grid-cols-2 md:px-8">
        {/* Left: heading */}
        <div className="text-center md:text-left">
          {/* eyebrow badge */}
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300 ring-1 ring-cyan-300/30">
            <FileText className="h-3.5 w-3.5" />
            Product Catalogue
          </span>

          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-sm md:text-6xl">
            Pricelist
          </h1>
          <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-cyan-300 to-teal-300 md:mx-0" />

          <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-white/80 md:mx-0">
            Browse and download our latest product pricelists by category and brand — always
            up to date with current rates.
          </p>

          {/* quick feature row so the left side feels full */}
          <div className="mx-auto mt-5 flex max-w-md flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-white/70 md:mx-0 md:justify-start">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" /> Verified brands
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" /> Instant PDF download
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" /> Updated monthly
            </span>
          </div>

          {/* breadcrumb — tightened gap */}
          <div className="mt-6 flex justify-center md:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide ring-1 ring-white/25 backdrop-blur-sm md:text-sm">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-slate-200 transition-colors hover:text-white"
              >
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-cyan-300">Pricelist</span>
            </span>
          </div>
        </div>

        {/* Right: product podium — hidden on mobile, visible from md up */}
        <div className="relative hidden h-[280px] sm:h-[340px] md:block md:h-[430px]">
          {/* Glass Panel */}
          <div className="absolute left-1/2 top-4 h-[82%] w-[86%] -translate-x-1/2 rounded-[40px] border border-white/15 bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-sm" />
          {/* inner panel glow so it doesn't feel empty */}
          <div className="pointer-events-none absolute left-1/2 top-[30%] h-40 w-40 -translate-x-1/2 rounded-full bg-cyan-300/20 blur-3xl" />

          {/* Products */}
          {/* Polycab */}
          <div className="absolute bottom-[72px] left-[12%] z-20">
            <Image
              src="/images/pricelist/bannerimg/gwplus-tile-1563-x-1553-removebg-preview.png"
              alt=""
              width={180}
              height={180}
              className="w-[130px] rotate-[-6deg] drop-shadow-[0_18px_20px_rgba(0,0,0,.35)] md:w-[165px]"
            />
          </div>

          {/* Main Isolator */}
          <div className="absolute bottom-[70px] left-1/2 z-40 -translate-x-1/2">
            <Image
              src="/images/pricelist/bannerimg/solar-isolators-removebg-preview.png"
              alt=""
              width={320}
              height={320}
              className="w-[200px] drop-shadow-[0_25px_25px_rgba(0,0,0,.45)] md:w-[260px]"
            />
          </div>

          {/* Relay */}
          <div className="absolute bottom-[70px] right-[18%] z-30">
            <Image
              src="/images/pricelist/bannerimg/assets_9363b29032ef4e6598adee3414a78ba0_7b799b917f5e4474a50152d36d947ff2-removebg-preview.png"
              alt=""
              width={170}
              height={170}
              className="w-[110px] drop-shadow-[0_18px_20px_rgba(0,0,0,.35)] md:w-[145px]"
            />
          </div>

          {/* Small Device */}
          <div className="absolute bottom-[70px] right-[8%] z-10">
            <Image
              src="/images/pricelist/bannerimg/11-removebg-preview.png"
              alt=""
              width={160}
              height={160}
              className="w-[95px] drop-shadow-[0_15px_15px_rgba(0,0,0,.3)] md:w-[120px]"
            />
          </div>

          {/* Platform */}
          <div className="absolute bottom-7 left-1/2 h-[46px] w-[90%] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#3194c5] via-[#1a5f84] to-[#0c3550] shadow-[0_22px_40px_rgba(0,0,0,.45)]" />
          {/* Platform Highlight */}
          <div className="absolute bottom-[71px] left-1/2 h-2 w-[84%] -translate-x-1/2 rounded-full bg-white/25" />
        </div>
      </div>

      {/* wave transition into the page background */}
      <svg
        className="absolute -bottom-px left-0 h-16 w-full text-white md:h-20"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,50 C360,110 1080,-10 1440,50 L1440,100 L0,100 Z" fill="currentColor" />
      </svg>
    </section>
  );
}