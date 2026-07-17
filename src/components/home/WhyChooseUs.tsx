import { HeartHandshake, Users, Lightbulb } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const reasons = [
  {
    num: "01",
    icon: HeartHandshake,
    title: "Customer Satisfaction",
    text: "Our commitment to quality and customer satisfaction is the driving force behind everything we do.",
  },
  {
    num: "02",
    icon: Users,
    title: "Experienced Team",
    text: "Our extensive knowledge base ensures customers throughout India receive top-notch service and support.",
  },
  {
    num: "03",
    icon: Lightbulb,
    title: "Smart Solutions",
    text: "Innovation and sustainability drive every aspect of our business, delivering smarter outcomes for clients.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading eyebrow="Why Choose Us" title="What Sets Us Apart" />

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {reasons.map(({ num, icon: Icon, title, text }) => (
            <div
              key={num}
              className="relative bg-slate-50 rounded-xl p-8 border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <span className="absolute top-6 right-6 text-5xl font-extrabold text-slate-200">
                {num}
              </span>
              <span className="h-14 w-14 rounded-full bg-red-600 flex items-center justify-center">
                <Icon className="h-7 w-7 text-white" />
              </span>
              <h3 className="mt-6 text-xl font-bold text-slate-900">{title}</h3>
              <p className="mt-3 text-slate-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}