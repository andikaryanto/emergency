import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard Tenant",
  description:
    "Halaman user untuk melihat daftar tenant klinik, status tenant, dan memulai pembuatan tenant baru.",
  alternates: {
    canonical: "/dashboard",
  },
};

const tenantStats = [
  { label: "Total tenant", value: "3" },
  { label: "Tenant aktif", value: "2" },
  { label: "Perlu tindakan", value: "1" },
];

const tenants = [
  {
    name: "Klinik Sehat Sentosa",
    url: "sehatsentosa.clinicrme.my.id",
    plan: "Growth",
    status: "Aktif",
    users: "12 user",
    updatedAt: "Diperbarui 2 jam lalu",
  },
  {
    name: "Klinik Medika Keluarga",
    url: "medikakeluarga.clinicrme.my.id",
    plan: "Starter",
    status: "Aktif",
    users: "5 user",
    updatedAt: "Diperbarui kemarin",
  },
  {
    name: "Klinik Griya Ibu Anak",
    url: "griyaibuanak.clinicrme.my.id",
    plan: "Starter",
    status: "Menunggu aktivasi",
    users: "Belum ada user",
    updatedAt: "Baru dibuat",
  },
];

export default function DashboardPage() {
  return (
    <main className="dashboard-shell">
      <section className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="dashboard-brand">
            <span className="brand-logo">+</span>
            <div>
              <p>Klinik RME</p>
              <span>Area Pengguna</span>
            </div>
          </div>

          <nav className="dashboard-nav" aria-label="Navigasi dashboard">
            <a className="dashboard-link active" href="#tenant-list">
              Tenant Saya
            </a>
            <a className="dashboard-link" href="#overview">
              Ringkasan
            </a>
            <a className="dashboard-link" href="#create-tenant">
              Buat Tenant
            </a>
          </nav>

          <div className="dashboard-note">
            <span className="card-label">Status akun</span>
            <strong>Siap membuat tenant baru</strong>
            <p>
              Setelah akun aktif, Anda bisa membuat tenant untuk setiap klinik
              atau cabang yang Anda kelola.
            </p>
          </div>
        </aside>

        <section className="dashboard-main">
          <header className="dashboard-header">
            <div>
              <span className="eyebrow">Dashboard User</span>
              <h1>Kelola tenant klinik Anda dari satu tempat.</h1>
              <p>
                Lihat daftar tenant, cek statusnya, lalu buat tenant baru saat
                Anda siap menambah klinik atau cabang baru.
              </p>
            </div>

            <div className="dashboard-header-actions">
              <Link href="/" className="ghost-button">
                Kembali ke landing page
              </Link>
              <a href="#create-tenant" className="primary-button">
                Buat Tenant Baru
              </a>
            </div>
          </header>

          <section className="dashboard-overview" id="overview">
            {tenantStats.map((item) => (
              <article key={item.label} className="dashboard-stat">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </section>

          <section className="tenant-section" id="tenant-list">
            <div className="tenant-section-head">
              <div>
                <span className="eyebrow">Tenant Saya</span>
                <h2>Daftar tenant yang sudah Anda miliki.</h2>
              </div>
              <p>
                Gunakan halaman ini untuk memantau tenant aktif, melihat domain
                login, dan mengecek tenant yang masih menunggu aktivasi.
              </p>
            </div>

            <div className="tenant-list">
              {tenants.map((tenant) => (
                <article key={tenant.url} className="tenant-card">
                  <div className="tenant-card-head">
                    <div>
                      <h3>{tenant.name}</h3>
                      <a href={`https://${tenant.url}`}>{tenant.url}</a>
                    </div>
                    <span
                      className={`tenant-status ${
                        tenant.status === "Aktif" ? "active" : "pending"
                      }`}
                    >
                      {tenant.status}
                    </span>
                  </div>

                  <div className="tenant-meta">
                    <div>
                      <span>Paket</span>
                      <strong>{tenant.plan}</strong>
                    </div>
                    <div>
                      <span>Pengguna</span>
                      <strong>{tenant.users}</strong>
                    </div>
                    <div>
                      <span>Status terakhir</span>
                      <strong>{tenant.updatedAt}</strong>
                    </div>
                  </div>

                  <div className="tenant-actions">
                    <a href={`https://${tenant.url}`} className="ghost-button">
                      Buka Tenant
                    </a>
                    <button type="button" className="tenant-text-action">
                      Kelola Tenant
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="create-tenant-panel" id="create-tenant">
            <div>
              <span className="eyebrow">Buat Tenant Baru</span>
              <h2>Siapkan tenant baru untuk klinik berikutnya.</h2>
              <p>
                Nanti halaman ini bisa diarahkan ke form pembuatan tenant.
                Untuk sekarang, ini menjadi titik masuk yang jelas untuk user.
              </p>
            </div>

            <div className="create-tenant-actions">
              <button type="button" className="primary-button">
                Mulai Buat Tenant
              </button>
              <p>Contoh alur berikutnya: nama klinik, alamat tenant, dan paket.</p>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
