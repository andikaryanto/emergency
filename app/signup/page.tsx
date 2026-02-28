import type { Metadata } from "next";
import Link from "next/link";

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

        <form className="auth-form">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="nama@klinikanda.com" />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="Minimal 8 karakter" />

          <label htmlFor="confirm-password">Konfirmasi password</label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Ulangi password Anda"
          />

          <button type="submit">Buat Akun</button>
        </form>

        <div className="auth-footer">
          <p className="auth-helper">
            Sudah punya akun? <Link href="/login">Masuk di sini</Link>
          </p>
          <Link href="/">Kembali ke halaman utama</Link>
        </div>
      </section>
    </main>
  );
}
