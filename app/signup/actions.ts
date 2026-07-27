"use server";

import { redirect } from "next/navigation";
import {
  RegisterUserError,
  registerLandlordUser,
} from "../../lib/landlord/register-user";
import { validateTenantFields } from "../../lib/landlord/tenant-field-validation";
import { validatePasswordStrength } from "../../lib/password-validation";
import {
  type RegisterActionState,
} from "./form-state";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!name || !email || !password || !confirmPassword) {
    return {
      success: false as const,
      state: createErrorState("Semua field wajib diisi.", {
        ...(!name ? { name: "Nama wajib diisi." } : {}),
        ...(!email ? { email: "Email wajib diisi." } : {}),
        ...(!password ? { password: "Password wajib diisi." } : {}),
        ...(!confirmPassword
          ? { confirmPassword: "Konfirmasi password wajib diisi." }
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

  const passwordError = validatePasswordStrength(password);

  if (passwordError) {
    return {
      success: false as const,
      state: createErrorState(passwordError, { password: passwordError }),
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

  const tenantFields = await validateTenantFields(formData);

  if (!tenantFields.success) {
    return {
      success: false as const,
      state: createErrorState(tenantFields.message, {
        ...(tenantFields.fieldErrors.name ? { tenantName: tenantFields.fieldErrors.name } : {}),
        ...(tenantFields.fieldErrors.username
          ? { username: tenantFields.fieldErrors.username }
          : {}),
        ...(tenantFields.fieldErrors.subscriptionPricingPlanId
          ? { subscriptionPricingPlanId: tenantFields.fieldErrors.subscriptionPricingPlanId }
          : {}),
      }),
    };
  }

  return {
    success: true as const,
    payload: {
      name,
      email,
      password,
      password_confirmation: confirmPassword,
      is_register: true as const,
      tenant_name: tenantFields.payload.name,
      username: tenantFields.payload.username,
      pricing_id: tenantFields.payload.pricing_id,
      pricing: tenantFields.payload.pricing,
      subscription_pricing_plan_id: tenantFields.payload.subscription_pricing_plan_id,
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
