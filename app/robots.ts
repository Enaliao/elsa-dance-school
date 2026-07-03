import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.elsadanceschool.ca";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/en/admin", "/fr/admin", "/zh/admin"]
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
