import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login Tenant",
  description:
    "Halaman login tenant untuk masuk ke dashboard SaaS klinik berdasarkan tenant dan subdomain masing-masing.",
  alternates: {
    canonical: "/login",
  },
};

export default function LoginPage() {
  return (
    <main className="login-shell">
      <section className="login-card">
        <span className="eyebrow">Login Tenant</span>
        <h1>Masuk ke dashboard klinik Anda.</h1>
        <p>
          Halaman ini adalah placeholder awal untuk login utama. Nanti bisa
          dihubungkan ke form tenant, email, atau pencarian subdomain klinik.
        </p>

        <form className="login-form">
          <label htmlFor="tenant">Tenant atau subdomain</label>
          <input id="tenant" type="text" placeholder="contoh: klinik-sehat" />

          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="admin@klinik.com" />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="••••••••" />

          <button type="submit">Masuk</button>
        </form>

        <Link href="/">Kembali ke landing page</Link>
      </section>
    </main>
  );
}
