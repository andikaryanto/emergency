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
  tenantName: string;
  subscriptionName: string | null;
  amount: number | null;
  isPaid: boolean;
  paidAt: string | null;
  dueDate: string | null;
  createdAt: string | null;
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

function getTenantName(invoice: JsonObject) {
  const subscription = getNestedObject(invoice, "subscription");
  const subscriptionInvoice = getNestedObject(invoice, "subscription_invoice");
  const tenant =
    getNestedObject(invoice, "tenant") ??
    (subscription ? getNestedObject(subscription, "tenant") : null) ??
    (subscriptionInvoice ? getNestedObject(subscriptionInvoice, "tenant") : null);

  return (
    getString(tenant?.name) ??
    getString(invoice.tenant_name) ??
    getString(invoice.clinic_name) ??
    "-"
  );
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

function normalizeListSubscriptionInvoicesResponse(
  payload: ListSubscriptionInvoicesApiResponse,
) {
  const resources = Array.isArray(payload.data?._resources) ? payload.data._resources : [];
  const paging = payload.data?._paging;

  const invoices = resources.flatMap((invoice) => {
    if (!isJsonObject(invoice)) {
      return [];
    }

    const identity = getInvoiceIdentity(invoice);

    return [
      {
        id: identity,
        invoiceNumber: getInvoiceNumber(invoice, identity),
        tenantName: getTenantName(invoice),
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
  } = {},
) {
  const url = new URL(apiEndpointUrls.landlord.subscriptionInvoices);

  url.searchParams.set("is_paid", String(options.isPaid ?? false));

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
