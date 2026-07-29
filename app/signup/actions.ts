"use server";

import { redirect } from "next/navigation";
import {
  RegisterUserError,
  registerLandlordUser,
} from "../../lib/landlord/register-user";
import { resolvePricingSelection } from "../../lib/landlord/pricing-selection";
import {
  type RegisterActionState,
} from "./form-state";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_PATTERN = /^[a-z0-9]+$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/;
const USERNAME_NO_SPACE_PATTERN = /^\S+$/;
const PASSWORD_NO_SPACE_PATTERN = /^\S+$/;
const PASSWORD_HAS_NUMBER_PATTERN = /\d/;
const PASSWORD_HAS_SPECIAL_CHAR_PATTERN = /[^A-Za-z0-9]/;

function createErrorState(
  message: string,
  fieldErrors: RegisterActionState["fieldErrors"] = {},
): RegisterActionState {
  return {
    status: "error",
    message,
    fieldErrors,
  };
}

async function validateRegisterPayload(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const tenantName = String(formData.get("tenant_name") ?? "").trim();
  const subscriptionPricingPlanIdRaw = String(
    formData.get("subscription_pricing_plan_id") ?? "",
  ).trim();
  const subscriptionPricingPlanId = Number(subscriptionPricingPlanIdRaw);

  if (
    !name ||
    !email ||
    !username ||
    !password ||
    !confirmPassword ||
    !tenantName ||
    !subscriptionPricingPlanIdRaw
  ) {
    return {
      success: false as const,
      state: createErrorState("Semua field wajib diisi.", {
        ...(!name ? { name: "Nama wajib diisi." } : {}),
        ...(!email ? { email: "Email wajib diisi." } : {}),
        ...(!username ? { username: "Username admin klinik wajib diisi." } : {}),
        ...(!password ? { password: "Password wajib diisi." } : {}),
        ...(!confirmPassword
          ? { confirmPassword: "Konfirmasi password wajib diisi." }
          : {}),
        ...(!tenantName ? { tenantName: "Nama klinik wajib diisi." } : {}),
        ...(!subscriptionPricingPlanIdRaw
          ? { subscriptionPricingPlanId: "Pilih paket langganan terlebih dahulu." }
          : {}),
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

  if (!NAME_PATTERN.test(tenantName)) {
    return {
      success: false as const,
      state: createErrorState("Format nama klinik tidak valid.", {
        tenantName: "Gunakan huruf kecil dan angka saja, tanpa spasi atau karakter spesial.",
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

  if (!Number.isInteger(subscriptionPricingPlanId) || subscriptionPricingPlanId <= 0) {
    return {
      success: false as const,
      state: createErrorState("Pilihan paket langganan tidak valid.", {
        subscriptionPricingPlanId: "Pilih opsi Basic, Advance, atau Pro yang tersedia.",
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

  if (password !== confirmPassword) {
    return {
      success: false as const,
      state: createErrorState("Konfirmasi password tidak sama.", {
        confirmPassword: "Konfirmasi password harus sama dengan password.",
      }),
    };
  }

  const pricingSelection = await resolvePricingSelection(subscriptionPricingPlanId);

  if (!pricingSelection) {
    return {
      success: false as const,
      state: createErrorState("Pilihan paket langganan tidak ditemukan.", {
        subscriptionPricingPlanId: "Pilih paket langganan yang tersedia lalu coba lagi.",
      }),
    };
  }

  return {
    success: true as const,
    payload: {
      name,
      email,
      username,
      password,
      password_confirmation: confirmPassword,
      tenant_name: tenantName,
      pricing_id: pricingSelection.pricing_id,
      pricing: pricingSelection.pricing,
      subscription_pricing_plan_id: subscriptionPricingPlanId,
    },
  };
}

export async function registerUserAction(
  _previousState: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  const validation = await validateRegisterPayload(formData);

  if (!validation.success) {
    return validation.state;
  }

  try {
    await registerLandlordUser(validation.payload);
  } catch (error) {
    if (error instanceof RegisterUserError) {
      return createErrorState(error.message, error.fieldErrors);
    }

    return createErrorState("Terjadi kesalahan tak terduga. Silakan coba lagi.");
  }

  redirect("/login?registered=1");
}
