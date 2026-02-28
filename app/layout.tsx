import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const siteUrl = "https://klinikku.id";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Klinikku Cloud | SaaS Klinik dengan Tenant Subdomain Sendiri",
    template: "%s | Klinikku Cloud",
  },
  description:
    "Klinikku Cloud adalah aplikasi SaaS klinik yang memungkinkan setiap klinik membuat tenant dan subdomain sendiri untuk operasional harian, manajemen pasien, kasir, jadwal dokter, dan laporan.",
  keywords: [
    "saas klinik",
    "aplikasi klinik",
    "software klinik",
    "tenant subdomain klinik",
    "manajemen klinik",
    "rekam medis digital",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Klinikku Cloud",
    description:
      "Landing page SaaS klinik modern untuk tenant mandiri, subdomain sendiri, dan operasional klinik yang lebih rapi.",
    url: siteUrl,
    siteName: "Klinikku Cloud",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Klinikku Cloud",
    description:
      "SaaS klinik dengan tenant mandiri, subdomain sendiri, pricing fleksibel, dan dashboard operasional modern.",
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${manrope.variable} ${spaceGrotesk.variable}`}>
        {children}
      </body>
    </html>
  );
}
