"use server";

import { redirect } from "next/navigation";
import { setLandlordSession } from "../lib/landlord/auth-session";
import { listLandlordTenants } from "../lib/landlord/list-tenants";
import {
  LoginGoogleError,
  type LoginGoogleFieldErrors,
  loginLandlordUserWithGoogle,
} from "../lib/landlord/login-google";
import { validateTenantFields } from "../lib/landlord/tenant-field-validation";

export type GoogleLoginActionState = {
  status: "idle" | "error";
  message: string | null;
  fieldErrors: LoginGoogleFieldErrors;
};

function createGoogleLoginErrorState(
  message: string,
  fieldErrors: LoginGoogleFieldErrors = {},
): GoogleLoginActionState {
  return {
    status: "error",
    message,
    fieldErrors,
  };
}

function buildLoginRedirectUrl(params: Record<string, string>) {
  const searchParams = new URLSearchParams(params);

  return `/login?${searchParams.toString()}`;
}

export async function loginWithGoogleAction(
  _previousState: GoogleLoginActionState,
  formData: FormData,
): Promise<GoogleLoginActionState> {
  const idToken = String(formData.get("id_token") ?? "").trim();

  if (!idToken) {
    return createGoogleLoginErrorState(
      "Google belum mengirimkan token identitas. Silakan coba lagi.",
    );
  }

  const isRegister = formData.get("is_register") === "true";

  const tenantFields = isRegister ? await validateTenantFields(formData) : null;

  if (tenantFields && !tenantFields.success) {
    return createGoogleLoginErrorState(tenantFields.message, {
      ...(tenantFields.fieldErrors.name ? { tenantName: tenantFields.fieldErrors.name } : {}),
      ...(tenantFields.fieldErrors.username
        ? { username: tenantFields.fieldErrors.username }
        : {}),
      ...(tenantFields.fieldErrors.subscriptionPricingPlanId
        ? { subscriptionPricingPlanId: tenantFields.fieldErrors.subscriptionPricingPlanId }
        : {}),
    });
  }

  let redirectTarget: string;

  try {
    const result = await loginLandlordUserWithGoogle(
      tenantFields
        ? {
            id_token: idToken,
            is_register: true,
            tenant_name: tenantFields.payload.name,
            username: tenantFields.payload.username,
            pricing_id: tenantFields.payload.pricing_id,
            pricing: tenantFields.payload.pricing,
            subscription_pricing_plan_id: tenantFields.payload.subscription_pricing_plan_id,
          }
        : { id_token: idToken },
    );

    if (result.status === "needs_manual_link") {
      redirectTarget = buildLoginRedirectUrl({
        google: result.status,
        ...(result.email ? { email: result.email } : {}),
      });
    } else if (!("session" in result)) {
      return createGoogleLoginErrorState(result.message);
    } else {
      const session = result.session;

      await setLandlordSession(session);

      if (session.user.role === "admin") {
        redirectTarget = "/admin/subscription-invoices";
      } else if (isRegister) {
        redirectTarget = "/dashboard?created=1";
      } else {
        const hasNoTenants = await listLandlordTenants({
          Authorization: `Bearer ${session.token}`,
        })
          .then(({ tenants }) => tenants.length === 0)
          .catch(() => false);

        redirectTarget = hasNoTenants ? "/dashboard/create-tenant" : "/dashboard";
      }
    }
  } catch (error) {
    if (error instanceof LoginGoogleError) {
      return createGoogleLoginErrorState(error.message, error.fieldErrors);
    }

    return createGoogleLoginErrorState(
      "Terjadi kesalahan tak terduga saat login dengan Google.",
    );
  }

  redirect(redirectTarget);
}
