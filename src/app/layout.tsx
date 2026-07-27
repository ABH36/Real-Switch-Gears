import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { site } from "@/data/site";

const geist = Geist({ subsets: ["latin"], display: "swap" });

const siteUrl = site.url;
const title = "Real Switchgears & Cables Pvt. Ltd. | Authorised Distributor & Stockist";
const description =
  "Leading authorised distributor & stockist of Lauritz Knudsen (L&T Switchgears), Polycab wires & cables, and other branded electrical goods in Pune, India.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: `%s | ${site.shortName}`,
    default: title,
  },
  description,
  keywords: [
    "L&T Switchgear distributor Pune",
    "Polycab wires and cables dealer",
    "electrical switchgear distributor India",
    "Real Switchgears Cables Pvt Ltd",
    "authorised electrical stockist Pune",
  ],
  authors: [{ name: site.name }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: site.name,
    title,
    description,
    images: [
      {
        url: "/images/logo/real_switchgear.png",
        width: 1000,
        height: 304,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/logo/real_switchgear.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#006db1",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.className} antialiased bg-white text-slate-800`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: site.name,
              alternateName: site.shortName,
              url: siteUrl,
              logo: `${siteUrl}/images/logo/real_switchgear.png`,
              foundingDate: String(site.established),
              telephone: site.phone,
              email: site.email,
              address: {
                "@type": "PostalAddress",
                streetAddress: site.address,
                addressLocality: "Pune",
                addressRegion: "Maharashtra",
                addressCountry: "IN",
              },
            }),
          }}
        />
        <TopBar />
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <ScrollToTop />
      </body>
    </html>
  );
}