import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getLandlordAccessToken } from "../../lib/landlord/auth-session";
import { ResendVerificationForm } from "./resend-verification-form";

export const metadata: Metadata = {
  title: "Kirim Ulang Verifikasi Email",
  description:
    "Halaman untuk meminta link verifikasi email baru jika Anda belum menerimanya.",
  alternates: {
    canonical: "/resend-verification",
  },
};

type ResendVerificationPageProps = {
  searchParams?: Promise<{
    email?: string;
  }>;
};

const resendVerificationBenefits = [
  "Cukup masukkan email akun Anda",
  "Kami akan mengirim link verifikasi terbaru jika email terdaftar",
  "Setelah email terverifikasi, Anda bisa langsung masuk",
];

export default async function ResendVerificationPage({
  searchParams,
}: ResendVerificationPageProps) {
  const accessToken = await getLandlordAccessToken();

  if (accessToken) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const defaultEmail = params?.email?.trim() ?? "";

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-copy">
          <span className="eyebrow">Kirim Ulang Verifikasi</span>
          <h1>Minta link verifikasi email baru.</h1>
          <p>
            Jika Anda belum menerima email verifikasi atau link sebelumnya sudah
            tidak aktif, masukkan email akun Anda di bawah ini.
          </p>

          <ul className="auth-benefits">
            {resendVerificationBenefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </div>

        <ResendVerificationForm defaultEmail={defaultEmail} />

        <div className="auth-footer">
          <p className="auth-helper">
            Sudah menerima email? <Link href="/login">Kembali ke login</Link>
          </p>
          <p className="auth-helper">
            Lupa password? <Link href="/forgot-password">Atur ulang di sini</Link>
          </p>
          <Link href="/">Kembali ke halaman utama</Link>
        </div>
      </section>
    </main>
  );
}
