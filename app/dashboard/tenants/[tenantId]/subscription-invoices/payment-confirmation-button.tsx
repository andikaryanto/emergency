"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitSubscriptionInvoicePaymentConfirmationAction } from "./actions";
import { initialSubscriptionInvoicePaymentConfirmationActionState } from "./form-state";

type PaymentConfirmationButtonProps = {
  tenantId: number;
  invoiceId: number;
  amount: number;
  hasExistingConfirmation: boolean;
  paymentConfirmationId?: number | null;
  paymentProfile: {
    id: number;
    displayName: string;
    paymentMethod: string | null;
    accountHolderName: string | null;
    bankName: string | null;
    accountNumber: string | null;
    notes: string | null;
  };
};

function SubmitButton({ hasExistingConfirmation }: { hasExistingConfirmation: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="primary-button tenant-payment-button" disabled={pending}>
      {pending
        ? "Menyimpan Konfirmasi..."
        : hasExistingConfirmation
          ? "Perbarui Konfirmasi"
          : "Kirim Konfirmasi"}
    </button>
  );
}

export function PaymentConfirmationButton({
  tenantId,
  invoiceId,
  amount,
  hasExistingConfirmation,
  paymentConfirmationId,
  paymentProfile,
}: PaymentConfirmationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction] = useActionState(
    submitSubscriptionInvoicePaymentConfirmationAction,
    initialSubscriptionInvoicePaymentConfirmationActionState,
  );

  useEffect(() => {
    if (state.status === "success") {
      setIsOpen(false);
    }
  }, [state.status]);

  return (
    <div className="payment-confirmation-toggle">
      <button
        type="button"
        className="ghost-button payment-profile-toggle-button"
        onClick={() => setIsOpen((value) => !value)}
      >
        {isOpen
          ? "Tutup Form Konfirmasi"
          : hasExistingConfirmation
            ? "Ubah Konfirmasi"
            : "Isi Konfirmasi Pembayaran"}
      </button>

      {isOpen ? (
        <div className="payment-profile-editor">
          <div className="tenant-section-head payment-profile-editor-head">
            <div>
              <span className="eyebrow">Form Konfirmasi</span>
              <h3>Isi data pembayaran</h3>
              <p>Form ini dimuat dari profile default dan masih bisa Anda ubah.</p>
            </div>
          </div>

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
            <input type="hidden" name="tenant_id" value={tenantId} />
            <input type="hidden" name="invoice_id" value={invoiceId} />
            <input type="hidden" name="profile_id" value={paymentProfile.id} />
            <input
              type="hidden"
              name="payment_confirmation_id"
              value={paymentConfirmationId ?? ""}
            />

            <label htmlFor={`profile_label_${invoiceId}`}>Label profile</label>
            <input
              id={`profile_label_${invoiceId}`}
              name="profile_label"
              type="text"
              defaultValue={paymentProfile.displayName}
              placeholder="Contoh: BCA Operasional"
              aria-invalid={Boolean(state.fieldErrors.profileLabel)}
              aria-describedby={
                state.fieldErrors.profileLabel ? `profile-label-error-${invoiceId}` : undefined
              }
            />
            {state.fieldErrors.profileLabel ? (
              <p id={`profile-label-error-${invoiceId}`} className="field-error">
                {state.fieldErrors.profileLabel}
              </p>
            ) : null}

            <label htmlFor={`payment_method_${invoiceId}`}>Metode pembayaran</label>
            <select
              id={`payment_method_${invoiceId}`}
              name="payment_method"
              defaultValue={paymentProfile.paymentMethod ?? ""}
              aria-invalid={Boolean(state.fieldErrors.paymentMethod)}
              aria-describedby={
                state.fieldErrors.paymentMethod ? `payment-method-error-${invoiceId}` : undefined
              }
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
              <p id={`payment-method-error-${invoiceId}`} className="field-error">
                {state.fieldErrors.paymentMethod}
              </p>
            ) : null}

            <label htmlFor={`account_holder_name_${invoiceId}`}>Nama pemilik akun</label>
            <input
              id={`account_holder_name_${invoiceId}`}
              name="account_holder_name"
              type="text"
              defaultValue={paymentProfile.accountHolderName ?? ""}
              placeholder="Contoh: Budi Santoso"
              aria-invalid={Boolean(state.fieldErrors.accountHolderName)}
              aria-describedby={
                state.fieldErrors.accountHolderName
                  ? `account-holder-name-error-${invoiceId}`
                  : undefined
              }
            />
            {state.fieldErrors.accountHolderName ? (
              <p id={`account-holder-name-error-${invoiceId}`} className="field-error">
                {state.fieldErrors.accountHolderName}
              </p>
            ) : null}

            <label htmlFor={`bank_name_${invoiceId}`}>Nama bank</label>
            <input
              id={`bank_name_${invoiceId}`}
              name="bank_name"
              type="text"
              defaultValue={paymentProfile.bankName ?? ""}
              placeholder="Contoh: BCA"
              aria-invalid={Boolean(state.fieldErrors.bankName)}
              aria-describedby={
                state.fieldErrors.bankName ? `bank-name-error-${invoiceId}` : undefined
              }
            />
            {state.fieldErrors.bankName ? (
              <p id={`bank-name-error-${invoiceId}`} className="field-error">
                {state.fieldErrors.bankName}
              </p>
            ) : null}

            <label htmlFor={`account_number_${invoiceId}`}>Nomor akun</label>
            <input
              id={`account_number_${invoiceId}`}
              name="account_number"
              type="text"
              inputMode="numeric"
              defaultValue={paymentProfile.accountNumber ?? ""}
              placeholder="Contoh: 1234567890"
              aria-invalid={Boolean(state.fieldErrors.accountNumber)}
              aria-describedby={
                state.fieldErrors.accountNumber ? `account-number-error-${invoiceId}` : undefined
              }
            />
            {state.fieldErrors.accountNumber ? (
              <p id={`account-number-error-${invoiceId}`} className="field-error">
                {state.fieldErrors.accountNumber}
              </p>
            ) : null}

            <label htmlFor={`transferred_amount_${invoiceId}`}>Nominal transfer</label>
            <input
              id={`transferred_amount_${invoiceId}`}
              name="transferred_amount"
              type="number"
              min="1"
              step="1"
              defaultValue={String(amount)}
              placeholder="Contoh: 150000"
              aria-invalid={Boolean(state.fieldErrors.transferredAmount)}
              aria-describedby={
                state.fieldErrors.transferredAmount
                  ? `transferred-amount-error-${invoiceId}`
                  : `transferred-amount-hint-${invoiceId}`
              }
            />
            <p id={`transferred-amount-hint-${invoiceId}`} className="field-hint">
              Nominal awal mengikuti invoice dan masih bisa Anda ubah.
            </p>
            {state.fieldErrors.transferredAmount ? (
              <p id={`transferred-amount-error-${invoiceId}`} className="field-error">
                {state.fieldErrors.transferredAmount}
              </p>
            ) : null}

            <label htmlFor={`submitted_notes_${invoiceId}`}>Catatan</label>
            <textarea
              id={`submitted_notes_${invoiceId}`}
              name="submitted_notes"
              rows={4}
              defaultValue={paymentProfile.notes ?? ""}
              placeholder="Contoh: transfer via mobile banking"
            />

            <SubmitButton hasExistingConfirmation={hasExistingConfirmation} />
          </form>
        </div>
      ) : null}
    </div>
  );
}
