"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { GoogleSignInButton } from "../../components/auth/google-sign-in-button";
import { registerUserAction } from "./actions";
import { initialRegisterActionState } from "./form-state";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = pending || disabled;
  const label = isDisabled ? "Sedang membuat akun..." : "Buat Akun";

  return (
    <button type="submit" disabled={isDisabled}>
      {label}
    </button>
  );
}

type SignupFormProps = {
  googleSignIn: {
    clientId?: string;
    enabled: boolean;
  };
};

export function SignupForm({ googleSignIn }: SignupFormProps) {
  const [state, formAction] = useActionState(
    registerUserAction,
    initialRegisterActionState,
  );
  const [isAuthBusy, setIsAuthBusy] = useState(false);

  useEffect(() => {
    if (state.status === "error") {
      setIsAuthBusy(false);
    }
  }, [state.status]);

  return (
    <>
      {state.message ? (
        <p className="auth-message auth-message-error" role="alert">
          {state.message}
        </p>
      ) : null}

      <form
        className="auth-form"
        action={formAction}
        noValidate
        onSubmitCapture={() => setIsAuthBusy(true)}
      >
        <label htmlFor="name">Nama</label>
        <input
          id="name"
          name="name"
          type="text"
          readOnly={isAuthBusy}
          aria-disabled={isAuthBusy}
          placeholder="Nama lengkap Anda"
          aria-invalid={Boolean(state.fieldErrors.name)}
          aria-describedby={state.fieldErrors.name ? "name-error" : undefined}
        />
        {state.fieldErrors.name ? (
          <p id="name-error" className="field-error">
            {state.fieldErrors.name}
          </p>
        ) : null}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          readOnly={isAuthBusy}
          aria-disabled={isAuthBusy}
          placeholder="nama@klinikanda.com"
          aria-invalid={Boolean(state.fieldErrors.email)}
          aria-describedby={state.fieldErrors.email ? "email-error" : undefined}
        />
        {state.fieldErrors.email ? (
          <p id="email-error" className="field-error">
            {state.fieldErrors.email}
          </p>
        ) : null}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          readOnly={isAuthBusy}
          aria-disabled={isAuthBusy}
          placeholder="Minimal 8 karakter"
          aria-invalid={Boolean(state.fieldErrors.password)}
          aria-describedby={state.fieldErrors.password ? "password-error" : undefined}
        />
        <p className="field-hint">
          Minimal 8 karakter, wajib ada angka dan karakter spesial, tanpa spasi.
        </p>
        {state.fieldErrors.password ? (
          <p id="password-error" className="field-error">
            {state.fieldErrors.password}
          </p>
        ) : null}

        <label htmlFor="confirm-password">Konfirmasi password</label>
        <input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          readOnly={isAuthBusy}
          aria-disabled={isAuthBusy}
          placeholder="Ulangi password Anda"
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

        <SubmitButton disabled={isAuthBusy} />
      </form>

      <div className="auth-divider" aria-hidden="true">
        <span>atau</span>
      </div>

      <GoogleSignInButton
        clientId={googleSignIn.clientId}
        disabled={isAuthBusy}
        enabled={googleSignIn.enabled}
        mode="signup"
        onPendingChange={setIsAuthBusy}
      />
    </>
  );
}
