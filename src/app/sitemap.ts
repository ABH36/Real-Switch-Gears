import type { MetadataRoute } from "next";
import { brands, getProductCategorySlug } from "@/data/brands";
import { site } from "@/data/site";

const base = site.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = [
    { url: "", changeFrequency: "weekly" as const, priority: 1 },
    { url: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
    { url: "/certificates", changeFrequency: "monthly" as const, priority: 0.5 },
    { url: "/pricelist", changeFrequency: "weekly" as const, priority: 0.6 },
    { url: "/contact", changeFrequency: "monthly" as const, priority: 0.6 },
    { url: "/quote", changeFrequency: "monthly" as const, priority: 0.6 },
  ].map((p) => ({ url: `${base}${p.url}`, lastModified: now, changeFrequency: p.changeFrequency, priority: p.priority }));

  const brandPages = brands.map((b) => ({
    url: `${base}/products/${b.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productPages = brands.flatMap((b) =>
    (b.products ?? []).map((p) => ({
      url: `${base}/products/${b.slug}/${getProductCategorySlug(b, p.slug)}/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  return [...staticPages, ...brandPages, ...productPages];
}