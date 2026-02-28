"use server";

import { redirect } from "next/navigation";
import {
  getLandlordAccessToken,
  getLandlordAuthorizationHeader,
} from "../../../lib/landlord/auth-session";
import {
  CreateTenantError,
  createLandlordTenant,
} from "../../../lib/landlord/create-tenant";
import { type CreateTenantActionState } from "./form-state";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/;

function createErrorState(
  message: string,
  fieldErrors: CreateTenantActionState["fieldErrors"] = {},
): CreateTenantActionState {
  return {
    status: "error",
    message,
    fieldErrors,
  };
}

function validateCreateTenantPayload(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || !username || !email || !password) {
    return {
      success: false as const,
      state: createErrorState("Semua field wajib diisi.", {
        ...(!name ? { name: "Nama tenant wajib diisi." } : {}),
        ...(!username ? { username: "Username admin wajib diisi." } : {}),
        ...(!email ? { email: "Email admin wajib diisi." } : {}),
        ...(!password ? { password: "Password admin wajib diisi." } : {}),
      }),
    };
  }

  if (!USERNAME_PATTERN.test(username)) {
    return {
      success: false as const,
      state: createErrorState("Format username tidak valid.", {
        username: "Gunakan huruf, angka, titik, strip, atau underscore.",
      }),
    };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return {
      success: false as const,
      state: createErrorState("Format email tidak valid.", {
        email: "Masukkan email admin yang valid.",
      }),
    };
  }

  if (password.length < 8) {
    return {
      success: false as const,
      state: createErrorState("Password minimal 8 karakter.", {
        password: "Gunakan minimal 8 karakter.",
      }),
    };
  }

  return {
    success: true as const,
    payload: {
      name,
      username,
      email,
      password,
    },
  };
}

export async function createTenantAction(
  _previousState: CreateTenantActionState,
  formData: FormData,
): Promise<CreateTenantActionState> {
  const accessToken = await getLandlordAccessToken();

  if (!accessToken) {
    redirect("/login");
  }

  const validation = validateCreateTenantPayload(formData);

  if (!validation.success) {
    return validation.state;
  }

  try {
    const authorizationHeader = await getLandlordAuthorizationHeader();
    await createLandlordTenant(validation.payload, authorizationHeader);
  } catch (error) {
    if (error instanceof CreateTenantError) {
      return createErrorState(error.message, error.fieldErrors);
    }

    return createErrorState(
      "Terjadi kesalahan tak terduga saat membuat tenant. Silakan coba lagi.",
    );
  }

  redirect("/dashboard?created=1");
}
