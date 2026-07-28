import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { env } from "../../lib/env";
import { getGoogleAuthFeedbackMessage } from "../../lib/landlord/google-auth";
import { getLandlordAccessToken } from "../../lib/landlord/auth-session";
import { listActiveSignupPricings } from "../../lib/landlord/pricing-selection";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Buat Akun",
  description:
    "Buat akun sekaligus klinik Anda untuk mulai menggunakan Klinik RME.",
  alternates: {
    canonical: "/signup",
  },
};

const signupBenefits = [
  "Pendaftaran akun dan klinik dalam satu langkah",
  "Daftar dengan email atau akun Google",
  "Langsung siap dipakai setelah proses selesai",
];

export default async function SignupPage() {
  const accessToken = await getLandlordAccessToken();

  if (accessToken) {
    redirect("/dashboard");
  }

  const pricings = await listActiveSignupPricings();

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
            Isi data klinik Anda, lalu pilih daftar dengan email atau akun
            Google. Klinik Anda akan langsung disiapkan bersamaan dengan akun.
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
          pricings={pricings}
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
