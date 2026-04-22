import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { env } from "../../lib/env";
import { getGoogleAuthFeedbackMessage } from "../../lib/landlord/google-auth";
import { getLandlordAccessToken } from "../../lib/landlord/auth-session";
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

export default async function SignupPage() {
  const accessToken = await getLandlordAccessToken();

  if (accessToken) {
    redirect("/dashboard");
  }

  const googleSignupHint = getGoogleAuthFeedbackMessage({
    google: "auto_registered",
  });

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

          {env.googleAuth.enabled && googleSignupHint ? (
            <p className="field-hint field-hint-neutral">{googleSignupHint}</p>
          ) : null}

          <ul className="auth-benefits">
            {signupBenefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </div>

        <SignupForm
          googleSignIn={{
            enabled: env.googleAuth.enabled,
            clientId: env.googleAuth.clientId,
          }}
        />

        {env.googleAuth.enabled && !env.googleAuth.clientId ? (
          <p className="field-hint field-hint-neutral">
            Google Sign-In sudah diaktifkan, tetapi Google Client ID belum diisi.
          </p>
        ) : null}

        <div className="auth-footer">
          <p className="auth-helper">
            Sudah punya akun? <Link href="/login">Masuk di sini</Link>
          </p>
          <p className="auth-helper">
            Sudah penasaran dengan area user?{" "}
            <Link href="/dashboard">Lihat dashboard tenant</Link>
          </p>
          <p className="auth-helper">
            Dengan membuat akun, Anda menyetujui{" "}
            <Link href="/terms">Syarat dan Ketentuan</Link>
          </p>
          <Link href="/">Kembali ke halaman utama</Link>
        </div>
      </section>
    </main>
  );
}
