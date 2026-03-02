"use server";

import {
  ResendVerificationEmailError,
  resendVerificationEmail,
} from "../../lib/landlord/resend-verification-email";
import { type ResendVerificationActionState } from "./form-state";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createErrorState(
  message: string,
  fieldErrors: ResendVerificationActionState["fieldErrors"] = {},
): ResendVerificationActionState {
  return {
    status: "error",
    message,
    fieldErrors,
  };
}

export async function resendVerificationAction(
  _previousState: ResendVerificationActionState,
  formData: FormData,
): Promise<ResendVerificationActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    return createErrorState("Email wajib diisi.", {
      email: "Masukkan email akun Anda.",
    });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return createErrorState("Format email tidak valid.", {
      email: "Masukkan email yang valid.",
    });
  }

  try {
    await resendVerificationEmail({ email });
  } catch (error) {
    if (error instanceof ResendVerificationEmailError) {
      return createErrorState(error.message, error.fieldErrors);
    }

    return createErrorState(
      "Terjadi kesalahan tak terduga. Silakan coba lagi beberapa saat.",
    );
  }

  return {
    status: "success",
    message:
      "Jika email Anda terdaftar, link verifikasi baru akan segera dikirim.",
    fieldErrors: {},
  };
}
