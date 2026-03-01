export type ForgotPasswordActionState = {
  status: "idle" | "error" | "success";
  message: string | null;
  fieldErrors: Partial<Record<"email", string>>;
};

export const initialForgotPasswordActionState: ForgotPasswordActionState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};
