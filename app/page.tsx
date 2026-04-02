import Link from "next/link";
import { MobileHeaderMenu } from "./mobile-header-menu";

const productHighlights = [
  {
    title: "Cabang klinik siap dipakai",
    description:
      "Setiap klinik mendapatkan alamat login sendiri agar operasional lebih rapi, aman, dan mudah diakses oleh tim.",
  },
  {
    title: "Pelayanan sampai pembayaran",
    description:
      "Atur pendaftaran pasien, jadwal dokter, antrean, transaksi, dan riwayat layanan dalam satu sistem yang mudah dipakai.",
  },
  {
    title: "Laporan selalu terpantau",
    description:
      "Pantau jumlah kunjungan pasien, performa layanan, dan pendapatan harian langsung dari dashboard.",
  },
];

const features = [
  "Setiap klinik punya alamat login sendiri",
  "Pendaftaran pasien dan antrean digital",
  "Jadwal dokter dan layanan terintegrasi",
  "Kasir, invoice, dan laporan operasional",
];

const pricing = [
  {
    name: "Basic",
    price: "Rp199K",
    suffix: "/bulan",
    description: "Pilihan hemat untuk klinik yang ingin mulai digitalisasi operasional harian.",
    items: [
      "1 alamat login klinik",
      "Manajemen pasien dan antrean",
      "Kasir dan invoice",
      "Laporan operasional dasar",
      "Bantuan via email",
    ],
    accent: "light",
  },
  {
    name: "Advance",
    price: "Rp249K",
    suffix: "/bulan",
    description: "Paket unggulan untuk klinik yang butuh operasional lengkap, analitik, dan kontrol bisnis lebih kuat.",
    items: [
      "Akses untuk banyak staf",
      "Dashboard laporan harian lengkap",
      "Pengaturan dokter dan layanan",
      "Modul laboratorium",
      "Analisis time visit rate pasien",
      "Perhitungan insentif praktisioner",
      "Rekap billing dalam format Excel",
      "Rekap jumlah kunjungan pasien (Excel)",
      "Bantuan prioritas",
    ],
    accent: "light",
  },
  {
    name: "Pro",
    price: "Rp299K",
    suffix: "/bulan",
    description: "Paket lengkap untuk klinik yang butuh semua fitur Advance ditambah integrasi layanan kesehatan nasional.",
    items: [
      "Akses untuk banyak staf",
      "Dashboard laporan harian lengkap",
      "Pengaturan dokter dan layanan",
      "Modul laboratorium",
      "Analisis time visit rate pasien",
      "Perhitungan insentif praktisioner",
      "Rekap billing dalam format Excel",
      "Rekap jumlah kunjungan pasien (Excel)",
      "Integrasi Satu Sehat",
      // "Integrasi BPJS",
      "Bantuan prioritas",
    ],
    accent: "featured",
  },
];

const stats = [
  { value: "24/7", label: "akses cloud untuk operasional klinik" },
  { value: "< 5 mnt", label: "waktu aktif tenant baru" },
  { value: "1 panel", label: "untuk admin, kasir, dan dokter" },
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Klinik RME",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Aplikasi klinik berbasis cloud untuk mengelola pasien, jadwal dokter, pembayaran, dan laporan dalam satu sistem.",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "IDR",
      lowPrice: "199000",
      highPrice: "299000",
    },
  };

  return (
    <main className="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="hero-section">
        <div className="nav-wrap">
          <div className="brand-mark">
            <span className="brand-logo">+</span>
            <div>
              <p>Klinik RME</p>
              <span>Solusi Digital untuk Klinik Modern</span>
            </div>
          </div>
          <nav className="nav-links" aria-label="Navigasi utama">
            <a href="#produk">Produk</a>
            <a href="#fitur">Fitur</a>
            <a href="#harga">Harga</a>
            <Link href="/login">Login</Link>
          </nav>
          <div className="nav-actions">
            <Link className="ghost-button" href="/login">
              Login
            </Link>
            <Link className="primary-button" href="/signup">
              Coba Sekarang
            </Link>
          </div>
          <MobileHeaderMenu />
        </div>

        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Aplikasi Klinik Berbasis Cloud</span>
            <h1>
              Operasional klinik lebih rapi, cepat, dan nyaman untuk seluruh tim.
            </h1>
            <p>
              Kelola pendaftaran pasien, antrean, jadwal dokter, kasir, dan
              laporan harian dalam satu aplikasi. Setiap klinik juga mendapat
              alamat login sendiri agar akses lebih mudah dan profesional.
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
                  <strong>klinik.clinicrme.my.id</strong>
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
              <strong>klinik.clinicrme.my.id</strong>
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
          <span className="eyebrow">Kenapa pilih Klinik RME</span>
          <h2>Tampilan mudah dipahami, alur kerja jelas, dan membantu klinik bekerja lebih efisien.</h2>
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
                <strong>{plan.price}</strong>
                <span>{plan.suffix}</span>
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
