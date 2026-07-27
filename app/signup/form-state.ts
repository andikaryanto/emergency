export type RegisterActionState = {
  status: "idle" | "error";
  message: string | null;
  fieldErrors: Partial<
    Record<
      | "name"
      | "email"
      | "password"
      | "confirmPassword"
      | "tenantName"
      | "username"
      | "subscriptionPricingPlanId",
      string
    >
  >;
};

export const initialRegisterActionState: RegisterActionState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};
