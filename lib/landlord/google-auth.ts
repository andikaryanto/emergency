import type { LandlordSession } from "./auth-session";

export const googleAuthResultStatuses = [
  "success",
  "auto_registered",
  "needs_manual_link",
  "already_linked",
  "error",
] as const;

export type GoogleAuthResultStatus = (typeof googleAuthResultStatuses)[number];

export type GoogleAuthCallbackQuery = {
  email?: string;
  google?: string;
  message?: string;
};

export type GoogleAuthResult =
  | {
      status: "success" | "auto_registered" | "already_linked";
      session: LandlordSession;
      message: string;
    }
  | {
      status: "needs_manual_link" | "error";
      email: string | null;
      message: string;
    };

type RawGoogleAuthUser = {
  auth_providers?:
    | Array<
        | string
        | {
            provider?: string;
          }
      >
    | null;
  email?: string;
  id?: number;
  is_active?: boolean;
  name?: string;
  role?: string;
};

type RawGoogleAuthSession = {
  expired_at?: string;
  token?: string;
  user?: RawGoogleAuthUser;
};

type RawGoogleAuthPayload = {
  data?: {
    _resources?: {
      auth_result?: {
        message?: string;
        status?: string;
      };
      session?: RawGoogleAuthSession;
    } & RawGoogleAuthSession;
  };
  message?: string;
};

function toRawGoogleAuthPayload(value: unknown): RawGoogleAuthPayload {
  if (!value || typeof value !== "object") {
    return {};
  }

  return value as RawGoogleAuthPayload;
}

function isGoogleAuthStatus(value: string): value is GoogleAuthResultStatus {
  return googleAuthResultStatuses.includes(value as GoogleAuthResultStatus);
}

function normalizeGoogleAuthStatus(value: string | undefined): GoogleAuthResultStatus {
  if (!value) {
    return "error";
  }

  return isGoogleAuthStatus(value) ? value : "error";
}

function hasGoogleAuthFeedback(query: GoogleAuthCallbackQuery) {
  return Boolean(query.google?.trim() || query.message?.trim());
}

function normalizeGoogleAuthSession(rawSession: RawGoogleAuthSession) {
  const token = rawSession.token;
  const expiredAt = rawSession.expired_at;
  const user = rawSession.user;

  if (
    !token ||
    !expiredAt ||
    typeof user?.id !== "number" ||
    typeof user.name !== "string" ||
    typeof user.email !== "string"
  ) {
    return null;
  }

  return {
    token,
    expiredAt,
    user: {
      authProviders: normalizeAuthProviders(user.auth_providers),
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: Boolean(user.is_active),
      role: typeof user.role === "string" ? user.role : null,
    },
  } satisfies LandlordSession;
}

function normalizeAuthProviders(
  value:
    | Array<
        | string
        | {
            provider?: string;
          }
      >
    | null
    | undefined,
) {
  if (!value) {
    return [];
  }

  const providers = value
    .map((item) =>
      typeof item === "string" ? item.trim().toLowerCase() : item.provider?.trim().toLowerCase(),
    )
    .filter((item): item is string => Boolean(item));

  return Array.from(new Set(providers));
}

export function normalizeGoogleAuthResult(payload: unknown): GoogleAuthResult {
  const normalizedPayload = toRawGoogleAuthPayload(payload);
  const authResult = normalizedPayload.data?._resources?.auth_result;
  const resource = normalizedPayload.data?._resources;
  const session = resource?.session ?? resource;
  const normalizedSession = normalizeGoogleAuthSession(session ?? {});
  const status =
    authResult?.status || normalizedSession
      ? normalizeGoogleAuthStatus(authResult?.status ?? "success")
      : "error";
  const message =
    authResult?.message ??
    normalizedPayload.message ??
    "Login dengan Google belum dapat diproses.";

  if (status === "success" || status === "auto_registered" || status === "already_linked") {
    if (!normalizedSession) {
      return {
        status: "error",
        email: null,
        message: "Respons login Google dari API tidak lengkap.",
      };
    }

    return {
      status,
      session: normalizedSession,
      message,
    };
  }

  return {
    status,
    email: session?.user?.email ?? null,
    message,
  };
}

export function getGoogleAuthFeedbackMessage(query: GoogleAuthCallbackQuery) {
  if (!hasGoogleAuthFeedback(query)) {
    return null;
  }

  const status = normalizeGoogleAuthStatus(query.google);
  const email = query.email?.trim();
  const customMessage = query.message?.trim();

  if (customMessage) {
    return customMessage;
  }

  switch (status) {
    case "auto_registered":
      return "Akun Anda berhasil dibuat otomatis dari Google. Silakan lanjut masuk.";
    case "needs_manual_link":
      return email
        ? `Email ${email} sudah terdaftar. Silakan login dengan email dan password terlebih dahulu untuk menghubungkan akun Google.`
        : "Email ini sudah terdaftar. Silakan login dengan email dan password terlebih dahulu untuk menghubungkan akun Google.";
    case "already_linked":
      return "Akun Google Anda sudah terhubung. Silakan lanjut masuk.";
    case "error":
      return "Login dengan Google gagal diproses. Silakan coba lagi.";
    default:
      return null;
  }
}

export function getGoogleAuthFeedbackTone(query: GoogleAuthCallbackQuery) {
  if (!hasGoogleAuthFeedback(query)) {
    return null;
  }

  const status = normalizeGoogleAuthStatus(query.google);

  return status === "auto_registered" || status === "already_linked"
    ? "success"
    : "error";
}
