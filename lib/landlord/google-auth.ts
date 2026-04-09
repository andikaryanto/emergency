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
    };
  };
  message?: string;
};

function isGoogleAuthStatus(value: string): value is GoogleAuthResultStatus {
  return googleAuthResultStatuses.includes(value as GoogleAuthResultStatus);
}

function normalizeGoogleAuthStatus(value: string | undefined): GoogleAuthResultStatus {
  if (!value) {
    return "error";
  }

  return isGoogleAuthStatus(value) ? value : "error";
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
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: Boolean(user.is_active),
      role: typeof user.role === "string" ? user.role : null,
    },
  } satisfies LandlordSession;
}

export function normalizeGoogleAuthResult(
  payload: RawGoogleAuthPayload,
): GoogleAuthResult {
  const authResult = payload.data?._resources?.auth_result;
  const session = payload.data?._resources?.session;
  const status = normalizeGoogleAuthStatus(authResult?.status);
  const message =
    authResult?.message ??
    payload.message ??
    "Login dengan Google belum dapat diproses.";

  if (status === "success" || status === "auto_registered" || status === "already_linked") {
    const normalizedSession = normalizeGoogleAuthSession(session ?? {});

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
  const status = normalizeGoogleAuthStatus(query.google);

  return status === "auto_registered" || status === "already_linked"
    ? "success"
    : "error";
}
