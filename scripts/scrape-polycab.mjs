import * as cheerio from "cheerio";
import { mkdirSync, writeFileSync, readFileSync, existsSync, createWriteStream } from "fs";
import { Readable } from "stream";
import path from "path";

const BRAND = "polycab";
const IMG_DIR = `public/images/products/${BRAND}`;
const OUT_FILE = `src/data/catalog/${BRAND}.products.json`;
const CATALOG_FILE = `src/data/catalog/${BRAND}.catalog.json`;
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
// "Cables by Application" is scraped too (see applicationSources below) but shares a lot of its
// underlying cable catalog with "Cables by Type" — the de-dupe step near the bottom of this file
// keeps a product under whichever, more specific category it was already catalogued under and
// only lets genuinely new products in through the application listings.
// "Cables by Standards" (see standardSources below) is scraped the same way as applications —
// it lists the same underlying cable products again, just filtered by IS/international standard,
// so it's treated as another "sighting" source that only contributes genuinely new products.

// Only "Wires" is carried from Polycab's Consumers menu (Fans, Lighting, Switches and
// Accessories, Water Heaters, and consumer Switchgear are out of scope for this distributor
// site), and it's surfaced directly as "House Wire" rather than nested under a "Wires" category.
const consumerSources = [
  // ---- House Wire ----
  { slug: "green-wireplus", family: "House Wires", category: "House Wire", name: "Polycab Green Wire+", categorySlug: "polycab-green-wireplus" },
  { slug: "suprema-house-wires", family: "House Wires", category: "House Wire", name: "PolycabSuprema E-Beam Wire", categorySlug: "polycabsuprema-house-wires" },
  { slug: "optima-plus", family: "House Wires", category: "House Wire", name: "PolycabOptima+", categorySlug: "polycaboptima-plus" },
  { slug: "primma-house-wires", family: "House Wires", category: "House Wire", name: "PolycabPrimma", categorySlug: "polycabprimma-house-wires" },
  { slug: "wires-etira", family: "House Wires", category: "House Wire", name: "Etira", categorySlug: "etira-house-wires" },
  { slug: "greenwire-180m", family: "180 Meter Wires", category: "House Wire", name: "Greenwire 180M", categorySlug: "greenwire-180m" },
  { slug: "lf-fr-180m", family: "180 Meter Wires", category: "House Wire", name: "Polycab LF FR 180M", categorySlug: "polycab-lf-fr-180m" },
];

// "Cables by Type" is the Industries section; its "Renewable Energy" family is surfaced
// separately as the "Renewables" category (labelled "Solar Cables"), matching the site's own
// Industries > Renewables > Solar Cables grouping instead of nesting it under Cables by Type.
const cableTypeSources = [
  { slug: "lv-power-cable", family: "LV Power Cable", category: "Cables by Type", name: "LV Power Cable", productTypeSlug: "lv-power-cable" },
  { slug: "instrumentation-cable", family: "Instrumentation Cable", category: "Cables by Type", name: "Instrumentation Cable", productTypeSlug: "instrumentation-cable" },
  { slug: "communication-data-cable", family: "Communication & Data Cable", category: "Cables by Type", name: "Communication & Data Cable", productTypeSlug: "communication-data-cable" },
  // same productTypeSlug as solarSources' "renewable-energy-cable" below — real site lists this
  // identical cable set under two different nav labels ("Renewable Energy" here vs "Solar Cables"
  // under Renewables), so it's scraped twice on purpose, once per family/category.
  { slug: "renewable-energy-cable-type", family: "Renewable Energy", category: "Cables by Type", name: "Renewable Energy", productTypeSlug: "renewable-energy" },
  { slug: "mv-power-cable", family: "MV Power Cable", category: "Cables by Type", name: "MV Power Cable", productTypeSlug: "mv-power-cable" },
  { slug: "ehv-power-cable", family: "EHV Power Cable", category: "Cables by Type", name: "EHV Power Cable", productTypeSlug: "ehv-power-cable" },
];

// "Others" (under Cables by Type) isn't a flat listing on the real site — /cables/types/others is
// itself a submenu of 11 further cable types, each with its own productTypeSlug and real product
// grid. Scraped into a synthetic "Cables by Type — Others" category so polycab.ts can nest it as
// an "Others" child group under the Cables by Type node without disturbing that node's own six
// direct sections above.
const othersCableTypeSources = [
  { slug: "others-control-cable", family: "Control Cable", category: "Cables by Type — Others", name: "Control Cable", productTypeSlug: "control-cable" },
  { slug: "others-fire-protection-cable", family: "Fire Protection Cable", category: "Cables by Type — Others", name: "Fire Protection Cable", productTypeSlug: "fire-protection-cable" },
  { slug: "others-industrial-cable", family: "Industrial Cable", category: "Cables by Type — Others", name: "Industrial Cable", productTypeSlug: "industrial-cable" },
  { slug: "others-rubber-cable", family: "Rubber Cable", category: "Cables by Type — Others", name: "Rubber Cable", productTypeSlug: "rubber-cable" },
  { slug: "others-marine-offshoreonshore-cable", family: "Marine (Offshore/Onshore) Cable", category: "Cables by Type — Others", name: "Marine (Offshore/Onshore) Cable", productTypeSlug: "marine-offshoreonshore-cable" },
  { slug: "others-high-temperature-cable", family: "High Temperature Cable", category: "Cables by Type — Others", name: "High Temperature Cable", productTypeSlug: "high-temperature-cable" },
  { slug: "others-defence", family: "Defence", category: "Cables by Type — Others", name: "Defence", productTypeSlug: "defence" },
  { slug: "others-domestic-appliance-and-lighting-cable", family: "Domestic Appliance and Lighting Cable", category: "Cables by Type — Others", name: "Domestic Appliance and Lighting Cable", productTypeSlug: "domestic-appliance-and-lighting-cable" },
  { slug: "others-building-wires", family: "Building Wires", category: "Cables by Type — Others", name: "Building Wires", productTypeSlug: "building-wires" },
  { slug: "others-special-cable", family: "Special Cable", category: "Cables by Type — Others", name: "Special Cable", productTypeSlug: "special-cable" },
  { slug: "others-aerial-bunched-cable", family: "Aerial Bunched Cable", category: "Cables by Type — Others", name: "Aerial Bunched Cable", productTypeSlug: "aerial-bunched-cable" },
];

// "Cables by Standards" — like "Others" above, the two standard groups (/cables/standards/indian-
// standards-is, /cables/standards/international-standards) aren't direct listings either; each is
// a submenu of individual IS/international codes, and GetCablesGridPartialByStandardSlug takes
// that code (e.g. "is-694", "ul-1072"), not the group slug. Spot-checking confirms the scraper's
// original note: these codes re-list cable products already catalogued under Cables by Type /
// Others, so they're scraped like applicationSources — discovery + de-dupe, no wasted duplicate
// detail records. Scraped into two synthetic categories so polycab.ts can nest both groups under
// one "Cables by Standards" node.
const isStandardCodes = {
  "is-7098-i": "IS 7098-I",
  "is-17048": "IS 17048",
  "is-694": "IS 694",
  "is-9968-1": "IS 9968-1",
  "is-7098-ii": "IS 7098-II",
  "is-9968-2": "IS 9968-2",
  "is-14255": "IS 14255",
  "polycab-standard": "Polycab standard",
  "is-9857": "IS 9857",
};
const intlStandardCodes = {
  "bsen-50288-7": "BSEN 50288-7",
  "bs-5467": "BS 5467",
  "polycab-standard": "Polycab Standard",
  "iec-60227-7": "IEC 60227-7",
  "bsen-50525-2-21": "BSEN 50525-2-21",
  "bs-6231": "BS 6231",
  "ul-83": "UL 83",
  "ul-44": "UL 44",
  "ul-4703": "UL 4703",
  "ul-854": "UL 854",
  "ul-1569": "UL 1569",
  "bs-7846": "BS 7846",
  "bs-7629-1": "BS 7629-1",
  "bs-8592": "BS 8592",
  "bs-7211": "BS 7211",
  "bs-6724": "BS 6724",
  "iec-60092-353": "IEC 60092-353",
  "iec-60092-354": "IEC 60092-354",
  "bsen-50525-3-11": "BSEN 50525-3-11",
  "bsen-50525-2-11": "BSEN 50525-2-11",
  "bsen-50525-3-41": "BSEN 50525-3-41",
  "bsen-50525-2-41": "BSEN 50525-2-41",
  "bs-7835": "BS 7835",
  "ul-1596": "UL 1596",
  "ul-1277": "UL 1277",
  "ul-493": "UL 493",
  "ul-719": "UL 719",
  "ul-62": "UL 62",
  "bs-6622": "BS 6622",
  "bs-7870-4-10": "BS 7870-4-10",
  "iec-60092-376": "IEC 60092-376",
  "asnzs-14291": "AS/NZS 1429.1",
  "ansiicea-s-93-639": "ANSI/ICEA S-93-639",
  "iec-60502-1": "IEC 60502-1",
  "ieee-1580": "IEEE 1580",
  "bsen-50525-2-31": "BSEN 50525-2-31",
  "iec-60840": "IEC 60840",
  "icea-s-108-720": "ICEA S-108-720",
  "ul-1072": "UL 1072",
  "icea-s-97-682": "ICEA S-97-682",
  "ansinema-wc-74icea-s-93-639": "ANSI/NEMA WC 74/ICEA S-93-639",
  "bs-7870-4-20": "BS 7870-4-20",
  "iec-60502-2": "IEC 60502-2",
  "icea-s-93-639": "ICEA S-93-639",
  "bs-6004": "BS 6004",
  "ul-2250": "UL 2250",
  "as-nzs-5000": "AS NZS 5000",
  "bsen-50618": "BSEN 50618",
  "bs-en-50525-2-51": "BS EN 50525-2-51",
  "bsen-50525-2-81": "BSEN 50525-2-81",
  "ansiscte-74": "ANSI/SCTE 74",
  "rs-485": "RS 485",
};
const standardSources = [
  ...Object.entries(isStandardCodes).map(([code, label]) => ({
    slug: `standard-is-${code}`,
    family: label,
    category: "Cables by Standards — Indian Standards (IS)",
    name: label,
    standardSlug: code,
  })),
  ...Object.entries(intlStandardCodes).map(([code, label]) => ({
    slug: `standard-intl-${code}`,
    family: label,
    category: "Cables by Standards — International Standards",
    name: label,
    standardSlug: code,
  })),
];

// "Cables by Application" — surfaced directly as their own top-level categories
// (Building infrastructure, Energy and Power Grid, Manufacturing industries, Mobility
// infrastructure) rather than nested under "Cables by Application". Uses
// GetCablesGridPartialByApplicationSlug (found in /js/cables.js) — same partial-grid /
// PDP templates as Cables by Type, just filtered by "application" entity instead of
// "product type". "Solar Cables" is scraped via productTypeSlug=renewable-energy (see
// cableTypeSources note below) and surfaced as its own flat top-level category too.
const applicationSources = [
  { slug: "residential", family: "Residential", category: "Building infrastructure", name: "Residential", applicationSlug: "residential" },
  { slug: "datacenters", family: "Datacenters", category: "Building infrastructure", name: "Datacenters", applicationSlug: "datacenters" },
  { slug: "telecommunication", family: "Telecommunication", category: "Building infrastructure", name: "Telecommunication", applicationSlug: "telecommunication" },
  { slug: "commercial", family: "Commercial", category: "Building infrastructure", name: "Commercial", applicationSlug: "commercial" },
  { slug: "it-industry", family: "IT Industry", category: "Building infrastructure", name: "IT Industry", applicationSlug: "it-industry" },

  { slug: "power-network", family: "Power & Network", category: "Energy and Power Grid", name: "Power & Network", applicationSlug: "power-network" },
  { slug: "utility", family: "Utility", category: "Energy and Power Grid", name: "Utility", applicationSlug: "utility" },
  { slug: "app-renewable-energy", family: "Renewable Energy", category: "Energy and Power Grid", name: "Renewable Energy", applicationSlug: "renewable-energy" },
  { slug: "service-entrance", family: "Service Entrance", category: "Energy and Power Grid", name: "Service Entrance", applicationSlug: "service-entrance" },

  { slug: "automation-process-control", family: "Automation & Process Control", category: "Manufacturing industries", name: "Automation & Process Control", applicationSlug: "automation-process-control" },
  { slug: "healthcare", family: "Healthcare", category: "Manufacturing industries", name: "Healthcare", applicationSlug: "healthcare" },
  { slug: "food-beverages", family: "Food & Beverages", category: "Manufacturing industries", name: "Food & Beverages", applicationSlug: "food-beverages" },
  { slug: "water-treatment-and-waste-disposal", family: "Water Treatment and Waste Disposal", category: "Manufacturing industries", name: "Water Treatment and Waste Disposal", applicationSlug: "water-treatment-and-waste-disposal" },
  { slug: "cement-industry", family: "Cement Industry", category: "Manufacturing industries", name: "Cement Industry", applicationSlug: "cement-industry" },
  { slug: "metal-industry", family: "Metal Industry", category: "Manufacturing industries", name: "Metal Industry", applicationSlug: "metal-industry" },
  { slug: "sugar-industry", family: "Sugar Industry", category: "Manufacturing industries", name: "Sugar Industry", applicationSlug: "sugar-industry" },
  { slug: "pharmaceutical-industry", family: "Pharmaceutical Industry", category: "Manufacturing industries", name: "Pharmaceutical Industry", applicationSlug: "pharmaceutical-industry" },

  { slug: "mass-transit-railways-marine", family: "Mass Transit (Railways & Marine)", category: "Mobility infrastructure", name: "Mass Transit (Railways & Marine)", applicationSlug: "mass-transit-railways-marine" },
  { slug: "defence-armaments-industry", family: "Defence & Armaments Industry", category: "Mobility infrastructure", name: "Defence & Armaments Industry", applicationSlug: "defence-armaments-industry" },
  { slug: "aerospace-industry", family: "Aerospace Industry", category: "Mobility infrastructure", name: "Aerospace Industry", applicationSlug: "aerospace-industry" },
];

// scraped directly as its own flat top-level category (family === category, same
// pattern as "House Wire") rather than nested under "Cables by Type" or "Renewables".
const solarSources = [
  { slug: "renewable-energy-cable", family: "Solar Cables", category: "Solar Cables", name: "Renewable Energy", productTypeSlug: "renewable-energy" },
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
  return parseCableGroups(html);
}

async function discoverApplicationGroups(src) {
  const url = `${SITE}/Products/GetCablesGridPartialByApplicationSlug?applicationSlug=${src.applicationSlug}&sortOrder=NameAscending&pageSize=500&pageNumber=1`;
  const html = await getHtml(url, `application-${src.slug}`);
  return parseCableGroups(html);
}

async function discoverStandardGroups(src) {
  const url = `${SITE}/Products/GetCablesGridPartialByStandardSlug?standardSlug=${src.standardSlug}&sortOrder=NameAscending&pageSize=500&pageNumber=1`;
  const html = await getHtml(url, `standard-${src.slug}`);
  return parseCableGroups(html);
}

function parseCableGroups(html) {
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

async function buildCableEntries(src, discoverFn = discoverCableGroups, knownNames = null) {
  const groups = await discoverFn(src);
  console.log("→", src.slug, `(${groups.size} model(s))`);
  const entries = [];
  for (const [title, g] of groups) {
    // "Cables by Standards" re-lists hundreds of already-scraped cable products (see
    // standardSources comment) — skip the PDP fetch entirely for a title we already have full
    // detail for, and just record a stub sighting; buildCatalogTree resolves it to the existing
    // canonical slug via `byName` regardless of what's in this stub.
    if (knownNames && knownNames.has(title)) {
      entries.push({ slug: slugify(title), name: title, category: src.category, family: src.family, overview: [] });
      continue;
    }
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

// --only accepts a comma-separated list of source slugs (or the literal "standards" shorthand for
// every standardSources entry) so a targeted re-scrape doesn't have to be one slug per invocation.
const onlyArg = process.argv.find((a) => a.startsWith("--only="))?.split("=")[1];
const only = onlyArg ? new Set(onlyArg.split(",")) : null;
const wantsAllStandards = only?.has("standards") ?? false;
const consumerQueue = only ? consumerSources.filter((s) => only.has(s.slug)) : consumerSources;
const cableQueue = only ? cableTypeSources.filter((s) => only.has(s.slug)) : cableTypeSources;
const othersCableTypeQueue = only ? othersCableTypeSources.filter((s) => only.has(s.slug)) : othersCableTypeSources;
const solarQueue = only ? solarSources.filter((s) => only.has(s.slug)) : solarSources;
const applicationQueue = only ? applicationSources.filter((s) => only.has(s.slug)) : applicationSources;
const standardQueue = only ? standardSources.filter((s) => wantsAllStandards || only.has(s.slug)) : standardSources;

const results = [];
for (const s of consumerQueue) {
  try {
    results.push(...(await buildConsumerEntries(s)));
  } catch (e) {
    console.error("   FAILED:", s.slug, e.message);
  }
  await new Promise((r) => setTimeout(r, 300));
}
for (const s of [...cableQueue, ...othersCableTypeQueue, ...solarQueue]) {
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
const byName = new Map([...bySlug.values()].map((p) => [p.name, p]));
// on a partial (--only) run, `results` won't contain the other already-scraped products, so pull
// in the existing file too — otherwise a re-listing source (application/standard) scraped in
// isolation can't tell it has already seen a product and will duplicate a full detail record for it.
if (only && existsSync(OUT_FILE)) {
  for (const p of JSON.parse(readFileSync(OUT_FILE, "utf8"))) {
    if (!byName.has(p.name)) byName.set(p.name, p);
  }
}

// "Cables by Application" heavily re-lists cables already catalogued under Cables by Type
// / Solar Cables / House Wire (e.g. every "Utility" product turned out to be an existing MV/EHV
// Power Cable). A product can still only get ONE full detail record — the de-dupe below keeps
// that under whichever source found it first — but every sighting is kept in the *catalog nav
// tree* (see buildCatalogTree), pointing back at that one canonical slug, so e.g. "Manufacturing
// industries > Healthcare" still lists and links to the same product page "Cables by Type" does.
const applicationResults = [];
for (const s of applicationQueue) {
  try {
    applicationResults.push(...(await buildCableEntries(s, discoverApplicationGroups)));
  } catch (e) {
    console.error("   FAILED:", s.slug, e.message);
  }
  await new Promise((r) => setTimeout(r, 300));
}
// "Cables by Standards" re-lists the same cable products again (~479 unique titles across all
// codes, spot-checked <10% genuinely new) — skip the PDP fetch for anything already known by name
// so a full scrape doesn't cost hundreds of redundant detail-page requests.
const standardResults = [];
for (const s of standardQueue) {
  try {
    standardResults.push(...(await buildCableEntries(s, discoverStandardGroups, new Set(byName.keys()))));
  } catch (e) {
    console.error("   FAILED:", s.slug, e.message);
  }
  await new Promise((r) => setTimeout(r, 300));
}

for (const r of [...applicationResults, ...standardResults]) {
  if (byName.has(r.name)) continue; // full detail already recorded from a prior source
  if (bySlug.has(r.slug) && bySlug.get(r.slug).name !== r.name) {
    r.slug = `${r.slug}-${slugify(r.family)}`;
  }
  bySlug.set(r.slug, r);
  byName.set(r.name, r);
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

// ---------- catalog nav tree: every sighting kept, each item resolved to its canonical slug ----------
function buildCatalogTree(entries) {
  const categories = new Map(); // category -> family -> (name -> slug)
  for (const e of entries) {
    const canonicalSlug = byName.get(e.name)?.slug ?? e.slug;
    if (!categories.has(e.category)) categories.set(e.category, new Map());
    const families = categories.get(e.category);
    if (!families.has(e.family)) families.set(e.family, new Map());
    families.get(e.family).set(e.name, canonicalSlug);
  }
  return [...categories.entries()].map(([name, families]) => ({
    name,
    sections: [...families.entries()].map(([heading, items]) => ({
      heading,
      items: [...items.entries()].map(([itemName, slug]) => ({ name: itemName, slug })),
    })),
  }));
}

let catalogTree = [
  ...buildCatalogTree(results),
  ...buildCatalogTree(applicationResults),
  ...buildCatalogTree(standardResults),
];
if (only) {
  // Partial run: merge this run's categories into the existing tree section-by-section (not a
  // whole-category replace) — a targeted re-scrape of just one family (e.g. "Others" under
  // "Cables by Type") must not wipe out that category's other, previously-scraped families
  // (LV Power Cable, Instrumentation Cable, ...) that this run never touched.
  const prevCatalog = existsSync(CATALOG_FILE) ? JSON.parse(readFileSync(CATALOG_FILE, "utf8")) : [];
  const byCategoryName = new Map(prevCatalog.map((c) => [c.name, c]));
  for (const cat of catalogTree) {
    const prev = byCategoryName.get(cat.name);
    if (!prev) {
      byCategoryName.set(cat.name, cat);
      continue;
    }
    const bySectionHeading = new Map((prev.sections ?? []).map((s) => [s.heading, s]));
    for (const sec of cat.sections ?? []) bySectionHeading.set(sec.heading, sec);
    byCategoryName.set(cat.name, { name: cat.name, sections: [...bySectionHeading.values()] });
  }
  catalogTree = [...byCategoryName.values()];
}
writeFileSync(CATALOG_FILE, JSON.stringify(catalogTree, null, 2) + "\n");

const totalScraped = results.length + applicationResults.length + standardResults.length;
console.log(`\nDone: ${totalScraped} scraped → ${OUT_FILE} (${out.length} total), ${CATALOG_FILE} (${catalogTree.length} categories)`);
