import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutUserAction } from "../../dashboard/actions";
import {
  getLandlordAccessToken,
  getLandlordAuthorizationHeader,
  getLandlordAuthUser,
  isLandlordAdmin,
} from "../../../lib/landlord/auth-session";
import {
  ListSubscriptionInvoicesError,
  type ListSubscriptionInvoicesResponse,
  listSubscriptionInvoices,
} from "../../../lib/landlord/list-subscription-invoices";

export const metadata: Metadata = {
  title: "Invoice Langganan Admin",
  description:
    "Halaman admin untuk melihat daftar invoice langganan tenant dan memfilter status pembayarannya.",
  alternates: {
    canonical: "/admin/subscription-invoices",
  },
};

type AdminSubscriptionInvoicesPageProps = {
  searchParams?: Promise<{
    is_paid?: string;
  }>;
};

function parseBooleanSearchParam(value: string | undefined) {
  if (value === undefined) {
    return false;
  }

  const normalized = value.trim().toLowerCase();

  return normalized === "1" || normalized === "true";
}

function parseApiDate(value: string) {
  return new Date(value.replace(" ", "T"));
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "-";
  }

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

function formatCurrency(value: number | null) {
  if (value === null) {
    return "-";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function AdminSubscriptionInvoicesPage({
  searchParams,
}: AdminSubscriptionInvoicesPageProps) {
  const params = await searchParams;
  const isPaid = parseBooleanSearchParam(params?.is_paid);
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

  let invoiceErrorMessage: string | null = null;
  let invoiceData: ListSubscriptionInvoicesResponse = {
    invoices: [],
    paging: {
      page: 1,
      limit: 10,
      totalData: 0,
      isLastPage: true,
    },
  };

  try {
    invoiceData = await listSubscriptionInvoices(authorizationHeader, { isPaid });
  } catch (error) {
    invoiceErrorMessage =
      error instanceof ListSubscriptionInvoicesError
        ? error.message
        : "Invoice langganan tidak dapat dimuat saat ini.";
  }

  const paidCount = invoiceData.invoices.filter((invoice) => invoice.isPaid).length;
  const unpaidCount = invoiceData.invoices.length - paidCount;

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
            <Link className="dashboard-link active" href="/admin/subscription-invoices">
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
              Halaman ini khusus admin untuk memonitor invoice langganan tenant dan
              memastikan status pembayaran mudah dipantau.
            </p>
          </div>
        </aside>

        <section className="dashboard-main">
          <header className="dashboard-header">
            <div>
              <span className="eyebrow">Admin Subscription Invoices</span>
              <h1>Daftar invoice langganan tenant.</h1>
              <p>
                Filter invoice berdasarkan status pembayaran. Default halaman ini
                menampilkan invoice yang belum dibayar.
              </p>
            </div>

            <div className="dashboard-header-actions">
              <Link href="/dashboard" className="ghost-button">
                Kembali ke dashboard
              </Link>
            </div>
          </header>

          <section className="dashboard-overview" aria-label="Ringkasan invoice">
            <article className="dashboard-stat">
              <span>Total invoice di halaman ini</span>
              <strong>{invoiceData.invoices.length}</strong>
            </article>
            <article className="dashboard-stat">
              <span>Status filter aktif</span>
              <strong>{isPaid ? "Paid" : "Unpaid"}</strong>
            </article>
            <article className="dashboard-stat">
              <span>Total data dari API</span>
              <strong>{invoiceData.paging.totalData}</strong>
            </article>
          </section>

          <section className="dashboard-feedback admin-filter-summary">
            <strong>Ringkasan cepat</strong>
            <p>
              Pada hasil saat ini ada {paidCount} invoice berstatus paid dan {unpaidCount}{" "}
              invoice berstatus unpaid.
            </p>
          </section>

          <section className="tenant-section" aria-labelledby="subscription-invoice-list">
            <div className="tenant-section-head">
              <div>
                <span className="eyebrow">Invoice</span>
                <h2 id="subscription-invoice-list">List subscription invoices</h2>
                <p>Pantau invoice tenant dan ubah filter status pembayaran dengan cepat.</p>
              </div>
              <div className="admin-filter-toggle-wrap">
                <span className="admin-filter-toggle-label">Filter status pembayaran</span>
                <div className="admin-filter-toggle" aria-label="Filter invoice berdasarkan pembayaran">
                  <Link
                    href="/admin/subscription-invoices?is_paid=false"
                    className={`admin-filter-option ${!isPaid ? "active" : ""}`}
                    aria-current={!isPaid ? "page" : undefined}
                  >
                    Belum Dibayar
                  </Link>
                  <Link
                    href="/admin/subscription-invoices?is_paid=true"
                    className={`admin-filter-option ${isPaid ? "active" : ""}`}
                    aria-current={isPaid ? "page" : undefined}
                  >
                    Sudah Dibayar
                  </Link>
                </div>
              </div>
            </div>

            {invoiceErrorMessage ? (
              <p className="auth-message auth-message-error dashboard-message">
                {invoiceErrorMessage}
              </p>
            ) : null}

            {invoiceData.invoices.length === 0 ? (
              <div className="dashboard-feedback">
                Belum ada invoice yang cocok dengan filter saat ini.
              </div>
            ) : (
              <div className="tenant-list admin-invoice-list">
                {invoiceData.invoices.map((invoice) => (
                  <article className="tenant-card" key={String(invoice.id)}>
                    <div className="tenant-card-head">
                      <div>
                        <h3>{invoice.invoiceNumber}</h3>
                        <span className="admin-invoice-tenant">{invoice.tenantName}</span>
                      </div>

                      <div className="tenant-status-group">
                        <span
                          className={`tenant-status ${
                            invoice.isPaid ? "active" : "pending"
                          }`}
                        >
                          {invoice.isPaid ? "Paid" : "Belum Dibayar"}
                        </span>
                      </div>
                    </div>

                    <div className="tenant-meta">
                      <div>
                        <span>Paket</span>
                        <strong>{invoice.subscriptionName ?? "-"}</strong>
                      </div>
                      <div>
                        <span>Nominal</span>
                        <strong>{formatCurrency(invoice.amount)}</strong>
                      </div>
                      <div>
                        <span>Jatuh tempo</span>
                        <strong>{formatDateTime(invoice.dueDate)}</strong>
                      </div>
                      <div>
                        <span>Dibayar pada</span>
                        <strong>{formatDateTime(invoice.paidAt)}</strong>
                      </div>
                    </div>

                    <div className="tenant-actions">
                      <span className="tenant-inline-notice">
                        Dibuat pada {formatDateTime(invoice.createdAt)}.
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </section>
    </main>
  );
}
