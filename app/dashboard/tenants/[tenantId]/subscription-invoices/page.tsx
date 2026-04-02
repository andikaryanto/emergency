import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getLandlordAccessToken,
  getLandlordAuthorizationHeader,
} from "../../../../../lib/landlord/auth-session";
import {
  ListTenantSubscriptionInvoicesError,
  type ListTenantSubscriptionInvoicesResponse,
  type TenantSubscriptionInvoice,
  listTenantSubscriptionInvoices,
} from "../../../../../lib/landlord/list-tenant-subscription-invoices";
import { formatCurrency, formatDateTime } from "../../../../../lib/format";

export const metadata: Metadata = {
  title: "Konfirmasi Pembayaran Invoice",
  description:
    "Halaman untuk melihat invoice langganan tenant dan menyiapkan konfirmasi pembayarannya.",
};

type TenantSubscriptionInvoicesPageProps = {
  params: Promise<{
    tenantId: string;
  }>;
};

function formatBillingCycleLabel(value: "monthly" | "yearly" | null) {
  if (value === "monthly") {
    return "Bulanan";
  }

  if (value === "yearly") {
    return "Tahunan";
  }

  return null;
}

function getStatusLabel(invoice: TenantSubscriptionInvoice) {
  if (invoice.status === "paid") {
    return {
      label: "Paid",
      className: "active",
    } as const;
  }

  return {
    label: "Belum Dibayar",
    className: "pending",
  } as const;
}

export default async function TenantSubscriptionInvoicesPage({
  params,
}: TenantSubscriptionInvoicesPageProps) {
  const [accessToken, authorizationHeader] = await Promise.all([
    getLandlordAccessToken(),
    getLandlordAuthorizationHeader(),
  ]);

  if (!accessToken) {
    redirect("/login");
  }

  const { tenantId } = await params;
  const resolvedTenantId = Number(tenantId);

  if (!Number.isInteger(resolvedTenantId) || resolvedTenantId <= 0) {
    redirect("/dashboard");
  }

  let invoiceErrorMessage: string | null = null;
  let invoiceData: ListTenantSubscriptionInvoicesResponse = {
    tenant: null,
    invoices: [],
    unpaidInvoices: [],
    paging: {
      page: 1,
      limit: 10,
      totalData: 0,
      isLastPage: true,
    },
  };

  try {
    invoiceData = await listTenantSubscriptionInvoices(resolvedTenantId, authorizationHeader);
  } catch (error) {
    invoiceErrorMessage =
      error instanceof ListTenantSubscriptionInvoicesError
        ? error.message
        : "Invoice tenant tidak dapat dimuat saat ini.";
  }

  const tenantName = invoiceData.tenant?.name ?? `Tenant #${tenantId}`;
  const tenantDomain = invoiceData.tenant?.domain ?? "-";
  const billingCycleLabel = formatBillingCycleLabel(invoiceData.tenant?.billingCycle ?? null);
  const pricingLabel = invoiceData.tenant?.pricingName
    ? billingCycleLabel
      ? `${invoiceData.tenant.pricingName} - ${billingCycleLabel}`
      : invoiceData.tenant.pricingName
    : "-";

  return (
    <main className="dashboard-shell">
      <section className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="dashboard-brand">
            <span className="brand-logo">+</span>
            <div>
              <p>Klinik RME</p>
              <span>Konfirmasi Pembayaran</span>
            </div>
          </div>

          <div className="dashboard-note">
            <span className="card-label">Invoice tenant</span>
            <strong>{tenantName}</strong>
            <p>
              Tinjau invoice langganan yang aktif untuk tenant ini, lalu lanjutkan ke
              proses konfirmasi pembayaran saat invoice sudah siap dibayar.
            </p>
          </div>
        </aside>

        <section className="dashboard-main">
          <header className="dashboard-header">
            <div>
              <span className="eyebrow">Subscription Invoice</span>
              <h1>Konfirmasi pembayaran untuk {tenantName}.</h1>
              <p>
                Cek invoice yang belum dibayar, pastikan nominal dan jatuh temponya,
                lalu gunakan halaman ini sebagai pintu masuk ke alur konfirmasi pembayaran.
              </p>
            </div>

            <div className="dashboard-header-actions">
              <Link href="/dashboard" className="ghost-button">
                Kembali ke dashboard
              </Link>
            </div>
          </header>

          <section className="dashboard-overview" aria-label="Ringkasan invoice tenant">
            <article className="dashboard-stat">
              <span>Belum dibayar</span>
              <strong>{invoiceData.invoices.length}</strong>
            </article>
            <article className="dashboard-stat">
              <span>Paket aktif</span>
              <strong>{pricingLabel}</strong>
            </article>
            <article className="dashboard-stat">
              <span>Status halaman</span>
              <strong>Invoice Unpaid</strong>
            </article>
          </section>

          <section className="dashboard-feedback tenant-invoice-summary">
            <strong>{tenantDomain}</strong>
            <p>
              Nominal paket saat ini {formatCurrency(invoiceData.tenant?.amount ?? null)}.
              {" "}Halaman ini menampilkan invoice langganan tenant yang bisa Anda cek
              sebelum melakukan konfirmasi pembayaran.
            </p>
          </section>

          {invoiceErrorMessage ? (
            <section className="dashboard-feedback">{invoiceErrorMessage}</section>
          ) : invoiceData.invoices.length === 0 ? (
            <section className="dashboard-feedback">
              Belum ada invoice langganan yang belum dibayar untuk tenant ini.
            </section>
          ) : (
            <section className="tenant-section" aria-labelledby="tenant-subscription-invoices">
              <div className="tenant-section-head">
                <div>
                  <span className="eyebrow">Invoice Tenant</span>
                  <h2 id="tenant-subscription-invoices">Daftar invoice belum dibayar</h2>
                  <p>
                    Semua invoice di halaman ini adalah invoice unpaid yang siap Anda
                    lanjutkan ke proses konfirmasi pembayaran.
                  </p>
                </div>
              </div>

              <div className="tenant-list admin-invoice-list">
                {invoiceData.invoices.map((invoice) => {
                  const status = getStatusLabel(invoice);

                  return (
                    <article className="tenant-card" key={invoice.id}>
                      <div className="tenant-card-head">
                        <div>
                          <h3>{invoice.invoiceNumber}</h3>
                          <span className="admin-invoice-tenant">{tenantName}</span>
                        </div>
                        <div className="tenant-status-group">
                          <span className={`tenant-status ${status.className}`}>
                            {status.label}
                          </span>
                        </div>
                      </div>

                      <div className="tenant-meta tenant-invoice-meta">
                        <div>
                          <span>Nominal</span>
                          <strong>{formatCurrency(invoice.amount)}</strong>
                        </div>
                        <div>
                          <span>Mulai periode</span>
                          <strong>{formatDateTime(invoice.periodStart)}</strong>
                        </div>
                        <div>
                          <span>Jatuh tempo</span>
                          <strong>{formatDateTime(invoice.dueAt)}</strong>
                        </div>
                        <div>
                          <span>Dibayar pada</span>
                          <strong>{formatDateTime(invoice.paidAt)}</strong>
                        </div>
                      </div>

                      {invoice.notes ? (
                        <p className="tenant-inline-notice tenant-inline-notice-payment">
                          {invoice.notes}
                        </p>
                      ) : null}

                      <div className="tenant-actions">
                        <span className="tenant-inline-notice tenant-invoice-created-at">
                          Dibuat pada {formatDateTime(invoice.createdAt)}.
                        </span>
                        {invoice.status === "unpaid" ? (
                          <button type="button" className="primary-button tenant-payment-button">
                            Konfirmasi Pembayaran
                          </button>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </section>
      </section>
    </main>
  );
}
