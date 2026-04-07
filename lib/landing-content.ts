import type { SubscriptionPricing } from "./landlord/list-subscription-pricings";

export const productHighlights = [
  {
    title: "Aplikasi Klinik Online, RME, dan Sistem Manajemen Klinik",
    description:
      "Setiap klinik mendapatkan alamat login sendiri agar operasional lebih rapi, aman, dan mudah diakses oleh tim.",
  },
  {
    title: "Pelayanan sampai pembayaran",
    description:
      "Atur pendaftaran pasien, jadwal dokter, antrean, transaksi, dan riwayat layanan dalam satu sistem yang mudah dipakai.",
  },
  {
    title: "Laporan selalu terpantau",
    description:
      "Pantau jumlah kunjungan pasien, performa layanan, dan pendapatan harian langsung dari dashboard.",
  },
];

export const features = [
  "Setiap klinik punya alamat login sendiri",
  "Pendaftaran pasien dan antrean digital",
  "Jadwal dokter dan layanan terintegrasi",
  "Kasir, invoice, dan laporan operasional",
];

export const pricingContent = {
  Basic: {
    description: "Pilihan hemat untuk klinik yang ingin mulai digitalisasi operasional harian.",
    items: [
      "1 alamat login klinik",
      "Manajemen pasien dan antrean",
      "Kasir dan invoice",
      "Laporan operasional dasar",
      "Bantuan via email",
    ],
    accent: "light",
  },
  Advance: {
    description:
      "Paket unggulan untuk klinik yang butuh operasional lengkap, analitik, dan kontrol bisnis lebih kuat.",
    items: [
      "Akses untuk banyak staf",
      "Dashboard laporan harian lengkap",
      "Pengaturan dokter dan layanan",
      "Modul laboratorium",
      "Analisis time visit rate pasien",
      "Perhitungan insentif praktisioner",
      "Rekap billing dalam format Excel",
      "Rekap jumlah kunjungan pasien (Excel)",
      "Bantuan prioritas",
    ],
    accent: "light",
  },
  Pro: {
    description:
      "Paket lengkap untuk klinik yang butuh semua fitur Advance ditambah integrasi layanan kesehatan nasional.",
    items: [
      "Akses untuk banyak staf",
      "Dashboard laporan harian lengkap",
      "Pengaturan dokter dan layanan",
      "Modul laboratorium",
      "Analisis time visit rate pasien",
      "Perhitungan insentif praktisioner",
      "Rekap billing dalam format Excel",
      "Rekap jumlah kunjungan pasien (Excel)",
      "Integrasi Satu Sehat",
      "Bantuan prioritas",
    ],
    accent: "featured",
  },
} as const;

export type PricingName = keyof typeof pricingContent;

export const pricingFallback = [
  {
    name: "Basic" as const,
    monthlyAmount: 199000,
    yearlyAmount: 2299000,
    ...pricingContent.Basic,
  },
  {
    name: "Advance" as const,
    monthlyAmount: 249000,
    yearlyAmount: 2899000,
    ...pricingContent.Advance,
  },
  {
    name: "Pro" as const,
    monthlyAmount: 299000,
    yearlyAmount: 3499000,
    ...pricingContent.Pro,
  },
];

export const stats = [
  { value: "24/7", label: "akses cloud untuk operasional klinik" },
  { value: "< 5 mnt", label: "waktu aktif tenant baru" },
  { value: "1 panel", label: "untuk admin, kasir, dan dokter" },
];

export const faqs = [
  {
    question: "Apa itu Klinik RME?",
    answer:
      "Klinik RME adalah aplikasi klinik berbasis cloud untuk membantu klinik mengelola pendaftaran pasien, antrean, jadwal dokter, kasir, laporan, dan rekam medis elektronik dalam satu sistem.",
  },
  {
    question: "Siapa yang cocok menggunakan aplikasi ini?",
    answer:
      "Aplikasi ini cocok untuk klinik umum, klinik pratama, klinik dengan banyak staf, maupun klinik yang ingin merapikan operasional harian tanpa proses manual yang tersebar.",
  },
  {
    question: "Apakah setiap klinik mendapat akses login sendiri?",
    answer:
      "Ya. Setiap klinik mendapatkan alamat login sendiri agar akses untuk admin, kasir, dan dokter lebih rapi, aman, dan mudah dikelola.",
  },
  {
    question: "Fitur apa saja yang tersedia di software klinik ini?",
    answer:
      "Fitur utama mencakup pendaftaran pasien, antrean digital, jadwal dokter, kasir, invoice, laporan operasional, hingga paket tertentu yang mendukung integrasi Satu Sehat.",
  },
];

export function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function mapPricingForDisplay(pricings: SubscriptionPricing[]) {
  const items = pricings
    .filter((pricing) => pricing.isActive)
    .map((pricing) => {
      const monthlyPlan = pricing.subscription_pricing_plans.find(
        (plan) => plan.isActive && plan.billingCycle === "monthly",
      );
      const yearlyPlan = pricing.subscription_pricing_plans.find(
        (plan) => plan.isActive && plan.billingCycle === "yearly",
      );

      return {
        name: pricing.name,
        monthlyAmount: monthlyPlan?.amount ?? 0,
        yearlyAmount: yearlyPlan?.amount ?? 0,
        ...pricingContent[pricing.name],
      };
    })
    .filter((pricing) => pricing.monthlyAmount > 0 || pricing.yearlyAmount > 0);

  return items.length > 0 ? items : pricingFallback;
}
