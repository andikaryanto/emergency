export const pricingDescriptions: Record<"Basic" | "Advance" | "Pro", string> = {
  Basic: "Cocok untuk mulai digitalisasi operasional.",
  Advance: "Untuk fitur analitik dan operasional lanjutan.",
  Pro: "Semua fitur Advance plus integrasi Satu Sehat.",
};

export function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function billingCycleLabel(billingCycle: "monthly" | "yearly") {
  return billingCycle === "monthly" ? "Bulanan" : "Tahunan";
}
