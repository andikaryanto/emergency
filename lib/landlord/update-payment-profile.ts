import { ApiError, apiEndpointUrls, requestJson } from "../api";
import {
  CreatePaymentProfileError,
  type CreatePaymentProfileRequest,
} from "./create-payment-profile";

type UpdatePaymentProfileErrorPayload = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

function extractFirstError(value: string[] | string | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function mapUpdatePaymentProfileError(error: ApiError) {
  if (error.code === "TIMEOUT_ERROR" || error.code === "NETWORK_ERROR") {
    return new CreatePaymentProfileError({
      message: "Server payment profile sedang tidak dapat dijangkau. Coba lagi beberapa saat.",
    });
  }

  const payload = error.payload as UpdatePaymentProfileErrorPayload | undefined;

  return new CreatePaymentProfileError({
    message:
      payload?.message ??
      "Payment profile gagal diperbarui. Silakan periksa kembali data Anda.",
    status: error.status,
    fieldErrors: {
      ...(extractFirstError(payload?.errors?.payment_method)
        ? { paymentMethod: extractFirstError(payload?.errors?.payment_method) }
        : {}),
      ...(extractFirstError(payload?.errors?.account_holder_name)
        ? {
            accountHolderName: extractFirstError(payload?.errors?.account_holder_name),
          }
        : {}),
      ...(extractFirstError(payload?.errors?.bank_name)
        ? { bankName: extractFirstError(payload?.errors?.bank_name) }
        : {}),
      ...(extractFirstError(payload?.errors?.account_number)
        ? { accountNumber: extractFirstError(payload?.errors?.account_number) }
        : {}),
      ...(extractFirstError(payload?.errors?.notes)
        ? { notes: extractFirstError(payload?.errors?.notes) }
        : {}),
    },
  });
}

export async function updatePaymentProfile(
  paymentProfileId: number,
  payload: CreatePaymentProfileRequest,
  headers: HeadersInit,
) {
  try {
    await requestJson<unknown, CreatePaymentProfileRequest>({
      url: `${apiEndpointUrls.landlord.paymentProfile}/${paymentProfileId}`,
      method: "PATCH",
      body: payload,
      headers,
    });
  } catch (error) {
    if (error instanceof CreatePaymentProfileError) {
      throw error;
    }

    if (error instanceof ApiError) {
      throw mapUpdatePaymentProfileError(error);
    }

    throw new CreatePaymentProfileError({
      message: "Terjadi kesalahan tak terduga saat memperbarui payment profile.",
    });
  }
}
