"use server";

import { redirect } from "next/navigation";
import {
  ResetPasswordError,
  resetPassword,
} from "../../lib/landlord/reset-password";
import { type ResetPasswordActionState } from "./form-state";

function createErrorState(
  message: string,
  fieldErrors: ResetPasswordActionState["fieldErrors"] = {},
): ResetPasswordActionState {
  return {
    status: "error",
    message,
    fieldErrors,
  };
}

export async function resetPasswordAction(
  _previousState: ResetPasswordActionState,
  formData: FormData,
): Promise<ResetPasswordActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const token = String(formData.get("token") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!email || !token) {
    return createErrorState(
      "Link penggantian password tidak lengkap. Silakan minta link baru.",
    );
  }

  if (!password || !confirmPassword) {
    return createErrorState("Password baru dan konfirmasi wajib diisi.", {
      ...(!password ? { password: "Masukkan password baru Anda." } : {}),
      ...(!confirmPassword
        ? { confirmPassword: "Masukkan ulang password baru Anda." }
        : {}),
    });
  }

  if (password.length < 8) {
    return createErrorState("Password minimal 8 karakter.", {
      password: "Gunakan minimal 8 karakter.",
    });
  }

  if (password !== confirmPassword) {
    return createErrorState("Konfirmasi password tidak sama.", {
      confirmPassword: "Konfirmasi password harus sama dengan password baru.",
    });
  }

  try {
    await resetPassword({
      email,
      token,
      password,
      password_confirmation: confirmPassword,
    });
  } catch (error) {
    if (error instanceof ResetPasswordError) {
      return createErrorState(error.message, error.fieldErrors);
    }

    return createErrorState(
      "Terjadi kesalahan tak terduga. Silakan coba lagi beberapa saat.",
    );
  }

  redirect("/login?reset=1");
}
