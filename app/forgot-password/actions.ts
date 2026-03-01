"use server";

import {
  ForgotPasswordError,
  requestForgotPassword,
} from "../../lib/landlord/forgot-password";
import { type ForgotPasswordActionState } from "./form-state";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createErrorState(
  message: string,
  fieldErrors: ForgotPasswordActionState["fieldErrors"] = {},
): ForgotPasswordActionState {
  return {
    status: "error",
    message,
    fieldErrors,
  };
}

export async function forgotPasswordAction(
  _previousState: ForgotPasswordActionState,
  formData: FormData,
): Promise<ForgotPasswordActionState> {
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
    await requestForgotPassword({ email });
  } catch (error) {
    if (error instanceof ForgotPasswordError) {
      return createErrorState(error.message, error.fieldErrors);
    }

    return createErrorState(
      "Terjadi kesalahan tak terduga. Silakan coba lagi beberapa saat.",
    );
  }

  return {
    status: "success",
    message:
      "Jika email Anda terdaftar, panduan penggantian password akan segera dikirim.",
    fieldErrors: {},
  };
}
