import { ApiError, apiEndpointUrls, requestJson } from "../api";

export type ConnectGoogleRequest = {
  id_token: string;
};

type ConnectGoogleApiResponse = {
  message?: string;
};

export class ConnectGoogleError extends Error {
  readonly status: number | null;

  constructor({
    message,
    status = null,
  }: {
    message: string;
    status?: number | null;
  }) {
    super(message);
    this.name = "ConnectGoogleError";
    this.status = status;
  }
}

function mapConnectGoogleError(error: ApiError) {
  if (error.code === "TIMEOUT_ERROR" || error.code === "NETWORK_ERROR") {
    return new ConnectGoogleError({
      message:
        "Server penghubung Google sedang tidak dapat dijangkau. Coba lagi beberapa saat.",
    });
  }

  const payload =
    error.payload && typeof error.payload === "object"
      ? (error.payload as { message?: string })
      : undefined;

  return new ConnectGoogleError({
    message:
      payload?.message ??
      "Menghubungkan akun Google gagal. Silakan coba beberapa saat lagi.",
    status: error.status,
  });
}

export async function connectLandlordGoogle(
  payload: ConnectGoogleRequest,
  authorizationHeader: HeadersInit,
) {
  try {
    const response = await requestJson<ConnectGoogleApiResponse, ConnectGoogleRequest>({
      url: apiEndpointUrls.landlord.user.connectGoogle,
      method: "POST",
      body: payload,
      headers: authorizationHeader,
    });

    return {
      message: response.message ?? "Akun Google berhasil dihubungkan.",
    };
  } catch (error) {
    if (error instanceof ConnectGoogleError) {
      throw error;
    }

    if (error instanceof ApiError) {
      throw mapConnectGoogleError(error);
    }

    throw new ConnectGoogleError({
      message: "Terjadi kesalahan tak terduga saat menghubungkan akun Google.",
    });
  }
}
