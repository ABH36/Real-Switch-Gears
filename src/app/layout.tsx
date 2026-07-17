import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ScrollToTop from "@/components/layout/ScrollToTop";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Real Switchgears & Cables Pvt. Ltd. | Authorised Distributor & Stockist",
  description:
    "Leading authorised distributor & stockist of Lauritz Knudsen (L&T Switchgears), Polycab wires & cables, and other branded electrical goods in Pune, India.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.className} antialiased bg-white text-slate-800`}>
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