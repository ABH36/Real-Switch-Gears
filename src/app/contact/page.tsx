import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, PhoneCall } from "lucide-react";
import ContactSection from "@/components/ContactSection";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Real Switchgears & Cables Pvt. Ltd. in Bhosari, Pune for enquiries on L&T Switchgear, Polycab wires & cables, and other branded electrical goods.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us | Real Switchgears & Cables Pvt. Ltd.",
    description:
      "Have a question about our products, pricing, or availability? Reach out and our team will get back to you shortly.",
    url: "/contact",
  },
};

const quickContacts: { icon: React.ElementType; value: string; label: string; href?: string }[] = [
  { icon: PhoneCall, value: site.phone, label: "Call Us", href: site.phoneHref },
  { icon: MessageCircle, value: "Chat with us", label: "WhatsApp", href: site.whatsapp },
  { icon: Mail, value: site.email, label: "Email Us", href: `mailto:${site.email}` },
  { icon: MapPin, value: "Bhosari, Pune", label: "Visit Us" },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#eaf5fb] via-[#f4fafd] to-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#1268b3]">Get In Touch</p>
          <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 text-balance">
            We&apos;d Love to Hear From You
          </h1>
          <p className="mt-4 text-slate-600 leading-relaxed max-w-xl mx-auto">
            Have a question about our products, pricing, or availability? Reach out and our team will get back
            to you shortly.
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            {quickContacts.map(({ icon: Icon, value, label, href }) => {
              const isExternal = href?.startsWith("http");
              const Tag = href ? "a" : "div";
              return (
                <Tag
                  key={label}
                  {...(href ? { href } : {})}
                  {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_2px_16px_rgba(15,50,80,0.06)] hover:shadow-[0_4px_20px_rgba(15,50,80,0.1)] transition-shadow"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gradient">
                    <Icon className="h-4.5 w-4.5 text-white" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{value}</p>
                    <p className="text-xs text-slate-500">{label}</p>
                  </div>
                </Tag>
              );
            })}
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
