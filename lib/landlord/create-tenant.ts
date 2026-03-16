import { ApiError, apiEndpointUrls, requestJson } from "../api";

export type CreateTenantRequest = {
  name: string;
  username: string;
  email: string;
  password: string;
  pricing_id: 1 | 2 | 3;
  pricing: "Basic" | "Advance" | "Pro";
};

type CreateTenantErrorPayload = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

type CreateTenantResponse = {
  message?: string;
};

export class CreateTenantError extends Error {
  readonly status: number | null;
  readonly fieldErrors: Partial<
    Record<"name" | "username" | "email" | "password" | "pricingId", string>
  >;

  constructor({
    message,
    status = null,
    fieldErrors = {},
  }: {
    message: string;
    status?: number | null;
    fieldErrors?: Partial<
      Record<"name" | "username" | "email" | "password" | "pricingId", string>
    >;
  }) {
    super(message);
    this.name = "CreateTenantError";
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

function mapCreateTenantError(error: ApiError) {
  if (error.code === "TIMEOUT_ERROR" || error.code === "NETWORK_ERROR") {
    return new CreateTenantError({
      message: "Server tenant sedang tidak dapat dijangkau. Coba lagi beberapa saat.",
    });
  }

  const payload = error.payload as CreateTenantErrorPayload | undefined;
  const nameError = extractFirstError(payload?.errors?.name);
  const usernameError = extractFirstError(payload?.errors?.username);
  const emailError = extractFirstError(payload?.errors?.email);
  const passwordError = extractFirstError(payload?.errors?.password);
  const pricingIdError =
    extractFirstError(payload?.errors?.pricing_id) ??
    extractFirstError(payload?.errors?.pricingId);

  return new CreateTenantError({
    message:
      payload?.message ?? "Pembuatan tenant gagal. Silakan periksa kembali data Anda.",
    status: error.status,
    fieldErrors: {
      ...(nameError ? { name: nameError } : {}),
      ...(usernameError ? { username: usernameError } : {}),
      ...(emailError ? { email: emailError } : {}),
      ...(passwordError ? { password: passwordError } : {}),
      ...(pricingIdError ? { pricingId: pricingIdError } : {}),
    },
  });
}

export async function createLandlordTenant(
  payload: CreateTenantRequest,
  headers: HeadersInit,
) {
  try {
    return await requestJson<CreateTenantResponse, CreateTenantRequest>({
      url: apiEndpointUrls.landlord.tenant,
      method: "POST",
      headers,
      body: payload,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw mapCreateTenantError(error);
    }

    throw new CreateTenantError({
      message: "Terjadi kesalahan tak terduga saat membuat tenant.",
    });
  }
}
