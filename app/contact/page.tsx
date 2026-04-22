import type { Metadata } from "next";
import Link from "next/link";
import { LandingHeader } from "../landing-header";

export const metadata: Metadata = {
  title: "Hubungi Kami Klinik RME",
  description:
    "Hubungi tim Klinik RME untuk tanya produk, demo, langganan, pembayaran, atau bantuan awal sebelum mulai menggunakan layanan.",
  keywords: [
    "hubungi kami klinik rme",
    "hubungi aplikasi klinik",
    "kontak software klinik",
    "whatsapp klinik rme",
  ],
  alternates: {
    canonical: "/contact",
  },
};

const whatsappHref = "https://wa.me/62895405795064";

const contactReasons = [
  {
    title: "Tanya produk dan fitur",
    description:
      "Cocok untuk calon pengguna yang ingin memahami modul pasien, antrean, kasir, laporan, atau alur kerja Klinik RME.",
  },
  {
    title: "Diskusi paket dan langganan",
    description:
      "Bantu bandingkan paket, masa trial, aktivasi tenant, dan kebutuhan klinik sebelum mulai berlangganan.",
  },
  {
    title: "Pembayaran dan invoice",
    description:
      "Bisa dipakai untuk konfirmasi pembayaran, kendala transaksi, status aktivasi, atau pertanyaan awal terkait refund.",
  },
  {
    title: "Bantuan awal penggunaan",
    description:
      "Jika baru mulai memakai sistem dan ingin dibantu memahami langkah pertama, tim bisa mengarahkan alur yang paling relevan.",
  },
  {
    title: "Kerja sama dan pertanyaan umum",
    description:
      "Jika ada kebutuhan kerja sama, demo, atau permintaan informasi umum, halaman ini menjadi titik kontak awal yang paling cepat.",
  },
  {
    title: "Kendala akses akun",
    description:
      "Cocok untuk pertanyaan non-teknis seputar akses awal, aktivasi, atau alur pemulihan akun sebelum masuk ke dashboard.",
  },
];

const contactSteps = [
  "Siapkan nama klinik atau nama akun agar tim lebih cepat mengecek konteks Anda.",
  "Tuliskan kebutuhan utama Anda, misalnya demo, pertanyaan paket, invoice, atau kendala pembayaran.",
  "Jika terkait transaksi, sertakan tanggal pembayaran, nominal, dan bukti pembayaran bila tersedia.",
];

export default function ContactPage() {
  return (
    <main className="page-shell">
      <section className="hero-section">
        <LandingHeader />

        <div className="hero-grid legal-hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Hubungi Kami</span>
            <h1>Hubungi tim Klinik RME untuk pertanyaan produk, langganan, dan bantuan awal.</h1>
            <p>
              Kalau Anda ingin tanya fitur, paket, pembayaran, trial, atau ingin
              dibantu menentukan alur penggunaan yang paling cocok, halaman ini
              adalah titik kontak tercepat untuk mulai ngobrol dengan tim kami.
            </p>
          </div>

          <div className="mini-card legal-summary-card">
            <span className="card-label">Kontak utama</span>
            <strong>WhatsApp Klinik RME</strong>
            <p>
              Gunakan WhatsApp untuk pertanyaan awal, follow-up transaksi, atau
              diskusi singkat sebelum mulai memakai layanan.
            </p>
            <Link
              href={whatsappHref}
              className="primary-button"
              target="_blank"
              rel="noreferrer"
            >
              Hubungi via WhatsApp
            </Link>
          </div>
        </div>
      </section>

      <section className="feature-panel" aria-labelledby="contact-reasons-heading">
        <div className="section-heading">
          <span className="eyebrow">Bisa Dibantu Apa?</span>
          <h2 id="contact-reasons-heading">Alasan paling umum pengguna menghubungi tim kami.</h2>
          <p>
            Kami sengaja merangkum kebutuhan yang paling sering muncul supaya
            calon pengguna dan pelanggan bisa cepat tahu apakah pertanyaannya
            cocok disampaikan melalui halaman ini.
          </p>
        </div>

        <div className="highlight-grid legal-highlight-grid">
          {contactReasons.map((item) => (
            <article key={item.title} className="info-card">
              <div className="icon-chip" />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-section legal-sections" aria-labelledby="contact-steps-heading">
        <div className="section-heading">
          <span className="eyebrow">Sebelum Menghubungi</span>
          <h2 id="contact-steps-heading">Informasi singkat yang sebaiknya disiapkan agar respon lebih cepat.</h2>
          <p>
            Anda tidak harus menulis panjang. Cukup kirim konteks dasar agar tim
            bisa membantu tanpa bolak-balik pertanyaan yang sama.
          </p>
        </div>

        <div className="pricing-grid legal-grid">
          {contactSteps.map((item) => (
            <article key={item} className="pricing-card legal-card">
              <div className="legal-copy">
                <p>{item}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div>
          <span className="eyebrow">Lanjutkan</span>
          <h2>Ingin lihat detail dulu atau langsung mulai?</h2>
          <p>
            Kalau Anda masih membandingkan pilihan, buka FAQ dan halaman harga.
            Kalau sudah siap, Anda bisa langsung daftar dan lanjutkan dari sana.
          </p>
        </div>
        <div className="cta-actions">
          <Link href="/faq" className="ghost-button ghost-inverse">
            Buka FAQ
          </Link>
          <Link href="/signup" className="primary-button">
            Buat Akun
          </Link>
        </div>
      </section>
    </main>
  );
}
