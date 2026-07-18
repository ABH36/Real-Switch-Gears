import * as cheerio from "cheerio";
import { mkdirSync, writeFileSync, readFileSync, existsSync, createWriteStream } from "fs";
import { Readable } from "stream";
import path from "path";

const BRAND = "braco";
const IMG_DIR = `public/images/products/${BRAND}`;
const OUT_FILE = `src/data/catalog/${BRAND}.products.json`;
const LOCAL_DIR = `scripts/html/${BRAND}`;
const SITE = "https://bracoworldwide.com";

// bracoworldwide.com (braco.in redirects here) is a static Bootstrap site —
// each catalog item is a listing page (its own intro paragraph) linking to
// several model-family sub-pages; each sub-page becomes a ProductVariant
// (mirrors Newtek's tab-per-model pattern, just plain pages instead of tabs).
// "Other Tools" has 2 items with no further sub-links — scraped directly.
// NOTE: Catalogue PDFs are gated behind a lead-capture form (download-catalogue.php),
// not a direct static file, so they're intentionally left out here.
const sources = [
  { slug: "cable-glands-domestic-series", category: "Cable Glands", type: "multi", listingUrl: `${SITE}/cable-glands-domestic-series.html`,
    subUrls: ["single-compression-glands", "single-compression-glands-sibg", "double-compression-brass-glands-weatherproof", "double-compression-brass-glands-flameproof", "double-compression-through-glands-weatherproof", "single-compression-through-glands-weatherproof", "double-compression-stainless-steel-glands-weatherproof", "double-compression-stainless-steel-glands-flameproof", "flange-type-cable-glands", "nylon-cable-glands-pg-type", "brass-cable-glands-pg-type"].map((s) => `${SITE}/cable-glands/${s}.html`) },
  { slug: "cable-glands-exports-series", category: "Cable Glands", type: "multi", listingUrl: `${SITE}/cable-glands-exports-series.html`,
    subUrls: ["bw-type-cable-glands", "cw-type-cable-glands", "a2-type-cable-glands", "e1w-type-cable-glands", "e1f-brass-glands", "bw-knurling-type-brass-cable-glands", "nylon-cable-glands-pg-type", "brass-cable-glands-pg-type"].map((s) => `${SITE}/cable-glands/${s}.html`) },
  { slug: "cable-glands-accessories", category: "Cable Glands", type: "multi", listingUrl: `${SITE}/cable-glands-accessories.html`,
    subUrls: ["wiping-type-cable-glands", "earth-tags", "reducers", "adaptor", "stopper-plug", "pvc-shrouds"].map((s) => `${SITE}/cable-glands/${s}.html`) },
  { slug: "copper-terminals", category: "Cable Terminals", type: "multi", listingUrl: `${SITE}/copper-terminals.html`,
    subUrls: ["copper-crimping-ring-terminals", "copper-crimping-ring-terminals-non-insulated", "copper-ring-tongue-fork-terminals", "copper-crimping-pin-terminals", "copper-crimping-fork-terminals", "open-close-soldering-type-copper-ring-terminals", "copper-crimping-end-sealing-ferrules", "copper-crimping-end-sealing-insulated-ferrules", "copper-crimping-end-sealing-insulated-ferrules-twin-cable"].map((s) => `${SITE}/cable-terminals/${s}.html`) },
  { slug: "copper-cable-lugs", category: "Cable Terminals", type: "multi", listingUrl: `${SITE}/copper-cable-lugs.html`,
    subUrls: ["copper-crimping-terminals-for-aluminium-conductor", "copper-crimping-terminals-with-inspection-hole", "copper-crimping-terminals-with-inspection-hole-copper-conductor", "copper-crimping-terminals-for-copper-condutors", "copper-crimping-terminals-as-per-din-standards", "copper-tube-in-line-connectors", "copper-crimping-reducer-terminals-aluminium-conductor"].map((s) => `${SITE}/cable-terminals/${s}.html`) },
  { slug: "aluminium-cable-lugs", category: "Cable Terminals", type: "multi", listingUrl: `${SITE}/aluminium-cable-lugs.html`,
    subUrls: ["aluminium-crimping-terminals", "double-hole-aluminium-crimping-terminals", "aluminium-tube-terminals", "aluminium-crimping-connectors", "aluminium-crimping-reducer-terminals", "long-barrel-aluminium-crimping-terminals"].map((s) => `${SITE}/cable-terminals/${s}.html`) },
  { slug: "bimetallic-lugs", category: "Cable Terminals", type: "multi", listingUrl: `${SITE}/bimetallic-lugs.html`,
    subUrls: ["bi-metallic-terminals", "bimetallic-terminals-copper-ring-type", "aluminium-alloy-tubular-bimetallic-terminals", "corrosion-inhabiting-compound"].map((s) => `${SITE}/cable-terminals/${s}.html`) },
  { slug: "crimping-tools", category: "Other Tools", type: "multi", listingUrl: `${SITE}/crimping-tools.html`,
    subUrls: ["hydraulic-crimping-tools", "mechanical-crimping-tools", "cable-cutter-tools", "hand-crimping-tools"].map((s) => `${SITE}/crimping-tools/${s}.html`) },
  { slug: "earthing-rods-accessories", category: "Other Tools", type: "multi", listingUrl: `${SITE}/earthing-rods-and-accessories.html`,
    subUrls: ["copper-bonded-earth-rod", "solid-copper-earth-rod", "threaded-couplings", "threaded-driving-heads", "driving-heads", "driving-spikes", "coupling-dowels", "earth-rod-tape-clamps", "earth-rod-cable-g-clamps", "u-bolt-clamps", "metallic-dc-clips", "tape-clips", "square-tape-clips"].map((s) => `${SITE}/earthing-rods/${s}.html`) },
  { slug: "gi-pvc-coated-flexible-conduit", category: "Other Tools", type: "single", url: `${SITE}/gi-pvc-coated-flexible-conduit.html` },
  { slug: "tailor-made", category: "Other Tools", type: "single", url: `${SITE}/tailor-made.html` },
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
  const res = await fetch(url, { headers: HEADERS });
  const html = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return html;
}

async function downloadImage(absUrl, filename) {
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
    return null;
  }
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function pickImgUrl($el) {
  const raw = $el.attr("src") || $el.attr("data-src");
  if (!raw || /^data:/i.test(raw) || /logo|icon|sprite/i.test(raw)) return null;
  return raw;
}

const PLACEHOLDER_RE = /details coming soon/i;

// Flatten a (possibly multi-row, rowspan/colspan'd) <thead> into one leaf
// header per real data column, so header count always matches each <tbody>
// row's cell count. Many Braco spec tables split a grouped header across two
// <tr>s, e.g. a colspan=3 "Nipple Thread" row-1 cell whose 3 real sub-columns
// ("ET"/"MM"/"NPT") are individual cells in row 2; a naive "grab every <th>"
// pass double-counts the group label. Building a full grid (repeating each
// <th>'s text across the rows/cols it spans) and reading off the LAST grid
// row yields exactly one label per real column: rowspan'd cells carry their
// text down into that row, and colspan'd group cells get overwritten there by
// their own leaf sub-headers.
function extractTableHeaders($, $table) {
  const trs = $table.find("thead tr").toArray();
  if (!trs.length) return [];
  const grid = trs.map(() => []);
  trs.forEach((tr, rIdx) => {
    let col = 0;
    $(tr)
      .find("th")
      .each((_, th) => {
        while (grid[rIdx][col] !== undefined) col++;
        const text = $(th).text().replace(/\s+/g, " ").trim();
        const colspan = parseInt($(th).attr("colspan") || "1", 10) || 1;
        const rowspan = parseInt($(th).attr("rowspan") || "1", 10) || 1;
        for (let rr = rIdx; rr < Math.min(rIdx + rowspan, grid.length); rr++) {
          for (let cc = col; cc < col + colspan; cc++) grid[rr][cc] = text;
        }
        col += colspan;
      });
  });
  return grid[grid.length - 1];
}

// Same grid technique applied to <tbody>: a handful of tables also rowspan a
// cell (e.g. a shared "Size" value) down across several data rows, which
// otherwise makes those rows look one cell short.
function extractTableRows($, $table, numCols) {
  const trs = $table.find("tbody tr").toArray();
  const grid = trs.map(() => []);
  trs.forEach((tr, rIdx) => {
    let col = 0;
    $(tr)
      .find("td")
      .each((_, td) => {
        while (grid[rIdx][col] !== undefined) col++;
        const text = $(td).text().replace(/\s+/g, " ").trim();
        const colspan = parseInt($(td).attr("colspan") || "1", 10) || 1;
        const rowspan = parseInt($(td).attr("rowspan") || "1", 10) || 1;
        for (let rr = rIdx; rr < Math.min(rIdx + rowspan, grid.length); rr++) {
          for (let cc = col; cc < col + colspan; cc++) grid[rr][cc] = text;
        }
        col += colspan;
      });
  });
  return grid
    .map((row) => Array.from({ length: numCols }, (_, c) => row[c] ?? ""))
    .filter((row) => row.some((c) => c));
}

// Some sub-pages (e.g. the 4 Crimping Tools pages) aren't a single accordion
// product page at all — they're themselves a listing of many distinct tool
// models, each rendered inline as its own "<row> image-col + h3 + 2-col spec
// table" block. Detect that shape and expand it into one entry per model
// instead of forcing it through the single-product accordion parser.
async function scrapeInlineModels(url) {
  const html = await getHtml(url, slugify(url.replace(/^https?:\/\//, "")));
  const $ = cheerio.load(html);
  const models = [];

  for (const h3 of $("h3").toArray()) {
    const $h3 = $(h3);
    const name = $h3.text().replace(/\s+/g, " ").trim();
    if (!name) continue;
    const $row = $h3.closest(".row");

    const features = [];
    $row.find("table tbody tr").each((_, tr) => {
      const cells = $(tr).find("td").toArray().map((td) => $(td).text().replace(/\s+/g, " ").trim());
      if (cells.length >= 2 && cells[0] && cells[1]) features.push(`${cells[0]}: ${cells[1]}`);
    });

    const rawSrc = pickImgUrl($row.find("img").first());
    models.push({ name, features, imgUrl: rawSrc ? new URL(rawSrc, url).href : null });
  }
  return models;
}

// ---------- scrape one model/sub-page (or a standalone single-variant page) ----------
async function scrapePage(url, imgNamePrefix) {
  const html = await getHtml(url, slugify(url.replace(/^https?:\/\//, "")));
  const $ = cheerio.load(html);

  const name = $("h4").first().text().replace(/\s+/g, " ").trim() || $("h3").first().text().replace(/\s+/g, " ").trim();

  const overview = [];
  const features = [];
  let specTable;

  const accordionHeaders = $(".accordion-header").toArray();
  const isInlineModelListing = !accordionHeaders.length && $("h3").length > 1 && $("table").length > 1;
  if (isInlineModelListing) {
    return { name, overview, features, image: undefined, specTable, inlineModelListing: true };
  }
  if (accordionHeaders.length) {
    for (const h of accordionHeaders) {
      const $h = $(h);
      const label = $h.find(".accordion-button").text().trim();
      const targetId = ($h.find(".accordion-button").attr("data-bs-target") || "").replace("#", "");
      const $body = $(`#${targetId}`).find(".accordion-body");
      if (!$body.length) continue;

      if (/technical details/i.test(label)) {
        const $table = $body.find("table").first();
        if ($table.length) {
          const headers = extractTableHeaders($, $table);
          const rows = extractTableRows($, $table, headers.length);
          if (headers.length && rows.length) specTable = { headers, rows };
        }
      } else if (/description/i.test(label)) {
        // "Parts" breakdown table (Description / Material columns) reads as readable feature bullets
        $body.find("table tbody tr").each((_, tr) => {
          const cells = $(tr).find("td").map((_, td) => $(td).text().replace(/\s+/g, " ").trim()).get();
          if (cells.length >= 2 && cells[0] && cells[1]) features.push(`${cells[0]}: ${cells[1]}`);
        });
        $body.find(".content-text > p").each((_, p) => {
          const t = $(p).text().replace(/\s+/g, " ").trim();
          if (t && t.length > 20 && !PLACEHOLDER_RE.test(t)) overview.push(t);
        });
      } else {
        // Application / Accessories — plain paragraphs, skip unfinished "coming soon" placeholders
        const t = $body.text().replace(/\s+/g, " ").trim();
        if (t && t.length > 15 && !PLACEHOLDER_RE.test(t)) overview.push(`${label}: ${t}`);
      }
    }
  } else {
    // no accordion (e.g. Tailor Made) — plain content page
    $(".content-text p, p").each((_, p) => {
      if (overview.length >= 5) return;
      const t = $(p).text().replace(/\s+/g, " ").trim();
      if (t && t.length > 30 && !overview.includes(t)) overview.push(t);
    });
    $("li").each((_, li) => {
      if ($(li).closest("nav, header, footer, .menu, .pro-list-box").length) return;
      const t = $(li).text().replace(/\s+/g, " ").trim();
      if (t && t.length > 15 && t.length < 400 && !features.includes(t)) features.push(t);
    });
  }

  let image;
  const imgEl = $("img")
    .filter((_, el) => {
      if ($(el).closest("nav, header, footer, .pro-list-box").length) return false;
      return !!pickImgUrl($(el));
    })
    .first();
  const rawSrc = pickImgUrl(imgEl);
  if (rawSrc) {
    const abs = new URL(rawSrc, url).href;
    const ext = path.extname(new URL(abs).pathname) || ".jpg";
    image = await downloadImage(abs, `${imgNamePrefix}${ext}`);
  }

  return { name, overview, features, image, specTable };
}

async function scrapeMulti(src) {
  console.log("→", src.slug, `(${src.subUrls.length} variants)`);
  const listingHtml = await getHtml(src.listingUrl, slugify(src.listingUrl.replace(/^https?:\/\//, "")));
  const $ = cheerio.load(listingHtml);
  const name = $("h3").first().text().replace(/\s+/g, " ").trim() || src.slug;
  const overview = [];
  $(".content-text p").each((_, p) => {
    const t = $(p).text().replace(/\s+/g, " ").trim();
    if (t && t.length > 30 && !overview.includes(t)) overview.push(t);
  });

  const variants = [];
  for (const purl of src.subUrls) {
    try {
      const pagePrefix = `${src.slug}-${slugify(purl.replace(/\.html$/, "").split("/").pop())}`;
      const p = await scrapePage(purl, pagePrefix);
      if (p.inlineModelListing) {
        // this sub-page is itself a listing of many distinct tool models —
        // expand each inline model into its own variant instead of one.
        const models = await scrapeInlineModels(purl);
        for (const m of models) {
          const variant = { name: m.name };
          if (m.imgUrl) {
            const ext = path.extname(new URL(m.imgUrl).pathname) || ".jpg";
            const img = await downloadImage(m.imgUrl, `${pagePrefix}-${slugify(m.name)}${ext}`);
            if (img) variant.image = img;
          }
          if (m.features.length) variant.features = m.features;
          variants.push(variant);
        }
        continue;
      }
      const variant = { name: p.name || purl };
      if (p.image) variant.image = p.image;
      if (p.features.length) variant.features = p.features;
      if (p.specTable) variant.specTable = p.specTable;
      variants.push(variant);
    } catch (e) {
      console.error("    variant FAILED:", purl, e.message);
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  const image = variants.find((v) => v.image)?.image;
  const entry = { slug: src.slug, name, category: src.category, overview };
  if (image) entry.image = image;
  if (variants.length) entry.variants = variants;
  console.log(`   overview:${overview.length} variants:${variants.length}${image ? " img✓" : ""}`);
  return entry;
}

async function scrapeSingle(src) {
  console.log("→", src.slug);
  const p = await scrapePage(src.url, src.slug);
  const entry = { slug: src.slug, name: p.name || src.slug, category: src.category, overview: p.overview };
  if (p.image) entry.image = p.image;
  if (p.features.length) entry.benefits = p.features;
  if (p.specTable) entry.variants = [{ name: p.name, specTable: p.specTable }];
  console.log(`   overview:${p.overview.length} benefits:${p.features.length}${p.image ? " img✓" : ""}`);
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
