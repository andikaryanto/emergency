import { ApiError, apiEndpointUrls, requestJson } from "../api";

type JsonObject = Record<string, unknown>;

type ListSubscriptionInvoicesApiResponse = {
  message?: string;
  data?: {
    _resources?: JsonObject[];
    _paging?: {
      page?: number;
      limit?: number;
      total_data?: number;
      is_last_page?: boolean;
    };
  };
};

export type SubscriptionInvoice = {
  id: number | string;
  invoiceNumber: string;
  tenantId: number | null;
  tenantName: string;
  tenantDomain: string | null;
  subscriptionName: string | null;
  amount: number | null;
  isPaid: boolean;
  paidAt: string | null;
  dueDate: string | null;
  createdAt: string | null;
  paymentConfirmation: {
    id: number | null;
    status: string | null;
    notes: string | null;
    submittedAt: string | null;
    reviewedAt: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    paymentProfileSnapshot: {
      paymentMethod: string | null;
      accountHolderName: string | null;
      bankName: string | null;
      accountNumber: string | null;
      transferredAmount: number | null;
      profileId: number | null;
      profileLabel: string | null;
      submittedNotes: string | null;
    } | null;
  } | null;
};

export type ListSubscriptionInvoicesResponse = {
  invoices: SubscriptionInvoice[];
  paging: {
    page: number;
    limit: number;
    totalData: number;
    isLastPage: boolean;
  };
};

export class ListSubscriptionInvoicesError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = "ListSubscriptionInvoicesError";
    this.status = status;
  }
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getNestedObject(source: JsonObject, key: string) {
  const value = source[key];

  return isJsonObject(value) ? value : null;
}

function getString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function getNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = Number(value);

    if (Number.isFinite(normalized)) {
      return normalized;
    }
  }

  return null;
}

function getBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized === "true" || normalized === "1" || normalized === "paid") {
      return true;
    }

    if (normalized === "false" || normalized === "0" || normalized === "unpaid") {
      return false;
    }
  }

  return false;
}

function getInvoiceIdentity(invoice: JsonObject) {
  const id = invoice.id;

  if (typeof id === "number" || typeof id === "string") {
    return id;
  }

  const invoiceNumber =
    getString(invoice.invoice_number) ??
    getString(invoice.number) ??
    getString(invoice.code) ??
    getString(invoice.invoice_no);

  return invoiceNumber ?? "invoice-unknown";
}

function getInvoiceNumber(invoice: JsonObject, identity: number | string) {
  return (
    getString(invoice.invoice_number) ??
    getString(invoice.number) ??
    getString(invoice.code) ??
    getString(invoice.invoice_no) ??
    String(identity)
  );
}

function getTenant(invoice: JsonObject) {
  const subscription = getNestedObject(invoice, "subscription");
  const subscriptionInvoice = getNestedObject(invoice, "subscription_invoice");

  return (
    getNestedObject(invoice, "tenant") ??
    (subscription ? getNestedObject(subscription, "tenant") : null) ??
    (subscriptionInvoice ? getNestedObject(subscriptionInvoice, "tenant") : null)
  );
}

function getTenantId(invoice: JsonObject) {
  const tenant = getTenant(invoice);

  return getNumber(tenant?.id) ?? getNumber(invoice.tenant_id);
}

function getTenantName(invoice: JsonObject) {
  const tenant = getTenant(invoice);

  return (
    getString(tenant?.name) ??
    getString(invoice.tenant_name) ??
    getString(invoice.clinic_name) ??
    "-"
  );
}

function getTenantDomain(invoice: JsonObject) {
  const tenant = getTenant(invoice);

  return getString(tenant?.domain) ?? getString(invoice.domain) ?? null;
}

function getSubscriptionName(invoice: JsonObject) {
  const subscription = getNestedObject(invoice, "subscription");
  const subscriptionPricingPlan =
    getNestedObject(invoice, "subscription_pricing_plan") ??
    (subscription ? getNestedObject(subscription, "subscription_pricing_plan") : null);
  const subscriptionPricing =
    getNestedObject(invoice, "subscription_pricing") ??
    (subscriptionPricingPlan
      ? getNestedObject(subscriptionPricingPlan, "subscription_pricing")
      : null);

  return (
    getString(subscriptionPricing?.name) ??
    getString(subscriptionPricingPlan?.name) ??
    getString(invoice.subscription_name) ??
    null
  );
}

function getPaymentConfirmation(invoice: JsonObject) {
  const paymentConfirmation = getNestedObject(
    invoice,
    "subscription_invoice_payment_confirmation",
  );

  if (!paymentConfirmation) {
    return null;
  }

  const paymentProfileSnapshot = getNestedObject(
    paymentConfirmation,
    "payment_profile_snapshot",
  );

  return {
    id: getNumber(paymentConfirmation.id),
    status: getString(paymentConfirmation.status),
    notes: getString(paymentConfirmation.notes),
    submittedAt: getString(paymentConfirmation.submitted_at),
    reviewedAt: getString(paymentConfirmation.reviewed_at),
    createdAt: getString(paymentConfirmation.created_at),
    updatedAt: getString(paymentConfirmation.updated_at),
    paymentProfileSnapshot: paymentProfileSnapshot
      ? {
          paymentMethod: getString(paymentProfileSnapshot.payment_method),
          accountHolderName: getString(paymentProfileSnapshot.account_holder_name),
          bankName: getString(paymentProfileSnapshot.bank_name),
          accountNumber: getString(paymentProfileSnapshot.account_number),
          transferredAmount: getNumber(paymentProfileSnapshot.transferred_amount),
          profileId: getNumber(paymentProfileSnapshot.profile_id),
          profileLabel: getString(paymentProfileSnapshot.profile_label),
          submittedNotes: getString(paymentProfileSnapshot.submitted_notes),
        }
      : null,
  };
}

function normalizeListSubscriptionInvoicesResponse(
  payload: ListSubscriptionInvoicesApiResponse | null | undefined,
) {
  const resources = Array.isArray(payload?.data?._resources) ? payload.data._resources : [];
  const paging = payload?.data?._paging;

  const invoices = resources.flatMap((invoice) => {
    if (!isJsonObject(invoice)) {
      return [];
    }

    const identity = getInvoiceIdentity(invoice);

    return [
      {
        id: identity,
        invoiceNumber: getInvoiceNumber(invoice, identity),
        tenantId: getTenantId(invoice),
        tenantName: getTenantName(invoice),
        tenantDomain: getTenantDomain(invoice),
        subscriptionName: getSubscriptionName(invoice),
        amount:
          getNumber(invoice.amount) ??
          getNumber(invoice.total_amount) ??
          getNumber(invoice.grand_total),
        isPaid:
          getBoolean(invoice.is_paid) ||
          Boolean(getString(invoice.paid_at)) ||
          getString(invoice.status)?.toLowerCase() === "paid",
        paidAt: getString(invoice.paid_at),
        dueDate: getString(invoice.due_date),
        createdAt: getString(invoice.created_at),
        paymentConfirmation: getPaymentConfirmation(invoice),
      },
    ];
  });

  return {
    invoices,
    paging: {
      page: typeof paging?.page === "number" ? paging.page : 1,
      limit: typeof paging?.limit === "number" ? paging.limit : invoices.length,
      totalData:
        typeof paging?.total_data === "number"
          ? Math.max(paging.total_data, invoices.length)
          : invoices.length,
      isLastPage: typeof paging?.is_last_page === "boolean" ? paging.is_last_page : true,
    },
  } satisfies ListSubscriptionInvoicesResponse;
}

export async function listSubscriptionInvoices(
  headers: HeadersInit,
  options: {
    isPaid?: boolean;
    page?: number;
    domain?: string;
  } = {},
) {
  const url = new URL(apiEndpointUrls.landlord.subscriptionInvoices);

  url.searchParams.set("is_paid", String(options.isPaid ?? false));

  if (typeof options.page === "number" && Number.isFinite(options.page) && options.page > 0) {
    url.searchParams.set("page", String(options.page));
  }

  if (options.domain && options.domain.trim().length > 0) {
    url.searchParams.set("domain", options.domain.trim());
  }

  try {
    const response = await requestJson<ListSubscriptionInvoicesApiResponse, undefined>({
      url: url.toString(),
      method: "GET",
      headers,
    });

    return normalizeListSubscriptionInvoicesResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw new ListSubscriptionInvoicesError(
        error.status === 401
          ? "Sesi login sudah tidak valid. Silakan login ulang."
          : error.message,
        error.status,
      );
    }

    throw new ListSubscriptionInvoicesError(
      "Terjadi kesalahan tak terduga saat mengambil invoice langganan.",
    );
  }
}
