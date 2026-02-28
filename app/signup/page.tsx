import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Buat Akun",
  description:
    "Buat akun untuk mulai menggunakan Klinik RME. Tenant klinik dapat dibuat setelah Anda masuk ke dashboard.",
  alternates: {
    canonical: "/signup",
  },
};

const signupBenefits = [
  "Pendaftaran akun cepat dan sederhana",
  "Tenant klinik bisa dibuat setelah login",
  "Satu akun untuk mulai mengatur operasional klinik Anda",
];

export default function SignupPage() {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-copy">
          <span className="eyebrow">Buat Akun</span>
          <h1>Buat akun Anda dan mulai gunakan Klinik RME.</h1>
          <p>
            Cukup daftar dengan email dan password. Setelah berhasil masuk,
            Anda bisa membuat tenant klinik sendiri dari dalam dashboard.
          </p>

          <ul className="auth-benefits">
            {signupBenefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </div>

        <SignupForm />

        <div className="auth-footer">
          <p className="auth-helper">
            Sudah punya akun? <Link href="/login">Masuk di sini</Link>
          </p>
          <p className="auth-helper">
            Sudah penasaran dengan area user?{" "}
            <Link href="/dashboard">Lihat dashboard tenant</Link>
          </p>
          <Link href="/">Kembali ke halaman utama</Link>
        </div>
      </section>
    </main>
  );
}
