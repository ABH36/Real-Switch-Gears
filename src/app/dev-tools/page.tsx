"use client";

import { useEffect, useMemo, useState } from "react";

/* ---------- helpers ---------- */
const BRANDS = [
  "lauritz-knudsen", "polycab", "salzer", "gic",
  "braco", "newtek", "esbee", "connectwell",
];

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/&/g, "and").replace(/\+/g, "-plus")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const splitParagraphs = (t: string) =>
  t.split(/\n\s*\n/).map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean);

const splitLines = (t: string) =>
  t.split("\n").map((l) => l.trim()).filter(Boolean);

const parseFeatures = (t: string) =>
  splitLines(t).map((line) => {
    const m = line.match(/^(.*?)\s*(?:—|–|-|:)\s+(.*)$/);
    return m && m[1] && m[1].length < 80
      ? { title: m[1].trim(), text: m[2].trim() }
      : { title: line, text: "" };
  });

type Product = Record<string, unknown> & { slug: string; name: string };

const emptyForm = {
  name: "", slug: "", slugTouched: false, category: "", image: "",
  overview: "", benefits: "", benefitsImage: "", features: "",
  featuresImage: "", catalogue: "",
};

/* ---------- page ---------- */
export default function DevTools() {
  const [brand, setBrand] = useState(BRANDS[0]);
  const [form, setForm] = useState(emptyForm);
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState("");

  // load existing file whenever brand changes
  useEffect(() => {
    fetch(`/api/dev/products?brand=${brand}`)
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  }, [brand]);

  const set = (key: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setForm((f) => {
        const next = { ...f, [key]: value };
        if (key === "name" && !f.slugTouched) next.slug = slugify(value);
        if (key === "slug") next.slugTouched = true;
        return next;
      });
    };

  const entry = useMemo(() => {
    const o: Product = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      category: form.category.trim(),
      overview: splitParagraphs(form.overview),
    };
    if (form.image.trim()) o.image = form.image.trim();
    const ben = splitLines(form.benefits);
    if (ben.length) o.benefits = ben;
    if (form.benefitsImage.trim()) o.benefitsImage = form.benefitsImage.trim();
    const feat = parseFeatures(form.features);
    if (feat.length) o.features = feat;
    if (form.featuresImage.trim()) o.featuresImage = form.featuresImage.trim();
    if (form.catalogue.trim()) o.catalogue = form.catalogue.trim();
    return o;
  }, [form]);

  const saveToFile = async (list: Product[]) => {
    setStatus("Saving…");
    const res = await fetch(`/api/dev/products?brand=${brand}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(list),
    });
    setStatus(res.ok ? `Saved ✓ (${list.length} products in file)` : "Save failed ✗");
  };

  const addAndSave = async () => {
    if (!entry.slug || !entry.name) return;
    const list = [...products.filter((p) => p.slug !== entry.slug), entry];
    setProducts(list);
    await saveToFile(list);
    setForm(emptyForm);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (slug: string) => {
    const list = products.filter((p) => p.slug !== slug);
    setProducts(list);
    await saveToFile(list);
  };

  const label = "block text-sm font-bold text-slate-700 mb-1.5";
  const input =
    "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white";

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-extrabold text-slate-800">
            Product Data Entry <span className="text-slate-400">(dev only)</span>
          </h1>
          <div className="flex items-center gap-3">
            <select value={brand} onChange={(e) => setBrand(e.target.value)} className={input + " w-56"}>
              {BRANDS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <span className="text-sm font-semibold text-teal-700">{status}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2 items-start">
          {/* form */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={label}>Name *</label>
                <input className={input} value={form.name} onChange={set("name")} />
              </div>
              <div>
                <label className={label}>Slug *</label>
                <input className={input} value={form.slug} onChange={set("slug")} />
              </div>
            </div>
            <div>
              <label className={label}>Category *</label>
              <input className={input} value={form.category} onChange={set("category")} />
            </div>
            <div>
              <label className={label}>Product image path</label>
              <input className={input} value={form.image} onChange={set("image")} placeholder={`/images/products/${brand}/slug.png`} />
            </div>
            <div>
              <label className={label}>Overview (blank line = new paragraph)</label>
              <textarea rows={5} className={input} value={form.overview} onChange={set("overview")} />
            </div>
            <div>
              <label className={label}>Benefits (one per line)</label>
              <textarea rows={4} className={input} value={form.benefits} onChange={set("benefits")} />
            </div>
            <div>
              <label className={label}>Benefits image path</label>
              <input className={input} value={form.benefitsImage} onChange={set("benefitsImage")} />
            </div>
            <div>
              <label className={label}>Features (Title - description, one per line)</label>
              <textarea rows={5} className={input} value={form.features} onChange={set("features")} />
            </div>
            <div>
              <label className={label}>Features image path</label>
              <input className={input} value={form.featuresImage} onChange={set("featuresImage")} />
            </div>
            <div>
              <label className={label}>Catalogue PDF path</label>
              <input className={input} value={form.catalogue} onChange={set("catalogue")} placeholder={`/catalogues/${brand}/slug.pdf`} />
            </div>

            <button
              onClick={addAndSave}
              disabled={!form.slug || !form.name}
              className="w-full rounded-full py-3 font-bold text-white disabled:opacity-40"
              style={{ background: "linear-gradient(90deg,#006db1,#03a099)" }}
            >
              Save to file &amp; next product
            </button>
          </div>

          {/* right: preview + saved list */}
          <div className="space-y-6 lg:sticky lg:top-6">
            <pre className="bg-slate-900 text-teal-100 rounded-2xl p-4 text-[11.5px] leading-relaxed overflow-auto max-h-[300px]">
              {JSON.stringify(entry, null, 2)}
            </pre>

            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="font-extrabold text-slate-800">
                In file: {brand}.products.json{" "}
                <span className="text-slate-400 font-semibold">({products.length})</span>
              </h2>
              <ul className="mt-3 divide-y divide-slate-100">
                {products.map((p) => (
                  <li key={p.slug} className="flex items-center justify-between py-2">
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-800 truncate">{p.name}</p>
                      <p className="text-xs text-slate-400 truncate">{p.slug}</p>
                    </div>
                    <button onClick={() => remove(p.slug)} className="text-xs font-bold text-red-400 hover:text-red-600 px-2">
                      Remove
                    </button>
                  </li>
                ))}
                {products.length === 0 && (
                  <li className="py-2 text-sm text-slate-400">File is empty.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}