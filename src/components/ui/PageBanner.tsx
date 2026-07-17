


import Link from "next/link";

export default function PageBanner({
  title,
  image,
}: {
  title: string;
  image?: string;
}) {
  return (
    <section
      className="relative py-20 md:py-28 bg-[#54595f] bg-cover bg-center"
      style={image ? { backgroundImage: `url(${image})` } : undefined}
    >
      {image && <div className="absolute inset-0 bg-slate-900/60" />}
      <div className="relative mx-auto max-w-7xl px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">{title}</h1>
        <p className="mt-6 text-slate-200 font-semibold uppercase tracking-wide">
          <Link href="/" className="text-slate-300 hover:text-white">Home</Link>
          <span className="mx-3">/</span>
          <span className="text-white">{title}</span>
        </p>
      </div>
    </section>
  );
}