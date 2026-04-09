import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { env } from "../../lib/env";
import {
  getGoogleAuthFeedbackMessage,
  getGoogleAuthFeedbackTone,
} from "../../lib/landlord/google-auth";
import { getLandlordAccessToken } from "../../lib/landlord/auth-session";
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
    email?: string;
    google?: string;
    message?: string;
    registered?: string;
    reset?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const accessToken = await getLandlordAccessToken();

  if (accessToken) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const isRegistered = params?.registered === "1";
  const isReset = params?.reset === "1";
  const googleFeedbackMessage = getGoogleAuthFeedbackMessage({
    google: params?.google,
    email: params?.email,
    message: params?.message,
  });
  const googleFeedbackTone = getGoogleAuthFeedbackTone({
    google: params?.google,
    email: params?.email,
    message: params?.message,
  });

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

        {isReset ? (
          <p className="auth-message auth-message-success">
            Password berhasil diperbarui. Silakan login dengan password baru Anda.
          </p>
        ) : null}

        {googleFeedbackMessage ? (
          <p
            className={`auth-message ${
              googleFeedbackTone === "success"
                ? "auth-message-success"
                : "auth-message-error"
            }`}
          >
            {googleFeedbackMessage}
          </p>
        ) : null}

        <LoginForm
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
            Belum dapat email verifikasi?{" "}
            <Link href="/resend-verification">Kirim ulang di sini</Link>
          </p>
          <p className="auth-helper">
            Lupa password? <Link href="/forgot-password">Atur ulang di sini</Link>
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
