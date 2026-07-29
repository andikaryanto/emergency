import { ApiError, apiEndpointUrls, requestJson } from "../api";
import {
  type GoogleAuthResult,
  normalizeGoogleAuthResult,
} from "./google-auth";

export type LoginGoogleRequest = {
  id_token: string;
  is_register?: boolean;
  tenant_name?: string;
  username?: string;
  password?: string;
  pricing_id?: number;
  pricing?: "Basic" | "Advance" | "Pro";
  subscription_pricing_plan_id?: number;
};

type LoginGoogleErrorPayload = {
  message?: string;
};

export class LoginGoogleError extends Error {
  readonly status: number | null;

  constructor({
    message,
    status = null,
  }: {
    message: string;
    status?: number | null;
  }) {
    super(message);
    this.name = "LoginGoogleError";
    this.status = status;
  }
}

function mapLoginGoogleError(error: ApiError) {
  if (error.code === "TIMEOUT_ERROR" || error.code === "NETWORK_ERROR") {
    return new LoginGoogleError({
      message:
        "Server login Google sedang tidak dapat dijangkau. Coba lagi beberapa saat.",
    });
  }

  const payload = error.payload as LoginGoogleErrorPayload | undefined;

  return new LoginGoogleError({
    message:
      payload?.message ??
      "Login dengan Google gagal. Silakan coba beberapa saat lagi.",
    status: error.status,
  });
}

export async function loginLandlordUserWithGoogle(
  payload: LoginGoogleRequest,
): Promise<GoogleAuthResult> {
  try {
    const response = await requestJson<unknown, LoginGoogleRequest>({
      url: apiEndpointUrls.landlord.user.loginGoogle,
      method: "POST",
      body: payload,
    });

    return normalizeGoogleAuthResult(response);
  } catch (error) {
    if (error instanceof LoginGoogleError) {
      throw error;
    }

    if (error instanceof ApiError) {
      throw mapLoginGoogleError(error);
    }

    throw new LoginGoogleError({
      message: "Terjadi kesalahan tak terduga saat login dengan Google.",
    });
  }
}
