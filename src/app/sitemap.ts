import type { MetadataRoute } from "next";
import { brands } from "@/data/brands";

const base = "https://realswitchgears.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/about", "/certificates", "/pricelist", "/contact", "/quote"].map(
    (p) => ({ url: `${base}${p}` })
  );
  const brandPages = brands.map((b) => ({ url: `${base}/brands/${b.slug}` }));
  const productPages = brands.flatMap((b) =>
    (b.products ?? []).map((p) => ({ url: `${base}/brands/${b.slug}/${p.slug}` }))
  );
  return [...staticPages, ...brandPages, ...productPages];
}