import { ApiError, apiEndpointUrls, requestJson } from "../api";

type PaymentProfileApiResource = {
  id?: unknown;
  user_id?: unknown;
  payment_method?: unknown;
  account_holder_name?: unknown;
  account_number?: unknown;
  bank_name?: unknown;
  notes?: unknown;
  is_default?: unknown;
  is_active?: unknown;
  created_at?: unknown;
  updated_at?: unknown;
};

type ListPaymentProfilesApiResponse = {
  data?: {
    _resources?: PaymentProfileApiResource[];
    _paging?: {
      page?: unknown;
      limit?: unknown;
      total_data?: unknown;
      is_last_page?: unknown;
    };
  };
};

export type PaymentProfile = {
  id: number;
  userId: number | null;
  displayName: string;
  paymentMethod: string | null;
  accountHolderName: string | null;
  accountNumber: string | null;
  bankName: string | null;
  notes: string | null;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

export type ListPaymentProfilesResponse = {
  paymentProfiles: PaymentProfile[];
  paging: {
    page: number;
    limit: number;
    totalData: number;
    isLastPage: boolean;
  };
};

export class ListPaymentProfilesError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = "ListPaymentProfilesError";
    this.status = status;
  }
}

function getString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function getNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizePaymentProfile(
  profile: PaymentProfileApiResource,
): PaymentProfile | null {
  const id = getNumber(profile.id);

  if (id === null) {
    return null;
  }

  const displayName =
    getString(profile.account_holder_name) ??
    getString(profile.bank_name) ??
    "Profil Pembayaran";

  return {
    id,
    userId: getNumber(profile.user_id),
    displayName,
    paymentMethod: getString(profile.payment_method),
    accountHolderName: getString(profile.account_holder_name),
    accountNumber: getString(profile.account_number),
    bankName: getString(profile.bank_name),
    notes: getString(profile.notes),
    isDefault: Boolean(profile.is_default),
    isActive: Boolean(profile.is_active),
    createdAt: getString(profile.created_at),
    updatedAt: getString(profile.updated_at),
  };
}

function normalizeListPaymentProfilesResponse(
  payload: ListPaymentProfilesApiResponse,
) {
  const resources = Array.isArray(payload.data?._resources) ? payload.data._resources : [];
  const paging = payload.data?._paging;
  const paymentProfiles = resources.flatMap((profile) => {
    const normalized = normalizePaymentProfile(profile);

    return normalized ? [normalized] : [];
  });

  return {
    paymentProfiles,
    paging: {
      page: getNumber(paging?.page) ?? 1,
      limit: getNumber(paging?.limit) ?? paymentProfiles.length,
      totalData: getNumber(paging?.total_data) ?? paymentProfiles.length,
      isLastPage: typeof paging?.is_last_page === "boolean" ? paging.is_last_page : true,
    },
  } satisfies ListPaymentProfilesResponse;
}

export async function listPaymentProfiles(headers: HeadersInit) {
  try {
    const response = await requestJson<ListPaymentProfilesApiResponse, undefined>({
      url: apiEndpointUrls.landlord.paymentProfiles,
      method: "GET",
      headers,
    });

    return normalizeListPaymentProfilesResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw new ListPaymentProfilesError(
        error.status === 401
          ? "Sesi login sudah tidak valid. Silakan login ulang."
          : error.message,
        error.status,
      );
    }

    throw new ListPaymentProfilesError(
      "Terjadi kesalahan tak terduga saat mengambil payment profile.",
    );
  }
}
