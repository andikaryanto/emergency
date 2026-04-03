"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getLandlordAccessToken,
  getLandlordAuthorizationHeader,
} from "../../../lib/landlord/auth-session";
import {
  ConfirmSubscriptionInvoicePaymentError,
  confirmSubscriptionInvoicePayment,
} from "../../../lib/landlord/confirm-subscription-invoice-payment";

async function resolveAuthorizedRequest() {
  const accessToken = await getLandlordAccessToken();

  if (!accessToken) {
    redirect("/login");
  }

  return getLandlordAuthorizationHeader();
}

export async function approveSubscriptionInvoicePaymentConfirmationAction(tenantId: number) {
  const authorizationHeader = await resolveAuthorizedRequest();

  try {
    await confirmSubscriptionInvoicePayment(tenantId, authorizationHeader);
  } catch (error) {
    if (error instanceof ConfirmSubscriptionInvoicePaymentError) {
      throw error;
    }

    throw error;
  }

  revalidatePath("/admin/subscription-invoices");
}
