import * as cheerio from "cheerio";
import { mkdirSync, writeFileSync, readFileSync, existsSync, createWriteStream, unlinkSync } from "fs";
import { Readable } from "stream";
import { createHash } from "crypto";
import path from "path";

// Some Salzer pages fall back to the exact same blank gradient placeholder
// banner when no real product photo has been uploaded on their site (verified
// byte-identical across single-phase-toroidal-transformers, bunched-copper-
// conductors, tinned-copper-wires). Skip it rather than show a blank box.
const PLACEHOLDER_MD5 = new Set(["1bbc1de381671c2fc43d96843f8ac540"]);

const BRAND = "salzer";
const IMG_DIR = `public/images/products/${BRAND}`;
const CAT_DIR = `public/catalogues/${BRAND}`;
const OUT_FILE = `src/data/catalog/${BRAND}.products.json`;
const LOCAL_DIR = `scripts/html/${BRAND}`; // fallback: manually-saved pages go here

// Each entry maps a Salzer product page to the catalog item slug in
// src/data/catalog/salzer.ts. category = the catalog section heading (Salzer's
// catalog has one section per top-level category, so it equals the category name).
// NOTE: 3 catalog items have no live page on salzergroup.net (soft-404 /
// removed) and are intentionally left out here — they keep the existing
// "coming soon" fallback: three-phase-dry-type-transformers, energy-savers-panels,
// street-light-controllers.
const sources = [
  // ---- Industrial Components ----
  { slug: "cable-wire-ducts", category: "Industrial Components", url: "https://www.salzergroup.net/products/cable-ducts.html" },
  { slug: "cam-operated-rotary-switches", category: "Industrial Components", url: "https://www.salzergroup.net/products/cam-rotary-switches.html" },
  { slug: "photovoltaic-isolators-changeovers", category: "Industrial Components", url: "https://www.salzergroup.net/products/solar-isolators-and-changeover-switches.html" },
  { slug: "general-purpose-relays", category: "Industrial Components", url: "https://www.salzergroup.net/products/general-purpose-relays.html" },
  { slug: "load-break-isolators-changeovers", category: "Industrial Components", url: "https://www.salzergroup.net/products/load-break-photo-voltaic-switches.html" },
  { slug: "sensors", category: "Industrial Components", url: "https://www.salzergroup.net/products/sensors.html" },
  { slug: "limit-foot-switches", category: "Industrial Components", url: "https://www.salzergroup.net/products/limit-foot-switches.html" },
  { slug: "rotary-limit-switches", category: "Industrial Components", url: "https://www.salzergroup.net/products/rotary-limit-switches.html" },
  { slug: "terminal-connectors", category: "Industrial Components", url: "https://www.salzergroup.net/products/terminal-connectors.html" },
  { slug: "customised-control-panels", category: "Industrial Components", url: "https://www.salzergroup.net/products/customised-control-panels.html" },
  { slug: "industrial-plug-socket", category: "Industrial Components", url: "https://www.salzergroup.net/products/industrial-plug-socket.html" },
  // ---- Motor Control Products ----
  { slug: "contactors-overload-relays", category: "Motor Control Products", url: "https://www.salzergroup.net/products/contactors-overload-relays.html" },
  { slug: "motor-protection-circuit-breaker-mpcb", category: "Motor Control Products", url: "https://www.salzergroup.net/products/motor-protection-circuit-breaker.html" },
  // ---- Transformers ----
  { slug: "ct-rogowski-coils", category: "Transformers", url: "https://www.salzergroup.net/products/toroidal-transformers-cts-rogowski-coils.html" },
  { slug: "inductors-chokes-filters", category: "Transformers", url: "https://www.salzergroup.net/products/inductors-and-chokes.html" },
  { slug: "single-phase-toroidal-transformers", category: "Transformers", url: "https://www.salzergroup.net/products/single-phase-toroidal-transformer.html" },
  // ---- Automotive Products ----
  { slug: "ev-chargers", category: "Automotive Products", url: "https://www.salzergroup.net/products/ev-chargers.html" },
  // ---- Building Segment ----
  { slug: "automatic-source-changeover-current-limiter", category: "Building Segment", url: "https://www.salzergroup.net/products/automatic-source-changeover-with-current-limiter.html" },
  { slug: "distribution-boards", category: "Building Segment", url: "https://www.salzergroup.net/products/distribution-boards.html" },
  { slug: "miniature-circuit-breakers-mcb", category: "Building Segment", url: "https://www.salzergroup.net/products/miniature-circuit-breaker's.html" },
  { slug: "modular-switches-speciality", category: "Building Segment", url: "https://www.salzergroup.net/products/modular-switches-speciality.html" },
  { slug: "wifi-smart-switches", category: "Building Segment", url: "https://www.salzergroup.net/products/wifi-smart-switches.html" },
  { slug: "movement-sensors", category: "Building Segment", url: "https://www.salzergroup.net/products/movement-sensors.html" },
  { slug: "remote-switches", category: "Building Segment", url: "https://www.salzergroup.net/products/remote-switches.html" },
  { slug: "single-phase-motor-starters", category: "Building Segment", url: "https://www.salzergroup.net/products/single-phase-motor-starters.html" },
  { slug: "house-wires", category: "Building Segment", url: "https://www.salzergroup.net/products/house-wires.html" },
  // ---- Copper Segment ----
  { slug: "industrial-wires-cables", category: "Copper Segment", url: "https://www.salzergroup.net/products/industrial-wires-and-cables.html" },
  { slug: "flexible-busbars-wire-harness", category: "Copper Segment", url: "https://www.salzergroup.net/products/flexible-busbars.html" },
  { slug: "enamelled-copper-wire", category: "Copper Segment", url: "https://www.salzergroup.net/products/enameled-copper-wire.html" },
  { slug: "bunched-copper-conductors", category: "Copper Segment", url: "https://www.salzergroup.net/products/bunched-conductors.html" },
  { slug: "tinned-copper-wires", category: "Copper Segment", url: "https://www.salzergroup.net/products/tinned-copper-wires.html" },
  { slug: "lan-cctv-cables", category: "Copper Segment", url: "https://www.salzergroup.net/products/lan-cables.html" },
];

mkdirSync(IMG_DIR, { recursive: true });
mkdirSync(CAT_DIR, { recursive: true });
mkdirSync(LOCAL_DIR, { recursive: true });

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

async function getHtml({ slug, url }) {
  const localFile = path.join(LOCAL_DIR, `${slug}.html`);
  if (existsSync(localFile)) {
    console.log("   (using local file)");
    return readFileSync(localFile, "utf8");
  }
  const res = await fetch(url, { headers: HEADERS });
  const html = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (/the page you requested cannot be found/i.test(html)) throw new Error("Soft-404 (page removed on live site)");
  return html;
}

async function downloadTo(absUrl, dir, filename, publicPrefix) {
  try {
    const res = await fetch(absUrl, { headers: HEADERS });
    if (!res.ok) return null;
    const dest = path.join(dir, filename);
    await new Promise((resolve, reject) => {
      const ws = createWriteStream(dest);
      Readable.fromWeb(res.body).pipe(ws).on("finish", resolve).on("error", reject);
    });
    return `${publicPrefix}/${filename}`;
  } catch {
    return null;
  }
}

async function downloadImage(absUrl, filename) {
  const local = await downloadTo(absUrl, IMG_DIR, filename, `/images/products/${BRAND}`);
  if (!local) return null;
  const dest = path.join(IMG_DIR, filename);
  const hash = createHash("md5").update(readFileSync(dest)).digest("hex");
  if (PLACEHOLDER_MD5.has(hash)) {
    unlinkSync(dest);
    return null;
  }
  return local;
}

const catalogueCache = new Map();
async function downloadCatalogue(absUrl) {
  if (catalogueCache.has(absUrl)) return catalogueCache.get(absUrl);
  const filename = slugify(path.basename(new URL(absUrl).pathname).replace(/\.pdf$/i, "")) + ".pdf";
  const local = await downloadTo(absUrl, CAT_DIR, filename, `/catalogues/${BRAND}`);
  catalogueCache.set(absUrl, local);
  return local;
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// company-wide brochures repeated on every product page — not product-specific
const GENERIC_PDF_RE = /magnetics brochure|safeconnect/i;

async function scrapeOne(src) {
  console.log("→", src.slug);
  const html = await getHtml(src);
  const $ = cheerio.load(html);

  const name = $("h1").first().text().replace(/\s+/g, " ").trim() || src.slug;

  // ---------- overview + benefits: "Intro" / "Detailed Description" / "Specifications"
  // blocks share one layout — a label div (.noPl > h2) followed by its content
  // div (.noPr) — so walk them generically instead of hardcoding 3 selectors.
  const overview = [];
  const benefits = [];
  $(".noPl").each((_, labelEl) => {
    const $label = $(labelEl);
    const heading = $label.find("h2").first().text().trim();
    const $content = $label.next(".noPr");
    if (!heading || !$content.length) return;

    if (/specification|feature/i.test(heading)) {
      $content.find("li h3").each((_, h3) => {
        const t = $(h3).text().replace(/\s+/g, " ").trim();
        if (t && !benefits.includes(t)) benefits.push(t);
      });
    } else {
      $content.find("h6, p").each((_, p) => {
        const t = $(p).text().replace(/\s+/g, " ").trim();
        if (t && !overview.includes(t)) overview.push(t);
      });
    }
  });

  // ---------- hero image: first real product image in the main content area ----------
  let image;
  const heroEl = $(".cmn_container img, body img")
    .filter((_, el) => {
      const s = $(el).attr("src") || "";
      return /\/image\/products\//i.test(s) && !/logo|sitelock|icon-|sprite|whatsapp|arrow|social/i.test(s);
    })
    .first();
  const heroRaw = heroEl.attr("src");
  if (heroRaw) {
    const abs = new URL(heroRaw, src.url).href;
    const ext = path.extname(new URL(abs).pathname) || ".jpg";
    image = await downloadImage(abs, `${src.slug}${ext}`);
  }

  // ---------- catalogue: product-specific PDF, skipping the two company-wide brochures ----------
  let catalogue;
  const pdfHref = $('a[href$=".pdf" i]')
    .filter((_, a) => !GENERIC_PDF_RE.test($(a).attr("href") || ""))
    .first()
    .attr("href");
  if (pdfHref) {
    const abs = new URL(pdfHref, src.url).href;
    catalogue = await downloadCatalogue(abs);
  }

  const entry = { slug: src.slug, name, category: src.category, overview };
  if (image) entry.image = image;
  if (benefits.length) entry.benefits = benefits;
  if (catalogue) entry.catalogue = catalogue;
  console.log(`   overview:${overview.length} benefits:${benefits.length}${image ? " img✓" : ""}${catalogue ? " pdf✓" : ""}`);
  return entry;
}

const only = process.argv.find((a) => a.startsWith("--only="))?.split("=")[1];
const queue = only ? sources.filter((s) => s.slug === only) : sources;

const results = [];
for (const s of queue) {
  try {
    results.push(await scrapeOne(s));
  } catch (e) {
    console.error("   FAILED:", e.message);
  }
  await new Promise((r) => setTimeout(r, 600));
}

let out = results;
if (only && existsSync(OUT_FILE)) {
  const prev = JSON.parse(readFileSync(OUT_FILE, "utf8"));
  const bySlug = new Map(prev.map((p) => [p.slug, p]));
  for (const r of results) bySlug.set(r.slug, r);
  out = [...bySlug.values()];
} else if (existsSync(OUT_FILE)) {
  // full run: keep any previously-scraped entries not in this source list (none expected, but safe)
  const prev = JSON.parse(readFileSync(OUT_FILE, "utf8"));
  const gotSlugs = new Set(results.map((r) => r.slug));
  const keep = prev.filter((p) => !sources.some((s) => s.slug === p.slug) && !gotSlugs.has(p.slug));
  out = [...results, ...keep];
}

writeFileSync(OUT_FILE, JSON.stringify(out, null, 2) + "\n");
console.log(`\nDone: ${results.length} scraped → ${OUT_FILE} (${out.length} total)`);
