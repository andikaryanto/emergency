export type PaymentProfileActionState = {
  status: "idle" | "error" | "success";
  message: string | null;
  fieldErrors: Partial<
    Record<
      "paymentMethod" | "accountHolderName" | "bankName" | "accountNumber" | "notes",
      string
    >
  >;
};

export const initialPaymentProfileActionState: PaymentProfileActionState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};
