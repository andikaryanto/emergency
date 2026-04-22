import type { Metadata } from "next";
import Link from "next/link";
import {
  getLandlordAuthorizationHeader,
  getLandlordAuthUser,
} from "../../../lib/landlord/auth-session";
import {
  ListPaymentProfilesError,
  type ListPaymentProfilesResponse,
  listPaymentProfiles,
} from "../../../lib/landlord/list-payment-profiles";
import { PaymentProfileCard } from "./payment-profile-card";
import { PaymentProfileForm } from "./payment-profile-form";

export const metadata: Metadata = {
  title: "Profil Pembayaran",
  description:
    "Halaman untuk melihat payment profile yang akan dipakai sebagai default saat konfirmasi pembayaran.",
  alternates: {
    canonical: "/dashboard/payment-profile",
  },
};

export default async function PaymentProfilePage() {
  const [currentUser, authorizationHeader] = await Promise.all([
    getLandlordAuthUser(),
    getLandlordAuthorizationHeader(),
  ]);
  let paymentProfileErrorMessage: string | null = null;
  let paymentProfileData: ListPaymentProfilesResponse = {
    paymentProfiles: [],
    paging: {
      page: 1,
      limit: 10,
      totalData: 0,
      isLastPage: true,
    },
  };

  try {
    paymentProfileData = await listPaymentProfiles(authorizationHeader);
  } catch (error) {
    paymentProfileErrorMessage =
      error instanceof ListPaymentProfilesError
        ? error.message
        : "Payment profile tidak dapat dimuat saat ini.";
  }

  const currentProfile = paymentProfileData.paymentProfiles[0] ?? null;
  const defaultProfile =
    paymentProfileData.paymentProfiles.find((profile) => profile.isDefault) ?? currentProfile;

  return (
    <main className="dashboard-shell">
      <section className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="dashboard-brand">
            <span className="brand-logo">+</span>
            <div>
              <p>Klinik RME</p>
              <span>Area Pengguna</span>
            </div>
          </div>

          <nav className="dashboard-nav" aria-label="Navigasi payment profile">
            <Link className="dashboard-link" href="/dashboard">
              Dashboard
            </Link>
            <Link className="dashboard-link" href="/dashboard/profile">
              Profil User
            </Link>
            <Link className="dashboard-link active" href="/dashboard/payment-profile">
              Profil Pembayaran
            </Link>
          </nav>

          <div className="dashboard-note">
            <span className="card-label">Default pembayaran</span>
            <strong>{currentUser?.name ?? "Pengguna"}</strong>
            <p>
              Simpan payment profile utama Anda di sini agar nanti bisa dipakai
              sebagai profil default saat konfirmasi pembayaran invoice tenant.
            </p>
          </div>
        </aside>

        <section className="dashboard-main">
          <header className="dashboard-header">
            <div>
              <span className="eyebrow">Profil Pembayaran</span>
              <h1>Profil pembayaran default Anda.</h1>
              <p>
                Halaman ini menampilkan profil pembayaran yang terhubung ke akun
                Anda untuk dipakai sebagai referensi utama saat konfirmasi pembayaran.
              </p>
            </div>

            <div className="dashboard-header-actions">
              <Link href="/dashboard" className="ghost-button">
                Kembali ke dashboard
              </Link>
            </div>
          </header>

          <section className="dashboard-overview" aria-label="Ringkasan payment profile">
            <article className="dashboard-stat">
              <span>Total profile</span>
              <strong>{paymentProfileData.paymentProfiles.length}</strong>
            </article>
            <article className="dashboard-stat">
              <span>Profile utama</span>
              <strong>{defaultProfile?.displayName ?? "Belum ada"}</strong>
            </article>
            <article className="dashboard-stat">
              <span>Status</span>
              <strong>
                {defaultProfile ? (defaultProfile.isActive ? "Aktif" : "Tidak aktif") : "-"}
              </strong>
            </article>
          </section>

          <section className="create-tenant-panel payment-profile-form-panel">
            <div>
              <span className="eyebrow">Atur Profil</span>
              <h2>Tambahkan payment profile default.</h2>
              <p>
                Simpan profil pembayaran utama Anda di sini agar proses konfirmasi
                pembayaran invoice tenant jadi lebih cepat dan rapi.
              </p>
            </div>

            <div className="payment-profile-form-wrap">
              <PaymentProfileForm />
            </div>
          </section>

          {paymentProfileErrorMessage ? (
            <section className="dashboard-feedback">{paymentProfileErrorMessage}</section>
          ) : paymentProfileData.paymentProfiles.length === 0 ? (
            <section className="dashboard-feedback">
              Belum ada payment profile pada akun ini.
            </section>
          ) : (
            <section className="tenant-section" aria-labelledby="payment-profile-list">
              <div className="tenant-section-head">
                <div>
                  <span className="eyebrow">Profil</span>
                  <h2 id="payment-profile-list">Profil pembayaran akun Anda</h2>
                  <p>
                    Profile ini akan menjadi referensi default ketika Anda melanjutkan
                    proses konfirmasi pembayaran invoice tenant.
                  </p>
                </div>
              </div>

              <div className="tenant-list">
                {paymentProfileData.paymentProfiles.map((profile) => (
                  <PaymentProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            </section>
          )}
        </section>
      </section>
    </main>
  );
}
