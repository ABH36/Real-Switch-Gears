import type { Metadata } from "next";
import PageBanner from "@/components/ui/PageBanner";

export const metadata: Metadata = {
  title: "About Us | Real Switchgears & Cables Pvt. Ltd.",
};

const aboutParas = [
  "REAL SWITCHGEARS & CABLES PRIVATE LIMITED (REAL SWITCHGEARS) exits in the market since 2000 and since then our products successfully reached throughout the India. REAL SWITCHGEARS is amongst the LEADING AUTHORISED DISTRIBUTOR OF POLYCAB and LEADING AUTHORISED DEALER & STOCKIST OF L&T SWITCHGEARS of the most branded and quality electrical goods in India.",
  "We provide efficient POLYCAB Wires & Cables and L&T Switchgears for modern day use by utilizing time tested technical expertise, experience and qualified professionals.",
  "We, REAL SWITCHGEARS are also LEADING AUTHORISED STOCKIST of Brands like L&T SWITCHGEARS, POLYCAB, SALZER, GIC, ESBEE, BRACO and EXORA.",
  "We are committed to remaining on the leading edge of technology, offering the quality and branded products, so we can effectively meet the complex and expanding needs of our customers with the help of our principals. REAL SWITCHGEARS principally competes on the basis of product quality and performance, reliability of supply, timely delivery, customer service and price. Established with sole objective to serve valuable customers with outstanding industrial electrical and electronic products",
  "REAL SWITCHGEARS principally competes on the basis of product quality and performance, reliability of supply, timely delivery, customer service and price. Established with sole objective to serve valuable customers with outstanding industrial electrical and electronic products including Low Voltage Products, Meters, Relays, Wires & Cables, Rotary Switches, Relays & Contactors, Terminal Connectors, Cable Ducts, Digital Panel Meters, Digital Multi Meters, Analog Panel Meters, Transducers, Timers, GIC Monitoring Devices, Push Button Actuator & Contact Block, LED Indicators, Power Capacitors, Plugs & Sockets, Terminal Lugs, Glands Accessories, Circuit Breakers, Changeover Switches and many more.",
];

const visionList = [
  "Market products & services which will ensure customers satisfaction and appreciation.",
  "Create & maintain a friendly environment that ensures involvement & commitment in all of us to aim for total quality in everything we do.",
  "Continuing to exercise industry leadership by establishing a shared purpose, optimizing work processes, developing people and utilizing the most current tools & technologies.",
];

const missionList = [
  "To be the absolute best electrical service provider in the market we serve and to offer our customers a one-stop solution for their entire electrical power distribution needs.",
  "We believe in fostering positive business partnerships with our vendors and supplier community and work hard to make these relationships one of trust and mutual respect.",
  "In this dynamically changing business environment, we recognize the requirement for continuous improvement to meet the needs of our customers.",
];

function BeforeTitle({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-[2px] w-10 bg-red-600" />
      <span className="text-red-600 font-bold uppercase tracking-widest">
        {text}
      </span>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageBanner title="About Us" image="/images/inner-banner/about_us.jpg" />

      <section className="pt-[90px] pb-[70px]">
        <div className="mx-auto max-w-7xl px-4">
          {/* About Company */}
          <BeforeTitle text="About Company" />
          <div className="mt-6 space-y-5">
            {aboutParas.map((p, i) => (
              <p key={i} className="text-slate-600 leading-relaxed text-justify">
                {p}
              </p>
            ))}
          </div>

          {/* Our Vision */}
          <div className="mt-12">
            <BeforeTitle text="Our Vision" />
            <ul className="mt-6 space-y-3 list-disc pl-6 text-slate-600 leading-relaxed">
              {visionList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Our Mission */}
          <div className="mt-12">
            <BeforeTitle text="Our Mission" />
            <ul className="mt-6 space-y-3 list-disc pl-6 text-slate-600 leading-relaxed">
              {missionList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}