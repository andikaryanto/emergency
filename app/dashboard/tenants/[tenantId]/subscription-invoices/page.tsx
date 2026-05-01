import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getLandlordAccessToken,
  getLandlordAuthorizationHeader,
} from "../../../../../lib/landlord/auth-session";
import { formatCurrency, formatDateTime } from "../../../../../lib/format";
import {
  ListPaymentProfilesError,
  listPaymentProfiles,
} from "../../../../../lib/landlord/list-payment-profiles";
import {
  ListTenantSubscriptionInvoicesError,
  type ListTenantSubscriptionInvoicesResponse,
  type TenantSubscriptionInvoice,
  listTenantSubscriptionInvoices,
} from "../../../../../lib/landlord/list-tenant-subscription-invoices";
import { PaymentConfirmationButton } from "./payment-confirmation-button";

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

const transferDestination = {
  accountHolderName: "ANDI ARYANTO",
  bankName: "Bank Mandiri",
  accountNumber: "1380019002919",
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

function getConfirmationStatusLabel(invoice: TenantSubscriptionInvoice) {
  if (!invoice.paymentConfirmation) {
    return null;
  }

  const normalizedStatus = invoice.paymentConfirmation.status?.trim().toLowerCase();

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

function isPaymentConfirmationApproved(invoice: TenantSubscriptionInvoice) {
  return invoice.paymentConfirmation?.status?.trim().toLowerCase() === "approved";
}

function canManagePaymentConfirmation(invoice: TenantSubscriptionInvoice) {
  return invoice.status !== "paid" && !isPaymentConfirmationApproved(invoice);
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
  let paymentProfileErrorMessage: string | null = null;
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
  let paymentProfiles = [] as Awaited<ReturnType<typeof listPaymentProfiles>>["paymentProfiles"];

  try {
    invoiceData = await listTenantSubscriptionInvoices(resolvedTenantId, authorizationHeader);
  } catch (error) {
    invoiceErrorMessage =
      error instanceof ListTenantSubscriptionInvoicesError
        ? error.message
        : "Invoice tenant tidak dapat dimuat saat ini.";
  }

  try {
    const paymentProfileData = await listPaymentProfiles(authorizationHeader);

    paymentProfiles = paymentProfileData.paymentProfiles;
  } catch (error) {
    paymentProfileErrorMessage =
      error instanceof ListPaymentProfilesError
        ? error.message
        : "Payment profile tidak dapat dimuat saat ini.";
  }

  const tenantName = invoiceData.tenant?.name ?? `Tenant #${tenantId}`;
  const tenantDomain = invoiceData.tenant?.domain ?? "-";
  const billingCycleLabel = formatBillingCycleLabel(invoiceData.tenant?.billingCycle ?? null);
  const pricingLabel = invoiceData.tenant?.pricingName
    ? billingCycleLabel
      ? `${invoiceData.tenant.pricingName} - ${billingCycleLabel}`
      : invoiceData.tenant.pricingName
    : "-";
  const defaultPaymentProfile =
    paymentProfiles.find((profile) => profile.isDefault && profile.isActive) ??
    paymentProfiles.find((profile) => profile.isDefault) ??
    paymentProfiles.find((profile) => profile.isActive) ??
    paymentProfiles[0] ??
    null;
  const hasDefaultPaymentProfile = Boolean(defaultPaymentProfile);

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
              Tinjau invoice langganan tenant ini dan kirim konfirmasi pembayaran bila diperlukan.
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
                lalu kirim konfirmasi pembayaran.
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
            </p>
          </section>

          <section
            className="dashboard-feedback tenant-invoice-summary tenant-transfer-destination"
            aria-label="Rekening tujuan transfer"
          >
            <strong>Rekening tujuan transfer</strong>
            <p>
              Silakan transfer pembayaran invoice ke rekening berikut, lalu kirim konfirmasi pembayaran.
            </p>
            <div className="tenant-meta tenant-transfer-meta">
              <div>
                <span>Nama pemilik</span>
                <strong>{transferDestination.accountHolderName}</strong>
              </div>
              <div>
                <span>Bank</span>
                <strong>{transferDestination.bankName}</strong>
              </div>
              <div>
                <span>Nomor rekening</span>
                <strong>{transferDestination.accountNumber}</strong>
              </div>
            </div>
          </section>

          {paymentProfileErrorMessage ? (
            <section className="dashboard-feedback">{paymentProfileErrorMessage}</section>
          ) : !defaultPaymentProfile ? (
            <section className="dashboard-feedback">
              Belum ada payment profile default. Tambahkan dulu di{" "}
              <Link href="/dashboard/payment-profile">halaman Profil Pembayaran</Link>
              {" "}agar konfirmasi pembayaran bisa dikirim.
            </section>
          ) : (
            <section className="dashboard-feedback tenant-invoice-summary">
              <strong>Profile default: {defaultPaymentProfile.displayName}</strong>
              <p>
                Data awal diambil dari profile default dan masih bisa Anda ubah saat mengirim konfirmasi pembayaran.
              </p>
            </section>
          )}

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
                    Semua invoice di halaman ini belum dibayar.
                  </p>
                </div>
              </div>

              <div className="tenant-list admin-invoice-list">
                {invoiceData.invoices.map((invoice) => {
                  const status = getStatusLabel(invoice);
                  const confirmationStatus = getConfirmationStatusLabel(invoice);

                  return (
                    <article className="tenant-card" key={invoice.id}>
                      <div className="tenant-card-head">
                        <div>
                          <h3>{invoice.invoiceNumber}</h3>
                          <span className="admin-invoice-tenant">{tenantName}</span>
                        </div>
                        <div className="tenant-status-group">
                          {confirmationStatus ? (
                            <span className={`tenant-status ${confirmationStatus.className}`}>
                              {confirmationStatus.label}
                            </span>
                          ) : null}
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

                      {invoice.paymentConfirmation ? (
                        <p className="tenant-inline-notice tenant-inline-notice-payment">
                          Konfirmasi pembayaran sudah ada dengan status{" "}
                          <strong>{invoice.paymentConfirmation.status ?? "pending"}</strong>.
                          Dikirim pada {formatDateTime(invoice.paymentConfirmation.submittedAt)}.
                        </p>
                      ) : (
                        <p className="tenant-inline-notice tenant-inline-notice-payment">
                          Belum ada konfirmasi pembayaran untuk invoice ini.
                        </p>
                      )}

                      <div className="tenant-actions">
                        <span className="tenant-inline-notice tenant-invoice-created-at">
                          Dibuat pada {formatDateTime(invoice.createdAt)}.
                        </span>
                        {hasDefaultPaymentProfile && canManagePaymentConfirmation(invoice) ? (
                          <PaymentConfirmationButton
                            tenantId={resolvedTenantId}
                            invoiceId={invoice.id}
                            amount={invoice.amount}
                            hasExistingConfirmation={Boolean(invoice.paymentConfirmation)}
                            paymentConfirmationId={invoice.paymentConfirmation?.id}
                            paymentProfile={{
                              id: defaultPaymentProfile.id,
                              displayName: defaultPaymentProfile.displayName,
                              paymentMethod: defaultPaymentProfile.paymentMethod,
                              accountHolderName: defaultPaymentProfile.accountHolderName,
                              bankName: defaultPaymentProfile.bankName,
                              accountNumber: defaultPaymentProfile.accountNumber,
                              notes: defaultPaymentProfile.notes,
                            }}
                          />
                        ) : hasDefaultPaymentProfile ? (
                          <button
                            type="button"
                            className="ghost-button payment-profile-toggle-button"
                            disabled
                            aria-disabled="true"
                            title="Konfirmasi pembayaran sudah tidak dapat diubah"
                          >
                            Konfirmasi Tidak Tersedia
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
