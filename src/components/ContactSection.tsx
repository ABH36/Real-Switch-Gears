"use client";

import { useState } from "react";
import { MapPin, Mail, Clock, PhoneCall, Send } from "lucide-react";
import { site } from "@/data/site";
import Reveal from "@/components/ui/Reveal";

export default function ContactSection() {
  const [form, setForm] = useState({
    company: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "Contact page",
          company: form.company,
          email: form.email,
          phone: form.phone,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      setForm({ company: "", email: "", phone: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const label = "block text-sm font-semibold text-slate-700";
  const input =
    "mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1268b3]/30 focus:border-[#1268b3] transition-colors";

  return (
    <>
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 grid gap-6 lg:grid-cols-2 items-start">
          {/* Left: Get In Touch card */}
          <Reveal y={24}>
            <div className="bg-brand-gradient rounded-2xl p-8 md:p-10 text-white">
              <h2 className="text-2xl md:text-3xl font-extrabold">Get In Touch</h2>
              <p className="mt-2 text-white/80 text-sm">
                Reach us directly through any of the channels below.
              </p>

              <div className="mt-9 space-y-8">
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
          </Reveal>

          {/* Right: form card */}
          <Reveal delay={120} y={24}>
            <div className="rounded-2xl bg-white border border-slate-200 shadow-[0_2px_20px_rgba(15,50,80,0.06)] p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">Send a Message</h2>
              <p className="mt-2 text-slate-500 text-sm">We usually respond within one business day.</p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div>
                  <label className={label}>Company Name</label>
                  <input
                    name="company"
                    required
                    placeholder="Your company"
                    value={form.company}
                    onChange={handleChange}
                    className={input}
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={label}>Email</label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={handleChange}
                      className={input}
                    />
                  </div>
                  <div>
                    <label className={label}>Phone Number</label>
                    <input
                      name="phone"
                      type="tel"
                      required
                      placeholder="+91"
                      value={form.phone}
                      onChange={handleChange}
                      className={input}
                    />
                  </div>
                </div>
                <div>
                  <label className={label}>Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    placeholder="Tell us what you're looking for..."
                    value={form.message}
                    onChange={handleChange}
                    className={input}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-gradient text-white font-semibold py-3.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {status === "sending" ? "Sending…" : "Send Message"} <Send className="h-4 w-4" />
                </button>
                {status === "sent" && (
                  <p className="text-sm font-medium text-emerald-600">
                    Thanks — your message has been sent. We&apos;ll get back to you shortly.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-sm font-medium text-red-600">
                    Something went wrong. Please try again or call us at {site.phone}.
                  </p>
                )}
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Map */}
      <section className="pb-12 md:pb-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">Find Us</h2>
          <Reveal className="mt-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <iframe
                src={site.mapEmbed}
                className="w-full h-[380px] md:h-[440px] border-0 block"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Real Switchgears location map"
              />
            </div>
          </Reveal>
        </div>
      </section>
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
    <div className="flex gap-4">
      <span className="h-11 w-11 shrink-0 rounded-full bg-white/15 flex items-center justify-center">
        <Icon className="h-5 w-5 text-white" />
      </span>
      <div>
        <h3 className="text-base font-bold">{title}</h3>
        <div className="mt-1 space-y-0.5 text-sm text-white/85 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
