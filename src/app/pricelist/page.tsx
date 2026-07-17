import type { Metadata } from "next";
import PageBanner from "@/components/ui/PageBanner";
import PricelistGallery from "@/components/PricelistGallery";

export const metadata: Metadata = {
  title: "Pricelist | Real Switchgears & Cables Pvt. Ltd.",
};

export default function PricelistPage() {
  return (
    <>
      <PageBanner title="Pricelist" />
      <PricelistGallery />
    </>
  );
}