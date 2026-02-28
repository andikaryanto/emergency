import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login Klinik",
  description:
    "Halaman login untuk admin, kasir, dan dokter agar bisa masuk ke sistem klinik dengan mudah.",
  alternates: {
    canonical: "/login",
  },
};

export default function LoginPage() {
  return (
    <main className="login-shell">
      <section className="login-card">
        <span className="eyebrow">Login Klinik</span>
        <h1>Masuk ke akun klinik Anda.</h1>
        <p>
          Gunakan akun yang sudah terdaftar untuk mengakses operasional klinik,
          mulai dari pendaftaran pasien sampai laporan harian.
        </p>

        <form className="login-form">
          <label htmlFor="tenant">Nama klinik atau alamat login</label>
          <input id="tenant" type="text" placeholder="contoh: klinik-sehat" />

          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="admin@klinik.com" />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="••••••••" />

          <button type="submit">Masuk</button>
        </form>

        <Link href="/">Kembali ke halaman utama</Link>
      </section>
    </main>
  );
}
