import { ApiError, apiEndpointUrls, requestJson } from "../api";

export type ForgotPasswordRequest = {
  email: string;
};

type ForgotPasswordErrorPayload = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

type ForgotPasswordResponse = {
  message?: string;
};

export class ForgotPasswordError extends Error {
  readonly status: number | null;
  readonly fieldErrors: Partial<Record<"email", string>>;

  constructor({
    message,
    status = null,
    fieldErrors = {},
  }: {
    message: string;
    status?: number | null;
    fieldErrors?: Partial<Record<"email", string>>;
  }) {
    super(message);
    this.name = "ForgotPasswordError";
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

function mapForgotPasswordError(error: ApiError) {
  if (error.code === "TIMEOUT_ERROR" || error.code === "NETWORK_ERROR") {
    return new ForgotPasswordError({
      message:
        "Layanan penggantian password sedang tidak dapat dijangkau. Coba lagi beberapa saat.",
    });
  }

  const payload = error.payload as ForgotPasswordErrorPayload | undefined;
  const emailError = extractFirstError(payload?.errors?.email);

  return new ForgotPasswordError({
    message:
      payload?.message ??
      "Permintaan penggantian password belum berhasil. Silakan periksa kembali email Anda.",
    status: error.status,
    fieldErrors: {
      ...(emailError ? { email: emailError } : {}),
    },
  });
}

export async function requestForgotPassword(payload: ForgotPasswordRequest) {
  try {
    return await requestJson<ForgotPasswordResponse, ForgotPasswordRequest>({
      url: apiEndpointUrls.landlord.user.forgotPassword,
      method: "POST",
      body: payload,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw mapForgotPasswordError(error);
    }

    throw new ForgotPasswordError({
      message: "Terjadi kesalahan tak terduga saat memproses permintaan Anda.",
    });
  }
}
