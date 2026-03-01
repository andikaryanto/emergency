import { ApiError, apiEndpointUrls, requestJson } from "../api";

export type ValidateResetTokenRequest = {
  email: string;
  token: string;
};

export type ResetPasswordRequest = {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
};

type ValidateResetTokenErrorPayload = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

type ValidateResetTokenResponse = {
  message?: string;
};

type ResetPasswordErrorPayload = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

type ResetPasswordResponse = {
  message?: string;
};

export class ValidateResetTokenError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = "ValidateResetTokenError";
    this.status = status;
  }
}

function mapValidateResetTokenError(error: ApiError) {
  if (error.code === "TIMEOUT_ERROR" || error.code === "NETWORK_ERROR") {
    return new ValidateResetTokenError(
      "Link penggantian password tidak dapat diperiksa saat ini. Coba lagi beberapa saat.",
    );
  }

  const payload = error.payload as ValidateResetTokenErrorPayload | undefined;

  return new ValidateResetTokenError(
    payload?.message ??
      "Link penggantian password tidak valid atau sudah tidak berlaku.",
    error.status,
  );
}

export async function validateResetToken(payload: ValidateResetTokenRequest) {
  try {
    return await requestJson<
      ValidateResetTokenResponse,
      ValidateResetTokenRequest
    >({
      url: apiEndpointUrls.landlord.user.validateResetToken,
      method: "POST",
      body: payload,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw mapValidateResetTokenError(error);
    }

    throw new ValidateResetTokenError(
      "Terjadi kesalahan tak terduga saat memeriksa link penggantian password.",
    );
  }
}

export class ResetPasswordError extends Error {
  readonly status: number | null;
  readonly fieldErrors: Partial<Record<"password" | "confirmPassword", string>>;

  constructor({
    message,
    status = null,
    fieldErrors = {},
  }: {
    message: string;
    status?: number | null;
    fieldErrors?: Partial<Record<"password" | "confirmPassword", string>>;
  }) {
    super(message);
    this.name = "ResetPasswordError";
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

function mapResetPasswordError(error: ApiError) {
  if (error.code === "TIMEOUT_ERROR" || error.code === "NETWORK_ERROR") {
    return new ResetPasswordError({
      message:
        "Layanan penggantian password sedang tidak dapat dijangkau. Coba lagi beberapa saat.",
    });
  }

  const payload = error.payload as ResetPasswordErrorPayload | undefined;
  const passwordError = extractFirstError(payload?.errors?.password);
  const confirmPasswordError = extractFirstError(
    payload?.errors?.password_confirmation,
  );

  return new ResetPasswordError({
    message:
      payload?.message ??
      "Password baru belum berhasil disimpan. Silakan periksa kembali data Anda.",
    status: error.status,
    fieldErrors: {
      ...(passwordError ? { password: passwordError } : {}),
      ...(confirmPasswordError
        ? { confirmPassword: confirmPasswordError }
        : {}),
    },
  });
}

export async function resetPassword(payload: ResetPasswordRequest) {
  try {
    return await requestJson<ResetPasswordResponse, ResetPasswordRequest>({
      url: apiEndpointUrls.landlord.user.resetPassword,
      method: "POST",
      body: payload,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw mapResetPasswordError(error);
    }

    throw new ResetPasswordError({
      message: "Terjadi kesalahan tak terduga saat menyimpan password baru Anda.",
    });
  }
}
