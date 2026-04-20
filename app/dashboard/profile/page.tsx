import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getLandlordAuthorizationHeader,
  getLandlordAuthUser,
} from "../../../lib/landlord/auth-session";
import {
  type LandlordUserProfile,
  getLandlordUserProfile,
  LandlordUserProfileError,
} from "../../../lib/landlord/user-profile";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = {
  title: "Profil User",
  description: "Halaman untuk melihat dan memperbarui informasi profil user Anda.",
  alternates: {
    canonical: "/dashboard/profile",
  },
};

export default async function ProfilePage() {
  const [currentUser, authorizationHeader] = await Promise.all([
    getLandlordAuthUser(),
    getLandlordAuthorizationHeader(),
  ]);

  if (!currentUser) {
    redirect("/login");
  }

  let profileErrorMessage: string | null = null;
  let profile: LandlordUserProfile | null = null;

  try {
    profile = await getLandlordUserProfile(currentUser.id, authorizationHeader);
  } catch (error) {
    profileErrorMessage =
      error instanceof LandlordUserProfileError
        ? error.message
        : "Profil user tidak dapat dimuat saat ini.";
  }

  const profileSummary = profile ?? {
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    phone: null,
    address: null,
    city: null,
    province: null,
    postalCode: null,
    isActive: currentUser.isActive,
    role: currentUser.role,
  };

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

          <nav className="dashboard-nav" aria-label="Navigasi profil user">
            <Link className="dashboard-link" href="/dashboard">
              Dashboard
            </Link>
            <Link className="dashboard-link active" href="/dashboard/profile">
              Profil User
            </Link>
            <Link className="dashboard-link" href="/dashboard/payment-profile">
              Profil Pembayaran
            </Link>
          </nav>

          <div className="dashboard-note">
            <span className="card-label">Informasi akun</span>
            <strong>{profileSummary.name ?? "Pengguna"}</strong>
            <p>
              Perbarui detail kontak dan alamat Anda di halaman ini agar data akun
              tetap rapi dan mudah dipakai pada proses operasional berikutnya.
            </p>
          </div>
        </aside>

        <section className="dashboard-main">
          <header className="dashboard-header">
            <div>
              <span className="eyebrow">Profil User</span>
              <h1>Perbarui informasi user Anda.</h1>
              <p>
                Kelola informasi kontak dan alamat utama akun Anda di satu tempat
                agar data tetap rapi dan mudah diperbarui kapan saja.
              </p>
            </div>

            <div className="dashboard-header-actions">
              <Link href="/dashboard" className="ghost-button">
                Kembali ke dashboard
              </Link>
            </div>
          </header>

          <section className="dashboard-overview" aria-label="Ringkasan profil user">
            <article className="dashboard-stat">
              <span>Status akun</span>
              <strong>{profileSummary.isActive ? "Aktif" : "Tidak aktif"}</strong>
            </article>
            <article className="dashboard-stat">
              <span>Role</span>
              <strong>{profileSummary.role ?? "User"}</strong>
            </article>
            <article className="dashboard-stat">
              <span>Kota saat ini</span>
              <strong>{profileSummary.city ?? "-"}</strong>
            </article>
          </section>

          <section className="create-tenant-panel profile-form-panel">
            <div>
              <span className="eyebrow">Edit Profil</span>
              <h2>Lengkapi kontak dan alamat user.</h2>
              <p>
                Perbarui nomor telepon, alamat, kota, provinsi, dan kode pos
                agar informasi akun Anda selalu terbaru.
              </p>
            </div>

            <div className="payment-profile-form-wrap">
              <ProfileForm
                userId={profileSummary.id}
                initialValues={{
                  name: profileSummary.name,
                  email: profileSummary.email,
                  phone: profileSummary.phone,
                  address: profileSummary.address,
                  city: profileSummary.city,
                  province: profileSummary.province,
                  postalCode: profileSummary.postalCode,
                }}
              />
            </div>
          </section>

          {profileErrorMessage ? (
            <section className="dashboard-feedback">{profileErrorMessage}</section>
          ) : null}
        </section>
      </section>
    </main>
  );
}
