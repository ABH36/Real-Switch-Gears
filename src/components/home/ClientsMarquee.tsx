
import Image from "next/image";
import { brands } from "@/data/brands";
import SectionHeading from "@/components/ui/SectionHeading";

// track two starts from braco — same as original markup
const offset = 4;
const trackOne = [...brands, ...brands];
const trackTwo = [
  ...brands.slice(offset),
  ...brands.slice(0, offset),
  ...brands.slice(offset),
  ...brands.slice(0, offset),
];

function LogoRow({ items }: { items: typeof brands }) {
  return (
    <div className="flex w-max items-center gap-4 animate-marquee">
      {items.map((b, i) => (
        <div
          key={`${b.slug}-${i}`}
          className="bg-white rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.09)] h-45 w-[300px] shrink-0 flex items-center justify-center p-6"
        >
          <div className="relative h-full w-full">
            <Image src={b.logo} alt={b.name} fill className="object-contain" sizes="420px" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ClientsMarquee() {
  return (
    <section className="pt-[40px] pb-[40px] bg-white overflow-hidden">
      <SectionHeading eyebrow="We Are" title="Authorised Distributors & Stockists" />

      <div className="mt-16 space-y-10">
        <LogoRow items={trackOne} />
        {/* <LogoRow items={trackTwo} /> */}
      </div>
    </section>
  );
}