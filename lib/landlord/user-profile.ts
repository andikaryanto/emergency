import { ApiError, apiEndpointUrls, requestJson } from "../api";

type UserProfileApiResource = {
  id?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  address?: unknown;
  city?: unknown;
  province?: unknown;
  postal_code?: unknown;
  is_active?: unknown;
  role?: unknown;
  created_at?: unknown;
  updated_at?: unknown;
};

type UserProfileApiResponse = {
  message?: string;
  data?: {
    _resources?: UserProfileApiResource | UserProfileApiResource[];
  };
};

type UserProfileErrorPayload = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

export type LandlordUserProfile = {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  isActive: boolean;
  role: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type UpdateLandlordUserProfileRequest = {
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
};

export class LandlordUserProfileError extends Error {
  readonly status: number | null;
  readonly fieldErrors: Partial<
    Record<"phone" | "address" | "city" | "province" | "postalCode", string>
  >;

  constructor({
    message,
    status = null,
    fieldErrors = {},
  }: {
    message: string;
    status?: number | null;
    fieldErrors?: Partial<
      Record<"phone" | "address" | "city" | "province" | "postalCode", string>
    >;
  }) {
    super(message);
    this.name = "LandlordUserProfileError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

function extractFirstError(value: string[] | string | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function getString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function getNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function getUserProfileResource(payload: UserProfileApiResponse | null | undefined) {
  const resource = payload?.data?._resources;

  if (Array.isArray(resource)) {
    return resource[0];
  }

  return resource;
}

function normalizeUserProfile(
  payload: UserProfileApiResponse | null | undefined,
): LandlordUserProfile {
  const resource = getUserProfileResource(payload);
  const id = getNumber(resource?.id);

  if (id === null) {
    throw new LandlordUserProfileError({
      message: "Respons profil user dari API tidak lengkap.",
    });
  }

  return {
    id,
    name: getString(resource?.name),
    email: getString(resource?.email),
    phone: getString(resource?.phone),
    address: getString(resource?.address),
    city: getString(resource?.city),
    province: getString(resource?.province),
    postalCode: getString(resource?.postal_code),
    isActive: Boolean(resource?.is_active),
    role: getString(resource?.role),
    createdAt: getString(resource?.created_at),
    updatedAt: getString(resource?.updated_at),
  };
}

function mapUserProfileError(error: ApiError, mode: "get" | "update") {
  if (error.code === "TIMEOUT_ERROR" || error.code === "NETWORK_ERROR") {
    return new LandlordUserProfileError({
      message:
        mode === "get"
          ? "Server profil user sedang tidak dapat dijangkau. Coba lagi beberapa saat."
          : "Server profil user sedang tidak dapat dijangkau saat menyimpan. Coba lagi beberapa saat.",
    });
  }

  const payload = error.payload as UserProfileErrorPayload | undefined;

  return new LandlordUserProfileError({
    message:
      payload?.message ??
      (mode === "get"
        ? "Profil user gagal dimuat."
        : "Profil user gagal diperbarui. Silakan periksa kembali data Anda."),
    status: error.status,
    fieldErrors: {
      ...(extractFirstError(payload?.errors?.phone)
        ? { phone: extractFirstError(payload?.errors?.phone) }
        : {}),
      ...(extractFirstError(payload?.errors?.address)
        ? { address: extractFirstError(payload?.errors?.address) }
        : {}),
      ...(extractFirstError(payload?.errors?.city)
        ? { city: extractFirstError(payload?.errors?.city) }
        : {}),
      ...(extractFirstError(payload?.errors?.province)
        ? { province: extractFirstError(payload?.errors?.province) }
        : {}),
      ...(extractFirstError(payload?.errors?.postal_code)
        ? { postalCode: extractFirstError(payload?.errors?.postal_code) }
        : {}),
    },
  });
}

export async function getLandlordUserProfile(userId: number, headers: HeadersInit) {
  try {
    const response = await requestJson<UserProfileApiResponse, undefined>({
      url: `${apiEndpointUrls.landlord.user.detail}/${userId}`,
      method: "GET",
      headers,
    });

    return normalizeUserProfile(response);
  } catch (error) {
    if (error instanceof LandlordUserProfileError) {
      throw error;
    }

    if (error instanceof ApiError) {
      throw mapUserProfileError(error, "get");
    }

    throw new LandlordUserProfileError({
      message: "Terjadi kesalahan tak terduga saat mengambil profil user.",
    });
  }
}

export async function updateLandlordUserProfile(
  userId: number,
  payload: UpdateLandlordUserProfileRequest,
  headers: HeadersInit,
) {
  try {
    await requestJson<unknown, UpdateLandlordUserProfileRequest>({
      url: `${apiEndpointUrls.landlord.user.detail}/${userId}`,
      method: "PATCH",
      body: payload,
      headers,
    });
  } catch (error) {
    if (error instanceof LandlordUserProfileError) {
      throw error;
    }

    if (error instanceof ApiError) {
      throw mapUserProfileError(error, "update");
    }

    throw new LandlordUserProfileError({
      message: "Terjadi kesalahan tak terduga saat memperbarui profil user.",
    });
  }
}
