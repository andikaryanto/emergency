import type { Metadata } from "next";
import Link from "next/link";
import { logoutUserAction } from "./actions";
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
  title: "Dashboard Klinik",
  description:
    "Halaman untuk melihat daftar klinik Anda, memantau statusnya, dan menyiapkan klinik baru.",
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
    { label: "Total klinik", value: String(tenantData.paging.totalData) },
    { label: "Klinik di halaman ini", value: String(tenantData.tenants.length) },
    { label: "Halaman daftar", value: String(tenantData.paging.page) },
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
              Klinik Saya
            </a>
            <a className="dashboard-link" href="#overview">
              Ringkasan
            </a>
            <a className="dashboard-link" href="#create-tenant">
              Buat Klinik
            </a>
          </nav>

          {accessToken ? (
            <form action={logoutUserAction} className="dashboard-sidebar-action">
              <button type="submit" className="ghost-button dashboard-logout-button">
                Logout
              </button>
            </form>
          ) : null}

          <div className="dashboard-note">
            <span className="card-label">Status akun</span>
            <strong>{accessToken ? "Anda sudah masuk" : "Siap menambahkan klinik baru"}</strong>
            <p>
              {accessToken
                ? "Akun Anda aktif dan siap digunakan untuk mengelola klinik yang Anda miliki."
                : "Setelah masuk, Anda bisa menambahkan klinik atau cabang baru kapan saja."}
            </p>
          </div>
        </aside>

        <section className="dashboard-main">
          <header className="dashboard-header">
            <div>
              <span className="eyebrow">Dashboard Klinik</span>
              <h1>Selamat datang, {currentUserName}.</h1>
              <p>
                Lihat daftar klinik Anda, cek alamat aksesnya, lalu tambahkan
                klinik baru saat Anda siap memperluas operasional.
              </p>
              {isCreated ? (
                <p className="auth-message auth-message-success dashboard-message">
                  Klinik baru berhasil dibuat dan daftar Anda sudah diperbarui.
                </p>
              ) : null}
            </div>

            <div className="dashboard-header-actions">
              <Link href="/" className="ghost-button">
                Kembali ke halaman utama
              </Link>
              <Link href="/dashboard/create-tenant" className="primary-button">
                Buat Klinik Baru
              </Link>
            </div>
          </header>

          <section className="dashboard-notice" aria-label="Informasi akun">
            <div>
              <span className="eyebrow">Info Penting</span>
              <h2>Coba gratis 7 hari sudah aktif.</h2>
              <p>
                Gunakan masa coba gratis ini untuk menyiapkan klinik Anda,
                mencoba alur kerja, dan memastikan tim Anda nyaman sebelum
                melanjutkan ke tahap berikutnya.
              </p>
            </div>
            <p className="dashboard-notice-copy">
              Pastikan data klinik dan akun utama sudah benar agar proses
              penggunaan berjalan lancar selama masa percobaan.
            </p>
          </section>

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
                <span className="eyebrow">Klinik Saya</span>
                <h2>Daftar klinik yang sudah Anda miliki.</h2>
              </div>
              <p>
                Gunakan halaman ini untuk melihat klinik yang sudah aktif,
                membuka alamat aksesnya, dan memantau pembaruan terakhir.
              </p>
            </div>

            {!accessToken ? (
              <div className="dashboard-feedback">
                Silakan login untuk melihat daftar klinik Anda.
              </div>
            ) : tenantErrorMessage ? (
              <div className="dashboard-feedback">{tenantErrorMessage}</div>
            ) : tenantData.tenants.length === 0 ? (
              <div className="dashboard-feedback">
                Belum ada klinik yang terdaftar di akun Anda.
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
                        <span>ID Klinik</span>
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
                        Buka Klinik
                      </a>
                      <button type="button" className="tenant-text-action">
                        Kelola Klinik
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="create-tenant-panel" id="create-tenant">
            <div>
              <span className="eyebrow">Buat Klinik Baru</span>
              <h2>Siapkan akses untuk klinik atau cabang berikutnya.</h2>
              <p>
                Tambahkan klinik baru beserta akun utamanya dalam satu alur yang
                sederhana.
              </p>
            </div>

            <div className="create-tenant-actions">
              <Link href="/dashboard/create-tenant" className="primary-button">
                Mulai Buat Klinik
              </Link>
              <p>
                Anda hanya perlu menyiapkan nama klinik, username utama, email,
                dan password akun pertamanya.
              </p>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
