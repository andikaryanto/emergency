export type ResendVerificationActionState = {
  status: "idle" | "error" | "success";
  message: string | null;
  fieldErrors: Partial<Record<"email", string>>;
};

export const initialResendVerificationActionState: ResendVerificationActionState =
  {
    status: "idle",
    message: null,
    fieldErrors: {},
  };
