export type ResetPasswordActionState = {
  status: "idle" | "error" | "success";
  message: string | null;
  fieldErrors: Partial<Record<"password" | "confirmPassword", string>>;
};

export const initialResetPasswordActionState: ResetPasswordActionState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};
