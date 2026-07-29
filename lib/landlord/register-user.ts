import { ApiError, apiEndpointUrls, requestJson } from "../api";

export type RegisterUserRequest = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  tenant_name: string;
  username: string;
  pricing_id: number;
  pricing: "Basic" | "Advance" | "Pro";
  subscription_pricing_plan_id: number;
};

type RegisterUserErrorPayload = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

export type RegisterUserResponse = {
  message?: string;
};

export type RegisterUserFieldErrors = Partial<
  Record<
    "name" | "email" | "username" | "password" | "confirmPassword" | "tenantName" | "subscriptionPricingPlanId",
    string
  >
>;

export class RegisterUserError extends Error {
  readonly status: number | null;
  readonly fieldErrors: RegisterUserFieldErrors;

  constructor({
    message,
    status = null,
    fieldErrors = {},
  }: {
    message: string;
    status?: number | null;
    fieldErrors?: RegisterUserFieldErrors;
  }) {
    super(message);
    this.name = "RegisterUserError";
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

function mapRegisterError(error: ApiError) {
  if (error.code === "TIMEOUT_ERROR" || error.code === "NETWORK_ERROR") {
    return new RegisterUserError({
      message: "Server registrasi sedang tidak dapat dijangkau. Coba lagi beberapa saat.",
    });
  }

  const payload = error.payload as RegisterUserErrorPayload | undefined;
  const nameError = extractFirstError(payload?.errors?.name);
  const emailError = extractFirstError(payload?.errors?.email);
  const usernameError = extractFirstError(payload?.errors?.username);
  const passwordError = extractFirstError(payload?.errors?.password);
  const confirmPasswordError = extractFirstError(
    payload?.errors?.password_confirmation,
  );
  const tenantNameError = extractFirstError(payload?.errors?.tenant_name);
  const subscriptionPricingPlanIdError =
    extractFirstError(payload?.errors?.subscription_pricing_plan_id) ??
    extractFirstError(payload?.errors?.pricing_id);

  return new RegisterUserError({
    message:
      error.status === 409
        ? "Email sudah terdaftar. Gunakan email lain atau masuk ke akun Anda."
        : payload?.message ?? "Registrasi gagal. Silakan periksa data Anda.",
    status: error.status,
    fieldErrors: {
      ...(nameError ? { name: nameError } : {}),
      ...(emailError ? { email: emailError } : {}),
      ...(usernameError ? { username: usernameError } : {}),
      ...(passwordError ? { password: passwordError } : {}),
      ...(confirmPasswordError
        ? { confirmPassword: confirmPasswordError }
        : {}),
      ...(tenantNameError ? { tenantName: tenantNameError } : {}),
      ...(subscriptionPricingPlanIdError
        ? { subscriptionPricingPlanId: subscriptionPricingPlanIdError }
        : {}),
    },
  });
}

export async function registerLandlordUser(payload: RegisterUserRequest) {
  try {
    return await requestJson<RegisterUserResponse, RegisterUserRequest>({
      url: apiEndpointUrls.landlord.user.register,
      method: "POST",
      body: payload,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw mapRegisterError(error);
    }

    throw new RegisterUserError({
      message: "Terjadi kesalahan tak terduga saat registrasi.",
    });
  }
}
