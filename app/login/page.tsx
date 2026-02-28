import type { Metadata } from "next";
import Link from "next/link";

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
    <main className="login-shell">
      <section className="login-card">
        <span className="eyebrow">Login Klinik</span>
        <h1>Masuk ke akun Anda.</h1>
        <p>
          Gunakan akun yang sudah terdaftar untuk masuk ke dashboard, lalu
          kelola tenant klinik dan operasional harian Anda.
        </p>

        {isRegistered ? (
          <p className="auth-message auth-message-success">
            Akun berhasil dibuat. Silakan login untuk melanjutkan.
          </p>
        ) : null}

        <form className="login-form">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="nama@klinikanda.com" />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="••••••••" />

          <button type="submit">Masuk</button>
        </form>

        <p className="auth-helper">
          Belum punya akun? <Link href="/signup">Buat akun sekarang</Link>
        </p>
        <p className="auth-helper">
          Ingin lihat area user? <Link href="/dashboard">Buka dashboard contoh</Link>
        </p>
        <Link href="/">Kembali ke halaman utama</Link>
      </section>
    </main>
  );
}
