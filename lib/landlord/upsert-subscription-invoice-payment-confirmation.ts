import { ApiError, apiEndpointUrls, requestJson } from "../api";

export type SubscriptionInvoicePaymentProfileSnapshot = {
  payment_method: string;
  account_holder_name: string;
  bank_name: string;
  account_number: string;
  transferred_amount: number;
  profile_id: number;
  profile_label: string;
  submitted_notes: string;
};

type CreateSubscriptionInvoicePaymentConfirmationRequest = {
  notes: string;
  payment_profile_snapshot: SubscriptionInvoicePaymentProfileSnapshot;
};

type UpdateSubscriptionInvoicePaymentConfirmationRequest = {
  id: number;
  notes: string;
  payment_profile_snapshot: SubscriptionInvoicePaymentProfileSnapshot;
};

type UpsertSubscriptionInvoicePaymentConfirmationErrorPayload = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

export class UpsertSubscriptionInvoicePaymentConfirmationError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = "UpsertSubscriptionInvoicePaymentConfirmationError";
    this.status = status;
  }
}

function mapUpsertSubscriptionInvoicePaymentConfirmationError(error: ApiError) {
  if (error.code === "TIMEOUT_ERROR" || error.code === "NETWORK_ERROR") {
    return new UpsertSubscriptionInvoicePaymentConfirmationError(
      "Server konfirmasi pembayaran sedang tidak dapat dijangkau. Coba lagi beberapa saat.",
    );
  }

  const payload =
    error.payload as UpsertSubscriptionInvoicePaymentConfirmationErrorPayload | undefined;

  return new UpsertSubscriptionInvoicePaymentConfirmationError(
    payload?.message ??
      "Konfirmasi pembayaran gagal dikirim. Silakan periksa kembali data invoice dan payment profile Anda.",
    error.status,
  );
}

function getBasePaymentConfirmationUrl(tenantId: number) {
  return `${apiEndpointUrls.landlord.tenant}/${tenantId}/subscription-invoice/payment-confirmation`;
}

export async function upsertSubscriptionInvoicePaymentConfirmation(
  {
    tenantId,
    paymentConfirmationId,
    payload,
  }: {
    tenantId: number;
    paymentConfirmationId?: number | null;
    payload:
      | CreateSubscriptionInvoicePaymentConfirmationRequest
      | UpdateSubscriptionInvoicePaymentConfirmationRequest;
  },
  headers: HeadersInit,
) {
  const hasExistingConfirmation =
    typeof paymentConfirmationId === "number" && Number.isFinite(paymentConfirmationId);
  const url = hasExistingConfirmation
    ? `${getBasePaymentConfirmationUrl(tenantId)}/${paymentConfirmationId}`
    : getBasePaymentConfirmationUrl(tenantId);

  try {
    await requestJson<
      unknown,
      | CreateSubscriptionInvoicePaymentConfirmationRequest
      | UpdateSubscriptionInvoicePaymentConfirmationRequest
    >({
      url,
      method: hasExistingConfirmation ? "PATCH" : "POST",
      body: payload,
      headers,
    });
  } catch (error) {
    if (error instanceof UpsertSubscriptionInvoicePaymentConfirmationError) {
      throw error;
    }

    if (error instanceof ApiError) {
      throw mapUpsertSubscriptionInvoicePaymentConfirmationError(error);
    }

    throw new UpsertSubscriptionInvoicePaymentConfirmationError(
      "Terjadi kesalahan tak terduga saat menyimpan konfirmasi pembayaran.",
    );
  }
}
