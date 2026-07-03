import type { MetadataRoute } from "next";
import { locales } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.elsadanceschool.ca";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: locale === "en" ? 1 : 0.8
  }));
}
