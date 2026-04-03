import { ApiError, apiEndpointUrls, requestJson } from "../api";

type JsonObject = Record<string, unknown>;

type TenantSubscriptionPricingApiResource = {
  name?: unknown;
};

type TenantSubscriptionPricingPlanApiResource = {
  name?: unknown;
  billing_cycle?: unknown;
  amount?: unknown;
  subscription_pricing?: TenantSubscriptionPricingApiResource | null;
};

type TenantApiResource = {
  id?: unknown;
  name?: unknown;
  domain?: unknown;
  has_ready_payment_invoice?: unknown;
  subscription_pricing_plan?: TenantSubscriptionPricingPlanApiResource | null;
};

type TenantSubscriptionInvoiceApiResource = {
  id?: unknown;
  invoice_number?: unknown;
  amount?: unknown;
  status?: unknown;
  period_start?: unknown;
  period_end?: unknown;
  due_at?: unknown;
  paid_at?: unknown;
  notes?: unknown;
  created_at?: unknown;
  updated_at?: unknown;
  tenant?: TenantApiResource | null;
  unpaid_subscription_invoices?: unknown;
  subscription_pricing_plan?: TenantSubscriptionPricingPlanApiResource | null;
  subscription_invoice_payment_confirmation?: unknown;
};

type ListTenantSubscriptionInvoicesApiResponse = {
  data?: {
    _resources?: TenantSubscriptionInvoiceApiResource[];
    _paging?: {
      page?: unknown;
      limit?: unknown;
      total_data?: unknown;
      is_last_page?: unknown;
    };
  };
};

export type TenantSubscriptionInvoice = {
  id: number;
  invoiceNumber: string;
  amount: number;
  status: "paid" | "unpaid" | string;
  periodStart: string | null;
  periodEnd: string | null;
  dueAt: string | null;
  paidAt: string | null;
  notes: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  paymentConfirmation: {
    id: number | null;
    status: string | null;
    notes: string | null;
    submittedAt: string | null;
    reviewedAt: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    paymentProfileSnapshot: JsonObject | null;
    selfLink: string | null;
  } | null;
};

export type TenantSubscriptionInvoiceTenant = {
  id: number;
  name: string;
  domain: string;
  hasReadyPaymentInvoice: boolean;
  pricingName: string | null;
  billingCycle: "monthly" | "yearly" | null;
  amount: number | null;
};

export type ListTenantSubscriptionInvoicesResponse = {
  tenant: TenantSubscriptionInvoiceTenant | null;
  invoices: TenantSubscriptionInvoice[];
  unpaidInvoices: TenantSubscriptionInvoice[];
  paging: {
    page: number;
    limit: number;
    totalData: number;
    isLastPage: boolean;
  };
};

export class ListTenantSubscriptionInvoicesError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = "ListTenantSubscriptionInvoicesError";
    this.status = status;
  }
}

function getString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function getNestedObject(source: JsonObject, key: string) {
  const value = source[key];

  return isJsonObject(value) ? value : null;
}

function normalizeBillingCycle(value: unknown): "monthly" | "yearly" | null {
  return value === "monthly" || value === "yearly" ? value : null;
}

function normalizeStatus(value: unknown): "paid" | "unpaid" | string {
  const normalized = getString(value)?.trim().toLowerCase();

  if (normalized === "paid" || normalized === "unpaid") {
    return normalized;
  }

  return normalized ?? "unpaid";
}

function normalizeInvoice(
  invoice: TenantSubscriptionInvoiceApiResource,
): TenantSubscriptionInvoice | null {
  const id = getNumber(invoice.id);
  const invoiceNumber = getString(invoice.invoice_number);
  const amount = getNumber(invoice.amount);

  if (id === null || invoiceNumber === null || amount === null) {
    return null;
  }

  const paymentConfirmation = isJsonObject(invoice.subscription_invoice_payment_confirmation)
    ? invoice.subscription_invoice_payment_confirmation
    : null;
  const paymentConfirmationLink = paymentConfirmation
    ? getNestedObject(paymentConfirmation, "_link")
    : null;

  return {
    id,
    invoiceNumber,
    amount,
    status: normalizeStatus(invoice.status),
    periodStart: getString(invoice.period_start),
    periodEnd: getString(invoice.period_end),
    dueAt: getString(invoice.due_at),
    paidAt: getString(invoice.paid_at),
    notes: getString(invoice.notes),
    createdAt: getString(invoice.created_at),
    updatedAt: getString(invoice.updated_at),
    paymentConfirmation: paymentConfirmation
      ? {
          id: getNumber(paymentConfirmation.id),
          status: getString(paymentConfirmation.status),
          notes: getString(paymentConfirmation.notes),
          submittedAt: getString(paymentConfirmation.submitted_at),
          reviewedAt: getString(paymentConfirmation.reviewed_at),
          createdAt: getString(paymentConfirmation.created_at),
          updatedAt: getString(paymentConfirmation.updated_at),
          paymentProfileSnapshot: getNestedObject(
            paymentConfirmation,
            "payment_profile_snapshot",
          ),
          selfLink: getString(paymentConfirmationLink?.self),
        }
      : null,
  };
}

function normalizeTenant(
  invoice: TenantSubscriptionInvoiceApiResource | undefined,
): TenantSubscriptionInvoiceTenant | null {
  const tenant = invoice?.tenant;

  if (!tenant) {
    return null;
  }

  const id = getNumber(tenant?.id);
  const name = getString(tenant?.name);
  const domain = getString(tenant?.domain);

  if (id === null || name === null || domain === null) {
    return null;
  }

  const pricingPlan = tenant.subscription_pricing_plan ?? invoice?.subscription_pricing_plan;

  return {
    id,
    name,
    domain,
    hasReadyPaymentInvoice: Boolean(tenant.has_ready_payment_invoice),
    pricingName:
      getString(pricingPlan?.subscription_pricing?.name) ?? getString(pricingPlan?.name),
    billingCycle: normalizeBillingCycle(pricingPlan?.billing_cycle),
    amount: getNumber(pricingPlan?.amount),
  };
}

function normalizeListTenantSubscriptionInvoicesResponse(
  payload: ListTenantSubscriptionInvoicesApiResponse | null | undefined,
) {
  const resources = Array.isArray(payload?.data?._resources) ? payload.data._resources : [];
  const paging = payload?.data?._paging;
  const invoices = resources.flatMap((invoice) => {
    const normalized = normalizeInvoice(invoice);

    return normalized ? [normalized] : [];
  });
  const unpaidInvoices = invoices.filter((invoice) => invoice.status === "unpaid");

  return {
    tenant: normalizeTenant(resources[0]),
    invoices,
    unpaidInvoices,
    paging: {
      page: getNumber(paging?.page) ?? 1,
      limit: getNumber(paging?.limit) ?? invoices.length,
      totalData: getNumber(paging?.total_data) ?? invoices.length,
      isLastPage: typeof paging?.is_last_page === "boolean" ? paging.is_last_page : true,
    },
  } satisfies ListTenantSubscriptionInvoicesResponse;
}

export async function listTenantSubscriptionInvoices(
  tenantId: number,
  headers: HeadersInit,
) {
  const url = new URL(`${apiEndpointUrls.landlord.tenant}/${tenantId}/subscription-invoices`);

  url.searchParams.set("is_paid", "false");

  try {
    const response = await requestJson<ListTenantSubscriptionInvoicesApiResponse, undefined>({
      url: url.toString(),
      method: "GET",
      headers,
    });

    return normalizeListTenantSubscriptionInvoicesResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw new ListTenantSubscriptionInvoicesError(
        error.status === 401
          ? "Sesi login sudah tidak valid. Silakan login ulang."
          : error.message,
        error.status,
      );
    }

    throw new ListTenantSubscriptionInvoicesError(
      "Terjadi kesalahan tak terduga saat mengambil invoice tenant.",
    );
  }
}
