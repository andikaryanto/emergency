import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutUserAction } from "../../../dashboard/actions";
import {
  getLandlordAccessToken,
  getLandlordAuthorizationHeader,
  getLandlordAuthUser,
  isLandlordAdmin,
} from "../../../../lib/landlord/auth-session";
import { formatDateTime } from "../../../../lib/format";
import {
  ListActiveTenantsError,
  type ListActiveTenantsResponse,
  listActiveTenants,
} from "../../../../lib/landlord/list-active-tenants";

export const metadata: Metadata = {
  title: "Tenant Aktif Admin",
  description: "Halaman admin untuk melihat daftar tenant yang sedang aktif.",
  alternates: {
    canonical: "/admin/tenants/active",
  },
};

type AdminActiveTenantsPageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

function parsePageSearchParam(value: string | undefined) {
  const page = Number(value ?? "1");

  return Number.isInteger(page) && page > 0 ? page : 1;
}

function createPageHref(page: number) {
  const params = new URLSearchParams({
    page: String(page),
  });

  return `/admin/tenants/active?${params.toString()}`;
}

function formatBillingCycleLabel(billingCycle: "monthly" | "yearly" | null) {
  if (billingCycle === "monthly") {
    return "Bulanan";
  }

  if (billingCycle === "yearly") {
    return "Tahunan";
  }

  return null;
}

function formatPricingLabel(tenant: ListActiveTenantsResponse["tenants"][number]) {
  if (!tenant.pricing) {
    return "-";
  }

  const billingCycleLabel = formatBillingCycleLabel(tenant.billingCycle);

  return billingCycleLabel ? `${tenant.pricing} - ${billingCycleLabel}` : tenant.pricing;
}

export default async function AdminActiveTenantsPage({
  searchParams,
}: AdminActiveTenantsPageProps) {
  const params = await searchParams;
  const currentPage = parsePageSearchParam(params?.page);
  const [currentUser, accessToken, authorizationHeader] = await Promise.all([
    getLandlordAuthUser(),
    getLandlordAccessToken(),
    getLandlordAuthorizationHeader(),
  ]);

  if (!accessToken) {
    redirect("/login");
  }

  if (!isLandlordAdmin(currentUser)) {
    redirect("/dashboard");
  }

  let tenantErrorMessage: string | null = null;
  let tenantData: ListActiveTenantsResponse = {
    tenants: [],
    paging: {
      page: 1,
      limit: 10,
      totalData: 0,
      isLastPage: true,
    },
  };

  try {
    tenantData = await listActiveTenants(authorizationHeader, {
      page: currentPage,
    });
  } catch (error) {
    tenantErrorMessage =
      error instanceof ListActiveTenantsError
        ? error.message
        : "Tenant aktif tidak dapat dimuat saat ini.";
  }

  const demoCount = tenantData.tenants.filter((tenant) => tenant.isDemo).length;
  const paidCount = tenantData.tenants.filter((tenant) => tenant.paidAt).length;
  const hasPreviousPage = tenantData.paging.page > 1;
  const hasNextPage = !tenantData.paging.isLastPage;
  const totalPages =
    tenantData.paging.limit > 0
      ? Math.max(1, Math.ceil(tenantData.paging.totalData / tenantData.paging.limit))
      : 1;

  return (
    <main className="dashboard-shell">
      <section className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="dashboard-brand">
            <span className="brand-logo">+</span>
            <div>
              <p>Klinik RME</p>
              <span>Area Admin</span>
            </div>
          </div>

          <nav className="dashboard-nav" aria-label="Navigasi admin">
            <Link className="dashboard-link" href="/dashboard">
              Dashboard
            </Link>
            <Link className="dashboard-link active" href="/admin/tenants/active">
              Tenant Aktif
            </Link>
            <Link className="dashboard-link" href="/admin/subscription-invoices">
              Invoice Langganan
            </Link>
          </nav>

          <form action={logoutUserAction} className="dashboard-sidebar-action">
            <button type="submit" className="ghost-button dashboard-logout-button">
              Logout
            </button>
          </form>

          <div className="dashboard-note">
            <span className="card-label">Akses admin</span>
            <strong>{currentUser?.name ?? "Admin"}</strong>
            <p>
              Halaman ini khusus admin untuk memantau tenant yang sudah aktif dan siap
              digunakan.
            </p>
          </div>
        </aside>

        <section className="dashboard-main">
          <header className="dashboard-header">
            <div>
              <span className="eyebrow">Admin Active Tenants</span>
              <h1>Daftar tenant aktif.</h1>
              <p>
                Pantau tenant yang sudah aktif, cek domain, paket, dan waktu aktivasi
                terakhir dalam satu halaman.
              </p>
            </div>

            <div className="dashboard-header-actions">
              <Link href="/dashboard" className="ghost-button">
                Kembali ke dashboard
              </Link>
            </div>
          </header>

          <section className="dashboard-overview" aria-label="Ringkasan tenant aktif">
            <article className="dashboard-stat">
              <span>Total tenant aktif</span>
              <strong>{tenantData.paging.totalData}</strong>
            </article>
            <article className="dashboard-stat">
              <span>Tenant di halaman ini</span>
              <strong>{tenantData.tenants.length}</strong>
            </article>
            <article className="dashboard-stat">
              <span>Tenant demo</span>
              <strong>{demoCount}</strong>
            </article>
            <article className="dashboard-stat">
              <span>Sudah bayar</span>
              <strong>{paidCount}</strong>
            </article>
            <article className="dashboard-stat">
              <span>Halaman aktif</span>
              <strong>
                {tenantData.paging.page} / {totalPages}
              </strong>
            </article>
          </section>

          <section className="dashboard-feedback admin-filter-summary">
            <strong>Ringkasan cepat</strong>
            <p>
              Saat ini ada {tenantData.tenants.length} tenant aktif pada halaman ini, dengan{" "}
              {demoCount} tenant demo dan {paidCount} tenant yang sudah memiliki tanggal
              pembayaran.
            </p>
          </section>

          <section className="tenant-section" aria-labelledby="active-tenant-list">
            <div className="tenant-section-head admin-invoice-toolbar">
              <div>
                <span className="eyebrow">Tenant Aktif</span>
                <h2 id="active-tenant-list">List tenant aktif</h2>
                <p>
                  Daftar ini diambil dari endpoint admin tenant aktif dan hanya bisa diakses
                  oleh admin.
                </p>
              </div>
            </div>

            {tenantErrorMessage ? (
              <p className="auth-message auth-message-error dashboard-message">
                {tenantErrorMessage}
              </p>
            ) : null}

            {!tenantErrorMessage && tenantData.tenants.length === 0 ? (
              <div className="dashboard-feedback">
                Belum ada tenant aktif yang tersedia saat ini.
              </div>
            ) : tenantData.tenants.length > 0 ? (
              <>
                <div className="tenant-list">
                  {tenantData.tenants.map((tenant) => (
                    <article className="tenant-card" key={tenant.id}>
                      <div className="tenant-card-head">
                        <div>
                          <h3>{tenant.name}</h3>
                          <a href={`https://${tenant.domain}`}>{tenant.domain}</a>
                        </div>

                        <div className="tenant-status-group">
                          {tenant.isDemo ? <span className="tenant-status demo">Demo</span> : null}
                          <span className="tenant-status active">Aktif</span>
                        </div>
                      </div>

                      <div className="tenant-meta">
                        <div>
                          <span>ID Tenant</span>
                          <strong>{tenant.id}</strong>
                        </div>
                        <div>
                          <span>Paket</span>
                          <strong>{formatPricingLabel(tenant)}</strong>
                        </div>
                        <div>
                          <span>Dibuat pada</span>
                          <strong>{formatDateTime(tenant.createdAt)}</strong>
                        </div>
                        <div>
                          <span>Diperbarui pada</span>
                          <strong>{formatDateTime(tenant.updatedAt)}</strong>
                        </div>
                      </div>

                      <div className="tenant-meta">
                        <div>
                          <span>Trial berakhir</span>
                          <strong>{formatDateTime(tenant.trialEndsAt)}</strong>
                        </div>
                        <div>
                          <span>Paid at</span>
                          <strong>{formatDateTime(tenant.paidAt)}</strong>
                        </div>
                        <div>
                          <span>Disabled at</span>
                          <strong>{formatDateTime(tenant.disabledAt)}</strong>
                        </div>
                        <div>
                          <span>Status proses</span>
                          <strong>{tenant.isProcessComplete ? "Selesai" : "Belum selesai"}</strong>
                        </div>
                      </div>

                      <div className="tenant-meta">
                        <div>
                          <span>Invoice siap bayar</span>
                          <strong>{tenant.hasReadyPaymentInvoice ? "Ya" : "Tidak"}</strong>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="tenant-actions">
                  {hasPreviousPage ? (
                    <Link
                      href={createPageHref(tenantData.paging.page - 1)}
                      className="ghost-button"
                    >
                      Halaman Sebelumnya
                    </Link>
                  ) : (
                    <button type="button" className="ghost-button" disabled>
                      Halaman Sebelumnya
                    </button>
                  )}

                  <span className="tenant-inline-notice">
                    Halaman {tenantData.paging.page} dari {totalPages}
                  </span>

                  {hasNextPage ? (
                    <Link
                      href={createPageHref(tenantData.paging.page + 1)}
                      className="ghost-button"
                    >
                      Halaman Berikutnya
                    </Link>
                  ) : (
                    <button type="button" className="ghost-button" disabled>
                      Halaman Berikutnya
                    </button>
                  )}
                </div>
              </>
            ) : null}
          </section>
        </section>
      </section>
    </main>
  );
}
