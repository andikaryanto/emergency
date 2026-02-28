import type { Metadata } from "next";
import Link from "next/link";
import {
  getLandlordAccessToken,
  getLandlordAuthorizationHeader,
  getLandlordAuthUser,
} from "../../lib/landlord/auth-session";
import {
  ListLandlordTenantsError,
  type ListLandlordTenantsResponse,
  listLandlordTenants,
} from "../../lib/landlord/list-tenants";

export const metadata: Metadata = {
  title: "Dashboard Tenant",
  description:
    "Halaman user untuk melihat daftar tenant klinik, status tenant, dan memulai pembuatan tenant baru.",
  alternates: {
    canonical: "/dashboard",
  },
};

type DashboardPageProps = {
  searchParams?: Promise<{
    created?: string;
  }>;
};

function formatTenantDate(value: string) {
  const date = new Date(value.replace(" ", "T"));

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const isCreated = params?.created === "1";
  const [currentUser, accessToken, authorizationHeader] = await Promise.all([
    getLandlordAuthUser(),
    getLandlordAccessToken(),
    getLandlordAuthorizationHeader(),
  ]);
  const currentUserName = currentUser?.name ?? "dr. Amanda Pratama";
  let tenantErrorMessage: string | null = null;
  let tenantData: ListLandlordTenantsResponse = {
    tenants: [],
    paging: {
      page: 1,
      limit: 10,
      totalData: 0,
      isLastPage: true,
    },
  };

  if (accessToken) {
    try {
      tenantData = await listLandlordTenants(authorizationHeader);
    } catch (error) {
      tenantErrorMessage =
        error instanceof ListLandlordTenantsError
          ? error.message
          : "Tenant tidak dapat dimuat saat ini.";
    }
  }

  const tenantStats = [
    { label: "Total tenant", value: String(tenantData.paging.totalData) },
    { label: "Tenant halaman ini", value: String(tenantData.tenants.length) },
    { label: "Halaman API", value: String(tenantData.paging.page) },
  ];

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
            <strong>{accessToken ? "Login aktif" : "Siap membuat tenant baru"}</strong>
            <p>
              {accessToken
                ? "Token login tersimpan dan siap dipakai untuk request API dari dashboard."
                : "Setelah akun aktif, Anda bisa membuat tenant untuk setiap klinik atau cabang yang Anda kelola."}
            </p>
          </div>
        </aside>

        <section className="dashboard-main">
          <header className="dashboard-header">
            <div>
              <span className="eyebrow">Dashboard User</span>
              <h1>Selamat datang, {currentUserName}.</h1>
              <p>
                Lihat daftar tenant, cek statusnya, lalu buat tenant baru saat
                Anda siap menambah klinik atau cabang baru.
              </p>
              {isCreated ? (
                <p className="auth-message auth-message-success dashboard-message">
                  Tenant berhasil dibuat dan daftar tenant telah diperbarui.
                </p>
              ) : null}
            </div>

            <div className="dashboard-header-actions">
              <Link href="/" className="ghost-button">
                Kembali ke landing page
              </Link>
              <Link href="/dashboard/create-tenant" className="primary-button">
                Buat Tenant Baru
              </Link>
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

            {!accessToken ? (
              <div className="dashboard-feedback">
                Login diperlukan untuk mengambil daftar tenant dari API.
              </div>
            ) : tenantErrorMessage ? (
              <div className="dashboard-feedback">{tenantErrorMessage}</div>
            ) : tenantData.tenants.length === 0 ? (
              <div className="dashboard-feedback">
                Belum ada tenant yang terdaftar untuk akun ini.
              </div>
            ) : (
              <div className="tenant-list">
                {tenantData.tenants.map((tenant) => (
                  <article key={tenant.id} className="tenant-card">
                    <div className="tenant-card-head">
                      <div>
                        <h3>{tenant.name}</h3>
                        <a href={`https://${tenant.domain}`}>{tenant.domain}</a>
                      </div>
                      <span className="tenant-status active">Aktif</span>
                    </div>

                    <div className="tenant-meta">
                      <div>
                        <span>ID Tenant</span>
                        <strong>{tenant.id}</strong>
                      </div>
                      <div>
                        <span>Dibuat</span>
                        <strong>{formatTenantDate(tenant.createdAt)}</strong>
                      </div>
                      <div>
                        <span>Diperbarui</span>
                        <strong>{formatTenantDate(tenant.updatedAt)}</strong>
                      </div>
                    </div>

                    <div className="tenant-actions">
                      <a href={`https://${tenant.domain}`} className="ghost-button">
                        Buka Tenant
                      </a>
                      <button type="button" className="tenant-text-action">
                        Kelola Tenant
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
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
              <Link href="/dashboard/create-tenant" className="primary-button">
                Mulai Buat Tenant
              </Link>
              <p>
                Form tenant berisi nama tenant, username admin, email admin, dan
                password admin awal.
              </p>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
