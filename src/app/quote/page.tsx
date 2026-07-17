import type { Metadata } from "next";
import PageBanner from "@/components/ui/PageBanner";
import ContactMap from "@/components/home/ContactMap";

export const metadata: Metadata = {
  title: "Get A Quote | Real Switchgears & Cables Pvt. Ltd.",
};

export default function QuotePage() {
  return (
    <>
      <PageBanner title="Get A Quote" />
      <ContactMap />
    </>
  );
}