import * as cheerio from "cheerio";
import { mkdirSync, writeFileSync, readFileSync, existsSync, createWriteStream } from "fs";
import { Readable } from "stream";
import path from "path";

const BRAND = "newtek";
const IMG_DIR = `public/images/products/${BRAND}`;
const CAT_DIR = `public/catalogues/${BRAND}`;
const OUT_FILE = `src/data/catalog/${BRAND}.products.json`;
const LOCAL_DIR = `scripts/html/${BRAND}`; // fallback: manually-saved pages go here

// Each entry maps a Newtek sub-product page (the ones with model tabs) to the
// catalog item slug in src/data/catalog/newtek.ts, so product pages resolve.
// category = catalog section heading (matches the catalog + fallback behaviour).
const sources = [
  // ---- Current Transformer Nylon Casing ----
  { slug: "window-type-cts-bus-bar", category: "Metering Type CT'S", url: "https://newtekelectricals.com/current-transformer-bar-type/" },
  { slug: "wpl-type", category: "Metering Type CT'S", url: "https://newtekelectricals.com/wpl-type/" },
  { slug: "round-id-type-cts", category: "Metering Type CT'S", url: "https://newtekelectricals.com/ring-type-current-transformers/" },
  { slug: "nylon-casing-protective-type-bus-bar", category: "Protection Type CT'S", url: "https://newtekelectricals.com/protective-current-transformer/" },
  // ---- Current Transformer Resin Cast ----
  { slug: "resin-cast-wpl", category: "Resin Cast CT'S", url: "https://newtekelectricals.com/resin-cast-cts/" },
  { slug: "resin-cast-bus-bar", category: "Resin Cast CT'S", url: "https://newtekelectricals.com/resin-cast-current-transformer/" },
  { slug: "resin-cast-round-id", category: "Resin Cast CT'S", url: "https://newtekelectricals.com/ring-type-resin-cast-ct/" },
  // ---- Digital Energy Meters ----
  { slug: "digital-meter", category: "Digital Energy Meters", url: "https://newtekelectricals.com/digital-meters/" },
  { slug: "multifunction-meter", category: "Digital Energy Meters", url: "https://newtekelectricals.com/multifuction-meter/" },
  { slug: "power-meter", category: "Digital Energy Meters", url: "https://newtekelectricals.com/power-meter/" },
  // ---- Control Transformer ----
  { slug: "control-transformer-three-phase", category: "Control Transformer", url: "https://newtekelectricals.com/control-transformer/" },
  { slug: "control-transformer-single-phase", category: "Control Transformer", url: "https://newtekelectricals.com/control-transformer-single-phase-tape-insulated/" },
  // ---- MV Current & Potential Transformers ----
  { slug: "mv-potential-transformers", category: "MV Current & Potential Transformers", url: "https://newtekelectricals.com/mv-potential-transformers/" },
  { slug: "mv-current-transformers", category: "MV Current & Potential Transformers", url: "https://newtekelectricals.com/mv-current-transformers/" },
  // ---- Split Core Current Transformers ----
  { slug: "split-core-current-transformers", category: "Split Core Current Transformers", url: "https://newtekelectricals.com/split-core-current-transformer/" },
];

mkdirSync(IMG_DIR, { recursive: true });
mkdirSync(CAT_DIR, { recursive: true });
mkdirSync(LOCAL_DIR, { recursive: true });

// Full browser-like headers to get past mod_security (minimal headers get blocked)
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://newtekelectricals.com/",
  Connection: "keep-alive",
};

const NAV_RE = /^(home|about newtek|about|products|news|industries|consultants|downloads|contact|careers)$/i;

async function getHtml({ slug, url }) {
  const localFile = path.join(LOCAL_DIR, `${slug}.html`);
  if (existsSync(localFile)) {
    console.log("   (using local file)");
    return readFileSync(localFile, "utf8");
  }
  const res = await fetch(url, { headers: HEADERS });
  const html = await res.text();
  if (!res.ok || /Not Acceptable/i.test(html)) {
    throw new Error(`Blocked (${res.status}). Save the page manually as ${localFile}`);
  }
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

const catalogueCache = new Map(); // absUrl -> local path; the same PDF is often reused across products/variants
async function downloadCatalogue(absUrl) {
  if (catalogueCache.has(absUrl)) return catalogueCache.get(absUrl);
  const filename = slugify(path.basename(new URL(absUrl).pathname).replace(/\.pdf$/i, "")) + ".pdf";
  const local = await downloadTo(absUrl, CAT_DIR, filename, `/catalogues/${BRAND}`);
  catalogueCache.set(absUrl, local);
  return local;
}

// pick a real product image url from an <img>, ignoring logos/icons/spacers
function pickImgUrl($el) {
  const raw = $el.attr("src") || $el.attr("data-src") || $el.attr("data-lazy-src");
  if (!raw) return null;
  if (!/uploads/i.test(raw)) return null;
  if (/logo|icon|placeholder|spacer|data:image/i.test(raw)) return null;
  return raw;
}

// drop the "-248x300" style thumbnail suffix so we grab the full-size asset
function fullSize(url) {
  return url.replace(/-\d+x\d+(\.(png|jpe?g|webp|gif))/i, "$1");
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// Collect real product images within a scope. WPBakery renders some images as
// a plain <img>, others as a gallery <a href="full-size.jpg"><img src="thumb.jpg">.
// Prefer the <a href> (the original) over the thumbnail <img src> when both exist.
function collectImages($, $scope, baseUrl) {
  const urls = [];
  $scope.find("img").each((_, img) => {
    const $img = $(img);
    const aHref = $img.closest("a[href]").attr("href");
    let raw = aHref && /\.(png|jpe?g|gif|webp)(\?|$)/i.test(aHref) && /uploads/i.test(aHref) ? aHref : pickImgUrl($img);
    if (!raw) return;
    const abs = fullSize(new URL(raw, baseUrl).href);
    if (!urls.includes(abs)) urls.push(abs);
  });
  return urls;
}

// contact-form / dropdown text leaks in as concatenated CamelCase labels
function looksLikeJunk(text) {
  if (/reason for contact|business planning|financial projections|select an option|audit & assurance/i.test(text)) return true;
  // 3+ CamelCase joins with no space (e.g. "PlanningAudit & AssuranceStrategic") = dropdown labels
  const joins = (text.match(/[a-z][A-Z]/g) || []).length;
  return joins >= 3;
}

async function scrapeOne(src) {
  console.log("→", src.slug);
  const html = await getHtml(src);
  const $ = cheerio.load(html);

  const name = $("h1").first().text().replace(/\s+/g, " ").trim() || src.slug;

  // ---------- overview: substantial paragraphs from the intro (not inside tab panels) ----------
  const overview = [];
  $("p").each((_, el) => {
    if ($(el).closest(".vc_tta-panel, footer, header, nav, form, .wpcf7, .contact").length) return;
    const text = $(el).text().replace(/\s+/g, " ").trim();
    if (looksLikeJunk(text)) return;
    if (text.length > 80 && overview.length < 5 && !overview.includes(text)) {
      overview.push(text);
    }
  });

  // ---------- benefits: Advantages/Applications bullet lists (outside tab panels) ----------
  const benefits = [];
  $("li").each((_, el) => {
    if ($(el).closest(".vc_tta-panel, footer, header, nav, .menu, #menu").length) return;
    const text = $(el).text().replace(/\s+/g, " ").trim();
    if (text.length > 20 && text.length < 240 && !NAV_RE.test(text) && !benefits.includes(text)) {
      benefits.push(text);
    }
  });

  // NOTE: these pages have no standalone hero product photo outside the tab
  // panels — the only non-panel images are the site logo and a shared
  // "Industries We Serve" icon grid (same icons on every product page). The
  // hero image is set below, after variants are built, by reusing the first
  // model's own photo instead.

  // ---------- variants: one per WPBakery tab panel ----------
  // Some pages embed an extra "related products" tab widget (wrong/mismatched
  // content, e.g. meter specs under a "Tape Insulated" label) before the real
  // model tabs. Empirically the real model-tabs container is always the LAST
  // top-level .vc_tta block on the page — earlier ones are the cross-promo widget.
  const containers = $(".vc_tta").toArray();
  const modelContainer = containers.length ? $(containers[containers.length - 1]) : $();

  // Prefer the visible tab-title text (mapped by href="#panelId") over the
  // panel's own <h2>: on at least one live page the two disagree (a content
  // typo on Newtek's site), and the tab title is what's actually shown/clicked.
  const titleByPanelId = {};
  modelContainer.find('.vc_tta-tabs-list a[href^="#"], .vc_tta-tab a[href^="#"]').each((_, a) => {
    const $a = $(a);
    const id = ($a.attr("href") || "").slice(1);
    const title = $a.find(".vc_tta-title-text").text().replace(/\s+/g, " ").trim() || $a.text().replace(/\s+/g, " ").trim();
    if (id && title) titleByPanelId[id] = title;
  });

  const variants = [];
  const seenNames = new Set();
  const panels = modelContainer.find(".vc_tta-panel").toArray();
  for (const panel of panels) {
    const $p = $(panel);
    const panelId = $p.attr("id") || "";
    const vName = titleByPanelId[panelId] || $p.find("h2").first().text().replace(/\s+/g, " ").trim();
    if (!vName || seenNames.has(vName)) continue; // panels can repeat (desktop + mobile render)
    seenNames.add(vName);

    // features: bullets in the panel, excluding the section labels themselves
    const features = [];
    $p.find("li").each((_, li) => {
      const t = $(li).text().replace(/\s+/g, " ").trim();
      if (t && t.length > 4 && !/^(product feature|technical data)$/i.test(t) && !features.includes(t)) {
        features.push(t);
      }
    });

    // Each panel body is a stack of WPBakery rows: row0 = model name only,
    // one row = "Product Feature" text + the hero product photo, another row
    // (anywhere) = "Technical Data" heading + table/diagram screenshots.
    // Locating images by ROW (not by filename-matching against the model name)
    // avoids picking the technical-data screenshot as the hero photo — Newtek's
    // own filenames sometimes contain the model number in the table image too.
    const rows = $p.children(".vc_tta-panel-body").children(".vc_row").toArray().slice(1); // skip name-only row0
    const technicalRow = rows.find((r) => /technical\s*data/i.test($(r).find("h2, .vc_custom_heading").first().text()));
    const heroRow = rows.find((r) => r !== technicalRow && $(r).find("img").length > 0);

    let vImage;
    if (heroRow) {
      const [heroUrl] = collectImages($, $(heroRow), src.url);
      if (heroUrl) {
        const ext = path.extname(new URL(heroUrl).pathname) || ".jpg";
        vImage = await downloadImage(heroUrl, `${src.slug}-${slugify(vName)}${ext}`);
      }
    }

    const technicalImages = [];
    if (technicalRow) {
      const techUrls = collectImages($, $(technicalRow), src.url);
      for (let i = 0; i < techUrls.length; i++) {
        const ext = path.extname(new URL(techUrls[i]).pathname) || ".jpg";
        const local = await downloadImage(techUrls[i], `${src.slug}-${slugify(vName)}-tech${i + 1}${ext}`);
        if (local) technicalImages.push(local);
      }
    }

    // "Download Catalogue" PDF link — same file is usually reused across every
    // variant of a product, so downloads are cached by URL.
    const pdfHref = $p
      .find(".vc_btn3-container a[href], a.vc_btn3[href]")
      .filter((_, a) => /\.pdf(\?|$)/i.test($(a).attr("href") || ""))
      .first()
      .attr("href");
    let vCatalogue;
    if (pdfHref) {
      const abs = new URL(pdfHref, src.url).href;
      vCatalogue = await downloadCatalogue(abs);
    }

    const variant = { name: vName };
    if (vImage) variant.image = vImage;
    if (features.length) variant.features = features;
    if (technicalImages.length) variant.technicalImages = technicalImages;
    if (vCatalogue) variant.catalogue = vCatalogue;
    variants.push(variant);
  }

  // hero image: reuse the first model's own photo (falls back to its technical
  // image if that one variant happens to have no separate product photo).
  const image = variants.find((v) => v.image)?.image || variants.find((v) => v.technicalImages?.length)?.technicalImages[0];

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
    results.push(await scrapeOne(s));
  } catch (e) {
    console.error("   FAILED:", e.message);
  }
  await new Promise((r) => setTimeout(r, 1200));
}

// When running --only, merge into the existing file instead of overwriting.
let out = results;
if (only && existsSync(OUT_FILE)) {
  const prev = JSON.parse(readFileSync(OUT_FILE, "utf8"));
  const bySlug = new Map(prev.map((p) => [p.slug, p]));
  for (const r of results) bySlug.set(r.slug, r);
  out = [...bySlug.values()];
}

writeFileSync(OUT_FILE, JSON.stringify(out, null, 2) + "\n");
console.log(`\nDone: ${results.length} scraped → ${OUT_FILE} (${out.length} total)`);
