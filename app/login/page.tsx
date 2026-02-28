import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login Klinik",
  description:
    "Halaman login untuk masuk ke akun Anda dan melanjutkan pengelolaan tenant klinik.",
  alternates: {
    canonical: "/login",
  },
};

type LoginPageProps = {
  searchParams?: Promise<{
    registered?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const isRegistered = params?.registered === "1";

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-copy">
          <span className="eyebrow">Login Klinik</span>
          <h1>Masuk ke akun Anda.</h1>
          <p>
            Gunakan akun yang sudah terdaftar untuk masuk ke dashboard, lalu
            kelola tenant klinik dan operasional harian Anda.
          </p>
        </div>

        {isRegistered ? (
          <p className="auth-message auth-message-success">
            Akun berhasil dibuat. Silakan login untuk melanjutkan.
          </p>
        ) : null}

        <LoginForm />

        <div className="auth-footer">
          <p className="auth-helper">
            Belum punya akun? <Link href="/signup">Buat akun sekarang</Link>
          </p>
          <p className="auth-helper">
            Ingin lihat area user? <Link href="/dashboard">Buka dashboard contoh</Link>
          </p>
          <Link href="/">Kembali ke halaman utama</Link>
        </div>
      </section>
    </main>
  );
}
