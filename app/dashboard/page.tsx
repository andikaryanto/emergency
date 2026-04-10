import type { Metadata } from "next";
import Link from "next/link";
import { ConnectGoogleButton } from "../../components/dashboard/connect-google-button";
import { env } from "../../lib/env";
import { logoutUserAction } from "./actions";
import {
  getLandlordAccessToken,
  getLandlordAuthorizationHeader,
  getLandlordAuthUser,
  hasLandlordAuthProvider,
  isLandlordAdmin,
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
    google_connected?: string;
  }>;
};

function parseApiDate(value: string) {
  return new Date(value.replace(" ", "T"));
}

function formatTenantDate(value: string) {
  const date = parseApiDate(value);

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

function getClinicStatusLabel(tenant: ListLandlordTenantsResponse["tenants"][number]) {
  if (!tenant.isProcessComplete) {
    return {
      label: "Sedang diproses",
      className: "pending",
    } as const;
  }

  if (tenant.isActive) {
    return {
      label: "Aktif",
      className: "active",
    } as const;
  }

  return {
    label: "Menunggu aktivasi",
    className: "pending",
  } as const;
}

function getDemoExpiryNotice(tenant: ListLandlordTenantsResponse["tenants"][number]) {
  if (!tenant.isDemo) {
    return null;
  }

  const createdAt = parseApiDate(tenant.createdAt);

  if (Number.isNaN(createdAt.getTime())) {
    return "Masa coba gratis sedang berjalan. Lanjutkan ke paket berbayar agar akses klinik tetap aktif.";
  }

  const trialEndDate = tenant.trialEndsAt
    ? parseApiDate(tenant.trialEndsAt)
    : new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);

  if (Number.isNaN(trialEndDate.getTime())) {
    return "Masa coba gratis sedang berjalan. Lanjutkan ke paket berbayar agar akses klinik tetap aktif.";
  }

  const remainingDays = Math.ceil(
    (trialEndDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000),
  );

  if (remainingDays <= 2) {
    return remainingDays > 0
      ? `Masa coba gratis hampir berakhir. Segera lanjutkan paket berbayar dalam ${remainingDays} hari agar klinik tetap aktif.`
      : "Masa coba gratis sudah mendekati batas akhir. Segera lanjutkan paket berbayar agar klinik tidak dinonaktifkan.";
  }

  return "Mode demo aktif. Gunakan masa coba gratis 7 hari ini untuk mencoba alur kerja klinik Anda.";
}

function formatBillingCycleLabel(
  billingCycle: ListLandlordTenantsResponse["tenants"][number]["billingCycle"],
) {
  if (billingCycle === "monthly") {
    return "Bulanan";
  }

  if (billingCycle === "yearly") {
    return "Tahunan";
  }

  return null;
}

function formatPricingLabel(tenant: ListLandlordTenantsResponse["tenants"][number]) {
  if (!tenant.pricing) {
    return "-";
  }

  const billingCycleLabel = formatBillingCycleLabel(tenant.billingCycle);

  return billingCycleLabel ? `${tenant.pricing} - ${billingCycleLabel}` : tenant.pricing;
}

function getDemoPricingNotice(tenant: ListLandlordTenantsResponse["tenants"][number]) {
  if (!tenant.isDemo) {
    return null;
  }

  const selectedPricing = formatPricingLabel(tenant);

  return `Selama masa demo, paket yang aktif adalah Basic. Paket ${selectedPricing} akan aktif setelah klinik diaktivasi atau pembayaran selesai.`;
}

function getTenantSubscriptionInvoicesPath(tenantId: number) {
  return `/dashboard/tenants/${tenantId}/subscription-invoices`;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const isCreated = params?.created === "1";
  const isGoogleConnectedMessage = params?.google_connected === "1";
  const [currentUser, accessToken, authorizationHeader] = await Promise.all([
    getLandlordAuthUser(),
    getLandlordAccessToken(),
    getLandlordAuthorizationHeader(),
  ]);
  const currentUserName = currentUser?.name ?? "dr. Amanda Pratama";
  const isAdmin = isLandlordAdmin(currentUser);
  const isGoogleConnected = hasLandlordAuthProvider(currentUser, "google");
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
            <Link className="dashboard-link" href="/dashboard/payment-profile">
              Profil Pembayaran
            </Link>
            {isAdmin ? (
              <Link className="dashboard-link" href="/admin/subscription-invoices">
                Invoice Langganan
              </Link>
            ) : null}
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
              {isGoogleConnectedMessage ? (
                <p className="auth-message auth-message-success dashboard-message">
                  Akun Google berhasil dihubungkan ke akun Anda.
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

          <section className="dashboard-account-card" aria-label="Koneksi akun">
            <div className="dashboard-account-card-copy">
              <span className="eyebrow">Koneksi Akun</span>
              <h2>Hubungkan akun Google Anda.</h2>
              <p>
                Sambungkan Google agar akun ini punya metode login tambahan yang
                lebih cepat dan nyaman dipakai oleh pemilik akun utama.
              </p>
            </div>

            <div className="dashboard-account-card-actions">
              <span
                className={`dashboard-provider-badge ${
                  isGoogleConnected ? "connected" : "not-connected"
                }`}
              >
                {isGoogleConnected ? "Google Terhubung" : "Google Belum Terhubung"}
              </span>

              {isGoogleConnected ? (
                <p className="field-hint field-hint-success">
                  Akun ini sudah terhubung dengan Google dan bisa dipakai untuk login.
                </p>
              ) : (
                <>
                  <ConnectGoogleButton clientId={env.googleAuth.clientId} />
                </>
              )}
            </div>
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
                {tenantData.tenants.map((tenant) => {
                  const clinicStatus = getClinicStatusLabel(tenant);

                  return (
                    <article
                      key={tenant.id}
                      className={`tenant-card ${tenant.isDemo ? "tenant-card-demo" : ""}`}
                    >
                      <div className="tenant-card-head">
                        <div>
                          <h3>{tenant.name}</h3>
                          <a href={`https://${tenant.domain}`}>{tenant.domain}</a>
                        </div>
                        <div className="tenant-status-group">
                          {tenant.isDemo ? (
                            <span className="tenant-status demo">Demo</span>
                          ) : null}
                          <span className={`tenant-status ${clinicStatus.className}`}>
                            {clinicStatus.label}
                          </span>
                        </div>
                      </div>

                      <div className="tenant-meta">
                        <div>
                          <span>ID Klinik</span>
                          <strong>{tenant.id}</strong>
                        </div>
                        <div>
                          <span>Paket</span>
                          <strong>{formatPricingLabel(tenant)}</strong>
                          {tenant.isDemo ? (
                            <p className="field-hint">{getDemoPricingNotice(tenant)}</p>
                          ) : null}
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

                      {!tenant.isProcessComplete ? (
                        <p className="tenant-inline-notice">
                          Klinik sedang diproses. Kami akan menyelesaikan penyiapan akses
                          secepatnya.
                        </p>
                      ) : null}

                      {tenant.isDemo ? (
                        <p className="tenant-inline-notice tenant-inline-notice-demo">
                          {getDemoExpiryNotice(tenant)}
                        </p>
                      ) : null}

                      {tenant.hasReadyPaymentInvoice ? (
                        <p className="tenant-inline-notice tenant-inline-notice-payment">
                          Ada invoice langganan yang siap dibayar untuk klinik ini. Lanjutkan ke
                          halaman konfirmasi pembayaran untuk melihat detail invoice dan kirim
                          konfirmasi pembayaran.
                        </p>
                      ) : null}

                      <div className="tenant-actions">
                        <a href={`https://${tenant.domain}`} className="ghost-button">
                          Buka Klinik
                        </a>
                        {tenant.hasReadyPaymentInvoice ? (
                          <Link
                            href={getTenantSubscriptionInvoicesPath(tenant.id)}
                            className="primary-button tenant-payment-button"
                          >
                            Konfirmasi Pembayaran
                          </Link>
                        ) : null}
                        <button type="button" className="tenant-text-action">
                          Kelola Klinik
                        </button>
                      </div>
                    </article>
                  );
                })}
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
