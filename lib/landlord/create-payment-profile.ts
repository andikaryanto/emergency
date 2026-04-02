import { ApiError, apiEndpointUrls, requestJson } from "../api";

export type CreatePaymentProfileRequest = {
  payment_method: string;
  account_holder_name: string;
  bank_name: string;
  account_number: string;
  notes: string;
  is_default: boolean;
  is_active: boolean;
};

type CreatePaymentProfileErrorPayload = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

export class CreatePaymentProfileError extends Error {
  readonly status: number | null;
  readonly fieldErrors: Partial<
    Record<
      | "paymentMethod"
      | "accountHolderName"
      | "bankName"
      | "accountNumber"
      | "notes",
      string
    >
  >;

  constructor({
    message,
    status = null,
    fieldErrors = {},
  }: {
    message: string;
    status?: number | null;
    fieldErrors?: Partial<
      Record<
        | "paymentMethod"
        | "accountHolderName"
        | "bankName"
        | "accountNumber"
        | "notes",
        string
      >
    >;
  }) {
    super(message);
    this.name = "CreatePaymentProfileError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

function extractFirstError(value: string[] | string | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function mapCreatePaymentProfileError(error: ApiError) {
  if (error.code === "TIMEOUT_ERROR" || error.code === "NETWORK_ERROR") {
    return new CreatePaymentProfileError({
      message: "Server payment profile sedang tidak dapat dijangkau. Coba lagi beberapa saat.",
    });
  }

  const payload = error.payload as CreatePaymentProfileErrorPayload | undefined;

  return new CreatePaymentProfileError({
    message:
      payload?.message ??
      "Payment profile gagal disimpan. Silakan periksa kembali data Anda.",
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

export async function createPaymentProfile(
  payload: CreatePaymentProfileRequest,
  headers: HeadersInit,
) {
  try {
    await requestJson<unknown, CreatePaymentProfileRequest>({
      url: apiEndpointUrls.landlord.paymentProfile,
      method: "POST",
      body: payload,
      headers,
    });
  } catch (error) {
    if (error instanceof CreatePaymentProfileError) {
      throw error;
    }

    if (error instanceof ApiError) {
      throw mapCreatePaymentProfileError(error);
    }

    throw new CreatePaymentProfileError({
      message: "Terjadi kesalahan tak terduga saat menyimpan payment profile.",
    });
  }
}
