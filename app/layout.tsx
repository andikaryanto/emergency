import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { env } from "../lib/env";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const siteUrl = env.appUrl;
const isStaging = env.appEnv === "staging";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${env.appName} | Aplikasi Klinik Online untuk Operasional Harian`,
    template: `%s | ${env.appName}`,
  },
  description:
    `${env.appName} adalah aplikasi klinik online untuk mengelola pasien, antrean, jadwal dokter, kasir, dan laporan harian dengan lebih mudah.`,
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
    title: env.appName,
    description:
      "Aplikasi klinik online untuk membantu operasional lebih rapi, cepat, dan mudah dipakai oleh seluruh tim.",
    url: siteUrl,
    siteName: env.appName,
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: env.appName,
    description:
      "Aplikasi klinik online dengan harga fleksibel dan dashboard yang mudah dipakai untuk operasional harian.",
  },
  robots: {
    index: !isStaging,
    follow: !isStaging,
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
