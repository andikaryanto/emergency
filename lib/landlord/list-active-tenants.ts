import { ApiError, apiEndpointUrls, requestJson } from "../api";

type JsonObject = Record<string, unknown>;

type ListActiveTenantsApiResponse = {
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

export type ActiveTenant = {
  id: number;
  name: string;
  domain: string;
  pricing: "Basic" | "Advance" | "Pro" | null;
  billingCycle: "monthly" | "yearly" | null;
  isDemo: boolean;
  isActive: boolean;
  isProcessComplete: boolean;
  hasReadyPaymentInvoice: boolean;
  trialEndsAt: string | null;
  paidAt: string | null;
  disabledAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type ListActiveTenantsResponse = {
  tenants: ActiveTenant[];
  paging: {
    page: number;
    limit: number;
    totalData: number;
    isLastPage: boolean;
  };
};

type ListActiveTenantsOptions = {
  page?: number;
};

export class ListActiveTenantsError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = "ListActiveTenantsError";
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

function hasOwnKey(source: JsonObject, key: string) {
  return Object.prototype.hasOwnProperty.call(source, key);
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

    if (normalized === "true" || normalized === "1" || normalized === "active") {
      return true;
    }

    if (normalized === "false" || normalized === "0" || normalized === "inactive") {
      return false;
    }
  }

  return false;
}

function normalizePricingName(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === "basic" || normalized === "advance" || normalized === "pro") {
    return (normalized.charAt(0).toUpperCase() + normalized.slice(1)) as
      | "Basic"
      | "Advance"
      | "Pro";
  }

  return null;
}

function normalizeBillingCycle(value: unknown): "monthly" | "yearly" | null {
  if (value === "monthly" || value === "yearly") {
    return value;
  }

  return null;
}

function normalizeListActiveTenantsResponse(
  payload: ListActiveTenantsApiResponse | null | undefined,
) {
  const resources = Array.isArray(payload?.data?._resources) ? payload.data._resources : [];
  const paging = payload?.data?._paging;

  const tenants = resources.flatMap((resource) => {
    if (!isJsonObject(resource)) {
      return [];
    }

    const subscriptionPricingPlan =
      getNestedObject(resource, "subscription_pricing_plan") ??
      getNestedObject(resource, "pricing_plan");
    const subscriptionPricing =
      (subscriptionPricingPlan
        ? getNestedObject(subscriptionPricingPlan, "subscription_pricing")
        : null) ??
      getNestedObject(resource, "subscription_pricing");

    const id = getNumber(resource.id);
    const name = getString(resource.name);
    const domain = getString(resource.domain);

    if (id === null || !name || !domain) {
      return [];
    }

    return [
      {
        id,
        name,
        domain,
        pricing:
          normalizePricingName(subscriptionPricing?.name) ??
          normalizePricingName(subscriptionPricingPlan?.name) ??
          normalizePricingName(resource.pricing),
        billingCycle: normalizeBillingCycle(
          subscriptionPricingPlan?.billing_cycle ?? resource.billing_cycle,
        ),
        isDemo: getBoolean(resource.is_demo),
        isActive: hasOwnKey(resource, "is_active") ? getBoolean(resource.is_active) : true,
        isProcessComplete: hasOwnKey(resource, "is_process_complete")
          ? getBoolean(resource.is_process_complete)
          : true,
        hasReadyPaymentInvoice: getBoolean(resource.has_ready_payment_invoice),
        trialEndsAt: getString(resource.trial_ends_at),
        paidAt: getString(resource.paid_at),
        disabledAt: getString(resource.disabled_at),
        createdAt: getString(resource.created_at),
        updatedAt: getString(resource.updated_at),
      },
    ];
  });

  return {
    tenants,
    paging: {
      page: typeof paging?.page === "number" ? paging.page : 1,
      limit: typeof paging?.limit === "number" ? paging.limit : tenants.length,
      totalData:
        typeof paging?.total_data === "number"
          ? Math.max(paging.total_data, tenants.length)
          : tenants.length,
      isLastPage: typeof paging?.is_last_page === "boolean" ? paging.is_last_page : true,
    },
  } satisfies ListActiveTenantsResponse;
}

export async function listActiveTenants(
  headers: HeadersInit,
  options: ListActiveTenantsOptions = {},
) {
  const params = new URLSearchParams();

  if (typeof options.page === "number" && Number.isInteger(options.page) && options.page > 0) {
    params.set("page", String(options.page));
  }

  const url = params.size
    ? `${apiEndpointUrls.landlord.activeTenants}?${params.toString()}`
    : apiEndpointUrls.landlord.activeTenants;

  try {
    const response = await requestJson<ListActiveTenantsApiResponse, undefined>({
      url,
      method: "GET",
      headers,
    });

    return normalizeListActiveTenantsResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw new ListActiveTenantsError(
        error.status === 401
          ? "Sesi login sudah tidak valid. Silakan login ulang."
          : error.message,
        error.status,
      );
    }

    throw new ListActiveTenantsError(
      "Terjadi kesalahan tak terduga saat mengambil tenant aktif.",
    );
  }
}
