"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateUserProfileAction } from "./actions";
import { initialUserProfileActionState } from "./form-state";

type ProfileFormProps = {
  userId: number;
  initialValues?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    province?: string | null;
    postalCode?: string | null;
  };
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return <button type="submit" disabled={pending}>{pending ? "Menyimpan..." : "Simpan Profil"}</button>;
}

export function ProfileForm({ userId, initialValues }: ProfileFormProps) {
  const [state, formAction] = useActionState(
    updateUserProfileAction.bind(null, userId),
    initialUserProfileActionState,
  );

  return (
    <>
      {state.message ? (
        <p
          className={`auth-message ${
            state.status === "success" ? "auth-message-success" : "auth-message-error"
          }`}
          role={state.status === "success" ? "status" : "alert"}
        >
          {state.message}
        </p>
      ) : null}

      <form className="auth-form profile-form" action={formAction} noValidate>
        <label htmlFor="profile_name">Nama</label>
        <input
          id="profile_name"
          name="profile_name"
          type="text"
          value={initialValues?.name ?? ""}
          readOnly
          aria-disabled="true"
        />

        <label htmlFor="profile_email">Email</label>
        <input
          id="profile_email"
          name="profile_email"
          type="email"
          value={initialValues?.email ?? ""}
          readOnly
          aria-disabled="true"
        />

        <label htmlFor="phone">Nomor telepon</label>
        <input
          id="phone"
          name="phone"
          type="text"
          inputMode="tel"
          defaultValue={initialValues?.phone ?? ""}
          placeholder="Masukkan nomor telepon"
          aria-invalid={Boolean(state.fieldErrors.phone)}
          aria-describedby={state.fieldErrors.phone ? "phone-error" : "phone-hint"}
        />
        <p id="phone-hint" className="field-hint">
          Gunakan nomor aktif yang mudah dihubungi untuk kebutuhan operasional akun.
        </p>
        {state.fieldErrors.phone ? (
          <p id="phone-error" className="field-error">
            {state.fieldErrors.phone}
          </p>
        ) : null}

        <label htmlFor="address">Alamat</label>
        <textarea
          id="address"
          name="address"
          rows={4}
          defaultValue={initialValues?.address ?? ""}
          placeholder="Contoh: Sleman Sembada"
          aria-invalid={Boolean(state.fieldErrors.address)}
          aria-describedby={state.fieldErrors.address ? "address-error" : undefined}
        />
        {state.fieldErrors.address ? (
          <p id="address-error" className="field-error">
            {state.fieldErrors.address}
          </p>
        ) : null}

        <label htmlFor="city">Kota</label>
        <input
          id="city"
          name="city"
          type="text"
          defaultValue={initialValues?.city ?? ""}
          placeholder="Contoh: Klaten"
          aria-invalid={Boolean(state.fieldErrors.city)}
          aria-describedby={state.fieldErrors.city ? "city-error" : undefined}
        />
        {state.fieldErrors.city ? (
          <p id="city-error" className="field-error">
            {state.fieldErrors.city}
          </p>
        ) : null}

        <label htmlFor="province">Provinsi</label>
        <input
          id="province"
          name="province"
          type="text"
          defaultValue={initialValues?.province ?? ""}
          placeholder="Contoh: Jateng"
          aria-invalid={Boolean(state.fieldErrors.province)}
          aria-describedby={state.fieldErrors.province ? "province-error" : undefined}
        />
        {state.fieldErrors.province ? (
          <p id="province-error" className="field-error">
            {state.fieldErrors.province}
          </p>
        ) : null}

        <label htmlFor="postal_code">Kode pos</label>
        <input
          id="postal_code"
          name="postal_code"
          type="text"
          inputMode="numeric"
          defaultValue={initialValues?.postalCode ?? ""}
          placeholder="Contoh: 57466"
          aria-invalid={Boolean(state.fieldErrors.postalCode)}
          aria-describedby={state.fieldErrors.postalCode ? "postal-code-error" : undefined}
        />
        {state.fieldErrors.postalCode ? (
          <p id="postal-code-error" className="field-error">
            {state.fieldErrors.postalCode}
          </p>
        ) : null}

        <SubmitButton />
      </form>
    </>
  );
}
