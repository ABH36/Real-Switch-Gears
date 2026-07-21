import * as cheerio from "cheerio";
import { mkdirSync, writeFileSync, readFileSync, existsSync, createWriteStream } from "fs";
import { Readable } from "stream";
import path from "path";

const BRAND = "polycab";
const IMG_DIR = `public/images/products/${BRAND}`;
const OUT_FILE = `src/data/catalog/${BRAND}.products.json`;
const LOCAL_DIR = `scripts/html/${BRAND}`;
const SITE = "https://polycab.com";

// polycab.com is a server-rendered catalog site (not a static brochure site like
// Braco/Esbee). Every category ("consumer") listing page — e.g. /wires/polycab-green-wireplus/c
// — renders product-size/colour cards individually (one card per SKU), so a family like
// "Polycab Green Wire+" shows 30+ near-identical cards that only differ by size/length/colour.
// Rather than importing every SKU as its own product (which is what the site itself does),
// each listing page's cards are grouped by their shared product-card title; within a group the
// per-card size/length/colour lines are merged into one deduplicated "Available options" line on
// the resulting single ProductDetail. This mirrors the user's ask: real product families/models,
// not one entry per size.
//
// "Cables by Type" (the Industries section) uses a different template (`cables-prod-card`) where
// each card is already a genuinely distinct cable model (no size explosion), so grouping mostly
// yields one-to-one entries there.
//
// Both listing templates lazy-load past the first 12 cards via a "Load More" button that calls a
// GET JSON/HTML-partial endpoint (found in /js/category.js and /js/cables.js); calling that
// endpoint directly with a large pageSize returns every card in one request instead of paginating:
//   consumer:      /Products/GetProductsGridPartial?categorySlug={slug}&pageSize=500&pageNumber=1
//   cables-by-type: /Products/GetCablesGridPartialByProductTypeSlug?productTypeSlug={slug}&pageSize=500&pageNumber=1
//
// "Cables by Application" and "Cables by Standards" were left out: spot-checking showed they list
// the same underlying cable products as "Cables by Type", just filtered a different way, so scraping
// them too would only produce duplicate entries.

const consumerSources = [
  // ---- Wires ----
  { slug: "green-wireplus", family: "House Wires", category: "Wires", name: "Polycab Green Wire+", categorySlug: "polycab-green-wireplus" },
  { slug: "suprema-house-wires", family: "House Wires", category: "Wires", name: "PolycabSuprema E-Beam Wire", categorySlug: "polycabsuprema-house-wires" },
  { slug: "optima-plus", family: "House Wires", category: "Wires", name: "PolycabOptima+", categorySlug: "polycaboptima-plus" },
  { slug: "primma-house-wires", family: "House Wires", category: "Wires", name: "PolycabPrimma", categorySlug: "polycabprimma-house-wires" },
  { slug: "wires-etira", family: "House Wires", category: "Wires", name: "Etira", categorySlug: "etira-house-wires" },
  { slug: "greenwire-180m", family: "180 Meter Wires", category: "Wires", name: "Greenwire 180M", categorySlug: "greenwire-180m" },
  { slug: "lf-fr-180m", family: "180 Meter Wires", category: "Wires", name: "Polycab LF FR 180M", categorySlug: "polycab-lf-fr-180m" },
  // ---- Fans ----
  { slug: "ceiling-fan", family: "Fans", category: "Fans", name: "Ceiling Fan", categorySlug: "ceiling-fan" },
  { slug: "table-fan", family: "Fans", category: "Fans", name: "Table Fan", categorySlug: "table-fan" },
  { slug: "wall-fan", family: "Fans", category: "Fans", name: "Wall Fan", categorySlug: "wall-fan" },
  { slug: "pedestal-fan", family: "Fans", category: "Fans", name: "Pedestal Fan", categorySlug: "pedestal-fan" },
  { slug: "exhaust-fan", family: "Fans", category: "Fans", name: "Exhaust Fan", categorySlug: "exhaust-fan" },
  { slug: "air-circulator", family: "Fans", category: "Fans", name: "Air Circulator", categorySlug: "air-circulator" },
  { slug: "farrata-fan", family: "Fans", category: "Fans", name: "Farrata Fan", categorySlug: "farrata-fan" },
  // ---- Lighting ----
  { slug: "led-bulb", family: "Lighting", category: "Lighting", name: "LED Bulb", categorySlug: "led-bulb" },
  { slug: "downlight", family: "Lighting", category: "Lighting", name: "Downlight", categorySlug: "downlight" },
  { slug: "panel-light", family: "Lighting", category: "Lighting", name: "Panel Light", categorySlug: "panel-light" },
  { slug: "led-batten", family: "Lighting", category: "Lighting", name: "LED Batten", categorySlug: "led-batten" },
  { slug: "outdoor-lights", family: "Lighting", category: "Lighting", name: "Outdoor Lights", categorySlug: "outdoor-lights" },
  { slug: "rope-strip-lights", family: "Lighting", category: "Lighting", name: "Rope and Strip Lights", categorySlug: "rope-and-strip-lights" },
  { slug: "led-cob", family: "Lighting", category: "Lighting", name: "LED COB", categorySlug: "led-cob" },
  // ---- Switches and Accessories ----
  { slug: "levana", family: "Switches and Accessories", category: "Switches and Accessories", name: "Levana", categorySlug: "levana" },
  { slug: "switches-etira", family: "Switches and Accessories", category: "Switches and Accessories", name: "Etira", categorySlug: "etira" },
  { slug: "plastic-modular-boxes", family: "Switches and Accessories", category: "Switches and Accessories", name: "Plastic Modular Boxes", categorySlug: "plastic-modular-boxes" },
  { slug: "switch-accessories", family: "Switches and Accessories", category: "Switches and Accessories", name: "Accessories", categorySlug: "accessories" },
  // ---- Water Heaters ----
  { slug: "instant-water-heater", family: "Water Heaters", category: "Water Heaters", name: "Instant Water Heater", categorySlug: "instant-water-heater" },
  { slug: "storage-water-heater", family: "Water Heaters", category: "Water Heaters", name: "Storage Water Heater", categorySlug: "storage-water-heater" },
  // ---- Switchgear ----
  { slug: "mcb", family: "Switchgear", category: "Switchgear", name: "MCB", categorySlug: "mcb" },
  { slug: "rccb", family: "Switchgear", category: "Switchgear", name: "RCCB", categorySlug: "rccb" },
  { slug: "rcbo", family: "Switchgear", category: "Switchgear", name: "RCBO", categorySlug: "rcbo" },
  { slug: "isolator", family: "Switchgear", category: "Switchgear", name: "Isolator", categorySlug: "isolator" },
  { slug: "accl", family: "Switchgear", category: "Switchgear", name: "ACCL", categorySlug: "accl" },
  { slug: "mcb-changeover-switch", family: "Switchgear", category: "Switchgear", name: "MCB Changeover Switch", categorySlug: "mcb-changeover-switch" },
  { slug: "distribution-board", family: "Switchgear", category: "Switchgear", name: "Distribution Board", categorySlug: "distribution-board" },
];

const cableTypeSources = [
  { slug: "lv-power-cable", family: "LV Power Cable", category: "Cables by Type", name: "LV Power Cable", productTypeSlug: "lv-power-cable" },
  { slug: "instrumentation-cable", family: "Instrumentation Cable", category: "Cables by Type", name: "Instrumentation Cable", productTypeSlug: "instrumentation-cable" },
  { slug: "communication-data-cable", family: "Communication & Data Cable", category: "Cables by Type", name: "Communication & Data Cable", productTypeSlug: "communication-data-cable" },
  { slug: "renewable-energy-cable", family: "Renewable Energy", category: "Cables by Type", name: "Renewable Energy", productTypeSlug: "renewable-energy" },
  { slug: "mv-power-cable", family: "MV Power Cable", category: "Cables by Type", name: "MV Power Cable", productTypeSlug: "mv-power-cable" },
  { slug: "ehv-power-cable", family: "EHV Power Cable", category: "Cables by Type", name: "EHV Power Cable", productTypeSlug: "ehv-power-cable" },
];

mkdirSync(IMG_DIR, { recursive: true });
mkdirSync(LOCAL_DIR, { recursive: true });

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "X-Requested-With": "XMLHttpRequest",
};

async function getHtml(url, cacheKey) {
  const localFile = path.join(LOCAL_DIR, `${cacheKey}.html`);
  if (existsSync(localFile)) return readFileSync(localFile, "utf8");
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: HEADERS });
      const html = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      writeFileSync(localFile, html);
      return html;
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 700 * (attempt + 1)));
    }
  }
  throw lastErr;
}

async function downloadImage(absUrl, filename) {
  const dest = path.join(IMG_DIR, filename);
  if (existsSync(dest)) return `/images/products/${BRAND}/${filename}`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(absUrl, { headers: HEADERS });
      if (!res.ok) return null;
      await new Promise((resolve, reject) => {
        const ws = createWriteStream(dest);
        Readable.fromWeb(res.body).pipe(ws).on("finish", resolve).on("error", reject);
      });
      return `/images/products/${BRAND}/${filename}`;
    } catch {
      await new Promise((r) => setTimeout(r, 700 * (attempt + 1)));
    }
  }
  return null;
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function cleanText(t) {
  return (t || "").replace(/\s+/g, " ").trim();
}

// splits a `.prod-card__desc p`'s inner HTML on <br> into individual option lines
function splitDescLines($, $p) {
  return ($p.html() || "")
    .split(/<br\s*\/?>/i)
    .map((seg) => cleanText(cheerio.load(`<span>${seg}</span>`)("span").text()))
    .filter(Boolean);
}

function extractProdId(href) {
  return (href.match(/\/p-(\d+)/) || [, href])[1];
}

// turns a group's raw per-card option lines (e.g. "6 Sq. MM", "0.75 Sq. MM", "90 Meters")
// into a proper "min–max" range per numeric attribute instead of a flat duplicate-y list —
// lines that don't start with a number (pole codes, colours, ...) are kept as a plain list.
function summarizeOptions(optionSet) {
  const numBuckets = new Map(); // unit-suffix (e.g. " Sq. MM", "mm Sweep") -> numeric values seen
  const otherValues = [];

  for (const line of optionSet) {
    const m = line.match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (m) {
      const value = parseFloat(m[1]);
      const suffix = m[2];
      if (!numBuckets.has(suffix)) numBuckets.set(suffix, []);
      numBuckets.get(suffix).push(value);
    } else {
      otherValues.push(line);
    }
  }

  const sizeRanges = [...numBuckets.entries()]
    .sort((a, b) => Math.min(...a[1]) - Math.min(...b[1]))
    .map(([suffix, values]) => {
      const min = Math.min(...values);
      const max = Math.max(...values);
      return min === max ? `${min}${suffix}` : `${min}–${max}${suffix}`;
    });

  return { sizeRanges, otherValues: otherValues.sort() };
}

// ---------- listing discovery: group cards by title, merge per-card option lines ----------
async function discoverConsumerGroups(src) {
  const url = `${SITE}/Products/GetProductsGridPartial?categorySlug=${src.categorySlug}&sortOrder=NameAscending&pageSize=500&pageNumber=1`;
  const html = await getHtml(url, `consumer-${src.slug}`);
  const $ = cheerio.load(html);
  const groups = new Map(); // title -> { href, options: Set }

  $("a[data-prod-key]").each((_, a) => {
    const $a = $(a);
    const href = ($a.attr("href") || "").split("?")[0];
    const title = cleanText($a.find(".prod-card__title").first().text());
    if (!href || !title) return;
    if (!groups.has(title)) groups.set(title, { href, options: new Set() });
    const g = groups.get(title);
    $a.find(".prod-card__desc p").each((__, p) => {
      for (const line of splitDescLines($, $(p))) g.options.add(line);
    });
  });
  return groups;
}

async function discoverCableGroups(src) {
  const url = `${SITE}/Products/GetCablesGridPartialByProductTypeSlug?productTypeSlug=${src.productTypeSlug}&sortOrder=NameAscending&pageSize=500&pageNumber=1`;
  const html = await getHtml(url, `cable-${src.slug}`);
  const $ = cheerio.load(html);
  const groups = new Map();

  $(".cables-prod-card a").each((_, a) => {
    const $a = $(a);
    const href = ($a.attr("href") || "").split("?")[0];
    const title = cleanText($a.find(".cables-prod-card__title").first().text());
    if (!href || !title) return;
    if (!groups.has(title)) groups.set(title, { href, options: new Set() });
  });
  return groups;
}

// ---------- representative product-detail page ----------
async function scrapeConsumerPdp(href, cacheKey) {
  const url = `${SITE}${href}`;
  const html = await getHtml(url, cacheKey);
  const $ = cheerio.load(html);

  const subtitle = cleanText($(".prod__subtitle").first().text());
  const description = cleanText($("section.prod__desc p.section__desc").first().text());
  const highlights = $(".prod__highlights li")
    .map((_, li) => cleanText($(li).text()))
    .get()
    .filter(Boolean);

  const imgSrc = $(".prod-images img.product-image").first().attr("src");
  return { subtitle, description, highlights, imgSrc };
}

async function scrapeCablePdp(href, cacheKey) {
  const url = `${SITE}${href}`;
  const html = await getHtml(url, cacheKey);
  const $ = cheerio.load(html);

  const shortDesc = cleanText($(".prod__short").first().text());
  const longDesc = cleanText($(".prod__longdesc").first().text());
  const highlights = $(".prod__highlight")
    .map((_, p) => cleanText($(p).text()))
    .get()
    .filter(Boolean);
  const attrLines = [];
  $(".prod__feature .feature").each((_, f) => {
    const title = cleanText($(f).find(".feature__title").first().text());
    const body = cleanText($(f).find(".feature__body").first().text());
    if (title && body) attrLines.push(`${title}: ${body}`);
  });

  const imgSrc = $(".prod-images img.product-image").first().attr("src");
  const pdf = $(".prod__pdf a").first().attr("href");
  return { shortDesc, longDesc, highlights, attrLines, imgSrc, pdf };
}

async function buildConsumerEntries(src) {
  const groups = await discoverConsumerGroups(src);
  console.log("→", src.slug, `(${groups.size} model(s), from ${[...groups.values()].length} groups)`);
  const entries = [];
  for (const [title, g] of groups) {
    try {
      const prodId = extractProdId(g.href);
      const cacheKey = `consumer-pdp-${src.slug}-${prodId}`;
      const p = await scrapeConsumerPdp(g.href, cacheKey);

      const overview = [];
      if (p.subtitle) overview.push(p.subtitle);
      if (p.description) overview.push(p.description);
      const { sizeRanges, otherValues } = summarizeOptions(g.options);
      if (sizeRanges.length) overview.push(`Available Size: ${sizeRanges.join(", ")}`);
      if (otherValues.length) overview.push(`Available options: ${otherValues.join(", ")}`);

      const entry = {
        slug: slugify(title),
        name: title,
        category: src.category,
        family: src.family,
        overview,
      };
      if (p.highlights.length) entry.benefits = p.highlights;
      if (p.imgSrc) {
        const ext = path.extname(new URL(p.imgSrc).pathname) || ".jpg";
        const img = await downloadImage(p.imgSrc, `${src.slug}-${slugify(title)}${ext}`);
        if (img) entry.image = img;
      }
      entries.push(entry);
    } catch (e) {
      console.error("    model FAILED:", title, e.message);
    }
    await new Promise((r) => setTimeout(r, 180));
  }
  return entries;
}

async function buildCableEntries(src) {
  const groups = await discoverCableGroups(src);
  console.log("→", src.slug, `(${groups.size} model(s))`);
  const entries = [];
  for (const [title, g] of groups) {
    try {
      const prodId = extractProdId(g.href);
      const cacheKey = `cable-pdp-${src.slug}-${prodId}`;
      const p = await scrapeCablePdp(g.href, cacheKey);

      const overview = [];
      if (p.shortDesc) overview.push(p.shortDesc);
      if (p.longDesc && p.longDesc !== p.shortDesc) overview.push(p.longDesc);

      const entry = {
        slug: slugify(title),
        name: title,
        category: src.category,
        family: src.family,
        overview,
      };
      const benefits = [...p.highlights, ...p.attrLines];
      if (benefits.length) entry.benefits = benefits;
      if (p.pdf) entry.catalogue = p.pdf;
      if (p.imgSrc) {
        const ext = path.extname(new URL(p.imgSrc).pathname) || ".jpg";
        const img = await downloadImage(p.imgSrc, `${src.slug}-${slugify(title)}${ext}`);
        if (img) entry.image = img;
      }
      entries.push(entry);
    } catch (e) {
      console.error("    model FAILED:", title, e.message);
    }
    await new Promise((r) => setTimeout(r, 180));
  }
  return entries;
}

const only = process.argv.find((a) => a.startsWith("--only="))?.split("=")[1];
const consumerQueue = only ? consumerSources.filter((s) => s.slug === only) : consumerSources;
const cableQueue = only ? cableTypeSources.filter((s) => s.slug === only) : cableTypeSources;

const results = [];
for (const s of consumerQueue) {
  try {
    results.push(...(await buildConsumerEntries(s)));
  } catch (e) {
    console.error("   FAILED:", s.slug, e.message);
  }
  await new Promise((r) => setTimeout(r, 300));
}
for (const s of cableQueue) {
  try {
    results.push(...(await buildCableEntries(s)));
  } catch (e) {
    console.error("   FAILED:", s.slug, e.message);
  }
  await new Promise((r) => setTimeout(r, 300));
}

// de-dupe by slug (disambiguate genuine collisions by suffixing the source family slug)
const bySlug = new Map();
for (const r of results) {
  if (bySlug.has(r.slug) && bySlug.get(r.slug).name !== r.name) {
    r.slug = `${r.slug}-${slugify(r.family)}`;
  }
  bySlug.set(r.slug, r);
}

let out = [...bySlug.values()];
if (existsSync(OUT_FILE) && !only) {
  writeFileSync(OUT_FILE, JSON.stringify(out, null, 2) + "\n");
} else if (existsSync(OUT_FILE)) {
  const prev = JSON.parse(readFileSync(OUT_FILE, "utf8"));
  const merged = new Map(prev.map((p) => [p.slug, p]));
  for (const r of out) merged.set(r.slug, r);
  out = [...merged.values()];
  writeFileSync(OUT_FILE, JSON.stringify(out, null, 2) + "\n");
} else {
  writeFileSync(OUT_FILE, JSON.stringify(out, null, 2) + "\n");
}

console.log(`\nDone: ${results.length} scraped → ${OUT_FILE} (${out.length} total)`);
