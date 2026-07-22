import type { Metadata } from "next";
import PageBanner from "@/components/ui/PageBanner";
import PricelistGallery from "@/components/PricelistGallery";

export const metadata: Metadata = {
  title: "Pricelist",
  description:
    "Browse the latest pricelist for L&T Switchgear, Polycab wires & cables, and other branded electrical goods from Real Switchgears & Cables Pvt. Ltd.",
  alternates: { canonical: "/pricelist" },
  openGraph: {
    title: "Pricelist | Real Switchgears & Cables Pvt. Ltd.",
    description:
      "Browse the latest pricelist for L&T Switchgear, Polycab wires & cables, and other branded electrical goods.",
    url: "/pricelist",
  },
};

export default function PricelistPage() {
  return (
    <>
      <PageBanner title="Pricelist" />
      <PricelistGallery />
    </>
  );
}