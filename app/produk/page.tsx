import type { Metadata } from "next";
import Link from "next/link";
import { productHighlights } from "../../lib/landing-content";
import { LandingHeader } from "../landing-header";

const productSections = [
  {
    title: "Untuk pemilik klinik",
    description:
      "Pantau operasional, layanan, dan pertumbuhan klinik dari satu dashboard yang mudah dipahami tanpa harus membuka banyak sistem.",
  },
  {
    title: "Untuk admin dan kasir",
    description:
      "Rapikan pendaftaran pasien, antrean, pembayaran, invoice, dan proses administrasi harian dalam alur kerja yang lebih cepat.",
  },
  {
    title: "Untuk dokter dan tim medis",
    description:
      "Akses data pasien, jadwal praktik, dan riwayat layanan dari sistem yang sama sehingga koordinasi antar tim lebih konsisten.",
  },
];

export const metadata: Metadata = {
  title: "Produk Aplikasi Klinik Online untuk Operasional Klinik",
  description:
    "Pelajari produk Klinik RME untuk pendaftaran pasien, antrean, jadwal dokter, kasir, laporan, dan rekam medis elektronik dalam satu aplikasi klinik online.",
  keywords: [
    "produk aplikasi klinik",
    "software klinik online",
    "sistem operasional klinik",
    "rekam medis elektronik klinik",
  ],
  alternates: {
    canonical: "/produk",
  },
};

export default function ProdukPage() {
  return (
    <main className="page-shell">
      <section className="hero-section">
        <LandingHeader />

        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Produk Klinik RME</span>
            <h1>Produk aplikasi klinik online yang membantu operasional harian lebih rapi dan terukur.</h1>
            <p>
              Klinik RME dirancang sebagai software klinik untuk membantu klinik
              menjalankan pendaftaran pasien, antrean, layanan dokter, kasir,
              laporan, dan rekam medis elektronik dalam satu sistem berbasis cloud.
            </p>
            <div className="cta-actions">
              <Link href="/fitur" className="primary-button">
                Lihat Fitur
              </Link>
              <Link href="/signup" className="ghost-button">
                Coba Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-panel">
        <div className="section-heading">
          <span className="eyebrow">Ringkasan Produk</span>
          <h2>Satu sistem untuk alur pasien, tim klinik, dan pengawasan bisnis.</h2>
          <p>
            Halaman ini menjelaskan bagaimana produk Klinik RME dipakai oleh
            berbagai peran di klinik, dari pemilik sampai tim operasional harian.
          </p>
        </div>

        <div className="highlight-grid">
          {productHighlights.map((item) => (
            <article key={item.title} className="info-card">
              <div className="icon-chip" />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="feature-panel">
        <div className="section-heading">
          <span className="eyebrow">Use Case</span>
          <h2>Produk yang cocok untuk operasional klinik dari berbagai sisi.</h2>
        </div>

        <div className="highlight-grid">
          {productSections.map((section) => (
            <article key={section.title} className="info-card">
              <h3>{section.title}</h3>
              <p>{section.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div>
          <span className="eyebrow">Lanjutkan</span>
          <h2>Ingin melihat modul yang tersedia lebih detail?</h2>
          <p>
            Lanjut ke halaman fitur untuk melihat bagaimana sistem ini membantu
            operasional pasien, dokter, kasir, dan laporan klinik.
          </p>
        </div>
        <div className="cta-actions">
          <Link href="/fitur" className="primary-button">
            Buka Halaman Fitur
          </Link>
          <Link href="/harga" className="ghost-button ghost-inverse">
            Lihat Harga
          </Link>
        </div>
      </section>
    </main>
  );
}
