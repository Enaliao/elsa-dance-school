"use client";

import Link from "next/link";
import type { Locale } from "@/lib/types";

const labels: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  zh: "中文"
};

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  return (
    <div className="flex rounded-md border border-black/15 bg-white p-1 text-sm font-semibold text-ink">
      {(["en", "fr", "zh"] as Locale[]).map((item) => (
        <Link
          key={item}
          href={`/${item}`}
          className={`rounded px-2 py-1 ${item === locale ? "bg-ink text-white" : "text-black/65"}`}
          aria-label={`Switch to ${item}`}
        >
          {labels[item]}
        </Link>
      ))}
    </div>
  );
}
