import { ApiError, apiEndpointUrls, requestJson } from "../api";

export type ResendVerificationEmailRequest = {
  email: string;
};

type ResendVerificationEmailErrorPayload = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

type ResendVerificationEmailResponse = {
  message?: string;
};

export class ResendVerificationEmailError extends Error {
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
    this.name = "ResendVerificationEmailError";
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

function mapResendVerificationEmailError(error: ApiError) {
  if (error.code === "TIMEOUT_ERROR" || error.code === "NETWORK_ERROR") {
    return new ResendVerificationEmailError({
      message:
        "Layanan pengiriman ulang verifikasi sedang tidak dapat dijangkau. Coba lagi beberapa saat.",
    });
  }

  const payload = error.payload as ResendVerificationEmailErrorPayload | undefined;
  const emailError = extractFirstError(payload?.errors?.email);

  return new ResendVerificationEmailError({
    message:
      payload?.message ??
      "Link verifikasi belum berhasil dikirim ulang. Silakan periksa kembali email Anda.",
    status: error.status,
    fieldErrors: {
      ...(emailError ? { email: emailError } : {}),
    },
  });
}

export async function resendVerificationEmail(
  payload: ResendVerificationEmailRequest,
) {
  try {
    return await requestJson<
      ResendVerificationEmailResponse,
      ResendVerificationEmailRequest
    >({
      url: apiEndpointUrls.landlord.user.resendVerificationEmail,
      method: "POST",
      body: payload,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw mapResendVerificationEmailError(error);
    }

    throw new ResendVerificationEmailError({
      message:
        "Terjadi kesalahan tak terduga saat mengirim ulang link verifikasi.",
    });
  }
}
