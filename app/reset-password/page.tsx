import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getLandlordAccessToken } from "../../lib/landlord/auth-session";
import {
  ValidateResetTokenError,
  validateResetToken,
} from "../../lib/landlord/reset-password";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Halaman untuk memeriksa link reset password sebelum melanjutkan penggantian password.",
  alternates: {
    canonical: "/reset-password",
  },
};

type ResetPasswordPageProps = {
  searchParams?: Promise<{
    email?: string;
    token?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const accessToken = await getLandlordAccessToken();

  if (accessToken) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const email = params?.email?.trim() ?? "";
  const token = params?.token?.trim() ?? "";

  let isValidLink = false;
  let validationMessage =
    "Link penggantian password tidak valid atau sudah tidak berlaku.";

  if (email && token) {
    try {
      await validateResetToken({ email, token });
      isValidLink = true;
      validationMessage =
        "Link Anda sudah berhasil diverifikasi. Anda bisa melanjutkan ke tahap penggantian password.";
    } catch (error) {
      validationMessage =
        error instanceof ValidateResetTokenError
          ? error.message
          : "Link penggantian password tidak dapat diperiksa saat ini.";
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-copy">
          <span className="eyebrow">Reset Password</span>
          <h1>{isValidLink ? "Link berhasil diverifikasi." : "Link tidak dapat digunakan."}</h1>
          <p>
            {isValidLink
              ? "Kami sudah memeriksa email dan kode keamanan pada link Anda."
              : "Silakan minta link baru jika link yang Anda buka sudah kedaluwarsa atau tidak lengkap."}
          </p>
        </div>

        <p
          className={`auth-message ${
            isValidLink ? "auth-message-success" : "auth-message-error"
          }`}
          role={isValidLink ? "status" : "alert"}
        >
          {validationMessage}
        </p>

        {isValidLink ? <ResetPasswordForm email={email} token={token} /> : null}

        <div className="auth-footer">
          {isValidLink ? (
            <p className="auth-helper">
              Perlu link baru? <Link href="/forgot-password">Minta ulang di sini</Link>
            </p>
          ) : (
            <p className="auth-helper">
              Minta link baru? <Link href="/forgot-password">Atur ulang password lagi</Link>
            </p>
          )}
          <p className="auth-helper">
            Sudah ingat password? <Link href="/login">Kembali ke login</Link>
          </p>
          <Link href="/">Kembali ke halaman utama</Link>
        </div>
      </section>
    </main>
  );
}
