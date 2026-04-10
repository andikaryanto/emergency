"use server";

import { redirect } from "next/navigation";
import {
  appendLandlordAuthProvider,
  clearLandlordSession,
  getLandlordAccessToken,
  getLandlordAuthorizationHeader,
  getLandlordAuthUser,
  hasLandlordAuthProvider,
  setLandlordAuthUser,
} from "../../lib/landlord/auth-session";
import {
  ConnectGoogleError,
  connectLandlordGoogle,
} from "../../lib/landlord/connect-google";

export async function logoutUserAction() {
  await clearLandlordSession();
  redirect("/login");
}

export type ConnectGoogleActionState = {
  status: "idle" | "error";
  message: string | null;
};

export async function connectGoogleAction(
  _previousState: ConnectGoogleActionState,
  formData: FormData,
): Promise<ConnectGoogleActionState> {
  const idToken = String(formData.get("id_token") ?? "").trim();

  if (!idToken) {
    return {
      status: "error",
      message: "Google belum mengirimkan token identitas. Silakan coba lagi.",
    };
  }

  const [currentUser, accessToken, authorizationHeader] = await Promise.all([
    getLandlordAuthUser(),
    getLandlordAccessToken(),
    getLandlordAuthorizationHeader(),
  ]);

  if (!currentUser || !accessToken) {
    redirect("/login");
  }

  if (hasLandlordAuthProvider(currentUser, "google")) {
    redirect("/dashboard?google_connected=1");
  }

  try {
    await connectLandlordGoogle(
      {
        id_token: idToken,
      },
      authorizationHeader,
    );

    await setLandlordAuthUser(appendLandlordAuthProvider(currentUser, "google"));
  } catch (error) {
    if (error instanceof ConnectGoogleError) {
      return {
        status: "error",
        message: error.message,
      };
    }

    return {
      status: "error",
      message: "Terjadi kesalahan tak terduga saat menghubungkan akun Google.",
    };
  }

  redirect("/dashboard?google_connected=1");
}
