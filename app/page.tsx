import type { Metadata } from "next";
import Link from "next/link";
import {
  listSubscriptionPricings,
} from "../lib/landlord/list-subscription-pricings";
import {
  faqs,
  features,
  formatRupiah,
  mapPricingForDisplay,
  productHighlights,
  stats,
} from "../lib/landing-content";
import { LandingHeader } from "./landing-header";

export const metadata: Metadata = {
  title: "Aplikasi Klinik Online, RME, dan Sistem Manajemen Klinik",
  description:
    "Klinik RME adalah aplikasi klinik online dan software klinik untuk pendaftaran pasien, antrean, jadwal dokter, kasir, laporan, dan rekam medis elektronik dalam satu sistem yang mudah dipakai.",
  keywords: [
    "aplikasi klinik online",
    "software klinik",
    "sistem manajemen klinik",
    "rekam medis elektronik",
    "rekam medis elektronik klinik",
    "aplikasi pendaftaran pasien",
    "aplikasi antrean pasien",
    "software manajemen klinik",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Aplikasi Klinik Online untuk Operasional dan Rekam Medis Elektronik",
    description:
      "Kelola pasien, antrean, dokter, kasir, laporan, dan rekam medis elektronik klinik dalam satu aplikasi berbasis cloud.",
    url: "/",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    title: "Aplikasi Klinik Online untuk Operasional Harian",
    description:
      "Software klinik berbasis cloud untuk operasional klinik, antrean pasien, jadwal dokter, kasir, dan laporan.",
  },
};

export default async function HomePage() {
  const subscriptionPricings = await listSubscriptionPricings();
  const pricing = mapPricingForDisplay(subscriptionPricings);
  const monthlyAmounts = pricing.map((plan) => plan.monthlyAmount).filter((amount) => amount > 0);
  const lowPrice = monthlyAmounts.length > 0 ? String(Math.min(...monthlyAmounts)) : "199000";
  const highPrice = monthlyAmounts.length > 0 ? String(Math.max(...monthlyAmounts)) : "299000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Klinik RME",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description:
          "Aplikasi klinik berbasis cloud untuk mengelola pasien, antrean, jadwal dokter, pembayaran, laporan, dan rekam medis elektronik dalam satu sistem.",
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "IDR",
          lowPrice,
          highPrice,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <main className="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="hero-section">
        <LandingHeader />

        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Aplikasi Klinik Berbasis Cloud</span>
            <h1>
              Aplikasi klinik online untuk operasional, antrean pasien, rekam medis elektronik, dan manajemen klinik.
            </h1>
            <p>
              Kelola pendaftaran pasien, antrean, jadwal dokter, kasir, laporan
              harian, dan rekam medis elektronik dalam satu software klinik dan
              sistem manajemen klinik yang mudah dipakai. Setiap klinik juga
              mendapat alamat login sendiri agar akses lebih profesional dan rapi
              untuk seluruh tim.
            </p>
            <ul className="hero-points" aria-label="Nilai utama produk">
              {features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="hero-card-wrap" aria-hidden="true">
            <div className="dashboard-card floating-card">
              <div className="dashboard-top">
                <div>
                  <span className="card-label">Akun klinik aktif</span>
                  <strong>klinik.klinikrme.id</strong>
                </div>
                <span className="status-pill">Online</span>
              </div>

              <div className="metric-grid">
                <div>
                  <span>Pasien hari ini</span>
                  <strong>128</strong>
                </div>
                <div>
                  <span>Dokter bertugas</span>
                  <strong>06</strong>
                </div>
                <div>
                  <span>Pendapatan</span>
                  <strong>Rp18,4jt</strong>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-head">
                  <span>Pertumbuhan kunjungan</span>
                  <strong>+23%</strong>
                </div>
                <div className="chart-bars">
                  <span style={{ height: "34%" }} />
                  <span style={{ height: "48%" }} />
                  <span style={{ height: "57%" }} />
                  <span style={{ height: "76%" }} />
                  <span style={{ height: "88%" }} />
                </div>
              </div>
            </div>

            <div className="mini-card">
              <span className="card-label">Akses login klinik</span>
              <strong>klinik.klinikrme.id</strong>
              <p>Masuk lebih cepat untuk admin, kasir, dan dokter.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-notice landing-notice" aria-label="Informasi promo">
        <div>
          <span className="eyebrow">Info Penting</span>
          <h2>Coba gratis 7 hari untuk mulai lebih tenang.</h2>
          <p>
            Gunakan masa coba gratis ini untuk menyiapkan klinik Anda,
            mencoba alur kerja harian, dan memastikan tim Anda nyaman sebelum
            melanjutkan ke tahap berikutnya.
          </p>
        </div>
        <p className="dashboard-notice-copy">
          Anda bisa mulai tanpa komitmen awal, lalu lanjutkan saat sudah yakin
          sistem ini cocok untuk kebutuhan klinik Anda.
        </p>
      </section>

      <section className="feature-panel" id="produk">
        <div className="section-heading">
          <span className="eyebrow">Produk</span>
          <h2>Satu aplikasi untuk melayani pasien dan menjalankan operasional klinik setiap hari.</h2>
          <p>
            Dirancang agar mudah dipahami pemilik klinik, staf administrasi,
            kasir, dan dokter sejak hari pertama penggunaan.
          </p>
          <Link href="/produk" className="ghost-button">
            Lihat halaman Produk
          </Link>
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

      <section className="stats-section" id="fitur">
        <div className="stats-copy">
          <span className="eyebrow">Fitur</span>
          <h2>Tampilan mudah dipahami, alur kerja jelas, dan membantu klinik bekerja lebih efisien.</h2>
          <p>
            Lihat lebih detail bagaimana modul pasien, antrean, dokter, kasir,
            laporan, dan akses multi-staf membantu operasional klinik.
          </p>
          <Link href="/fitur" className="ghost-button">
            Lihat halaman Fitur
          </Link>
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

      <section className="workflow-section">
        <div className="section-heading inverted">
          <span className="eyebrow">Cara Mulai</span>
          <h2>Dari pilih paket sampai mulai melayani pasien, semuanya dibuat sederhana.</h2>
        </div>

        <div className="workflow-grid">
          <article className="workflow-card">
            <span>1</span>
            <h3>Pilih paket</h3>
            <p>Pilih paket sesuai kebutuhan operasional dan skala klinik Anda.</p>
          </article>
          <article className="workflow-card">
            <span>2</span>
            <h3>Aktifkan akun klinik</h3>
            <p>Klinik Anda akan mendapatkan akses login sendiri yang siap digunakan oleh tim.</p>
          </article>
          <article className="workflow-card">
            <span>3</span>
            <h3>Mulai operasional</h3>
            <p>Tim Anda bisa langsung mengelola pasien, antrean, dokter, dan pembayaran dalam satu aplikasi.</p>
          </article>
        </div>
      </section>

      <section className="pricing-section" id="harga">
        <div className="section-heading centered">
          <span className="eyebrow">Harga</span>
          <h2>Tiga paket jelas, mudah dipilih, dan siap dipakai sesuai tahap klinik Anda.</h2>
          <p>
            Mulai dari Basic, lanjut ke Advance untuk operasional yang lebih lengkap,
            lalu pilih Pro saat klinik Anda membutuhkan integrasi Satu Sehat dan BPJS.
          </p>
          <Link href="/harga" className="ghost-button ghost-inverse">
            Lihat halaman Harga
          </Link>
        </div>

        <div className="pricing-grid">
          {pricing.map((plan) => (
            <article
              key={plan.name}
              className={`pricing-card ${plan.accent === "featured" ? "featured" : ""}`}
            >
              <div>
                {plan.accent === "featured" ? <span className="eyebrow">Paling Populer</span> : null}
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
              </div>
              <div className="price-line">
                <strong>{formatRupiah(plan.monthlyAmount)}</strong>
                <span>/bulan</span>
              </div>
              <div className="price-line">
                <strong>{formatRupiah(plan.yearlyAmount)}</strong>
                <span>/tahun</span>
              </div>
              <ul>
                {plan.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link href="/signup" className="plan-button">
                {"Pilih " + plan.name}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="feature-panel" id="faq" aria-labelledby="faq-heading">
        <div className="section-heading">
          <span className="eyebrow">FAQ</span>
          <h2 id="faq-heading">Pertanyaan yang sering dicari sebelum memilih aplikasi klinik.</h2>
          <p>
            Bagian ini membantu calon pengguna memahami fungsi software klinik,
            kecocokan penggunaan, dan fitur utama yang tersedia.
          </p>
          <Link href="/faq" className="ghost-button">
            Lihat halaman FAQ
          </Link>
        </div>

        <div className="highlight-grid">
          {faqs.map((faq) => (
            <article key={faq.question} className="info-card">
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section" id="login">
        <div>
          <span className="eyebrow">Login Klinik</span>
          <h2>Sudah terdaftar? Masuk ke akun klinik Anda sekarang.</h2>
          <p>
            Tim admin, kasir, dan dokter bisa masuk ke sistem klinik untuk
            melanjutkan operasional harian.
          </p>
        </div>
        <div className="cta-actions">
          <Link href="/login" className="primary-button">
            Login Sekarang
          </Link>
          <Link href="/signup" className="ghost-button ghost-inverse">
            Daftar Sekarang
          </Link>
        </div>
      </section>
    </main>
  );
}
