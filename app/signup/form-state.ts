export type RegisterActionState = {
  status: "idle" | "error";
  message: string | null;
  fieldErrors: Partial<
    Record<
      "name" | "email" | "username" | "password" | "confirmPassword" | "tenantName" | "subscriptionPricingPlanId",
      string
    >
  >;
};

export const initialRegisterActionState: RegisterActionState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};
