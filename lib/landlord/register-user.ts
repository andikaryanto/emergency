import { ApiError, apiEndpointUrls, requestJson } from "../api";

export type RegisterUserRequest = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

type RegisterUserErrorPayload = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

export type RegisterUserResponse = {
  message?: string;
};

export class RegisterUserError extends Error {
  readonly status: number | null;
  readonly fieldErrors: Partial<
    Record<"name" | "email" | "password" | "confirmPassword", string>
  >;

  constructor({
    message,
    status = null,
    fieldErrors = {},
  }: {
    message: string;
    status?: number | null;
    fieldErrors?: Partial<
      Record<"name" | "email" | "password" | "confirmPassword", string>
    >;
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
  const passwordError = extractFirstError(payload?.errors?.password);
  const confirmPasswordError = extractFirstError(
    payload?.errors?.password_confirmation,
  );

  return new RegisterUserError({
    message:
      error.status === 409
        ? "Email sudah terdaftar. Gunakan email lain atau masuk ke akun Anda."
        : payload?.message ?? "Registrasi gagal. Silakan periksa data Anda.",
    status: error.status,
    fieldErrors: {
      ...(nameError ? { name: nameError } : {}),
      ...(emailError ? { email: emailError } : {}),
      ...(passwordError ? { password: passwordError } : {}),
      ...(confirmPasswordError
        ? { confirmPassword: confirmPasswordError }
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
