import { listSubscriptionPricings } from "./list-subscription-pricings";

export const TENANT_NAME_PATTERN = /^[a-z0-9]+$/;
export const TENANT_USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/;
export const TENANT_USERNAME_NO_SPACE_PATTERN = /^\S+$/;

export type TenantFieldErrors = Partial<
  Record<"name" | "username" | "subscriptionPricingPlanId", string>
>;

export type TenantFieldsPayload = {
  name: string;
  username: string;
  pricing_id: number;
  pricing: "Basic" | "Advance" | "Pro";
  subscription_pricing_plan_id: number;
};

export type ValidateTenantFieldsResult =
  | { success: true; payload: TenantFieldsPayload }
  | { success: false; fieldErrors: TenantFieldErrors; message: string };

export async function resolveTenantPricingSelection(subscriptionPricingPlanId: number) {
  const pricings = await listSubscriptionPricings();
  const matchedPricing = pricings.find((pricing) =>
    pricing.subscription_pricing_plans.some((plan) => plan.id === subscriptionPricingPlanId),
  );

  if (matchedPricing) {
    return {
      pricing_id: matchedPricing.id,
      pricing: matchedPricing.name,
    };
  }

  if (subscriptionPricingPlanId === 1 || subscriptionPricingPlanId === 2) {
    return { pricing_id: 1, pricing: "Basic" as const };
  }

  if (subscriptionPricingPlanId === 3 || subscriptionPricingPlanId === 4) {
    return { pricing_id: 2, pricing: "Advance" as const };
  }

  if (subscriptionPricingPlanId === 5 || subscriptionPricingPlanId === 6) {
    return { pricing_id: 3, pricing: "Pro" as const };
  }

  return null;
}

export async function validateTenantFields(
  formData: FormData,
): Promise<ValidateTenantFieldsResult> {
  const name = String(formData.get("tenant_name") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim();
  const subscriptionPricingPlanIdRaw = String(
    formData.get("subscription_pricing_plan_id") ?? "",
  ).trim();
  const subscriptionPricingPlanId = Number(subscriptionPricingPlanIdRaw);

  if (!name || !username || !subscriptionPricingPlanIdRaw) {
    return {
      success: false,
      message: "Semua field klinik wajib diisi.",
      fieldErrors: {
        ...(!name ? { name: "Nama klinik wajib diisi." } : {}),
        ...(!username ? { username: "Username admin wajib diisi." } : {}),
        ...(!subscriptionPricingPlanIdRaw
          ? { subscriptionPricingPlanId: "Pilih paket langganan terlebih dahulu." }
          : {}),
      },
    };
  }

  if (!Number.isInteger(subscriptionPricingPlanId) || subscriptionPricingPlanId <= 0) {
    return {
      success: false,
      message: "Pilihan paket langganan tidak valid.",
      fieldErrors: {
        subscriptionPricingPlanId: "Pilih opsi Basic, Advance, atau Pro yang tersedia.",
      },
    };
  }

  if (!TENANT_NAME_PATTERN.test(name)) {
    return {
      success: false,
      message: "Format nama klinik tidak valid.",
      fieldErrors: {
        name: "Gunakan huruf kecil dan angka saja, tanpa spasi atau karakter spesial.",
      },
    };
  }

  if (!TENANT_USERNAME_PATTERN.test(username)) {
    if (!TENANT_USERNAME_NO_SPACE_PATTERN.test(username)) {
      return {
        success: false,
        message: "Username tidak boleh mengandung spasi.",
        fieldErrors: {
          username: "Gunakan username tanpa spasi.",
        },
      };
    }

    return {
      success: false,
      message: "Format username tidak valid.",
      fieldErrors: {
        username: "Gunakan huruf, angka, titik, strip, atau underscore.",
      },
    };
  }

  const pricingSelection = await resolveTenantPricingSelection(subscriptionPricingPlanId);

  if (!pricingSelection) {
    return {
      success: false,
      message: "Pilihan paket langganan tidak ditemukan.",
      fieldErrors: {
        subscriptionPricingPlanId: "Pilih paket langganan yang tersedia lalu coba lagi.",
      },
    };
  }

  return {
    success: true,
    payload: {
      name,
      username,
      pricing_id: pricingSelection.pricing_id,
      pricing: pricingSelection.pricing,
      subscription_pricing_plan_id: subscriptionPricingPlanId,
    },
  };
}
