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
    default: "Klinik RME | Aplikasi Klinik Online untuk Operasional Harian",
    template: "%s | Klinik RME",
  },
  description:
    "Klinik RME adalah aplikasi klinik online untuk mengelola pasien, antrean, jadwal dokter, kasir, dan laporan harian dengan lebih mudah.",
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
    title: "Klinik RME",
    description:
      "Aplikasi klinik online untuk membantu operasional lebih rapi, cepat, dan mudah dipakai oleh seluruh tim.",
    url: siteUrl,
    siteName: "Klinik RME",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Klinik RME",
    description:
      "Aplikasi klinik online dengan harga fleksibel dan dashboard yang mudah dipakai untuk operasional harian.",
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
