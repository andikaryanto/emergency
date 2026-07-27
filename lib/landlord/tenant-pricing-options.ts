import { type SubscriptionPricing } from "./list-subscription-pricings";

export const fallbackTenantPricings: SubscriptionPricing[] = [
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

export function mapTenantPricingOptions(pricings: SubscriptionPricing[]) {
  const items = pricings
    .filter((pricing) => pricing.isActive)
    .map((pricing) => ({
      ...pricing,
      subscription_pricing_plans: pricing.subscription_pricing_plans.filter(
        (plan) => plan.isActive,
      ),
    }))
    .filter((pricing) => pricing.subscription_pricing_plans.length > 0);

  return items.length > 0 ? items : fallbackTenantPricings;
}
