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
import {
  ApiError,
  apiEndpointUrls,
  requestJson,
} from "../../lib/api";

export async function logoutUserAction() {
  await clearLandlordSession();
  redirect("/login");
}

type CreateTenantSnapPaymentTransactionResponse = {
  data?: unknown;
  snap?: unknown;
};

export type CreateTenantSnapPaymentTransactionActionState = {
  status: "idle" | "error" | "success";
  message: string | null;
  snap: {
    gateway: string | null;
    orderId: string | null;
    token: string;
    redirectUrl: string | null;
    clientKey: string;
  } | null;
};

function getString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getNestedRecord(source: unknown, key: string) {
  if (!isRecord(source)) {
    return null;
  }

  const value = source[key];

  return isRecord(value) ? value : null;
}

function findRecordByKey(
  source: unknown,
  targetKey: string,
  visited = new WeakSet<object>(),
): Record<string, unknown> | null {
  if (!isRecord(source)) {
    return null;
  }

  if (visited.has(source)) {
    return null;
  }

  visited.add(source);

  const directValue = source[targetKey];

  if (isRecord(directValue)) {
    return directValue;
  }

  for (const value of Object.values(source)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        const nestedMatch: Record<string, unknown> | null = findRecordByKey(
          item,
          targetKey,
          visited,
        );

        if (nestedMatch) {
          return nestedMatch;
        }
      }

      continue;
    }

    const nestedMatch: Record<string, unknown> | null = findRecordByKey(
      value,
      targetKey,
      visited,
    );

    if (nestedMatch) {
      return nestedMatch;
    }
  }

  return null;
}

function listRecordKeys(source: unknown) {
  return isRecord(source) ? Object.keys(source).sort() : [];
}

function getSnapPayload(payload: CreateTenantSnapPaymentTransactionResponse | null | undefined) {
  if (!payload) {
    return null;
  }

  const directSnap = isRecord(payload.snap) ? payload.snap : null;

  if (directSnap) {
    return directSnap;
  }

  const data = isRecord(payload.data) ? payload.data : null;
  const dataSnap = getNestedRecord(data, "snap");

  if (dataSnap) {
    return dataSnap;
  }

  const nestedData = getNestedRecord(data, "data");

  return getNestedRecord(nestedData, "snap") ?? findRecordByKey(payload, "snap");
}

function normalizeTenantSnapPaymentTransaction(
  payload: CreateTenantSnapPaymentTransactionResponse | null | undefined,
) {
  const snap = getSnapPayload(payload);
  const token = getString(snap?.token);
  const clientKey = getString(snap?.client_key) ?? getString(snap?.clientKey);

  if (!token || !clientKey) {
    return null;
  }

  return {
    gateway: getString(snap?.gateway),
    orderId: getString(snap?.order_id) ?? getString(snap?.orderId),
    token,
    redirectUrl: getString(snap?.redirect_url) ?? getString(snap?.redirectUrl),
    clientKey,
  };
}

function getIncompleteSnapResponseMessage(
  payload: CreateTenantSnapPaymentTransactionResponse | null | undefined,
) {
  const snap = getSnapPayload(payload);
  const rootKeys = listRecordKeys(payload);
  const dataKeys = listRecordKeys(isRecord(payload?.data) ? payload.data : null);
  const snapKeys = listRecordKeys(snap);

  if (!snap) {
    return rootKeys.length > 0 || dataKeys.length > 0
      ? `Response pembayaran belum memuat object snap. Root keys: ${rootKeys.join(", ") || "-"}. Data keys: ${dataKeys.join(", ") || "-"}.`
      : "Response pembayaran dari server belum lengkap.";
  }

  const token = getString(snap.token);
  const clientKey = getString(snap.client_key) ?? getString(snap.clientKey);

  if (!token || !clientKey) {
    return `Object snap ditemukan, tapi field wajib belum lengkap. Snap keys: ${snapKeys.join(", ") || "-"}.`;
  }

  return "Response pembayaran dari server belum lengkap.";
}

export async function createTenantSnapPaymentTransactionAction(
  _previousState: CreateTenantSnapPaymentTransactionActionState,
  input: {
    tenantId: number;
  },
): Promise<CreateTenantSnapPaymentTransactionActionState> {
  const tenantId = input?.tenantId;

  if (!Number.isInteger(tenantId) || tenantId <= 0) {
    return {
      status: "error",
      message: "Data tenant tidak valid untuk memulai pembayaran.",
      snap: null,
    };
  }

  const accessToken = await getLandlordAccessToken();

  if (!accessToken) {
    redirect("/login");
  }

  const authorizationHeader = await getLandlordAuthorizationHeader();

  try {
    const response = await requestJson<CreateTenantSnapPaymentTransactionResponse, undefined>({
      url: `${apiEndpointUrls.landlord.tenant}/${tenantId}/subscription-invoice/payment-transaction`,
      method: "POST",
      headers: authorizationHeader,
    });
    const snap = normalizeTenantSnapPaymentTransaction(response);

    if (!snap) {
      return {
        status: "error",
        message: getIncompleteSnapResponseMessage(response),
        snap: null,
      };
    }

    return {
      status: "success",
      message: "Transaksi pembayaran berhasil disiapkan.",
      snap,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      const payload = error.payload as { message?: string } | undefined;

      return {
        status: "error",
        message:
          payload?.message ??
          "Transaksi pembayaran belum bisa dibuat saat ini.",
        snap: null,
      };
    }

    return {
      status: "error",
      message: "Terjadi kesalahan tak terduga saat menyiapkan pembayaran.",
      snap: null,
    };
  }
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
