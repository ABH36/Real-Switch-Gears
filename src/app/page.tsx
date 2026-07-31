import dynamic from "next/dynamic";
import HeroSlider from "@/components/home/HeroSlider";
import AboutSection from "@/components/home/AboutSection";
import BrandsGrid from "@/components/home/BrandsGrid";
// import WhyChooseUs from "@/components/home/WhyChooseUs";
import ClientsMarquee from "@/components/home/ClientsMarquee";
import Reveal from "@/components/ui/Reveal";

// Below-the-fold, interactive-only sections — split into their own chunks so
// their JS doesn't compete with the hero image for the initial hydration pass.
const Industries = dynamic(() => import("@/components/home/Industries"));
const ContactMap = dynamic(() => import("@/components/home/ContactMap"));

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <Reveal>
        <AboutSection />
      </Reveal>
      <Reveal>
        <BrandsGrid />
      </Reveal>
      <Reveal>
        <Industries />
      </Reveal>
      {/* <WhyChooseUs /> */}
      <Reveal>
        <ClientsMarquee />
      </Reveal>
      <Reveal>
        <ContactMap />
      </Reveal>
    </>
  );
}
