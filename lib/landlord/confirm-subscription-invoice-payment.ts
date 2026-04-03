import { ApiError, apiEndpointUrls, requestJson } from "../api";

export class ConfirmSubscriptionInvoicePaymentError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = "ConfirmSubscriptionInvoicePaymentError";
    this.status = status;
  }
}

function mapConfirmSubscriptionInvoicePaymentError(error: ApiError) {
  if (error.code === "TIMEOUT_ERROR" || error.code === "NETWORK_ERROR") {
    return new ConfirmSubscriptionInvoicePaymentError(
      "Server konfirmasi pembayaran sedang tidak dapat dijangkau. Coba lagi beberapa saat.",
    );
  }

  const payload = error.payload as { message?: string } | undefined;

  return new ConfirmSubscriptionInvoicePaymentError(
    payload?.message ?? "Approval konfirmasi pembayaran gagal diproses.",
    error.status,
  );
}

export async function confirmSubscriptionInvoicePayment(
  tenantId: number,
  headers: HeadersInit,
) {
  try {
    await requestJson<unknown, undefined>({
      url: `${apiEndpointUrls.landlord.tenant}/${tenantId}/subscription-invoice/confirm-payment`,
      method: "POST",
      headers,
    });
  } catch (error) {
    if (error instanceof ConfirmSubscriptionInvoicePaymentError) {
      throw error;
    }

    if (error instanceof ApiError) {
      throw mapConfirmSubscriptionInvoicePaymentError(error);
    }

    throw new ConfirmSubscriptionInvoicePaymentError(
      "Terjadi kesalahan tak terduga saat meng-approve konfirmasi pembayaran.",
    );
  }
}
