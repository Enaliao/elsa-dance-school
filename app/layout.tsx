import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.elsadanceschool.ca";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Elsa Dance School | Montreal",
    template: "%s | Elsa Dance School"
  },
  description:
    "Chinese dance, contemporary, K-pop, private lessons, and summer camp in Montreal.",
  alternates: {
    canonical: "/en",
    languages: {
      en: "/en",
      fr: "/fr",
      zh: "/zh"
    }
  },
  openGraph: {
    title: "Elsa Dance School | Montreal",
    description:
      "Chinese dance, contemporary, K-pop, private lessons, and summer camp in Montreal.",
    url: "/en",
    siteName: "Elsa Dance School",
    images: [
      {
        url: "/photos/optimized-group-photo.jpg",
        width: 1800,
        height: 900,
        alt: "Elsa Dance School gala group photo"
      }
    ],
    locale: "en_CA",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Elsa Dance School | Montreal",
    description:
      "Chinese dance, contemporary, K-pop, private lessons, and summer camp in Montreal.",
    images: ["/photos/optimized-group-photo.jpg"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
