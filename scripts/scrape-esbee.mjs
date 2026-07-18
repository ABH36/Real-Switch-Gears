import * as cheerio from "cheerio";
import { mkdirSync, writeFileSync, readFileSync, existsSync, createWriteStream } from "fs";
import { Readable } from "stream";
import path from "path";

const BRAND = "esbee";
const IMG_DIR = `public/images/products/${BRAND}`;
const OUT_FILE = `src/data/catalog/${BRAND}.products.json`;
const LOCAL_DIR = `scripts/html/${BRAND}`;
const SITE = "https://esbee-electrotech.com";

// esbee-electrotech.com — each catalog item is a listing page
// (/products/{code}/{category}/{slug}) linking to many individual
// /product-details/{id}/{slug} model pages; each becomes a ProductVariant
// (same tab-per-model pattern as Newtek/Braco). No per-product catalogue PDF
// pattern was found (only generic company-wide docs), so `catalogue` is
// intentionally left unset here.
const sources = [
  // ---- Industrial ----
  { slug: "industrial-smart-solutions", category: "Industrial", name: "Smart Solutions", listingPath: "MTA/industrial/smart-solutions" },
  { slug: "panel-led-indicators", category: "Industrial", name: "Panel LED Indicators", listingPath: "MQ/industrial/panel-led-indicators" },
  { slug: "push-button-switches", category: "Industrial", name: "Push Button Switches", listingPath: "Mg/industrial/push-button-switches" },
  { slug: "enclosures-pb-stations", category: "Industrial", name: "Enclosures and PB Stations", listingPath: "Mw/industrial/enclosures-and-pb-stations" },
  { slug: "sockets", category: "Industrial", name: "Sockets", listingPath: "NA/industrial/sockets" },
  { slug: "tower-lights", category: "Industrial", name: "Tower Lights", listingPath: "NQ/industrial/tower-lights" },
  { slug: "signaling-audio-devices", category: "Industrial", name: "Signaling and Audio Devices", listingPath: "Ng/industrial/signaling-and-audio-devices" },
  { slug: "limit-switches", category: "Industrial", name: "Limit Switches", listingPath: "Nw/industrial/limit-switches" },
  { slug: "industrial-lighting-solutions", category: "Industrial", name: "Lighting Solutions", listingPath: "OQ/industrial/lighting-solutions" },
  { slug: "relay-boards", category: "Industrial", name: "Relay Boards", listingPath: "MTE/industrial/relay-boards" },
  // ---- White Goods ----
  { slug: "door-lid-switches", category: "White Goods", name: "Door/Lid Switches", listingPath: "MTI/white-goods/door-lid-switches" },
  { slug: "appliance-lighting-solutions", category: "White Goods", name: "Appliance Lighting Solutions", listingPath: "MTM/white-goods/appliance-lighting-solutions" },
  { slug: "pcbas", category: "White Goods", name: "PCBAs", listingPath: "MTQ/white-goods/pcbas" },
  // ---- Automobile ----
  { slug: "emergency-switches", category: "Automobile", name: "Emergency Switches", listingPath: "MTU/automobile/emergency-switches" },
  { slug: "automobile-lighting-solutions", category: "Automobile", name: "Automobile Lighting Solutions", listingPath: "MTY/automobile/automobile-lighting-solutions" },
  { slug: "emergency-audio-solutions", category: "Automobile", name: "Emergency Audio Solutions", listingPath: "MTc/automobile/emergency-audio-solutions" },
  // ---- Elevators / Escalators ----
  { slug: "pit-control-devices", category: "Elevators / Escalators", name: "Pit Control Devices", listingPath: "MTg/elevators-escalators/pit-control-devices" },
  { slug: "car-top-devices", category: "Elevators / Escalators", name: "Car Top Devices", listingPath: "MTk/elevators-escalators/car-top-devices" },
  { slug: "under-car-devices", category: "Elevators / Escalators", name: "Under Car Devices", listingPath: "MjA/elevators-escalators/under-car-devices" },
  { slug: "elevator-lighting-solutions", category: "Elevators / Escalators", name: "Elevator Lighting Solutions", listingPath: "MjE/elevators-escalators/elevator-lighting-solutions" },
  { slug: "elevator-customised-solutions", category: "Elevators / Escalators", name: "Customised Solutions", listingPath: "MjM/elevators-escalators/customised-solutions" },
  { slug: "elevator-auxiliary-controls", category: "Elevators / Escalators", name: "Auxiliary Controls", listingPath: "MjY/elevators-escalators/auxiliary-controls" },
  { slug: "elevator-accessories", category: "Elevators / Escalators", name: "Accessories", listingPath: "MjQ/elevators-escalators/accessories" },
  // ---- Crane Industry ----
  { slug: "single-speed-crane-pendants", category: "Crane Industry", name: "Single Speed Crane Pendants", listingPath: "Mjg/crane-industry/single-speed-crane-pendants" },
  { slug: "double-speed-crane-pendants", category: "Crane Industry", name: "Double Speed Crane Pendants", listingPath: "Mjk/crane-industry/double-speed-crane-pendants" },
  { slug: "crane-wireless-solutions", category: "Crane Industry", name: "Wireless Solutions", listingPath: "MzA/crane-industry/wireless-solutions" },
  { slug: "crane-safety-systems", category: "Crane Industry", name: "Safety Systems", listingPath: "MzM/crane-industry/safety-sytems" },
  { slug: "crane-signaling-lighting-devices", category: "Crane Industry", name: "Signaling and Lighting Devices", listingPath: "MzI/crane-industry/signaling-and-lighting-devices" },
  { slug: "auxiliary-controls-pendants", category: "Crane Industry", name: "Auxiliary Controls - Pendants", listingPath: "MzE/crane-industry/auxiliary-controls-pendants" },
];

mkdirSync(IMG_DIR, { recursive: true });
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
  // this site occasionally drops connections under load (329 products scraped
  // in one run) — a couple of retries clears up nearly all of them.
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: HEADERS });
      const html = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return html;
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    }
  }
  throw lastErr;
}

async function downloadImage(absUrl, filename) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(absUrl, { headers: HEADERS });
      if (!res.ok) return null;
      const dest = path.join(IMG_DIR, filename);
      await new Promise((resolve, reject) => {
        const ws = createWriteStream(dest);
        Readable.fromWeb(res.body).pipe(ws).on("finish", resolve).on("error", reject);
      });
      return `/images/products/${BRAND}/${filename}`;
    } catch {
      await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    }
  }
  return null;
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function pickImgUrl($el) {
  const raw = $el.attr("src") || $el.attr("data-src");
  if (!raw || /^data:/i.test(raw) || /logo|icon|sprite|flag/i.test(raw)) return null;
  return raw;
}

async function discoverProductLinks(listingUrl, cacheKey) {
  const html = await getHtml(listingUrl, cacheKey);
  const $ = cheerio.load(html);
  const cards = new Map(); // href -> { group, name }
  $('a[href*="/product-details/"]').each((_, a) => {
    const $a = $(a);
    const href = ($a.attr("href") || "").split("?")[0];
    // each card has an <h4> group label (e.g. "Metal Push Buttons") plus a <p>
    // with the specific model name. The group label is usually redundant
    // (repeated across many cards) so it's dropped by default — but a couple
    // of product lines (e.g. Modular vs Entegral mushroom-head buttons) reuse
    // the exact same <p> text for genuinely different SKUs, where the group
    // label is the ONLY thing that tells them apart; see the collision fixup below.
    const group = $a.find(".product-content h4").first().text().replace(/\s+/g, " ").trim();
    const name = $a.find(".product-content p").first().text().replace(/\s+/g, " ").trim() || $a.text().replace(/\s+/g, " ").trim();
    if (href && name && !cards.has(href)) cards.set(href, { group, name });
  });

  // disambiguate: if plain <p> names collide, prefix the group label for
  // just those collisions so every variant on the page gets a unique, still
  // mostly-clean name.
  const nameCounts = new Map();
  for (const { name } of cards.values()) nameCounts.set(name, (nameCounts.get(name) || 0) + 1);
  return [...cards.entries()].map(([href, { group, name }]) => {
    const finalName = nameCounts.get(name) > 1 && group ? `${group} — ${name}` : name;
    return [href, finalName];
  });
}

async function scrapeProduct(url, imgNamePrefix, listingName) {
  const html = await getHtml(url, slugify(url.replace(/^https?:\/\//, "")));
  const $ = cheerio.load(html);

  // The listing page's own link text is more specific than the product-detail
  // page's category label — e.g. two distinct SKUs ("Modular Plastic" vs
  // "Entegral Plastic" mushroom-head buttons) both render the SAME generic
  // ".product-category span" text on their own detail pages, which would
  // otherwise make genuinely different models look identical in the UI.
  const name =
    listingName ||
    $(".product-category span").first().text().replace(/\s+/g, " ").trim() ||
    $("title").text().trim();

  const overview = [];
  $(".product-description p").each((_, p) => {
    if (overview.length >= 5) return;
    const t = $(p).text().replace(/\s+/g, " ").trim();
    if (t && t.length > 20 && !overview.includes(t)) overview.push(t);
  });

  const features = [];
  $(".product-features .features-list li").each((_, li) => {
    const t = $(li).text().replace(/\s+/g, " ").trim();
    if (t && !features.includes(t)) features.push(t);
  });

  let image;
  const imgEl = $(".product-slide-item img, .product-details-image img")
    .filter((_, el) => !!pickImgUrl($(el)))
    .first();
  const rawSrc = pickImgUrl(imgEl);
  if (rawSrc) {
    const abs = new URL(rawSrc, url).href;
    const ext = path.extname(new URL(abs).pathname) || ".jpg";
    image = await downloadImage(abs, `${imgNamePrefix}${ext}`);
  }

  return { name, overview, features, image };
}

async function scrapeItem(src) {
  const listingUrl = `${SITE}/products/${src.listingPath}`;
  const productLinks = await discoverProductLinks(listingUrl, slugify(src.listingPath));
  console.log("→", src.slug, `(${productLinks.length} variants)`);

  const variants = [];
  let firstOverview = [];
  for (const [purl, listingName] of productLinks) {
    try {
      const p = await scrapeProduct(purl, `${src.slug}-${slugify(purl.replace(/\/$/, "").split("/").pop())}`, listingName);
      const variant = { name: p.name };
      if (p.image) variant.image = p.image;
      if (p.features.length) variant.features = p.features;
      variants.push(variant);
      if (!firstOverview.length) firstOverview = p.overview;
    } catch (e) {
      console.error("    variant FAILED:", purl, e.message);
    }
    await new Promise((r) => setTimeout(r, 250));
  }

  const image = variants.find((v) => v.image)?.image;
  const entry = { slug: src.slug, name: src.name, category: src.category, overview: firstOverview };
  if (image) entry.image = image;
  if (variants.length) entry.variants = variants;
  console.log(`   overview:${firstOverview.length} variants:${variants.length}${image ? " img✓" : ""}`);
  return entry;
}

const only = process.argv.find((a) => a.startsWith("--only="))?.split("=")[1];
const queue = only ? sources.filter((s) => s.slug === only) : sources;

const results = [];
for (const s of queue) {
  try {
    results.push(await scrapeItem(s));
  } catch (e) {
    console.error("   FAILED:", s.slug, e.message);
  }
  await new Promise((r) => setTimeout(r, 400));
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
