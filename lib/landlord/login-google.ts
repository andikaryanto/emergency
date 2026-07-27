import { ApiError, apiEndpointUrls, requestJson } from "../api";
import {
  type GoogleAuthResult,
  normalizeGoogleAuthResult,
} from "./google-auth";

export type LoginGoogleRequest =
  | {
      id_token: string;
      is_register?: false;
    }
  | {
      id_token: string;
      is_register: true;
      tenant_name: string;
      username: string;
      pricing_id: number;
      pricing: "Basic" | "Advance" | "Pro";
      subscription_pricing_plan_id: number;
    };

type LoginGoogleErrorPayload = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

export type LoginGoogleFieldErrors = Partial<
  Record<"tenantName" | "username" | "subscriptionPricingPlanId", string>
>;

export class LoginGoogleError extends Error {
  readonly status: number | null;
  readonly fieldErrors: LoginGoogleFieldErrors;

  constructor({
    message,
    status = null,
    fieldErrors = {},
  }: {
    message: string;
    status?: number | null;
    fieldErrors?: LoginGoogleFieldErrors;
  }) {
    super(message);
    this.name = "LoginGoogleError";
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

function mapLoginGoogleError(error: ApiError) {
  if (error.code === "TIMEOUT_ERROR" || error.code === "NETWORK_ERROR") {
    return new LoginGoogleError({
      message:
        "Server login Google sedang tidak dapat dijangkau. Coba lagi beberapa saat.",
    });
  }

  const payload = error.payload as LoginGoogleErrorPayload | undefined;
  const tenantNameError = extractFirstError(payload?.errors?.tenant_name);
  const usernameError = extractFirstError(payload?.errors?.username);
  const subscriptionPricingPlanIdError =
    extractFirstError(payload?.errors?.subscription_pricing_plan_id) ??
    extractFirstError(payload?.errors?.pricing_id);

  return new LoginGoogleError({
    message:
      payload?.message ??
      "Login dengan Google gagal. Silakan coba beberapa saat lagi.",
    status: error.status,
    fieldErrors: {
      ...(tenantNameError ? { tenantName: tenantNameError } : {}),
      ...(usernameError ? { username: usernameError } : {}),
      ...(subscriptionPricingPlanIdError
        ? { subscriptionPricingPlanId: subscriptionPricingPlanIdError }
        : {}),
    },
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
