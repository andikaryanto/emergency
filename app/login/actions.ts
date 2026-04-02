"use server";

import { redirect } from "next/navigation";
import { setLandlordSession } from "../../lib/landlord/auth-session";
import { LoginUserError, loginLandlordUser } from "../../lib/landlord/login-user";
import { type LoginActionState } from "./form-state";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createErrorState(
  message: string,
  fieldErrors: LoginActionState["fieldErrors"] = {},
): LoginActionState {
  return {
    status: "error",
    message,
    fieldErrors,
  };
}

function validateLoginPayload(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      success: false as const,
      state: createErrorState("Email dan password wajib diisi.", {
        ...(!email ? { email: "Email wajib diisi." } : {}),
        ...(!password ? { password: "Password wajib diisi." } : {}),
      }),
    };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return {
      success: false as const,
      state: createErrorState("Format email tidak valid.", {
        email: "Masukkan email yang valid.",
      }),
    };
  }

  return {
    success: true as const,
    payload: {
      email,
      password,
    },
  };
}

export async function loginUserAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const validation = validateLoginPayload(formData);

  if (!validation.success) {
    return validation.state;
  }

  try {
    const session = await loginLandlordUser(validation.payload);

    await setLandlordSession(session);

    if (session.user.role === "admin") {
      redirect("/admin/subscription-invoices");
    }
  } catch (error) {
    if (error instanceof LoginUserError) {
      return createErrorState(error.message, error.fieldErrors);
    }

    return createErrorState("Terjadi kesalahan tak terduga. Silakan coba lagi.");
  }

  redirect("/dashboard");
}
