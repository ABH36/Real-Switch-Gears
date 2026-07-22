import type { Metadata } from "next";
import PageBanner from "@/components/ui/PageBanner";
import ContactMap from "@/components/home/ContactMap";

export const metadata: Metadata = {
  title: "Get A Quote",
  description:
    "Request a quote for L&T Switchgear, Polycab wires & cables, and other branded electrical goods from Real Switchgears & Cables Pvt. Ltd.",
  alternates: { canonical: "/quote" },
  openGraph: {
    title: "Get A Quote | Real Switchgears & Cables Pvt. Ltd.",
    description:
      "Request a quote for L&T Switchgear, Polycab wires & cables, and other branded electrical goods.",
    url: "/quote",
  },
};

export default function QuotePage() {
  return (
    <>
      <PageBanner title="Get A Quote" />
      <ContactMap />
    </>
  );
}