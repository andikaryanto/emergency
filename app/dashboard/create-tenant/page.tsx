import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getLandlordAccessToken } from "../../../lib/landlord/auth-session";
import { CreateTenantForm } from "./create-tenant-form";

export const metadata: Metadata = {
  title: "Buat Tenant",
  description:
    "Form untuk membuat tenant baru beserta akun admin tenant pertama.",
  alternates: {
    canonical: "/dashboard/create-tenant",
  },
};

const createTenantBenefits = [
  "Membuat tenant baru langsung dari akun landlord",
  "Sekaligus menyiapkan user admin tenant pertama",
  "Setelah berhasil, tenant akan muncul di dashboard Anda",
];

export default async function CreateTenantPage() {
  const accessToken = await getLandlordAccessToken();

  if (!accessToken) {
    redirect("/login");
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-copy">
          <span className="eyebrow">Buat Tenant</span>
          <h1>Siapkan tenant baru untuk klinik berikutnya.</h1>
          <p>
            Isi nama tenant serta akun admin pertama. Data ini akan dikirim ke API
            landlord menggunakan session login Anda.
          </p>

          <ul className="auth-benefits">
            {createTenantBenefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </div>

        <CreateTenantForm />

        <p className="auth-helper">
          Tenant akan dibuat dan dipersiapkan dalam sekitar 5 - 10 menit setelah
          data dikirim.
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
