import { ApiError, apiEndpointUrls, requestJson } from "../api";

type TenantSubscriptionPricingApiResource = {
  id?: unknown;
  code?: unknown;
  name?: unknown;
};

type TenantSubscriptionPricingPlanApiResource = {
  id?: unknown;
  code?: unknown;
  name?: unknown;
  description?: unknown;
  amount?: unknown;
  billing_cycle?: unknown;
  subscription_pricing?: TenantSubscriptionPricingApiResource | null;
};

type ListTenantsApiResponse = {
  message?: string;
  data?: {
    _resources?: Array<{
      id?: number;
      name?: string;
      domain?: string;
      pricing?: string;
      subscription_pricing_plan?: TenantSubscriptionPricingPlanApiResource | null;
      is_demo?: boolean;
      is_active?: boolean;
      is_process_complete?: boolean;
      has_ready_payment_invoice?: boolean;
      trial_ends_at?: string | null;
      paid_at?: string | null;
      disabled_at?: string | null;
      created_at?: string;
      updated_at?: string;
    }>;
    _paging?: {
      page?: number;
      limit?: number;
      total_data?: number;
      is_last_page?: boolean;
    };
  };
};

export type LandlordTenant = {
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
  createdAt: string;
  updatedAt: string;
};

export type ListLandlordTenantsResponse = {
  tenants: LandlordTenant[];
  paging: {
    page: number;
    limit: number;
    totalData: number;
    isLastPage: boolean;
  };
};

export class ListLandlordTenantsError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = "ListLandlordTenantsError";
    this.status = status;
  }
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

function normalizeListTenantsResponse(payload: ListTenantsApiResponse | null | undefined) {
  const resources = payload?.data?._resources ?? [];
  const paging = payload?.data?._paging;

  const tenants = resources.flatMap((tenant) => {
    if (
      typeof tenant.id !== "number" ||
      typeof tenant.name !== "string" ||
      typeof tenant.domain !== "string" ||
      typeof tenant.created_at !== "string" ||
      typeof tenant.updated_at !== "string"
    ) {
      return [];
    }

    const normalizedPricing =
      normalizePricingName(tenant.subscription_pricing_plan?.subscription_pricing?.name) ??
      normalizePricingName(tenant.subscription_pricing_plan?.name) ??
      normalizePricingName(tenant.pricing);
    const normalizedBillingCycle = normalizeBillingCycle(
      tenant.subscription_pricing_plan?.billing_cycle,
    );

    return [
      {
        id: tenant.id,
        name: tenant.name,
        domain: tenant.domain,
        pricing: normalizedPricing,
        billingCycle: normalizedBillingCycle,
        isDemo: Boolean(tenant.is_demo),
        isActive: Boolean(tenant.is_active),
        isProcessComplete: Boolean(tenant.is_process_complete),
        hasReadyPaymentInvoice: Boolean(tenant.has_ready_payment_invoice),
        trialEndsAt:
          typeof tenant.trial_ends_at === "string" ? tenant.trial_ends_at : null,
        paidAt: typeof tenant.paid_at === "string" ? tenant.paid_at : null,
        disabledAt:
          typeof tenant.disabled_at === "string" ? tenant.disabled_at : null,
        createdAt: tenant.created_at,
        updatedAt: tenant.updated_at,
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
  } satisfies ListLandlordTenantsResponse;
}

export async function listLandlordTenants(headers: HeadersInit) {
  try {
    const response = await requestJson<ListTenantsApiResponse, undefined>({
      url: apiEndpointUrls.landlord.tenants,
      method: "GET",
      headers,
    });

    return normalizeListTenantsResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw new ListLandlordTenantsError(
        error.status === 401
          ? "Sesi login sudah tidak valid. Silakan login ulang."
          : error.message,
        error.status,
      );
    }

    throw new ListLandlordTenantsError(
      "Terjadi kesalahan tak terduga saat mengambil tenant.",
    );
  }
}
