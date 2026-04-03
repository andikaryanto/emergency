export type SubscriptionInvoicePaymentConfirmationActionState = {
  status: "idle" | "error" | "success";
  message: string | null;
  fieldErrors: Partial<
    Record<
      | "paymentMethod"
      | "accountHolderName"
      | "bankName"
      | "accountNumber"
      | "transferredAmount"
      | "profileLabel",
      string
    >
  >;
};

export const initialSubscriptionInvoicePaymentConfirmationActionState: SubscriptionInvoicePaymentConfirmationActionState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};
