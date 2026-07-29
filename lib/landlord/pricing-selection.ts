import { listSubscriptionPricings, type SubscriptionPricing } from "./list-subscription-pricings";

export const fallbackPricings: SubscriptionPricing[] = [
  {
    id: 1,
    code: "Basic",
    name: "Basic",
    description: "Basic Plan",
    isActive: true,
    subscription_pricing_plans: [
      {
        id: 1,
        code: "MO1",
        name: "Bulan",
        description: "Bulan",
        amount: 199000,
        billingCycle: "monthly",
        isActive: true,
      },
      {
        id: 2,
        code: "YE1",
        name: "Tahun",
        description: "Tahun",
        amount: 2299000,
        billingCycle: "yearly",
        isActive: true,
      },
    ],
  },
  {
    id: 2,
    code: "Advance",
    name: "Advance",
    description: "Advance Plan",
    isActive: true,
    subscription_pricing_plans: [
      {
        id: 3,
        code: "MO2",
        name: "Bulan",
        description: "Bulan",
        amount: 249000,
        billingCycle: "monthly",
        isActive: true,
      },
      {
        id: 4,
        code: "YE2",
        name: "Tahun",
        description: "Tahun",
        amount: 2899000,
        billingCycle: "yearly",
        isActive: true,
      },
    ],
  },
  {
    id: 3,
    code: "Pro",
    name: "Pro",
    description: "Pro Plan",
    isActive: true,
    subscription_pricing_plans: [
      {
        id: 5,
        code: "MO3",
        name: "Bulan",
        description: "Bulan",
        amount: 299000,
        billingCycle: "monthly",
        isActive: true,
      },
      {
        id: 6,
        code: "YE3",
        name: "Tahun",
        description: "Tahun",
        amount: 3499000,
        billingCycle: "yearly",
        isActive: true,
      },
    ],
  },
];

export function filterActivePricings(pricings: SubscriptionPricing[]) {
  const items = pricings
    .filter((pricing) => pricing.isActive)
    .map((pricing) => ({
      ...pricing,
      subscription_pricing_plans: pricing.subscription_pricing_plans.filter(
        (plan) => plan.isActive,
      ),
    }))
    .filter((pricing) => pricing.subscription_pricing_plans.length > 0);

  return items.length > 0 ? items : fallbackPricings;
}

export async function listActiveSignupPricings() {
  const pricings = await listSubscriptionPricings();

  return filterActivePricings(pricings);
}

export async function resolvePricingSelection(subscriptionPricingPlanId: number) {
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
