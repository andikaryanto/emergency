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
import { validateTenantFields } from "../../../lib/landlord/tenant-field-validation";
import { validatePasswordStrength } from "../../../lib/password-validation";
import { type CreateTenantActionState } from "./form-state";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

async function validateCreateTenantPayload(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      success: false as const,
      state: createErrorState("Semua field wajib diisi.", {
        ...(!email ? { email: "Email admin wajib diisi." } : {}),
        ...(!password ? { password: "Password admin wajib diisi." } : {}),
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

  const passwordError = validatePasswordStrength(password);

  if (passwordError) {
    return {
      success: false as const,
      state: createErrorState(passwordError, { password: passwordError }),
    };
  }

  const tenantFields = await validateTenantFields(formData);

  if (!tenantFields.success) {
    return {
      success: false as const,
      state: createErrorState(tenantFields.message, tenantFields.fieldErrors),
    };
  }

  return {
    success: true as const,
    payload: {
      name: tenantFields.payload.name,
      username: tenantFields.payload.username,
      email,
      password,
      pricing_id: tenantFields.payload.pricing_id,
      pricing: tenantFields.payload.pricing,
      subscription_pricing_plan_id: tenantFields.payload.subscription_pricing_plan_id,
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

  const validation = await validateCreateTenantPayload(formData);

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
