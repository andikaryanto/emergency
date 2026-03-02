import { ApiError, apiEndpointUrls, requestJson } from "../api";

export type VerifyEmailRequest = {
  email: string;
  token: string;
};

type VerifyEmailErrorPayload = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

type VerifyEmailResponse = {
  message?: string;
};

export class VerifyEmailError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = "VerifyEmailError";
    this.status = status;
  }
}

function mapVerifyEmailError(error: ApiError) {
  if (error.code === "TIMEOUT_ERROR" || error.code === "NETWORK_ERROR") {
    return new VerifyEmailError(
      "Verifikasi email tidak dapat diproses saat ini. Coba lagi beberapa saat.",
    );
  }

  const payload = error.payload as VerifyEmailErrorPayload | undefined;

  return new VerifyEmailError(
    payload?.message ?? "Link verifikasi email tidak valid atau sudah tidak berlaku.",
    error.status,
  );
}

export async function verifyEmail(payload: VerifyEmailRequest) {
  try {
    return await requestJson<VerifyEmailResponse, VerifyEmailRequest>({
      url: apiEndpointUrls.landlord.user.verifyEmail,
      method: "POST",
      body: payload,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw mapVerifyEmailError(error);
    }

    throw new VerifyEmailError(
      "Terjadi kesalahan tak terduga saat memverifikasi email Anda.",
    );
  }
}
