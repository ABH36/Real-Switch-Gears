
import Link from "next/link";
import Image from "next/image";
import { site } from "@/data/site";

export default function TopBar() {
  return (
    <div id="top-bar" className="hidden md:block bg-white">
      <div className="mx-auto max-w-[1137px] px-4 flex items-center justify-between h-[148px]">
        <Link href="/">
          <Image
            src="/images/logo/real_switchgear.png"
            alt={site.name}
            width={300}
            height={91}
            className="h-[99px] w-auto"
            loading="eager"
            fetchPriority="high"
          />
        </Link>

        <div className="flex items-center gap-12">
          <a href={site.phoneHref} className="flex items-center gap-4 group">
            <Image src="/images/icons/phone.svg" alt="" width={55} height={55} className="h-[55px] w-[55px]" />
            <span>
              <span className="block font-semibold text-[15px] text-[#282828]">
                Call Us Now
              </span>
              <span className="block text-[18px] font-normal text-[#006db1] group-hover:text-red-600">
                {site.phone}
              </span>
            </span>
          </a>

          <a href={`mailto:${site.email}`} className="flex items-center gap-4 group">
            <Image src="/images/icons/email.svg" alt="" width={55} height={55} className="h-[55px] w-[55px]" />
            <span>
              <span className="block font-semibold text-[15px] text-[#282828]">Email</span>
              <span className="block text-[18px] font-normal text-[#006db1] group-hover:text-red-600">
                {site.email}
              </span>
            </span>
          </a>

          <Image
            src="/images/logo/celebrating-25-years.png"
            alt="Celebrating 25 Years"
            width={151}
            height={151}
            className="h-[151px] w-[151px]"
          />
        </div>
      </div>
    </div>
  );
}