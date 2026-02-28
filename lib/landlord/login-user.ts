import { ApiError, apiEndpointUrls, requestJson } from "../api";

export type LoginUserRequest = {
  email: string;
  password: string;
};

type LoginUserErrorPayload = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

type LoginUserApiResponse = {
  message?: string;
  data?: {
    _resources?: {
      token?: string;
      expired_at?: string;
      user?: {
        id?: number;
        name?: string;
        email?: string;
        is_active?: boolean;
      };
    };
  };
};

export type LoginUserResponse = {
  token: string;
  expiredAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
  };
};

export class LoginUserError extends Error {
  readonly status: number | null;
  readonly fieldErrors: Partial<Record<"email" | "password", string>>;

  constructor({
    message,
    status = null,
    fieldErrors = {},
  }: {
    message: string;
    status?: number | null;
    fieldErrors?: Partial<Record<"email" | "password", string>>;
  }) {
    super(message);
    this.name = "LoginUserError";
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

function mapLoginError(error: ApiError) {
  if (error.code === "TIMEOUT_ERROR" || error.code === "NETWORK_ERROR") {
    return new LoginUserError({
      message: "Server login sedang tidak dapat dijangkau. Coba lagi beberapa saat.",
    });
  }

  const payload = error.payload as LoginUserErrorPayload | undefined;
  const emailError = extractFirstError(payload?.errors?.email);
  const passwordError = extractFirstError(payload?.errors?.password);

  return new LoginUserError({
    message:
      error.status === 401
        ? "Email atau password tidak sesuai."
        : payload?.message ?? "Login gagal. Silakan periksa kembali data Anda.",
    status: error.status,
    fieldErrors: {
      ...(emailError ? { email: emailError } : {}),
      ...(passwordError ? { password: passwordError } : {}),
    },
  });
}

function normalizeLoginResponse(payload: LoginUserApiResponse) {
  const resource = payload.data?._resources;
  const token = resource?.token;
  const expiredAt = resource?.expired_at;
  const user = resource?.user;

  if (
    !token ||
    !expiredAt ||
    typeof user?.id !== "number" ||
    typeof user.name !== "string" ||
    typeof user.email !== "string"
  ) {
    throw new LoginUserError({
      message: "Respons login dari API tidak lengkap.",
    });
  }

  return {
    token,
    expiredAt,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: Boolean(user.is_active),
    },
  } satisfies LoginUserResponse;
}

export async function loginLandlordUser(payload: LoginUserRequest) {
  try {
    const response = await requestJson<LoginUserApiResponse, LoginUserRequest>({
      url: apiEndpointUrls.landlord.user.login,
      method: "POST",
      body: payload,
    });

    return normalizeLoginResponse(response);
  } catch (error) {
    if (error instanceof LoginUserError) {
      throw error;
    }

    if (error instanceof ApiError) {
      throw mapLoginError(error);
    }

    throw new LoginUserError({
      message: "Terjadi kesalahan tak terduga saat login.",
    });
  }
}
