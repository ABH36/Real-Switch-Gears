import type { Metadata } from "next";
import PageBanner from "@/components/ui/PageBanner";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Contact | Real Switchgears & Cables Pvt. Ltd.",
};

export default function ContactPage() {
  return (
    <>
      <PageBanner title="Contact" />
      <ContactSection />
    </>
  );
}