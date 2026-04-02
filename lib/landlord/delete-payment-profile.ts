import { ApiError, apiEndpointUrls, requestJson } from "../api";

export class DeletePaymentProfileError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = "DeletePaymentProfileError";
    this.status = status;
  }
}

export async function deletePaymentProfile(
  paymentProfileId: number,
  headers: HeadersInit,
) {
  try {
    await requestJson<unknown, undefined>({
      url: `${apiEndpointUrls.landlord.paymentProfile}/${paymentProfileId}`,
      method: "DELETE",
      headers,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw new DeletePaymentProfileError(
        error.status === 401
          ? "Sesi login sudah tidak valid. Silakan login ulang."
          : error.message,
        error.status,
      );
    }

    throw new DeletePaymentProfileError(
      "Terjadi kesalahan tak terduga saat menghapus payment profile.",
    );
  }
}
