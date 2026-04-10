"use server";

import { redirect } from "next/navigation";
import { setLandlordSession } from "../lib/landlord/auth-session";
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

  try {
    const result = await loginLandlordUserWithGoogle({
      id_token: idToken,
    });

    if (result.status === "needs_manual_link") {
      redirect(
        buildLoginRedirectUrl({
          google: result.status,
          ...(result.email ? { email: result.email } : {}),
        }),
      );
    }

    if (result.status === "error") {
      return createGoogleLoginErrorState(result.message);
    }

    if (
      result.status === "success" ||
      result.status === "auto_registered" ||
      result.status === "already_linked"
    ) {
      await setLandlordSession(result.session);

      if (result.session.user.role === "admin") {
        redirect("/admin/subscription-invoices");
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

  redirect("/dashboard");
}
