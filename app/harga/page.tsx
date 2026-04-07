import type { Metadata } from "next";
import Link from "next/link";
import { listSubscriptionPricings } from "../../lib/landlord/list-subscription-pricings";
import { formatRupiah, mapPricingForDisplay } from "../../lib/landing-content";
import { LandingHeader } from "../landing-header";

export const metadata: Metadata = {
  title: "Harga Software Klinik dan Paket Aplikasi Klinik Online",
  description:
    "Lihat harga Klinik RME untuk paket Basic, Advance, dan Pro. Bandingkan paket aplikasi klinik online sesuai kebutuhan operasional klinik Anda.",
  keywords: [
    "harga aplikasi klinik",
    "harga software klinik",
    "paket aplikasi klinik",
    "biaya software klinik",
  ],
  alternates: {
    canonical: "/harga",
  },
};

export default async function HargaPage() {
  const subscriptionPricings = await listSubscriptionPricings();
  const pricing = mapPricingForDisplay(subscriptionPricings);

  return (
    <main className="page-shell">
      <section className="hero-section">
        <LandingHeader />

        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Harga Klinik RME</span>
            <h1>Harga software klinik yang jelas, fleksibel, dan siap dipilih sesuai kebutuhan.</h1>
            <p>
              Bandingkan paket aplikasi klinik online untuk tahap awal,
              pertumbuhan operasional, sampai kebutuhan integrasi layanan yang lebih luas.
            </p>
          </div>
        </div>
      </section>

      <section className="pricing-section">
        <div className="section-heading centered">
          <span className="eyebrow">Paket Berlangganan</span>
          <h2>Tiga paket untuk membantu klinik memilih level operasional yang paling pas.</h2>
          <p>
            Anda bisa mulai dari paket yang paling sesuai dengan ukuran tim,
            kebutuhan laporan, dan target pengembangan klinik.
          </p>
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

      <section className="cta-section">
        <div>
          <span className="eyebrow">Butuh penjelasan tambahan?</span>
          <h2>Lihat FAQ atau mulai daftar sekarang.</h2>
          <p>
            Kalau Anda masih membandingkan paket, lihat halaman FAQ atau mulai
            trial untuk mencoba alur kerja Klinik RME langsung.
          </p>
        </div>
        <div className="cta-actions">
          <Link href="/faq" className="ghost-button ghost-inverse">
            Buka FAQ
          </Link>
          <Link href="/signup" className="primary-button">
            Coba Sekarang
          </Link>
        </div>
      </section>
    </main>
  );
}
