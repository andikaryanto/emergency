import type { Metadata } from "next";
import Link from "next/link";
import { features, stats } from "../../lib/landing-content";
import { LandingHeader } from "../landing-header";

const featureModules = [
  {
    title: "Pendaftaran pasien dan antrean",
    description:
      "Permudah proses registrasi pasien dan bantu tim melihat alur antrean layanan secara lebih teratur.",
  },
  {
    title: "Jadwal dokter dan layanan",
    description:
      "Atur jadwal praktik, layanan, dan koordinasi tim agar operasional klinik berjalan lebih konsisten.",
  },
  {
    title: "Kasir, invoice, dan billing",
    description:
      "Kelola transaksi, rekap pembayaran, dan dokumen tagihan dari satu sistem yang lebih rapi.",
  },
  {
    title: "Laporan operasional",
    description:
      "Pantau kunjungan pasien, pendapatan, dan performa layanan dengan dashboard yang bisa dipakai untuk evaluasi harian.",
  },
];

export const metadata: Metadata = {
  title: "Fitur Aplikasi Klinik untuk Pasien, Dokter, Kasir, dan Laporan",
  description:
    "Lihat fitur Klinik RME untuk pendaftaran pasien, antrean digital, jadwal dokter, kasir, invoice, laporan operasional, dan rekam medis elektronik klinik.",
  keywords: [
    "fitur aplikasi klinik",
    "fitur software klinik",
    "aplikasi antrean pasien",
    "aplikasi kasir klinik",
    "laporan operasional klinik",
  ],
  alternates: {
    canonical: "/fitur",
  },
};

export default function FiturPage() {
  return (
    <main className="page-shell">
      <section className="hero-section">
        <LandingHeader />

        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Fitur Klinik RME</span>
            <h1>Fitur software klinik untuk pasien, dokter, kasir, dan laporan operasional.</h1>
            <p>
              Halaman ini merangkum fitur utama aplikasi klinik online yang
              membantu digitalisasi proses pelayanan dan pengelolaan klinik.
            </p>
            <ul className="hero-points" aria-label="Fitur utama Klinik RME">
              {features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="feature-panel">
        <div className="section-heading">
          <span className="eyebrow">Modul Utama</span>
          <h2>Fitur yang paling sering dipakai untuk mendukung operasional klinik.</h2>
        </div>

        <div className="highlight-grid">
          {featureModules.map((module) => (
            <article key={module.title} className="info-card">
              <h3>{module.title}</h3>
              <p>{module.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-copy">
          <span className="eyebrow">Nilai Tambah</span>
          <h2>Cloud-based, cepat diakses, dan membantu klinik berkembang lebih terukur.</h2>
        </div>
        <div className="stats-grid">
          {stats.map((stat) => (
            <article key={stat.value} className="stat-card">
              <strong>{stat.value}</strong>
              <p>{stat.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div>
          <span className="eyebrow">Berikutnya</span>
          <h2>Sudah cocok dengan kebutuhan klinik Anda?</h2>
          <p>
            Lanjut lihat halaman harga untuk membandingkan paket yang tersedia
            dan memilih paket terbaik untuk tahap klinik Anda saat ini.
          </p>
        </div>
        <div className="cta-actions">
          <Link href="/harga" className="primary-button">
            Buka Halaman Harga
          </Link>
          <Link href="/faq" className="ghost-button ghost-inverse">
            Lihat FAQ
          </Link>
        </div>
      </section>
    </main>
  );
}
