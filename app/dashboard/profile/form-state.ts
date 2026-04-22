export type UserProfileActionState = {
  status: "idle" | "error" | "success";
  message: string | null;
  fieldErrors: Partial<
    Record<"phone" | "address" | "city" | "province" | "postalCode", string>
  >;
};

export const initialUserProfileActionState: UserProfileActionState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};
