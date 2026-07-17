"use client";

import { useState } from "react";
import { MapPin, Mail, Clock, PhoneCall } from "lucide-react";
import { site } from "@/data/site";

export default function ContactSection() {
  const [form, setForm] = useState({
    company: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    const body = encodeURIComponent(
      `Company: ${form.company}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`
    );
    window.location.href = `mailto:${site.email}?subject=Enquiry from ${form.company}&body=${body}`;
  };

  const label = "block font-semibold text-slate-700 uppercase tracking-wide";
  const input =
    "mt-3 w-full rounded-md border border-slate-300 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-teal-500";

  return (
    <>
      <section className="py-16">
        <div className="mx-auto max-w-[1500px] px-4 grid gap-10 lg:grid-cols-2 items-start">
          {/* Left: Get In Touch card */}
          <div className="bg-brand-gradient rounded-2xl p-10 md:p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-wide">
              GET IN TOUCH
            </h2>

            <div className="mt-12 space-y-12">
              <InfoRow icon={MapPin} title="Office Address">
                <p>{site.address}</p>
              </InfoRow>

              <InfoRow icon={PhoneCall} title="Call">
                <p>
                  <a href={site.phoneHref} className="hover:underline">{site.phone}</a>
                </p>
                <p>
                  <a href={site.phone2Href} className="hover:underline">{site.phone2}</a>
                </p>
              </InfoRow>

              <InfoRow icon={Mail} title="Email">
                <p>
                  <a href={`mailto:${site.email}`} className="hover:underline">{site.email}</a>
                </p>
                <p>
                  <a href={`mailto:${site.email2}`} className="hover:underline">{site.email2}</a>
                </p>
              </InfoRow>

              <InfoRow icon={Clock} title="Working Hours">
                <p>{site.hours}</p>
                <p>{site.hoursClosed}</p>
              </InfoRow>
            </div>
          </div>

          {/* Right: form card */}
          <div className="bg-white rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.09)] p-10 md:p-12">
            <div className="space-y-8">
              <div>
                <label className={label}>Company Name</label>
                <input name="company" value={form.company} onChange={handleChange} className={input} />
              </div>
              <div>
                <label className={label}>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className={input} />
              </div>
              <div>
                <label className={label}>Phone Number</label>
                <input name="phone" value={form.phone} onChange={handleChange} className={input} />
              </div>
              <div>
                <label className={label}>Message</label>
                <textarea name="message" rows={5} value={form.message} onChange={handleChange} className={input} />
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-[#1268b3] hover:bg-[#0d5798] text-white font-bold uppercase tracking-wide py-5 rounded-full transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Full-width map */}
      <iframe
        src={site.mapEmbed}
        className="w-full h-[480px] border-0 block"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Real Switchgears location map"
      />
    </>
  );
}

function InfoRow({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-6">
      <span className="h-14 w-14 shrink-0 rounded-full bg-white flex items-center justify-center">
        <Icon className="h-6 w-6 text-red-600" />
      </span>
      <div>
        <h3 className="text-2xl font-bold">{title}</h3>
        <div className="mt-2 space-y-1 text-lg leading-relaxed">{children}</div>
      </div>
    </div>
  );
}