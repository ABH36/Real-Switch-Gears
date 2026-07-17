import HeroSlider from "@/components/home/HeroSlider";
import AboutSection from "@/components/home/AboutSection";
import BrandsGrid from "@/components/home/BrandsGrid";
import Industries from "@/components/home/Industries";
// import WhyChooseUs from "@/components/home/WhyChooseUs";
import ClientsMarquee from "@/components/home/ClientsMarquee";
import ContactMap from "@/components/home/ContactMap";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <AboutSection />
      <BrandsGrid />
      <Industries />
      {/* <WhyChooseUs /> */}
      <ClientsMarquee />
      <ContactMap />
    </>
  );
}