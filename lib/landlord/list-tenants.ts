import { ApiError, apiEndpointUrls, requestJson } from "../api";

type ListTenantsApiResponse = {
  message?: string;
  data?: {
    _resources?: Array<{
      id?: number;
      name?: string;
      domain?: string;
      pricing?: string;
      is_demo?: boolean;
      is_active?: boolean;
      is_process_complete?: boolean;
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
  pricing: "Basic" | "Advance" | null;
  isDemo: boolean;
  isActive: boolean;
  isProcessComplete: boolean;
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

function normalizeListTenantsResponse(payload: ListTenantsApiResponse) {
  const resources = payload.data?._resources ?? [];
  const paging = payload.data?._paging;

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
      typeof tenant.pricing === "string" &&
      (tenant.pricing.toLowerCase() === "basic" ||
        tenant.pricing.toLowerCase() === "advance")
        ? (tenant.pricing.charAt(0).toUpperCase() +
            tenant.pricing.slice(1).toLowerCase()) as "Basic" | "Advance"
        : null;

    return [
      {
        id: tenant.id,
        name: tenant.name,
        domain: tenant.domain,
        pricing: normalizedPricing,
        isDemo: Boolean(tenant.is_demo),
        isActive: Boolean(tenant.is_active),
        isProcessComplete: Boolean(tenant.is_process_complete),
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
