

import { Zap } from "lucide-react";

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      {eyebrow && (
        <p className="text-red-600 font-bold text-2xl md:text-3xl capitalize">
          {eyebrow}
        </p>
      )}
      {/* red divider with lightning bolt */}
      <div className="mt-3 flex items-center justify-center gap-0">
        <span className="h-[2px] w-16 bg-red-600" />
        <span className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center -mx-px">
          <Zap className="h-4 w-4 text-white fill-white" />
        </span>
        <span className="h-[2px] w-16 bg-red-600" />
      </div>
      <h2
        className={`mt-4 text-3xl md:text-4xl font-extrabold ${
          light ? "text-white" : "text-slate-800"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 ${light ? "text-slate-200" : "text-slate-600"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}