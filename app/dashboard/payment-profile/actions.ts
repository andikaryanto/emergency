"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getLandlordAccessToken,
  getLandlordAuthorizationHeader,
} from "../../../lib/landlord/auth-session";
import {
  CreatePaymentProfileError,
  type CreatePaymentProfileRequest,
  createPaymentProfile,
} from "../../../lib/landlord/create-payment-profile";
import { deletePaymentProfile } from "../../../lib/landlord/delete-payment-profile";
import { updatePaymentProfile } from "../../../lib/landlord/update-payment-profile";
import { type PaymentProfileActionState } from "./form-state";

function createErrorState(
  message: string,
  fieldErrors: PaymentProfileActionState["fieldErrors"] = {},
): PaymentProfileActionState {
  return {
    status: "error",
    message,
    fieldErrors,
  };
}

function validatePaymentProfilePayload(formData: FormData) {
  const paymentMethod = String(formData.get("payment_method") ?? "").trim();
  const accountHolderName = String(formData.get("account_holder_name") ?? "").trim();
  const bankName = String(formData.get("bank_name") ?? "").trim();
  const accountNumber = String(formData.get("account_number") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const isDefault = String(formData.get("is_default") ?? "") === "on";
  const isActive = String(formData.get("is_active") ?? "") === "on";

  if (!paymentMethod || !accountHolderName || !bankName || !accountNumber) {
    return {
      success: false as const,
      state: createErrorState("Lengkapi data payment profile terlebih dahulu.", {
        ...(!paymentMethod ? { paymentMethod: "Pilih metode pembayaran." } : {}),
        ...(!accountHolderName
          ? { accountHolderName: "Nama pemilik akun wajib diisi." }
          : {}),
        ...(!bankName ? { bankName: "Nama bank wajib diisi." } : {}),
        ...(!accountNumber ? { accountNumber: "Nomor akun wajib diisi." } : {}),
      }),
    };
  }

  return {
    success: true as const,
    payload: {
      payment_method: paymentMethod,
      account_holder_name: accountHolderName,
      bank_name: bankName,
      account_number: accountNumber,
      notes,
      is_default: isDefault,
      is_active: isActive,
    },
  };
}

async function resolveAuthorizedRequest() {
  const accessToken = await getLandlordAccessToken();

  if (!accessToken) {
    redirect("/login");
  }

  return getLandlordAuthorizationHeader();
}

async function persistPaymentProfile(
  payload: CreatePaymentProfileRequest,
  mode: "create" | "update",
  paymentProfileId?: number,
) {
  const authorizationHeader = await resolveAuthorizedRequest();

  if (mode === "update") {
    if (!paymentProfileId) {
      throw new CreatePaymentProfileError({
        message: "ID payment profile tidak valid untuk proses update.",
      });
    }

    await updatePaymentProfile(paymentProfileId, payload, authorizationHeader);
    return;
  }

  await createPaymentProfile(payload, authorizationHeader);
}

export async function createPaymentProfileAction(
  _previousState: PaymentProfileActionState,
  formData: FormData,
): Promise<PaymentProfileActionState> {
  const validation = validatePaymentProfilePayload(formData);

  if (!validation.success) {
    return validation.state;
  }

  try {
    await persistPaymentProfile(validation.payload, "create");
  } catch (error) {
    if (error instanceof CreatePaymentProfileError) {
      return createErrorState(error.message, error.fieldErrors);
    }

    return createErrorState(
      "Terjadi kesalahan tak terduga saat menyimpan payment profile.",
    );
  }

  revalidatePath("/dashboard/payment-profile");

  return {
    status: "success",
    message: "Payment profile berhasil disimpan.",
    fieldErrors: {},
  };
}

export async function updatePaymentProfileAction(
  paymentProfileId: number,
  _previousState: PaymentProfileActionState,
  formData: FormData,
): Promise<PaymentProfileActionState> {
  const validation = validatePaymentProfilePayload(formData);

  if (!validation.success) {
    return validation.state;
  }

  try {
    await persistPaymentProfile(validation.payload, "update", paymentProfileId);
  } catch (error) {
    if (error instanceof CreatePaymentProfileError) {
      return createErrorState(error.message, error.fieldErrors);
    }

    return createErrorState(
      "Terjadi kesalahan tak terduga saat memperbarui payment profile.",
    );
  }

  revalidatePath("/dashboard/payment-profile");

  return {
    status: "success",
    message: "Payment profile berhasil diperbarui.",
    fieldErrors: {},
  };
}

export async function deletePaymentProfileAction(paymentProfileId: number) {
  const authorizationHeader = await resolveAuthorizedRequest();

  await deletePaymentProfile(paymentProfileId, authorizationHeader);
  revalidatePath("/dashboard/payment-profile");
}
