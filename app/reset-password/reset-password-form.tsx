"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { resetPasswordAction } from "./actions";
import { initialResetPasswordActionState } from "./form-state";

type ResetPasswordFormProps = {
  email: string;
  token: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Memproses..." : "Simpan Password Baru"}
    </button>
  );
}

export function ResetPasswordForm({
  email,
  token,
}: ResetPasswordFormProps) {
  const [state, formAction] = useActionState(
    resetPasswordAction,
    initialResetPasswordActionState,
  );

  return (
    <>
      {state.message ? (
        <p
          className={`auth-message ${
            state.status === "success"
              ? "auth-message-success"
              : "auth-message-error"
          }`}
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </p>
      ) : null}

      <form className="auth-form" action={formAction} noValidate>
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="token" value={token} />

        <label htmlFor="password">Password baru</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Buat password minimal 8 karakter"
          aria-invalid={Boolean(state.fieldErrors.password)}
          aria-describedby={state.fieldErrors.password ? "password-error" : undefined}
        />
        {state.fieldErrors.password ? (
          <p id="password-error" className="field-error">
            {state.fieldErrors.password}
          </p>
        ) : null}

        <label htmlFor="confirm-password">Konfirmasi password baru</label>
        <input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          placeholder="Ulangi password baru Anda"
          aria-invalid={Boolean(state.fieldErrors.confirmPassword)}
          aria-describedby={
            state.fieldErrors.confirmPassword ? "confirm-password-error" : undefined
          }
        />
        {state.fieldErrors.confirmPassword ? (
          <p id="confirm-password-error" className="field-error">
            {state.fieldErrors.confirmPassword}
          </p>
        ) : null}

        <SubmitButton />
      </form>
    </>
  );
}
