
import Link from "next/link";
import Image from "next/image";
import { PhoneCall, MailOpen } from "lucide-react";
import { site } from "@/data/site";

export default function TopBar() {
  return (
    <div className="hidden md:block bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/images/logo/real_switchgear.png"
            alt={site.name}
            width={300}
            height={80}
            className="h-16 w-auto"
            priority
          />
        </Link>

        <div className="flex items-center gap-12">
          <a href={site.phoneHref} className="flex items-center gap-4 group">
            <PhoneCall className="h-9 w-9 text-red-600" strokeWidth={1.5} />
            <span>
              <span className="block font-bold text-slate-800 text-lg">
                Call Us Now
              </span>
              <span className="block text-blue-700 font-semibold text-lg group-hover:text-red-600">
                {site.phone}
              </span>
            </span>
          </a>

          <a href={`mailto:${site.email}`} className="flex items-center gap-4 group">
            <MailOpen className="h-9 w-9 text-red-600" strokeWidth={1.5} />
            <span>
              <span className="block font-bold text-slate-800 text-lg">Email</span>
              <span className="block text-blue-700 font-semibold text-lg group-hover:text-red-600">
                {site.email}
              </span>
            </span>
          </a>

          <Image
            src="/images/logo/celebrating-25-years.png"
            alt="Celebrating 25 Years"
            width={140}
            height={140}
            className="h-24 w-auto"
          />
        </div>
      </div>
    </div>
  );
}