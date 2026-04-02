"use client";

import { useState } from "react";
import { formatDateTime } from "../../../lib/format";
import { deletePaymentProfileAction } from "./actions";
import { PaymentProfileForm } from "./payment-profile-form";

type PaymentProfileCardProps = {
  profile: {
    id: number;
    displayName: string;
    paymentMethod: string | null;
    accountHolderName: string | null;
    accountNumber: string | null;
    bankName: string | null;
    userId: number | null;
    notes: string | null;
    isDefault: boolean;
    isActive: boolean;
    createdAt: string | null;
    updatedAt: string | null;
  };
};

function formatOptionalValue(value: string | null) {
  return value && value.trim().length > 0 ? value : "-";
}

export function PaymentProfileCard({ profile }: PaymentProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <article className="tenant-card">
      <div className="tenant-card-head">
        <div>
          <h3>{profile.displayName}</h3>
          <span className="admin-invoice-tenant">
            {formatOptionalValue(profile.paymentMethod)}
          </span>
        </div>

        <div className="tenant-status-group">
          {profile.isDefault ? <span className="tenant-status demo">Default</span> : null}
          <span className={`tenant-status ${profile.isActive ? "active" : "inactive"}`}>
            {profile.isActive ? "Aktif" : "Tidak aktif"}
          </span>
          <form
            action={deletePaymentProfileAction.bind(null, profile.id)}
            onSubmit={(event) => {
              const isConfirmed = window.confirm(
                `Hapus payment profile ${profile.displayName}? Tindakan ini tidak bisa dibatalkan.`,
              );

              if (!isConfirmed) {
                event.preventDefault();
              }
            }}
          >
            <button
              type="submit"
              className="ghost-button payment-profile-delete-button"
              aria-label="Hapus profile"
              title="Hapus profile"
            >
              Hapus
            </button>
          </form>
        </div>
      </div>

      <div className="tenant-meta payment-profile-meta">
        <div>
          <span>Nama akun</span>
          <strong>{formatOptionalValue(profile.accountHolderName)}</strong>
        </div>
        <div>
          <span>Nomor akun</span>
          <strong>{formatOptionalValue(profile.accountNumber)}</strong>
        </div>
        <div>
          <span>Bank</span>
          <strong>{formatOptionalValue(profile.bankName)}</strong>
        </div>
        <div>
          <span>Status default</span>
          <strong>{profile.isDefault ? "Ya" : "Tidak"}</strong>
        </div>
      </div>

      <div className="tenant-meta payment-profile-meta">
        <div>
          <span>User ID</span>
          <strong>{profile.userId ?? "-"}</strong>
        </div>
        <div>
          <span>Diperbarui</span>
          <strong>{formatDateTime(profile.updatedAt)}</strong>
        </div>
        <div>
          <span>Dibuat</span>
          <strong>{formatDateTime(profile.createdAt)}</strong>
        </div>
      </div>

      {profile.notes ? (
        <p className="tenant-inline-notice tenant-inline-notice-payment">{profile.notes}</p>
      ) : null}

      <div className="tenant-actions payment-profile-card-actions">
        {profile.isDefault ? (
          <span className="tenant-inline-notice tenant-invoice-created-at">
            Profile ini akan dipakai sebagai referensi default saat konfirmasi pembayaran
            invoice tenant.
          </span>
        ) : null}
        <button
          type="button"
          className="ghost-button payment-profile-toggle-button"
          onClick={() => setIsEditing((value) => !value)}
        >
          {isEditing ? "Tutup Edit" : "Edit Profile"}
        </button>
      </div>

      {isEditing ? (
        <div className="payment-profile-editor">
          <div className="tenant-section-head payment-profile-editor-head">
            <div>
              <span className="eyebrow">Edit Profil</span>
              <h3>Perbarui payment profile ini</h3>
            </div>
          </div>

          <PaymentProfileForm
            paymentProfileId={profile.id}
            initialValues={{
              paymentMethod: profile.paymentMethod,
              accountHolderName: profile.accountHolderName,
              bankName: profile.bankName,
              accountNumber: profile.accountNumber,
              notes: profile.notes,
              isDefault: profile.isDefault,
              isActive: profile.isActive,
            }}
            submitLabel="Perbarui Payment Profile"
            pendingLabel="Memperbarui..."
            onSuccess={() => setIsEditing(false)}
          />
        </div>
      ) : null}
    </article>
  );
}
