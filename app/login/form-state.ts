export type LoginActionState = {
  status: "idle" | "error";
  message: string | null;
  fieldErrors: Partial<Record<"email" | "password", string>>;
};

export const initialLoginActionState: LoginActionState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};
