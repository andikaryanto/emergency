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
const USERNAME_NO_SPACE_PATTERN = /^\S+$/;
const NAME_PATTERN = /^[a-z0-9]+$/;
const PASSWORD_NO_SPACE_PATTERN = /^\S+$/;
const PASSWORD_HAS_NUMBER_PATTERN = /\d/;
const PASSWORD_HAS_SPECIAL_CHAR_PATTERN = /[^A-Za-z0-9]/;

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
  const subscriptionPricingPlanIdRaw = String(
    formData.get("subscription_pricing_plan_id") ?? "",
  ).trim();
  const subscriptionPricingPlanId = Number(subscriptionPricingPlanIdRaw);

  if (!name || !username || !email || !password || !subscriptionPricingPlanIdRaw) {
    return {
      success: false as const,
      state: createErrorState("Semua field wajib diisi.", {
        ...(!name ? { name: "Nama tenant wajib diisi." } : {}),
        ...(!username ? { username: "Username admin wajib diisi." } : {}),
        ...(!email ? { email: "Email admin wajib diisi." } : {}),
        ...(!password ? { password: "Password admin wajib diisi." } : {}),
        ...(!subscriptionPricingPlanIdRaw
          ? { subscriptionPricingPlanId: "Pilih paket langganan terlebih dahulu." }
          : {}),
      }),
    };
  }

  if (!Number.isInteger(subscriptionPricingPlanId) || subscriptionPricingPlanId <= 0) {
    return {
      success: false as const,
      state: createErrorState("Pilihan paket langganan tidak valid.", {
        subscriptionPricingPlanId: "Pilih opsi Basic, Advance, atau Pro yang tersedia.",
      }),
    };
  }

  if (!NAME_PATTERN.test(name)) {
    return {
      success: false as const,
      state: createErrorState("Format nama klinik tidak valid.", {
        name: "Gunakan huruf kecil dan angka saja, tanpa spasi atau karakter spesial.",
      }),
    };
  }

  if (!USERNAME_PATTERN.test(username)) {
    if (!USERNAME_NO_SPACE_PATTERN.test(username)) {
      return {
        success: false as const,
        state: createErrorState("Username tidak boleh mengandung spasi.", {
          username: "Gunakan username tanpa spasi.",
        }),
      };
    }

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

  if (!PASSWORD_NO_SPACE_PATTERN.test(password)) {
    return {
      success: false as const,
      state: createErrorState("Password tidak boleh mengandung spasi.", {
        password: "Hapus spasi pada password Anda.",
      }),
    };
  }

  if (!PASSWORD_HAS_NUMBER_PATTERN.test(password)) {
    return {
      success: false as const,
      state: createErrorState("Password harus mengandung angka.", {
        password: "Tambahkan minimal 1 angka.",
      }),
    };
  }

  if (!PASSWORD_HAS_SPECIAL_CHAR_PATTERN.test(password)) {
    return {
      success: false as const,
      state: createErrorState("Password harus mengandung karakter spesial.", {
        password: "Tambahkan minimal 1 karakter selain huruf dan angka.",
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
      subscription_pricing_plan_id: subscriptionPricingPlanId,
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
