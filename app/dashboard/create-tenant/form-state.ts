export type CreateTenantActionState = {
  status: "idle" | "error";
  message: string | null;
  fieldErrors: Partial<
    Record<"name" | "username" | "email" | "password", string>
  >;
};

export const initialCreateTenantActionState: CreateTenantActionState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};
