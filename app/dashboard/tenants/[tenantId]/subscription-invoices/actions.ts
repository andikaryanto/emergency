"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getLandlordAccessToken,
  getLandlordAuthorizationHeader,
} from "../../../../../lib/landlord/auth-session";
import {
  UpsertSubscriptionInvoicePaymentConfirmationError,
  upsertSubscriptionInvoicePaymentConfirmation,
} from "../../../../../lib/landlord/upsert-subscription-invoice-payment-confirmation";
import {
  initialSubscriptionInvoicePaymentConfirmationActionState,
  type SubscriptionInvoicePaymentConfirmationActionState,
} from "./form-state";

function createErrorState(
  message: string,
  fieldErrors: SubscriptionInvoicePaymentConfirmationActionState["fieldErrors"] = {},
): SubscriptionInvoicePaymentConfirmationActionState {
  return {
    status: "error",
    message,
    fieldErrors,
  };
}

function getRequiredString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getRequiredNumber(formData: FormData, key: string) {
  const value = Number(getRequiredString(formData, key));

  return Number.isFinite(value) ? value : null;
}

async function resolveAuthorizedRequest() {
  const accessToken = await getLandlordAccessToken();

  if (!accessToken) {
    redirect("/login");
  }

  return getLandlordAuthorizationHeader();
}

export async function submitSubscriptionInvoicePaymentConfirmationAction(
  previousState: SubscriptionInvoicePaymentConfirmationActionState =
    initialSubscriptionInvoicePaymentConfirmationActionState,
  formData: FormData,
): Promise<SubscriptionInvoicePaymentConfirmationActionState> {
  void previousState;
  const tenantId = getRequiredNumber(formData, "tenant_id");
  const invoiceId = getRequiredNumber(formData, "invoice_id");
  const paymentConfirmationId = getRequiredNumber(formData, "payment_confirmation_id");
  const profileId = getRequiredNumber(formData, "profile_id") ?? 0;
  const transferredAmount = getRequiredNumber(formData, "transferred_amount");
  const profileLabel = getRequiredString(formData, "profile_label");
  const paymentMethod = getRequiredString(formData, "payment_method");
  const accountHolderName = getRequiredString(formData, "account_holder_name");
  const bankName = getRequiredString(formData, "bank_name");
  const accountNumber = getRequiredString(formData, "account_number");
  const submittedNotes = getRequiredString(formData, "submitted_notes");

  if (tenantId === null || tenantId <= 0 || invoiceId === null || invoiceId <= 0) {
    return createErrorState("Data invoice tidak valid untuk mengirim konfirmasi pembayaran.");
  }

  const fieldErrors: SubscriptionInvoicePaymentConfirmationActionState["fieldErrors"] = {
    ...(!profileLabel ? { profileLabel: "Label profile wajib diisi." } : {}),
    ...(!paymentMethod ? { paymentMethod: "Pilih metode pembayaran." } : {}),
    ...(!accountHolderName
      ? { accountHolderName: "Nama pemilik akun wajib diisi." }
      : {}),
    ...(!bankName ? { bankName: "Nama bank wajib diisi." } : {}),
    ...(!accountNumber ? { accountNumber: "Nomor akun wajib diisi." } : {}),
    ...(transferredAmount === null || transferredAmount <= 0
      ? { transferredAmount: "Nominal transfer harus lebih dari 0." }
      : {}),
  };

  if (Object.keys(fieldErrors).length > 0) {
    return createErrorState(
      "Lengkapi data konfirmasi pembayaran terlebih dahulu.",
      fieldErrors,
    );
  }

  const normalizedTransferredAmount = transferredAmount ?? 0;

  try {
    const authorizationHeader = await resolveAuthorizedRequest();
    const paymentProfileSnapshot = {
      payment_method: paymentMethod,
      account_holder_name: accountHolderName,
      bank_name: bankName,
      account_number: accountNumber,
      transferred_amount: normalizedTransferredAmount,
      profile_id: Math.max(profileId, 0),
      profile_label: profileLabel,
      submitted_notes: submittedNotes,
    };

    await upsertSubscriptionInvoicePaymentConfirmation(
      paymentConfirmationId && paymentConfirmationId > 0
        ? {
            tenantId,
            paymentConfirmationId,
            payload: {
              id: paymentConfirmationId,
              notes: submittedNotes,
              payment_profile_snapshot: paymentProfileSnapshot,
            },
          }
        : {
            tenantId,
            payload: {
              notes: submittedNotes,
              payment_profile_snapshot: paymentProfileSnapshot,
            },
          },
      authorizationHeader,
    );
  } catch (error) {
    if (error instanceof UpsertSubscriptionInvoicePaymentConfirmationError) {
      return createErrorState(error.message);
    }

    return createErrorState(
      "Terjadi kesalahan tak terduga saat mengirim konfirmasi pembayaran.",
    );
  }

  revalidatePath(`/dashboard/tenants/${tenantId}/subscription-invoices`);

  return {
    status: "success",
    message:
      paymentConfirmationId && paymentConfirmationId > 0
        ? "Konfirmasi pembayaran berhasil diperbarui."
        : "Konfirmasi pembayaran berhasil dikirim.",
    fieldErrors: {},
  };
}
