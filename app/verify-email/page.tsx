import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getLandlordAccessToken } from "../../lib/landlord/auth-session";
import { VerifyEmailError, verifyEmail } from "../../lib/landlord/verify-email";

export const metadata: Metadata = {
  title: "Verifikasi Email",
  description:
    "Halaman untuk memverifikasi email akun Anda sebelum mulai menggunakan layanan.",
  alternates: {
    canonical: "/verify-email",
  },
};

type VerifyEmailPageProps = {
  searchParams?: Promise<{
    email?: string;
    token?: string;
  }>;
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const accessToken = await getLandlordAccessToken();

  if (accessToken) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const email = params?.email?.trim() ?? "";
  const token = params?.token?.trim() ?? "";

  let isVerified = false;
  let message = "Link verifikasi email tidak valid atau sudah tidak berlaku.";

  if (email && token) {
    try {
      await verifyEmail({ email, token });
      isVerified = true;
      message =
        "Email Anda berhasil diverifikasi. Sekarang Anda bisa masuk dan mulai menyiapkan klinik Anda.";
    } catch (error) {
      message =
        error instanceof VerifyEmailError
          ? error.message
          : "Verifikasi email tidak dapat diproses saat ini.";
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-copy">
          <span className="eyebrow">Verifikasi Email</span>
          <h1>{isVerified ? "Email berhasil diverifikasi." : "Verifikasi belum berhasil."}</h1>
          <p>
            {isVerified
              ? "Akun Anda sudah siap dipakai untuk melanjutkan proses masuk dan mulai menggunakan layanan."
              : "Silakan gunakan link verifikasi terbaru dari email Anda bila link yang dibuka sudah tidak aktif."}
          </p>
        </div>

        <p
          className={`auth-message ${
            isVerified ? "auth-message-success" : "auth-message-error"
          }`}
          role={isVerified ? "status" : "alert"}
        >
          {message}
        </p>

        <div className="auth-footer">
          {isVerified ? (
            <p className="auth-helper">
              Lanjut masuk? <Link href="/login">Login ke akun Anda</Link>
            </p>
          ) : (
            <p className="auth-helper">
              Butuh link baru?{" "}
              <Link href={`/resend-verification?email=${encodeURIComponent(email)}`}>
                Kirim ulang verifikasi
              </Link>
            </p>
          )}
          <p className="auth-helper">
            Belum punya akun? <Link href="/signup">Buat akun sekarang</Link>
          </p>
          <Link href="/">Kembali ke halaman utama</Link>
        </div>
      </section>
    </main>
  );
}
