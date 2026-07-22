import type { MetadataRoute } from "next";

const base = "https://realswitchgears.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dev-tools", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
