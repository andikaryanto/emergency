import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutUserAction } from "../../dashboard/actions";
import { approveSubscriptionInvoicePaymentConfirmationAction } from "./actions";
import {
  getLandlordAccessToken,
  getLandlordAuthorizationHeader,
  getLandlordAuthUser,
  isLandlordAdmin,
} from "../../../lib/landlord/auth-session";
import { formatCurrency, formatDateTime } from "../../../lib/format";
import {
  ListSubscriptionInvoicesError,
  type ListSubscriptionInvoicesResponse,
  type SubscriptionInvoice,
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
    domain?: string;
    page?: string;
  }>;
};

function parseBooleanSearchParam(value: string | undefined) {
  if (value === undefined) {
    return false;
  }

  const normalized = value.trim().toLowerCase();

  return normalized === "1" || normalized === "true";
}

function normalizeDomainSearch(value: string | undefined) {
  return value?.trim() ?? "";
}

function parsePageSearchParam(value: string | undefined) {
  const page = Number(value ?? "1");

  return Number.isInteger(page) && page > 0 ? page : 1;
}

function canApprovePaymentConfirmation(invoice: SubscriptionInvoice) {
  const normalizedStatus = invoice.paymentConfirmation?.status?.trim().toLowerCase();

  return (
    Boolean(invoice.paymentConfirmation) &&
    invoice.tenantId !== null &&
    invoice.isPaid === false &&
    normalizedStatus === "pending"
  );
}

function getPaymentConfirmationStatusLabel(invoice: SubscriptionInvoice) {
  const normalizedStatus = invoice.paymentConfirmation?.status?.trim().toLowerCase();

  if (!normalizedStatus) {
    return null;
  }

  if (normalizedStatus === "approved") {
    return {
      label: "Konfirmasi Disetujui",
      className: "active",
    } as const;
  }

  if (normalizedStatus === "rejected") {
    return {
      label: "Konfirmasi Ditolak",
      className: "inactive",
    } as const;
  }

  return {
    label: "Konfirmasi Pending",
    className: "demo",
  } as const;
}

function createPageHref({
  isPaid,
  domain,
  page,
}: {
  isPaid: boolean;
  domain: string;
  page: number;
}) {
  const params = new URLSearchParams({
    is_paid: String(isPaid),
    page: String(page),
  });

  if (domain) {
    params.set("domain", domain);
  }

  return `/admin/subscription-invoices?${params.toString()}`;
}

export default async function AdminSubscriptionInvoicesPage({
  searchParams,
}: AdminSubscriptionInvoicesPageProps) {
  const params = await searchParams;
  const isPaid = parseBooleanSearchParam(params?.is_paid);
  const domain = normalizeDomainSearch(params?.domain);
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
    invoiceData = await listSubscriptionInvoices(authorizationHeader, {
      isPaid,
      page: currentPage,
      domain,
    });
  } catch (error) {
    invoiceErrorMessage =
      error instanceof ListSubscriptionInvoicesError
        ? error.message
        : "Invoice langganan tidak dapat dimuat saat ini.";
  }

  const paidCount = invoiceData.invoices.filter((invoice) => invoice.isPaid).length;
  const unpaidCount = invoiceData.invoices.length - paidCount;
  const hasPreviousPage = invoiceData.paging.page > 1;
  const hasNextPage = !invoiceData.paging.isLastPage;
  const totalPages =
    invoiceData.paging.limit > 0
      ? Math.max(1, Math.ceil(invoiceData.paging.totalData / invoiceData.paging.limit))
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
                Filter invoice berdasarkan status pembayaran, lalu cari tenant berdasarkan
                domain tenant.
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
              <span>Halaman aktif</span>
              <strong>
                {invoiceData.paging.page} / {totalPages}
              </strong>
            </article>
          </section>

          <section className="dashboard-feedback admin-filter-summary">
            <strong>Ringkasan cepat</strong>
            <p>
              Pada halaman ini ada {paidCount} invoice berstatus paid dan {unpaidCount} invoice
              berstatus unpaid.
            </p>
          </section>

          <section className="tenant-section" aria-labelledby="subscription-invoice-list">
            <div className="tenant-section-head admin-invoice-toolbar">
              <div>
                <span className="eyebrow">Invoice</span>
                <h2 id="subscription-invoice-list">List subscription invoices</h2>
                <p>Pantau invoice tenant, cari berdasarkan domain, dan ubah filter status pembayaran dengan cepat.</p>
              </div>
              <div className="admin-filter-toggle-wrap">
                <span className="admin-filter-toggle-label">Filter status pembayaran</span>
                <div className="admin-filter-toggle" aria-label="Filter invoice berdasarkan pembayaran">
                  <Link
                    href={createPageHref({ isPaid: false, domain, page: 1 })}
                    className={`admin-filter-option ${!isPaid ? "active" : ""}`}
                    aria-current={!isPaid ? "page" : undefined}
                  >
                    Belum Dibayar
                  </Link>
                  <Link
                    href={createPageHref({ isPaid: true, domain, page: 1 })}
                    className={`admin-filter-option ${isPaid ? "active" : ""}`}
                    aria-current={isPaid ? "page" : undefined}
                  >
                    Sudah Dibayar
                  </Link>
                </div>
              </div>
            </div>

            <form className="auth-form admin-invoice-search-form" method="get">
              <input type="hidden" name="is_paid" value={String(isPaid)} />
              <label htmlFor="admin-invoice-search">Cari tenant</label>
              <input
                id="admin-invoice-search"
                name="domain"
                type="search"
                defaultValue={domain}
                placeholder="Cari berdasarkan domain tenant"
              />
              <button type="submit">Cari</button>
            </form>

            {invoiceErrorMessage ? (
              <p className="auth-message auth-message-error dashboard-message">
                {invoiceErrorMessage}
              </p>
            ) : null}

            {!invoiceErrorMessage && domain && invoiceData.invoices.length === 0 ? (
              <div className="dashboard-feedback">
                Tidak ada invoice yang cocok dengan domain <strong>{domain}</strong>.
              </div>
            ) : null}

            {!invoiceErrorMessage && invoiceData.invoices.length === 0 ? (
              <div className="dashboard-feedback">
                Belum ada invoice yang cocok dengan filter saat ini.
              </div>
            ) : invoiceData.invoices.length > 0 ? (
              <>
                <div className="tenant-list admin-invoice-list">
                  {invoiceData.invoices.map((invoice) => {
                    const paymentConfirmationStatus = getPaymentConfirmationStatusLabel(invoice);

                    return (
                      <article className="tenant-card" key={String(invoice.id)}>
                        <div className="tenant-card-head">
                          <div>
                            <h3>{invoice.invoiceNumber}</h3>
                            <span className="admin-invoice-tenant">{invoice.tenantName}</span>
                          </div>

                          <div className="tenant-status-group">
                            {paymentConfirmationStatus ? (
                              <span className={`tenant-status ${paymentConfirmationStatus.className}`}>
                                {paymentConfirmationStatus.label}
                              </span>
                            ) : null}
                            <span className={`tenant-status ${invoice.isPaid ? "active" : "pending"}`}>
                              {invoice.isPaid ? "Paid" : "Belum Dibayar"}
                            </span>
                          </div>
                        </div>

                        <div className="tenant-meta">
                          <div>
                            <span>Tenant</span>
                            <strong>{invoice.tenantName}</strong>
                          </div>
                          <div>
                            <span>Domain</span>
                            <strong>{invoice.tenantDomain ?? "-"}</strong>
                          </div>
                          <div>
                            <span>Paket</span>
                            <strong>{invoice.subscriptionName ?? "-"}</strong>
                          </div>
                          <div>
                            <span>Nominal</span>
                            <strong>{formatCurrency(invoice.amount)}</strong>
                          </div>
                        </div>

                        <div className="tenant-meta">
                          <div>
                            <span>Jatuh tempo</span>
                            <strong>{formatDateTime(invoice.dueDate)}</strong>
                          </div>
                          <div>
                            <span>Dibayar pada</span>
                            <strong>{formatDateTime(invoice.paidAt)}</strong>
                          </div>
                          <div>
                            <span>Konfirmasi dikirim</span>
                            <strong>{formatDateTime(invoice.paymentConfirmation?.submittedAt ?? null)}</strong>
                          </div>
                          <div>
                            <span>Konfirmasi direview</span>
                            <strong>{formatDateTime(invoice.paymentConfirmation?.reviewedAt ?? null)}</strong>
                          </div>
                        </div>

                        {invoice.paymentConfirmation ? (
                          <>
                            <p className="tenant-inline-notice tenant-inline-notice-payment">
                              Konfirmasi pembayaran sudah ada dengan status <strong>{invoice.paymentConfirmation.status ?? "pending"}</strong>.
                              {invoice.paymentConfirmation.notes ? ` Catatan: ${invoice.paymentConfirmation.notes}` : ""}
                            </p>

                            {invoice.paymentConfirmation.paymentProfileSnapshot ? (
                              <div className="tenant-meta">
                                <div>
                                  <span>Metode</span>
                                  <strong>{invoice.paymentConfirmation.paymentProfileSnapshot.paymentMethod ?? "-"}</strong>
                                </div>
                                <div>
                                  <span>Nama akun</span>
                                  <strong>{invoice.paymentConfirmation.paymentProfileSnapshot.accountHolderName ?? "-"}</strong>
                                </div>
                                <div>
                                  <span>Bank</span>
                                  <strong>{invoice.paymentConfirmation.paymentProfileSnapshot.bankName ?? "-"}</strong>
                                </div>
                                <div>
                                  <span>No. rekening</span>
                                  <strong>{invoice.paymentConfirmation.paymentProfileSnapshot.accountNumber ?? "-"}</strong>
                                </div>
                              </div>
                            ) : null}

                            {invoice.paymentConfirmation.paymentProfileSnapshot ? (
                              <div className="tenant-meta">
                                <div>
                                  <span>Nominal transfer</span>
                                  <strong>
                                    {formatCurrency(
                                      invoice.paymentConfirmation.paymentProfileSnapshot.transferredAmount,
                                    )}
                                  </strong>
                                </div>
                                <div>
                                  <span>Label profile</span>
                                  <strong>{invoice.paymentConfirmation.paymentProfileSnapshot.profileLabel ?? "-"}</strong>
                                </div>
                                <div>
                                  <span>Profile ID</span>
                                  <strong>{invoice.paymentConfirmation.paymentProfileSnapshot.profileId ?? "-"}</strong>
                                </div>
                                <div>
                                  <span>Catatan submit</span>
                                  <strong>{invoice.paymentConfirmation.paymentProfileSnapshot.submittedNotes ?? "-"}</strong>
                                </div>
                              </div>
                            ) : null}
                          </>
                        ) : null}

                        <div className="tenant-actions">
                          <span className="tenant-inline-notice">
                            Dibuat pada {formatDateTime(invoice.createdAt)}.
                          </span>

                          {canApprovePaymentConfirmation(invoice) ? (
                            <form
                              action={approveSubscriptionInvoicePaymentConfirmationAction.bind(
                                null,
                                invoice.tenantId as number,
                              )}
                            >
                              <button type="submit" className="primary-button">
                                Approve Pembayaran
                              </button>
                            </form>
                          ) : null}
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="tenant-actions">
                  {hasPreviousPage ? (
                    <Link
                      href={createPageHref({
                        isPaid,
                        domain,
                        page: invoiceData.paging.page - 1,
                      })}
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
                    Halaman {invoiceData.paging.page} dari {totalPages}
                  </span>

                  {hasNextPage ? (
                    <Link
                      href={createPageHref({
                        isPaid,
                        domain,
                        page: invoiceData.paging.page + 1,
                      })}
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
