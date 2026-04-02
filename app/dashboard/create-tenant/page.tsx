import type { Metadata } from "next";
import Link from "next/link";
import {
  listSubscriptionPricings,
  type SubscriptionPricing,
} from "../../../lib/landlord/list-subscription-pricings";
import { CreateTenantForm } from "./create-tenant-form";

export const metadata: Metadata = {
  title: "Buat Klinik Baru",
  description:
    "Form untuk menyiapkan klinik baru beserta akun admin pertama.",
  alternates: {
    canonical: "/dashboard/create-tenant",
  },
};

const createTenantBenefits = [
  "Menyiapkan ruang kerja baru untuk klinik Anda",
  "Sekaligus membuat akun utama yang bisa langsung digunakan",
  "Setelah selesai, klinik baru akan muncul di dashboard Anda",
];

const fallbackPricings: SubscriptionPricing[] = [
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

function mapCreateTenantPricings(pricings: SubscriptionPricing[]) {
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

export default async function CreateTenantPage() {
  const subscriptionPricings = await listSubscriptionPricings();
  const pricings = mapCreateTenantPricings(subscriptionPricings);

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-copy">
          <span className="eyebrow">Buat Klinik Baru</span>
          <h1>Siapkan akses untuk klinik atau cabang berikutnya.</h1>
          <p>
            Isi nama klinik serta akun utama yang akan dipakai untuk login
            pertama kali. Setelah itu, kami akan menyiapkan klinik baru Anda.
          </p>

          <ul className="auth-benefits">
            {createTenantBenefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </div>

        <CreateTenantForm pricings={pricings} />

        <p className="auth-helper">
          Klinik baru Anda biasanya siap digunakan dalam sekitar 5 - 10 menit
          setelah data dikirim.
        </p>

        <div className="auth-footer">
          <p className="auth-helper">
            Sudah selesai? <Link href="/dashboard">Kembali ke dashboard</Link>
          </p>
          <Link href="/">Kembali ke halaman utama</Link>
        </div>
      </section>
    </main>
  );
}
