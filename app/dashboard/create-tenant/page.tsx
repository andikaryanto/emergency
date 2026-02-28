import type { Metadata } from "next";
import Link from "next/link";
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

export default async function CreateTenantPage() {
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

        <CreateTenantForm />

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
