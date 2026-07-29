"use client";

import { useState } from "react";
import { Building2, Mail, MessageSquare, Phone, Send, User } from "lucide-react";
import { site } from "@/data/site";

export default function ContactMap() {
  const [form, setForm] = useState({
    name: "", company: "", email: "", contact: "", message: "",
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
          source: "Quote page",
          name: form.name,
          company: form.company,
          email: form.email,
          phone: form.contact,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      setForm({ name: "", company: "", email: "", contact: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const fields = [
    { name: "name", placeholder: "Name", icon: User, type: "text" },
    { name: "company", placeholder: "Company Name", icon: Building2, type: "text" },
    { name: "email", placeholder: "Email", icon: Mail, type: "email" },
    { name: "contact", placeholder: "Contact", icon: Phone, type: "text" },
  ] as const;

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-slate-700 transition-colors focus:border-[#1268b3] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1268b3]/20";

  return (
    <section className="relative">
      <iframe
        src={site.mapEmbed}
        className="h-[500px] w-full border-0 grayscale-[15%] md:h-[720px]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Real Switchgears location map"
      />

      {/* Floating form card */}
      <div className="relative z-10 mx-3 -mt-24 mb-10 rounded-2xl bg-white p-8 shadow-2xl md:absolute md:top-4 md:right-12 md:mt-0 md:mb-0 md:w-[520px] md:p-10">
        <span className="mb-1 block h-1.5 w-14 rounded-full bg-brand-gradient" />
        <h2 className="text-3xl font-extrabold text-slate-800 md:text-4xl">Get In Touch</h2>
        <p className="mt-2 text-slate-500">
          Tell us what you need — we&apos;ll get back to you shortly.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mt-8 space-y-4">
            {fields.map(({ name, placeholder, icon: Icon, type }) => (
              <div key={name} className="relative">
                <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                <input
                  name={name}
                  type={type}
                  required={name === "email"}
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
            ))}
            <div className="relative">
              <MessageSquare className="pointer-events-none absolute left-3.5 top-4 h-4.5 w-4.5 text-slate-400" />
              <textarea
                name="message"
                required
                placeholder="Describe Your Requirement"
                rows={4}
                value={form.message}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-10 py-3.5 font-bold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Submit"}
            <Send className="h-4 w-4" />
          </button>
          {status === "sent" && (
            <p className="mt-3 text-sm font-medium text-emerald-600">
              Thanks — your enquiry has been sent. We&apos;ll get back to you shortly.
            </p>
          )}
          {status === "error" && (
            <p className="mt-3 text-sm font-medium text-red-600">
              Something went wrong. Please try again or call us at {site.phone}.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
