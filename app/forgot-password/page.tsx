import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getLandlordAccessToken } from "../../lib/landlord/auth-session";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Lupa Password",
  description:
    "Halaman untuk meminta panduan penggantian password akun Anda.",
  alternates: {
    canonical: "/forgot-password",
  },
};

const forgotPasswordBenefits = [
  "Cukup masukkan email akun Anda",
  "Panduan penggantian password akan dikirim jika email terdaftar",
  "Anda bisa kembali masuk setelah password diperbarui",
];

export default async function ForgotPasswordPage() {
  const accessToken = await getLandlordAccessToken();

  if (accessToken) {
    redirect("/dashboard");
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-copy">
          <span className="eyebrow">Lupa Password</span>
          <h1>Atur ulang akses akun Anda.</h1>
          <p>
            Masukkan email yang Anda gunakan saat mendaftar. Jika email tersebut
            terdaftar, kami akan menampilkan panduan untuk mengganti password.
          </p>

          <ul className="auth-benefits">
            {forgotPasswordBenefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </div>

        <ForgotPasswordForm />

        <div className="auth-footer">
          <p className="auth-helper">
            Sudah ingat password? <Link href="/login">Kembali ke login</Link>
          </p>
          <p className="auth-helper">
            Belum punya akun? <Link href="/signup">Buat akun sekarang</Link>
          </p>
          <Link href="/">Kembali ke halaman utama</Link>
        </div>
      </section>
    </main>
  );
}
