"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { createPaymentProfileAction, updatePaymentProfileAction } from "./actions";
import { initialPaymentProfileActionState } from "./form-state";

type PaymentProfileFormProps = {
  paymentProfileId?: number;
  initialValues?: {
    paymentMethod?: string | null;
    accountHolderName?: string | null;
    bankName?: string | null;
    accountNumber?: string | null;
    notes?: string | null;
    isDefault?: boolean;
    isActive?: boolean;
  };
  submitLabel?: string;
  pendingLabel?: string;
  onSuccess?: () => void;
};

function SubmitButton({
  submitLabel,
  pendingLabel,
}: {
  submitLabel: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? pendingLabel : submitLabel}
    </button>
  );
}

export function PaymentProfileForm({
  paymentProfileId,
  initialValues,
  submitLabel = "Simpan Payment Profile",
  pendingLabel = "Menyimpan...",
  onSuccess,
}: PaymentProfileFormProps) {
  const action =
    typeof paymentProfileId === "number"
      ? updatePaymentProfileAction.bind(null, paymentProfileId)
      : createPaymentProfileAction;
  const [state, formAction] = useActionState(action, initialPaymentProfileActionState);

  useEffect(() => {
    if (state.status === "success") {
      onSuccess?.();
    }
  }, [onSuccess, state.status]);

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

      <form className="auth-form payment-profile-form" action={formAction} noValidate>
        <label htmlFor="payment_method">Metode pembayaran</label>
        <select
          id="payment_method"
          name="payment_method"
          defaultValue={initialValues?.paymentMethod ?? ""}
          aria-invalid={Boolean(state.fieldErrors.paymentMethod)}
          aria-describedby={state.fieldErrors.paymentMethod ? "payment-method-error" : undefined}
        >
          <option value="" disabled>
            Pilih metode pembayaran
          </option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="virtual_account">Virtual Account</option>
          <option value="ewallet">E-Wallet</option>
          <option value="qris">QRIS</option>
        </select>
        {state.fieldErrors.paymentMethod ? (
          <p id="payment-method-error" className="field-error">
            {state.fieldErrors.paymentMethod}
          </p>
        ) : null}

        <label htmlFor="account_holder_name">Nama pemilik akun</label>
        <input
          id="account_holder_name"
          name="account_holder_name"
          type="text"
          defaultValue={initialValues?.accountHolderName ?? ""}
          placeholder="Contoh: PT Klinik Sejahtera"
          aria-invalid={Boolean(state.fieldErrors.accountHolderName)}
          aria-describedby={
            state.fieldErrors.accountHolderName ? "account-holder-name-error" : undefined
          }
        />
        {state.fieldErrors.accountHolderName ? (
          <p id="account-holder-name-error" className="field-error">
            {state.fieldErrors.accountHolderName}
          </p>
        ) : null}

        <label htmlFor="bank_name">Nama bank</label>
        <input
          id="bank_name"
          name="bank_name"
          type="text"
          defaultValue={initialValues?.bankName ?? ""}
          placeholder="Contoh: BCA"
          aria-invalid={Boolean(state.fieldErrors.bankName)}
          aria-describedby={state.fieldErrors.bankName ? "bank-name-error" : undefined}
        />
        {state.fieldErrors.bankName ? (
          <p id="bank-name-error" className="field-error">
            {state.fieldErrors.bankName}
          </p>
        ) : null}

        <label htmlFor="account_number">Nomor akun</label>
        <input
          id="account_number"
          name="account_number"
          type="text"
          inputMode="numeric"
          defaultValue={initialValues?.accountNumber ?? ""}
          placeholder="Contoh: 1234567890"
          aria-invalid={Boolean(state.fieldErrors.accountNumber)}
          aria-describedby={state.fieldErrors.accountNumber ? "account-number-error" : undefined}
        />
        {state.fieldErrors.accountNumber ? (
          <p id="account-number-error" className="field-error">
            {state.fieldErrors.accountNumber}
          </p>
        ) : null}

        <label htmlFor="notes">Catatan</label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={initialValues?.notes ?? ""}
          placeholder="Tambahkan catatan singkat untuk profile pembayaran ini"
          aria-invalid={Boolean(state.fieldErrors.notes)}
          aria-describedby={state.fieldErrors.notes ? "notes-error" : "notes-hint"}
        />
        <p id="notes-hint" className="field-hint">
          Catatan ini akan membantu Anda mengenali profil default saat konfirmasi pembayaran.
        </p>
        {state.fieldErrors.notes ? (
          <p id="notes-error" className="field-error">
            {state.fieldErrors.notes}
          </p>
        ) : null}

        <label className="payment-profile-checkbox">
          <input
            type="checkbox"
            name="is_default"
            defaultChecked={initialValues?.isDefault ?? true}
          />
          <span>Jadikan sebagai profile default</span>
        </label>

        <label className="payment-profile-checkbox">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={initialValues?.isActive ?? true}
          />
          <span>Aktifkan profile ini</span>
        </label>

        <SubmitButton submitLabel={submitLabel} pendingLabel={pendingLabel} />
      </form>
    </>
  );
}
