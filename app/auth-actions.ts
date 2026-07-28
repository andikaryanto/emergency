"use server";

import { redirect } from "next/navigation";
import { type LandlordSession, setLandlordSession } from "../lib/landlord/auth-session";
import { listLandlordTenants } from "../lib/landlord/list-tenants";
import {
  LoginGoogleError,
  loginLandlordUserWithGoogle,
} from "../lib/landlord/login-google";
import { resolvePricingSelection } from "../lib/landlord/pricing-selection";

const NAME_PATTERN = /^[a-z0-9]+$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/;
const USERNAME_NO_SPACE_PATTERN = /^\S+$/;
const PASSWORD_NO_SPACE_PATTERN = /^\S+$/;
const PASSWORD_HAS_NUMBER_PATTERN = /\d/;
const PASSWORD_HAS_SPECIAL_CHAR_PATTERN = /[^A-Za-z0-9]/;

export type GoogleLoginActionState = {
  status: "idle" | "error";
  message: string | null;
  fieldErrors?: Partial<
    Record<"tenantName" | "username" | "password" | "subscriptionPricingPlanId", string>
  >;
};

function createGoogleLoginErrorState(
  message: string,
  fieldErrors: GoogleLoginActionState["fieldErrors"] = {},
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

async function resolvePostAuthRedirect(session: LandlordSession) {
  if (session.user.role === "admin") {
    return "/admin/subscription-invoices";
  }

  const hasNoTenants = await listLandlordTenants({
    Authorization: `Bearer ${session.token}`,
  })
    .then(({ tenants }) => tenants.length === 0)
    .catch(() => false);

  return hasNoTenants ? "/dashboard/create-tenant" : "/dashboard";
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

  let redirectTarget: string;

  try {
    const result = await loginLandlordUserWithGoogle({
      id_token: idToken,
    });

    if (result.status === "needs_manual_link") {
      redirectTarget = buildLoginRedirectUrl({
        google: result.status,
        ...(result.email ? { email: result.email } : {}),
      });
    } else if (!("session" in result)) {
      return createGoogleLoginErrorState(result.message);
    } else {
      await setLandlordSession(result.session);
      redirectTarget = await resolvePostAuthRedirect(result.session);
    }
  } catch (error) {
    if (error instanceof LoginGoogleError) {
      return createGoogleLoginErrorState(error.message);
    }

    return createGoogleLoginErrorState(
      "Terjadi kesalahan tak terduga saat login dengan Google.",
    );
  }

  redirect(redirectTarget);
}

async function validateRegisterWithGoogleTenantFields(formData: FormData) {
  const tenantName = String(formData.get("tenant_name") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const subscriptionPricingPlanIdRaw = String(
    formData.get("subscription_pricing_plan_id") ?? "",
  ).trim();
  const subscriptionPricingPlanId = Number(subscriptionPricingPlanIdRaw);

  if (!tenantName || !username || !password || !subscriptionPricingPlanIdRaw) {
    return {
      success: false as const,
      state: createGoogleLoginErrorState("Data klinik wajib diisi.", {
        ...(!tenantName ? { tenantName: "Nama klinik wajib diisi." } : {}),
        ...(!username ? { username: "Username admin wajib diisi." } : {}),
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
      state: createGoogleLoginErrorState("Pilihan paket langganan tidak valid.", {
        subscriptionPricingPlanId: "Pilih opsi Basic, Advance, atau Pro yang tersedia.",
      }),
    };
  }

  if (!NAME_PATTERN.test(tenantName)) {
    return {
      success: false as const,
      state: createGoogleLoginErrorState("Format nama klinik tidak valid.", {
        tenantName: "Gunakan huruf kecil dan angka saja, tanpa spasi atau karakter spesial.",
      }),
    };
  }

  if (!USERNAME_PATTERN.test(username)) {
    if (!USERNAME_NO_SPACE_PATTERN.test(username)) {
      return {
        success: false as const,
        state: createGoogleLoginErrorState("Username tidak boleh mengandung spasi.", {
          username: "Gunakan username tanpa spasi.",
        }),
      };
    }

    return {
      success: false as const,
      state: createGoogleLoginErrorState("Format username tidak valid.", {
        username: "Gunakan huruf, angka, titik, strip, atau underscore.",
      }),
    };
  }

  if (password.length < 8) {
    return {
      success: false as const,
      state: createGoogleLoginErrorState("Password minimal 8 karakter.", {
        password: "Gunakan minimal 8 karakter.",
      }),
    };
  }

  if (!PASSWORD_NO_SPACE_PATTERN.test(password)) {
    return {
      success: false as const,
      state: createGoogleLoginErrorState("Password tidak boleh mengandung spasi.", {
        password: "Hapus spasi pada password Anda.",
      }),
    };
  }

  if (!PASSWORD_HAS_NUMBER_PATTERN.test(password)) {
    return {
      success: false as const,
      state: createGoogleLoginErrorState("Password harus mengandung angka.", {
        password: "Tambahkan minimal 1 angka.",
      }),
    };
  }

  if (!PASSWORD_HAS_SPECIAL_CHAR_PATTERN.test(password)) {
    return {
      success: false as const,
      state: createGoogleLoginErrorState("Password harus mengandung karakter spesial.", {
        password: "Tambahkan minimal 1 karakter selain huruf dan angka.",
      }),
    };
  }

  const pricingSelection = await resolvePricingSelection(subscriptionPricingPlanId);

  if (!pricingSelection) {
    return {
      success: false as const,
      state: createGoogleLoginErrorState("Pilihan paket langganan tidak ditemukan.", {
        subscriptionPricingPlanId: "Pilih paket langganan yang tersedia lalu coba lagi.",
      }),
    };
  }

  return {
    success: true as const,
    payload: {
      tenant_name: tenantName,
      username,
      password,
      pricing_id: pricingSelection.pricing_id,
      pricing: pricingSelection.pricing,
      subscription_pricing_plan_id: subscriptionPricingPlanId,
    },
  };
}

export async function registerWithGoogleAction(
  _previousState: GoogleLoginActionState,
  formData: FormData,
): Promise<GoogleLoginActionState> {
  const idToken = String(formData.get("id_token") ?? "").trim();

  if (!idToken) {
    return createGoogleLoginErrorState(
      "Google belum mengirimkan token identitas. Silakan coba lagi.",
    );
  }

  const validation = await validateRegisterWithGoogleTenantFields(formData);

  if (!validation.success) {
    return validation.state;
  }

  let redirectTarget: string;

  try {
    const result = await loginLandlordUserWithGoogle({
      id_token: idToken,
      is_register: true,
      ...validation.payload,
    });

    if (result.status === "needs_manual_link") {
      redirectTarget = buildLoginRedirectUrl({
        google: result.status,
        ...(result.email ? { email: result.email } : {}),
      });
    } else if (!("session" in result)) {
      return createGoogleLoginErrorState(result.message);
    } else {
      await setLandlordSession(result.session);
      redirectTarget = await resolvePostAuthRedirect(result.session);
    }
  } catch (error) {
    if (error instanceof LoginGoogleError) {
      return createGoogleLoginErrorState(error.message);
    }

    return createGoogleLoginErrorState(
      "Terjadi kesalahan tak terduga saat mendaftar dengan Google.",
    );
  }

  redirect(redirectTarget);
}
