import Link from "next/link";

const productHighlights = [
  {
    title: "Buat tenant instan",
    description:
      "Setiap klinik dapat membuat ruang kerja sendiri dengan subdomain unik untuk operasional yang terpisah dan aman.",
  },
  {
    title: "Front office sampai billing",
    description:
      "Kelola pendaftaran pasien, jadwal dokter, antrean, transaksi, dan histori layanan dalam satu alur kerja.",
  },
  {
    title: "Data real-time",
    description:
      "Pantau performa cabang, kunjungan pasien, dan pendapatan harian dari dashboard yang ringan dan responsif.",
  },
];

const features = [
  "Tenant klinik dengan subdomain sendiri",
  "Pendaftaran pasien dan antrean digital",
  "Jadwal dokter dan layanan terintegrasi",
  "Kasir, invoice, dan laporan operasional",
];

const pricing = [
  {
    name: "Starter",
    price: "Rp299rb",
    suffix: "/bulan",
    description: "Untuk klinik baru yang butuh tenant mandiri dan operasional dasar.",
    items: [
      "1 tenant subdomain klinik",
      "Manajemen pasien dan antrean",
      "Kasir dan invoice",
      "Support email",
    ],
    accent: "light",
  },
  {
    name: "Growth",
    price: "Rp799rb",
    suffix: "/bulan",
    description: "Untuk klinik aktif yang perlu workflow lebih lengkap dan insight bisnis.",
    items: [
      "Multi-user dan role staff",
      "Dashboard laporan harian",
      "Pengaturan layanan dan dokter",
      "Priority support",
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
    name: "Klinikku Cloud",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Aplikasi SaaS klinik dengan tenant dan subdomain mandiri untuk mengelola pasien, jadwal dokter, billing, dan laporan.",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "IDR",
      lowPrice: "299000",
      highPrice: "799000",
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
              <p>Klinikku Cloud</p>
              <span>SaaS Operasional Klinik</span>
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
            <a className="primary-button" href="#harga">
              Coba Sekarang
            </a>
          </div>
        </div>

        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Platform SaaS Klinik Multi Tenant</span>
            <h1>
              Jual layanan klinik digital dengan tenant dan subdomain yang bisa
              aktif sendiri.
            </h1>
            <p>
              Landing page ini dirancang untuk menjual aplikasi klinik berbasis
              cloud. Calon pelanggan bisa melihat produk, memahami harga, lalu
              masuk ke tenant mereka lewat subdomain masing-masing.
            </p>

            <form className="hero-form">
              <label className="sr-only" htmlFor="business-email">
                Email bisnis
              </label>
              <input
                id="business-email"
                type="email"
                placeholder="Email bisnis klinik"
              />
              <button type="submit">Jadwalkan Demo</button>
            </form>

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
                  <span className="card-label">Tenant aktif</span>
                  <strong>klinik-sehat.klinikku.id</strong>
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
              <span className="card-label">Akses tenant</span>
              <strong>login.klinik-sehat.id</strong>
              <p>Masuk cepat untuk admin, kasir, dan dokter.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-panel" id="produk">
        <div className="section-heading">
          <span className="eyebrow">Produk</span>
          <h2>Satu platform klinik untuk onboarding tenant hingga operasional harian.</h2>
          <p>
            Cocok untuk model SaaS klinik yang ingin scale tanpa membingungkan
            pengguna baru saat registrasi tenant.
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
          <span className="eyebrow">Kenapa cocok untuk klinik</span>
          <h2>Desain onboarding jelas, dashboard rapi, dan siap dipakai sebagai mesin penjualan SaaS.</h2>
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
          <span className="eyebrow">Alur Produk</span>
          <h2>Dari daftar tenant sampai login ke subdomain, semua terasa sederhana.</h2>
        </div>

        <div className="workflow-grid">
          <article className="workflow-card">
            <span>1</span>
            <h3>Pilih paket</h3>
            <p>Calon pelanggan melihat paket layanan dan memilih kebutuhan kliniknya.</p>
          </article>
          <article className="workflow-card">
            <span>2</span>
            <h3>Buat tenant</h3>
            <p>Sistem menyiapkan tenant dan subdomain untuk klinik yang baru bergabung.</p>
          </article>
          <article className="workflow-card">
            <span>3</span>
            <h3>Masuk dan operasikan</h3>
            <p>Tim klinik login ke subdomain masing-masing lalu mulai mengelola layanan.</p>
          </article>
        </div>
      </section>

      <section className="pricing-section" id="harga">
        <div className="section-heading centered">
          <span className="eyebrow">Harga</span>
          <h2>Paket simpel untuk mulai jual aplikasi klinik Anda.</h2>
          <p>
            Struktur harga dibuat jelas agar visitor cepat paham lalu lanjut ke
            demo atau login.
          </p>
        </div>

        <div className="pricing-grid">
          {pricing.map((plan) => (
            <article
              key={plan.name}
              className={`pricing-card ${plan.accent === "featured" ? "featured" : ""}`}
            >
              <div>
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
              <Link href="/login" className="plan-button">
                Pilih Paket
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section" id="login">
        <div>
          <span className="eyebrow">Login Tenant</span>
          <h2>Sudah punya tenant? Masuk ke dashboard klinik Anda sekarang.</h2>
          <p>
            Section ini bisa nanti dihubungkan ke halaman login utama atau form
            pencarian subdomain tenant.
          </p>
        </div>
        <div className="cta-actions">
          <Link href="/login" className="primary-button">
            Login Sekarang
          </Link>
          <a href="#produk" className="ghost-button ghost-inverse">
            Lihat Produk
          </a>
        </div>
      </section>
    </main>
  );
}
