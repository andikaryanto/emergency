import type { Metadata } from "next";
import Link from "next/link";
import { faqs } from "../../lib/landing-content";
import { LandingHeader } from "../landing-header";

export const metadata: Metadata = {
  title: "FAQ Aplikasi Klinik, Software Klinik, dan Rekam Medis Elektronik",
  description:
    "Baca FAQ Klinik RME tentang aplikasi klinik online, software klinik, akses login klinik, fitur utama, dan kecocokan penggunaan untuk operasional harian.",
  keywords: [
    "faq aplikasi klinik",
    "faq software klinik",
    "pertanyaan aplikasi klinik",
    "rekam medis elektronik klinik",
  ],
  alternates: {
    canonical: "/faq",
  },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
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
            <span className="eyebrow">FAQ Klinik RME</span>
            <h1>Pertanyaan yang sering muncul sebelum memilih aplikasi klinik online.</h1>
            <p>
              Halaman ini membantu calon pengguna memahami produk, fitur, akses,
              dan kecocokan software klinik untuk operasional harian.
            </p>
          </div>
        </div>
      </section>

      <section className="feature-panel" aria-labelledby="faq-list-heading">
        <div className="section-heading">
          <span className="eyebrow">Pertanyaan Umum</span>
          <h2 id="faq-list-heading">Jawaban cepat untuk pertanyaan yang sering dicari.</h2>
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

      <section className="cta-section">
        <div>
          <span className="eyebrow">Masih ingin lihat detail?</span>
          <h2>Lanjutkan ke halaman fitur atau harga.</h2>
          <p>
            Setelah membaca FAQ, Anda bisa melihat detail modul yang tersedia
            atau membandingkan paket sesuai kebutuhan klinik.
          </p>
        </div>
        <div className="cta-actions">
          <Link href="/fitur" className="primary-button">
            Buka Halaman Fitur
          </Link>
          <Link href="/harga" className="ghost-button ghost-inverse">
            Buka Halaman Harga
          </Link>
        </div>
      </section>
    </main>
  );
}
