import * as cheerio from "cheerio";
import { mkdirSync, writeFileSync, readFileSync, existsSync, createWriteStream } from "fs";
import { Readable } from "stream";
import path from "path";

const BRAND = "gic";
const IMG_DIR = `public/images/products/${BRAND}`;
const CAT_DIR = `public/catalogues/${BRAND}`;
const OUT_FILE = `src/data/catalog/${BRAND}.products.json`;
const LOCAL_DIR = `scripts/html/${BRAND}`;
const SITE = "https://www.gicindia.com";

// GIC (gicindia.com) is WooCommerce-based. Two catalog-item shapes:
//  - "single": the catalog item is exactly one WooCommerce product page — scrape
//    it directly into the ProductDetail's own fields (name/overview/benefits/image/catalogue).
//  - "multi": the catalog item covers several distinct model pages under one
//    product-category (e.g. Voltage Monitoring has SM175/SM301/.../SM800) — the
//    category archive page supplies overview/benefits, each product becomes a
//    ProductVariant (mirrors how Newtek's model tabs were handled).
// NOTE: "electromechanical-pulse-counter" (Hour Meters & Counters) has no live
// page on gicindia.com — left out, keeps the existing "coming soon" fallback.
const sources = [
  // ---- Human Machine Interface (HMI) ----
  { slug: "hmi-4-3-inch-tft-display", category: "Human Machine Interface (HMI)", type: "single", url: `${SITE}/products/human-machine-interface-hmi/4-3-inch-tft-display/` },
  { slug: "hmi-7-inch-tft-display", category: "Human Machine Interface (HMI)", type: "single", url: `${SITE}/products/human-machine-interface-hmi/7-inch-tft-display/` },
  { slug: "hmi-10-1-inch-tft-display", category: "Human Machine Interface (HMI)", type: "single", url: `${SITE}/products/human-machine-interface-hmi/10-1-inch-tft-display/` },
  // ---- Programmable Logic Controller ----
  { slug: "plc-pl100", category: "Programmable Logic Controller", type: "single", url: `${SITE}/products/programmable-logic-controller/plc-pl100/` },
  { slug: "smart-relay-genie-nx", category: "Programmable Logic Controller", type: "single", url: `${SITE}/products/programmable-logic-controller/smart-relay-genie-nx/` },
  { slug: "genie-pro", category: "Programmable Logic Controller", type: "single", url: `${SITE}/products/programmable-logic-controller/genie-pro/` },
  // ---- Power Supply ----
  { slug: "modular-power-supply", category: "Power Supply", type: "single", url: `${SITE}/products/power-supplies/modular/` },
  { slug: "din-rail-power-supply", category: "Power Supply", type: "single", url: `${SITE}/products/power-supplies/din-mount/` },
  { slug: "panel-mount-power-supply", category: "Power Supply", type: "single", url: `${SITE}/products/power-supplies/panel-mount/` },
  // ---- Gateways & Converters ----
  { slug: "protocol-converter", category: "Gateways & Converters", type: "single", url: `${SITE}/products/gateways-converters/lynx-gateway/` },
  { slug: "interface-converters", category: "Gateways & Converters", type: "single", url: `${SITE}/products/gateways-converters/interface-converters/` },
  { slug: "signal-transducers", category: "Gateways & Converters", type: "single", url: `${SITE}/products/gateways-converters/signal-transducers/` },
  // ---- GSM Controller ----
  { slug: "gsm-controller", category: "GSM Controller", type: "single", url: `${SITE}/products/gsm-controller/gsm-controller/` },
  // ---- Interface Relays ----
  { slug: "slim-relays", category: "Interface Relays", type: "single", url: `${SITE}/products/interface-relays/slim-relays/` },
  { slug: "isolated-relay-module", category: "Interface Relays", type: "single", url: `${SITE}/products/interface-relays/isolated-relay-module/` },
  // ---- Temperature Controller ----
  { slug: "pid-temperature-controller-48x48", category: "Temperature Controller", type: "single", url: `${SITE}/products/temperature-controllers/48x48-temperature-controller/` },
  { slug: "pid-temperature-controller-72x72", category: "Temperature Controller", type: "single", url: `${SITE}/products/temperature-controllers/72x72-temperature-controller/` },
  { slug: "pid-temperature-controller-96x96", category: "Temperature Controller", type: "single", url: `${SITE}/products/temperature-controllers/96x96-temperature-controller/` },
  // ---- Process Indicator ----
  { slug: "process-indicator", category: "Process Indicator", type: "single", url: `${SITE}/products/process-indicators/process-indicator/` },
  // ---- Monitoring Devices ----
  {
    slug: "voltage-monitoring", category: "Monitoring Devices", type: "multi", name: "Voltage Monitoring",
    categoryUrl: `${SITE}/product-category/monitoring-devices/voltage-monitoring/`,
    productUrls: ["sm175", "sm301", "sm500", "sm501", "sm600", "sm800"].map((s) => `${SITE}/products/monitoring-devices/voltage-monitoring/voltage-monitoring-${s}/`)
      .concat([`${SITE}/products/monitoring-devices/voltage-monitoring/single-phase-voltage-monitoring-relay/`]),
  },
  { slug: "current-monitoring-relay", category: "Monitoring Devices", type: "single", url: `${SITE}/products/monitoring-devices/current-monitoring/current-monitoring/` },
  {
    slug: "earth-leakage-monitoring", category: "Monitoring Devices", type: "multi", name: "Earth Leakage Monitoring",
    categoryUrl: `${SITE}/product-category/monitoring-devices/earth-leakage-monitoring/`,
    productUrls: ["earth-leakage-relay", "integral-earth-leakage-relay", "digital-earth-leakage-relay-with-cbct"].map((s) => `${SITE}/products/monitoring-devices/earth-leakage-monitoring/${s}/`),
  },
  {
    slug: "ptc-thermistor-relays", category: "Monitoring Devices", type: "multi", name: "PTC Thermistor Relays",
    categoryUrl: `${SITE}/product-category/monitoring-devices/ptc-thermistor-relays/`,
    productUrls: ["pt100", "single-phasing-relays", "temperature-monitoring"].map((s) => `${SITE}/products/monitoring-devices/ptc-thermistor-relays/${s}/`),
  },
  { slug: "liquid-level-monitoring-relays", category: "Monitoring Devices", type: "single", url: `${SITE}/products/monitoring-devices/liquid-level-monitoring-relays/liquid-level-controller-water-level-controller/` },
  { slug: "insulation-monitoring-relays", category: "Monitoring Devices", type: "single", url: `${SITE}/products/monitoring-devices/insulation-monitoring-relays/insulation-monitoring-relay/` },
  // ---- Timers ----
  {
    slug: "electronic-timer", category: "Timers", type: "multi", name: "Electronic Timer",
    categoryUrl: `${SITE}/product-category/timers/electronic-timer/`,
    productUrls: ["electronic-timer-series-micon-225", "electronic-timer-series-micon-175"].map((s) => `${SITE}/products/timers/electronic-timer/${s}/`),
  },
  { slug: "digital-timer", category: "Timers", type: "single", url: `${SITE}/products/timers/digital-timer/digital-timer-eliro/` },
  { slug: "brown-out-timers", category: "Timers", type: "single", url: `${SITE}/products/timers/brown-out-timers/brown-out-timers/` },
  // ---- Time Switches ----
  { slug: "analog-time-switch", category: "Time Switches", type: "single", url: `${SITE}/products/time-switches/analog-time-switch/time-switch-fm-series/` },
  {
    slug: "digital-time-switch", category: "Time Switches", type: "multi", name: "Digital Time Switch",
    categoryUrl: `${SITE}/product-category/time-switches/digital-time-switch/`,
    productUrls: [`${SITE}/products/time-switches/digital-time-switch/digital-time-switch-crono-pro/`, `${SITE}/products/time-switches/digital-time-switch-pulse/`],
  },
  { slug: "astronomical-time-switches", category: "Time Switches", type: "single", url: `${SITE}/products/time-switches/astronomical-time-switches/astronomical-time-switches/` },
  // ---- Hour Meters & Counters ----
  { slug: "digital-hour-meter-counter", category: "Hour Meters & Counters", type: "single", url: `${SITE}/products/hour-meters-and-counters/digital-hour-meter-counter/digital-hour-meter-counter/` },
  { slug: "digital-hour-meter", category: "Hour Meters & Counters", type: "single", url: `${SITE}/products/hour-meters-and-counters/digital-hour-meter/digital-hour-meter/` },
  { slug: "digital-pulse-counters", category: "Hour Meters & Counters", type: "single", url: `${SITE}/products/hour-meters-and-counters/digital-pulse-counters/digital-counters/` },
  {
    slug: "electromechanical-hour-meter", category: "Hour Meters & Counters", type: "multi", name: "Electromechanical Hour Meter",
    categoryUrl: `${SITE}/product-category/hour-meters-and-counters/electromechanical-hour-meter/`,
    productUrls: [`${SITE}/products/hour-meters-and-counters/electromechanical-hour-meter/hour-meter-series-hm-36/`, `${SITE}/products/hour-meters-and-counters/hour-meter-series-hr-26/`],
  },
  {
    slug: "impulse-counter", category: "Hour Meters & Counters", type: "multi", name: "Impulse Counter",
    categoryUrl: `${SITE}/product-category/hour-meters-and-counters/impulse-counter/`,
    productUrls: [`${SITE}/products/hour-meters-and-counters/impulse-counter/impulse-counter-series-cr-26/`, `${SITE}/products/hour-meters-and-counters/impulse-counter/impulse-counter-cr-18/`],
  },
  // ---- Phase Indicator ----
  { slug: "phase-indicator", category: "Phase Indicator", type: "single", url: `${SITE}/products/phase-indicator/phase-indicator/` },
  // ---- Alarm Annunciators ----
  { slug: "alarm-annunciators", category: "Alarm Annunciators", type: "single", url: `${SITE}/products/alarm-annunciators/alarm-annunciators/` },
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

async function getHtml(url, cacheKey) {
  const localFile = path.join(LOCAL_DIR, `${cacheKey}.html`);
  if (existsSync(localFile)) {
    console.log("   (using local file)");
    return readFileSync(localFile, "utf8");
  }
  const res = await fetch(url, { headers: HEADERS });
  const html = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
  return downloadTo(absUrl, IMG_DIR, filename, `/images/products/${BRAND}`);
}

const catalogueCache = new Map();
async function downloadCatalogue(absUrl) {
  if (catalogueCache.has(absUrl)) return catalogueCache.get(absUrl);
  const filename = slugify(decodeURIComponent(path.basename(new URL(absUrl).pathname)).replace(/\.pdf$/i, "")) + ".pdf";
  const local = await downloadTo(absUrl, CAT_DIR, filename, `/catalogues/${BRAND}`);
  catalogueCache.set(absUrl, local);
  return local;
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function pickImgUrl($el) {
  const raw = $el.attr("src") || $el.attr("data-src") || $el.attr("data-lazy-src");
  if (!raw || /^data:/i.test(raw)) return null;
  return raw;
}

// ---------- shared single-product extraction ----------
async function scrapeProduct(url, imgNamePrefix) {
  const html = await getHtml(url, slugify(url.replace(/^https?:\/\//, "")));
  const $ = cheerio.load(html);

  const name = $("h1").first().text().replace(/\s+/g, " ").trim();

  const shortDesc = $(".woocommerce-product-details__short-description");
  const subtitle = shortDesc.find("h2").first().text().replace(/\s+/g, " ").trim();
  const features = [];
  shortDesc.find("li").each((_, li) => {
    const t = $(li).text().replace(/\s+/g, " ").trim();
    if (t && !features.includes(t)) features.push(t);
  });

  const overview = [];
  if (subtitle && subtitle.toLowerCase() !== name.toLowerCase()) overview.push(subtitle);
  // most products use an h2 subtitle + h4 "Key Features" + ul layout, but some
  // (e.g. Alarm Annunciators) put plain marketing paragraphs directly in the
  // short-description with no subtitle/list at all — capture those too.
  shortDesc.find("p").each((_, p) => {
    if (overview.length >= 5) return;
    const t = $(p).text().replace(/\s+/g, " ").trim();
    if (t && t.length > 20 && !overview.includes(t)) overview.push(t);
  });
  $("#tab-description p").each((_, p) => {
    if (overview.length >= 5) return;
    const t = $(p).text().replace(/\s+/g, " ").trim();
    if (t && t.length > 20 && !overview.includes(t)) overview.push(t);
  });

  let image;
  const imgEl = $(".woocommerce-product-gallery img")
    .filter((_, el) => !!pickImgUrl($(el)))
    .first();
  const rawSrc = pickImgUrl(imgEl);
  if (rawSrc) {
    const abs = new URL(rawSrc, url).href;
    const ext = path.extname(new URL(abs).pathname) || ".jpg";
    image = await downloadImage(abs, `${imgNamePrefix}${ext}`);
  }

  let catalogue;
  const pdfLinks = $('a[href$=".pdf" i]').map((_, a) => $(a).attr("href")).get();
  const pdfHref = pdfLinks.find((h) => /\/catalog\//i.test(h)) || pdfLinks[0];
  if (pdfHref) {
    catalogue = await downloadCatalogue(new URL(pdfHref, url).href);
  }

  return { name, overview, features, image, catalogue };
}

async function scrapeSingle(src) {
  console.log("→", src.slug);
  const p = await scrapeProduct(src.url, src.slug);
  const entry = { slug: src.slug, name: p.name, category: src.category, overview: p.overview };
  if (p.image) entry.image = p.image;
  if (p.features.length) entry.benefits = p.features;
  if (p.catalogue) entry.catalogue = p.catalogue;
  console.log(`   overview:${p.overview.length} benefits:${p.features.length}${p.image ? " img✓" : ""}${p.catalogue ? " pdf✓" : ""}`);
  return entry;
}

async function scrapeMulti(src) {
  console.log("→", src.slug, `(${src.productUrls.length} variants)`);
  const catHtml = await getHtml(src.categoryUrl, slugify(src.categoryUrl.replace(/^https?:\/\//, "")));
  const $ = cheerio.load(catHtml);
  // The category archive's own <h1> is unreliable on thin subcategories (it
  // sometimes falls back to showing the first product's title instead of the
  // category name) — trust the catalog's own display name instead.
  const name = src.name;

  const term = $(".term-description");
  const overview = [];
  const benefits = [];
  term.find("p").each((_, p) => {
    if (overview.length >= 5) return;
    const t = $(p).text().replace(/\s+/g, " ").trim();
    if (t && t.length > 30 && !overview.includes(t)) overview.push(t);
  });
  term.find("li").each((_, li) => {
    const t = $(li).text().replace(/\s+/g, " ").trim();
    if (t && !benefits.includes(t)) benefits.push(t);
  });

  const variants = [];
  let firstVariantOverview = [];
  for (const purl of src.productUrls) {
    try {
      const p = await scrapeProduct(purl, `${src.slug}-${slugify(purl.replace(/\/$/, "").split("/").pop())}`);
      const variant = { name: p.name };
      if (p.image) variant.image = p.image;
      if (p.features.length) variant.features = p.features;
      if (p.catalogue) variant.catalogue = p.catalogue;
      variants.push(variant);
      if (!firstVariantOverview.length) firstVariantOverview = p.overview;
    } catch (e) {
      console.error("    variant FAILED:", purl, e.message);
    }
    await new Promise((r) => setTimeout(r, 400));
  }

  // The category page has no dedicated intro text on some thin subcategories
  // (no .term-description) — fall back to the first variant's own description.
  if (!overview.length) overview.push(...firstVariantOverview);
  if (!benefits.length && variants[0]?.features) benefits.push(...variants[0].features);

  const image = variants.find((v) => v.image)?.image;
  const entry = { slug: src.slug, name, category: src.category, overview };
  if (image) entry.image = image;
  if (benefits.length) entry.benefits = benefits.slice(0, 12);
  if (variants.length) entry.variants = variants;
  console.log(`   overview:${overview.length} benefits:${benefits.length} variants:${variants.length}${image ? " img✓" : ""}`);
  return entry;
}

const only = process.argv.find((a) => a.startsWith("--only="))?.split("=")[1];
const queue = only ? sources.filter((s) => s.slug === only) : sources;

const results = [];
for (const s of queue) {
  try {
    results.push(s.type === "multi" ? await scrapeMulti(s) : await scrapeSingle(s));
  } catch (e) {
    console.error("   FAILED:", e.message);
  }
  await new Promise((r) => setTimeout(r, 500));
}

let out = results;
if (existsSync(OUT_FILE)) {
  const prev = JSON.parse(readFileSync(OUT_FILE, "utf8"));
  const bySlug = new Map(prev.map((p) => [p.slug, p]));
  for (const r of results) bySlug.set(r.slug, r);
  out = [...bySlug.values()];
}

writeFileSync(OUT_FILE, JSON.stringify(out, null, 2) + "\n");
console.log(`\nDone: ${results.length} scraped → ${OUT_FILE} (${out.length} total)`);
