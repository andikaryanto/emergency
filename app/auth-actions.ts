"use server";

import { redirect } from "next/navigation";
import { setLandlordSession } from "../lib/landlord/auth-session";
import { listLandlordTenants } from "../lib/landlord/list-tenants";
import {
  LoginGoogleError,
  loginLandlordUserWithGoogle,
} from "../lib/landlord/login-google";

export type GoogleLoginActionState = {
  status: "idle" | "error";
  message: string | null;
};

function createGoogleLoginErrorState(message: string): GoogleLoginActionState {
  return {
    status: "error",
    message,
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
      const session = result.session;

      await setLandlordSession(session);

      if (session.user.role === "admin") {
        redirectTarget = "/admin/subscription-invoices";
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
      return createGoogleLoginErrorState(error.message);
    }

    return createGoogleLoginErrorState(
      "Terjadi kesalahan tak terduga saat login dengan Google.",
    );
  }

  redirect(redirectTarget);
}
