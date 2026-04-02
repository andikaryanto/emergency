import { ApiError, apiEndpointUrls, requestJson } from "../api";

type SubscriptionPricingPlanApiResource = {
  id?: unknown;
  code?: unknown;
  name?: unknown;
  description?: unknown;
  amount?: unknown;
  billing_cycle?: unknown;
  is_active?: unknown;
};

type SubscriptionPricingApiResource = {
  id?: unknown;
  code?: unknown;
  name?: unknown;
  description?: unknown;
  is_active?: unknown;
  subscription_pricing_plans?: unknown;
};

type ListSubscriptionPricingsApiResponse = {
  data?: {
    _resources?: unknown;
  };
};

export type SubscriptionPricingPlan = {
  id: number;
  code: string;
  name: string;
  description: string;
  amount: number;
  billingCycle: "monthly" | "yearly";
  isActive: boolean;
};

export type SubscriptionPricing = {
  id: number;
  code: string;
  name: "Basic" | "Advance" | "Pro";
  description: string;
  isActive: boolean;
  subscription_pricing_plans: SubscriptionPricingPlan[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizePlan(resource: SubscriptionPricingPlanApiResource): SubscriptionPricingPlan | null {
  const id = typeof resource.id === "number" ? resource.id : Number(resource.id);
  const code = typeof resource.code === "string" ? resource.code.trim() : "";
  const name = typeof resource.name === "string" ? resource.name.trim() : "";
  const description =
    typeof resource.description === "string" ? resource.description.trim() : "";
  const amount =
    typeof resource.amount === "number" ? resource.amount : Number(resource.amount);
  const billingCycle =
    resource.billing_cycle === "monthly" || resource.billing_cycle === "yearly"
      ? resource.billing_cycle
      : null;
  const isActive = resource.is_active === true;

  if (!Number.isFinite(id) || !code || !name || !Number.isFinite(amount) || !billingCycle) {
    return null;
  }

  return {
    id,
    code,
    name,
    description,
    amount,
    billingCycle,
    isActive,
  };
}

function normalizePricing(resource: SubscriptionPricingApiResource): SubscriptionPricing | null {
  const id = typeof resource.id === "number" ? resource.id : Number(resource.id);
  const code = typeof resource.code === "string" ? resource.code.trim() : "";
  const name = typeof resource.name === "string" ? resource.name.trim() : "";
  const description =
    typeof resource.description === "string" ? resource.description.trim() : "";
  const isActive = resource.is_active === true;
  const normalizedName =
    name === "Basic" || name === "Advance" || name === "Pro" ? name : null;
  const subscriptionPricingPlans = Array.isArray(resource.subscription_pricing_plans)
    ? resource.subscription_pricing_plans
        .filter(isRecord)
        .map((plan) => normalizePlan(plan))
        .filter((plan): plan is SubscriptionPricingPlan => plan !== null)
    : [];

  if (!Number.isFinite(id) || !code || !normalizedName) {
    return null;
  }

  return {
    id,
    code,
    name: normalizedName,
    description,
    isActive,
    subscription_pricing_plans: subscriptionPricingPlans,
  };
}

export async function listSubscriptionPricings() {
  try {
    const response = await requestJson<ListSubscriptionPricingsApiResponse, undefined>({
      url: apiEndpointUrls.landlord.subscriptionPricings,
      method: "GET",
    });

    const resources = response.data?._resources;

    if (!Array.isArray(resources)) {
      throw new ApiError({
        message: "Format data pricing tidak valid.",
        code: "INVALID_RESPONSE",
        payload: response,
      });
    }

    return resources
      .filter(isRecord)
      .map((resource) => normalizePricing(resource))
      .filter((pricing): pricing is SubscriptionPricing => pricing !== null);
  } catch (error) {
    if (error instanceof ApiError) {
      console.error("[pricing] gagal memuat subscription pricings", {
        code: error.code,
        status: error.status,
        message: error.message,
      });
    } else {
      console.error("[pricing] gagal memuat subscription pricings", error);
    }

    return [];
  }
}
