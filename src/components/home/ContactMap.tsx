



"use client";

import { useState } from "react";
import { site } from "@/data/site";

export default function ContactMap() {
  const [form, setForm] = useState({
    name: "", company: "", email: "", contact: "", message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    const body = encodeURIComponent(
      `Name: ${form.name}\nCompany: ${form.company}\nEmail: ${form.email}\nContact: ${form.contact}\n\n${form.message}`
    );
    window.location.href = `mailto:${site.email}?subject=Enquiry from ${form.name}&body=${body}`;
  };

  const inputCls =
    "w-full rounded-xl border border-slate-300 px-5 py-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500";

  return (
    <section className="relative">
      <iframe
        src={site.mapEmbed}
        className="w-full h-[500px] md:h-[720px] border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Real Switchgears location map"
      />

      {/* Floating form card */}
      <div className="md:absolute md:top-4 md:right-12 md:w-[520px] bg-white rounded-2xl shadow-2xl p-8 md:p-10 mx-3 -mt-24 md:mt-0 relative z-10 mb-10 md:mb-0">
        <h2 className="text-4xl font-extrabold text-slate-800">Get In Touch</h2>
        <div className="mt-8 space-y-5">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className={inputCls} />
          <input name="company" placeholder="Company Name" value={form.company} onChange={handleChange} className={inputCls} />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className={inputCls} />
          <input name="contact" placeholder="Contact" value={form.contact} onChange={handleChange} className={inputCls} />
          <textarea name="message" placeholder="Describe Your Requirement" rows={4} value={form.message} onChange={handleChange} className={inputCls} />
        </div>
        <button
          onClick={handleSubmit}
          className="mt-6 bg-brand-gradient text-white font-bold text-lg px-12 py-4 rounded-full hover:opacity-90 transition-opacity"
        >
          Submit
        </button>
      </div>
    </section>
  );
}